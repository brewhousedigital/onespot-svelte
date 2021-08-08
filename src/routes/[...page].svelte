<script context="module">
    export async function load(ctx) {
        // Since this is a spread operator, it pulls in the entire URL as a string
        let slug = ctx.page.params.page.split("/");
        return {props: {slug: slug}};
    }
</script>

<script>
    import '$lib/js/marked';
    import { onMount } from "svelte";
    import slugURL from "$lib/js/slugURL";

    import CollectionTemplate from "$lib/page-components/CollectionTemplate.svelte";
    import EditPageTemplate from "$lib/page-components/EditPageTemplate.svelte";

    // These are the URL parameters
    export let slug = [];
    let category = slug[0];
    let page = slug[1];
    let type = slug[2] ? slug[2] : null;

    // Site title
    let currentTitle = "";

    // Page content
    let OSD = [];
    let pages = [];
    let pageValues;
    let pageCategory = "";
    let pageTitle = "";
    let pageContent = "";
    let pageHTML = "";
    let pageUpdated = "";
    let pageURL = "";
    let pageID = "";

    onMount(() => {
        // Grab latest storage info
        OSD = JSON.parse(localStorage.getItem("OSD"));

        // Filter out anything thats not part of this group of pages
        pages = OSD.filter(item => {
            if(item.category !== null && item.category !== undefined) {
                return slugURL(item.category) === category
            }
        });

        // Find the specific page the user needs
        pageValues = OSD.filter(item => {
            if(item.url !== null && item.url !== undefined) {
                return item.url.includes(page);
            }
        });

        // Filter returns an array for some reason
        if(pageValues.length === 1) pageValues = pageValues[0];

        // Grab official title
        pageCategory = pageValues.category;

        // Extract the fun values
        pageTitle = pageValues.title;
        pageContent = pageValues.content;
        pageURL = pageValues.url;
        pageID = pageValues.objectId;

        pageValues['updated']
            ? pageUpdated = pageValues['updated']
            : pageUpdated = pageValues['created'];

        pageUpdated = new Date(pageUpdated) + "";
        pageUpdated = pageUpdated.split(" ");
        pageUpdated =
            pageUpdated[0] + " " +
            pageUpdated[1] + " " +
            parseInt(pageUpdated[2]) + ", " +
            pageUpdated[3];

        // Convert content from Markdown to HTML
        if(pageContent !== null && pageContent !== undefined) {
            pageHTML = marked(pageContent);
            pageHTML= pageHTML.replace("<table>", "<table class='table'>")
        }

        // Save the new title
        currentTitle = type === null
            ? pageTitle
            : "Edit " + pageTitle;
    })




</script>


<svelte:head>
    <title>{currentTitle}</title>
</svelte:head>


{#if type === null}

    <CollectionTemplate {pageCategory} {pages}>
        <h1 class="mb-0">
            {pageTitle}
            <a href="{pageURL}/edit" sveltekit:prefetch class="btn"><i class="bi bi-pencil"></i></a>
        </h1>
        <p class="mb-5 text-muted">Last Updated: {pageUpdated}</p>

        <div>
            {@html pageHTML}
        </div>
    </CollectionTemplate>

{:else}

    <CollectionTemplate {pageCategory} {pages}>
        <EditPageTemplate {pageID} {pageTitle} {pageContent} {pageCategory} {pageURL} />
    </CollectionTemplate>

{/if}




