import Koa from "koa";
import bodyParser from "koa-body";

const app:Koa = new Koa();

app.use(bodyParser())

app.use((ctx: Koa.DefaultContext) => {
    console.log(ctx.request.body)
    console.log("hello")

    ctx.body = "hello world！";
})

const port: number = 3000;
app.listen(port, () => {
    console.log(`seccess start server`)
    console.log(`local: http://127.0.0.1:${port}`)
})

