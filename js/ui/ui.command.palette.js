import { createElement, clearNode } from "./ui.dom.js";
import { createEventBag } from "./ui.events.js";

const DEFAULT_OPTIONS = {
  commands: [],
  placeholder: "Search commands...",
  emptyText: "No matching commands.",
  title: "Command Palette",
  shortcut: "k",
  metaKey: true,
  ctrlKey: true,
  className: "",
  onRun: null,
};

export function createCommandPalette(options = {}) {
  const events = createEventBag();
  const docEvents = createEventBag();
  let currentOptions = normalizeOptions(options);
  let commands = normalizeCommands(currentOptions.commands);
  let open = false;
  let query = "";
  let activeIndex = 0;
  let root = null;
  let panel = null;
  let input = null;
  let list = null;

  function ensureDom() {
    if (root) {
      return;
    }
    root = createElement("div", {
      className: `ui-command-palette ${currentOptions.className || ""}`.trim(),
      attrs: { "aria-hidden": "true" },
    });
    panel = createElement("section", { className: "ui-command-palette-panel", attrs: { role: "dialog", "aria-modal": "true" } });
    const header = createElement("header", { className: "ui-command-palette-header" });
    header.appendChild(createElement("h3", { className: "ui-title", text: currentOptions.title }));

    input = createElement("input", {
      className: "ui-input ui-command-palette-input",
      attrs: { type: "search", placeholder: currentOptions.placeholder, autocomplete: "off" },
    });
    list = createElement("div", { className: "ui-command-palette-list", attrs: { role: "listbox" } });

    panel.append(header, input, list);
    root.appendChild(panel);
    document.body.appendChild(root);

    events.on(root, "click", (event) => {
      if (event.target === root) {
        close({ reason: "backdrop" });
      }
    });
    events.on(input, "input", () => {
      query = String(input.value || "");
      activeIndex = 0;
      renderList();
    });
    events.on(input, "keydown", onInputKeyDown);
    renderList();
  }

  function renderList() {
    if (!list) {
      return;
    }
    clearNode(list);
    const filtered = getFilteredCommands();
    if (!filtered.length) {
      list.appendChild(createElement("p", { className: "ui-command-palette-empty", text: currentOptions.emptyText }));
      return;
    }
    activeIndex = Math.max(0, Math.min(activeIndex, filtered.length - 1));
    filtered.forEach((command, index) => {
      const row = createElement("button", {
        className: `ui-command-palette-item${index === activeIndex ? " is-active" : ""}${command.disabled ? " is-disabled" : ""}`,
        attrs: {
          type: "button",
          role: "option",
          "aria-selected": index === activeIndex ? "true" : "false",
          ...(command.disabled ? { disabled: "disabled" } : {}),
        },
      });
      const left = createElement("span", { className: "ui-command-palette-item-left" });
      if (command.icon) {
        left.appendChild(createElement("span", { className: "ui-command-palette-item-icon", html: command.icon }));
      }
      const textWrap = createElement("span", { className: "ui-command-palette-item-text" });
      textWrap.appendChild(createElement("span", { className: "ui-command-palette-item-label", text: command.label }));
      if (command.section) {
        textWrap.appendChild(createElement("span", { className: "ui-command-palette-item-section", text: command.section }));
      }
      left.appendChild(textWrap);
      row.appendChild(left);
      if (command.shortcut) {
        row.appendChild(createElement("kbd", { className: "ui-command-palette-item-shortcut", text: command.shortcut }));
      }
      events.on(row, "mouseenter", () => {
        activeIndex = index;
        renderList();
      });
      events.on(row, "click", () => runCommand(command));
      list.appendChild(row);
    });
    ensureActiveVisible();
  }

  function ensureActiveVisible() {
    const active = list?.querySelector?.(".ui-command-palette-item.is-active");
    active?.scrollIntoView?.({ block: "nearest" });
  }

  function getFilteredCommands() {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return commands;
    }
    return commands.filter((cmd) => {
      const haystack = [cmd.label, cmd.section, cmd.keywords.join(" ")].join(" ").toLowerCase();
      return haystack.includes(needle);
    });
  }

  function onInputKeyDown(event) {
    const filtered = getFilteredCommands();
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (filtered.length) {
        activeIndex = (activeIndex + 1) % filtered.length;
        renderList();
      }
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (filtered.length) {
        activeIndex = (activeIndex - 1 + filtered.length) % filtered.length;
        renderList();
      }
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const active = filtered[activeIndex];
      if (active) {
        runCommand(active);
      }
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      close({ reason: "escape" });
    }
  }

  function runCommand(command) {
    if (!command || command.disabled) {
      return;
    }
    currentOptions.onRun?.(command);
    if (typeof command.run === "function") {
      command.run(command);
    }
    close({ reason: "run", commandId: command.id });
  }

  function openPalette() {
    ensureDom();
    if (open) {
      return;
    }
    open = true;
    root.setAttribute("aria-hidden", "false");
    root.classList.add("is-open");
    input.value = query;
    input.focus();
    input.select();
    renderList();
  }

  function close(meta = {}) {
    if (!open || !root) {
      return;
    }
    open = false;
    root.classList.remove("is-open");
    root.setAttribute("aria-hidden", "true");
  }

  function bindShortcut() {
    docEvents.clear();
    docEvents.on(document, "keydown", (event) => {
      const keyMatch = String(event.key || "").toLowerCase() === String(currentOptions.shortcut || "k").toLowerCase();
      if (!keyMatch) {
        return;
      }
      const metaOk = currentOptions.metaKey ? Boolean(event.metaKey) : true;
      const ctrlOk = currentOptions.ctrlKey ? Boolean(event.ctrlKey) : true;
      if (!metaOk && !ctrlOk) {
        return;
      }
      event.preventDefault();
      if (open) {
        close({ reason: "shortcut-toggle" });
      } else {
        openPalette();
      }
    });
  }

  function update(nextOptions = {}) {
    currentOptions = normalizeOptions({ ...currentOptions, ...(nextOptions || {}) });
    commands = normalizeCommands(currentOptions.commands);
    if (input) {
      input.setAttribute("placeholder", currentOptions.placeholder);
    }
    bindShortcut();
    renderList();
  }

  function destroy() {
    docEvents.clear();
    events.clear();
    if (root?.parentNode) {
      root.parentNode.removeChild(root);
    }
    root = null;
    panel = null;
    input = null;
    list = null;
    open = false;
  }

  function getState() {
    return {
      open,
      query,
      activeIndex,
      commands: commands.map((cmd) => ({ ...cmd })),
      options: { ...currentOptions },
    };
  }

  bindShortcut();

  return {
    open: openPalette,
    close,
    update,
    setQuery(nextQuery) {
      query = String(nextQuery || "");
      if (input) {
        input.value = query;
      }
      activeIndex = 0;
      renderList();
    },
    getState,
    destroy,
  };
}

function normalizeOptions(options) {
  return { ...DEFAULT_OPTIONS, ...(options || {}) };
}

function normalizeCommands(commands) {
  if (!Array.isArray(commands)) {
    return [];
  }
  return commands
    .map((command, index) => {
      if (!command || typeof command !== "object") {
        return null;
      }
      return {
        id: String(command.id ?? `cmd-${index}`),
        label: String(command.label ?? command.id ?? `Command ${index + 1}`),
        section: command.section == null ? "" : String(command.section),
        keywords: Array.isArray(command.keywords) ? command.keywords.map((k) => String(k)) : [],
        shortcut: command.shortcut == null ? "" : String(command.shortcut),
        icon: command.icon == null ? "" : String(command.icon),
        disabled: Boolean(command.disabled),
        run: typeof command.run === "function" ? command.run : null,
      };
    })
    .filter(Boolean);
}
