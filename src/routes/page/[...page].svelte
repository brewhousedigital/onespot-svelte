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
    import {goto} from "$app/navigation";
    import {getAllDataFromBackendless} from "$lib/js/getDataFromBackendless";

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
    let pageArchived = false;

    onMount(() => {
        // Grab latest storage info
        OSD = JSON.parse(localStorage.getItem("OSD"));

        // Filter out anything thats not part of this group of pages
        pages = OSD.filter(item => {
            if(!item['archived']) {
                if (item.category !== null && item.category !== undefined) {
                    return slugURL(item.category) === category
                }
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
        pageArchived = pageValues['archived'];

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


    function handlePageDelete() {
        let deleteCheck = confirm("Are you sure you want to delete " + pageTitle + "?");

        if(deleteCheck) {
            Backendless.Data.of("osd_pages").remove({objectId: pageID})
                .then(async function() {
                    await getAllDataFromBackendless();
                    await goto("/page/" + category)
                })
                .catch(function(error) {
                    // TODO: log error state
                    console.log(error);
                });
        }
    }

    function handlePageArchive() {
        let archiveCheck = confirm("Are you sure you want to archive " + pageTitle + "?");

        if(archiveCheck) {
            Backendless.Data.of("osd_pages").save({
                objectId:pageID,
                archived:true
            })
                .then(async function(savedObject) {
                    await getAllDataFromBackendless();
                    await goto("/page/" + category)
                })
                .catch(function(error) {
                    // TODO: log error state
                    console.log(error);
                });
        }
    }

    function handlePageArchiveRestore() {
        let restoreCheck = confirm("Are you sure you want to restore " + pageTitle + "?");

        if(restoreCheck) {
            Backendless.Data.of("osd_pages").save({
                objectId:pageID,
                archived:false
            })
                .then(async function(savedObject) {
                    await getAllDataFromBackendless();
                    await goto("/page/" + category)
                })
                .catch(function(error) {
                    // TODO: log error state
                    console.log(error);
                });
        }
    }


</script>


<svelte:head>
    <title>{currentTitle}</title>
</svelte:head>


{#if type === null}
    <CollectionTemplate categoryTitle={pageCategory} {pages}>
        {#if pageArchived}<h2 class="text-muted fst-italic">Archived</h2>{/if}
        <h1 class="mb-0">
            <span class="d-inline-block me-3">{pageTitle}</span>

            <a href="/page{pageURL}/edit" sveltekit:prefetch class="btn px-3">
                <i class="bi bi-pencil-square"></i>
            </a>

            <button class="btn px-3" on:click={handlePageDelete}>
                <i class="bi bi-trash"></i>
            </button>

            {#if pageArchived}
                <button class="btn px-3" on:click={handlePageArchiveRestore}>
                    <i class="bi bi-cloud-upload"></i>
                </button>
            {:else}
                <button class="btn px-3" on:click={handlePageArchive}>
                    <i class="bi bi-archive-fill"></i>
                </button>
            {/if}
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




