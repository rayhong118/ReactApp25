import axios from "axios";

export interface TursoValue {
  type: "null" | "integer" | "float" | "text" | "blob";
  value?: string | number;
}

export interface TursoColumn {
  name: string;
  decltype?: string | null;
}

export interface TursoExecuteResult {
  cols: TursoColumn[];
  rows: TursoValue[][];
}

export interface TursoPipelineResponseItem {
  type: "ok" | "error";
  response?: {
    type: string;
    result: TursoExecuteResult;
  };
  error?: {
    message: string;
    code?: string;
  };
}

export interface TursoPipelineResponse {
  results: TursoPipelineResponseItem[];
}

export function normalizeTursoHttpUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim().replace(/\/+$/, "");
  if (trimmed.startsWith("libsql://")) {
    return trimmed.replace(/^libsql:\/\//, "https://");
  }
  return trimmed;
}

export function parseTursoRows<T = Record<string, unknown>>(
  result: TursoExecuteResult,
): T[] {
  const colNames = result.cols.map((col) => col.name);
  return result.rows.map((row) => {
    const obj: Record<string, unknown> = {};
    row.forEach((cell, idx) => {
      const colName = colNames[idx];
      if (!colName) return;
      if (cell.type === "null" || cell.value === undefined) {
        obj[colName] = null;
      } else if (cell.type === "integer") {
        obj[colName] = Number(cell.value);
      } else if (cell.type === "float") {
        obj[colName] = Number(cell.value);
      } else {
        obj[colName] = cell.value;
      }
    });
    return obj as T;
  });
}

export async function executeTursoPipeline(
  statements: string[],
  tursoUrl?: string,
  tursoToken?: string,
): Promise<TursoExecuteResult[]> {
  const dbUrl = tursoUrl || process.env.TURSO_DATABASE_URL;
  const authToken = tursoToken || process.env.TURSO_AUTH_TOKEN;

  if (!dbUrl || !authToken) {
    throw new Error(
      "TURSO_DATABASE_URL or TURSO_AUTH_TOKEN is not configured in environment.",
    );
  }

  const endpoint = `${normalizeTursoHttpUrl(dbUrl)}/v2/pipeline`;
  const requests = [
    ...statements.map((sql) => ({
      type: "execute",
      stmt: { sql },
    })),
    { type: "close" },
  ];

  const response = await axios.post<TursoPipelineResponse>(
    endpoint,
    { requests },
    {
      headers: {
        Authorization: `Bearer ${authToken.trim()}`,
        "Content-Type": "application/json",
      },
      timeout: 15000,
    },
  );

  const results: TursoExecuteResult[] = [];
  for (let i = 0; i < statements.length; i++) {
    const item = response.data.results[i];
    if (!item) {
      throw new Error(`Missing Turso pipeline result for statement index ${i}`);
    }
    if (item.type === "error") {
      throw new Error(
        `Turso SQL error: ${item.error?.message || "Unknown error"}`,
      );
    }
    if (item.response?.result) {
      results.push(item.response.result);
    }
  }

  return results;
}

