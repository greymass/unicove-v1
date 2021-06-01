<script>
    export let component: any
</script>

{#await component.then ? component : component()}
    <div class="app-loading" />
{:then cmp}
    <svelte:component this={cmp.default} />
{/await}
