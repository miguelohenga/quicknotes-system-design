# QuickNotes Data Model

The QuickNotes backend uses four tables: `users`, `notes`, `tags` and `note_tags`.

---

## Entities

### `users`

Stores each user's account details.

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER | Primary key |
| email | TEXT | Not null, unique |
| name | TEXT | Not null |
| created_at | TEXT | Not null, ISO timestamp |

### `notes`

Stores each note. A note belongs to one user.

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER | Primary key |
| user_id | INTEGER | Foreign key → users.id, not null |
| title | TEXT | Not null, max 100 characters |
| body | TEXT | Nullable |
| created_at | TEXT | Not null, ISO timestamp |

### `tags`

Stores tag names (e.g. `work`, `personal`).

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER | Primary key |
| name | TEXT | Not null, unique |

### `note_tags`

Join table linking notes to tags. A note can have many tags, and a tag can belong to many notes.

| Column | Type | Notes |
|--------|------|-------|
| note_id | INTEGER | Foreign key → notes.id, not null |
| tag_id | INTEGER | Foreign key → tags.id, not null |
| PRIMARY KEY | (note_id, tag_id) | Composite primary key |

---

## Relationships

- **users → notes:** one-to-many. One user can have many notes; each note belongs to exactly one user.
- **notes ↔ tags:** many-to-many. A note can have several tags, and a tag can be used on many notes.
- **note_tags:** the join table that connects `notes` and `tags`.

The many-to-many relationship cannot be stored directly in a relational database, so it needs the `note_tags` join table. Each row in `note_tags` represents one note-tag pair.

---

## CREATE TABLE Statements

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL
);

CREATE TABLE notes (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    body TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE tags (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE note_tags (
    note_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (note_id, tag_id),
    FOREIGN KEY (note_id) REFERENCES notes(id),
    FOREIGN KEY (tag_id) REFERENCES tags(id)
);

---

## Example Queries

### 1. All notes for one user

```sql
SELECT id, title, body, created_at
FROM notes
WHERE user_id = 1
ORDER BY created_at DESC;

SELECT notes.id, notes.title, tags.name AS tag
FROM notes
JOIN note_tags ON notes.id = note_tags.note_id
JOIN tags ON tags.id = note_tags.tag_id
WHERE notes.user_id = 1;

SELECT users.name, COUNT(notes.id) AS note_count
FROM users
LEFT JOIN notes ON users.id = notes.user_id
GROUP BY users.id, users.name;

CREATE INDEX idx_notes_user_id ON notes(user_id);