<script lang="ts">
    export let changeStep: () => void
</script>

<style type="scss">
    span {
        color: var(--main-blue);
        cursor: pointer;
        font-size: 12px;
    }
</style>

<span on:click={changeStep}>Change</span>
