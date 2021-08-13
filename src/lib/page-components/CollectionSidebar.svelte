<script>
    export let pages = [];
</script>

<style>
    #docs-sidebar {
        min-width: 300px;
    }

    #docs-sidebar a {
        color: #515c6c;
        text-decoration: none;
        display: block;
        padding: 8px 0;
        font-weight: 500;
        font-size: 16px;
    }
</style>

<div id="docs-sidebar" class="px-5 sticky-top">
    {#each pages as page}
        <a href="/page{page.url}" sveltekit:prefetch>{page.title}</a>
    {/each}
</div>