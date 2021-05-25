<script lang="ts">
    import Icon from '~/components/elements/icon.svelte'
    export let changeStep: () => void
</script>

<style type="scss">
    div {
        color: var(--main-blue);
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
</style>

<div on:click={changeStep}>
    <Icon size="large" name="edit-2" />
</div>
