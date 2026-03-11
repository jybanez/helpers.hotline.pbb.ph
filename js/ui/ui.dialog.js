import { createElement } from "./ui.dom.js";
import { createActionModal } from "./ui.modal.js";

export function uiAlert(message, options = {}) {
  return new Promise((resolve) => {
    let settled = false;
    const messageEl = createElement("p", { className: "ui-dialog-message", text: String(message || "") });

    const modal = createActionModal({
      title: options.title || "Notice",
      content: messageEl,
      actions: [
        {
          id: "ok",
          label: options.okText || "OK",
          variant: "primary",
          icon: options.okIcon || "",
          iconPosition: options.okIconPosition || "start",
          iconOnly: Boolean(options.okIconOnly),
          ariaLabel: options.okAriaLabel || "",
          autoFocus: true,
          onClick() {
            if (settled) {
              return;
            }
            settled = true;
            resolve(true);
          },
        },
      ],
      headerActions: Array.isArray(options.headerActions) ? options.headerActions : [],
      size: options.size || "sm",
      closeOnBackdrop: Boolean(options.allowBackdropClose),
      closeOnEscape: options.allowEscClose !== false,
      parent: options.parent || document.body,
      className: options.className || "",
      showCloseButton: options.showCloseButton !== false,
      onClose() {
        if (settled) {
          modal.destroy();
          return;
        }
        settled = true;
        resolve(true);
        modal.destroy();
      },
    });
    modal.open();
  });
}

export function uiConfirm(message, options = {}) {
  return new Promise((resolve) => {
    let settled = false;
    const messageEl = createElement("p", { className: "ui-dialog-message", text: String(message || "") });

    const modal = createActionModal({
      title: options.title || "Confirm",
      content: messageEl,
      actions: [
        {
          id: "cancel",
          label: options.cancelText || "Cancel",
          variant: "default",
          icon: options.cancelIcon || "",
          iconPosition: options.cancelIconPosition || "start",
          iconOnly: Boolean(options.cancelIconOnly),
          ariaLabel: options.cancelAriaLabel || "",
          onClick() {
            if (settled) {
              return;
            }
            settled = true;
            resolve(false);
          },
        },
        {
          id: "confirm",
          label: options.confirmText || "Confirm",
          variant: "primary",
          icon: options.confirmIcon || "",
          iconPosition: options.confirmIconPosition || "start",
          iconOnly: Boolean(options.confirmIconOnly),
          ariaLabel: options.confirmAriaLabel || "",
          autoFocus: true,
          onClick() {
            if (settled) {
              return;
            }
            settled = true;
            resolve(true);
          },
        },
      ],
      headerActions: Array.isArray(options.headerActions) ? options.headerActions : [],
      size: options.size || "sm",
      closeOnBackdrop: Boolean(options.allowBackdropClose),
      closeOnEscape: options.allowEscClose !== false,
      parent: options.parent || document.body,
      className: options.className || "",
      showCloseButton: options.showCloseButton !== false,
      onClose() {
        if (settled) {
          modal.destroy();
          return;
        }
        settled = true;
        resolve(false);
        modal.destroy();
      },
    });
    modal.open();
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
    const content = createElement("div", { className: "ui-dialog-prompt-body" });
    content.append(messageEl, input);

    const modal = createActionModal({
      title: options.title || "Input",
      content,
      actions: [
        {
          id: "cancel",
          label: options.cancelText || "Cancel",
          variant: "default",
          icon: options.cancelIcon || "",
          iconPosition: options.cancelIconPosition || "start",
          iconOnly: Boolean(options.cancelIconOnly),
          ariaLabel: options.cancelAriaLabel || "",
          onClick() {
            if (settled) {
              return;
            }
            settled = true;
            resolve(null);
          },
        },
        {
          id: "submit",
          label: options.submitText || "Submit",
          variant: "primary",
          icon: options.submitIcon || "",
          iconPosition: options.submitIconPosition || "start",
          iconOnly: Boolean(options.submitIconOnly),
          ariaLabel: options.submitAriaLabel || "",
          onClick() {
            if (settled) {
              return;
            }
            settled = true;
            resolve(input.value);
          },
        },
      ],
      headerActions: Array.isArray(options.headerActions) ? options.headerActions : [],
      size: options.size || "sm",
      closeOnBackdrop: Boolean(options.allowBackdropClose),
      closeOnEscape: options.allowEscClose !== false,
      parent: options.parent || document.body,
      className: options.className || "",
      showCloseButton: options.showCloseButton !== false,
      initialFocus: input,
      onClose() {
        if (settled) {
          modal.destroy();
          return;
        }
        settled = true;
        resolve(null);
        modal.destroy();
      },
    });
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (settled) {
          return;
        }
        settled = true;
        resolve(input.value);
        modal.close({ reason: "prompt-enter", result: input.value }).then(() => modal.destroy());
      }
    });
    modal.open();
    input.focus();
    input.select();
  });
}
