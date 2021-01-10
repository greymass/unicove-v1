<script lang="ts">
    import AccountSwitcher from './layout/account-switcher.svelte'

    import Navigation from './layout/navigation.svelte'

    import Footer from './layout/footer.svelte'

    /** Title of the page. */
    export let title: string
</script>

<section>
  <div class="layout">
    <Navigation />
    <div class="main">
        <header class="header">
            <AccountSwitcher />
            <hr />
        </header>
        <div class="content">
            <h1>{title}</h1>
            <slot />
        </div>
        <Footer />
    </div>
  </div>
</section>

<style>
 .layout {
   display: flex;
   height: 100%;
 }

 .main {
   flex-grow: 1;
   padding: 20px;
 }

 .header {
    margin: 15px;
 }

 .content {
   margin: 45px;
   min-height: 90vh;
 }

 .content h1 {
   margin-bottom: 20px;
 }
</style>
