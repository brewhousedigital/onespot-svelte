<script>
    import { getAllDataFromBackendless } from "$lib/js/getDataFromBackendless";
    import { buttonProcessingState, buttonProcessingStateEnable } from "$lib/js/buttonProcessingState";
    import { goto } from "$app/navigation";

    import CategoriesDataList from "$lib/page-components/CategoriesDataList.svelte";

    export let pageID = "";
    export let pageTitle = "";
    export let pageContent = "";
    export let pageCategory = "";
    export let pageURL = "";

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
                await goto(response.url)
            })
            .catch(function(error) {
                // TODO: Create error box for this
                console.log(error);
                buttonProcessingStateEnable("#submitBtn", "Save")
            });
    }
</script>

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


            <CategoriesDataList />
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
        <a href="{pageURL}" id="cancelBtn" class="btn px-5">Cancel</a>
    </p>
</form>