class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// LocalStorage functionality
class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();
        const filteredBooks = books.filter(book => book.isbn !== isbn);
        localStorage.setItem('books', JSON.stringify(filteredBooks));
    }
}

// functionality
class UI {
    // method for add book to list
    addBookToList(book) {
        const list = document.getElementById('book-list');
        const row = document.createElement('tr');
        row.innerHTML = `
        <td> ${book.title} </td>
        <td> ${book.author} </td>
        <td> ${book.isbn} </td>
        <td> <button class="delete btn btn-outline-dark">X</button> </td>
        `;
        list.appendChild(row);
    }

    showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert ${className}`;
        div.appendChild(document.createTextNode(message)); 
        const container = document.querySelector('.container');
        const form = document.getElementById('book-form');

        container.insertBefore(div, form);

        // Remove after 2 seconds
        setTimeout(() => {
            document.querySelector('.alert').remove();
        }, 2000);
    }

    clearFields() {
        document.getElementById('book-title').value = '';
        document.getElementById('book-author').value = '';
        document.getElementById('book-isbn').value = '';
    }

    deleteBook(target) {
        if (target.classList.contains('delete')) {
            target.parentElement.parentElement.remove();
        }
    }

    static displayBooks() {
        const books = Store.getBooks();
        books.forEach(book => {
            const ui = new UI();
            ui.addBookToList(book);
        });
    }
}

// Load books from localStorage when DOM loads
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// When submitting
document.getElementById('book-form').addEventListener('submit', (e) => {
    const title = document.getElementById('book-title').value;
    const author = document.getElementById('book-author').value;
    const isbn = document.getElementById('book-isbn').value;

    const book = new Book(title, author, isbn);
    const ui = new UI();

    // Validation
    if (title === '' || author === '' || isbn === '') {  
        ui.showAlert('Please fill in all fields', 'error');
    } else {
        ui.addBookToList(book);
        Store.addBook(book);  // Save to localStorage
        ui.showAlert('Book added successfully', 'success');
        ui.clearFields();
    }

    e.preventDefault();
});

// Delete book event (using event delegation for dynamically added elements)
document.getElementById('book-list').addEventListener('click', (e) => {
    const ui = new UI();
    
    // Delete book
    ui.deleteBook(e.target);

    // Remove from localStorage
    const isbn = e.target.parentElement.previousElementSibling.textContent;
    Store.removeBook(isbn);

    // Show alert
    ui.showAlert('Book removed', 'success');
});



