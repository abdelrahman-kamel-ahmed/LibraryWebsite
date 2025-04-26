// Display books in the container
function displayBooks(books, containerSelector = ".book-content", showActions = false) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    
    container.innerHTML = "";

    if (books.length === 0) {
        container.innerHTML = "<p>No books found.</p>";
        return;
    }

    books.forEach(book => {
        // Handle cover image path
        let coverPath = book.cover;
        if (coverPath && coverPath.startsWith("photos/")) {
            coverPath = coverPath.substring(7);
        }
        const finalCoverPath = book.cover && book.cover !== 'N/A' ? 
            'photos/' + coverPath : 'photos/default-cover.jpg';
        
        const bookId = book.id;
        const bookTitle = book.title || book.name || 'Untitled Book';
        
        container.innerHTML += `
        <div class="col-5">

            <a href="bookdetailed.html?id=${bookId}">
                <div class="image">
                    <img src="${finalCoverPath}" alt="${bookTitle}">
                </div>
                <p class="book_name">${bookTitle}</p>
            </a>
        </div>`;
    });

    // Add event listeners for delete buttons if showing actions
    if (showActions) {
        document.querySelectorAll('.delete-book').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const bookId = this.getAttribute('data-id');
                deleteBook(bookId);
            });
        });
    }
}

// Function to delete a book
function deleteBook(bookId) {
    if (confirm('Are you sure you want to delete this book?')) {
        const localBooks = JSON.parse(localStorage.getItem("books")) || [];
        const updatedBooks = localBooks.filter(book => book.id.toString() !== bookId.toString());
        localStorage.setItem("books", JSON.stringify(updatedBooks));
        
        // Refresh the display
        filterBooks();
        if (document.querySelector("#bookList")) {
            displayBooks(updatedBooks, "#bookList", true);
        }
    }
}

// Format books from localStorage
function formatBooks(books) {
    return books.map(book => ({
        ...book,
        id: book.id.toString(),
        title: book.title || book.name || 'Untitled Book',
        cover: book.cover || 'default-cover.jpg',
        available: book.available !== false,
        link: `bookdetailed.html?id=${book.id}`
    }));
}

function filterBooks() {
    const query = document.querySelector(".search-input").value.trim().toLowerCase();
    const searchType = document.querySelector("input[name='search-type']:checked")?.value;

    // Read only from localStorage
    const localBooks = JSON.parse(localStorage.getItem("books")) || [];
    const formattedBooks = formatBooks(localBooks);

    const results = formattedBooks.filter(book => {
        if (searchType === "available") {
            return book.available === true;
        }
        const field = book[searchType]?.toString().toLowerCase() || "";
        return field.includes(query);
    });

    displayBooks(results);
}

// Initialize the page
function initializePage() {
    // Initialize search functionality
    const searchInput = document.querySelector(".search-input");
    const radioButtons = document.querySelectorAll("input[name='search-type']");
    
    if (searchInput) searchInput.addEventListener("input", filterBooks);
    if (radioButtons) radioButtons.forEach(radio => radio.addEventListener("change", filterBooks));
    
    // Load all books from localStorage
    const localBooks = JSON.parse(localStorage.getItem("books")) || [];
    const formattedBooks = formatBooks(localBooks);
    
    // Display in main content area
    displayBooks(formattedBooks, ".book-content");
    
    // Display in management area with actions (if the element exists)
    if (document.querySelector("#bookList")) {
        displayBooks(formattedBooks, "#bookList", true);
    }
}

// Initialize the page when DOM is loaded
document.addEventListener("DOMContentLoaded", initializePage);