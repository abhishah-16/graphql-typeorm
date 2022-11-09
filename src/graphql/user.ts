import {
    Arg,
    Ctx,
    Field,
    Mutation,
    ObjectType,
    Query,
    Resolver,
    UseMiddleware
} from "type-graphql";
import { User } from "../entity/User";
import * as bcrypt from "bcryptjs"
import * as jwt from "jsonwebtoken"
import { Request, Response } from "express";
import { isAuth } from "../auth";
import * as dotenv from "dotenv";
dotenv.config()

export interface MyContext {
    req: Request,
    res: Response,
    payload?: any
}

@ObjectType()
class LoginRes {
    @Field(() => String)
    access_token: string
}

@Resolver()
export class userResolver {
    @Query(() => String)
    hello() {
        return 'hello world'
    }

    @Query(() => User)
    @UseMiddleware(isAuth)
    async me(@Ctx() ctx: MyContext) {
        try {
            const payload = ctx.payload
            const user = await User.findOne({ where: { id: payload.id } })
            return user
        } catch (error) {
            throw new Error(error)
        }
    }

    @Mutation(() => Boolean)
    async signup(@Arg("email") email: string, @Arg("password") password: string) {
        try {
            const finduser = await User.findOne({ where: { email } })
            if (finduser) {
                throw new Error('User already exists')
            }
            const hashpassword = await bcrypt.hash(password, 12)
            await User.insert({
                email,
                password: hashpassword,
                username: email.split('@')[0]
            })
            return true
        } catch (error) {
            throw new Error(error)
        }
    }

    @Mutation(() => LoginRes)
    async login(
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Ctx() ctx: MyContext) {
        try {
            const finduser = await User.findOne({ where: { email } })
            if (!finduser) {
                throw new Error('User does not exist')
            }
            const match = await bcrypt.compare(password, finduser.password)
            if (!match) {
                throw new Error('Invalid Credentials')
            }
            const accesstoken = generateToken(finduser)
            const refreshtoken = generateToken(finduser)
            ctx.res.cookie('refresh_token', refreshtoken, {
                httpOnly: true
            })
            return {
                access_token: accesstoken
            }
        } catch (error) {
            throw new Error(error)
        }
    }
}
export const generateToken = (user) => {
    const payload = {
        id: user.id,
        email: user.email,
        username: user.username
    }
    const token = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '7d' })
    return token
}