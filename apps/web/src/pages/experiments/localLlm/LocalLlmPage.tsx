import { SecondaryButton } from "@/components/Buttons";
import { Loading } from "@/components/Loading";
import TabList from "@/components/TabList";
import {
  faBookOpen,
  faClockRotateLeft,
  faLock,
  faMicrochip,
  faRotate,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocalLlmData } from "./hooks/useLocalLlmData";
import { LocalLlmContextList } from "./LocalLlmContextList";
import { LocalLlmTaskList } from "./LocalLlmTaskList";

type LocalLlmTab = "recurring" | "history" | "contexts";

const LocalLlmPage: React.FC = () => {
  const { t } = useTranslation();
  const { data, isLoading, isFetching, error, refetch } = useLocalLlmData();
  const [activeTab, setActiveTab] = useState<LocalLlmTab>("recurring");

  const tasks = useMemo(() => data?.tasks || [], [data?.tasks]);
  const contexts = useMemo(() => data?.contexts || [], [data?.contexts]);

  const stats = useMemo(() => {
    const recurringCount = tasks.filter((item) => item.frequency !== "ONCE")
      .length;
    const pendingCount = tasks.filter(
      (item) =>
        item.frequency === "ONCE" &&
        (item.status === "PENDING" || item.status === "RUNNING"),
    ).length;
    const completedCount = tasks.filter(
      (item) =>
        item.frequency === "ONCE" &&
        (item.status === "SUCCESS" ||
          item.status === "COMPLETED" ||
          item.status === "PARTIAL_SUCCESS" ||
          item.status === "NO_RESULT" ||
          item.status === "FAILED"),
    ).length;
    const historyCount = tasks.filter((item) => item.frequency === "ONCE")
      .length;

    return {
      recurringCount,
      pendingCount,
      completedCount,
      historyCount,
      contextsCount: contexts.length,
    };
  }, [tasks, contexts]);

  const tabs: LocalLlmTab[] = ["recurring", "history", "contexts"];

  const getTabLabel = (tab: LocalLlmTab) => {
    if (tab === "recurring") {
      return `${t("localLlm.tabs.recurring", "Recurring Tasks")} (${stats.recurringCount})`;
    }
    if (tab === "history") {
      return `${t("localLlm.tabs.history", "Task History")} (${stats.historyCount})`;
    }
    return `${t("localLlm.tabs.contexts", "Reference Contexts")} (${contexts.length})`;
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div
        className={
          "flex flex-wrap items-center justify-between gap-4 pb-5 mb-6 " +
          "border-b border-stone-200 dark:border-stone-800"
        }
      >
        <div className="flex items-center gap-3">
          <div
            className={
              "w-11 h-11 rounded-xl bg-brand-primary text-white flex items-center " +
              "justify-center shadow-md shadow-brand-primary/30"
            }
          >
            <FontAwesomeIcon icon={faMicrochip} className="text-lg" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl font-extrabold text-foreground m-0">
                LocalLLM{" "}
                <span className="text-brand-vibrant dark:text-brand-primary">
                  Agent
                </span>
              </h1>
              <span
                className={
                  "px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 " +
                  "dark:bg-stone-800 text-stone-600 dark:text-stone-300 border " +
                  "border-stone-200 dark:border-stone-700 inline-flex items-center gap-1"
                }
              >
                <FontAwesomeIcon icon={faLock} className="text-[10px]" />
                {t("localLlm.readOnly", "Read-Only View")}
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 m-0 mt-0.5">
              {t(
                "localLlm.subtitle",
                "Synced from Turso Cloud DB — scheduled tasks, execution history, and semantic contexts",
              )}
            </p>
          </div>
        </div>

        <SecondaryButton
          onClick={() => {
            refetch();
          }}
          disabled={isFetching}
        >
          <span className="inline-flex items-center gap-2">
            <FontAwesomeIcon
              icon={faRotate}
              className={isFetching ? "animate-spin" : ""}
            />
            {isFetching
              ? t("localLlm.refreshing", "Refreshing...")
              : t("localLlm.refresh", "Refresh Status")}
          </span>
        </SecondaryButton>
      </div>

      {/* Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-3.5 rounded-xl bg-surface-card border border-stone-200 dark:border-stone-800">
          <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1.5 mb-1">
            <FontAwesomeIcon icon={faRotate} className="text-brand-primary" />
            <span>Recurring Schedules</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {stats.recurringCount}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-card border border-stone-200 dark:border-stone-800">
          <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1.5 mb-1">
            <FontAwesomeIcon icon={faMicrochip} className="text-amber-500" />
            <span>Active / Pending</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {stats.pendingCount}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-card border border-stone-200 dark:border-stone-800">
          <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1.5 mb-1">
            <FontAwesomeIcon
              icon={faClockRotateLeft}
              className="text-green-600"
            />
            <span>Completed Runs</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {stats.completedCount}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-card border border-stone-200 dark:border-stone-800">
          <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1.5 mb-1">
            <FontAwesomeIcon
              icon={faBookOpen}
              className="text-purple-500"
            />
            <span>Reference Contexts</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {stats.contextsCount}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <TabList
        tabs={tabs}
        selectedTab={activeTab}
        onTabSelect={(tab) => setActiveTab(tab)}
        getLabel={getTabLabel}
      />

      {/* Main Content */}
      <div className="mt-4">
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <Loading />
            <span className="text-sm text-stone-500">
              Loading LocalLLM tasks & contexts from Turso...
            </span>
          </div>
        ) : error ? (
          <div
            className={
              "p-6 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 " +
              "dark:border-red-900 text-red-800 dark:text-red-300 flex flex-col gap-2"
            }
          >
            <div className="font-bold flex items-center gap-2">
              <FontAwesomeIcon icon={faTriangleExclamation} />
              <span>Failed to load LocalLLM data</span>
            </div>
            <p className="text-xs m-0">
              {error instanceof Error
                ? error.message
                : "Unable to reach Firebase Function getLocalLlmData or local FastAPI server."}
            </p>
          </div>
        ) : activeTab === "recurring" ? (
          <LocalLlmTaskList tasks={tasks} mode="recurring" />
        ) : activeTab === "history" ? (
          <LocalLlmTaskList tasks={tasks} mode="history" />
        ) : (
          <LocalLlmContextList contexts={contexts} tasks={tasks} />
        )}
      </div>
    </div>
  );
};

export default LocalLlmPage;
