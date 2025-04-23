// Get book ID from URL
const params = new URLSearchParams(window.location.search);
const bookId = params.get("id");

// Get books from localStorage
const books = JSON.parse(localStorage.getItem('books')) || [];
const book = books.find(b => b.id.toString() === bookId.toString());

if (!book) {
    document.querySelector("main").innerHTML = `
        <div class="book-not-found">
            <h2>Book not found</h2>
            <p>The requested book could not be found in our collection.</p>
            <a href="freeBooks.html" class="back-link">← Back to All Books</a>
        </div>
    `;
} else {
    // Set availability to true if not specified
    if (typeof book.available === 'undefined') {
        book.available = true;
    }

    // Update book cover
    const coverPath = book.cover ? `photos/${book.cover}` : 'photos/default-cover.jpg';
    document.querySelector(".book-cover img").src = coverPath;
    
    // Update availability status
    const statusElement = document.querySelector(".book-status");
    statusElement.textContent = book.available ? "Available" : "Unavailable";
    statusElement.classList.remove("available", "unavailable");
    statusElement.classList.add(book.available ? "available" : "unavailable");

    // Update book title
    document.querySelector("h1").textContent = book.title || book.name || "Untitled Book";

    // Update book metadata
    const meta = document.querySelector(".book-meta");
    meta.innerHTML = `
        <span class="author">By: ${book.author || "Unknown Author"}</span>
        <span class="category">Category: ${book.category || "Uncategorized"}</span>
        <span class="isbn">ISBN: ${book.isbn || "N/A"}</span>
        <span class="publication-year">Published: ${book.year || "Unknown Year"}</span>
        <span class="publisher">Publisher: ${book.publisher || "Unknown Publisher"}</span>
        <span class="language">Language: ${book.language || "Unknown"}</span>
    `;

    // Rest of your existing code remains the same...
    // Update book description
    document.querySelector(".book-description p").textContent = 
        book.description || "No description available for this book.";

    // Update edition details
    const edition = book.edition || {};
    const series = edition.series ? edition.series : "N/A";
    document.querySelector(".edition-details").innerHTML = `
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

    // Update identifiers
    const identifiers = book.identifiers || {};
    document.querySelector(".identifiers-section").innerHTML = `
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

    // Update PDF link
    const pdfLink = document.querySelector(".view-pdf-btn");
    if (pdfLink && book.pdf) {
        pdfLink.href = book.pdf;
        pdfLink.style.display = "inline-block";
    } else {
        pdfLink.style.display = "none";
    }

    // Handle borrow button visibility based on availability
    const borrowBtn = document.querySelector(".borrow-btn");
    if (borrowBtn) {
        borrowBtn.disabled = !book.available;
        borrowBtn.addEventListener('click', function() {
            if (book.available) {
                // Implement borrow functionality here
                alert(`You have borrowed "${book.title || book.name}"`);
            }
        });
    }
}