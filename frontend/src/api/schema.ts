import { apiClient } from "./client";
import {
  DbRoutine,
  DbTrigger,
  FunctionExecutionResult,
  ProcedureExecutionResult,
  SchemaTable,
} from "../types";

export const schemaApi = {
  getTables(): Promise<SchemaTable[]> {
    return apiClient.get<SchemaTable[]>("/api/schema/tables");
  },

  getFunctions(): Promise<DbRoutine[]> {
    return apiClient.get<DbRoutine[]>("/api/schema/functions");
  },

  getProcedures(): Promise<DbRoutine[]> {
    return apiClient.get<DbRoutine[]>("/api/schema/procedures");
  },

  getTriggers(): Promise<DbTrigger[]> {
    return apiClient.get<DbTrigger[]>("/api/schema/triggers");
  },

  executeFunction(name: string, args: unknown[]): Promise<FunctionExecutionResult> {
    return apiClient.post<FunctionExecutionResult>(
      `/api/schema/functions/${encodeURIComponent(name)}/execute`,
      { arguments: args }
    );
  },

  executeProcedure(
    name: string,
    args: unknown[]
  ): Promise<ProcedureExecutionResult> {
    return apiClient.post<ProcedureExecutionResult>(
      `/api/schema/procedures/${encodeURIComponent(name)}/execute`,
      { arguments: args }
    );
  },
};
