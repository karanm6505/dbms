package repository

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"regexp"

	"github.com/karanm6505/dbms/server/internal/models"
)

var identifierRegex = regexp.MustCompile(`^[a-zA-Z_][a-zA-Z0-9_]*$`)

var ErrInvalidIdentifier = errors.New("invalid identifier")

type MetadataRepository struct {
	db     *sql.DB
	dbName string
}

func NewMetadataRepository(db *sql.DB, dbName string) *MetadataRepository {
	return &MetadataRepository{db: db, dbName: dbName}
}

func (r *MetadataRepository) ListTables(ctx context.Context) ([]models.SchemaTable, error) {
	const query = `
		SELECT TABLE_NAME
		FROM information_schema.tables
		WHERE TABLE_SCHEMA = ?
		ORDER BY TABLE_NAME
	`

	rows, err := r.db.QueryContext(ctx, query, r.dbName)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	tables := make([]models.SchemaTable, 0)

	for rows.Next() {
		var table models.SchemaTable
		if err := rows.Scan(&table.Name); err != nil {
			return nil, err
		}
		tables = append(tables, table)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return tables, nil
}

func (r *MetadataRepository) ListFunctions(ctx context.Context) ([]models.DbRoutine, error) {
	const query = `
		SELECT ROUTINE_NAME
		FROM information_schema.routines
		WHERE ROUTINE_SCHEMA = ? AND ROUTINE_TYPE = 'FUNCTION'
		ORDER BY ROUTINE_NAME
	`

	rows, err := r.db.QueryContext(ctx, query, r.dbName)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return scanRoutines(rows)
}

func (r *MetadataRepository) ListProcedures(ctx context.Context) ([]models.DbRoutine, error) {
	const query = `
		SELECT ROUTINE_NAME
		FROM information_schema.routines
		WHERE ROUTINE_SCHEMA = ? AND ROUTINE_TYPE = 'PROCEDURE'
		ORDER BY ROUTINE_NAME
	`

	rows, err := r.db.QueryContext(ctx, query, r.dbName)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return scanRoutines(rows)
}

func (r *MetadataRepository) ListTriggers(ctx context.Context) ([]models.DbTrigger, error) {
	const query = `
		SELECT TRIGGER_NAME, EVENT_MANIPULATION, EVENT_OBJECT_TABLE, ACTION_TIMING
		FROM information_schema.triggers
		WHERE TRIGGER_SCHEMA = ?
		ORDER BY TRIGGER_NAME
	`

	rows, err := r.db.QueryContext(ctx, query, r.dbName)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	triggers := make([]models.DbTrigger, 0)

	for rows.Next() {
		var trigger models.DbTrigger
		if err := rows.Scan(&trigger.Name, &trigger.Event, &trigger.TableName, &trigger.Timing); err != nil {
			return nil, err
		}
		triggers = append(triggers, trigger)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return triggers, nil
}

func (r *MetadataRepository) ExecuteProcedure(ctx context.Context, name string, args []any) ([]map[string]any, error) {
	if !isValidIdentifier(name) {
		return nil, ErrInvalidIdentifier
	}

	query := buildCallableQuery("CALL", name, len(args))

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return scanAllResultSets(rows)
}

func (r *MetadataRepository) ExecuteFunction(ctx context.Context, name string, args []any) (any, error) {
	if !isValidIdentifier(name) {
		return nil, ErrInvalidIdentifier
	}

	var query string
	if len(args) == 0 {
		query = fmt.Sprintf("SELECT %s() AS result", name)
	} else {
		placeholders := buildPlaceholders(len(args))
		query = fmt.Sprintf("SELECT %s(%s) AS result", name, placeholders)
	}

	row := r.db.QueryRowContext(ctx, query, args...)

	var result any
	if err := row.Scan(&result); err != nil {
		return nil, err
	}

	return normalizeDBValue(result), nil
}

func scanRoutines(rows *sql.Rows) ([]models.DbRoutine, error) {
	routines := make([]models.DbRoutine, 0)

	for rows.Next() {
		var routine models.DbRoutine
		if err := rows.Scan(&routine.Name); err != nil {
			return nil, err
		}
		routines = append(routines, routine)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return routines, nil
}

func scanAllResultSets(rows *sql.Rows) ([]map[string]any, error) {
	results := make([]map[string]any, 0)

	for {
		setRows, err := scanSingleResultSet(rows)
		if err != nil {
			return nil, err
		}
		results = append(results, setRows...)

		hasNext := rows.NextResultSet()
		if !hasNext {
			break
		}
	}

	return results, nil
}

func scanSingleResultSet(rows *sql.Rows) ([]map[string]any, error) {
	columns, err := rows.Columns()
	if err != nil {
		return nil, err
	}

	values := make([]any, len(columns))
	scanArgs := make([]any, len(columns))
	for i := range values {
		scanArgs[i] = &values[i]
	}

	result := make([]map[string]any, 0)

	for rows.Next() {
		if err := rows.Scan(scanArgs...); err != nil {
			return nil, err
		}

		rowMap := make(map[string]any, len(columns))
		for i, col := range columns {
			rowMap[col] = normalizeDBValue(values[i])
		}
		result = append(result, rowMap)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return result, nil
}

func isValidIdentifier(s string) bool {
	return identifierRegex.MatchString(s)
}

func buildCallableQuery(prefix, name string, argCount int) string {
	if prefix != "CALL" {
		return ""
	}

	if argCount == 0 {
		return fmt.Sprintf("CALL %s()", name)
	}

	return fmt.Sprintf("CALL %s(%s)", name, buildPlaceholders(argCount))
}

func buildPlaceholders(count int) string {
	if count <= 0 {
		return ""
	}

	placeholders := "?"
	for i := 1; i < count; i++ {
		placeholders += ",?"
	}
	return placeholders
}

func normalizeDBValue(value any) any {
	switch v := value.(type) {
	case nil:
		return nil
	case []byte:
		return string(v)
	default:
		return v
	}
}
