import { createElement, clearNode } from "./ui.dom.js";
import { createEventBag } from "./ui.events.js";

const DEFAULT_OPTIONS = {
  className: "",
  expandAll: false,
  selectable: true,
  checkable: false,
  onToggle: null,
  onSelect: null,
  onCheck: null,
};

export function createTree(container, data = [], options = {}) {
  const events = createEventBag();
  let currentOptions = normalizeOptions(options);
  let treeData = normalizeNodes(data);
  let expanded = new Set();
  let selectedId = null;
  let checked = new Set();

  if (currentOptions.expandAll) {
    expandAll(treeData, expanded);
  }

  function render() {
    if (!container || container.nodeType !== 1) {
      return;
    }
    events.clear();
    clearNode(container);

    const root = createElement("div", {
      className: `ui-tree ${currentOptions.className || ""}`.trim(),
      attrs: { role: "tree" },
    });
    if (!treeData.length) {
      root.appendChild(createElement("p", { className: "ui-tree-empty", text: "No tree nodes." }));
      container.appendChild(root);
      return;
    }
    root.appendChild(renderNodes(treeData, 1));
    container.appendChild(root);
  }

  function renderNodes(nodes, level) {
    const list = createElement("div", { className: "ui-tree-list", attrs: { role: "group" } });
    nodes.forEach((node) => {
      const hasChildren = node.children.length > 0;
      const isExpanded = expanded.has(node.id);
      const item = createElement("div", {
        className: `ui-tree-item${selectedId === node.id ? " is-selected" : ""}`,
        attrs: { role: "treeitem", "aria-level": String(level), "aria-expanded": hasChildren ? String(isExpanded) : null },
      });
      const row = createElement("div", { className: "ui-tree-row" });
      const toggle = createElement("button", {
        className: `ui-tree-toggle${hasChildren ? "" : " is-empty"}`,
        attrs: { type: "button", "aria-label": hasChildren ? "Toggle node" : "Leaf node" },
        html: hasChildren ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 10 4 4 4-4"/></svg>' : "",
      });
      if (hasChildren && isExpanded) {
        toggle.classList.add("is-open");
      }
      events.on(toggle, "click", () => {
        if (!hasChildren) {
          return;
        }
        if (isExpanded) {
          expanded.delete(node.id);
        } else {
          expanded.add(node.id);
        }
        currentOptions.onToggle?.(node, expanded.has(node.id));
        render();
      });
      row.appendChild(toggle);

      if (currentOptions.checkable) {
        const checkbox = createElement("input", {
          className: "ui-tree-check",
          attrs: { type: "checkbox" },
        });
        checkbox.checked = checked.has(node.id);
        events.on(checkbox, "change", () => {
          if (checkbox.checked) {
            checked.add(node.id);
          } else {
            checked.delete(node.id);
          }
          currentOptions.onCheck?.(node, checkbox.checked, Array.from(checked));
        });
        row.appendChild(checkbox);
      }

      const label = createElement("button", {
        className: "ui-tree-label",
        attrs: { type: "button" },
        text: node.label,
      });
      events.on(label, "click", () => {
        if (currentOptions.selectable) {
          selectedId = node.id;
          currentOptions.onSelect?.(node);
          render();
        }
      });
      row.appendChild(label);
      item.appendChild(row);

      if (hasChildren && isExpanded) {
        item.appendChild(renderNodes(node.children, level + 1));
      }

      list.appendChild(item);
    });
    return list;
  }

  function update(nextData = treeData, nextOptions = {}) {
    treeData = normalizeNodes(nextData);
    currentOptions = normalizeOptions({ ...currentOptions, ...(nextOptions || {}) });
    if (currentOptions.expandAll) {
      expanded.clear();
      expandAll(treeData, expanded);
    }
    render();
  }

  function destroy() {
    events.clear();
    clearNode(container);
  }

  function getState() {
    return {
      data: treeData.map(cloneNode),
      expanded: Array.from(expanded),
      selectedId,
      checked: Array.from(checked),
      options: { ...currentOptions },
    };
  }

  render();

  return {
    update,
    expandAll() {
      expandAll(treeData, expanded);
      render();
    },
    collapseAll() {
      expanded.clear();
      render();
    },
    setSelected(nodeId) {
      selectedId = nodeId == null ? null : String(nodeId);
      render();
    },
    getState,
    destroy,
  };
}

function normalizeOptions(options) {
  return { ...DEFAULT_OPTIONS, ...(options || {}) };
}

function normalizeNodes(data) {
  if (!Array.isArray(data)) {
    return [];
  }
  return data
    .map((node, index) => normalizeNode(node, `node-${index}`))
    .filter(Boolean);
}

function normalizeNode(node, fallbackId) {
  if (!node || typeof node !== "object") {
    return null;
  }
  const id = String(node.id ?? fallbackId);
  return {
    id,
    label: String(node.label ?? node.name ?? id),
    children: Array.isArray(node.children)
      ? node.children.map((child, index) => normalizeNode(child, `${id}-${index}`)).filter(Boolean)
      : [],
  };
}

function expandAll(nodes, set) {
  nodes.forEach((node) => {
    if (node.children.length) {
      set.add(node.id);
      expandAll(node.children, set);
    }
  });
}

function cloneNode(node) {
  return {
    id: node.id,
    label: node.label,
    children: node.children.map(cloneNode),
  };
}
