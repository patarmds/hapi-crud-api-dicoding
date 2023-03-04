const { nanoid } = require('nanoid');
const books = require('./books');

module.exports = {
    index: (request, h) => {

    },
    getBook: (request, h) => {
        const { bookId } = request.params;
        const book = books.find((book) => book.id === bookId);
        
        if(!book) return h.response({
            status: "fail",
            message: "Buku tidak ditemukan"
        }).code(404)

        return h.response({
            status: "success",
            data: {
                book
            }
        }).code(200)
    },
    getBooks: (request, h) => {
        const { reading, finished, name } = request.query;

        let booksData = [...books];

        if(reading == 1 || reading == 0) booksData = booksData.filter((book) => book.reading == reading);

        if(finished == 1 || finished == 0) booksData = booksData.filter((book) => book.finished == finished);

        if(name) booksData = booksData.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));


        booksData = booksData.map((book) => ({ id: book.id, name : book.name, publisher : book.publisher }));

        const response = {
            status: "success",
            data: {
                books: booksData
            }
        }
        return response;
    },
    addBook: (request, h) => {
        const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

        if(!name) return h.response({
            status: "fail",
            message: "Gagal menambahkan buku. Mohon isi nama buku"
        }).code(400);

        if(readPage > pageCount) return h.response({
            status: "fail",
            message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
        }).code(400);


        const id = nanoid(16);
        const insertedAt = new Date().toISOString();
        const updatedAt = insertedAt;
        const finished = pageCount === readPage;
        const newBook = {
            id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt 
        }
        books.push(newBook);

        const isSuccess = books.filter((book) => book.id === id).length > 0;

        if(isSuccess){
            const response = h.response({
                status: 'success',
                message: 'Buku berhasil ditambahkan',
                data: {
                  bookId: id
                },
              });
              response.code(201);
              return response;
        }

        const response = h.response({
            status: 'fail',
            message: 'Catatan gagal ditambahkan',
          });
          response.code(500);
          return response;
    },
    updateBook: (request, h) => {
        const { bookId } = request.params;
        const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
        

        if(!name) return h.response({
            status: "fail",
            message: "Gagal memperbarui buku. Mohon isi nama buku"
        }).code(400);

        if(readPage > pageCount) return h.response({
            status: "fail",
            message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
        }).code(400);

        const book = books.find((book, index) => {
            if(book.id === bookId){
                let finished = pageCount === readPage;
                let updatedAt = new Date().toISOString();
                books[index] = {
                    ...books[index], 
                    name, year, author, summary, publisher, pageCount, readPage, finished, reading, updatedAt 
                }
                return true;
            }
            return false;
        });

        
        if(!book) return h.response({
            status: "fail",
            message: "Gagal memperbarui buku. Id tidak ditemukan"
        }).code(404)
        
        return h.response({
            status: "success",
            message: "Buku berhasil diperbarui"
        }).code(200)
    },
    deleteBook: (request, h) => {
        const { bookId } = request.params;
        
        


        const book = books.find((book, index) => {
            if(book.id === bookId){
                books.splice(index,1);
                return true;
            }
            return false;
        });

        
        if(!book) return h.response({
            status: "fail",
            message: "Buku gagal dihapus. Id tidak ditemukan"
        }).code(404)
        
        return h.response({
            status: "success",
            message: "Buku berhasil dihapus"
        }).code(200)
    }
}