// Toggle More Details Section
const toggleButton = document.getElementById('toggleMoreDetails');
const moreDetailsSection = document.getElementById('moreDetailsSection');

if (toggleButton && moreDetailsSection) {
  toggleButton.addEventListener('click', () => {
    const isHidden = moreDetailsSection.style.display === 'none' || !moreDetailsSection.style.display;
    moreDetailsSection.style.display = isHidden ? 'block' : 'none';
    toggleButton.textContent = isHidden ? '▲ Hide Details' : '▼ More Details';
  });
}

// Form Submission Handler
const addBookForm = document.getElementById('addBookForm');

if (addBookForm) {
  addBookForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Helper to get value or default
    const getValue = (id, defaultValue = 'N/A') => {
      const element = document.getElementById(id);
      return element ? (element.value.trim() || defaultValue) : defaultValue;
    };

    // Helper to get file name
    const getFileName = (id) => {
      const element = document.getElementById(id);
      return (element && element.files.length > 0) ? element.files[0].name : null;
    };

    const books = JSON.parse(localStorage.getItem('books')) || [];
    const newId = books.length > 0 ? Math.max(...books.map(book => parseInt(book.id))) + 1 : 1;

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

    alert('✅ Book added successfully!');
    window.location.href = "ManageBooks.html";
  });
}
