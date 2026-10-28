import {
  faBookOpen,
  faCheck,
  faCopy,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ILocalLlmContext, ILocalLlmTask } from "@shared/types";
import React, { useMemo, useState } from "react";
import { toLocalDate } from "./LocalLlmTaskItem";

export interface LocalLlmContextListProps {
  contexts: ILocalLlmContext[];
  tasks: ILocalLlmTask[];
}

export const LocalLlmContextList: React.FC<LocalLlmContextListProps> = ({
  contexts,
  tasks,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const taskUsageCountMap = useMemo(() => {
    const map = new Map<number, number>();
    for (const task of tasks) {
      if (!task.contexts) continue;
      for (const ctx of task.contexts) {
        map.set(ctx.id, (map.get(ctx.id) || 0) + 1);
      }
    }
    return map;
  }, [tasks]);

  const filteredContexts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return contexts;
    return contexts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.content.toLowerCase().includes(q),
    );
  }, [contexts, searchQuery]);

  const handleCopyContext = async (ctx: ILocalLlmContext) => {
    try {
      await navigator.clipboard.writeText(ctx.content);
      setCopiedId(ctx.id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = ctx.content;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopiedId(ctx.id);
      setTimeout(() => setCopiedId(null), 1500);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        className={
          "flex flex-col sm:flex-row items-stretch sm:items-center justify-between " +
          "gap-3 bg-surface-card p-3.5 rounded-xl border border-stone-200 dark:border-stone-800"
        }
      >
        <div className="flex items-center gap-2">
          <FontAwesomeIcon
            icon={faBookOpen}
            className="text-brand-primary text-sm"
          />
          <span className="text-sm font-semibold text-foreground">
            Reference Contexts ({contexts.length})
          </span>
        </div>

        <div className="relative w-full sm:w-80">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contexts by name or content..."
            className={
              "w-full pl-8 pr-3 py-1.5 text-sm rounded-lg border border-stone-200 " +
              "dark:border-stone-700 bg-background text-foreground " +
              "focus:outline-none focus:border-brand-primary"
            }
          />
        </div>
      </div>

      {filteredContexts.length === 0 ? (
        <div
          className={
            "p-10 text-center text-sm text-stone-400 rounded-xl border border-dashed " +
            "border-stone-300 dark:border-stone-700 bg-surface-card"
          }
        >
          No reference contexts found.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredContexts.map((ctx) => {
            const usageCount = taskUsageCountMap.get(ctx.id) || 0;
            const isCopied = copiedId === ctx.id;
            return (
              <div
                key={ctx.id}
                className={
                  "p-5 rounded-xl bg-surface-card border border-stone-200 " +
                  "dark:border-stone-800 hover:border-brand-primary/50 transition-all shadow-sm"
                }
              >
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-foreground m-0">
                      {ctx.name}
                    </h3>
                    <span
                      className={
                        "px-2.5 py-0.5 rounded-full text-[11px] font-semibold " +
                        "bg-brand-light dark:bg-brand-soft text-brand-vibrant " +
                        "dark:text-brand-primary border border-brand-primary/30"
                      }
                    >
                      Used in {usageCount} {usageCount === 1 ? "task" : "tasks"}
                    </span>
                    <span className="text-xs text-stone-400 font-mono">
                      #{ctx.id}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyContext(ctx)}
                    className={
                      "px-3 py-1 rounded-md text-xs font-medium border transition-colors " +
                      "inline-flex items-center gap-1.5 cursor-pointer " +
                      (isCopied
                        ? "border-green-500 text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950/40"
                        : "border-stone-200 dark:border-stone-700 text-stone-600 " +
                          "dark:text-stone-300 hover:border-brand-primary hover:text-brand-vibrant")
                    }
                    title="Copy context content"
                  >
                    <FontAwesomeIcon icon={isCopied ? faCheck : faCopy} />
                    {isCopied ? "Copied!" : "Copy"}
                  </button>
                </div>

                <div
                  className={
                    "text-sm text-stone-700 dark:text-stone-300 whitespace-pre-wrap " +
                    "leading-relaxed bg-stone-50 dark:bg-stone-900/60 p-3.5 rounded-lg " +
                    "border border-stone-100 dark:border-stone-800 mb-2"
                  }
                >
                  {ctx.content}
                </div>

                <div className="text-xs text-stone-400">
                  Created: {toLocalDate(ctx.created_at).toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
