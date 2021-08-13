<script context="module">
    export async function load(ctx) {
        // "category" is the name of the folder. That is where the parameter comes from
        let slug = ctx.page.params;
        return {props: {slug: slug.category}};
    }
</script>

<script>
    import slugURL from "$lib/js/slugURL";
    import { onMount } from "svelte";
    import CollectionTemplate from "$lib/page-components/CollectionTemplate.svelte";

    export let slug = "";
    let OSD = [];
    let pages = [];
    let categoryTitle = "";

    let currentTitle = "";

    onMount(() => {
        // Grab latest storage info
        OSD = JSON.parse(localStorage.getItem("OSD"));

        // Filter out anything thats not part of this group of pages
        pages = OSD.filter(item => {
            if(!item['archived']) {
                if (item.category !== null && item.category !== undefined) {
                    return slugURL(item.category) === slug
                }
            }
        });

        // Grab official title
        if(pages.length > 0) {categoryTitle = pages[0]['category']}
    })
</script>

<svelte:head>
    <title>{categoryTitle} Category</title>
</svelte:head>

<CollectionTemplate {categoryTitle} {pages}>
    <div class="d-flex align-items-center">
        <div class="col-auto me-3">
            <h2 class="mb-0"><i class="bi bi-arrow-left-circle"></i></h2>
        </div><!-- end col -->

        <div class="col-auto">
            <h1 class="mb-0">{categoryTitle}</h1>
            <h2 class="mb-0">Choose a topic</h2>
        </div><!-- end col -->
    </div>
</CollectionTemplate>
