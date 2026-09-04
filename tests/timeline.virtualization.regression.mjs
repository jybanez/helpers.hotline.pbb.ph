import { fileURLToPath } from "node:url";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs";
import { startStaticServer } from "./_support/static-server.mjs";

const execFileAsync = promisify(execFile);
const browserPath = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
].find((candidate) => fs.existsSync(candidate));

if (!browserPath) throw new Error("Timeline virtualization regression requires Chrome or Edge.");

const testsDir = path.dirname(fileURLToPath(import.meta.url));
let server;
try {
  server = await startStaticServer({ rootDir: path.resolve(testsDir, ".."), port: 0 });
  const { stdout } = await execFileAsync(browserPath, [
    "--headless=new",
    "--disable-gpu",
    "--virtual-time-budget=20000",
    "--dump-dom",
    `${server.origin}/tests/timeline.virtualization.regression.html`,
  ], { timeout: 240000, maxBuffer: 1024 * 1024 * 8 });
  if (!stdout.includes('data-status="pass"') || !stdout.includes("PASS")) {
    console.error(stdout);
    throw new Error("Timeline virtualization browser assertions did not pass.");
  }
  console.log("Timeline virtualization regression test passed.");
} finally {
  await server?.close();
}
