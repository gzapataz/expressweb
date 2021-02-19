
const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const sql = require('mssql');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const configData = require('/Users/gabrielzapata/spfiles/expresswebConfig/config.js');

//const { generateKeyPair } = require('crypto');

const app = express();
const port = process.env.PORT || 3000;


const config = {
    user: configData.DBUSER,
    password: configData.DBPASSWORD,
    server: configData.DBURL,        // You can use 'localhost\\instance' to connect to named instance
    database: 'gbzlib',
    options: {
        encrypt: true,
        enableArithAbort: true
    }
};

sql.connect(config).catch(err => debug(err));

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());
app.use(session({   secret: configData.SECRET_SESS,    
                    resave: true,
                    saveUninitialized: true
}));

require('./src/config/passport.js')(app);

app.use(express.static(path.join(__dirname, '/public/')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.set('views', './src/views');
app.set('view engine', 'ejs');

const nav = [ {link: '/books', title: 'Book'}, 
              {link: '/authors', title: 'Author'}];

const booksRouter = require('./src/routes/bookRoutes')(nav);
const adminRouter = require('./src/routes/adminRoutes')(nav);
const authRouter = require('./src/routes/authRoutes')(nav);

app.use('/books', booksRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);

app.get('/', function(req, res){
    //res.sendFile(path.join(__dirname, 'views/index.html'));
    res.render('index', {
        nav: [ {link: '/books', title: 'Books'}, 
            {link: '/authors', title: 'Authors'}], title: 'Library'
    });
});


app.listen(port, function(){
    debug(`Listening on port ${chalk.green(port)}`);
});