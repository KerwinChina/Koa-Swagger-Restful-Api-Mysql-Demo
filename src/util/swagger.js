const router = require('koa-router')()
const swaggerJSDoc = require('swagger-jsdoc')
const path = require('path')
const swaggerDefinition = {
  info: {
    title: 'koa2 restful api',
    version: '1.0.0',
    description: 'API',
  },
  host: 'localhost:3000',
  basePath: '/',
}
const options = {
  swaggerDefinition,
  apis: [path.join(__dirname, '../routes/*.js')],
}
const swaggerSpec = swaggerJSDoc(options)
// 通过路由获取生成的注解文件
router.get('/swagger.json', async function (ctx) {
  ctx.set('Content-Type', 'application/json')
  ctx.body = swaggerSpec
})
module.exports = router
