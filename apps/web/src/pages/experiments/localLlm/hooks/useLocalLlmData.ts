import { tursoAuthToken, tursoDatabaseUrl } from "@/apikeys";
import { firebaseFunctions } from "@/firebase";
import type {
  ILocalLlmContext,
  ILocalLlmDashboardData,
  ILocalLlmTask,
} from "@shared/types";
import { useQuery } from "@tanstack/react-query";
import { httpsCallable } from "firebase/functions";

interface TursoCell {
  type: "null" | "integer" | "float" | "text" | "blob";
  value?: string | number;
}

interface TursoExecResult {
  cols: { name: string }[];
  rows: TursoCell[][];
}

interface TursoPipelineItem {
  type: "ok" | "error";
  error?: { message?: string };
  response?: { result: TursoExecResult };
}

interface RawTursoTask
  extends Omit<
    ILocalLlmTask,
    "contexts" | "outputs" | "weekday_only" | "silent_if_no_result"
  > {
  weekday_only: number | boolean | null;
  silent_if_no_result: number | boolean | null;
}

function parseRows<T>(result: TursoExecResult): T[] {
  const cols = result.cols.map((c) => c.name);
  return result.rows.map((row) => {
    const obj: Record<string, unknown> = {};
    row.forEach((cell, i) => {
      const col = cols[i];
      if (!col) return;
      if (cell.type === "null" || cell.value === undefined) {
        obj[col] = null;
      } else if (cell.type === "integer" || cell.type === "float") {
        obj[col] = Number(cell.value);
      } else {
        obj[col] = cell.value;
      }
    });
    return obj as T;
  });
}

async function fetchDirectFromTursoEnv(): Promise<ILocalLlmDashboardData> {
  const rawUrl = (tursoDatabaseUrl ||
    import.meta.env.TURSO_DATABASE_URL ||
    import.meta.env.VITE_TURSO_DATABASE_URL) as string | undefined;
  const token = (tursoAuthToken ||
    import.meta.env.TURSO_AUTH_TOKEN ||
    import.meta.env.VITE_TURSO_AUTH_TOKEN) as string | undefined;
  if (!rawUrl || !token) {
    throw new Error("TURSO_DATABASE_URL or TURSO_AUTH_TOKEN not set");
  }

  const httpUrl = rawUrl
    .trim()
    .replace(/\/+$/, "")
    .replace(/^libsql:\/\//, "https://");

  const statements = [
    "SELECT id, name, content, created_at FROM contexts ORDER BY id ASC",
    [
      "SELECT id, prompt, status, frequency, hour_of_day, day_of_week,",
      "day_of_month, weekday_only, next_run_at, started_at, parent_id,",
      "created_at, updated_at, silent_if_no_result, max_history_runs",
      "FROM tasks ORDER BY created_at DESC",
    ].join(" "),
    "SELECT task_id, context_id FROM task_contexts",
    "SELECT id, task_id, content, created_at FROM outputs ORDER BY id ASC",
  ];

  const res = await fetch(`${httpUrl}/v2/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.trim()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      requests: [
        ...statements.map((sql) => ({ type: "execute", stmt: { sql } })),
        { type: "close" },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`Turso HTTP error ${res.status}`);
  }

  const body = (await res.json()) as { results: TursoPipelineItem[] };
  const results = body.results.slice(0, 4).map((r) => {
    if (r.type === "error" || !r.response?.result) {
      throw new Error(r.error?.message || "Turso query error");
    }
    return r.response.result;
  });

  const contexts = parseRows<ILocalLlmContext>(results[0]);
  const rawTasks = parseRows<RawTursoTask>(results[1]);
  const taskContexts = parseRows<{ task_id: number; context_id: number }>(
    results[2],
  );
  const outputs = parseRows<{
    id: number;
    task_id: number;
    content: string;
    created_at: string;
  }>(results[3]);

  const contextById = new Map(contexts.map((c) => [c.id, c]));
  const contextsByTaskId = new Map<number, ILocalLlmContext[]>();
  for (const tc of taskContexts) {
    const ctx = contextById.get(tc.context_id);
    if (!ctx) continue;
    const list = contextsByTaskId.get(tc.task_id) || [];
    list.push(ctx);
    contextsByTaskId.set(tc.task_id, list);
  }

  const outputsByTaskId = new Map<number, typeof outputs>();
  for (const out of outputs) {
    const list = outputsByTaskId.get(out.task_id) || [];
    list.push(out);
    outputsByTaskId.set(out.task_id, list);
  }

  const tasks: ILocalLlmTask[] = rawTasks.map((t) => ({
    ...t,
    weekday_only: Boolean(t.weekday_only),
    silent_if_no_result: Boolean(t.silent_if_no_result),
    contexts: contextsByTaskId.get(t.id) || [],
    outputs: outputsByTaskId.get(t.id) || [],
  }));

  return { tasks, contexts };
}

async function fetchFromLocalFastApi(): Promise<ILocalLlmDashboardData> {
  const [tasksRes, contextsRes] = await Promise.all([
    fetch("http://localhost:8000/tasks"),
    fetch("http://localhost:8000/contexts"),
  ]);

  if (!tasksRes.ok || !contextsRes.ok) {
    throw new Error("Local FastAPI backend responded with an error");
  }

  const [tasks, contexts] = await Promise.all([
    tasksRes.json() as Promise<ILocalLlmTask[]>,
    contextsRes.json() as Promise<ILocalLlmContext[]>,
  ]);

  return { tasks, contexts };
}

export const useLocalLlmData = () => {
  return useQuery<ILocalLlmDashboardData>({
    queryKey: ["localLlmData"],
    queryFn: async () => {
      try {
        return await fetchDirectFromTursoEnv();
      } catch (tursoEnvError) {
        try {
          const getLocalLlmDataCallable = httpsCallable<
            void,
            ILocalLlmDashboardData
          >(firebaseFunctions, "getLocalLlmData");
          const result = await getLocalLlmDataCallable();
          return result.data;
        } catch {
          try {
            return await fetchFromLocalFastApi();
          } catch {
            throw tursoEnvError;
          }
        }
      }
    },
    staleTime: 30 * 1000,
    retry: 1,
  });
};
