# PaperShelf Single-Page Design Brief

## Product Summary

PaperShelf is a simple single-page browser tool for planning a seminar paper. It helps the user organize paper sections, collect source quotes, and connect each planned claim to a supporting citation.

The app should feel like one focused workspace, not a complex multi-screen product. Everything important should be visible on the same page:

- The paper outline.
- The source and quote shelf.
- A small form for adding material.
- An export option for Markdown.

The design should be lightweight enough to imagine as a static local page with simple JavaScript and browser local storage. No backend, routing, login, dashboard system, or complex scripts are needed.

## Design Direction

Create a calm academic workspace for one person preparing a paper. The interface should be practical, compact, and readable.

The first view should be the working page itself. Do not create a landing page, marketing hero, onboarding flow, or multi-page navigation.

The page should communicate:

- Academic writing.
- Citation-backed argument planning.
- Simple local organization.
- A quiet, focused writing environment.

## Page Layout

Use a single-page layout with three main areas:

1. A compact header.
2. A left source shelf.
3. A right workspace with the paper outline board.

Recommended desktop layout:

- Header across the top.
- Main content below split into two vertical areas.
- Left/narrow area: source shelf where the user adds and browses sources and quotes.
- Right/main area: workspace where the user builds the paper outline.
- The left source shelf should stay visually available while the user works on the right.

Recommended mobile layout:

- Header at top.
- Source shelf appears first as a collapsible panel or simple drawer.
- Workspace appears below it, with paper sections stacked vertically or shown as simple tabs.
- The user should still understand that source material feeds into the workspace cards.

Avoid complicated navigation. The user should not need to move between pages to use the app.

## Header

The header should be compact and functional.

Suggested contents:

- App name: PaperShelf.
- Small subtitle: "Seminar paper outline".
- Status text: "Saved locally".
- Button: "Export Markdown".

The header should not dominate the page. It should look like a tool header, not a promotional hero.

## Paper Outline Board

The outline board is the main area on the right side of the page. It represents the structure of the paper and is the primary workspace.

Fixed paper sections:

1. Introduction
2. Literature Review
3. Methodology
4. Discussion
5. Conclusion

Each section should appear as a clear column or panel. On desktop, the sections can sit side by side with horizontal scrolling if needed. On mobile, they can stack vertically.

Each section should include:

- Section title.
- Small card count.
- "Add card" control.
- List of cards.
- Empty state such as "No cards yet".

The board should feel more like an academic outline than a project-management kanban board.

## Argument Cards

Each card represents one planned idea, paragraph, or claim in the paper.

Each card should display:

- Short header.
- Claim.
- Supporting quote.
- Generated citation.

Suggested card structure:

- Header at the top.
- Claim below it as the most prominent text.
- Quote in a subtle quote block.
- Citation as small metadata at the bottom.

Example citation:

`(Smith, 2021, p. 36)`

Cards should be readable and compact. Since this is a planning tool, the claim should be visually more important than the quote.

## Source Shelf

The source shelf is the left side of the page. It contains saved sources and quotes, plus simple controls for adding new source material.

The left shelf should feel like a research-material tray: always close at hand, narrower than the workspace, and designed for browsing quotes quickly while building cards on the right.

Each source should show:

- Author surname.
- Year.
- Title.
- Saved quotes.

Each quote should show:

- Page number.
- Quote text or quote preview.
- A simple "Use" control when creating a card.

The shelf can use simple collapsible groups if needed, but avoid complex nested interactions.

## Simple Input Forms

The app can use small inline forms instead of separate screens or complex modals. Source and quote forms should live in the left shelf. Card creation belongs to the right workspace.

### Add Source

Fields:

- Author surname.
- Year.
- Source title.

Action:

- Add source.

### Add Quote

Fields:

- Select source.
- Page number.
- Quote text.

Action:

- Add quote.

### Add Card

Fields:

- Paper section, preselected if the user clicked "Add card" from a section.
- Card header.
- Claim.
- Saved quote selector.

Generated preview:

- Quote text.
- Citation.

Action:

- Add card.

The forms should be direct and plain. Avoid wizard flows, separate pages, or heavy stateful interactions.

## Citation Behavior

The app generates citations from the source and quote data.

Citation format:

`(Author, Year, p. Page)`

Example:

`(Smith, 2021, p. 36)`

If author, year, or page number is missing, the form should make the missing information obvious before the card is added.

## Markdown Export

The page includes one export action: "Export Markdown".

The exported outline should use this structure:

```md
# Seminar Paper Outline

## Introduction

### Card Header

Claim text goes here.

> Supporting quote goes here.

Citation: (Smith, 2021, p. 36)

## Literature Review

...
```

The export can be shown as copyable text or downloaded as a `.md` file.

## Local Storage

The app saves data locally in the browser.

Saved data:

- Sources.
- Quotes.
- Cards.

The interface can show a simple "Saved locally" status. Do not imply cloud sync or account storage.

## Visual Style

The visual style should be:

- Academic.
- Minimal.
- Calm.
- Text-first.
- Easy to scan.

Suggested look:

- Light neutral background.
- Dark readable text.
- Thin borders.
- Subtle cards.
- Muted accent color for actions.
- Compact forms.
- Clear typography.
- Small metadata styling for citations.

Avoid:

- Marketing hero sections.
- Decorative illustrations.
- Heavy gradients.
- Bright kanban-style colors.
- Complex dashboards.
- Multi-page navigation.
- Overbuilt controls.

## First Version Scope

Include:

- One page only.
- Five fixed paper sections.
- Add sources.
- Add quotes.
- Add cards.
- Select saved quote for a card.
- Auto-generate simple citations.
- Save locally in the browser.
- Export Markdown.

Exclude:

- Login.
- Cloud sync.
- Collaboration.
- Backend.
- Routing.
- PDF upload.
- Drag-and-drop.
- Advanced citation styles.
- Large component framework behavior.
- Complex scripts or automation.

## Suggested On-Page Copy

App name:

- PaperShelf

Header subtitle:

- Seminar paper outline

Buttons:

- Add source
- Add quote
- Add card
- Use quote
- Export Markdown

Status text:

- Saved locally
- No cards yet
- No sources yet
- No quotes yet

Field labels:

- Author surname
- Year
- Source title
- Page number
- Quote text
- Card header
- Claim
- Supporting quote

## Success Criteria

The design should make PaperShelf feel like a simple local page for organizing a paper, not a large web app. A user should immediately understand that they can add sources, save quotes, create paper-section cards, and export the outline.

The final design should be easy to implement with plain HTML, CSS, and a small amount of JavaScript.
