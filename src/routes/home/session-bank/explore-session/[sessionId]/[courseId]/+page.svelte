<script lang="ts">
	import { page } from '$app/stores';
	import Breadcrumb from '$lib/components/others/breadcrumb.svelte';
	import type { session, course, lecture, resource, link, note } from '$lib/server/schema';
	import { Label } from '$lib/components/ui/label';
	import * as Tabs from '$lib/components/ui/tabs';
	import Setting from '$lib/components/others/setting.svelte';
	import type { ActionData, PageData } from './$types';
	import LectureTab from '$lib/components/others/lectureTab.svelte';
	import ResourceTab from '$lib/components/others/resourceTab.svelte';
	import LinkTab from '$lib/components/others/linkTab.svelte';
	import { Link } from 'lucide-svelte';
	import NoteTab from '$lib/components/others/noteTab.svelte';

	export let form: ActionData;
	export let data: PageData;

	let userData = data.user[0];
	let userSessions = userData.sessions;
	let currentSession = data.otherSessionData[0];
	let sessionCoursess = currentSession.courses as course[];
	let currentCourse = sessionCoursess.filter((course: course) => {
		return course.courseId?.toString() == $page.params.courseId;
	})[0];
	let courseIndex = sessionCoursess.findIndex(
		(course: course) => course.courseId?.toString() == $page.params.courseId
	);

	let items = [
		{ href: '../', text: 'Explore Sessions' },
		{ href: './', text: currentSession.sessionName },
		{
			href: './' + currentCourse.courseId,
			text: currentCourse.courseName
		}
	];

	let lectureData = data.otherCourseData[0].lectures as lecture[];
	let resourceData = data.otherCourseData[0].resources as resource[];
	let linkData = data.otherCourseData[0].links as link[];
	let noteData = data.otherCourseData[0].notes as note[];
</script>

<link
	rel="stylesheet"
	href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
/>

<div class="flex grow flex-col items-center">
	<div class="flex w-full flex-row flex-wrap justify-between">
		<Breadcrumb {items} />
		<!-- <a href="./{currentCourse.courseId}/settings"><Setting /></a> -->
	</div>
	<Label class="mb-10 mt-10 text-center text-3xl font-medium">
		{currentSession.sessionName}/Courses/{currentCourse.courseName}
	</Label>
	<!-- Lecture Tab -->
	<Tabs.Root value="lecture" class="w-5/6 min-w-8">
		<Tabs.List class="grid w-full grid-cols-4">
			<Tabs.Trigger value="lecture">Lectures</Tabs.Trigger>
			<Tabs.Trigger value="resource">Resources</Tabs.Trigger>
			<Tabs.Trigger value="link">Links</Tabs.Trigger>
			<Tabs.Trigger value="note">Notes</Tabs.Trigger>
		</Tabs.List>

		<Tabs.Content value="lecture">
			<LectureTab
				bind:tabData={lectureData}
				bind:userData
				bind:currentCourse
				bind:currentSession
				bind:data
				bind:form
				editable={false}
			/>
		</Tabs.Content>

		<Tabs.Content value="resource">
			<ResourceTab
				bind:tabData={resourceData}
				bind:userData
				bind:currentCourse
				bind:currentSession
				bind:data
				bind:form
				editable={false}
			/>
		</Tabs.Content>

		<Tabs.Content value="link">
			<LinkTab
				bind:tabData={linkData}
				bind:userData
				bind:currentCourse
				bind:currentSession
				bind:data
				bind:form
				editable={false}
			></LinkTab>
		</Tabs.Content>

		<Tabs.Content value="note">
			<NoteTab
				bind:tabData={noteData}
				bind:userData
				bind:currentCourse
				bind:currentSession
				bind:data
				bind:form
				editable={false}
			></NoteTab>
		</Tabs.Content>
	</Tabs.Root>
</div>

<style>
	select:required:invalid {
		color: gray;
	}
	option[value=''][disabled] {
		display: none;
	}
	option {
		color: black;
	}
</style>
