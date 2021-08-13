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

    import '$lib/js/marked';
    import { onMount } from "svelte";
    import slugURL from "$lib/js/slugURL";

    import CollectionTemplate from "$lib/page-components/CollectionTemplate.svelte";
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




</script>




