const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:bookController');
const chalk = require('chalk');


function bookController(bookService, nav) {
    function getIndex(req, res) {
        const url = 'mongodb://localhost/27017';
        const dbName = 'libraryApp';
        (async function mongo() {
            // Version with MongoDB
            let client;
            try {
                client = await MongoClient.connect(url);
                debug('Connected to MongoDB in bookRoutes...');
                const db = client.db(dbName);

                const col = await db.collection('books');
                const books = await col.find().toArray();
                res.render('bookListView', {
                    nav,
                    title: 'Library',
                    books
                });
            }
            catch (err) {
                debug(err.stack);
            }
            finally {
                client.close();
            }
        }());
        /* VERSION WITH SQL SERVER
        const request = new sql.Request();
        // Code using async
        (async function query() {
            const results = await request.query('select * from books');
            debug(results);
            res.render('bookListView', {
                nav,
                title: 'Library',
                books: results.recordset
            });
        }());
        */
        /* CODE USING PROMIS
        request.query('select * from books')
            .then(results => {
                debug(results);
                res.render('bookListView', {
                    nav, 
                    title: 'Library',
                    books: results.recordset
                });
            });
        */
    }

    function getById(req, res, next) {
        const url = 'mongodb://localhost/27017';
        const dbName = 'libraryApp';
        const { id } = req.params;
        (async function mongo(){
            let client;
            try {
                client = await MongoClient.connect(url);
                debug('Connected to MongoDB in ONE bookRoutes...');
                const db = client.db(dbName);

                const col = await db.collection('books');
                req.book = await col.findOne({_id: new ObjectID(id)});
                req.book.details = await bookService.getBookById(req.book._id);
                debug(req.book + chalk.green(id));
                next();
            }
            catch(err) {
                debug(err.stack);
            }
            finally {
                client.close();
            }

        }());
        /*
        (async function query() {
            const { id } = req.params;
            const request = new sql.Request();
            const { recordset } = await request.input('id', sql.Int, id)
                .query('select * from books where id = @id');
            [req.book] = recordset;
            next();
        }());
        */
    }
    function renderById(req, res) {
        res.render('bookView', {
            nav,
            title: 'Library',
            book: req.book
        });
        //Using Async call 
        

        //Using Promises Option
        /*
        request.query(`select * from books where id = ${id}`)
            .then(results => {
                debug(results);
                res.render('bookView', {
                    nav,
                    title: 'Library',
                    book: results.recordset
                });
            });
        */
    }

    function middleware (req, res, next) {
        if (req.user) {
            next();
        }
        else {
            res.redirect('/');
        }
    }

    return {
        getIndex,
        getById,
        renderById,
        middleware
    };
}

module.exports = bookController;