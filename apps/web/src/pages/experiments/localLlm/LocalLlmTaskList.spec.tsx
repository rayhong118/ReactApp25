import { fireEvent, render, screen } from "@testing-library/react";
import type { ILocalLlmTask } from "@shared/types";
import { describe, expect, it } from "vitest";
import { LocalLlmTaskList } from "./LocalLlmTaskList";

const sampleTasks: ILocalLlmTask[] = [
  {
    id: 1,
    prompt: "Check Safeway digital coupons",
    status: "PENDING",
    frequency: "DAILY",
    hour_of_day: 8,
    weekday_only: true,
    silent_if_no_result: true,
    max_history_runs: 5,
    next_run_at: "2026-10-29 15:00:00",
    started_at: null,
    created_at: "2026-10-20 12:00:00",
    updated_at: "2026-10-28 15:00:00",
    parent_id: null,
    outputs: [],
    contexts: [
      {
        id: 10,
        name: "Safeway watchlist",
        content: "milk, eggs, sparkling water",
        created_at: "2026-10-15 10:00:00",
      },
    ],
  },
  {
    id: 2,
    prompt: "Run WSDOT traffic check",
    status: "SUCCESS",
    frequency: "ONCE",
    hour_of_day: null,
    next_run_at: null,
    started_at: "2026-10-28 14:00:00",
    created_at: "2026-10-28 13:59:00",
    updated_at: "2026-10-28 14:01:00",
    parent_id: 1,
    outputs: [
      {
        id: 100,
        task_id: 2,
        content: "### Traffic Report\nAll clear on I-5.",
        created_at: "2026-10-28 14:01:00",
      },
    ],
    contexts: [],
  },
];

describe("LocalLlmTaskList (Read-Only)", () => {
  it("renders recurring tasks only in recurring mode", () => {
    render(<LocalLlmTaskList tasks={sampleTasks} mode="recurring" />);

    expect(
      screen.getByText("Check Safeway digital coupons"),
    ).toBeInTheDocument();
    expect(screen.getByText("WEEKDAYS")).toBeInTheDocument();
    expect(screen.getByText("Silent on No Result")).toBeInTheDocument();
    expect(screen.getByText("Keep 5 runs")).toBeInTheDocument();
    expect(screen.getByText("Safeway watchlist")).toBeInTheDocument();

    expect(
      screen.queryByText("Run WSDOT traffic check"),
    ).not.toBeInTheDocument();
  });

  it("renders completed history only in history mode", () => {
    render(<LocalLlmTaskList tasks={sampleTasks} mode="history" />);

    expect(screen.getByText("Run WSDOT traffic check")).toBeInTheDocument();
    expect(screen.getByText("SUCCESS")).toBeInTheDocument();
    expect(
      screen.queryByText("Check Safeway digital coupons"),
    ).not.toBeInTheDocument();
  });

  it("expands and collapses markdown output results and context preview", () => {
    render(<LocalLlmTaskList tasks={sampleTasks} />);

    // Preview context content
    fireEvent.click(screen.getByText("Safeway watchlist"));
    expect(
      screen.getByText("milk, eggs, sparkling water"),
    ).toBeInTheDocument();

    // Expand task output result
    const viewBtn = screen.getByText(/View Result/i);
    fireEvent.click(viewBtn);
    expect(screen.getByText("All clear on I-5.")).toBeInTheDocument();
  });
});
