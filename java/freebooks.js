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
              <img src="${book.cover}" alt="${book.title}">
            </div>
            <p class="book_name">${book.title}</p>
          </a>
        </div>`;
    });
  }
  
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
  