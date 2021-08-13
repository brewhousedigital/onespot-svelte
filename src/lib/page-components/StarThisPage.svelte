<script>
    import { onMount, tick } from "svelte";

    export let currentPath = "/";
    export let currentTitle = "Home";
    let starred = false;
    let allStarredPages = [];
    let visible = true;

    let listOfPagesToHideStar = [
        "/",
        "/search",
        "/starred",
        "/page",
        "/archive",
        "/logout",
        "/access",
    ]





    onMount(async() => {
        await tick();

        if(localStorage.getItem("starred-pages") === null) {
            localStorage.setItem("starred-pages", JSON.stringify([]));
        }

        allStarredPages = JSON.parse(localStorage.getItem("starred-pages"));

        // If page exists in storage, fill the star

        allStarredPages.map(item => {
            if(item.url === currentPath) {
                starred = true
            }
        })

        // Hide the star on certain pages
        listOfPagesToHideStar.includes(currentPath)
            ? visible = false
            : visible = true;

        currentTitle = document.title;
    })


    function starPage() {
        let starComponent = document.getElementById("star-component")
        party.confetti(starComponent);

        let currentURL = window.location.pathname;
        allStarredPages = [...allStarredPages, {
            url: currentURL,
            name: currentTitle
        }];
        localStorage.setItem("starred-pages", JSON.stringify(allStarredPages));
        starred = true;
    }


    function removePage() {
        let currentURL = window.location.pathname;
        allStarredPages = allStarredPages.filter(item => item.url !== currentURL);
        localStorage.setItem("starred-pages", JSON.stringify(allStarredPages));
        starred = false;
    }
</script>

<style>
    #star-component {
        position: absolute;
        top: 12px;
        right: 12px;
    }

    #star-component button {
        font-size: 30px;
    }

    .btn:hover,
    .btn:focus {
        color: var(--nephritis);
    }
</style>


{#if visible}
    <div id="star-component">
        {#if starred}
            <button type="button" class="btn color-emerland" on:click={removePage}>
                <i class="bi bi-star-fill"></i>
            </button>
        {:else}
            <button type="button" class="btn color-emerland" on:click={starPage}>
                <i class="bi bi-star"></i>
            </button>
        {/if}
    </div>
{/if}