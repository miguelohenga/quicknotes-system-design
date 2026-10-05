// ===== 1. API URL and Elements =====
const API_URL = "https://jsonplaceholder.typicode.com/posts";

const loadBtn = document.querySelector("#load-btn");
const status = document.querySelector("#status");
const notesList = document.querySelector("#notes-list");

// ===== 2. Reusable Request Function =====
async function request(url, options = {}) {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error("Request failed with status " + response.status);
    }
    return response.json();
}

// ===== 3. Show Status Messages =====
function showStatus(message, type) {
    status.textContent = message;
    status.className = "";
    if (type === "success") status.classList.add("status-success");
    if (type === "error") status.classList.add("status-error");
    if (type === "loading") status.classList.add("status-loading");
}

// ===== 4. Render Notes =====
function renderNotes(notes) {
    notesList.innerHTML = "";

    if (notes.length === 0) {
        const li = document.createElement("li");
        li.textContent = "No notes yet. Add one below.";
        notesList.appendChild(li);
        return;
    }

    notes.forEach(function (note) {
        const li = document.createElement("li");

        const title = document.createElement("h3");
        title.textContent = note.title;

        const body = document.createElement("p");
        body.textContent = note.body;

        li.appendChild(title);
        li.appendChild(body);
        notesList.appendChild(li);
    });
}

// ===== 5. Load Notes (GET) =====
async function loadNotes() {
    loadBtn.disabled = true;
    showStatus("Loading notes...", "loading");
    notesList.innerHTML = "";

    try {
        const notes = await request(API_URL + "?_limit=10");
        renderNotes(notes);
        showStatus("Loaded " + notes.length + " notes from the server.", "success");
    } catch (error) {
        showStatus("Error: " + error.message, "error");
    } finally {
        loadBtn.disabled = false;
    }
}

// ===== 6. Button Click =====
loadBtn.addEventListener("click", loadNotes);