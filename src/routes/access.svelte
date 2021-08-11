<script>
    let loginValues = {
        email: "",
        password: "",
    }
</script>

<svelte:head>
    <title>Access</title>
</svelte:head>

<style>
    #access-form {max-width: 480px}
</style>

<h1>Access</h1>
<h2 class="text-muted mb-5">Log in to see your documents</h2>

<form id="access-form">
    <div class="form-floating mb-3">
        <input type="email"
               class="form-control"
               id="email"
               bind:value={loginValues.email}
               placeholder="name@example.com">
        <label for="email">Email address</label>
    </div>

    <div class="form-floating mb-3">
        <input type="email"
               class="form-control"
               bind:value={loginValues.password}
               id="password">
        <label for="password">Password</label>
    </div>

    <div>
        <button type="submit" class="btn btn-primary px-4">Login</button>
    </div>
</form>