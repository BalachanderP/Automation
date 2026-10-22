import { mkdir, copyFile, cp, writeFile } from "node:fs/promises";
import path from "node:path";

const required = [
  "GITHUB_TOKEN",
  "GITHUB_REPOSITORY",
  "GITHUB_API_URL",
  "GITHUB_RUN_ID",
  "GITHUB_RUN_NUMBER",
  "GITHUB_RUN_URL",
];

for (const variable of required) {
  if (!process.env[variable]) {
    throw new Error(`Required environment variable ${variable} is missing.`);
  }
}

const apiUrl = new URL(
  `repos/${process.env.GITHUB_REPOSITORY}/actions/workflows/playwright.yml/runs?per_page=100`,
  `${process.env.GITHUB_API_URL.replace(/\/+$/, "")}/`,
);
const response = await fetch(apiUrl, {
  headers: {
    Accept: "application/vnd.github+json",
    ...(process.env.GITHUB_TOKEN
      ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
      : {}),
    "X-GitHub-Api-Version": "2022-11-28",
  },
});

if (!response.ok) {
  throw new Error(`GitHub Actions API returned HTTP ${response.status}.`);
}

const { workflow_runs: workflowRuns } = await response.json();
if (!Array.isArray(workflowRuns)) {
  throw new Error("GitHub Actions API response did not contain workflow_runs.");
}

const currentRun = {
  id: Number(process.env.GITHUB_RUN_ID),
  run_number: Number(process.env.GITHUB_RUN_NUMBER),
  run_attempt: Number(process.env.GITHUB_RUN_ATTEMPT || 1),
  event: process.env.GITHUB_RUN_EVENT,
  head_branch: process.env.GITHUB_RUN_REF || "",
  html_url: process.env.GITHUB_RUN_URL,
  created_at: new Date().toISOString(),
  status: "completed",
  conclusion: process.env.GITHUB_TEST_RESULT || "unknown",
};

const runs = workflowRuns.filter((run) => run.event === "schedule");
if (currentRun.event === "schedule") {
  const currentIndex = runs.findIndex((run) => run.id === currentRun.id);
  if (currentIndex === -1) {
    runs.unshift(currentRun);
  } else {
    runs[currentIndex] = currentRun;
  }
}

runs.sort(
  (left, right) => new Date(right.created_at) - new Date(left.created_at),
);

const escapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });

const runRows = runs.slice(0, 20).map((run) => {
  const status = run.conclusion || run.status || "unknown";
  const date = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date(run.created_at));

  return `<tr>
    <td><a href="${escapeHtml(run.html_url)}">#${escapeHtml(run.run_number)}</a></td>
    <td>${escapeHtml(date)}</td>
    <td><span class="status ${escapeHtml(status)}">${escapeHtml(status)}</span></td>
    <td>${escapeHtml(run.head_branch)}</td>
  </tr>`;
});

const latestStatus = currentRun.conclusion;
const siteDirectory = path.resolve("artifacts/site");
const reportDirectory = path.resolve("artifacts/allure-report");

await mkdir(siteDirectory, { recursive: true });

try {
  await cp(reportDirectory, path.join(siteDirectory, "allure"), {
    recursive: true,
    force: true,
  });
} catch (error) {
  if (error.code !== "ENOENT") {
    throw error;
  }
}

try {
  await copyFile(
    path.resolve("artifacts/allure-history.jsonl"),
    path.join(siteDirectory, "allure-history.jsonl"),
  );
} catch (error) {
  if (error.code !== "ENOENT") {
    throw error;
  }
}

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Playwright Execution Dashboard</title>
  <style>
    :root { color-scheme: light dark; font-family: system-ui, sans-serif; }
    body { max-width: 960px; margin: 3rem auto; padding: 0 1rem; }
    h1 { margin-bottom: .5rem; }
    .muted { opacity: .75; }
    .card { border: 1px solid #8885; border-radius: 12px; padding: 1.25rem; margin: 1.25rem 0; }
    .button { display: inline-block; padding: .7rem 1rem; border-radius: 8px; background: #2563eb; color: white; text-decoration: none; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: .8rem .5rem; border-bottom: 1px solid #8885; }
    .status { font-weight: 700; text-transform: capitalize; }
    .success { color: #16a34a; }
    .failure, .cancelled, .timed_out { color: #dc2626; }
  </style>
</head>
<body>
  <h1>Playwright Execution Dashboard</h1>
  <p class="muted">Scheduled smoke tests run daily at 11:30 PM IST (18:00 UTC).</p>
  <section class="card">
    <h2>Latest execution</h2>
    <p>Run <a href="${escapeHtml(currentRun.html_url)}">#${escapeHtml(currentRun.run_number)}</a>
      — <span class="status ${escapeHtml(latestStatus)}">${escapeHtml(latestStatus)}</span></p>
    <a class="button" href="./allure/">View latest Allure report</a>
  </section>
  <section class="card">
    <h2>Recent scheduled executions</h2>
    ${
      runRows.length
        ? `<table>
      <thead><tr><th>Run</th><th>Started (IST)</th><th>Result</th><th>Branch</th></tr></thead>
      <tbody>${runRows.join("")}</tbody>
    </table>`
        : `<p>No scheduled executions are available yet.</p>`
    }
  </section>
  <p class="muted">Allure trends are retained for the latest 50 report runs.</p>
</body>
</html>
`;

await writeFile(path.join(siteDirectory, "index.html"), html, "utf8");
