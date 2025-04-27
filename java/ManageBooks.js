

// Display books in the container
function displayBooks(books, containerSelector = "#bookList", showActions = false) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    
    container.innerHTML = "";

    if (books.length === 0) {
        container.innerHTML = "<p>No books found.</p>";
        return;
    }

    books.forEach(book => {
        let coverPath = book.cover;
        if (coverPath && coverPath.startsWith("photos/")) {
            coverPath = coverPath.replace("photos/", "");
        }
        const finalCoverPath = book.cover && book.cover !== 'N/A' ? 'photos/' + coverPath : 'photos/default-cover.jpg';
        
        const bookId = book.id;
        const bookTitle = book.title || book.name || 'Untitled Book';
        
        container.innerHTML += `
        <div class="col-5" data-id="${bookId}">
            <a href="bookdetailed.html?id=${bookId}">
                <div class="image">
                    <img src="photos/${coverPath}" alt="${bookTitle}">
                </div>
                <p class="book_name">${bookTitle}</p>
            </a>
            ${showActions ? `
            <div class="book-actions">
                <a href="EditBooks.html?id=${bookId}" class="options edit-btn">Edit</a>
                <a href="#" class="options delete-btn">Delete</a>
            </div>` : ''}
        </div>`;
    });

    if (showActions) {
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const bookId = this.closest('.col-5').getAttribute('data-id');
                deleteBook(bookId);
            });
        });
    }
}

// Delete a book
function deleteBook(bookId) {
    if (!confirm('Are you sure you want to delete this book?')) return;
    
    let books = JSON.parse(localStorage.getItem('books')) || [];
    books = books.filter(book => book.id.toString() !== bookId.toString());
    localStorage.setItem('books', JSON.stringify(books));

    displayBooks(books, "#bookList", true);

    if (books.length === 0) {
        document.querySelector("#bookList").innerHTML = "<p>No books found.</p>";
    }

    alert('Book deleted successfully!');
}

// Filter books (without json)
function filterBooks() {
    const inputElement = document.querySelector(".search-input");
    const query = inputElement.value.trim().toLowerCase();
    const searchType = document.querySelector("input[name='search-type']:checked")?.value || "title";

    const localBooks = JSON.parse(localStorage.getItem("books")) || [];
    let results = localBooks;

    if (query) {
        results = localBooks.filter(book => {
            if (searchType === "available") {
                return book.available === true;
            }
            const field = book[searchType]?.toString().toLowerCase() || "";
            return field.includes(query);
        });
    }

    displayBooks(results, "#bookList", true);
}

// Initialize the page (without json)
document.addEventListener('DOMContentLoaded', function() {
    const localBooks = JSON.parse(localStorage.getItem('books')) || [];
    displayBooks(localBooks, "#bookList", true);

    document.querySelector(".search-input")?.addEventListener('input', filterBooks);
    document.querySelectorAll("input[name='search-type']").forEach(radio => {
        radio.addEventListener('change', filterBooks);
    });
});
