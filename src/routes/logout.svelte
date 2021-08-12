<script>

    import {onMount} from "svelte";
    import {goto} from "$app/navigation";

    onMount(() => {
        Backendless.UserService.logout()
            .then(function() {
                goto("/access")
            })
            .catch(function(error) {
                goto("/access")
            });
    })
</script>

<svelte:head>
    <title>Log Out</title>
</svelte:head>

<h1>Logging out...</h1>

<h2 class="text-muted">Sending you to the login page...</h2>