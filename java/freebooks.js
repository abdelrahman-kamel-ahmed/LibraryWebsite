function displayBooks(books, containerSelector = ".book-content", showActions = false) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    
    container.innerHTML = "";
  
    if (books.length === 0) {
        container.innerHTML = "<p>No books found.</p>";
        return;
    }
  
    books.forEach(book => {
        const coverPath = book.cover?.startsWith('photos/') ? book.cover : `photos/${book.cover || 'default-cover.jpg'}`;
        const bookId = book.id;
        const bookTitle = book.title || 'Untitled Book';
        
        container.innerHTML += `
        <div class="col-5" data-id="${bookId}">
            
            <a href="bookdetailed.html?id=${bookId}">
                <div class="image">
                    <img src="${coverPath}" alt="${bookTitle}">
                </div>
                <p class="book_name">${bookTitle}</p>
            </a>
        </div>`;
    });


}

function filterBooks() {
    const inputElement = document.querySelector(".search-input");
    const query = inputElement.value.trim().toLowerCase();
    const searchType = document.querySelector("input[name='search-type']:checked")?.value || "title";
    
    const allBooks = JSON.parse(localStorage.getItem('books')) || [];
    
    let results = allBooks;

    if (query) {
        results = allBooks.filter(book => {
            const fieldValue = String(book[searchType] || '').toLowerCase();
            
            if (searchType === "available") {
                return book.available !== false;
            }
            return fieldValue.includes(query);
        });
    }

    displayBooks(results, "#bookList", true);
}


document.addEventListener('DOMContentLoaded', function() {
    const books = JSON.parse(localStorage.getItem('books')) || [];
    displayBooks(books, "#bookList", true);
    
    document.querySelector(".search-input")?.addEventListener('input', filterBooks);
    document.querySelectorAll("input[name='search-type']").forEach(radio => {
        radio.addEventListener('change', filterBooks);
    });
});