# QuickNotes Architecture

This document describes how QuickNotes is designed to serve 1 million users.

---

## 1. Functional Requirements

- Users can create, read, update and delete notes.
- Users can tag notes and search by keyword.
- Notes are private to their owner.

## 2. Non-Functional Requirements

- **Scalable:** must support 1 million users.
- **Fast:** notes should load in under 300 ms.
- **Available:** at least 99.9% uptime.
- **Secure:** only the owner can read or edit a note.
- **Durable:** no user data should ever be lost.

---

## 3. Load Estimate (for 1 million users)

Assumptions:
- 1 million registered users, 10% active daily → **100,000 daily active users**
- Each active user writes ~3 notes/day and reads ~20 notes/day

| Metric | Average | Peak (× 3) |
|--------|---------|-----------|
| Writes per second | ~3.5 | ~10 |
| Reads per second | ~23 | ~70 |
| Storage per year | ~110 million notes × ~500 bytes ≈ **55 GB/year** | |

Notes:
- Each write is small (a few hundred bytes).
- Most traffic is reads.
- Total data stays under 100 GB per year, which fits comfortably on a single database with a replica.

---

## 4. Architecture Diagram
[ Client (Browser) ]
│
▼
[ DNS: api.quicknotes.app ]
│
▼
[ Load Balancer ]
│
┌─────┴─────┐
▼           ▼
[ App Server 1 ][ App Server 2 ]   (2+ servers behind the LB)
│           │
▼           ▼
[ Cache ]   [ Primary DB ] ──► [ Read Replica ]
│
▼
[ Queue ] ──► [ Worker ]
---

## 5. Components

- **Client (browser):** The UI the user interacts with. Sends HTTPS requests to the API.
- **DNS:** Routes `api.quicknotes.app` to the load balancer's IP.
- **Load balancer:** Distributes incoming requests across app servers and routes away from unhealthy ones.
- **App servers:** Run the API logic (authentication, CRUD, search). Stateless, so we can add more as traffic grows.
- **Cache (e.g. Redis):** Stores hot data like recently requested notes and session tokens, so most reads never hit the database.
- **Primary database (e.g. PostgreSQL):** Handles all writes (create/update/delete).
- **Read replica:** A copy of the primary database that only serves reads, so read traffic doesn't slow down writes.
- **Queue (e.g. RabbitMQ or Redis Streams):** Holds background jobs (e.g. sending notifications, reindexing search).
- **Worker:** Reads jobs from the queue and processes them, so slow tasks don't block the API.

---

## 6. Request Flows

### GET /notes (fetch user's notes)

1. Client sends a GET request to the load balancer.
2. Load balancer forwards it to an app server.
3. App server checks the cache for that user's notes.
4. If not cached, it queries the **read replica**.
5. Result is stored in the cache for next time.
6. App server returns the notes as JSON to the client.

### POST /notes (create a note)

1. Client sends a POST request with the note's title and body.
2. Load balancer forwards it to an app server.
3. App server validates the input (title required, ≤ 100 chars).
4. App server writes the new note to the **primary database**.
5. App server pushes a job to the **queue** (e.g. update search index).
6. App server returns `201 Created` with the new note.

### DELETE /notes/{id} (delete a note)

1. Client sends a DELETE request.
2. Load balancer forwards it to an app server.
3. App server checks that the note belongs to the requesting user.
4. App server deletes the row from the **primary database**.
5. App server invalidates the cache entry.
6. App server returns `204 No Content`.

---

## 7. Trade-offs

**Trade-off 1: Strong consistency vs performance**
- Chose **eventual consistency for reads**. The read replica may lag behind the primary by a second or two. This means a user might briefly not see their own new note on a different device. In return, reads are much faster and don't slow down writes.

**Trade-off 2: Caching vs simplicity**
- Chose to add a **cache**. It adds a moving part (cache invalidation is famously tricky) but cuts database load dramatically. Without it, every read would hit the replica.

**Trade-off 3: Single-region vs multi-region**
- Chose a **single-region deployment** for now. Multi-region would reduce latency worldwide but doubles the operational complexity and cost. For 1 million users, single-region is fine.

---

## 8. Single Points of Failure

- **Primary database:** If it fails, writes stop. **Mitigation:** set up a standby replica that can be promoted automatically.
- **Load balancer:** If it fails, traffic stops. **Mitigation:** use a managed load balancer with built-in redundancy, or two LBs in active/passive mode.
- **Single app server:** If only one app server runs, it's a SPOF. **Mitigation:** always run at least two behind the load balancer.

Everything else (cache, queue, worker) can be restarted or scaled horizontally, so it isn't a single point of failure.