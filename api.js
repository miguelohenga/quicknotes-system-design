// ===== 1. API URL and Elements =====
const API_URL = "https://jsonplaceholder.typicode.com/posts";

const loadBtn = document.querySelector("#load-btn");
const status = document.querySelector("#status");
const notesList = document.querySelector("#notes-list");
const form = document.querySelector("#note-form");
const titleInput = document.querySelector("#title-input");
const bodyInput = document.querySelector("#body-input");
const submitBtn = document.querySelector("#submit-btn");
const formStatus = document.querySelector("#form-status");

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
// ===== 7. Create Note (POST) =====
async function createNote(event) {
    event.preventDefault();

    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    // Clear previous form status
    formStatus.textContent = "";
    formStatus.className = "";

    // Validation
    if (title === "") {
        formStatus.textContent = "Title is required.";
        formStatus.classList.add("status-error");
        return;
    }

    if (title.length > 100) {
        formStatus.textContent = "Title must be 100 characters or fewer.";
        formStatus.classList.add("status-error");
        return;
    }

    // Disable button and show loading
    submitBtn.disabled = true;
    formStatus.textContent = "Creating note...";
    formStatus.classList.add("status-loading");

    try {
        const newNote = await request(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                body: body,
                userId: 1
            })
        });

        // Add to the top of the list
        const li = document.createElement("li");

        const heading = document.createElement("h3");
        heading.textContent = newNote.title;

        const paragraph = document.createElement("p");
        paragraph.textContent = newNote.body;

        li.appendChild(heading);
        li.appendChild(paragraph);

        notesList.prepend(li);

        // Success message
        formStatus.textContent = "Note created (status 201, id " + newNote.id + ")";
        formStatus.className = "";
        formStatus.classList.add("status-success");

        // Clear the form
        titleInput.value = "";
        bodyInput.value = "";
    } catch (error) {
        formStatus.textContent = "Error: " + error.message;
        formStatus.className = "";
        formStatus.classList.add("status-error");
    } finally {
        submitBtn.disabled = false;
    }
}

// ===== 6. Button Click =====
loadBtn.addEventListener("click", loadNotes);
form.addEventListener("submit", createNote);