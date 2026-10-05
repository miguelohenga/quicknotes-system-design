# QuickNotes API Design

A RESTful API for QuickNotes — a note-taking service.

**Base URL:** `https://api.quicknotes.app/v1`

---

## Endpoints

### 1. List all notes

- **Method:** GET
- **Path:** `/notes`
- **Description:** Returns all notes belonging to the authenticated user.
- **Success status:** `200 OK`

**Example response:**

```json
[
  {
    "id": 1,
    "title": "Buy milk",
    "body": "2 litres, semi-skimmed",
    "createdAt": "2026-10-05T09:30:00Z"
  },
  {
    "id": 2,
    "title": "Finish project 2",
    "body": "Submit before Day 8",
    "createdAt": "2026-10-05T10:15:00Z"
  }
]