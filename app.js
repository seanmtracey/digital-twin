const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const w3id = require('w3id-middleware');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set('etag', false);

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
    next();
});

if(process.env.NODE_ENV === "development"){

    app.use('*', (req, res, next) => {
        res.locals.w3id_userid = process.env.TEST_USER;
        next();
    });

} else {
    app.use(w3id);
}

app.use('/', require('./routes/index'));
app.use('/edit', require('./routes/edit'));
app.use('/view', require('./routes/view'));
app.use('/twins', require('./routes/twins'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
