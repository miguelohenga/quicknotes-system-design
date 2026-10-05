# QuickNotes System Design

A system design project for QuickNotes — a note-taking web app being scaled from a browser-only toy to a real online service for 1 million users. This repo contains a working API client and the three design documents the backend team will build from.

---

## Project Structure
quicknotes-system-design/
├── index.html          # Page structure
├── style.css           # Styling
├── api.js              # API client (GET, POST, DELETE)
├── README.md           # This file
└── docs/
├── api-design.md       # REST API design
├── data-model.md       # Database design
└── architecture.md     # Architecture and scaling plan

```

---

## How to Run the API Client

1. Clone this repository:
```

git clone https://github.com/miguelohenga/quicknotes-system-design.git

```
2. Navigate into the folder:
```

cd quicknotes-system-design

```
3. Open `index.html` in any modern browser (double-click the file, or right-click and choose "Open with" your browser).

No build tools, no server setup, no installation required — it's plain HTML, CSS and JavaScript.

**Note:** The client talks to [JSONPlaceholder](https://jsonplaceholder.typicode.com), a free fake API. It simulates GET, POST and DELETE requests. Since it's fake, created notes don't persist between page refreshes, and deleted notes would reappear on a fresh load.

---

## Design Documents

- **[API Design](docs/api-design.md)** — the REST API specification: endpoints, methods, request/response examples and error codes.
- **[Data Model](docs/data-model.md)** — the database schema: tables, relationships, indexes, and a SQL vs NoSQL discussion.
- **[Architecture](docs/architecture.md)** — the scaling plan: load estimates, architecture diagram, request flows, trade-offs and single points of failure.

---

## What I Learned

1. **Working with a real API using `fetch()`** — I learned how to structure a reusable `request()` function that handles `fetch`, checks `response.ok`, throws on errors, and returns JSON. This kept the GET, POST, and DELETE calls clean and consistent.

2. **Handling async flows properly** — I learned how to use `async`/`await` with `try`/`catch`/`finally` to manage loading, success, and error states, and how to disable buttons while a request is in flight so users can't double-submit.

3. **Designing systems, not just writing code** — writing the API, data model, and architecture documents forced me to think about relationships between tables, which queries need indexes, why photos shouldn't live inside a database, and where a system is most likely to fail. This was the first time I designed something before coding it.

---

## Git History

This project was built across 7 commits:

1. `Add API client with GET`
2. `Add create note with POST`
3. `Add delete with DELETE`
4. `Add API design doc`
5. `Add data model doc`
6. `Add architecture doc`
7. `Add README`
```