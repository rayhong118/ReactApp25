import {
  faBellSlash,
  faBookOpen,
  faCalendarDays,
  faCheck,
  faChevronDown,
  faChevronUp,
  faClock,
  faClockRotateLeft,
  faCopy,
  faRoad,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ILocalLlmContext, ILocalLlmTask } from "@shared/types";
import React, { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";

interface WsdotMapAlertItem {
  AlertID?: number;
  Headline?: string;
  Roadway?: string;
  Direction?: string;
  Priority?: string;
  Category?: string;
  StartTime?: string;
  Latitude?: number;
  Longitude?: number;
}

export interface LocalLlmTaskItemProps {
  task: ILocalLlmTask;
  runStage?: "IDLE" | "STARTING" | "QUEUED" | "RUNNING";
  isRecurringRunning?: boolean;
}

export const toLocalDate = (dateStr: string | null): Date => {
  if (!dateStr) return new Date();
  const normalized = dateStr.includes("T")
    ? dateStr
    : dateStr.replace(" ", "T");
  if (!normalized.endsWith("Z") && !/[+-]\d{2}(?::?\d{2})?$/.test(normalized)) {
    return new Date(normalized + "Z");
  }
  return new Date(normalized);
};

export const LocalLlmTaskItem: React.FC<LocalLlmTaskItemProps> = ({
  task,
  runStage = "IDLE",
  isRecurringRunning = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedContext, setSelectedContext] =
    useState<ILocalLlmContext | null>(null);

  const tzAbbreviation = useMemo(() => {
    return (
      new Intl.DateTimeFormat("en-US", { timeZoneName: "short" })
        .formatToParts(new Date())
        .find((p) => p.type === "timeZoneName")?.value || ""
    );
  }, []);

  const handleCopyPrompt = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(task.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = task.prompt;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const formatSchedule = (t: ILocalLlmTask) => {
    const hh = String(t.hour_of_day ?? 0).padStart(2, "0") + ":00";
    if (t.frequency === "DAILY") {
      return t.weekday_only
        ? `Every weekday (Mon-Fri) at ${hh}`
        : `Every day at ${hh}`;
    }
    if (t.frequency === "WEEKLY") {
      const days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];
      const dayName = days[t.day_of_week ?? 0] || "Monday";
      return `Every week on ${dayName} at ${hh}`;
    }
    if (t.frequency === "MONTHLY") {
      const d = t.day_of_month ?? 1;
      const suffix =
        d % 10 === 1 && d !== 11
          ? "st"
          : d % 10 === 2 && d !== 12
            ? "nd"
            : d % 10 === 3 && d !== 13
              ? "rd"
              : "th";
      return `Day ${d}${suffix} of every month at ${hh}`;
    }
    return "";
  };

  const hasOutput =
    task.outputs && task.outputs.length > 0 && task.status !== "RUNNING";
  const latestOutput = hasOutput
    ? task.outputs[task.outputs.length - 1].content
    : "";

  const { cleanMarkdown, mapAlerts } = useMemo(() => {
    if (!latestOutput) {
      return { cleanMarkdown: "", mapAlerts: [] as WsdotMapAlertItem[] };
    }
    const match = latestOutput.match(/```wsdot-map-data\s*([\s\S]*?)\s*```/);
    if (match) {
      try {
        const parsed = JSON.parse(match[1]);
        const cleaned = latestOutput
          .replace(/```wsdot-map-data\s*[\s\S]*?\s*```/, "")
          .trim();
        return {
          cleanMarkdown: cleaned,
          mapAlerts: Array.isArray(parsed)
            ? (parsed as WsdotMapAlertItem[])
            : [],
        };
      } catch (e) {
        console.error("Failed to parse wsdot-map-data:", e);
      }
    }
    return {
      cleanMarkdown: latestOutput,
      mapAlerts: [] as WsdotMapAlertItem[],
    };
  }, [latestOutput]);

  const getBadgeConfig = () => {
    if (task.frequency === "DAILY") {
      return {
        label: task.weekday_only ? "WEEKDAYS" : "DAILY",
        className:
          "bg-orange-100 text-orange-800 dark:bg-orange-950/60 " +
          "dark:text-orange-300 border border-orange-300/60 dark:border-orange-800/60",
      };
    }
    if (task.frequency === "WEEKLY") {
      return {
        label: "WEEKLY",
        className:
          "bg-purple-100 text-purple-800 dark:bg-purple-950/60 " +
          "dark:text-purple-300 border border-purple-300/60 dark:border-purple-800/60",
      };
    }
    if (task.frequency === "MONTHLY") {
      return {
        label: "MONTHLY",
        className:
          "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 " +
          "dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800/60",
      };
    }
    if (task.status === "SUCCESS" || task.status === "COMPLETED") {
      return {
        label: task.status,
        className:
          "bg-green-100 text-green-800 dark:bg-green-950/60 " +
          "dark:text-green-300 border border-green-300/60 dark:border-green-800/60",
      };
    }
    if (task.status === "PARTIAL_SUCCESS") {
      return {
        label: "PARTIAL SUCCESS",
        className:
          "bg-amber-100 text-amber-800 dark:bg-amber-950/60 " +
          "dark:text-amber-300 border border-amber-300/60 dark:border-amber-800/60",
      };
    }
    if (task.status === "NO_RESULT") {
      return {
        label: "NO RESULT",
        className:
          "bg-stone-200 text-stone-700 dark:bg-stone-800 " +
          "dark:text-stone-300 border border-stone-300 dark:border-stone-700",
      };
    }
    if (task.status === "RUNNING") {
      return {
        label: "RUNNING",
        className:
          "bg-amber-100 text-amber-800 dark:bg-amber-950/60 " +
          "dark:text-amber-300 border border-amber-400 animate-pulse",
      };
    }
    if (task.status === "PENDING") {
      return {
        label: runStage === "STARTING" ? "STARTING" : "QUEUED",
        className:
          "bg-orange-100 text-orange-800 dark:bg-orange-950/60 " +
          "dark:text-orange-300 border border-orange-300/60",
      };
    }
    if (task.status === "FAILED") {
      return {
        label: "FAILED",
        className:
          "bg-red-100 text-red-800 dark:bg-red-950/60 " +
          "dark:text-red-300 border border-red-300/60 dark:border-red-800/60",
      };
    }
    return {
      label: task.status,
      className:
        "bg-stone-200 text-stone-700 dark:bg-stone-800 " +
        "dark:text-stone-300 border border-stone-300 dark:border-stone-700",
    };
  };

  const badge = getBadgeConfig();
  const pillStyle =
    "px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-stone-100 " +
    "dark:bg-stone-800 text-stone-600 dark:text-stone-300 border " +
    "border-stone-200 dark:border-stone-700 inline-flex items-center gap-1 whitespace-nowrap";

  return (
    <div
      className={`rounded-xl bg-surface-card p-5 shadow-sm transition-all border ${
        task.status === "RUNNING"
          ? "border-amber-500 ring-1 ring-amber-500/30"
          : "border-stone-200 dark:border-stone-800 hover:border-brand-primary/50"
      }`}
    >
      {/* Top Row: Badges + Prompt + Read-Only Actions */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[240px]">
          <span
            className={
              "px-3 py-0.5 rounded-full text-[11px] font-bold uppercase " +
              `tracking-wider whitespace-nowrap ${badge.className}`
            }
          >
            {badge.label}
          </span>

          {task.frequency !== "ONCE" &&
            (runStage === "RUNNING" ||
              runStage === "QUEUED" ||
              isRecurringRunning) && (
              <span
                className={
                  "px-2.5 py-0.5 rounded-full text-[11px] font-semibold " +
                  "bg-amber-100 text-amber-800 dark:bg-amber-950/60 " +
                  "dark:text-amber-300 inline-flex items-center gap-1.5"
                }
              >
                <FontAwesomeIcon
                  icon={runStage === "QUEUED" ? faClock : faSpinner}
                  className={runStage === "RUNNING" ? "animate-spin" : ""}
                />
                {runStage === "QUEUED" ? "Child Queued" : "Child Running"}
              </span>
            )}

          {task.silent_if_no_result && (
            <span
              className={pillStyle}
              title="Silent on NO_RESULT: Telegram notification is skipped if 0 matching results are found"
            >
              <FontAwesomeIcon icon={faBellSlash} className="text-[10px]" />
              Silent on No Result
            </span>
          )}

          {Boolean(task.max_history_runs) && (
            <span
              className={pillStyle}
              title={`Keep latest ${task.max_history_runs} runs: older runs and log files are purged automatically`}
            >
              <FontAwesomeIcon
                icon={faClockRotateLeft}
                className="text-[10px]"
              />
              Keep {task.max_history_runs} runs
            </span>
          )}

          <span className="text-xs text-stone-400 font-mono">#{task.id}</span>
        </div>

        <button
          type="button"
          onClick={handleCopyPrompt}
          className={
            "px-3 py-1 rounded-md text-xs font-medium border transition-colors " +
            "inline-flex items-center gap-1.5 cursor-pointer " +
            (copied
              ? "border-green-500 text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950/40"
              : "border-stone-200 dark:border-stone-700 text-stone-600 " +
                "dark:text-stone-300 hover:border-brand-primary hover:text-brand-vibrant")
          }
          title="Copy task prompt"
        >
          <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
          {copied ? "Copied!" : "Copy Prompt"}
        </button>
      </div>

      {/* Prompt Text */}
      <div className="text-base font-semibold text-foreground mb-3 break-words">
        {task.prompt}
      </div>

      {/* Context Badges */}
      <div className="flex flex-wrap items-center gap-1.5 mb-3">
        <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 inline-flex items-center gap-1.5">
          <FontAwesomeIcon
            icon={faBookOpen}
            className="text-brand-primary text-[11px]"
          />
          Context:
        </span>
        {task.contexts && task.contexts.length > 0 ? (
          task.contexts.map((ctx) => {
            const isSelected = selectedContext?.id === ctx.id;
            return (
              <button
                key={ctx.id}
                type="button"
                onClick={() => setSelectedContext(isSelected ? null : ctx)}
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-brand-primary text-white border-brand-vibrant"
                    : "bg-brand-light dark:bg-brand-soft text-brand-vibrant " +
                      "dark:text-brand-primary border-brand-primary/30 hover:border-brand-primary"
                }`}
                title="Click to preview context content"
              >
                {ctx.name}
              </button>
            );
          })
        ) : (
          <span className="text-xs italic text-stone-400">None</span>
        )}
      </div>

      {/* Inline Context Content Preview when clicked */}
      {selectedContext && (
        <div className="mb-3 p-3 rounded-lg bg-stone-50 dark:bg-stone-900/70 border border-brand-primary/30 text-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-brand-vibrant dark:text-brand-primary">
              {selectedContext.name}
            </span>
            <button
              type="button"
              onClick={() => setSelectedContext(null)}
              className="text-stone-400 hover:text-foreground cursor-pointer"
            >
              Close
            </button>
          </div>
          <p className="whitespace-pre-wrap text-stone-700 dark:text-stone-300 m-0">
            {selectedContext.content}
          </p>
        </div>
      )}

      {/* Timestamp & Expand Result Toggle */}
      <div
        className={
          "flex flex-wrap items-center justify-between gap-2 pt-2 " +
          "border-t border-stone-100 dark:border-stone-800/80"
        }
      >
        <span className="text-xs text-stone-500 dark:text-stone-400 inline-flex items-center gap-1.5">
          <FontAwesomeIcon
            icon={task.frequency !== "ONCE" ? faClock : faCalendarDays}
            className="text-[11px]"
          />
          {task.frequency !== "ONCE"
            ? `${formatSchedule(task)} ${tzAbbreviation}`
            : task.status === "RUNNING"
              ? `Started: ${toLocalDate(task.started_at).toLocaleTimeString()} ${tzAbbreviation}`
              : task.status === "PENDING"
                ? `Queued at: ${toLocalDate(task.created_at).toLocaleTimeString()} ${tzAbbreviation}`
                : task.status === "CANCELLED"
                  ? `Cancelled at: ${toLocalDate(task.updated_at).toLocaleTimeString()} ${tzAbbreviation}`
                  : `Last Run: ${toLocalDate(task.updated_at).toLocaleString()} ${tzAbbreviation}`}
        </span>

        {hasOutput && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className={
              "text-xs font-semibold text-brand-vibrant dark:text-brand-primary " +
              "hover:underline inline-flex items-center gap-1 cursor-pointer py-1 px-2 rounded"
            }
          >
            {isExpanded ? (
              <>
                Hide Result <FontAwesomeIcon icon={faChevronUp} />
              </>
            ) : (
              <>
                View Result <FontAwesomeIcon icon={faChevronDown} />
              </>
            )}
          </button>
        )}
      </div>

      {/* Collapsible Output Result */}
      {isExpanded && hasOutput && (
        <div
          className={
            "mt-4 p-4 rounded-lg bg-stone-50 dark:bg-stone-900/80 border " +
            "border-stone-200 dark:border-stone-800 border-l-4 border-l-brand-primary overflow-x-auto"
          }
          onClick={(e) => e.stopPropagation()}
        >
          {mapAlerts.length > 0 && (
            <div className="mb-4 p-3 rounded-lg bg-surface-card border border-stone-200 dark:border-stone-700">
              <div
                className={
                  "text-xs font-bold uppercase tracking-wider text-brand-vibrant " +
                  "mb-2 flex items-center gap-1.5"
                }
              >
                <FontAwesomeIcon icon={faRoad} />
                WSDOT Corridor Alerts ({mapAlerts.length})
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {mapAlerts.map((alert, idx) => (
                  <div
                    key={alert.AlertID ?? idx}
                    className="p-2.5 rounded border border-stone-200 dark:border-stone-800 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-foreground">
                        {alert.Roadway || "Highway"}{" "}
                        {alert.Direction ? `(${alert.Direction})` : ""}
                      </span>
                      {alert.Priority && (
                        <span
                          className={
                            "px-2 py-0.5 rounded-full text-[10px] font-semibold " +
                            "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                          }
                        >
                          {alert.Priority}
                        </span>
                      )}
                    </div>
                    <p className="text-stone-600 dark:text-stone-300 m-0">
                      {alert.Headline}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="prose prose-sm dark:prose-invert max-w-none text-foreground leading-relaxed break-words">
            <ReactMarkdown
              components={{
                a: ({ ...props }) => (
                  <a
                    {...props}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-vibrant dark:text-brand-primary underline hover:opacity-80"
                  />
                ),
              }}
            >
              {cleanMarkdown}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};
