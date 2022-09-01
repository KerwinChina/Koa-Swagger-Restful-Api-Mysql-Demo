module.exports = function () {
  return function (ctx, next) {
    //  console.info(ctx.body)
    return next().catch((err) => {
      switch (err.status) {
        case 401:
          ctx.status = 200
          ctx.body = {
            status: 401,
            result: {
              err: 'Authentication Error',
              errInfo:
                'Protected resource, use Authorization header to get access.',
            },
          }
          break
        default:
          throw err
      }
    })
  }
}
