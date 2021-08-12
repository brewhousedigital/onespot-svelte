<script>
    import {onMount} from "svelte";

    let searchTerm = "";
    let results = [];
    let OSD = [];

    onMount(() => {
        OSD = JSON.parse(localStorage.getItem("OSD"))
    })

    function handleSearch() {
        //console.log("searchTerm", searchTerm);
        //console.log("OSD", OSD);

        if(searchTerm.length > 3) {
            results = OSD.filter(item => {
                // Search the title
                if(item.title) {
                    if(item.title.includes(searchTerm)) {return item;}
                }

                // Search the category
                if(item.category) {
                    if (item.category.includes(searchTerm)) {return item;}
                }

                // Search the content
                if(item.content) {
                    if (item.content.includes(searchTerm)) {return item;}
                }

                // Search the url
                if(item.url) {
                    if (item.url.includes(searchTerm)) {return item;}
                }
            })
        } else {
            // Reset list
            results = [];
        }

        console.log("results", results)
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

<div class="list-group">
    {#each results as result}
        <a href="{result.url}" class="list-group-item list-group-item-action">{result.title}</a>
    {:else}
        <p>No results yet!</p>
    {/each}
</div>