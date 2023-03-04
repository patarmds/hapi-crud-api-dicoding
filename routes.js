const handler = require('./handler')

const routes = [
    {
        method: 'GET',
        path: '/',
        handler: handler.index,
    },
    {
        method: 'POST',
        path: '/books',
        handler: handler.addBook,
    },
    {
        method: 'GET',
        path: '/books',
        handler: handler.getBooks,
    },
    {
        method: 'GET',
        path: '/books/{bookId}',
        handler: handler.getBook,
    },
    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: handler.updateBook,
    },
    {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: handler.deleteBook,
    },
    {
        method: '*',
        path: '/{any*}',
        handler: (request, h) => {
            return 'Halaman tidak ditemukan';
        },
    },
];
 
module.exports = routes;