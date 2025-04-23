document.addEventListener('DOMContentLoaded', function() {
    // Show books from localStorage
    const bookListContainer = document.getElementById("bookList");
    const books = JSON.parse(localStorage.getItem("books")) || [];

    if (books.length === 0 && bookListContainer) {
        bookListContainer.innerHTML = "<p>No books found.</p>";
    } else {
        books.forEach((book) => {
            const bookId = book.id;
            const bookCard = document.createElement("div");
            bookCard.classList.add("col-5");

            bookCard.innerHTML = `
                <div class="book-actions">
                    <div class="dropdown">
                        <button class="dropdown-btn"><i class="fas fa-ellipsis-v"></i></button>
                        <div class="dropdown-content">
                            <a href="EditBooks.html?id=${bookId}">Edit</a>
                            <a href="#" class="delete-book" data-id="${bookId}">Delete</a>
                        </div>
                    </div>
                </div>
                <a href="bookdetailed.html?id=${bookId}">
                    <div class="image">
                        <img src="photos/${book.cover}" alt="">
                    </div>
                    <p class="book_name">${book.name}</p>
                </a>
            `;
            
            if (bookListContainer) {
                bookListContainer.parentNode.insertBefore(bookCard, bookListContainer);
            }
        });
        
        if (bookListContainer) {
            bookListContainer.remove();
        }
    }

    // Delete event listener
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-book')) {
            e.preventDefault();
            const bookId = e.target.getAttribute('data-id');
            deleteBook(bookId);
        }
    });

    /*------------ PROPERLY WORKING DELETE FUNCTION -----------*/
    function deleteBook(bookId) {
        if (confirm('Are you sure you want to delete this book?')) {
            // Get current books from localStorage
            let books = JSON.parse(localStorage.getItem("books")) || [];
            
            // Filter out the book with matching ID (proper comparison)
            books = books.filter(book => book.id.toString() !== bookId.toString());
            
            // Save back to localStorage
            localStorage.setItem("books", JSON.stringify(books));
            
            // Remove from DOM
            const bookElement = document.querySelector(`.delete-book[data-id="${bookId}"]`).closest('.col-5');
            if (bookElement) {
                bookElement.remove();
            }
            
            // Optional: Show success message
            alert('Book deleted successfully!');
            
        }
    }
});