import { access } from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

import { DEFAULT_COMPONENT_GROUPS, DEFAULT_COMPONENT_REGISTRY } from "../js/ui/ui.loader.js";

const loaderModuleUrl = new URL("../js/ui/ui.loader.js", import.meta.url);
const loaderDir = path.dirname(fileURLToPath(loaderModuleUrl));
const failures = [];

for (const [name, entry] of Object.entries(DEFAULT_COMPONENT_REGISTRY)) {
  if (!entry || typeof entry !== "object") {
    failures.push(`${name}: registry entry must be an object`);
    continue;
  }

  if (!entry.js) {
    failures.push(`${name}: missing js path`);
  } else {
    const jsUrl = new URL(entry.js, loaderModuleUrl);
    const jsPath = fileURLToPath(jsUrl);
    await assertExists(jsPath, `${name}: js path does not exist (${entry.js})`);
    try {
      const mod = await import(pathToFileURL(jsPath).href);
      if (entry.export && typeof mod[entry.export] === "undefined") {
        failures.push(`${name}: export "${entry.export}" not found in module ${entry.js}`);
      }
    } catch (error) {
      failures.push(`${name}: failed to import module ${entry.js} (${error.message})`);
    }
  }

  if (!Array.isArray(entry.css)) {
    failures.push(`${name}: css must be an array`);
  } else {
    for (const cssPathValue of entry.css) {
      const cssUrl = new URL(cssPathValue, loaderModuleUrl);
      const cssPath = fileURLToPath(cssUrl);
      await assertExists(cssPath, `${name}: css path does not exist (${cssPathValue})`);
    }
  }

  if (!Array.isArray(entry.deps)) {
    failures.push(`${name}: deps must be an array`);
  } else {
    for (const depName of entry.deps) {
      if (!DEFAULT_COMPONENT_REGISTRY[depName]) {
        failures.push(`${name}: dependency "${depName}" is not registered`);
      }
    }
  }
}

for (const [groupName, groupEntries] of Object.entries(DEFAULT_COMPONENT_GROUPS)) {
  if (!Array.isArray(groupEntries) || !groupEntries.length) {
    failures.push(`group "${groupName}": entries must be a non-empty array`);
    continue;
  }
  for (const entryName of groupEntries) {
    if (!DEFAULT_COMPONENT_REGISTRY[entryName]) {
      failures.push(`group "${groupName}": unknown registry key "${entryName}"`);
    }
  }
}

if (failures.length) {
  console.error("Registry contract test failed:");
  failures.forEach((line) => console.error(`- ${line}`));
  process.exitCode = 1;
} else {
  console.log(`Registry contract test passed for ${Object.keys(DEFAULT_COMPONENT_REGISTRY).length} entries and ${Object.keys(DEFAULT_COMPONENT_GROUPS).length} groups.`);
}

async function assertExists(targetPath, message) {
  try {
    await access(targetPath, fsConstants.F_OK);
  } catch (_error) {
    failures.push(message);
  }
}
