var express = require('express'),
    mongoose = require('mongoose'),
    _ = require('underscore'),
    Movie = require('./models/movie'),
    app = express(),
    serveStatic = require('serve-static'),
    bodyParser = require('body-parser')

mongoose.connect('mongodb://localhost/imooc')

app.set('views', './views/pages')
app.set('view engine', 'jade')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(serveStatic('public'))
app.locals.moment = require('moment');

app.listen(3000)
console.log('server start on port ' + 3000);

app.get('/', function (req, res) {
    Movie.fetch(function (err, movies) {
        if (err) {
            console.error(err)
        }

        res.render('index', {
            title: '首页',
            movies: movies
        })
    })
})

app.get('/movie/:id', function (req, res) {
    var id = req.params.id

    Movie.findById(id, function (err, movie) {
        res.render('detail', {
            title: movie.title,
            movie: movie
        })
    })
})

app.get('/admin/movie', function (req, res) {
    res.render('admin', {
        title: '后台录入',
        movie: {
            title: ''
        }
    })
})

// admin update movie
app.get('/admin/update/:id', function (req, res) {
    var id = req.params.id

    if (!!id) {
        Movie.findById(id, function (err, movie) {
            res.render('admin', {
                title: '后台更新页',
                movie: movie
            })
        })
    }
})

// admin post movie
app.post('/admin/movie/new', function (req, res) {
    var id = req.body.movie._id,
        movieObj = req.body.movie;
    var _movie

    if (!!id) {
        Movie.findById(id, function (err, movie) {
            if (err) {
                console.error(err)
            }

            _movie = _.extend(movie, movieObj)
            _movie.save(function (err, movie) {
                if (err) {
                    console.error(err)
                }
            })
        })
    } else {
        _movie = new Movie({
            title: movieObj.title
        })

        _movie.save(function (err, movie) {
            if (err) {
                console.error(err)
            }

        })
    }

    res.redirect('/movie/' + movie._id)
})

// delete movie
app.delete('/admin/list', function (req, res) {
    var id = req.query.id
    if (!!id) {
        Movie.remove({ _id: id }, function (err, movie) {
            if (err) {
                console.error(err)
            } else {
                res.json({ success: 1 })
            }
        })
    }
})