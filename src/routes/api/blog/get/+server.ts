import type { RequestHandler } from "@sveltejs/kit";
import {getBlog} from "$lib/server/queries"
import type {blog} from "$lib/server/schema";

export const POST: RequestHandler = async (event) => {
    const data = await event.request.json()
    const res = await getBlog(data.blogId, data.userId)

    // console.log(res);
    return new Response(
        JSON.stringify(res)
    )
}