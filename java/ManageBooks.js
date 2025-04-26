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
        // Remove duplicate 'photos/' prefix if exists
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
            <div class="book-actions">
            <a href="EditBooks.html?id=${bookId}" class="options edit-btn">Edit</a>
            <a href="#" class="options delete-btn">Delete</a>
            </div>
        </div>`;
    });

  
    // Add event listeners to all delete buttons
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const bookId = this.closest('.col-5').getAttribute('data-id');
            deleteBook(bookId);
        });
    });
}

// Function to delete a book
function deleteBook(bookId) {
    if (!confirm('Are you sure you want to delete this book?')) return;
    
    let books = JSON.parse(localStorage.getItem('books')) || [];
    books = books.filter(book => book.id.toString() !== bookId.toString());
    localStorage.setItem('books', JSON.stringify(books));
    
    // Refresh the display
    displayBooks(books, "#bookList", true);
    
    if (books.length === 0) {
        document.querySelector("#bookList").innerHTML = "<p>No books found.</p>";
    }
    
    alert('Book deleted successfully!');
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Load books from localStorage
    const books = JSON.parse(localStorage.getItem('books')) || [];
    displayBooks(books, "#bookList", true);
});



function filterBooks() {
    const query = document.querySelector(".search-input").value.trim().toLowerCase();
    const searchType = document.querySelector("input[name='search-type']:checked")?.value;
  
    fetch("books.json")
        .then(res => res.json())
        .then(jsonBooks => {
            const localBooks = JSON.parse(localStorage.getItem("books")) || [];
            const allBooks = mergeBooks(jsonBooks, localBooks);
  
            const results = allBooks.filter(book => {
                if (searchType === "available") {
                    return book.available === true;
                }
                const field = book[searchType]?.toString().toLowerCase() || "";
                return field.includes(query);
            });
  
            displayBooks(results);
        })
        .catch(error => console.error("Error loading books:", error));
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

function filterBooks() {
    const query = document.querySelector(".search-input").value.trim().toLowerCase();
    const searchType = document.querySelector("input[name='search-type']:checked")?.value;
  
    fetch("books.json")
        .then(res => res.json())
        .then(jsonBooks => {
            const localBooks = JSON.parse(localStorage.getItem("books")) || [];
            const allBooks = mergeBooks(jsonBooks, localBooks);
  
            const results = allBooks.filter(book => {
                if (searchType === "available") {
                    return book.available === true;
                }
                const field = book[searchType]?.toString().toLowerCase() || "";
                return field.includes(query);
            });
  
            displayBooks(results);
        })
        .catch(error => console.error("Error loading books:", error));
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