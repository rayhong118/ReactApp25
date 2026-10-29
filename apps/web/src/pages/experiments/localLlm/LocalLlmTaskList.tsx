import {
  faChevronLeft,
  faChevronRight,
  faClockRotateLeft,
  faListCheck,
  faMagnifyingGlass,
  faRotate,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ILocalLlmTask } from "@shared/types";
import React, { useEffect, useMemo, useState } from "react";
import { LocalLlmTaskItem, toLocalDate } from "./LocalLlmTaskItem";

export interface LocalLlmTaskListProps {
  tasks: ILocalLlmTask[];
}

export const LocalLlmTaskList: React.FC<LocalLlmTaskListProps> = ({
  tasks,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const itemsPerPage = 20;

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        t.prompt.toLowerCase().includes(q) ||
        String(t.id) === q ||
        (t.contexts &&
          t.contexts.some((c) => c.name.toLowerCase().includes(q)));

      const matchesStatus =
        statusFilter === "ALL" ||
        t.status === statusFilter ||
        (statusFilter === "RECURRING" && t.frequency !== "ONCE");

      return matchesSearch && matchesStatus;
    });
  }, [tasks, searchQuery, statusFilter]);

  const recurring = useMemo(
    () => filteredTasks.filter((t) => t.frequency !== "ONCE"),
    [filteredTasks],
  );

  const pending = useMemo(
    () =>
      [...filteredTasks]
        .filter(
          (t) =>
            t.frequency === "ONCE" &&
            (t.status === "PENDING" ||
              t.status === "RUNNING" ||
              t.status === "CANCELLED"),
        )
        .sort(
          (a, b) =>
            toLocalDate(a.created_at).getTime() -
            toLocalDate(b.created_at).getTime(),
        ),
    [filteredTasks],
  );

  const history = useMemo(
    () =>
      [...filteredTasks]
        .filter(
          (t) =>
            t.frequency === "ONCE" &&
            (t.status === "COMPLETED" ||
              t.status === "SUCCESS" ||
              t.status === "PARTIAL_SUCCESS" ||
              t.status === "NO_RESULT" ||
              t.status === "FAILED"),
        )
        .sort(
          (a, b) =>
            toLocalDate(b.started_at || b.created_at).getTime() -
            toLocalDate(a.started_at || a.created_at).getTime(),
        ),
    [filteredTasks],
  );

  const totalPages = Math.ceil(history.length / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [history.length, totalPages, currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedHistory = history.slice(startIndex, startIndex + itemsPerPage);

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      const isCurrent = currentPage === i;
      pages.push(
        <button
          key={i}
          type="button"
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors cursor-pointer ${
            isCurrent
              ? "bg-brand-primary text-white border-brand-primary"
              : "bg-surface-card text-foreground border-stone-200 " +
                "dark:border-stone-700 hover:border-brand-primary hover:text-brand-vibrant"
          }`}
        >
          {i}
        </button>,
      );
    }
    return pages;
  };

  const sectionTitleStyle =
    "flex items-center gap-2 text-xs font-bold uppercase " +
    "tracking-wider text-stone-500 dark:text-stone-400 mb-3";

  const pageNavButtonStyle =
    "px-3 py-1.5 rounded-md border border-stone-200 dark:border-stone-700 " +
    "bg-surface-card text-foreground disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed";

  return (
    <div className="flex flex-col gap-6">
      {/* Search & Status Filter Bar */}
      <div
        className={
          "flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between " +
          "bg-surface-card p-3.5 rounded-xl border border-stone-200 dark:border-stone-800"
        }
      >
        <div className="relative flex-1">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Filter tasks by prompt, #id, or context name..."
            className={
              "w-full pl-8 pr-3 py-1.5 text-sm rounded-lg border border-stone-200 " +
              "dark:border-stone-700 bg-background text-foreground " +
              "focus:outline-none focus:border-brand-primary"
            }
          />
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor="local-llm-status-filter"
            className="text-xs font-semibold text-stone-500 whitespace-nowrap"
          >
            Status:
          </label>
          <select
            id="local-llm-status-filter"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className={
              "px-3 py-1.5 text-xs font-medium rounded-lg border border-stone-200 " +
              "dark:border-stone-700 bg-background text-foreground " +
              "focus:outline-none focus:border-brand-primary"
            }
          >
            <option value="ALL">All Tasks ({tasks.length})</option>
            <option value="RECURRING">Recurring Only</option>
            <option value="SUCCESS">Success</option>
            <option value="PARTIAL_SUCCESS">Partial Success</option>
            <option value="NO_RESULT">No Result</option>
            <option value="FAILED">Failed</option>
            <option value="PENDING">Pending / Queued</option>
            <option value="RUNNING">Running</option>
          </select>
        </div>
      </div>

      {/* Recurring Tasks Section */}
      {recurring.length > 0 && (
        <section>
          <div className={sectionTitleStyle}>
            <FontAwesomeIcon icon={faRotate} />
            <span>Recurring Tasks</span>
            <span className="px-2 py-0.5 rounded-md bg-stone-200 dark:bg-stone-800 text-foreground text-[11px]">
              {recurring.length}
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {recurring.map((t) => {
              const isChildRunning = tasks.some(
                (other) =>
                  other.parent_id === t.id && other.status === "RUNNING",
              );
              const isChildPending = tasks.some(
                (other) =>
                  other.parent_id === t.id && other.status === "PENDING",
              );

              let runStage: "IDLE" | "STARTING" | "QUEUED" | "RUNNING" = "IDLE";
              if (isChildRunning) {
                runStage = "RUNNING";
              } else if (isChildPending) {
                runStage = "QUEUED";
              }

              return (
                <LocalLlmTaskItem
                  key={t.id}
                  task={t}
                  isRecurringRunning={
                    runStage === "RUNNING" || runStage === "QUEUED"
                  }
                  runStage={runStage}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* Pending Queue Section */}
      {pending.length > 0 && (
        <section>
          <div className={sectionTitleStyle}>
            <FontAwesomeIcon icon={faListCheck} />
            <span>Pending Queue</span>
            <span className="px-2 py-0.5 rounded-md bg-stone-200 dark:bg-stone-800 text-foreground text-[11px]">
              {pending.length}
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {pending.map((t) => (
              <LocalLlmTaskItem
                key={t.id}
                task={t}
                runStage={
                  t.status === "RUNNING"
                    ? "RUNNING"
                    : t.status === "PENDING"
                      ? "QUEUED"
                      : "IDLE"
                }
              />
            ))}
          </div>
        </section>
      )}

      {/* Completed History Section */}
      <section>
        <div className={sectionTitleStyle}>
          <FontAwesomeIcon icon={faClockRotateLeft} />
          <span>Completed History</span>
          <span className="px-2 py-0.5 rounded-md bg-stone-200 dark:bg-stone-800 text-foreground text-[11px]">
            {history.length}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {history.length === 0 ? (
            <div
              className={
                "p-10 text-center text-sm text-stone-400 rounded-xl border " +
                "border-dashed border-stone-300 dark:border-stone-700 bg-surface-card"
              }
            >
              No completed task history matching current filters.
            </div>
          ) : (
            paginatedHistory.map((t) => (
              <LocalLlmTaskItem key={t.id} task={t} runStage="IDLE" />
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div
            className={
              "flex justify-center items-center gap-2 mt-8 pt-4 " +
              "border-t border-stone-200 dark:border-stone-800"
            }
          >
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={pageNavButtonStyle}
              aria-label="Previous page"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
            </button>

            <div className="flex gap-1.5 items-center">
              {renderPageNumbers()}
            </div>

            <button
              type="button"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={pageNavButtonStyle}
              aria-label="Next page"
            >
              <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
