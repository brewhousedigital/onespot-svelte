<script>
    import '$lib/css/global.css';
    import SidebarCompany from "$lib/page-components/SidebarCompany.svelte";
    import StarThisPage from "$lib/page-components/StarThisPage.svelte";
    import { beforeUpdate, afterUpdate, onMount } from "svelte";
    import slugURL from "$lib/js/slugURL";
    import {getAllDataFromBackendless, getAllCategories, getUserDetailsFromBackendless} from "$lib/js/getDataFromBackendless";

    import { fade } from 'svelte/transition';

    let currentTitle = "";
    let loadContent = false;
    let showSidebar = true;

    import Backendless from 'backendless'
    import {partyJS} from "$lib/js/party";
    import {goto} from "$app/navigation";
    const APP_ID = 'BFD3873C-0565-EBFE-FFA8-8001D60AC000';
    const API_KEY = '8561E43D-334E-44E4-B05E-40A81D6E081A';
    Backendless.initApp(APP_ID, API_KEY);

    let currentPath;

    let OSD = [];
    let userDetails;
    let categories = [];
    let auth = false;

    function storageSetup() {
        if(localStorage.getItem("userDetails") === null) {
            localStorage.setItem("userDetails", JSON.stringify(null))
        }
    }

    onMount(async() => {
        userDetails = await getUserDetailsFromBackendless();
        OSD = await getAllDataFromBackendless();
        categories = getAllCategories();

        currentPath = window.location.pathname;
        currentTitle = document.title;

        // Activate confetti!
        partyJS();

        loadContent= true;
    })

    beforeUpdate(() => {

    })

    afterUpdate(() => {
        if(window.location.pathname === "/access") {
            showSidebar = false;
        } else {
            showSidebar = true;
        }

        // Authentication check
        let url = window.location.pathname;
        storageSetup();
        userDetails = JSON.parse(localStorage.getItem("userDetails"));

        // Set if user is logged in or not
        userDetails === null || userDetails === false ? auth = false : auth = true;

        if(url.includes("/access")) return false;
        if(url.includes("/logout")) return false;

        // If user is not on the unauthenticated pages, redirect them
        if(userDetails === null || userDetails === false) goto("/access")

        // If user is logged in, generate categories
        currentPath = window.location.pathname;
        categories = getAllCategories();
    })
</script>

<svelte:head>
    <meta property="og:type" content="website" />
    <meta property="og:url"                content="{currentPath}" />
    <meta property="og:title"              content="{currentTitle} - OneSpot Docs" />
    <meta property="og:description"        content="A tool to keep track of all your project info." />
</svelte:head>

<style>
    #layout-sidebar,
    #layout-content {
        height: 100vh;
        overflow: hidden;
    }

    #layout-sidebar-scroll,
    #layout-content-scroll {
        overflow-y: scroll;
        overflow-x: hidden;
        height: 100%;
        min-width: 275px
    }

    #layout-sidebar {
        background-color: #edf2f7;
        color: #515c6c;
        padding: 24px 0;
    }

    #layout-sidebar-scroll {
        padding: 0 24px;
    }

    #layout-content-scroll {
        padding: 24px 56px 24px 24px;
    }

    #layout-sidebar-scroll::-webkit-scrollbar-track,
    #layout-content-scroll::-webkit-scrollbar-track
    {
        border-radius: 10px;
        background-color: #F5F5F5;
    }

    #layout-sidebar-scroll::-webkit-scrollbar,
    #layout-content-scroll::-webkit-scrollbar
    {
        width: 8px;
        background-color: #F5F5F5;
    }

    #layout-sidebar-scroll::-webkit-scrollbar-thumb,
    #layout-content-scroll::-webkit-scrollbar-thumb
    {
        border-radius: 10px;
        background-color: #dfe1e2;
    }

    #layout-content {
        padding: 0;
    }

    #nav-main-options,
    #nav-collections,
    #nav-settings {
        padding: 24px 0;
    }
    #nav-main-options a,
    #nav-collections a,
    #nav-settings a {
        color: #515c6c;
        text-decoration: none;
        display: block;
        padding: 8px 0;
        font-weight: 500;
        font-size: 20px;
    }
</style>

{#if loadContent}

<div class="container-fluid" transition:fade="{{duration: 300}}">
    <div class="row">
        {#if showSidebar}
        <div id="layout-sidebar" class="col-auto">
            <div id="layout-sidebar-scroll" class="d-flex flex-column">
                <SidebarCompany />

                <nav id="nav-main-options">
                    <a href="/" sveltekit:prefetch><i class="bi bi-house-door-fill me-2"></i>Home</a>
                    <a href="/search" sveltekit:prefetch><i class="bi bi-search me-2"></i>Search</a>
                    <a href="/starred" sveltekit:prefetch><i class="bi bi-star-fill me-2"></i>Starred</a>
                </nav>

                <nav id="nav-collections">
                    {#each categories as category}
                        <a href="/{slugURL(category)}" sveltekit:prefetch>
                            <i class="bi bi-file-earmark me-2 color-emerland"></i>{category}
                        </a>
                    {:else}
                        <p>No categories made. <br>Create a new page first!</p>
                    {/each}

                    <a href="/new-page" sveltekit:prefetch>
                        <i class="bi bi-plus-lg me-2 color-emerland"></i>New Page
                    </a>
                </nav>

                <nav id="nav-settings" class="mt-auto">
                    <a href="/archive" sveltekit:prefetch><i class="bi bi-archive-fill me-2"></i>Archive</a>
                    <a href="/settings" sveltekit:prefetch><i class="bi bi-gear-fill me-2"></i>Settings</a>
                    <a href="/logout" sveltekit:prefetch><i class="bi bi-box-arrow-up-left me-2"></i>Logout</a>
                </nav>
            </div><!-- end scroll -->
        </div><!-- end col -->
        {/if}

        <div id="layout-content" class="col">
            <div id="layout-content-scroll">
                    {#key currentPath}
                        <slot></slot>
                    {/key}

                {#key currentPath}
                    <StarThisPage {currentPath} {currentTitle} />
                {/key}
            </div>
        </div><!-- end col -->
    </div><!-- end row -->
</div><!-- end container -->
{/if}
