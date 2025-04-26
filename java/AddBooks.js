// Toggle more details section
document.getElementById('toggleMoreDetails')?.addEventListener('click', function() {
  const moreDetails = document.getElementById('moreDetailsSection');
  if (!moreDetails) return;
  
  const isHidden = moreDetails.style.display === 'none' || moreDetails.style.display === '';
  moreDetails.style.display = isHidden ? 'block' : 'none';
  this.textContent = isHidden ? '▲ Hide Details' : '▼ More Details';
});

document.getElementById('addBookForm')?.addEventListener('submit', function(e) {
  e.preventDefault();

  // Helper functions remain the same
  const getValue = (id, defaultValue = 'N/A') => {
    const element = document.getElementById(id);
    return element ? (element.value.trim() || defaultValue) : defaultValue;
  };

  const getFileName = (id) => {
    const element = document.getElementById(id);
    return (element && element.files.length > 0) ? element.files[0].name : null;
  };

  const books = JSON.parse(localStorage.getItem('books')) || [];
  const newId = books.length > 0 ? Math.max(...books.map(book => parseInt(book.id))) + 1 : 1;

  // Create the new book object
  const newBook = {
    id: newId.toString(),
    title: getValue('bookName', 'Untitled'),
    author: getValue('author'),
    isbn: getValue('isbn'),
    year: getValue('year'),
    publisher: getValue('publisher'),
    language: getValue('language', 'English'),
    category: getValue('category', 'Uncategorized'),
    description: getValue('description', 'No description provided'),
    cover: getFileName('coverImage') || 'default-cover.jpg',
    pdf: getFileName('pdfFile'),
    available: true,
    edition: {
      originalPublisher: getValue('originallyPublished'),
      publishedIn: getValue('publishedIn'),
      series: getValue('series'),
      deweyDecimal: getValue('deweyDecimal'),
      pages: getValue('pages')
    },
    identifiers: {
      openLibrary: getValue('openLibraryId'),
      internetArchive: getValue('internetArchive'),
      isbn10: getValue('isbn10'),
      libraryThing: getValue('libraryThing'),
      goodreads: getValue('goodreadsId'),
      workId: getValue('workId')
    }
  };

  // Save to localStorage
  books.push(newBook);
  localStorage.setItem('books', JSON.stringify(books));

  // Create detailed message for alert
  const bookDetails = `
    📚 Book Added Successfully! 📚
    ----------------------------
    Title: ${newBook.title}
    Author: ${newBook.author}
    ISBN: ${newBook.isbn}
    Year: ${newBook.year}
    Publisher: ${newBook.publisher}
    Category: ${newBook.category}
    Language: ${newBook.language}
    Pages: ${newBook.edition.pages}
    Cover: ${newBook.cover}
    PDF: ${newBook.pdf || 'N/A'}
    ----------------------------
    More Details:
    - Originally Published: ${newBook.edition.originalPublisher}
    - Published In: ${newBook.edition.publishedIn}
    - Series: ${newBook.edition.series}
    - Dewey Decimal: ${newBook.edition.deweyDecimal}
  `;

  // Show detailed alert
  alert(bookDetails);

  // Redirect after 3 seconds to allow user to read the alert
  setTimeout(() => {
    window.location.href = "ManageBooks.html";
  }, 3000);
});

// Initialize books list on page load
document.addEventListener('DOMContentLoaded', function() {
  // Load books from localStorage
  const books = JSON.parse(localStorage.getItem('books')) || [];
  
  // Display books in management page if the container exists
  if (document.querySelector("#bookList")) {
    displayBooks(books, "#bookList", true);
  }
});

// Function to display books (should be defined in your script)
function displayBooks(books, containerSelector, showActions = false) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  
  container.innerHTML = "";

  if (books.length === 0) {
    container.innerHTML = "<p>No books found.</p>";
    return;
  }

  books.forEach(book => {
    const coverPath = book.cover ? `photos/${book.cover}` : 'photos/default-cover.jpg';
    const bookTitle = book.title || 'Untitled Book';
    
    container.innerHTML += `
    <div class="col-5">
      ${showActions ? `
      <div class="book-actions">
        <div class="dropdown">
          <button class="dropdown-btn"><i class="fas fa-ellipsis-v"></i></button>
          <div class="dropdown-content">
            <a href="EditBooks.html?id=${book.id}">Edit</a>
            <a href="#" class="delete-book" data-id="${book.id}">Delete</a>
          </div>
        </div>
      </div>` : ''}
      <a href="bookdetailed.html?id=${book.id}">
        <div class="image">
          <img src="${coverPath}" alt="${bookTitle}">
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
    const books = JSON.parse(localStorage.getItem('books')) || [];
    const updatedBooks = books.filter(book => book.id !== bookId);
    localStorage.setItem('books', JSON.stringify(updatedBooks));
    
    // Refresh the display
    displayBooks(updatedBooks, "#bookList", true);
  }
}