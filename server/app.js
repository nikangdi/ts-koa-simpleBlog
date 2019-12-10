//服务器端搭建
(async function(){
    const Koa = require('koa')
    const bodyParser = require('koa-bodyparser')
    const staticCache = require('koa-static-cache')
    const router = require('./routes/index')
    const Session = require('koa-session')


    const app = new Koa();

    app.keys = ['miaov'];
    app.use( Session({
        key: 'koa:sess',//是cookie中的key名
        maxAge: 86400000,
        autoCommit: true,
        overwrite: true,
        httpOnly: true,
        signed: true,
        rolling: false,
        renew: false
    }, app) );

    app.use(staticCache('./public',{
        prefix:'public',
        gzip:true
    }))

    app.use(bodyParser())

    // app.use(async ctx=>{
    //     ctx.body = 'hello'
    // })

    app.use(router.routes())
    app.listen(80)
})()