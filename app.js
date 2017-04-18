var express = require('express')
var mongoose = require('mongoose')
var _ = require('underscore')
var Movie = require('./models/movie')
var User = require('./models/user')
var app = express()
var serveStatic = require('serve-static')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var session = require('express-session')

mongoose.connect('mongodb://localhost/imooc')

app.set('views', './views/pages')
app.set('view engine', 'jade')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(session({
  secret: 'imooc',
  resave: false,
  saveUninitialized: true
}))
app.use(serveStatic('public'))
app.locals.moment = require('moment');

app.listen(3000)
console.log('server start on port ' + 3000);

/* 页面 */
// 首页列表页
app.get('/', function (req, res) {
    console.log(req.session.user)
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

// 电影详情
app.get('/movie/:id', function (req, res) {
    var id = req.params.id

    Movie.findById(id, function (err, movie) {
        res.render('detail', {
            title: movie.title,
            movie: movie
        })
    })
})

// 新电影
app.get('/admin/movie', function (req, res) {
    res.render('admin', {
        title: '后台录入',
        movie: {
            title: ''
        }
    })
})

// 修改电影
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

/* 请求 */
// 添加或修改电影
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

// 删除电影
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

// 用户模块
// 注册
app.post('/user/signup', function (req, res) {
    var _user = req.body.user

    User.findOne({ name: _user.name }, function (err, user) {
        if (err) {
            console.error(err)
        }
        if (user) { // 是否已经注册过
            return res.redirect('/')
        } else {
            var user = new User(_user)
            user.save(function (err, user) {
                if (err) {
                    console.error(err)
                }
                res.redirect('/admin/userList')
            })
        }
    })

})

//用户列表
app.get('/admin/userList', function (req, res) {
    User.fetch(function (err, users) {
        if (err) {
            console.error(err)
        }

        res.render('userList', {
            title: '用户列表',
            users: users
        })
    })
})

// 删除用户
app.delete('/admin/user/delete', function (req, res) {
    var id = req.query.id
    if (!!id) {
        User.remove({ _id: id }, function (err, movie) {
            if (err) {
                console.error(err)
            } else {
                res.json({ success: 1 })
            }
        })
    }
})

// 登录
app.post('/user/signin', function (req, res) {
    var _user = req.body.user
    var name = _user.name
    var password = _user.password

    User.findOne({ name: name }, function (err, user) {
        if (err) {
            console.error(err)
        }

        if (!user) {
            return res.redirect('/')
        }

        user.comparePassword(password, function (err, isMatch) {
            if (err) {
                console.error(err)
            }

            if (isMatch) {
                req.session.user = user
                return res.redirect('/')
            } else {
                console.log('密码错误')
            }
        })
    })
})