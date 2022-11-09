import "reflect-metadata"
import { DataSource } from "typeorm"
import { Note } from "./entity/note"
import { User } from "./entity/User"

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'root',
    database: 'nest_typeorm',
    synchronize: true,
    entities: [User, Note],
    migrations: [],
    subscribers: [],
})
