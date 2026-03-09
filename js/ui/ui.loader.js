const UI_TOKENS_CSS = "../../css/ui/ui.tokens.css";
const UI_COMPONENTS_CSS = "../../css/ui/ui.components.css";
const INCIDENT_BASE_CSS = "../../css/incident/incident.css";

const DEFAULT_COMPONENT_REGISTRY = {
  "ui.dom": {
    js: "./ui.dom.js",
    css: [],
    deps: [],
  },
  "ui.events": {
    js: "./ui.events.js",
    css: [],
    deps: [],
  },
  "ui.search": {
    js: "./ui.search.js",
    css: [UI_TOKENS_CSS, UI_COMPONENTS_CSS],
    deps: [],
  },
  "ui.drawer": {
    js: "./ui.drawer.js",
    css: [UI_TOKENS_CSS, UI_COMPONENTS_CSS],
    deps: [],
  },
  "ui.modal": {
    js: "./ui.modal.js",
    css: [UI_TOKENS_CSS, UI_COMPONENTS_CSS, "../../css/ui/ui.modal.css"],
    deps: [],
  },
  "ui.dialog": {
    js: "./ui.dialog.js",
    css: [UI_TOKENS_CSS, UI_COMPONENTS_CSS, "../../css/ui/ui.modal.css", "../../css/ui/ui.dialog.css"],
    deps: ["ui.modal"],
  },
  "ui.toast": {
    js: "./ui.toast.js",
    css: [UI_TOKENS_CSS, UI_COMPONENTS_CSS, "../../css/ui/ui.toast.css"],
    deps: [],
  },
  "ui.select": {
    js: "./ui.select.js",
    css: [UI_TOKENS_CSS, UI_COMPONENTS_CSS, "../../css/ui/ui.select.css"],
    deps: [],
  },
  "ui.datepicker": {
    js: "./ui.datepicker.js",
    css: [UI_TOKENS_CSS, UI_COMPONENTS_CSS, "../../css/ui/ui.datepicker.css"],
    deps: [],
  },
  "ui.timeline": {
    js: "./ui.timeline.js",
    css: [UI_TOKENS_CSS, UI_COMPONENTS_CSS, "../../css/ui/ui.timeline.css"],
    deps: [],
  },
  "ui.timeline.scrubber": {
    js: "./ui.timeline.scrubber.js",
    css: [UI_TOKENS_CSS, UI_COMPONENTS_CSS, "../../css/ui/ui.timeline.scrubber.css"],
    deps: [],
  },
  "ui.command.palette": {
    js: "./ui.command.palette.js",
    css: [UI_TOKENS_CSS, UI_COMPONENTS_CSS, "../../css/ui/ui.command.palette.css"],
    deps: [],
  },
  "ui.tree": {
    js: "./ui.tree.js",
    css: [UI_TOKENS_CSS, UI_COMPONENTS_CSS, "../../css/ui/ui.tree.css"],
    deps: [],
  },
  "ui.kanban": {
    js: "./ui.kanban.js",
    css: [UI_TOKENS_CSS, UI_COMPONENTS_CSS, "../../css/ui/ui.kanban.css"],
    deps: [],
  },
  "ui.stepper": {
    js: "./ui.stepper.js",
    css: [UI_TOKENS_CSS, UI_COMPONENTS_CSS, "../../css/ui/ui.stepper.css"],
    deps: [],
  },
  "ui.splitter": {
    js: "./ui.splitter.js",
    css: [UI_TOKENS_CSS, UI_COMPONENTS_CSS, "../../css/ui/ui.splitter.css"],
    deps: [],
  },
  "ui.data.inspector": {
    js: "./ui.data.inspector.js",
    css: [UI_TOKENS_CSS, UI_COMPONENTS_CSS, "../../css/ui/ui.data.inspector.css"],
    deps: [],
  },
  "ui.empty.state": {
    js: "./ui.empty.state.js",
    css: [UI_TOKENS_CSS, UI_COMPONENTS_CSS, "../../css/ui/ui.empty.state.css"],
    deps: [],
  },
  "ui.skeleton": {
    js: "./ui.skeleton.js",
    css: [UI_TOKENS_CSS, UI_COMPONENTS_CSS, "../../css/ui/ui.skeleton.css"],
    deps: [],
  },
  "ui.file.uploader": {
    js: "./ui.file.uploader.js",
    css: [UI_TOKENS_CSS, UI_COMPONENTS_CSS, "../../css/ui/ui.progress.css", "../../css/ui/ui.file.uploader.css"],
    deps: ["ui.progress"],
  },
  "ui.tabs": {
    js: "./ui.tabs.js",
    css: [UI_TOKENS_CSS, UI_COMPONENTS_CSS, "../../css/ui/ui.tabs.css"],
    deps: [],
  },
  "ui.strips": {
    js: "./ui.strips.js",
    css: [UI_TOKENS_CSS, UI_COMPONENTS_CSS, "../../css/ui/ui.strips.css"],
    deps: [],
  },
  "ui.media.strip": {
    js: "./ui.media.strip.js",
    css: [UI_TOKENS_CSS, UI_COMPONENTS_CSS, "../../css/ui/ui.media.strip.css"],
    deps: [],
  },
  "ui.grid": {
    js: "./ui.grid.js",
    css: [UI_TOKENS_CSS, UI_COMPONENTS_CSS, "../../css/ui/ui.grid.css"],
    deps: [],
  },
  "ui.progress": {
    js: "./ui.progress.js",
    css: [UI_TOKENS_CSS, UI_COMPONENTS_CSS, "../../css/ui/ui.progress.css"],
    deps: [],
  },
  "ui.virtual.list": {
    js: "./ui.virtual.list.js",
    css: [UI_TOKENS_CSS, UI_COMPONENTS_CSS, "../../css/ui/ui.virtual.list.css"],
    deps: [],
  },
  "ui.scheduler": {
    js: "./ui.scheduler.js",
    css: [UI_TOKENS_CSS, UI_COMPONENTS_CSS, "../../css/ui/ui.scheduler.css"],
    deps: [],
  },
  "ui.menu": {
    js: "./ui.menu.js",
    css: [UI_TOKENS_CSS, UI_COMPONENTS_CSS, "../../css/ui/ui.nav.css"],
    deps: [],
  },
  "ui.dropdown": {
    js: "./ui.dropdown.js",
    css: [UI_TOKENS_CSS, UI_COMPONENTS_CSS, "../../css/ui/ui.nav.css"],
    deps: ["ui.menu"],
  },
  "ui.dropup": {
    js: "./ui.dropup.js",
    css: [UI_TOKENS_CSS, UI_COMPONENTS_CSS, "../../css/ui/ui.nav.css"],
    deps: ["ui.menu"],
  },
  "ui.navbar": {
    js: "./ui.navbar.js",
    css: [UI_TOKENS_CSS, UI_COMPONENTS_CSS, "../../css/ui/ui.nav.css"],
    deps: ["ui.dropdown"],
  },
  "ui.sidebar": {
    js: "./ui.sidebar.js",
    css: [UI_TOKENS_CSS, UI_COMPONENTS_CSS, "../../css/ui/ui.nav.css"],
    deps: [],
  },
  "ui.breadcrumbs": {
    js: "./ui.breadcrumbs.js",
    css: [UI_TOKENS_CSS, UI_COMPONENTS_CSS, "../../css/ui/ui.nav.css"],
    deps: [],
  },
  "ui.audio.player": {
    js: "./ui.audio.player.js",
    css: [UI_TOKENS_CSS, UI_COMPONENTS_CSS, "../../css/ui/ui.audio.css"],
    deps: [],
  },
  "ui.audio.audiograph": {
    js: "./ui.audio.audiograph.js",
    css: [UI_TOKENS_CSS, UI_COMPONENTS_CSS, "../../css/ui/ui.audio.css"],
    deps: [],
  },
  "ui.audio.callSession": {
    js: "./ui.audio.callSession.js",
    css: [UI_TOKENS_CSS, UI_COMPONENTS_CSS, "../../css/ui/ui.audio.css"],
    deps: ["ui.audio.player", "ui.audio.audiograph"],
  },
  "incident.base": {
    js: "../incident/incident.base.js",
    css: [UI_TOKENS_CSS, UI_COMPONENTS_CSS, INCIDENT_BASE_CSS, "../../css/incident/incident.base.css"],
    deps: [],
  },
  "incident.teams.assignments.editor": {
    js: "../incident/incident.teams.assignments.editor.js",
    css: [
      UI_TOKENS_CSS,
      UI_COMPONENTS_CSS,
      INCIDENT_BASE_CSS,
      "../../css/incident/incident.base.css",
      "../../css/incident/incident.teams.assignments.css",
      "../../css/incident/incident.teams.assignments.editor.css",
    ],
    deps: ["incident.base"],
  },
  "incident.teams.assignments.viewer": {
    js: "../incident/incident.teams.assignments.viewer.js",
    css: [
      UI_TOKENS_CSS,
      UI_COMPONENTS_CSS,
      INCIDENT_BASE_CSS,
      "../../css/incident/incident.base.css",
      "../../css/incident/incident.teams.assignments.css",
      "../../css/incident/incident.teams.assignments.viewer.css",
    ],
    deps: ["incident.base"],
  },
  "incident.teams.assignments": {
    js: "../incident/incident.teams.assignments.js",
    css: [
      UI_TOKENS_CSS,
      UI_COMPONENTS_CSS,
      INCIDENT_BASE_CSS,
      "../../css/incident/incident.base.css",
      "../../css/incident/incident.teams.assignments.css",
      "../../css/incident/incident.teams.assignments.editor.css",
      "../../css/incident/incident.teams.assignments.viewer.css",
    ],
    deps: ["incident.base", "incident.teams.assignments.editor", "incident.teams.assignments.viewer"],
  },
  "incident.types.details.editor": {
    js: "../incident/incident.types.details.editor.js",
    css: [
      UI_TOKENS_CSS,
      UI_COMPONENTS_CSS,
      INCIDENT_BASE_CSS,
      "../../css/incident/incident.base.css",
      "../../css/incident/incident.types.css",
      "../../css/incident/incident.types.details.editor.css",
    ],
    deps: ["incident.base"],
  },
  "incident.types.details.viewer": {
    js: "../incident/incident.types.details.viewer.js",
    css: [
      UI_TOKENS_CSS,
      UI_COMPONENTS_CSS,
      INCIDENT_BASE_CSS,
      "../../css/incident/incident.base.css",
      "../../css/incident/incident.types.css",
      "../../css/incident/incident.types.details.viewer.css",
    ],
    deps: ["incident.base"],
  },
  "incident.types": {
    js: "../incident/incident.types.js",
    css: [
      UI_TOKENS_CSS,
      UI_COMPONENTS_CSS,
      INCIDENT_BASE_CSS,
      "../../css/incident/incident.base.css",
      "../../css/incident/incident.types.css",
      "../../css/incident/incident.types.details.editor.css",
      "../../css/incident/incident.types.details.viewer.css",
    ],
    deps: ["incident.base", "incident.types.details.editor", "incident.types.details.viewer"],
  },
};

export function createUiLoader(initialRegistry = DEFAULT_COMPONENT_REGISTRY) {
  const registry = new Map(Object.entries(initialRegistry).map(([name, entry]) => [name, normalizeEntry(entry)]));
  const stylePromises = new Map();
  const modulePromises = new Map();

  function has(name) {
    return registry.has(String(name || ""));
  }

  function register(name, entry) {
    const key = String(name || "").trim();
    if (!key) {
      throw new Error("uiLoader.register(name, entry) requires a non-empty component name.");
    }
    registry.set(key, normalizeEntry(entry));
    return key;
  }

  function unregister(name) {
    registry.delete(String(name || ""));
  }

  function resolve(name) {
    const key = String(name || "");
    const entry = registry.get(key);
    if (!entry) {
      throw new Error(`uiLoader could not resolve component "${key}".`);
    }
    return {
      name: key,
      ...entry,
    };
  }

  async function ensureStyles(name, options = {}) {
    const entry = resolve(name);
    const parent = getStyleParent(options.parent);
    if (options.recursive !== false) {
      for (const depName of entry.deps) {
        await ensureStyles(depName, options);
      }
    }
    await Promise.all(entry.css.map((path) => ensureStyleHref(path, parent)));
    return entry;
  }

  async function load(name, options = {}) {
    const entry = resolve(name);
    if (options.recursive !== false) {
      for (const depName of entry.deps) {
        await load(depName, options);
      }
    }
    if (options.css !== false) {
      await ensureStyles(name, options);
    }
    if (options.js) {
      return importComponent(name, options);
    }
    return entry;
  }

  async function loadMany(names, options = {}) {
    const list = Array.isArray(names) ? names : [];
    return Promise.all(list.map((name) => load(name, options)));
  }

  async function importComponent(name, options = {}) {
    const entry = resolve(name);
    if (options.recursive !== false) {
      for (const depName of entry.deps) {
        await importComponent(depName, options);
      }
    }
    if (options.css !== false) {
      await ensureStyles(name, options);
    }
    if (modulePromises.has(name)) {
      return modulePromises.get(name);
    }
    const modulePromise = import(toAbsoluteUrl(entry.js));
    modulePromises.set(name, modulePromise);
    return modulePromise;
  }

  function getRegistry() {
    const out = {};
    for (const [name, entry] of registry.entries()) {
      out[name] = {
        js: entry.js,
        css: [...entry.css],
        deps: [...entry.deps],
      };
    }
    return out;
  }

  function getLoadedCss() {
    return Array.from(stylePromises.keys());
  }

  function getLoadedModules() {
    return Array.from(modulePromises.keys());
  }

  function normalizeEntry(entry = {}) {
    return {
      js: String(entry.js || ""),
      css: Array.isArray(entry.css) ? uniqueStrings(entry.css) : [],
      deps: Array.isArray(entry.deps) ? uniqueStrings(entry.deps) : [],
    };
  }

  function ensureStyleHref(path, parent) {
    const href = toAbsoluteUrl(path);
    if (stylePromises.has(href)) {
      return stylePromises.get(href);
    }
    const promise = new Promise((resolvePromise, rejectPromise) => {
      const existing = document.querySelector(`link[data-ui-loader-href="${cssEscape(href)}"]`);
      if (existing) {
        resolvePromise(existing);
        return;
      }
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.dataset.uiLoaderHref = href;
      link.addEventListener("load", () => resolvePromise(link), { once: true });
      link.addEventListener("error", () => {
        stylePromises.delete(href);
        rejectPromise(new Error(`Failed to load stylesheet: ${href}`));
      }, { once: true });
      parent.appendChild(link);
    });
    stylePromises.set(href, promise);
    return promise;
  }

  return {
    has,
    register,
    unregister,
    resolve,
    load,
    loadMany,
    import: importComponent,
    ensureStyles,
    getRegistry,
    getLoadedCss,
    getLoadedModules,
  };
}

export const uiLoader = createUiLoader();

if (typeof window !== "undefined") {
  window.uiLoader = uiLoader;
}

function toAbsoluteUrl(path) {
  return new URL(String(path || ""), import.meta.url).href;
}

function getStyleParent(parent) {
  if (parent && typeof parent.appendChild === "function") {
    return parent;
  }
  return document.head || document.documentElement;
}

function uniqueStrings(values) {
  return Array.from(new Set(values.map((value) => String(value || "")).filter(Boolean)));
}

function cssEscape(value) {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
    return CSS.escape(value);
  }
  return String(value).replace(/"/g, '\\"');
}
