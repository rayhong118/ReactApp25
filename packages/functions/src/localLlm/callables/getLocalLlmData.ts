import { HttpsError, onCall } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {
  executeTursoPipeline,
  parseTursoRows,
} from "../tursoClient";

interface RawContextRow {
  id: number;
  name: string;
  content: string;
  created_at: string;
}

interface RawTaskRow {
  id: number;
  prompt: string;
  status: string;
  frequency: string;
  hour_of_day: number | null;
  day_of_week: number | null;
  day_of_month: number | null;
  weekday_only: number | boolean | null;
  next_run_at: string | null;
  started_at: string | null;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
  silent_if_no_result: number | boolean | null;
  max_history_runs: number | null;
}

interface RawTaskContextRow {
  task_id: number;
  context_id: number;
}

interface RawOutputRow {
  id: number;
  task_id: number;
  content: string;
  created_at: string;
}

const TASKS_QUERY = [
  "SELECT id, prompt, status, frequency, hour_of_day, day_of_week,",
  "day_of_month, weekday_only, next_run_at, started_at, parent_id,",
  "created_at, updated_at, silent_if_no_result, max_history_runs",
  "FROM tasks ORDER BY created_at DESC",
].join(" ");

export async function fetchLocalLlmDataFromTurso() {
  const statements = [
    "SELECT id, name, content, created_at FROM contexts ORDER BY id ASC",
    TASKS_QUERY,
    "SELECT task_id, context_id FROM task_contexts",
    "SELECT id, task_id, content, created_at FROM outputs ORDER BY id ASC",
  ];

  const [contextsRes, tasksRes, taskContextsRes, outputsRes] =
    await executeTursoPipeline(statements);

  const contexts = parseTursoRows<RawContextRow>(contextsRes);
  const rawTasks = parseTursoRows<RawTaskRow>(tasksRes);
  const taskContexts = parseTursoRows<RawTaskContextRow>(taskContextsRes);
  const outputs = parseTursoRows<RawOutputRow>(outputsRes);

  const contextById = new Map<number, RawContextRow>();
  for (const ctx of contexts) {
    contextById.set(ctx.id, ctx);
  }

  const contextsByTaskId = new Map<number, RawContextRow[]>();
  for (const tc of taskContexts) {
    const ctx = contextById.get(tc.context_id);
    if (!ctx) continue;
    const list = contextsByTaskId.get(tc.task_id) || [];
    list.push(ctx);
    contextsByTaskId.set(tc.task_id, list);
  }

  const outputsByTaskId = new Map<number, RawOutputRow[]>();
  for (const out of outputs) {
    const list = outputsByTaskId.get(out.task_id) || [];
    list.push(out);
    outputsByTaskId.set(out.task_id, list);
  }

  const tasks = rawTasks.map((t) => ({
    id: t.id,
    prompt: t.prompt,
    status: t.status,
    frequency: t.frequency,
    hour_of_day: t.hour_of_day,
    day_of_week: t.day_of_week,
    day_of_month: t.day_of_month,
    weekday_only: Boolean(t.weekday_only),
    silent_if_no_result: Boolean(t.silent_if_no_result),
    max_history_runs: t.max_history_runs,
    next_run_at: t.next_run_at,
    started_at: t.started_at,
    parent_id: t.parent_id,
    created_at: t.created_at,
    updated_at: t.updated_at,
    contexts: contextsByTaskId.get(t.id) || [],
    outputs: outputsByTaskId.get(t.id) || [],
  }));

  return {
    tasks,
    contexts,
  };
}

export const getLocalLlmData = onCall(
  {
    cors: true,
  },
  async () => {
    try {
      return await fetchLocalLlmDataFromTurso();
    } catch (error) {
      logger.error("Failed to fetch LocalLLM data from Turso:", error);
      throw new HttpsError(
        "internal",
        error instanceof Error
          ? error.message
          : "Failed to fetch LocalLLM data",
      );
    }
  },
);
