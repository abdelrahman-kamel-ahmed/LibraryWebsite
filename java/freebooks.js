document.addEventListener('DOMContentLoaded', function() {
  // Function to display books
  function displayBooks(books) {
      const container = document.getElementById("bookList");
      container.innerHTML = "";
      
      if (books.length === 0) {
          container.innerHTML = "<p>No books found.</p>";
          return;
      }
      
      books.forEach((book) => {
          const bookCard = document.createElement("div");
          bookCard.classList.add("col-5");
          
          bookCard.innerHTML = `
              <a href="bookdetailed.html?id=${book.id}">
                  <div class="image">
                      <img src="photos/${book.cover}" alt="${book.name}">
                  </div>
                  <p class="book_name">${book.name}</p>
                  <p class="book_author">${book.author}</p>
              </a>
          `;
          
          container.appendChild(bookCard);
      });
  }

  // Function to filter books based on search
  function filterBooks() {
      const query = document.querySelector(".search-input").value.trim().toLowerCase();
      const searchType = document.querySelector("input[name='search-type']:checked")?.value;
      
      const books = JSON.parse(localStorage.getItem("books")) || [];
      
      const filteredBooks = books.filter(book => {
          if (searchType === "available") {
              return book.available === true;
          }
          
          // Get the field to search based on searchType
          let fieldValue;
          switch(searchType) {
              case "title":
                  fieldValue = book.name;
                  break;
              case "author":
                  fieldValue = book.author;
                  break;
              case "category":
                  fieldValue = book.category;
                  break;
              default:
                  fieldValue = book.name;
          }
          
          return fieldValue.toLowerCase().includes(query);
      });
      
      displayBooks(filteredBooks);
  }

  // Initial load of books
  const initialBooks = JSON.parse(localStorage.getItem("books")) || [];
  displayBooks(initialBooks);

  // Set up event listeners for search
  const searchInput = document.querySelector(".search-input");
  const radioButtons = document.querySelectorAll("input[name='search-type']");
  
  searchInput.addEventListener("input", filterBooks);
  searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
          e.preventDefault();
          filterBooks();
      }
  });
  
  radioButtons.forEach(radio => {
      radio.addEventListener("change", filterBooks);
  });
});