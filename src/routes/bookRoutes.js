const chalk = require('chalk');
const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:bookRoutes');
const bookController = require('../controllers/bookController');
const bookService = require('../services/goodreadsService');

const booksRouter = express.Router();
//const sql = require('mssql')


function router(nav) {
    const { getIndex, getById, renderById, middleware } = bookController(bookService, nav);
    booksRouter.use(middleware);
    booksRouter.route('/')
        .get(getIndex);

    booksRouter.route('/:id')
        .all(getById)
        .get(renderById);

    return booksRouter;
}

module.exports = router;