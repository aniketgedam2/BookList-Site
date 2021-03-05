// Book class: represet a book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}
// UI class: handle UI class

class UI {
    static DisplayBook() {

        const books = Store.getBook();
        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const List = document.querySelector("#book-list");

        const row = document.createElement('tr');

        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-ptimary btn-danger btn-sm delete">
        X</a></td>
        `;

        List.appendChild(row);
    }

    // 
    static deleteBook(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    //showing alert
    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        // vanish in 3 sec
        setTimeout(() => { document.querySelector('.alert').remove() },
            3000);
    }

    // clear fields
    static ClearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}
// Store class: handle storage
class Store {
    static getBook() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }
    static addBook(book) {
        const books = Store.getBook();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBook();
        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}
// Event : Display book
document.addEventListener('DOMContentLoaded', UI.DisplayBook);
// Event: Add Book
document.querySelector("#book-form").addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // validate 
    if (title === '' || author === '' || isbn === '') {
        UI.showAlert('please fill all the fields', 'danger');
    } else {
        // create instance of class Book
        const book = new Book(title, author, isbn);

        // ADD book to list
        UI.addBookToList(book);
        //add to store

        Store.addBook(book);
        // show alert for book added
        UI.showAlert('Book Added', 'success');
        //Clear fields after submiting
        UI.ClearFields();
    }

});
//  Event: Remove a Book
document.getElementById("book-list").addEventListener("click",
    (e) => {

        UI.deleteBook(e.target);
        Store.removeBook
            (e.target.parentElement.previousElementSibling.textContent);
        UI.showAlert('book Removed', 'success');
    });