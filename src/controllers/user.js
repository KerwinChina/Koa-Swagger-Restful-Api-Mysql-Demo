import UserModelAll from '../scheme/user'
const response = require('../util/response-util')
import jwt from 'jsonwebtoken'
import { System } from '../config/config'

import {
  request,
  summary,
  body,
  tags,
  middlewares,
  path,
  description,
  orderAll,
  query,
} from 'koa-swagger-decorator'
const tag = tags(['User'])
const userSchema = {
  name: { type: 'string', required: true },
  address: { type: 'string', required: true },
  description: { type: 'string', required: true },
}
const updateListSchema = {
  address: { type: 'string', required: false },
  description: { type: 'string', required: false },
}
const logTime = () => async (ctx, next) => {
  console.log(`start: ${ctx.method} ${ctx.url} ${new Date()}`)
  await next()
  console.log(`end:  ${ctx.method} ${ctx.url}  ${new Date()}`)
}
let UserModel = UserModelAll.UserModel

export default class UserController {
  @request('get', '/helloworld')
  @summary('helloworld')
  @description('example of api')
  @middlewares([logTime()])
  @tag
  static async helloworld(ctx) {
    const user = ctx.request.body

    ctx.body = {
      code: 0,
      message: 'helloworld',
    }
  }

  @request('post', '/adduser')
  @summary('CreateUser')
  @description('example of api')
  @middlewares([logTime()])
  @tag
  @body(userSchema)
  static async CreateUser(ctx) {
    const user = ctx.request.body
    if (user.address && user.name && user.description) {
      const existUser = await UserModel.findUserByName(user.name)
      if (!existUser) {
        await UserModel.createUser(user)
        const newUser = await UserModel.findUserByName(user.name)

        const userToken = {
          name: newUser.name,
          id: newUser.id,
        }
        const token = jwt.sign(userToken, System.JWT_Sign, { expiresIn: '1h' })
        ctx.body = response.createOKResponse(
          { token: token, id: newUser.id },
          'Created successfully'
        )
      } else {
        ctx.body = response.createFailedResponse(500, 'user exist')
      }
    } else {
      ctx.body = response.createFailedResponse(500, 'Parameter error')
    }
  }

  @request('get', '/userByName/:name')
  @summary('get user by name')
  @middlewares([logTime()])
  @tag
  @path({ name: { type: 'string', required: true } })
  static async GetUser(ctx) {
    const userName = ctx.params.name

    if (userName) {
      const existUser = await UserModel.findUserByName(userName)
      if (existUser) {
        ctx.body = {
          message: 'userByName success',
          data: existUser,
          code: 0,
        }
      } else {
        ctx.body = {
          code: -1,
          result: {
            errInfo: 'not exist',
          },
        }
      }
    } else {
      ctx.body = {
        code: -1,
        result: {
          errInfo: 'param error',
        },
      }
    }
  }

  @request('put', '/user/:name')
  @summary('UpdateUser')
  @middlewares([logTime()])
  @tag
  @body(updateListSchema)
  static async UpdateUser(ctx) {
    const userName = ctx.params.name

    const user = ctx.request.body

    if (userName && user.address && user.description) {
      const existUser = await UserModel.findUserByName(userName)
      if (existUser) {
        await UserModel.updateUserData(userName, user.address, user.description)

        ctx.body = {
          message: 'UpdateUser success',

          code: 0,
        }
      } else {
        ctx.body = {
          code: -1,
          result: {
            errInfo: 'user not exist',
          },
        }
      }
    } else {
      ctx.body = {
        code: -1,
        result: {
          errInfo: 'param error',
        },
      }
    }
  }

  @request('delete', '/user/:id')
  @summary('DeleteUser')
  @middlewares([logTime()])
  @tag
  @path({ id: { type: 'string', required: true } })
  static async DeleteUser(ctx) {
    const userid = ctx.params.id

    if (userid) {
      const existUser = await UserModel.findUserById(userid)
      if (existUser) {
        await UserModel.destroyUser(userid)
        ctx.body = {
          message: 'DeleteUser success',
          code: 0,
        }
      } else {
        ctx.body = {
          code: -1,
          result: {
            errInfo: 'not exist',
          },
        }
      }
    } else {
      ctx.body = {
        code: -1,
        result: {
          errInfo: 'param error',
        },
      }
    }
  }
}
