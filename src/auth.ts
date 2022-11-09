import { MiddlewareFn } from "type-graphql";
import { MyContext } from "./graphql/user";
import * as jwt from "jsonwebtoken"
import * as dotenv from "dotenv";
dotenv.config()

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
    const bearer = context.req.headers['authorization']
    const token = bearer.split(' ')[1]
    if (!token) {
        throw new Error('unauthorize')
    }
    const isvalid = jwt.verify(token, process.env.TOKEN_SECRET)
    if (!isvalid) {
        throw new Error('unauthorize')
    }
    context.payload = isvalid
    return next()
}