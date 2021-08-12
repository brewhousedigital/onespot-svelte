<script>
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import slugURL from "$lib/js/slugURL";
    import { getAllDataFromBackendless, getAllCategories } from "$lib/js/getDataFromBackendless";
    import { buttonProcessingState, buttonProcessingStateEnable } from "$lib/js/buttonProcessingState";
    //import CategoriesDataList from "$lib/page-components/CategoriesDataList.svelte";

    let OSD = [];
    let categories = [];
    let formData = {

    }

    onMount(async() => {
        // Grab latest storage info
        OSD = JSON.parse(localStorage.getItem("OSD"));
        categories = getAllCategories();
    })

    async function handleSubmit(e) {
        e.preventDefault();

        buttonProcessingState("#submitBtn")

        formData.url = `/${slugURL(formData.category)}/${slugURL(formData.title)}`;

        await Backendless.Data.of("osd_pages").save(formData)
            .then(async function(response) {
                console.log(response);
                let starComponent = document.getElementById("submitBtn")
                party.confetti(starComponent);

                await getAllDataFromBackendless();
                await goto(response.url + "/edit")
            })
            .catch(function(error) {
                // TODO: Create error box for this
                console.log(error);
                buttonProcessingStateEnable("#submitBtn", "Save")
            });
    }
</script>

<svelte:head>
    <title>Create Page</title>
</svelte:head>

<style>
    form {
        max-width: 576px;
    }
</style>

<h1 class="mb-5">Create New Page</h1>

<form on:submit={handleSubmit}>
    <div class="form-floating mb-4">
        <input type="text"
               class="form-control form-control-lg"
               id="title"
               placeholder="Best Practices"
               bind:value={formData.title}
               required>
        <label for="title">Page Title</label>
    </div>

    <div class="form-floating mb-4">
        <input type="text"
               class="form-control form-control-lg"
               id="category"
               list="categories"
               placeholder="Engineering"
               bind:value={formData.category}
               required>
        <label for="category">Category</label>
        <small class="text-muted">Choose from an existing category or create a new one</small>
    </div>

    <datalist id="categories">
        {#each categories as category}
            <option>{category}</option>
        {/each}
    </datalist>

    <p><button id="submitBtn" class="btn btn-primary" type="submit">Create Your Page</button></p>
</form>