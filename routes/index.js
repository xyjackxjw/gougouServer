const mongoose = require('mongoose')
const Router = require('koa-router')

const router = new Router()

router.get('/movies/all', async (ctx, next) => {
    const Movie = mongoose.model('Movie')
    const movies = await Movie.find({}).sort({
        'meta.createdAt': -1
    })

    console.log(movies)
    ctx.body = {
        movies
    }
})

module.exports = router