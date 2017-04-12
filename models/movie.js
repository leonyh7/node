var mongoose = require('mongoose'),
    MovieSchema = require('../schemas/movies')
    Movie = mongoose.model('Movie', MovieSchema)

module.exports = Movie