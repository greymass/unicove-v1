<script lang="ts">
    import AccountSidebar from './layout/account/sidebar.svelte'

    import Navigation from './layout/navigation.svelte'

    import Footer from './layout/footer.svelte'

    /** Title of the page. */
    export let title: string
</script>

<section>
  <div class="layout">
    <Navigation />
    <div class="main">
        <div class="content">
            <h1>{title}</h1>
            <slot />
        </div>
        <Footer />
    </div>
    <AccountSidebar />
  </div>
</section>

<style>
 .layout {
   display: flex;
   height: 100%;
 }

 .main {
   flex-grow: 1;
   padding: 30px;
   min-height: 90vh;
 }

 .content {
    margin: 45px;
    min-height: 60vh;
 }

 .content h1 {
    margin-bottom: 20px;
 }
</style>
