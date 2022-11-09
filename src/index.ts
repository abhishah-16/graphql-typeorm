import { AppDataSource } from "./data-source"
import * as express from 'express';
import * as cors from "cors"
import { ApolloServer, gql } from "apollo-server"
import { buildSchema } from "type-graphql";
import { generateToken, MyContext, userResolver } from "./graphql/user";
import * as jwt from "jsonwebtoken"
import { User } from "./entity/User";
import * as cookieParser from 'cookie-parser';
import * as dotenv from "dotenv";
import { notesResolver } from "./graphql/notes";
dotenv.config()

AppDataSource.initialize().then(async () => {
    console.log("conneted to database...")
    const app = express()
    app.use(cors())
    app.use(cookieParser())
    app.use(express.json())
    app.get('/', (req, res) => {
        res.send('hello world')
    })

    app.post('/refresh-token', async (req, res) => {
        const token = req.cookies['refresh_token']
        if (!token) {
            res.send('Invalid token')
        }
        let data = null
        try {
            data = jwt.verify(token, process.env.TOKEN_SECRET)
            const user = await User.findOne({ where: { id: data.id } })
            const accesstoken = generateToken(user)
            res.send({
                'access_token': accesstoken
            })
        } catch (error) {
            throw new Error(error)
        }
    })

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [userResolver, notesResolver]
        }),
        context: ({ req, res }): MyContext => ({ req, res })
    })

    apolloServer.listen(4000, () => {
        console.log(`server is running on 4000`);
    })
    app.listen(3000, () => {
        // console.log('normal server');
    })
}).catch(error => console.log(error))
