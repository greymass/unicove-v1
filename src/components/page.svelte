<script lang="ts">
    import AccountSwitcher from './account-switcher.svelte'

    import Navigation from './navigation.svelte'
    /** Title of the page. */
    export let title: string
</script>

<section>
    <header>
        <Navigation />
        <AccountSwitcher />
        <h1>{title}</h1>
    </header>
    <div class="content">
        <slot />
    </div>
    <hr />
    <small>Copyright (c) ∞ Wilfra™ (including – but not limited to – everything)</small>
</section>
