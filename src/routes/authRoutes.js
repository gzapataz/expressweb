const cookieParser = require('cookie-parser');
const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:authRoutes');
const authRouter = express.Router();
const passport = require('passport');

function router(nav) {
    authRouter.route('/signUp')
        .post((req, res) => {
            const {username, password} = req.body;
            const url = 'mongodb://localhost/27017';
            const dbName = 'libraryApp';
            //IIFE Immediately Invoked Function Expression
            (async function addUser(){
                let client;
                try {
                    client = await MongoClient.connect(url);
                    debug('Connected to the server');

                    const db = client.db(dbName);
                    const col = db.collection('users');
                    const user = { username, password };
                    const result = await col.insertOne(user);
                    debug(result); 
                    req.login(result.ops[0], () => {
                        res.redirect('/auth/profile');
                    })

                }
                catch(err) {
                    debug(err.stack);
                }
                finally {
                    client.close();
                }

            }());

        });
    authRouter.route('/signin')
        .get((req, res) => {
            res.render('signin', {
                nav,
                title: 'Sign In'
            })
        })
        .post(passport.authenticate('local', {
            successRedirect: '/auth/profile',
            failureRedirect: '/'
        }));
    authRouter.route('/profile')
        .all((req, res, next) => {
            if (req.user) {
                next();
            }
            else {
                res.redirect('/');
            }
        })
        .get((req, res) => {
            res.json(req.user);
        });
    return authRouter;
}

module.exports = router;