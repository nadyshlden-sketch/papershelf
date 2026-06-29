const sections = [
  "Introduction",
  "Literature Review",
  "Methodology",
  "Discussion",
  "Conclusion",
];

const storageKey = "papershelf-state";

const state = {
  sources: [],
  cards: [],
};

let sourceShelfCollapsed = false;

const sourceForm = document.querySelector("#sourceForm");
const quoteForm = document.querySelector("#quoteForm");
const cardForm = document.querySelector("#cardForm");
const sourceList = document.querySelector("#sourceList");
const sourceShelf = document.querySelector(".source-shelf");
const appShell = document.querySelector(".app-shell");
const board = document.querySelector("#board");
const sourceCount = document.querySelector("#sourceCount");
const toggleSourceShelf = document.querySelector("#toggleSourceShelf");
const quoteSource = document.querySelector("#quoteSource");
const cardSection = document.querySelector("#cardSection");
const cardQuote = document.querySelector("#cardQuote");
const quotePreview = document.querySelector("#quotePreview");
const cardComposer = document.querySelector("#cardComposer");
const cardComposerSummary = cardComposer.querySelector("summary");
const sourceTool = document.querySelector("#sourceTool");
const quoteTool = document.querySelector("#quoteTool");
const exportMarkdown = document.querySelector("#exportMarkdown");
const resetWorkspace = document.querySelector("#resetWorkspace");

const makeId = () => {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const citationFor = (source, quote) => {
  return `(${source.author}, ${source.year}, p. ${quote.page})`;
};

const quoteLead = (text, wordCount = 4) => {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lead = words.slice(0, wordCount).join(" ");
  return words.length > wordCount ? `${lead}...` : lead;
};

const loadState = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
    if (Array.isArray(saved.sources)) state.sources = saved.sources;
    state.sources = state.sources.map((source) => ({
      ...source,
      collapsed:
        typeof source.collapsed === "boolean"
          ? source.collapsed
          : Array.isArray(source.quotes) && source.quotes.length > 1,
    }));
    if (Array.isArray(saved.cards)) {
      state.cards = saved.cards.map((card) => ({
        ...card,
        status: card.status === "done" ? "done" : "writing",
        collapsed: card.collapsed === true,
      }));
    }
  } catch {
    state.sources = [];
    state.cards = [];
  }
};

const saveState = () => {
  localStorage.setItem(storageKey, JSON.stringify(state));
};

const loadLayout = () => {
  sourceShelfCollapsed = false;
};

const allQuotes = () => {
  return state.sources.flatMap((source) =>
    source.quotes.map((quote) => ({
      ...quote,
      source,
      citation: citationFor(source, quote),
    })),
  );
};

const statusLabel = (status) => (status === "done" ? "Done" : "Writing");

const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

const fillSelect = (select, items, placeholder, getLabel) => {
  select.replaceChildren();

  const placeholderOption = document.createElement("option");
  placeholderOption.value = "";
  placeholderOption.textContent = placeholder;
  select.append(placeholderOption);

  items.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = getLabel(item);
    select.append(option);
  });
};

const copyText = async (text) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  textArea.style.top = "0";
  document.body.append(textArea);
  textArea.focus();
  textArea.select();

  try {
    if (document.execCommand("copy")) return;
  } finally {
    textArea.remove();
  }

  if (navigator.clipboard?.writeText) {
    await Promise.race([
      navigator.clipboard.writeText(text),
      new Promise((_, reject) => {
        window.setTimeout(() => reject(new Error("Clipboard write timed out")), 800);
      }),
    ]);
    return;
  }

  throw new Error("Clipboard is unavailable");
};

const renderSourceSelects = () => {
  fillSelect(
    quoteSource,
    state.sources,
    state.sources.length ? "Choose a source" : "Add a source first",
    (source) => `${source.author}, ${source.year} - ${source.title}`,
  );

  const quotes = allQuotes();
  fillSelect(
    cardQuote,
    quotes,
    quotes.length ? "Choose a quote" : "Add a quote first",
    (quote) => `"${quoteLead(quote.text)}" - ${quote.source.author}, ${quote.source.year}, p. ${quote.page}`,
  );
};

const renderSectionSelect = () => {
  cardSection.replaceChildren();

  sections.forEach((section) => {
    const option = document.createElement("option");
    option.value = section;
    option.textContent = section;
    cardSection.append(option);
  });
};

const renderSources = () => {
  sourceCount.textContent = `${state.sources.length} ${
    state.sources.length === 1 ? "source" : "sources"
  }`;

  if (!state.sources.length) {
    sourceList.replaceChildren(el("p", "empty-state", "No sources yet"));
    return;
  }

  sourceList.replaceChildren(
    ...state.sources.map((source) => {
      const item = el("details", "source-item");
      item.open = !source.collapsed;
      item.dataset.sourceId = source.id;

      const title = el("summary", "source-title");
      const titleText = el("div", "source-title-text");
      const quoteCount = el(
        "span",
        "source-quote-count",
        `${source.quotes.length} ${source.quotes.length === 1 ? "quote" : "quotes"}`,
      );
      titleText.append(
        el("strong", "", `${source.author}, ${source.year}`),
        el("span", "", source.title),
      );
      title.append(
        titleText,
        quoteCount,
      );

      const quoteList = el("ul", "quote-list");
      if (!source.quotes.length) {
        quoteList.append(el("li", "empty-state", "No quotes yet"));
      } else {
        quoteList.append(
          ...source.quotes.map((quote) =>
            el("li", "quote-line", `p. ${quote.page}: ${quote.text}`),
          ),
        );
      }

      item.append(title, quoteList);
      return item;
    }),
  );
};

const renderLayout = () => {
  appShell.classList.toggle("source-collapsed", sourceShelfCollapsed);
  toggleSourceShelf.setAttribute("aria-expanded", String(!sourceShelfCollapsed));
  const shelfAction = sourceShelfCollapsed ? "Expand source shelf" : "Collapse source shelf";
  toggleSourceShelf.setAttribute("aria-label", shelfAction);
  toggleSourceShelf.title = shelfAction;
};

const renderCardComposerToggle = () => {
  cardComposerSummary.textContent = cardComposer.open ? "X" : "Add card";
  cardComposerSummary.setAttribute(
    "aria-label",
    cardComposer.open ? "Close card form" : "Add card",
  );
  cardComposerSummary.title = cardComposer.open ? "Close card form" : "Add card";
};

const revealShelfTool = (tool) => {
  if (!tool.open) return;

  window.requestAnimationFrame(() => {
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth";
    const shelfCanScroll = sourceShelf.scrollHeight > sourceShelf.clientHeight + 1;

    if (shelfCanScroll) {
      const shelfRect = sourceShelf.getBoundingClientRect();
      const toolRect = tool.getBoundingClientRect();
      sourceShelf.scrollTo({
        top: Math.max(0, sourceShelf.scrollTop + toolRect.top - shelfRect.top - 12),
        behavior,
      });
      return;
    }

    const headerHeight = document.querySelector(".app-header")?.getBoundingClientRect().height ?? 0;
    window.scrollTo({
      top: Math.max(0, window.scrollY + tool.getBoundingClientRect().top - headerHeight - 12),
      behavior,
    });
  });
};

const renderBoard = () => {
  board.replaceChildren(
    ...sections.map((section, index) => {
      const cards = state.cards.filter((card) => card.section === section);
      const column = el("section", `section-column section-${index + 1}`);
      const header = document.createElement("header");
      header.append(
        el("h3", "", `${String(index + 1).padStart(2, "0")}. ${section}`),
        el("span", "", `${cards.length} ${cards.length === 1 ? "card" : "cards"}`),
      );

      const cardList = el("div", "card-list");
      if (cards.length) {
        cardList.append(
          ...cards.map((card) => {
            const status = card.status === "done" ? "done" : "writing";
            const node = el(
              "article",
              `paper-card status-${status}${card.collapsed ? " card-collapsed" : ""}`,
            );
            node.dataset.cardId = card.id;
            node.setAttribute("aria-expanded", String(!card.collapsed));
            node.setAttribute("title", `${card.collapsed ? "Expand" : "Collapse"} card`);
            const titleRow = el("div", "card-title-row");
            const cardActions = el("div", "card-actions");
            const statusButton = el("button", "card-status-toggle", statusLabel(status));
            const quoteRow = el("div", "card-quote-row");
            const copyButton = el("button", "card-copy", "copy");
            const deleteButton = el("button", "card-delete", "X");

            statusButton.type = "button";
            statusButton.dataset.cardId = card.id;
            statusButton.dataset.status = status;
            statusButton.setAttribute("aria-pressed", String(status === "done"));
            statusButton.setAttribute(
              "aria-label",
              `Mark "${card.header}" as ${status === "done" ? "writing" : "done"}`,
            );

            copyButton.type = "button";
            copyButton.dataset.cardId = card.id;
            copyButton.title = "Copy quote";
            copyButton.setAttribute("aria-label", `Copy quote from "${card.header}"`);

            deleteButton.type = "button";
            deleteButton.dataset.cardId = card.id;
            deleteButton.setAttribute("aria-label", `Delete "${card.header}"`);

            cardActions.append(statusButton, deleteButton);
            quoteRow.append(el("blockquote", "", card.quoteText), copyButton);
            titleRow.append(el("h4", "", card.header), cardActions);
            node.append(
              titleRow,
              el("p", "claim", card.claim),
              quoteRow,
              el("div", "citation", card.citation),
            );
            return node;
          }),
        );
      }

      const addCardButton = el(
        "button",
        "add-card-control",
        cards.length ? "Add another card" : "Add card",
      );
      addCardButton.type = "button";
      addCardButton.dataset.section = section;
      cardList.append(addCardButton);

      column.append(header, cardList);
      return column;
    }),
  );
};

const renderQuotePreview = () => {
  const quote = allQuotes().find((item) => item.id === cardQuote.value);

  if (!quote) {
    quotePreview.textContent = "Choose a quote to preview it here.";
    return;
  }

  quotePreview.textContent = `"${quote.text}" ${quote.citation}`;
};

const render = () => {
  saveState();
  renderLayout();
  renderSourceSelects();
  renderSources();
  renderBoard();
  renderQuotePreview();
  renderCardComposerToggle();
};

const buildMarkdown = () => {
  const lines = ["# PaperShelf Outline", ""];

  sections.forEach((section) => {
    const cards = state.cards.filter((card) => card.section === section);
    lines.push(`## ${section}`, "");

    if (!cards.length) {
      lines.push("_No cards yet._", "");
      return;
    }

    cards.forEach((card) => {
      lines.push(`### ${card.header}`, "", card.claim, "");
      lines.push(`Status: ${statusLabel(card.status)}`, "");
      lines.push(`> ${card.quoteText}`, "", card.citation, "");
    });
  });

  return `${lines.join("\n").trim()}\n`;
};

const downloadMarkdown = () => {
  const blob = new Blob([buildMarkdown()], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "papershelf-outline.md";
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

sourceForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(sourceForm);

  state.sources.push({
    id: makeId(),
    author: formData.get("author").trim(),
    year: formData.get("year").trim(),
    title: formData.get("title").trim(),
    collapsed: false,
    quotes: [],
  });

  sourceForm.reset();
  sourceTool.open = false;
  quoteTool.open = true;
  render();
  revealShelfTool(quoteTool);
});

quoteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(quoteForm);
  const source = state.sources.find((item) => item.id === formData.get("sourceId"));

  if (!source) return;

  source.quotes.push({
    id: makeId(),
    page: formData.get("page").trim(),
    text: formData.get("quote").trim(),
  });

  quoteForm.reset();
  render();
});

sourceList.addEventListener(
  "toggle",
  (event) => {
    const item = event.target.closest(".source-item");
    if (!item) return;

    const source = state.sources.find((entry) => entry.id === item.dataset.sourceId);
    if (!source) return;

    source.collapsed = !item.open;
    saveState();
  },
  true,
);

board.addEventListener("click", async (event) => {
  const copyButton = event.target.closest(".card-copy");
  if (copyButton) {
    const card = state.cards.find((item) => item.id === copyButton.dataset.cardId);
    if (!card) return;

    const originalLabel = copyButton.getAttribute("aria-label");
    const originalTitle = copyButton.title;
    try {
      await copyText(card.quoteText);
      copyButton.setAttribute("aria-label", `Copied quote from "${card.header}"`);
      copyButton.title = "Copied";
    } catch {
      copyButton.setAttribute("aria-label", `Could not copy quote from "${card.header}"`);
      copyButton.title = "Copy failed";
    }
    window.setTimeout(() => {
      copyButton.setAttribute("aria-label", originalLabel);
      copyButton.title = originalTitle;
    }, 1200);
    return;
  }

  const deleteButton = event.target.closest(".card-delete");
  if (deleteButton) {
    state.cards = state.cards.filter((item) => item.id !== deleteButton.dataset.cardId);
    render();
    return;
  }

  const statusButton = event.target.closest(".card-status-toggle");
  if (statusButton) {
    const card = state.cards.find((item) => item.id === statusButton.dataset.cardId);
    if (!card) return;

    card.status = card.status === "done" ? "writing" : "done";
    render();
    return;
  }

  const cardNode = event.target.closest(".paper-card");
  if (cardNode) {
    const card = state.cards.find((item) => item.id === cardNode.dataset.cardId);
    if (!card) return;

    card.collapsed = !card.collapsed;
    render();
    return;
  }

  const button = event.target.closest(".add-card-control");
  if (!button) return;

  cardComposer.open = true;
  cardSection.value = button.dataset.section;
  document.querySelector("#cardHeader").focus();
});

cardForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(cardForm);
  const quote = allQuotes().find((item) => item.id === formData.get("quoteId"));

  if (!quote) return;

  state.cards.push({
    id: makeId(),
    section: formData.get("section"),
    header: formData.get("header").trim(),
    claim: formData.get("claim").trim(),
    quoteText: quote.text,
    citation: quote.citation,
    status: "writing",
    collapsed: false,
  });

  cardForm.reset();
  cardComposer.open = false;
  render();
});

cardQuote.addEventListener("change", renderQuotePreview);
cardComposer.addEventListener("toggle", renderCardComposerToggle);
sourceTool.addEventListener("toggle", () => revealShelfTool(sourceTool));
quoteTool.addEventListener("toggle", () => revealShelfTool(quoteTool));
toggleSourceShelf.addEventListener("click", () => {
  sourceShelfCollapsed = !sourceShelfCollapsed;
  renderLayout();
});
exportMarkdown.addEventListener("click", downloadMarkdown);
resetWorkspace.addEventListener("click", () => {
  const confirmed = confirm(
    "Start over and delete all cards, sources, and saved quotes? This cannot be undone.",
  );

  if (!confirmed) return;

  state.sources = [];
  state.cards = [];
  sourceForm.reset();
  quoteForm.reset();
  cardForm.reset();
  cardComposer.open = false;
  sourceTool.open = false;
  quoteTool.open = false;
  localStorage.removeItem(storageKey);
  render();
});

loadState();
loadLayout();
renderSectionSelect();
render();
