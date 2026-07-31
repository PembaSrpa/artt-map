# Artt Map

A documentation site that maps out how every one of my personal projects actually works - architecture, data flow, and file-by-file breakdowns, all in one place.

---

## The Idea

Every project ends up with knowledge that only lives in one person's head - why a component is structured a certain way, how data moves from one module to the next, which file does what. Artt Map exists to get that knowledge out of my head and into something browsable.

Each project gets its own space with a full written breakdown: the overview, the moving parts, the diagrams, the file reference. It's less a portfolio and more a map I can hand to future-me (or anyone else) to skip the archaeology.

---

## Browse by Project

The home page lists every documented project as a card - name, one-line description, and how many pages of documentation it has. Click into any one and you land in its dedicated docs space.

Projects currently mapped include a vocabulary learning app, a resume builder, a flashcard app and its web port, a World Cup prediction tracker, a few ML-backed APIs, an Excel dashboard, and more - each with its own depth of documentation depending on how much there is to say.

## Inside a Project

Once inside a project, a sidebar lists every documentation page for that project in order - things like overview, architecture, data flow, individual feature breakdowns, and a file reference. A project switcher at the top lets you jump straight to a different project without going back to the home page.

Pages are read top to bottom like a technical article: explanations in prose, code snippets where they clarify something, and a running table of contents on the side so you always know where you are in a longer page.

## Diagrams You Can Actually Read

Architecture and data-flow pages lean on diagrams - flowcharts showing how modules, pages, and data connect to each other. Any diagram can be expanded to fill the screen, so dense flowcharts stay readable instead of getting squeezed into a sidebar-width column.

## File Reference

Most projects end with a file-by-file reference page - a map of what each significant file in that codebase is responsible for. It's the page you go to when you know something is broken but not which file owns it.

## On Mobile

The whole thing collapses gracefully on a phone - the sidebar becomes a slide-out drawer, the project switcher and table of contents move out of the way, and pages stay readable at any width.