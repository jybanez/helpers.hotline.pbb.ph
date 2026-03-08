import { createElement, clearNode } from "./ui.dom.js";
import { createEventBag } from "./ui.events.js";

const DEFAULT_OPTIONS = {
  className: "",
  laneTitleKey: "title",
  laneIdKey: "id",
  cardIdKey: "id",
  cardTitleKey: "title",
  cardMetaKey: "meta",
  draggable: true,
  onCardMove: null,
  onCardClick: null,
};

export function createKanban(container, lanes = [], options = {}) {
  const events = createEventBag();
  let currentOptions = normalizeOptions(options);
  let currentLanes = normalizeLanes(lanes, currentOptions);
  let dragCardId = null;
  let dragFromLaneId = null;

  function render() {
    if (!container || container.nodeType !== 1) {
      return;
    }
    events.clear();
    clearNode(container);

    const root = createElement("section", {
      className: `ui-kanban ${currentOptions.className || ""}`.trim(),
    });
    currentLanes.forEach((lane) => {
      root.appendChild(renderLane(lane));
    });
    container.appendChild(root);
  }

  function renderLane(lane) {
    const laneNode = createElement("section", {
      className: "ui-kanban-lane",
      attrs: { "data-lane-id": lane.id },
    });
    const header = createElement("header", { className: "ui-kanban-lane-header" });
    header.appendChild(createElement("h4", { className: "ui-title", text: lane.title }));
    header.appendChild(createElement("span", { className: "ui-kanban-count", text: String(lane.cards.length) }));
    laneNode.appendChild(header);

    const cards = createElement("div", { className: "ui-kanban-cards" });
    events.on(cards, "dragover", (event) => {
      if (!currentOptions.draggable || !dragCardId) {
        return;
      }
      event.preventDefault();
      cards.classList.add("is-drop-target");
    });
    events.on(cards, "dragleave", () => cards.classList.remove("is-drop-target"));
    events.on(cards, "drop", (event) => {
      event.preventDefault();
      cards.classList.remove("is-drop-target");
      if (!dragCardId || !dragFromLaneId) {
        return;
      }
      moveCard(dragCardId, dragFromLaneId, lane.id);
      dragCardId = null;
      dragFromLaneId = null;
    });

    if (!lane.cards.length) {
      cards.appendChild(createElement("p", { className: "ui-kanban-empty", text: "No cards." }));
    } else {
      lane.cards.forEach((card) => {
        cards.appendChild(renderCard(card, lane.id));
      });
    }
    laneNode.appendChild(cards);
    return laneNode;
  }

  function renderCard(card, laneId) {
    const node = createElement("article", {
      className: "ui-kanban-card",
      attrs: {
        "data-card-id": card.id,
        draggable: currentOptions.draggable ? "true" : null,
      },
    });
    node.appendChild(createElement("h5", { className: "ui-kanban-card-title", text: card.title }));
    if (card.meta) {
      node.appendChild(createElement("p", { className: "ui-kanban-card-meta", text: card.meta }));
    }

    events.on(node, "click", () => {
      currentOptions.onCardClick?.(card, laneId);
    });
    if (currentOptions.draggable) {
      events.on(node, "dragstart", (event) => {
        dragCardId = card.id;
        dragFromLaneId = laneId;
        node.classList.add("is-dragging");
        event.dataTransfer?.setData("text/plain", card.id);
        event.dataTransfer?.setData("application/x-kanban-lane", laneId);
      });
      events.on(node, "dragend", () => {
        node.classList.remove("is-dragging");
        dragCardId = null;
        dragFromLaneId = null;
      });
    }
    return node;
  }

  function moveCard(cardId, fromLaneId, toLaneId) {
    if (!cardId || !fromLaneId || !toLaneId) {
      return;
    }
    if (fromLaneId === toLaneId) {
      return;
    }
    const fromLane = currentLanes.find((lane) => lane.id === fromLaneId);
    const toLane = currentLanes.find((lane) => lane.id === toLaneId);
    if (!fromLane || !toLane) {
      return;
    }
    const index = fromLane.cards.findIndex((card) => card.id === cardId);
    if (index < 0) {
      return;
    }
    const [card] = fromLane.cards.splice(index, 1);
    toLane.cards.push(card);
    currentOptions.onCardMove?.({
      card,
      fromLaneId,
      toLaneId,
      lanes: currentLanes.map(cloneLane),
    });
    render();
  }

  function update(nextLanes = currentLanes, nextOptions = {}) {
    currentOptions = normalizeOptions({ ...currentOptions, ...(nextOptions || {}) });
    currentLanes = normalizeLanes(nextLanes, currentOptions);
    render();
  }

  function destroy() {
    events.clear();
    clearNode(container);
  }

  function getState() {
    return {
      lanes: currentLanes.map(cloneLane),
      options: { ...currentOptions },
    };
  }

  render();

  return {
    update,
    moveCard,
    getState,
    destroy,
  };
}

function normalizeOptions(options) {
  return { ...DEFAULT_OPTIONS, ...(options || {}) };
}

function normalizeLanes(lanes, options) {
  if (!Array.isArray(lanes)) {
    return [];
  }
  return lanes
    .map((lane, index) => {
      if (!lane || typeof lane !== "object") {
        return null;
      }
      const id = String(lane[options.laneIdKey] ?? `lane-${index}`);
      const title = String(lane[options.laneTitleKey] ?? id);
      const cards = Array.isArray(lane.cards)
        ? lane.cards
          .map((card, cardIndex) => normalizeCard(card, `${id}-card-${cardIndex}`, options))
          .filter(Boolean)
        : [];
      return { id, title, cards };
    })
    .filter(Boolean);
}

function normalizeCard(card, fallbackId, options) {
  if (!card || typeof card !== "object") {
    return null;
  }
  return {
    id: String(card[options.cardIdKey] ?? fallbackId),
    title: String(card[options.cardTitleKey] ?? card.id ?? fallbackId),
    meta: card[options.cardMetaKey] == null ? "" : String(card[options.cardMetaKey]),
    raw: card,
  };
}

function cloneLane(lane) {
  return {
    id: lane.id,
    title: lane.title,
    cards: lane.cards.map((card) => ({
      id: card.id,
      title: card.title,
      meta: card.meta,
      raw: card.raw,
    })),
  };
}
