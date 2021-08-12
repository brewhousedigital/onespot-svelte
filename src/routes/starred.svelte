<script context="module">
    export const prerender = true;
</script>

<script>
    import {onMount} from "svelte";

    let starredPages = [];

    onMount(() => {
        starredPages = JSON.parse(localStorage.getItem("starred-pages"));
    })
</script>

<svelte:head>
    <title>Starred</title>
</svelte:head>

<style>
    #star-component {display: none;}
</style>

<h1>Starred</h1>

<p>Here is all your favorite pages</p>

<div class="list-group">
    {#each starredPages as page}
        <a href="{page.url}" class="list-group-item list-group-item-action">{page.name}</a>
    {:else}
        <p>No starred pages yet!</p>
    {/each}
</div>