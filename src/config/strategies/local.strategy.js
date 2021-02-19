const passport = require('passport');
const { Strategy } = require('passport-local');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:local.strategy');

function localStrategy(){
    passport.use( new Strategy(
        {
            usernameField: 'username',
            passwordField: 'password'
        }, (username, password, done) => {
            //Check against DB

            const url = 'mongodb://localhost/27017';
            const dbName = 'libraryApp';
            (async function mongo(){
                let client;
                try {
                    client = await MongoClient.connect(url);
                    debug('Connected to MongoDB ...');
                    const db = client.db(dbName);
                    const col = await db.collection('users');
                    const user = await col.findOne({ username });
                    
                    if ( user.password === password ) {
                        done(null, user);
                    } 
                    else {
                        done(null, false);
                    }
                }
                catch (err) {
                    debug(err.stack);
                }
                finally {
                    client.close();
                }
            }());
        } 
    ));
}

module.exports = localStrategy;
