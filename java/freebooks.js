// Display books in the container
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
            ${showActions ? `
            <div class="book-actions">
                <div class="dropdown">
                    <button class="dropdown-btn"><i class="fas fa-ellipsis-v"></i></button>
                    <div class="dropdown-content">
                        <a href="EditBooks.html?id=${bookId}">Edit</a>
                        <a href="#" class="delete-book" data-id="${bookId}">Delete</a>
                    </div>
                </div>
            </div>` : ''}
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
        const allBooks = JSON.parse(localStorage.getItem("books")) || [];
        displayBooks(allBooks, "#bookList", true);
    }
}

function filterBooks() {
    const query = document.querySelector(".search-input").value.trim().toLowerCase();
    const searchType = document.querySelector("input[name='search-type']:checked")?.value;

    // Read only from localStorage
    const allBooks = JSON.parse(localStorage.getItem("books")) || [];

    const results = allBooks.filter(book => {
        if (searchType === "available") {
            return book.available === true;
        }
        const field = book[searchType]?.toString().toLowerCase() || "";
        return field.includes(query);
    });

    displayBooks(results);
}

document.addEventListener("DOMContentLoaded", () => {
    // Initialize search functionality
    const searchInput = document.querySelector(".search-input");
    const radioButtons = document.querySelectorAll("input[name='search-type']");
    
    if (searchInput) searchInput.addEventListener("input", filterBooks);
    if (radioButtons) radioButtons.forEach(radio => radio.addEventListener("change", filterBooks));
    
    // Load all books from localStorage on page load
    const allBooks = JSON.parse(localStorage.getItem("books")) || [];
    
    // Display in main content area
    displayBooks(allBooks, ".book-content");
    
    // Display in management area with actions (if the element exists)
    const bookListContainer = document.querySelector("#bookList");
    if (bookListContainer) {
        displayBooks(allBooks, "#bookList", true);
    }
});
  
  function filterBooks() {
    const query = document.querySelector(".search-input").value.trim().toLowerCase();
    const searchType = document.querySelector("input[name='search-type']:checked")?.value;
  
    fetch("books.json")
      .then(res => res.json())
      .then(jsonBooks => {
        const localBooks = JSON.parse(localStorage.getItem("books")) || [];
  
        const formattedLocalBooks = localBooks.map((book, index) => ({
          id: (index + 9).toString(),
          title: book.name,
          author: book.author,
          category: book.category,
          cover: `photos/${book.cover}`,
          available: book.available,
          link: `bookdetailed.html?id=${index + 9}`
        }));
  
        const formattedJsonBooks = jsonBooks.map(book => ({
          ...book,
          link: `bookdetailed.html?id=${book.id}`
        }));
  
        const allBooks = [...formattedJsonBooks, ...formattedLocalBooks];
  
        const results = allBooks.filter(book => {
          if (searchType === "available") {
            return book.available === true;
          }
          const field = book[searchType]?.toLowerCase() || "";
          return field.includes(query);
        });
  
        displayBooks(results);
      })
      .catch(error => console.error("Error loading books:", error));
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector(".search-input");
    const radioButtons = document.querySelectorAll("input[name='search-type']");
  
    searchInput.addEventListener("input", filterBooks);
  
    radioButtons.forEach(radio => {
      radio.addEventListener("change", filterBooks);
    });
  
    // Load all books on page load
    fetch("books.json")
      .then(res => res.json())
      .then(jsonBooks => {
        const localBooks = JSON.parse(localStorage.getItem("books")) || [];
  
        const formattedLocalBooks = localBooks.map((book, index) => ({
          id: (index + 9).toString(),
          title: book.name,
          author: book.author,
          category: book.category,
          cover: `photos/${book.cover}`,
          available: book.available,
          link: `bookdetailed.html?id=${index + 9}`
        }));
  
        const formattedJsonBooks = jsonBooks.map(book => ({
          ...book,
          link: `bookdetailed.html?id=${book.id}`
        }));
  
        const allBooks = [...formattedJsonBooks, ...formattedLocalBooks];
        displayBooks(allBooks);
      });
  });

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
}

// Merge JSON books with localStorage books
function mergeBooks(jsonBooks, localBooks) {
    // Process JSON books (original books)
    const processedJsonBooks = jsonBooks.map(book => ({
        ...book,
        link: `bookdetailed.html?id=${book.id}`
    }));

    // Process local storage books (user-added books)
    const processedLocalBooks = localBooks.map(book => ({
        ...book,
        id: book.id.toString(), 
         title: book.title || book.name,
        cover: book.cover || 'default-cover.jpg',
        available: book.available !== false,
        link: `bookdetailed.html?id=${book.id}` 
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

document.addEventListener("DOMContentLoaded", () => {
    // Initialize search functionality
    const searchInput = document.querySelector(".search-input");
    const radioButtons = document.querySelectorAll("input[name='search-type']");
    
    if (searchInput) searchInput.addEventListener("input", filterBooks);
    if (radioButtons) radioButtons.forEach(radio => radio.addEventListener("change", filterBooks));
    
    // Load all books on page load
    fetch("books.json")
        .then(res => res.json())
        .then(jsonBooks => {
            const localBooks = JSON.parse(localStorage.getItem("books")) || [];
            const allBooks = mergeBooks(jsonBooks, localBooks);
            
            // Display in main content area
            displayBooks(allBooks, ".book-content");
            
            // Display in management area with actions
            displayBooks(localBooks, "#bookList", true);
        })
        .catch(error => console.error("Error loading books:", error));



});