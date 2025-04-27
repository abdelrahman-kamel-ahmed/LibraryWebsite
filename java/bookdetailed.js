const params = new URLSearchParams(window.location.search);
const bookId = params.get("id");

function displayBookDetails(book) {
    if (typeof book.available === 'undefined') {
        book.available = true;
    }

    const getCoverPath = (cover) => {
        if (!cover) return 'photos/default-cover.jpg';
        const cleanCover = cover.replace(/^photos\//, '');
        return `photos/${cleanCover}`;
    };

    function getPdfPath(fileName) {
        if (!fileName) return '#';
        
        const cleanFileName = fileName.replace(/^PDF_Books\//, '');
    
        return cleanFileName.endsWith('.pdf') ? `PDF_Books/${cleanFileName}` : `PDF_Books/${cleanFileName}.pdf`;
    }

    const coverPath = getCoverPath(book.cover);
    document.querySelector(".book-cover img").src = coverPath;

    const statusElement = document.querySelector(".book-status");
    statusElement.textContent = book.available ? "Available" : "Unavailable";
    statusElement.classList.remove("available", "unavailable");
    statusElement.classList.add(book.available ? "available" : "unavailable");

    document.querySelector("h1").textContent = book.title || book.name || "Untitled Book";

    const meta = document.querySelector(".book-meta");
    meta.innerHTML = `
        <span class="author">By: ${book.author || "Unknown Author"}</span>
        <span class="category">Category: ${book.category || "Uncategorized"}</span>
        <span class="isbn">ISBN: ${book.isbn || "N/A"}</span>
        <span class="publication-year">Published: ${book.year || "Unknown Year"}</span>
        <span class="publisher">Publisher: ${book.publisher || "Unknown Publisher"}</span>
        <span class="language">Language: ${book.language || "Unknown"}</span>
    `;



    document.querySelector(".book-description p").textContent = 
        book.description || "No description available for this book.";

    const edition = book.edition || {};
    const series = edition.series || "N/A";
    const editionHTML = `
        <h3>Edition Notes</h3>
        <div class="detail-row">
            <span class="detail-label">Published in:<span class="detail-value">${edition.publishedIn || "N/A"}</span></span>
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

    const actionsContainer = document.createElement('div');
    actionsContainer.className = 'book-actions';
    actionsContainer.innerHTML = `
    <div class="rating-section">
    <h3>Rate This Book</h3>
    <div class="star-rating">
      <input type="radio" id="star5" name="rating" value="5" />
      <label for="star5" title="5 stars">★</label>
      <input type="radio" id="star4" name="rating" value="4" />
      <label for="star4" title="4 stars">★</label>
      <input type="radio" id="star3" name="rating" value="3" />
      <label for="star3" title="3 stars">★</label>
      <input type="radio" id="star2" name="rating" value="2" />
      <label for="star2" title="2 stars">★</label>
      <input type="radio" id="star1" name="rating" value="1" />
      <label for="star1" title="1 star">★</label>
    </div>
    <div class="average-rating">
      Average Rating: <span class="stars">★★★★☆</span> (4.2/5 from 18 ratings)
    </div>
  </div>

        <button class="borrow-btn" data-id="${book.id}" ${!book.available ? 'disabled' : ''}>Borrow This Book</button>
        <a href="${getPdfPath(book.pdf)}" target="_blank" class="view-pdf-btn" style="display: ${book.pdf ? 'inline-block' : 'none'};">View Full PDF</a>
        <a href="freeBooks.html" class="back-link">← Back to All Books</a>
    `;

    document.querySelector(".identifiers-section").after(actionsContainer);


    const borrowBtn = actionsContainer.querySelector('.borrow-btn');
    if (borrowBtn) {
        borrowBtn.disabled = !book.available;
        borrowBtn.addEventListener('click', function() {
            borrowBook(book.id);
        });
    }

}

function showBookNotFound() {
    document.querySelector("main").innerHTML = `
        <div class="book-not-found">
            <h2>Book not found</h2>
            <p>The requested book could not be found in our collection.</p>
            <a href="freeBooks.html" class="back-link">← Back to All Books</a>
        </div>
    `;
}

const localBooks = JSON.parse(localStorage.getItem('books')) || [];
const localBook = localBooks.find(b => b.id.toString() === bookId.toString());

if (localBook) {
    displayBookDetails(localBook);
} else {
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
