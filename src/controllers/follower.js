import FollowerModel from '../scheme/follower'
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
} from 'koa-swagger-decorator'
const tag = tags(['Follower'])
const flowerUseridSchema = {
  follower_id: { type: 'string', required: true },
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
const getTokenData = async (ctx) => {
  let token = ctx.header.authorization
  token = token.replace('Bearer ', '')
  let userid = 0
  let result = jwt.verify(token, System.JWT_Sign)
  if (result) {
    userid = result.id
  }
  return userid
}

export default class FollowerController {
  @request('post', '/follower')
  @summary('CreateFlower')
  @description('CreateFlower')
  @middlewares([logTime()])
  @body(flowerUseridSchema)
  @tag
  static async CreateFlower(ctx) {
    console.info('CreateFlower')
    let userid = await getTokenData(ctx)
    if (userid == 0) {
      return response.createFailedResponse(500, 'follower failed')
    }
    console.info(userid)

    const flowerid = ctx.request.body.follower_id
    if (flowerid) {
      const existUser = await FollowerModel.findMeFollower(userid, flowerid)
      if (!existUser) {
        let flowerData = {}
        flowerData.user_id = userid
        flowerData.follower_id = flowerid
        await FollowerModel.createFlower(flowerData)

        ctx.body = response.createOKResponse({}, 'follower successfully')
      } else {
        ctx.body = response.createFailedResponse(500, 'follower exist')
      }
    } else {
      ctx.body = response.createFailedResponse(500, 'Parameter error')
    }
  }

  @request('get', '/follower')
  @summary('GetFlower')
  @middlewares([logTime()])
  @tag
  static async GetFlower(ctx) {
    let userid = await getTokenData(ctx)
    if (userid == 0) {
      return response.createFailedResponse(500, 'follower failed')
    }
    if (userid) {
      const existUser = await FollowerModel.findMeFollowerByUserId(userid)
      if (existUser) {
        ctx.body = {
          message: 'GetFlower success',
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

  @request('put', '/follower/:id')
  @summary('UpdateFlower')
  @middlewares([logTime()])
  @path({ id: { type: 'string', required: true } })
  @body(flowerUseridSchema)
  @tag
  static async UpdateFlower(ctx) {
    let userid = await getTokenData(ctx)
    if (userid == 0) {
      return response.createFailedResponse(500, 'UpdateFlower failed')
    }
    const flowerid = ctx.params.id
    console.info(flowerid)
    const userflower = ctx.request.body.follower_id
    console.info(userflower)
    if (flowerid && userflower) {
      const existUser = await FollowerModel.findFollower(flowerid)
      if (existUser) {
        await FollowerModel.UpdateFollower(flowerid, userflower)

        ctx.body = {
          message: 'UpdateFlower success',

          code: 0,
        }
      } else {
        ctx.body = {
          code: -1,
          result: {
            errInfo: 'Flower not exist',
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

  @request('delete', '/follower/:id')
  @summary('DeleteFlower')
  @middlewares([logTime()])
  @tag
  @path({ id: { type: 'string', required: true } })
  static async DeleteFlower(ctx) {
    console.info('DeleteUser')
    const flowerid = ctx.params.id
    console.info(flowerid)
    if (flowerid) {
      const existUser = await FollowerModel.findFollower(flowerid)
      if (existUser) {
        await FollowerModel.destroyFlower(flowerid)
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
