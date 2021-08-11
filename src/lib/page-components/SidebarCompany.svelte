<script>
    //export let companyName = "OneSpot Docs";
    export let companyName = "V Notes";
    export let companyAvatar = "/images/icons/Icon-144.png";
</script>

<style>
    #logo {
        max-width: 50px;
    }
    #name {
        font-size: 20px;
        font-weight: 700;
        margin: 0;
    }
</style>

<div class="d-flex align-items-center">
    <img src="{companyAvatar}" alt="Logo for {companyName}" id="logo" class="img-fluid rounded me-3">
    <div>
        <h1 class="mb-0" id="name">{companyName}</h1>
    </div>
</div><!-- end d-flex -->