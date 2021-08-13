<script>
    import {onMount} from "svelte";

    let starredPages = [];

    onMount(() => {
        starredPages = JSON.parse(localStorage.getItem("starred-pages"));
    })

    function handleDelete() {
        let deleteCheck = confirm("Are you sure you want to reset all of your starred pages?")
        if(deleteCheck) {
            localStorage.setItem("starred-pages", JSON.stringify([]))
            starredPages = [];
        }
    }
</script>

<svelte:head>
    <title>Starred</title>
</svelte:head>

<style>
    #star-component {display: none;}
</style>

<h1>Starred</h1>

<p>Here is all your favorite pages</p>

<div class="list-group mb-5">
    {#each starredPages as page}
        <a href="{page.url}" class="list-group-item list-group-item-action">{page.name}</a>
    {:else}
        <p>No starred pages yet!</p>
    {/each}
</div>


<button class="btn btn-danger btn-sm" on:click={handleDelete}>Reset All Starred Pages</button>