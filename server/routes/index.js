//路由配置

const Router = require('koa-router');
const md5 = require('md5')
const Models = require('../models');
const Sequelize = require('sequelize');



const router = new Router();

/**
 * /test 
 * 测试router
 */
// router.get('/test',async ctx=>{
//     ctx.body = 'test success'
// })

/**
 * /
 * 首页 get
 * ?page=  ,?prepage=
 */
router.get('/',async ctx=>{
    let page = ctx.request.query.page || 1;
    let numPerPage = ctx.request.query.prepage || 2;
    let offset = (page-1)*numPerPage;

    let rs = await Models.Contents.findAndCountAll({
        limit:numPerPage,
        offset,
        include:[  //使得查询到的每条content记录有user信息
            Models.Users
        ]
    })
    // console.log(rs.rows)
    ctx.body = {
        code:0,
        count:rs.count,
        prepage:numPerPage,
        data:rs.rows.map(item=>{
            return {
                id:item.id,
                title:item.title,
                content:item.content,
                user_id:item.user_id,
                username:item.username,
                created_at:item.createdAt,
                like_count:item.like_count,
                comment_count:item.comment_count
            }
        })
    }

})

/**
 * /
 * 注册 post
 * 表单
 */
router.post('/register',async ctx=>{
    let username = ctx.request.body.username.trim();
    let password = ctx.request.body.password.trim();
    let repassword = ctx.request.body.repassword.trim();

    if(username==''||password==''||repassword==''){
        return ctx.body = {
            code:1,
            data:'用户名或密码不能为空！'
        }
    }
    if(password !== repassword){
        return ctx.body = {
            code:2,
            data:"两次密码输入不一致！"
        }
    }
    let user = await Models.Users.findOne({
        where:{
            username
        }
    })
    if(!Object.is(null,user)){
        return ctx.body = {
            code:3,
            data:'当前用户已经被注册了！'
        }
    }
    let newUser = await Models.Users.build({
        username,
        password:md5(password)
    }).save()
    ctx.body = {
        code:0,
        data:{
            id:newUser.get('id'),
            username:newUser.get('username')
        }
    }   
})

/**
 * /
 * 登录 post
 * 表单
 */
router.post('/login',async ctx =>{
    let username = ctx.request.body.username;
    let password = ctx.request.body.password;
    // console.log(username,password)
    let user = await Models.Users.findOne({
        where: {
            username
        }
    });
    // console.log(user)
    if(Object.is(null,user)){
        return ctx.body = {
            code:1,
            data:'不存在该用户'
        }
    }
    if(user.get('password')!== md5(password)){
        return ctx.body = {
            code:1,
            data:'密码错误'
        }
    }
    //登录成功后返回凭证给前端
    ctx.cookies.set('username',user.get('username'),{
        httpOnly:false,
    })
    // ctx.cookies.set('uid',user.get('id'),{
    //     httpOnly:true
    // })
    ctx.session.uid =user.get('id');
    ctx.body = {
        code:0,
        data:{
            id:user.get('id'),
            username:user.get('username')
        }
    }
  
})


/**
 * /like
 * 点赞
 * 表单
 */
router.post('/like',async ctx=>{
    let contentId = ctx.request.body.content_id;
    // console.log(contentId)
    let uid = ctx.session.uid;
    if(!uid){
        return ctx.body = {
            code:1,
            data:'你还没登录'
        }
    }

    let content = await Models.Contents.findById(contentId)
    if(!content){
        return ctx.body = {
            code:1,
            data:'没有对应内容！'
        }
    }
    let like = await Models.Likes.findOne({
        where:{
            [Sequelize.Op.and]:[
                {'content_id':contentId},
                {'user_id':uid}
            ]
        }
    })
    if(like){
        return ctx.body = {
            code:3,
            data:'你已经点赞过了'
        }
    }
    //若没点赞过
    content.set('like_count',content.get('like_count')+1)
    await content.save()
    await Models.Likes.build({
        content_id:contentId,
        user_id:uid
    }).save()
    ctx.body = {
        code:0,
        data:content//返回这条content对象
    }


    

})

router.post('/comment',async ctx=>{
    let content_id = ctx.request.body.content_id;
    let comment = ctx.request.body.comment.trim();
    if(!comment){
        return ctx.body={
            code:1,
            data:'发布内容不能为空'
        }
    }

    let uid = ctx.session.uid;
    if(!uid){
        return ctx.body = {
            code:1,
            data:'你还没登录'
        }
    }
    // console.log(uid,content_id,comment)
    let contentItem = await Models.Contents.findById(content_id)
    // console.log(contentItem)
    if(!contentItem){
        return ctx.body =  {
            code:1,
            data:'没有对应内容！'
        }
    }
    contentItem.set('comment_count',contentItem.get('comment_count')+1)
    await contentItem.save()
    await Models.Comments.build({
        content_id,
        user_id:uid,
        content:comment
    }).save()
    ctx.body = {
        code:0,
        data:contentItem//返回这条content对象
    }
    


})
module.exports = router;