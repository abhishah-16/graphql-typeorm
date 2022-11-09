import { Field, ObjectType } from "type-graphql"
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm"
import { User } from "./User"

@Entity()
@ObjectType()
export class Note extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id: number

    @Column()
    @Field(() => String)
    title: string

    @Column()
    @Field(() => String)
    content: string

    @ManyToOne(() => User, (user) => user.id)
    @Field(() => User)
    createdBy: User

    @CreateDateColumn()
    @Field(() => String)
    createdAt: Date

    @UpdateDateColumn()
    @Field(() => String)
    updatedAt: Date
}
