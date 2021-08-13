<script context="module">
    export async function load(ctx) {
        // Dynamic folders return objects
        let slug = ctx.page.params;
        return {props: {pageSlug: {category: slug.category, content: slug.content}}};
    }
</script>

<script>
    // These are the URL parameters
    import slugURL from "$lib/js/slugURL";

    export let pageSlug;

    let category = pageSlug.category;
    let page = pageSlug.content;

    import {getAllCategories, getAllDataFromBackendless} from "$lib/js/getDataFromBackendless";
    import { buttonProcessingState, buttonProcessingStateEnable } from "$lib/js/buttonProcessingState";
    import { goto } from "$app/navigation";
    import CollectionTemplate from "$lib/page-components/CollectionTemplate.svelte";

    //import CategoriesDataList from "$lib/page-components/CategoriesDataList.svelte";
    import {onMount} from "svelte";

    // Site title
    let currentTitle = "";

    // Page content
    let OSD = [];
    let pages = [];
    let pageValues;
    let pageCategory = "";
    let pageTitle = "";
    let pageContent = "";
    let pageUpdated = "";
    let pageURL = "";
    let pageID = "";
    let pageArchived = false;
    let categories = [];

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


        // Save the new title
        currentTitle = pageTitle;
        /*currentTitle = type === null
            ? pageTitle
            : "Edit " + pageTitle;*/

        categories = getAllCategories();
    })

    async function handleSubmit(e) {
        e.preventDefault();

        let formData = {
            objectId: pageID,
            title: pageTitle,
            content: pageContent,
            category: pageCategory,
            url: pageURL
        }


        buttonProcessingState("#submitBtn")

        await Backendless.Data.of("osd_pages").save(formData)
            .then(async function(response) {
                //console.log(response);
                let starComponent = document.getElementById("submitBtn")
                party.confetti(starComponent);

                await getAllDataFromBackendless();
                await goto("/page" + response.url)
            })
            .catch(function(error) {
                // TODO: Create error box for this
                console.log(error);
                buttonProcessingStateEnable("#submitBtn", "Save")
            });
    }
</script>

<CollectionTemplate categoryTitle={pageCategory} {pages}>
    <!--<EditPageTemplate {pageID} {pageTitle} {pageContent} {pageCategory} {pageURL} />-->

    <form on:submit={handleSubmit}>
        <div class="form-floating mb-4">
            <input type="text"
                   class="form-control form-control-lg"
                   id="title"
                   placeholder="Best Practices"
                   bind:value={pageTitle}
                   required>
            <label for="title">Page Title</label>
        </div>

        <div class="row">
            <div class="col-lg-6">
                <div class="form-floating mb-4">
                    <input type="text"
                           class="form-control form-control-lg"
                           id="category"
                           list="categories"
                           placeholder="Engineering"
                           bind:value={pageCategory}
                           required>
                    <label for="category">Category</label>
                    <small class="text-muted">Choose from an existing category or create a new one</small>
                </div>


                <datalist id="categories">
                    {#each categories as category}
                        <option>{category}</option>
                    {/each}
                </datalist>
            </div><!-- end col -->

            <div class="col-lg-6">
                <div class="form-floating mb-4">
                    <input type="text"
                           class="form-control form-control-lg"
                           id="url"
                           placeholder="Page Link"
                           bind:value={pageURL}
                           required>
                    <label for="category">Page Link</label>
                </div>
            </div><!-- end col -->
        </div><!-- end row -->


        <div class="mb-4">
            <label for="content" class="form-label">Page Content</label>
            <textarea class="form-control"
                      placeholder="Page content"
                      id="content"
                      bind:value={pageContent}
                      style="height: 50vh; font-family: monospace;"></textarea>
        </div>


        <p>
            <button id="submitBtn" class="btn btn-primary px-5" type="submit">Save</button>
            <a href="/page{pageURL}" id="cancelBtn" class="btn px-5">Cancel</a>
        </p>
    </form>
</CollectionTemplate>
