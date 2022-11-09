import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../auth";
import { Note } from "../entity/note";
import { User } from "../entity/User";
import { MyContext } from "./user";

@Resolver()
export class notesResolver {
    @Query(() => [Note])
    @UseMiddleware(isAuth)
    async listNotes(@Ctx() ctx: MyContext) {
        return Note.find({
            relations: ['createdBy']
        })
    }

    @Mutation(() => Note)
    @UseMiddleware(isAuth)
    async addNote(@Arg("title") title: string, @Arg("content") content: string, @Ctx() ctx: MyContext) {
        try {
            const payload = ctx.payload
            const user = await User.findOne({ where: { id: payload.id } })
            const newNote = new Note()
            newNote.title = title
            newNote.content = content
            newNote.createdBy = user
            await newNote.save()
            return newNote
        } catch (error) {
            throw new Error(error)
        }
    }
}