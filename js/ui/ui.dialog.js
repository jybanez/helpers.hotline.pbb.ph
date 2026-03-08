import { createElement } from "./ui.dom.js";
import { createModal } from "./ui.modal.js";

function createButton(label, className = "ui-button", attrs = {}) {
  return createElement("button", {
    className,
    text: label,
    attrs: { type: "button", ...attrs },
  });
}

export function uiAlert(message, options = {}) {
  return new Promise((resolve) => {
    let settled = false;
    const messageEl = createElement("p", { className: "ui-dialog-message", text: String(message || "") });
    const ok = createButton(options.okText || "OK", "ui-button ui-button-primary");
    const footer = createElement("div", { className: "ui-dialog-footer-actions" });
    footer.appendChild(ok);

    const modal = createModal({
      title: options.title || "Notice",
      content: messageEl,
      footer,
      size: options.size || "sm",
      closeOnBackdrop: Boolean(options.allowBackdropClose),
      closeOnEscape: options.allowEscClose !== false,
      parent: options.parent || document.body,
      className: options.className || "",
      showCloseButton: options.showCloseButton !== false,
      onClose() {
        if (settled) {
          return;
        }
        settled = true;
        resolve(true);
        modal.destroy();
      },
    });

    function close(result) {
      if (settled) {
        return;
      }
      settled = true;
      resolve(result);
      modal.close({ result }).then(() => modal.destroy());
    }

    ok.addEventListener("click", () => close(true), { once: true });
    modal.open();
    ok.focus();
  });
}

export function uiConfirm(message, options = {}) {
  return new Promise((resolve) => {
    let settled = false;
    const messageEl = createElement("p", { className: "ui-dialog-message", text: String(message || "") });
    const cancel = createButton(options.cancelText || "Cancel", "ui-button");
    const confirm = createButton(options.confirmText || "Confirm", "ui-button ui-button-primary");
    const footer = createElement("div", { className: "ui-dialog-footer-actions" });
    footer.append(cancel, confirm);

    const modal = createModal({
      title: options.title || "Confirm",
      content: messageEl,
      footer,
      size: options.size || "sm",
      closeOnBackdrop: Boolean(options.allowBackdropClose),
      closeOnEscape: options.allowEscClose !== false,
      parent: options.parent || document.body,
      className: options.className || "",
      showCloseButton: options.showCloseButton !== false,
      onClose() {
        if (settled) {
          return;
        }
        settled = true;
        resolve(false);
        modal.destroy();
      },
    });

    function close(result) {
      if (settled) {
        return;
      }
      settled = true;
      resolve(Boolean(result));
      modal.close({ result }).then(() => modal.destroy());
    }

    cancel.addEventListener("click", () => close(false), { once: true });
    confirm.addEventListener("click", () => close(true), { once: true });
    modal.open();
    confirm.focus();
  });
}

export function uiPrompt(message, options = {}) {
  return new Promise((resolve) => {
    let settled = false;
    const messageEl = createElement("p", { className: "ui-dialog-message", text: String(message || "") });
    const input = createElement("input", {
      className: "ui-input",
      attrs: { type: "text", placeholder: options.placeholder || "" },
    });
    input.value = String(options.defaultValue || "");
    const cancel = createButton(options.cancelText || "Cancel", "ui-button");
    const submit = createButton(options.submitText || "Submit", "ui-button ui-button-primary");
    const content = createElement("div", { className: "ui-dialog-prompt-body" });
    content.append(messageEl, input);
    const footer = createElement("div", { className: "ui-dialog-footer-actions" });
    footer.append(cancel, submit);

    const modal = createModal({
      title: options.title || "Input",
      content,
      footer,
      size: options.size || "sm",
      closeOnBackdrop: Boolean(options.allowBackdropClose),
      closeOnEscape: options.allowEscClose !== false,
      parent: options.parent || document.body,
      className: options.className || "",
      showCloseButton: options.showCloseButton !== false,
      onClose() {
        if (settled) {
          return;
        }
        settled = true;
        resolve(null);
        modal.destroy();
      },
    });

    function close(result) {
      if (settled) {
        return;
      }
      settled = true;
      resolve(result);
      modal.close({ result }).then(() => modal.destroy());
    }

    cancel.addEventListener("click", () => close(null), { once: true });
    submit.addEventListener("click", () => close(input.value), { once: true });
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        close(input.value);
      }
    });
    modal.open();
    input.focus();
    input.select();
  });
}
