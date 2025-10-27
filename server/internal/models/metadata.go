package models

type SchemaTable struct {
	Name string `json:"name"`
}

type DbRoutine struct {
	Name string `json:"name"`
}

type DbTrigger struct {
	Name      string `json:"name"`
	Event     string `json:"event"`
	TableName string `json:"table"`
	Timing    string `json:"timing"`
}
