
// Get ID from URL
const params = new URLSearchParams(window.location.search);
const bookId = params.get("id");

// Function to display book details
function displayBookDetails(book) {
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

    // Update book description
    document.querySelector(".book-description p").textContent = 
        book.description || "No description available for this book.";

    // Update edition details
    const edition = book.edition || {};
    const series = edition.series || "N/A";
    const editionHTML = `
        <h3>Edition Notes</h3>

        <div class="detail-row">
            <span class="detail-label">Published in:<span class="detail-value">${edition.publishedIn || "N/A"}</span>            </span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Series:<span class="detail-value">${series}</span></span>
            
        </div>

        <h3>Classifications</h3>
        <div class="detail-row">
            <span class="detail-label">Dewey Decimal Class:<span class="detail-value">${edition.deweyDecimal || "N/A"}</span></span>
            
        </div>

        <h3>The Physical Object</h3>
        <div class="detail-row">
            <span class="detail-label">Number of pages:<span class="detail-value">${edition.pages || "N/A"}</span></span>
            
        </div>
    `;
    document.querySelector(".edition-details").innerHTML = editionHTML;

    // Update identifiers
    const identifiers = book.identifiers || {};
        const identifiersHTML = `
        <h3>Edition Identifiers</h3>
        <div class="detail-grid">
            <span class="detail-label">Open Library:<span class="detail-value">${identifiers.openLibraryId || "N/A"}</span></span>
            
            <span class="detail-label">Internet Archive:<span class="detail-value">${identifiers.internetArchive || "N/A"}</span></span>
            
            <span class="detail-label">ISBN 10:<span class="detail-value">${identifiers.isbn10 || "N/A"}</span></span>
            
            <span class="detail-label">Library Thing:<span class="detail-value">${identifiers.libraryThing || "N/A"}</span></span>
            
            <span class="detail-label">Goodreads:<span class="detail-value">${identifiers.goodreadsId || "N/A"}</span></span>
            
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
    if (pdfLink && book.pdf) {
        pdfLink.href = book.pdf;
        pdfLink.style.display = "inline-block";
    } else if (pdfLink) {
        pdfLink.style.display = "none";
    }

    // Handle borrow button
    // Handle borrow button
    const borrowBtn = document.querySelector(".borrow-btn");
    if (borrowBtn) {
        borrowBtn.disabled = !book.available;
        borrowBtn.addEventListener('click', function() {
            if (book.available) {
                // Mark as borrowed
                book.available = false;
    
                // Update status element
                const statusElement = document.querySelector(".book-status");
                statusElement.textContent = "Borrowed";
                statusElement.classList.remove("available", "unavailable");
                statusElement.classList.add("unavailable");
    
                // Disable borrow button
                borrowBtn.disabled = true;
    
                // Update books list in localStorage
                const books = JSON.parse(localStorage.getItem('books')) || [];
                const index = books.findIndex(b => b.id.toString() === book.id.toString());
                if (index !== -1) {
                    books[index].available = false;
                    localStorage.setItem('books', JSON.stringify(books));
                }
    
                // Now also save into 'borrowedBooks'
                let borrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks')) || [];
                const alreadyBorrowed = borrowedBooks.some(b => b.id.toString() === book.id.toString());
                if (!alreadyBorrowed) {
                    borrowedBooks.push({
                        id: book.id,
                        title: book.title || book.name || "Untitled Book",
                        author: book.author || "Unknown Author",
                        cover: book.cover || "default-cover.jpg",
                        isbn: book.isbn || "N/A",
                        category: book.category || "Uncategorized",
                        year: book.year || "Unknown Year",
                        publisher: book.publisher || "Unknown Publisher",
                        language: book.language || "Unknown"
                    });
                    localStorage.setItem('borrowedBooks', JSON.stringify(borrowedBooks));
                }
    
                alert(`You have borrowed "${book.title || book.name}"`);
            }
        });
    }
    

}

// Function to show book not found message
function showBookNotFound() {
    document.querySelector("main").innerHTML = `
        <div class="book-not-found">
            <h2>Book not found</h2>
            <p>The requested book could not be found in our collection.</p>
            <a href="freeBooks.html" class="back-link">← Back to All Books</a>
        </div>
    `;
}

// Start: Check localStorage first
const localBooks = JSON.parse(localStorage.getItem('books')) || [];
const localBook = localBooks.find(b => b.id.toString() === bookId.toString());

if (localBook) {
    // Book found in localStorage
    displayBookDetails(localBook);
} else {
    // Not found in localStorage - fetch from JSON
    fetch("books.json")
        .then(res => res.json())
        .then(jsonBooks => {
            const jsonBook = jsonBooks.find(b => b.id.toString() === bookId.toString());
            if (jsonBook) {
                displayBookDetails(jsonBook);
            } else {
                showBookNotFound();
            }
        })
        .catch(error => {
            console.error("Error loading books:", error);
            showBookNotFound();
        });
}
