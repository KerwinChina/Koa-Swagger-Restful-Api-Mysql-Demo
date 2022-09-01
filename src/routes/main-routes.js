import { SwaggerRouter } from 'koa-swagger-decorator'
import * as path from 'path'
import { UserController } from '../controllers/user'

const router = new SwaggerRouter()

// swagger docs avaliable at http://localhost:3000/swagger-html
router.swagger({
  title: 'API test',
  description: 'API test',
  version: '1.0.0',
})

router.mapDir(path.resolve(__dirname, '../controllers/'))
// user restful

//router.get('/userById/:id', UserController.GetUser)
//router.post('/adduser', UserController.CreateUser)
//router.put('/user/:id', UserController.UpdateUser)
//router.delete('/user/:id', UserController.DeleteUser)

export default router
