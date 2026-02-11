import Papa from "papaparse";
import type { Issue } from "../types/issue";

export function exportCSV(issues: Issue[]) {
  const csv = Papa.unparse(issues);
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "issues.csv";
  a.click();
}
