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
        const finalCoverPath = book.cover && book.cover !== 'N/A' ?
            'photos/' + coverPath : 'photos/default-cover.jpg';
        
        const bookId = book.id;
        const bookTitle = book.title || book.name || 'Untitled Book';
        
        container.innerHTML += `
        <div class="col-5" data-id="${bookId}">
            <a href="bookdetailed.html?id=${bookId}">
                <div class="image">
                    <img src="${finalCoverPath}" alt="${bookTitle}">
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

    // Add delete button events
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

// Merge JSON books with localStorage books
function mergeBooks(jsonBooks, localBooks) {
    const processedJsonBooks = jsonBooks.map(book => ({
        ...book,
        link: `bookdetailed.html?id=${book.id}`
    }));

    const lastJsonId = jsonBooks.length > 0 ?
        Math.max(...jsonBooks.map(b => parseInt(b.id))) : 0;

    const processedLocalBooks = localBooks.map((book, index) => ({
        ...book,
        id: (lastJsonId + index + 1).toString(),
        title: book.title || book.name,
        cover: book.cover || 'default-cover.jpg',
        available: book.available !== false,
        link: `bookdetailed.html?id=${lastJsonId + index + 1}`
    }));

    return [...processedJsonBooks, ...processedLocalBooks];
}

// Filter books
function filterBooks() {
    const inputElement = document.querySelector(".search-input");
    const query = inputElement.value.trim().toLowerCase();
    const searchType = document.querySelector("input[name='search-type']:checked")?.value || "title";

    fetch("books.json")
        .then(res => res.json())
        .then(jsonBooks => {
            const localBooks = JSON.parse(localStorage.getItem("books")) || [];
            const allBooks = mergeBooks(jsonBooks, localBooks);

            let results = allBooks;

            if (query) {
                results = allBooks.filter(book => {
                    if (searchType === "available") {
                        return book.available === true;
                    }
                    const field = book[searchType]?.toString().toLowerCase() || "";
                    return field.includes(query);
                });
            }

            displayBooks(results, "#bookList", true);
        })
        .catch(error => console.error("Error loading books:", error));
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    fetch("books.json")
        .then(res => res.json())
        .then(jsonBooks => {
            const localBooks = JSON.parse(localStorage.getItem('books')) || [];
            const allBooks = mergeBooks(jsonBooks, localBooks);
            displayBooks(allBooks, "#bookList", true);
        })
        .catch(error => console.error("Error loading books:", error));

    // Setup search handlers
    document.querySelector(".search-input")?.addEventListener('input', filterBooks);
    document.querySelectorAll("input[name='search-type']").forEach(radio => {
        radio.addEventListener('change', filterBooks);
    });
});
