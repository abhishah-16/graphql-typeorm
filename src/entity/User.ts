import { Field, ObjectType } from "type-graphql"
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm"
import { Note } from "./note"

@Entity()
@ObjectType()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id: number

    @Column()
    @Field(() => String)
    email: string

    @Column()
    @Field(() => String)
    username: string

    @Column()
    @Field()
    password: string

    @OneToMany(() => Note, (note) => note.createdBy)
    @Field(() => [Note])
    notes: Note[]

    @CreateDateColumn()
    @Field(() => String)
    createdAt: Date

    @UpdateDateColumn()
    @Field(() => String)
    updatedAt: Date
}
