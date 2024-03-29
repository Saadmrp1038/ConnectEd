import { supabase } from '$lib/supabaseClient';
import type { Actions, PageServerLoad } from './$types';

// File {
// 	size: 17079,
// 	type: 'image/jpeg',
// 	name: '5_929.jpg',
// 	lastModified: 1709297666582
// }

export const actions = {
	uploadLecture: async (event) => {
		const data = await event.request.formData();
		let newLecture = Object.fromEntries(data.entries()) as any;

		let timestamp = new Date().getTime();

		let name = timestamp + '_' + newLecture.file.name;

		newLecture.fileType = newLecture.file.type;

		const { data: res, error: err } = await supabase.storage
			.from('lectures')
			.upload(name, newLecture.file, {
				cacheControl: '3600',
				upsert: false
			});

		const { data: link } = await supabase.storage.from('lectures').getPublicUrl(name);

		newLecture.savedName = name;
		newLecture.lectureLink = link.publicUrl;

		await event.fetch('/api/lecture/add', {
			method: 'POST',
			body: JSON.stringify(newLecture)
		});

		// console.log(newLecture);

		return {
			success: 'lectureUpload'
		};
	},
	deleteLecture: async (event) => {
		const data = await event.request.formData();
		let lecture = Object.fromEntries(data.entries()) as any;

		event.fetch('/api/lecture/delete', {
			method: 'POST',
			body: JSON.stringify(lecture)
		});

		return {
			success: 'lectureDelete'
		};
	},
	updateLecture: async (event) => {
		const data = await event.request.formData();
		let lecture = Object.fromEntries(data.entries()) as any;

		console.log('Here');

		if (lecture.file.size != 0) {
			lecture.fileType = lecture.file.type;
			const { data: res1, error: err1 } = await supabase.storage
				.from('lectures')
				.update(lecture.savedName, lecture.file, {
					cacheControl: '3600',
					upsert: true
				});
		}

		event.fetch('/api/lecture/update', {
			method: 'POST',
			body: JSON.stringify(lecture)
		});

		return {
			success: 'lectureUpdate'
		};
	},
	uploadResource: async (event) => {
		const data = await event.request.formData();
		let newResource = Object.fromEntries(data.entries()) as any;
		console.log(newResource);
		let timestamp = new Date().getTime();

		let name = timestamp + '_' + newResource.file.name;

		newResource.fileType = newResource.file.type;

		const { data: res, error: err } = await supabase.storage
			.from('resources')
			.upload(name, newResource.file, {
				cacheControl: '3600',
				upsert: false
			});

		const { data: link } = await supabase.storage.from('resources').getPublicUrl(name);

		newResource.savedName = name;
		newResource.resourceLink = link.publicUrl;

		await event.fetch('/api/resource/add', {
			method: 'POST',
			body: JSON.stringify(newResource)
		});

		// console.log(newLecture);

		return {
			success: 'resourceUpload'
		};
	},
	deleteResource: async (event) => {
		const data = await event.request.formData();
		let resource = Object.fromEntries(data.entries()) as any;

		event.fetch('/api/resource/delete', {
			method: 'POST',
			body: JSON.stringify(resource)
		});

		return {
			success: 'resourceDelete'
		};
	},
	updateResource: async (event) => {
		const data = await event.request.formData();
		let resource = Object.fromEntries(data.entries()) as any;

		// console.log('Here');

		if (resource.file.size != 0) {
			resource.fileType = resource.file.type;
			const { data: res1, error: err1 } = await supabase.storage
				.from('resources')
				.update(resource.savedName, resource.file, {
					cacheControl: '3600',
					upsert: true
				});
		}

		event.fetch('/api/resource/update', {
			method: 'POST',
			body: JSON.stringify(resource)
		});

		return {
			success: 'resourceUpdate'
		};
	},
	uploadLink: async (event) => {
		const data = await event.request.formData();
		let newResource = Object.fromEntries(data.entries()) as any;
		console.log(newResource);
		let timestamp = new Date().getTime();

		await event.fetch('/api/link/add', {
			method: 'POST',
			body: JSON.stringify(newResource)
		});

		// console.log(newLecture);

		return {
			success: 'linkUpload'
		};
	},
	deleteLink: async (event) => {
		const data = await event.request.formData();
		let resource = Object.fromEntries(data.entries()) as any;

		event.fetch('/api/link/delete', {
			method: 'POST',
			body: JSON.stringify(resource)
		});

		return {
			success: 'linkDelete'
		};
	},
	updateLink: async (event) => {
		const data = await event.request.formData();
		let resource = Object.fromEntries(data.entries()) as any;

		event.fetch('/api/link/update', {
			method: 'POST',
			body: JSON.stringify(resource)
		});

		return {
			success: 'linkUpdate'
		};
	},
	uploadNote: async (event) => {
		const data = await event.request.formData();
		let newResource = Object.fromEntries(data.entries()) as any;
		console.log(newResource);

		await event.fetch('/api/note/add', {
			method: 'POST',
			body: JSON.stringify(newResource)
		});

		// console.log(newLecture);

		return {
			success: 'noteUpload'
		};
	},
	deleteNote: async (event) => {
		const data = await event.request.formData();
		let resource = Object.fromEntries(data.entries()) as any;

		event.fetch('/api/note/delete', {
			method: 'POST',
			body: JSON.stringify(resource)
		});

		return {
			success: 'noteDelete'
		};
	},
	updateNote: async (event) => {
		const data = await event.request.formData();
		let resource = Object.fromEntries(data.entries()) as any;

		event.fetch('/api/note/update', {
			method: 'POST',
			body: JSON.stringify(resource)
		});

		return {
			success: 'noteUpdate'
		};
	}
} satisfies Actions;

export const load = async ({ params, fetch }) => {
	let courseId = params.courseId;

	async function getCourseData() {
		const res = await fetch('/api/course/get', {
			method: 'POST',
			body: JSON.stringify({ courseId: courseId })
		});
		const data = await res.json();
		return data;
	}

	return {
		courseData: await getCourseData()
	};
};
