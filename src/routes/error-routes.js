module.exports = function () {
  return function (ctx, next) {
    switch (ctx.status) {
      case 404:
        ctx.body = 'not fund - 404'
        break
    }
    return next()
  }
}
