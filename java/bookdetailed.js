// Get ID from URL
const params = new URLSearchParams(window.location.search);
const bookId = params.get("id");

fetch("books.json")
    .then(res => res.json())
    .then(books => {
        const book = books.find(b => b.id === bookId);
        if (!book) {
            document.querySelector("main").innerHTML = "<h2>Book not found</h2>";
            return;
        }

        // Update book cover
        document.querySelector(".book-cover img").src = book.cover;

        // Update availability status
        const statusElement = document.querySelector(".book-status");
        statusElement.textContent = book.available ? "Available" : "Unavailable";
        statusElement.classList.remove("available", "unavailable");
        statusElement.classList.add(book.available ? "available" : "unavailable");

        // Update book title
        document.querySelector("h1").textContent = book.title;

        // Update book metadata
        const meta = document.querySelector(".book-meta");
        meta.innerHTML = `
            <span class="author">By: ${book.author}</span>
            <span class="category">Category: ${book.category}</span>
            <span class="isbn">ISBN: ${book.isbn}</span>
            <span class="publication-year">Published: ${book.year}</span>
            <span class="publisher">${book.publisher}</span>
            <span class="language">Language: ${book.language}</span>
        `;

        // Update book description
        document.querySelector(".book-description p").textContent = book.description;

        // Update edition details
        const edition = book.edition || {};
        const series = edition.series ? edition.series : "N/A";
        const editionHTML = `
            <h3>Edition Notes</h3>
            <div class="detail-row">
                <span class="detail-label">Originally published:</span>
                <span class="detail-value">${edition.originalPublisher || "N/A"}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Published in:</span>
                <span class="detail-value">${edition.publishedIn || "N/A"}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Series:</span>
                <span class="detail-value">${series}</span>
            </div>

            <h3>Classifications</h3>
            <div class="detail-row">
                <span class="detail-label">Dewey Decimal Class:</span>
                <span class="detail-value">${edition.deweyDecimal || "N/A"}</span>
            </div>

            <h3>The Physical Object</h3>
            <div class="detail-row">
                <span class="detail-label">Pagination:</span>
                <span class="detail-value">${edition.pages || "N/A"}p.</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Number of pages:</span>
                <span class="detail-value">${edition.pages || "N/A"}</span>
            </div>
        `;
        document.querySelector(".edition-details").innerHTML = editionHTML;

        // Update identifiers
        const identifiers = book.identifiers || {};
        const identifiersHTML = `
            <h3>Edition Identifiers</h3>
            <div class="detail-grid">
                <span class="detail-label">Open Library:</span>
                <span class="detail-value">${identifiers.openLibrary || "N/A"}</span>
                <span class="detail-label">Internet Archive:</span>
                <span class="detail-value">${identifiers.internetArchive || "N/A"}</span>
                <span class="detail-label">ISBN 10:</span>
                <span class="detail-value">${identifiers.isbn10 || "N/A"}</span>
                <span class="detail-label">Library Thing:</span>
                <span class="detail-value">${identifiers.libraryThing || "N/A"}</span>
                <span class="detail-label">Goodreads:</span>
                <span class="detail-value">${identifiers.goodreads || "N/A"}</span>
            </div>

            <h3>Work Identifiers</h3>
            <div class="detail-row">
                <span class="detail-label">Work ID:</span>
                <span class="detail-value">${identifiers.workId || "N/A"}</span>
            </div>
        `;
        document.querySelector(".identifiers-section").innerHTML = identifiersHTML;

        // Update PDF link
        const pdfLink = document.querySelector(".view-pdf-btn");
        if (pdfLink) {
            pdfLink.href = book.pdf;
        }

        // Handle borrow button visibility based on availability
        const borrowBtn = document.querySelector(".borrow-btn");
        if (borrowBtn) {
            borrowBtn.disabled = !book.available;
        }
    })
    .catch(err => {
        console.error("Error loading book:", err);
    });
