const Koa = require('koa')
const mongoose = require('mongoose')
import { resolve } from 'path'
const R = require('ramda')
import { connect, initSchemas, initAdmin, addMovie} from './database/init'
const router = require('./routes/index') 

const MIDDLEWARES = ['common', 'router'] 

//函数式编程,引入所有的中间件
const useMiddlewares = (app) => {
    R.map(
        R.compose(
            R.forEachObjIndexed(
                initWith => initWith(app) 
            ),
            require,
            name => resolve(__dirname, `./middlewares/${name}`)
        )
    )(MIDDLEWARES)
}

//启动服务端
;(async () => {
    await connect() //连接数据库
    initSchemas()   //创建数据库结构
    // await initAdmin()  //创建了一个账户
    // await addMovie()


    const app = new Koa()
    await useMiddlewares(app)

    // app.use(async (ctx, next) => {
    //     await next()
    //     ctx.body = ctx.body + '   欢迎使用Koa2程序'
    // })

    app.listen(8899, () => {
        console.log('服务已启动，监听8899端口')
    })
})()
