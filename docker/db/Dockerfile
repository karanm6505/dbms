FROM mysql:8.0

# Ensure scripts directory exists
RUN mkdir -p /docker-entrypoint-initdb.d/sql

# Copy initialization scripts
COPY docker/db/init/ /docker-entrypoint-initdb.d/
COPY library_setup.sql ddl_dml.sql functions.sql triggers.sql procedures.sql /docker-entrypoint-initdb.d/sql/

EXPOSE 3306
