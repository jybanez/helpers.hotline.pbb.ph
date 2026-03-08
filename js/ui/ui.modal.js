import { createElement, clearNode } from "./ui.dom.js";
import { createEventBag } from "./ui.events.js";

const DEFAULT_OPTIONS = {
  className: "",
  title: "",
  content: null,
  footer: null,
  showHeader: true,
  showCloseButton: true,
  closeOnBackdrop: true,
  closeOnEscape: true,
  trapFocus: true,
  lockScroll: true,
  size: "md", // sm | md | lg | xl | full
  position: "center", // center | top
  animationMs: 180,
  initialFocus: null, // selector | HTMLElement | function(panel) => HTMLElement
  parent: null,
  onOpen: null,
  onClose: null,
  onBeforeClose: null,
};

const tabbableSelector = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(", ");

let bodyLockCount = 0;
let previousBodyOverflow = "";

export function createModal(options = {}) {
  const events = createEventBag();
  let currentOptions = normalizeOptions(options);
  let open = false;
  let destroyed = false;
  let closeTimer = null;
  let lastResult = null;
  let lastFocusedElement = null;

  const root = createElement("div", { className: "ui-modal-root", attrs: { "aria-hidden": "true" } });
  const backdrop = createElement("div", { className: "ui-modal-backdrop" });
  const panel = createElement("section", {
    className: "ui-modal",
    attrs: { role: "dialog", "aria-modal": "true", tabindex: "-1" },
  });
  const header = createElement("header", { className: "ui-modal-header" });
  const titleEl = createElement("h3", { className: "ui-title ui-modal-title" });
  const closeButton = createElement("button", {
    className: "ui-button ui-modal-close",
    attrs: { type: "button", "aria-label": "Close modal", title: "Close" },
    html: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>',
  });
  const body = createElement("div", { className: "ui-modal-body" });
  const footer = createElement("footer", { className: "ui-modal-footer" });

  header.append(titleEl, closeButton);
  panel.append(header, body, footer);
  root.append(backdrop, panel);

  events.on(backdrop, "click", () => {
    if (!open || !currentOptions.closeOnBackdrop) {
      return;
    }
    close({ reason: "backdrop" });
  });
  events.on(closeButton, "click", () => {
    if (!open) {
      return;
    }
    close({ reason: "close-button" });
  });

  function normalizeOptions(nextOptions) {
    return {
      ...DEFAULT_OPTIONS,
      ...(nextOptions || {}),
    };
  }

  function applyClasses() {
    root.className = `ui-modal-root ${currentOptions.className || ""}`.trim();
    panel.className = "ui-modal";
    panel.classList.add(`is-size-${normalizeSize(currentOptions.size)}`);
    panel.classList.add(`is-pos-${normalizePosition(currentOptions.position)}`);
  }

  function applySlots() {
    const showHeader = Boolean(currentOptions.showHeader);
    const showCloseButton = Boolean(currentOptions.showCloseButton);
    const titleText = currentOptions.title == null ? "" : String(currentOptions.title);
    titleEl.textContent = titleText;

    header.hidden = !showHeader;
    closeButton.hidden = !showHeader || !showCloseButton;
    header.classList.toggle("is-empty", !titleText && (!showCloseButton || closeButton.hidden));

    setSlot(body, currentOptions.content);
    setSlot(footer, currentOptions.footer);
    footer.hidden = !footer.childNodes.length;
  }

  function setSlot(target, value) {
    clearNode(target);
    if (value == null) {
      return;
    }
    if (typeof value === "function") {
      setSlot(target, value(panel));
      return;
    }
    if (value instanceof HTMLElement) {
      target.appendChild(value);
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((entry) => setSlot(target, entry));
      return;
    }
    target.appendChild(document.createTextNode(String(value)));
  }

  function mount(parent = currentOptions.parent || document.body) {
    if (root.parentNode || !parent) {
      return;
    }
    parent.appendChild(root);
  }

  function unmount() {
    if (root.parentNode) {
      root.parentNode.removeChild(root);
    }
  }

  function attachDocumentListeners() {
    document.addEventListener("keydown", onDocumentKeyDown, true);
  }

  function detachDocumentListeners() {
    document.removeEventListener("keydown", onDocumentKeyDown, true);
  }

  function onDocumentKeyDown(event) {
    if (!open) {
      return;
    }
    if (event.key === "Escape" && currentOptions.closeOnEscape) {
      event.preventDefault();
      close({ reason: "escape" });
      return;
    }
    if (event.key === "Tab" && currentOptions.trapFocus) {
      trapFocusInPanel(event);
    }
  }

  function trapFocusInPanel(event) {
    const focusable = getFocusable(panel);
    if (!focusable.length) {
      event.preventDefault();
      panel.focus();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;
    if (event.shiftKey) {
      if (active === first || !panel.contains(active)) {
        event.preventDefault();
        last.focus();
      }
    } else if (active === last || !panel.contains(active)) {
      event.preventDefault();
      first.focus();
    }
  }

  function getFocusable(node) {
    return Array.from(node.querySelectorAll(tabbableSelector)).filter((el) => {
      if (!(el instanceof HTMLElement)) {
        return false;
      }
      if (el.hasAttribute("disabled")) {
        return false;
      }
      if (el.getAttribute("aria-hidden") === "true") {
        return false;
      }
      return el.offsetParent !== null || el === document.activeElement;
    });
  }

  function focusInitial() {
    const nextFocus = resolveInitialFocus();
    if (nextFocus) {
      nextFocus.focus();
      return;
    }
    const focusable = getFocusable(panel);
    if (focusable.length) {
      focusable[0].focus();
      return;
    }
    panel.focus();
  }

  function resolveInitialFocus() {
    const value = currentOptions.initialFocus;
    if (!value) {
      return null;
    }
    if (typeof value === "function") {
      const resolved = value(panel);
      return resolved instanceof HTMLElement ? resolved : null;
    }
    if (typeof value === "string") {
      const match = panel.querySelector(value);
      return match instanceof HTMLElement ? match : null;
    }
    return value instanceof HTMLElement ? value : null;
  }

  function lockBodyScroll() {
    if (!currentOptions.lockScroll) {
      return;
    }
    if (bodyLockCount === 0) {
      previousBodyOverflow = document.body.style.overflow || "";
      document.body.style.overflow = "hidden";
      document.body.classList.add("ui-modal-body-lock");
    }
    bodyLockCount += 1;
  }

  function unlockBodyScroll() {
    if (!currentOptions.lockScroll) {
      return;
    }
    bodyLockCount = Math.max(0, bodyLockCount - 1);
    if (bodyLockCount === 0) {
      document.body.style.overflow = previousBodyOverflow;
      document.body.classList.remove("ui-modal-body-lock");
    }
  }

  function restoreFocus() {
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      try {
        lastFocusedElement.focus();
      } catch (error) {
        // Ignore focus restore failures.
      }
    }
    lastFocusedElement = null;
  }

  function update(nextOptions = {}) {
    if (destroyed) {
      return;
    }
    currentOptions = normalizeOptions({ ...currentOptions, ...(nextOptions || {}) });
    applyClasses();
    applySlots();
  }

  function openModal(content = undefined, nextOptions = undefined) {
    if (destroyed) {
      return false;
    }
    if (nextOptions && typeof nextOptions === "object") {
      currentOptions = normalizeOptions({ ...currentOptions, ...nextOptions });
    }
    if (content !== undefined) {
      currentOptions.content = content;
    }
    applyClasses();
    applySlots();

    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
    mount();
    lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    root.setAttribute("aria-hidden", "false");
    root.classList.remove("is-closing");
    root.classList.add("is-mounted");
    lockBodyScroll();
    attachDocumentListeners();

    open = true;
    requestAnimationFrame(() => {
      if (!open) {
        return;
      }
      root.classList.add("is-open");
      focusInitial();
    });
    currentOptions.onOpen?.({ panel, body, footer, header, closeButton });
    return true;
  }

  async function close(meta = {}) {
    if (!open || destroyed) {
      return false;
    }
    const beforeClose = currentOptions.onBeforeClose;
    if (typeof beforeClose === "function") {
      const allowed = await beforeClose(meta);
      if (allowed === false) {
        return false;
      }
    }

    open = false;
    lastResult = meta?.result ?? null;
    root.classList.remove("is-open");
    root.classList.add("is-closing");
    root.setAttribute("aria-hidden", "true");
    detachDocumentListeners();
    unlockBodyScroll();

    const finalize = () => {
      if (open || destroyed) {
        return;
      }
      root.classList.remove("is-closing");
      root.classList.remove("is-mounted");
      unmount();
      restoreFocus();
      currentOptions.onClose?.(meta);
    };

    const onTransitionEnd = (event) => {
      if (event.target !== root) {
        return;
      }
      root.removeEventListener("transitionend", onTransitionEnd);
      finalize();
    };
    root.addEventListener("transitionend", onTransitionEnd);
    closeTimer = setTimeout(() => {
      root.removeEventListener("transitionend", onTransitionEnd);
      finalize();
      closeTimer = null;
    }, Math.max(120, Number(currentOptions.animationMs) || 180) + 120);
    return true;
  }

  function destroy() {
    if (destroyed) {
      return;
    }
    destroyed = true;
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
    detachDocumentListeners();
    unlockBodyScroll();
    events.clear();
    unmount();
  }

  function getState() {
    return {
      open,
      options: { ...currentOptions },
      lastResult,
    };
  }

  update(currentOptions);

  return {
    open: openModal,
    close,
    update,
    setContent(content) {
      update({ content });
    },
    setFooter(nextFooter) {
      update({ footer: nextFooter });
    },
    setTitle(nextTitle) {
      update({ title: nextTitle });
    },
    destroy,
    getState,
    refs: {
      root,
      backdrop,
      panel,
      header,
      title: titleEl,
      body,
      footer,
      closeButton,
    },
  };
}

function normalizeSize(size) {
  const value = String(size || "md").toLowerCase();
  if (value === "sm" || value === "md" || value === "lg" || value === "xl" || value === "full") {
    return value;
  }
  return "md";
}

function normalizePosition(position) {
  const value = String(position || "center").toLowerCase();
  return value === "top" ? "top" : "center";
}
