<script>
    export let categoryTitle = "";
</script>

<style>
    .sidebar-label {
        font-weight: 500;
        font-size: 20px;
        text-transform: uppercase;
    }
</style>

<nav aria-label="breadcrumb" class="mb-5 px-5">
    <ol class="breadcrumb">
        <!--<li class="breadcrumb-item sidebar-label"><a href="#" class="text-decoration-none">{collection}</a></li>
        <li class="breadcrumb-item sidebar-label active" aria-current="page">Library</li>-->
        <li class="breadcrumb-item sidebar-label">Category: {categoryTitle}</li>
    </ol>
</nav>