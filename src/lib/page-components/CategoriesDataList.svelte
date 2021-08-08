<script>
    import {getAllCategories} from "$lib/js/getDataFromBackendless";
    import {onMount} from "svelte";

    let categories = [];

    onMount(() => {
        categories = getAllCategories();
    })
</script>

<datalist id="categories">
    {#each categories as category}
        <option>{category}</option>
    {/each}
</datalist>