var express = require('express')
var serveStatic = require('serve-static')
var bodyParser = require('body-parser')
var app = express()

app.set('views', './views/pages')
app.set('view engine', 'jade')
app.use(bodyParser.urlencoded())
app.use(serveStatic('bower_components'))

app.get('/', function (req, res) {
    res.render('index', {
        title: 'imooc 首页',
        movies: [{
            title: "机械战警",
            id: 1
        },{
            title: "机械战警2",
            id: 2
        },{
            title: "机械战警3",
            id: 3
        }]
    });
})

app.get('/detail/:id', function (req, res) {
    res.render('detail', {
        title: 'imooc 详情'
    });
})

app.get('/admin', function (req, res) {
    res.render('admin', { title: 'imooc 后台' });
})

app.get('/list', function (req, res) {
    res.render('list', { title: 'imooc 列表' });
})

app.listen(3000)

console.log('localhost start on port 3000')