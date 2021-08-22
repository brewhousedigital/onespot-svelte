<script context="module">
    export async function load(ctx) {
        // Dynamic folders return objects
        let slug = ctx.page.params;
        return {props: {pageSlug: {category: slug.category, content: slug.content}}};
    }
</script>

<script>
    // These are the URL parameters
    export let pageSlug;
    let category = pageSlug.category;
    let page = pageSlug.content;


    // Components
    import CollectionTemplate from "$lib/page-components/CollectionTemplate.svelte";


    // Helper functions
    import marked from 'marked';
    import {onMount} from "svelte";
    import slugURL from "$lib/js/slugURL";
    import { fly } from 'svelte/transition';
    import {goto} from "$app/navigation";
    import {getAllDataFromBackendless} from "$lib/js/getDataFromBackendless";


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

    let contentSidebarLinks = [];

    onMount(() => {
        // Grab latest storage info
        OSD = JSON.parse(localStorage.getItem("OSD"));

        // Filter out anything that's not part of this group of pages
        pages = OSD.filter(item => {
            if(!item['archived']) {
                if (item.category !== null && item.category !== undefined) {
                    return slugURL(item.category) === category
                }
            }
        });

        // Sort alphabetical
        pages.sort((a, b) => {
            if(a.title < b.title) return -1
            if(a.title > b.title) return 1
            return 0
        });

        // Find the specific page the user needs
        pageValues = OSD.filter(item => {
            if(item.url !== null && item.url !== undefined) {
                return item.url.includes("/" + category + "/" + page);
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

            // Update all tables
            pageHTML = pageHTML.replace("<table>", "<table class='table'>");

            // Update all anchor links to be target=_blank
            pageHTML = pageHTML.replace("<a ", "<a target='_blank' ");

            // Wrap the entire thing in a specific class for targeting
            pageHTML = "<div class='markdown-container'>" + pageHTML + "</div>";

            // Generate the sidebar after the DOM has been mounted
            setTimeout(() => {
                let markdownContainer = document.querySelector(".markdown-container");
                if(markdownContainer !== null) {
                    let headers = markdownContainer.querySelectorAll("h1, h2, h3");
                    headers.forEach(item => {
                        contentSidebarLinks = [...contentSidebarLinks, {name: item.textContent, id: item.id, tag: item.tagName}]
                    })

                    console.log("contentSidebarLinks", contentSidebarLinks)
                }
            }, 1000)
        }

        // Save the new title
        currentTitle = pageTitle;
        /*currentTitle = type === null
            ? pageTitle
            : "Edit " + pageTitle;*/
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


<style>
    #content-sidebar-links {
        border-left: 1px solid #e8e8e8;
        margin-left: 24px;
        padding-left: 24px;
    }

    #content-sidebar-links a {
        display: block;
        padding: 6px 0;
        font-size: 14px;
        color: grey;
    }

    #content-sidebar-links a[data-tag='h1'] {
        font-weight: 700;
        font-size: 15px;
    }

    #content-sidebar-links a[data-tag='h2'] {
        font-size: 14px;
        padding-left: 6px;
        text-decoration: none;
    }

    #content-sidebar-links a[data-tag='h3'] {
        font-size: 13px;
        padding-left: 12px;
        text-decoration: none;
    }
</style>



<svelte:head>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/themes/prism-okaidia.min.css" rel="stylesheet" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/prism.min.js"></script>
    <title>{currentTitle}</title>
</svelte:head>


<CollectionTemplate categoryTitle={pageCategory} {pages}>
    <div class="row">
        <div class="col">
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

            {@html pageHTML}
        </div><!-- end col -->

        <aside id="content-sidebar-links" class="col-auto d-lg-block d-none">
            <div class="sticky-top">
                {#each contentSidebarLinks as link, i (i)}
                    <a href={`#${link.id}`}  in:fly={{x:100}} data-tag={link.tag.toLowerCase()}>{link.name}</a>
                {/each}
            </div>
        </aside><!-- end col -->
    </div><!-- end row -->
</CollectionTemplate>
