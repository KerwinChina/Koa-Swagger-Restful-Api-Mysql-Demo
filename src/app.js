import Koa2 from 'koa'
import KoaBody from 'koa-body'
import KoaStatic from 'koa-static2'
import { System as SystemConfig } from '../config/config'
import path from 'path'
import MainRoutes from './routes/main-routes'
import ErrorRoutesCatch from './middleware/ErrorRoutesCatch'
import ErrorRoutes from './routes/error-routes'
import jwt from 'koa-jwt'

const app = new Koa2()
const env = process.env.NODE_ENV || 'development'

app
  .use((ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*')
    ctx.set(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    )
    ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')

    return next()
  })
  .use(ErrorRoutesCatch())
  .use(KoaStatic('assets', path.resolve(__dirname, '../assets')))
  .use(
    jwt({ secret: SystemConfig.JWT_Sign }).unless({
      path: [/^\/adduser/, /^\/helloworld/, /^\/swagger/, /^\/public/],
    })
  )
  .use(
    KoaBody({
      multipart: true,
      parsedMethods: ['POST', 'PUT', 'PATCH', 'GET', 'HEAD', 'DELETE'],
      formidable: {
        uploadDir: path.join(__dirname, '../assets/uploads/tmp'),
      },
      jsonLimit: '10mb',
      formLimit: '10mb',
      textLimit: '10mb',
    })
  )
  .use(MainRoutes.routes())
  .use(MainRoutes.allowedMethods())
  .use(ErrorRoutes())

app.listen(SystemConfig.API_server_port)

console.log(
  'Now start API server on port ' + SystemConfig.API_server_port + '...'
)

module.exports = app
