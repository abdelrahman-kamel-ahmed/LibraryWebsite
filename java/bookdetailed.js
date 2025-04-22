
         // Get ID from URL
         const params = new URLSearchParams(window.location.search);
        const bookId = params.get("id");
    
        fetch("books.json")
            .then(res => res.json())
            .then(books => {
                const book = books.find(b => b.id === bookId);
                if (!book) {
                    document.querySelector("main").innerHTML = "<h2>Book not found</h2>";
                    return;
                }
    
                document.querySelector(".book-cover img").src = book.cover;
                document.querySelector(".book-status").textContent = book.available ? "Available" : "Unavailable";
                /////////////////////////////////////////////////////////// check if book is available or not ////////////////////////////
                const statusElement = document.querySelector(".book-status");
                statusElement.textContent = book.available ? "Available" : "Unavailable";

                // Remove both classes first
                statusElement.classList.remove("available", "unavailable");

                // Add the correct class based on availability
                statusElement.classList.add(book.available ? "available" : "unavailable");
                //////////////////////////////////////////////////////////////////////////
                document.querySelector("h1").textContent = book.title;
    
                const meta = document.querySelector(".book-meta");
                meta.innerHTML = `
                    <span class="author">By: ${book.author}</span>
                    <span class="category">Category: ${book.category}</span>
                    <span class="isbn">ISBN: ${book.isbn}</span>
                    <span class="publication-year">Published: ${book.year}</span>
                    <span class="publisher">${book.publisher}</span>
                    <span class="language">Language: ${book.language}</span>
                `;
    
                document.querySelector(".book-description p").textContent = book.description;
            })
            .catch(err => {
                console.error("Error loading book:", err);
            });
 
/*----------------  READS FROM LOCAL STORAGE IN ADDBOOKS.JS----------- */


const books = JSON.parse(localStorage.getItem("books")) || [];
const book = books.find(b => b.id === bookId);

if (book) {
  document.getElementById("bookCover").src = book.cover;
  document.getElementById("bookTitle").textContent = book.name;
  document.getElementById("bookAuthor").textContent = book.author;
  document.getElementById("bookCategory").textContent = book.category;
  document.getElementById("bookDescription").textContent = book.description;
  document.getElementById("downloadBtn").href = book.pdf;
} else {
  document.body.innerHTML = "<h2 style='text-align:center;'>Book not found 😢</h2>";
}
