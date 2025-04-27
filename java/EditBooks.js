document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');
    const editForm = document.getElementById('editBookForm');
    
    if (bookId) {
        loadBookData(bookId);
    }
    
    editForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveBookData(bookId);
    });
});

function loadBookData(bookId) {
    const books = JSON.parse(localStorage.getItem('books')) || [];
    const bookToEdit = books.find(book => book.id === bookId);
    
    if (bookToEdit) {
        document.getElementById('bookName').value = bookToEdit.title || '';
        document.getElementById('author').value = bookToEdit.author || '';
        document.getElementById('isbn').value = bookToEdit.isbn || '';
        document.getElementById('year').value = bookToEdit.year || '';
        document.getElementById('publisher').value = bookToEdit.publisher || '';
        document.getElementById('language').value = bookToEdit.language || '';
        document.getElementById('category').value = bookToEdit.category || '';
        document.getElementById('description').value = bookToEdit.description || '';
        document.getElementById('availability').value = bookToEdit.available ? 'available' : 'not-available';
    } else {
        window.location.href = 'ManageBooks.html';
    }
}

function saveBookData(bookId) {
    const title = document.getElementById('bookName').value;
    const author = document.getElementById('author').value;
    const isbn = document.getElementById('isbn').value;
    const year = document.getElementById('year').value;
    const publisher = document.getElementById('publisher').value;
    const language = document.getElementById('language').value;
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;
    const availability = document.getElementById('availability').value;
    const isAvailable = availability === 'available' ? true : false;
    const coverImageInput = document.getElementById('coverImage');
    const newCoverImage = coverImageInput.files[0];
    const pdfFileInput = document.getElementById('pdfFile');
    const newPdfFile = pdfFileInput.files[0];
    
    const books = JSON.parse(localStorage.getItem('books')) || [];
    
    if (bookId) {
        const bookIndex = books.findIndex(book => book.id === bookId);
        
        if (bookIndex !== -1) {
            const originalBook = books[bookIndex];
            let coverPath = originalBook.cover || 'photos/default-cover.jpg';
            
            if (newCoverImage) {
                coverPath = 'photos/' + newCoverImage.name;
            }

            if (newPdfFile) {
                pdfPath = 'PDF_Books/' + newPdfFile.name;
            }

            const updatedBook = {
                ...originalBook,
                title,
                author,
                isbn,
                year,
                publisher,
                language,
                category,
                description,
                cover: coverPath,
                pdf: pdfPath,
                available: isAvailable
            };
            
            books[bookIndex] = updatedBook;
            localStorage.setItem('books', JSON.stringify(books));
            window.location.href = 'ManageBooks.html';
        }
    } else {
        const newBook = {
            id: generateId(),
            title,
            author,
            isbn,
            year,
            publisher,
            language,
            category,
            description,
            cover: newCoverImage ? 'photos/' + newCoverImage.name : 'photos/default-cover.jpg',
            pdf: newPdfFile ? 'PDF_Books/' + newPdfFile.name : null,
            available: isAvailable
        };
        
        books.push(newBook);
        localStorage.setItem('books', JSON.stringify(books));
        window.location.href = 'ManageBooks.html';
    }
}

function generateId() {
    return 'book-' + Math.random().toString(36).substr(2, 9);
}
