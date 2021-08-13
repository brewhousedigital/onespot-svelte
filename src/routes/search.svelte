<script>
    import {onMount} from "svelte";

    let searchTerm = "";
    let OSD = [];
    let filteredResults = [];
    let results = [];
    let archiveResults = [];

    onMount(() => {
        OSD = JSON.parse(localStorage.getItem("OSD"))
    })

    function handleSearch() {
        //console.log("searchTerm", searchTerm);
        //console.log("OSD", OSD);

        if(searchTerm.length > 2) {
            filteredResults = OSD.filter(item => {
                // Search the title
                if(item.title) {
                    if(item.title.toLowerCase().includes(searchTerm)) {return item;}
                }

                // Search the category
                if(item.category) {
                    if (item.category.toLowerCase().includes(searchTerm)) {return item;}
                }

                // Search the content
                if(item.content) {
                    if (item.content.toLowerCase().includes(searchTerm)) {return item;}
                }

                // Search the url
                if(item.url) {
                    if (item.url.toLowerCase().includes(searchTerm)) {return item;}
                }
            });

            // Filter out archived and not archived
            archiveResults = filteredResults.filter(item => item.archived);
            results = filteredResults.filter(item => !item.archived);
        } else {
            // Reset list
            results = [];
            archiveResults = [];
        }
    }
</script>

<svelte:head>
    <title>Search</title>
</svelte:head>


<style>
    #search-container {
        max-width: 576px;
        text-align: center;
    }
</style>

<h1 class="mb-5">Search</h1>

<div id="search-container" class="mb-5">
    <input type="text"
           bind:value={searchTerm}
           on:keyup={handleSearch}
           class="form-control form-control-lg"
           aria-label="Search anything"
           placeholder="Search anything...">
</div>


{#if searchTerm.length > 2}
    <h2>Active Pages</h2>
<div class="list-group pb-5 border-bottom mb-5">
    {#each results as result}
        <a href="/page{result.url}" class="list-group-item list-group-item-action">{result.title} <i class="bi bi-link-45deg"></i></a>
    {:else}
        <p>No active pages with "{searchTerm}" were found</p>
    {/each}
</div>
{:else}
    <p>Type more than 2 characters to see results</p>
{/if}


{#if searchTerm.length > 2}
    <h2>Archived Pages</h2>
<div class="list-group">
    {#each archiveResults as result}
        <a href="/page{result.url}" class="list-group-item list-group-item-action">{result.title} <i class="bi bi-link-45deg"></i></a>
    {:else}
        <p>No archive pages with "{searchTerm}" were found</p>
    {/each}
</div>
{/if}