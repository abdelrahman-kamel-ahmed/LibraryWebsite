function displayBooks(books) {
    const container = document.querySelector(".book-content");
    container.innerHTML = "";
    if (books.length === 0) {
        container.innerHTML = "<p>No books found.</p>";
        return;
    }
    books.forEach(book => {
        container.innerHTML += `
        <div class="col-5">
            <a href="${book.link}">
                <div class="image">
                    <img src="${book.cover}" alt="">
                </div>
                <p class="book_name">${book.title}</p>
            </a>
        </div>`;
    });
}
// THIS is the live search part using ajax
document.querySelector(".search-input").addEventListener("input", function () {
    const query = this.value.trim().toLowerCase();
    const searchType = document.querySelector("input[name='search-type']:checked").value;
    fetch("books.json")
        .then(response => response.json())
        .then(data => {
            const results = data.filter(book => {
                const field = book[searchType].toLowerCase();
                return field.includes(query);
            });
            displayBooks(results);
        })
        .catch(error => console.error("Error loading books:", error));
});