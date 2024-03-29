import type { RequestHandler } from "@sveltejs/kit";
import {insertCourse} from "$lib/server/queries"
import type {course} from "$lib/server/schema";

export const POST: RequestHandler = async (event) => {
    const newCourse = await event.request.json() as course
    insertCourse(newCourse)

    return new Response(
        
    )
}