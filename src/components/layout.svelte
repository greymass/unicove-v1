<script lang="ts">
    import AccountSwitcher from './layout/account-switcher.svelte'

    import Navigation from './layout/navigation.svelte'

    import Footer from './layout/footer.svelte'

    /** Title of the page. */
    export let title: string
</script>

<section>
  <div class="flex h-full">
    <div class="w-1/6">
        <Navigation />
    </div>
    <div>
        <header>
            <AccountSwitcher />
            <hr />
        </header>
        <div class="content">
            <h1>{title}</h1>
            <slot />
        </div>
    </div>
    </div>

    <Footer />
</section>

<style>
 .content {
   margin: 30px;
   min-height: 90vh;
 }

 .content h1 {
   margin-bottom: 20px;
 }
</style>
