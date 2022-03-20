<script lang="ts">
    import {createEventDispatcher} from 'svelte'
    import Icon from '~/components/elements/icon.svelte'

    const dispatch = createEventDispatcher()

    export let dismissible = true
    export let title: string | undefined
    export let message: string
</script>

<style lang="scss">
    .toast {
        background: var(--main-white);
        box-shadow: 0px 24px 32px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
            0px 4px 8px rgba(0, 0, 0, 0.04), 0px 0px 1px rgba(0, 0, 0, 0.04);
        border-radius: 8px;
        padding: 10px;
        :global(.darkmode) & {
            box-shadow: 0px 24px 32px rgba(180, 180, 180, 0.04),
                0px 16px 24px rgba(180, 180, 180, 0.04), 0px 4px 8px rgba(180, 180, 180, 0.04),
                0px 0px 1px rgba(180, 180, 180, 0.04);
        }
    }
    header {
        display: flex;
        justify-content: space-between;
    }
    .title {
        flex: 1;
        font-weight: 700;
        font-size: 12px;
        line-height: 14px;
        color: var(--main-black);
    }
    .close {
        color: var(--main-blue);
        background: transparent;
        border: 0 none;
        padding: 0;
        margin: 0 0 0 auto;
        :global(circle) {
            fill: var(--main-grey);
            stroke: var(--main-grey);
            transition: all 0.2s ease-in-out;
        }
        :global(line) {
            transition: all 0.2s ease-in-out;
        }
        &:hover {
            :global(circle) {
                fill: var(--main-white);
                stroke: var(--main-blue);
            }
        }
        &:active {
            :global(circle) {
                fill: var(--main-blue);
                stroke: var(--main-blue);
            }
            :global(line) {
                fill: var(--main-blue);
                stroke: var(--main-white);
            }
        }
    }
    .text {
        font-weight: 500;
        font-size: 12px;
        line-height: 14px;
        color: var(--main-black);
    }
</style>

<section class="toast" role="alert">
    {#if dismissible || title}
        <header>
            <h3 class="title">{title}</h3>
            {#if dismissible}
                <button class="close" on:click={() => dispatch('dismiss')}>
                    <Icon name="x-circle" /></button
                >
            {/if}
        </header>
    {/if}
    <p class="text">{message}</p>
</section>
