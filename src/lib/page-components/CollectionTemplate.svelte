<script>
    import CollectionTitle from "$lib/page-components/CollectionTitle.svelte";
    import CollectionSidebar from "$lib/page-components/CollectionSidebar.svelte";

    export let categoryTitle = "";
    export let pages = [];
</script>

<CollectionTitle {categoryTitle} />

<div class="row">
    <div class="col-auto">
        <CollectionSidebar {pages} />
    </div><!-- end col auto -->

    <div class="col">
        <slot></slot>
    </div><!-- end col -->
</div><!-- end row -->