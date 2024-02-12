<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import Breadcrumb from '$lib/components/others/breadcrumb.svelte';
	import * as Pagination from '$lib/components/ui/pagination';
	import type { session } from '$lib/server/schema';
	import type { ActionData, PageData } from './$types';
	import Favorite from '$lib/components/svg/favorite.svelte';
	import Favorited from '$lib/components/svg/favorited.svelte';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';

	let items = [{ href: 'home/session-bank/explore-session', text: 'Explore Sessions' }];

	export let data: PageData;
	export let form: ActionData;

	const userData = data.user[0];
	let searchResult = data.searchResult;
	let perPage = 5;
	let cnt = Math.max(Object.keys(searchResult).length,1)
	function onFav(index: number, sessionId: number) {
		searchResult[index].sessionFavs.push({ userId: userData.userId });
		searchResult = searchResult;
	}

	function onUnFav(index: number, sessionId: number) {
		searchResult[index].sessionFavs = [];
		searchResult = searchResult;
	}

	let name = '';
	let tag = '';
	let sortBy = '';

	$:{
		console.log(form?.success)
		if(form?.success=="search"){
			searchResult = form.searchResult
			cnt = Math.max(Object.keys(searchResult).length,1)
			// console.log(searchResult)
			form.success = ''
		}
	}

	$:{
		searchResult = searchResult.sort(function (x: any, y: any) {
			if (sortBy == 'oldest') {
				if (x.createdAt < y.createdAt) {
					return -1;
				}
				if (x.createdAt > y.createdAt) {
					return 1;
				}
				return 0;
			} else if (sortBy == 'newest') {
				if (x.createdAt < y.createdAt) {
					return 1;
				}
				if (x.createdAt > y.createdAt) {
					return -1;
				}
				return 0;
			} else {
				return 0;
			}
		});
	}
</script>

<div class="flex grow flex-col items-center">
	<div class="flex w-full flex-row flex-wrap items-start justify-start">
		<Breadcrumb {items} />
	</div>
	<Label class="mt-10 text-center text-3xl font-medium">Explore Sessions</Label>
	<form
		class="mt-5 flex w-[90%] flex-row justify-between gap-20"
		use:enhance={() => {
			return async ({ update }) => {
				update({ reset: false });
			};
		}}
		action="?/search"
		method="post"
	>
		<input hidden id="userId" name="userId" value={userData.userId} />
		<Input type="text" placeholder="name" name="name" bind:value={name} class="max-w-xs bg-muted" />
		<Input type="text" placeholder="tag" name="tag" bind:value={tag} class="max-w-xs bg-muted" />
		<select
			bind:value={sortBy}
			class="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-muted px-4 py-2 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2
    focus-visible:ring-ring
    focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
		>
			<option value="" disabled selected hidden>-- sort by --</option>
			<option value="newest">Newest</option>
			<option value="oldest">Oldest</option>
		</select>
		<Button class="bg-green-500 hover:bg-green-700" type="submit">Search</Button>
	</form>
	<Pagination.Root count={cnt} {perPage} let:pages let:currentPage>
		{#each Array(perPage) as _, i}
			{#if i < Object.keys(searchResult).length}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div
					class="session-card"
					on:click={() => {
						goto(
							'explore-session/' + searchResult[perPage * ((currentPage || 1) - 1) + i].sessionId
						);
					}}
				>
					<!-- <div class="session-card"> -->
					<div class="flex justify-end">
						<button class="flex items-center rounded-full px-4 py-2 text-white">
							{#if searchResult[perPage * ((currentPage || 1) - 1) + i].sessionFavs[0] == undefined}
								<form
									use:enhance
									action="?/favorite"
									method="post"
									on:submit={() => {
										onFav(
											perPage * ((currentPage || 1) - 1) + i,
											searchResult[perPage * ((currentPage || 1) - 1) + i].sessionId
										);
									}}
								>
									<input hidden id="userId" name="userId" value={userData.userId} />
									<input
										hidden
										id="sessionId"
										name="sessionId"
										value={searchResult[perPage * ((currentPage || 1) - 1) + i].sessionId}
									/>
									<button type="submit"><Favorite design="hover:scale-110" /></button>
								</form>
							{:else}
								<form
									use:enhance
									action="?/unfavorite"
									method="post"
									on:submit={() => {
										onUnFav(
											perPage * ((currentPage || 1) - 1) + i,
											searchResult[perPage * ((currentPage || 1) - 1) + i].sessionId
										);
									}}
								>
									<input hidden id="userId" name="userId" value={userData.userId} />
									<input
										hidden
										id="sessionId"
										name="sessionId"
										value={searchResult[perPage * ((currentPage || 1) - 1) + i].sessionId}
									/>
									<button type="submit"><Favorited design="hover:scale-110" /></button>
								</form>
							{/if}
						</button>
					</div>
					<h2>{searchResult[perPage * ((currentPage || 1) - 1) + i].sessionName}</h2>
					<p class="session-info">
						Created by {searchResult[perPage * ((currentPage || 1) - 1) + i].user.userName} on {searchResult[
							perPage * ((currentPage || 1) - 1) + i
						].createdAt.split('T')[0]}
					</p>

					<div class="tags">
						{#if searchResult[perPage * ((currentPage || 1) - 1) + i].tags != null}
							{#each searchResult[perPage * ((currentPage || 1) - 1) + i].tags as tag (tag)}
								<span class="tag">{tag}</span>
							{/each}
						{:else}
							<p class="message">No tags available</p>
						{/if}
					</div>

					{#if Object.keys(searchResult[perPage * ((currentPage || 1) - 1) + i].courses).length > 0}
						<p class="session-info">
							Courses: {searchResult[perPage * ((currentPage || 1) - 1) + i].courses
								.map((course) => course.courseName)
								.join(', ')}
						</p>
					{:else}
						<p class="message">No courses available</p>
					{/if}
				</div>
			{/if}
		{/each}
		<Pagination.Content>
			<Pagination.Item>
				<Pagination.PrevButton />
			</Pagination.Item>
			{#each pages as page (page.key)}
				{#if page.type === 'ellipsis'}
					<Pagination.Item>
						<Pagination.Ellipsis />
					</Pagination.Item>
				{:else}
					<Pagination.Item>
						<Pagination.Link {page} isActive={currentPage == page.value}>
							{page.value}
						</Pagination.Link>
					</Pagination.Item>
				{/if}
			{/each}
			<Pagination.Item>
				<Pagination.NextButton />
			</Pagination.Item>
		</Pagination.Content>
	</Pagination.Root>
</div>

<style>
	/* Add your styles here */
	.session-card {
		width: 90%;
		border: 1px solid #ccc;
		padding: 16px;
		margin: 16px;
		border-radius: 8px;
		transition: box-shadow 0.2s ease;
	}

	.session-card:hover {
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Shadow effect on hover */
	}

	.session-info {
		font-size: 14px;
		color: #555;
	}

	.tags {
		margin-top: 8px;
		display: flex;
		flex-wrap: wrap;
	}

	.tag {
		background-color: #eee;
		padding: 4px 8px;
		margin: 4px;
		border-radius: 4px;
	}

	.message {
		font-style: italic;
		color: #888;
	}
</style>