import type { RequestHandler } from "@sveltejs/kit";
import {updateBlogVote, voteBlog} from "$lib/server/queries"
import type {blogVote} from "$lib/server/schema";

export const POST: RequestHandler = async (event) => {
    const data = await event.request.json() as blogVote
    await voteBlog(data)
    await updateBlogVote(data.blogId, data.vote)

    // console.log(res);
    return new Response(

    )
}