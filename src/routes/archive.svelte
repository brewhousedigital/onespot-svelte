<script>
    import {onMount} from "svelte";

    let pages = [];
    let OSD = [];

    onMount(() => {
        // Grab latest storage info
        OSD = JSON.parse(localStorage.getItem("OSD"));

        pages = OSD.filter(item => {
            if(item['archived']) {
                return item;
            }
        })
    })
</script>

<svelte:head>
    <title>Archive</title>
</svelte:head>

<h1>Archive</h1>

<div class="list-group">
    {#each pages as page}
        <a href="{page.url}" class="list-group-item list-group-item-action">{page.title}</a>
    {:else}
        <p>No starred pages yet!</p>
    {/each}
</div>