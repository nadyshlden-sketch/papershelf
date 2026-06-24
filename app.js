const sections = [
  "Introduction",
  "Literature Review",
  "Methodology",
  "Discussion",
  "Conclusion",
];

const state = {
  sources: [],
  cards: [],
};

const sourceForm = document.querySelector("#sourceForm");
const quoteForm = document.querySelector("#quoteForm");
const cardForm = document.querySelector("#cardForm");
const sourceList = document.querySelector("#sourceList");
const board = document.querySelector("#board");
const sourceCount = document.querySelector("#sourceCount");
const quoteSource = document.querySelector("#quoteSource");
const cardSection = document.querySelector("#cardSection");
const cardQuote = document.querySelector("#cardQuote");
const quotePreview = document.querySelector("#quotePreview");
const cardComposer = document.querySelector("#cardComposer");
const sourceTool = document.querySelector("#sourceTool");
const quoteTool = document.querySelector("#quoteTool");

const makeId = () => {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const citationFor = (source, quote) => {
  return `(${source.author}, ${source.year}, p. ${quote.page})`;
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
    (quote) => `${quote.source.author}, ${quote.source.year}, p. ${quote.page}`,
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
      const item = el("article", "source-item");
      const title = el("div", "source-title");
      title.append(
        el("strong", "", `${source.author}, ${source.year}`),
        el("span", "", source.title),
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
            const node = el("article", "paper-card");
            node.append(
              el("h4", "", card.header),
              el("p", "claim", card.claim),
              el("blockquote", "", card.quoteText),
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
  renderSourceSelects();
  renderSources();
  renderBoard();
  renderQuotePreview();
};

sourceForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(sourceForm);

  state.sources.push({
    id: makeId(),
    author: formData.get("author").trim(),
    year: formData.get("year").trim(),
    title: formData.get("title").trim(),
    quotes: [],
  });

  sourceForm.reset();
  sourceTool.open = false;
  quoteTool.open = true;
  render();
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

board.addEventListener("click", (event) => {
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
  });

  cardForm.reset();
  cardComposer.open = false;
  render();
});

cardQuote.addEventListener("change", renderQuotePreview);

renderSectionSelect();
render();
