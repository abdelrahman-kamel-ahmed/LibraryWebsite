document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!user || user.role !== "User") {
        alert("Access denied. Only user can view this page.");
        window.location.href = "login.html";
        return;
    }

    document.getElementById("userName").innerText = user.username;
    document.getElementById("adminEmail").innerText = user.email;
});

document.addEventListener("DOMContentLoaded", function () {
    const logoutButton = document.getElementById("logoutBtn");

    logoutButton.addEventListener("click", function(event) {
        event.preventDefault(); 
        logout();
    });
});

function logout() {
    const confirmLogout = confirm("Are you sure you want to logout?");
    if (confirmLogout) {
        localStorage.removeItem("currentUser");
        window.location.href = "login.html";
    }
}

window.borrowBook = function(bookId) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const books = JSON.parse(localStorage.getItem('books')) || [];

    if (!currentUser || users.length === 0 || books.length === 0) {
        alert('Data not found.');
        return;
    }

    const book = books.find(b => b.id.toString() === bookId.toString());
    if (!book || !book.available) {
        alert('Book not available.');
        return;
    }

    const userIndex = users.findIndex(u => u.username === currentUser.username && u.email === currentUser.email);
    if (userIndex === -1) {
        alert('User not found.');
        return;
    }

    const alreadyBorrowed = currentUser.borrowedBooks?.some(b => b.id.toString() === bookId.toString());
    if (alreadyBorrowed) {
        alert('You already borrowed this book.');
        return;
    }

    const bookToBorrow = {
        id: book.id,
        title: book.title,
        cover: book.cover || 'default-cover.jpg',
    };

    if (!currentUser.borrowedBooks) {
        currentUser.borrowedBooks = [];
    }
    if (!users[userIndex].borrowedBooks) {
        users[userIndex].borrowedBooks = [];
    }

    currentUser.borrowedBooks.push(bookToBorrow);
    users[userIndex].borrowedBooks.push(bookToBorrow);

    book.available = false;

    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('books', JSON.stringify(books));

    const borrowedList = currentUser.borrowedBooks.map(b => `- ${b.title}`).join('\n');

    alert(`Book borrowed successfully!\n\nYour Borrowed Books:\n${borrowedList}`);

    window.location.href = "userprofile.html";
}

function returnBook(index) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser || !users.length) {
        alert('No user data found.');
        return;
    }

    const userIndex = users.findIndex(u => u.username === currentUser.username && u.email === currentUser.email);

    if (userIndex !== -1) {
        const borrowedBooks = currentUser.borrowedBooks || [];
        const returnedBook = borrowedBooks[index];
        
        if (!returnedBook) {
            alert('Book not found.');
            return;
        }

        borrowedBooks.splice(index, 1);

        const books = JSON.parse(localStorage.getItem('books')) || [];
        const bookIndex = books.findIndex(b => b.id.toString() === returnedBook.id.toString());
        if (bookIndex !== -1) {
            books[bookIndex].available = true;
            localStorage.setItem('books', JSON.stringify(books));
        }

        users[userIndex].borrowedBooks = borrowedBooks;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));

        alert('Book returned successfully.');
        location.reload();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const borrowedBooksList = document.getElementById('borrowedBooksList');
  
    const getCoverPath = (cover) => {
      if (!cover) return 'photos/default-cover.jpg';
      const cleanCover = cover.replace(/^photos\//, '');
      return `photos/${cleanCover}`;
    };
  
    if (!currentUser || !currentUser.borrowedBooks || currentUser.borrowedBooks.length === 0) {
      borrowedBooksList.innerHTML = '<p>No borrowed books yet.</p>';
    } else {
      borrowedBooksList.innerHTML = '';
      currentUser.borrowedBooks.forEach((book, index) => {
        const bookItem = document.createElement('div');
        bookItem.classList.add('borrowed-book-card');
        bookItem.innerHTML = `
          <img src="${getCoverPath(book.cover)}" alt="${book.title}" class="book-cover-small">
          <div class="book-info">
            <h3>${book.title}</h3>
            <button onclick="returnBook(${index})" class="return-btn">Return Book</button>
          </div>
        `;
        borrowedBooksList.appendChild(bookItem);
      });
    }
  });
  