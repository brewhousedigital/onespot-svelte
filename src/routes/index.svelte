<script context="module">
    export const prerender = true;
</script>

<script>
    import {onMount} from "svelte";

    let OSD = [];
    let totalNumberOfUsedPages = 0;

    onMount(async() => {
        OSD = localStorage.getItem("OSD")
        if(OSD !== null) {
            OSD = JSON.parse(OSD);
            totalNumberOfUsedPages = OSD.length;
        }
    })
</script>

<svelte:head>
    <title>Home</title>
</svelte:head>

<div class="text-center py-5">
    <h1><span class="fw-light">Welcome to</span> V Notes</h1>

    <p class="mb-5">Store all your documents here</p>


    <figure class="text-center mb-5">
        <blockquote class="blockquote">
            <p>Currently there is a limit of 100 pages until I figure out how to raise it.</p>
        </blockquote>
        <figcaption class="blockquote-footer">
            Zach - <cite title="Source Title">Super Developer</cite>
        </figcaption>
    </figure>

    <code>You are currently using <strong>{totalNumberOfUsedPages} out of 100</strong> pages available.</code>
</div>