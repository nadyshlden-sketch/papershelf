# PaperShelf App Concept

PaperShelf is a local browser app for organizing the argument structure of a seminar paper before writing the final text. It combines a simple paper outline board with a small citation shelf, helping the user connect claims to supporting quotations from academic sources.

## Function

The app provides a five-column whiteboard matching the main sections of the paper: Introduction, Literature Review, Methodology, Discussion, and Conclusion. In each column, the user can add cards. Each card contains a short header, a claim, a supporting quote, and an automatically generated in-text citation such as `(Smith, 2021, p.36)`.

The app also includes a source shelf where the user stores article information and quotes. Each source entry includes author surname, year, title, and one or more quotes with page numbers. When creating a card, the user can select a saved quote from the shelf, and the app fills in the quote text and citation automatically. Progress is saved locally in the browser, so the user can return in later sessions without losing work. The board can also be exported as a Markdown file.

## Structure

The app should be built as a local React app, preferably using Vite for fast setup and development. The interface should have two main areas: the whiteboard and the source shelf. The whiteboard contains the five fixed columns. Each column has an add-card control and a vertical list of cards. Cards are add-only in the first version; moving, deleting, or reordering cards is intentionally out of scope to keep the app simple.

The source shelf stores reusable citation material. A source contains author surname, year, title, and quote entries. A quote entry contains page number and quote text. Card data stores the selected section, header, claim, quote text, and generated citation.

The React structure can stay simple: an `App` component owns the main state, `SourceShelf` manages source and quote entry, `Board` renders the five section columns, `SectionColumn` renders cards for one section, and `CardForm` handles creating new cards from saved quotes. Small helper functions can handle citation formatting, local storage, and Markdown export.

## Workflow

First, the user adds sources to the shelf by entering author surname, year, title, and saved quotes with page numbers. Then, while planning the paper, the user chooses a paper section and creates a card. In the card form, the user writes a header and claim, then selects one quote from the shelf. The app inserts the quote and formats the citation automatically. The card appears in the chosen section column.

As the user works, the app autosaves the current board and source shelf using browser local storage. When ready, the user exports the board to Markdown. The export should use section headings for the five paper sections and render each card as a subsection containing the claim, block quote, and citation.

## Dependencies and Obstacles

The first version should use React with Vite, plus standard CSS for styling. No backend, database, login system, or cloud storage is needed. Browser local storage is enough for autosave, but it is tied to the specific browser and profile, so it is not ideal for backup or portability. A future version may need JSON import/export.

Main obstacles include keeping citation data consistent when quotes are edited, deciding how much state should be stored directly on cards versus referenced from the source shelf, preventing data loss if local storage is cleared, and designing the card form so source selection feels quick rather than distracting. Markdown export should be tested carefully so the resulting file remains readable as a paper outline.
