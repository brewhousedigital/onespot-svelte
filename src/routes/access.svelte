<script>
    import {goto} from "$app/navigation";
    import SidebarCompany from "$lib/page-components/SidebarCompany.svelte";

    let formData = {
        email: "",
        password: "",
    }

    // Create state
    let errorMessage = "";

    function handleLogin(e) {
        e.preventDefault();

        // Reset error state
        errorMessage = "";

        Backendless.UserService.login(formData.email, formData.password, true)
            .then(function(loggedInUser) {
                localStorage.setItem("userDetails", JSON.stringify(loggedInUser))
                goto("/")
            })
            .catch(function(error) {
                // Populate with error from Backendless
                errorMessage = error.message;
            });
    }
</script>

<svelte:head>
    <title>Access</title>
</svelte:head>

<style>
    #access-form {max-width: 480px}

    #access-box {
        height: 75vh;
    }
</style>

<div id="access-box" class="d-flex align-items-center justify-content-center text-center">
    <div>
        <div class="d-flex justify-content-center mb-4">
            <SidebarCompany/>
        </div>

        <h2 class="text-muted mb-5">Log in to see your documents</h2>

        <form id="access-form" on:submit={handleLogin}>
            <div class="form-floating mb-3">
                <input type="email"
                       class="form-control"
                       id="email"
                       required
                       bind:value={formData.email}
                       placeholder="name@example.com">
                <label for="email">Email address</label>
            </div>

            <div class="form-floating mb-3">
                <input type="password"
                       class="form-control"
                       bind:value={formData.password}
                       placeholder="Password"
                       required
                       id="password">
                <label for="password">Password</label>
            </div>

            {#if errorMessage.length > 0}
                <div class="alert alert-warning" role="alert">{errorMessage}</div>
            {/if}

            <div>
                <button type="submit" class="btn btn-primary px-4">Login</button>
            </div>
        </form>
    </div><!-- end flex item -->
</div><!-- end row -->