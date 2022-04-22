<script lang="ts">
    import {slide} from 'svelte/transition'

    import Toast from '~/components/elements/toast.svelte'

    import {dismissToast, toasts} from '~/stores/toast'
</script>

<style lang="scss">
    .toasts {
        position: fixed;
        right: 0;
        bottom: 0;
        width: 250px;
        padding: 10px;
        display: flex;
        justify-content: center;
        flex-direction: column;
    }
    .toast:not(:last-child) {
        margin-bottom: 15px;
    }
</style>

{#if $toasts}
    <div class="toasts">
        {#each $toasts.reverse() as toast (toast.id)}
            <div class="toast" transition:slide|local>
                <Toast
                    title={toast.title}
                    message={toast.message}
                    dismissible={toast.dismissible}
                    on:dismiss={() => dismissToast(toast.id)}
                />
            </div>
        {/each}
    </div>
{/if}
