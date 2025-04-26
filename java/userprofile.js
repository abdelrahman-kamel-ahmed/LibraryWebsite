
document.getElementById('viewBorrowedBtn').addEventListener('click', function() {
    // Fetch all books (simulate fetching, you can adjust this if you store borrowed books separately)
    const books = JSON.parse(localStorage.getItem('borrowedBooks')) || [];

    if (books.length === 0) {
        document.getElementById('borrowedBooksContainer').innerHTML = "<p>No borrowed books found.</p>";
        return;
    }

    let content = '';
    books.forEach(book => {
        let coverPath = book.cover;
        if (coverPath && coverPath.startsWith("photos/")) {
            coverPath = coverPath.replace("photos/", "");
        }
        const finalCoverPath = book.cover && book.cover !== 'N/A' ? 
            'photos/' + coverPath : 'photos/default-cover.jpg';
        
        const bookTitle = book.title || book.name || 'Untitled Book';

        content += `
            <div class="col-5">
                <div class="image">
                    <img src="${finalCoverPath}" alt="${bookTitle}" style="width:120px;height:170px;">
                </div>
                <p class="book_name">${bookTitle}</p>
            </div>
        `;
    });

    document.getElementById('borrowedBooksContainer').innerHTML = content;
});
