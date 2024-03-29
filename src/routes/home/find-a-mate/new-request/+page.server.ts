import type { PageServerLoad, Actions } from './$types';
import type { session } from '$lib/server/schema';

export const actions = {
	create: async (event) => {
		const data = await event.request.formData();
		let newSession = Object.fromEntries(data.entries()) as any;

		if(newSession.tags!=''){
		    newSession.tags = newSession.tags.split(',')
        }
        else newSession.tags = null

		event.fetch('/api/request/add', {
			method: 'POST',
			body: JSON.stringify(newSession)
		})
		// console.log(newSession)

		return {
			success: true
		};
	}
} satisfies Actions;
