import {
  normalizeTursoHttpUrl,
  parseTursoRows,
  type TursoExecuteResult,
} from "./tursoClient";

describe("tursoClient utilities", () => {
  it("normalizes libsql:// URLs to https:// and strips trailing slashes", () => {
    expect(normalizeTursoHttpUrl("libsql://my-db-org.turso.io/")).toBe(
      "https://my-db-org.turso.io",
    );
    expect(normalizeTursoHttpUrl("https://my-db-org.turso.io")).toBe(
      "https://my-db-org.turso.io",
    );
  });

  it("parses Turso typed rows into plain objects", () => {
    const mockResult: TursoExecuteResult = {
      cols: [
        { name: "id", decltype: "INTEGER" },
        { name: "prompt", decltype: "TEXT" },
        { name: "weekday_only", decltype: "BOOLEAN" },
        { name: "started_at", decltype: "DATETIME" },
      ],
      rows: [
        [
          { type: "integer", value: "42" },
          { type: "text", value: "check safeway coupons" },
          { type: "integer", value: "1" },
          { type: "null" },
        ],
      ],
    };

    const parsed = parseTursoRows(mockResult);
    expect(parsed).toEqual([
      {
        id: 42,
        prompt: "check safeway coupons",
        weekday_only: 1,
        started_at: null,
      },
    ]);
  });
});

