<script lang="ts">
    import {writable} from 'svelte/store'

    import Button from '~/components/elements/button.svelte'

    export let display = writable<boolean>(false)
    export let header: string | null = null
    export let size: string = 'small'
    export let hideCloseButton: boolean = false
    export let disableDimmerClose: boolean = false
    export let delegateClose: boolean = false
    export let onClose: () => void = () => {}

    console.log({ delegateClose })

    export let close = () => {
        if (!delegateClose) {
            console.log('setting')
            $display = false
        }

        onClose()
    }

    $: console.log({ d: $display })
</script>

<style type="scss">
    .dimmer {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto; /* Enable scroll if needed */
        background-color: rgba(0, 0, 0, 0.4);
        z-index: 1001;
    }

    .modal {
        font-family: Inter;
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 19px;
        letter-spacing: -0.26px;
        color: var(--main-black);
        background-color: var(--main-white);

        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        box-shadow: 0px 24px 32px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
            0px 4px 8px rgba(0, 0, 0, 0.04), 0px 0px 1px rgba(0, 0, 0, 0.04);
        border-radius: 20px;

        width: 80%;
        max-width: 300px;

        z-index: 2000;

        &.large {
            max-width: 800px;
            height: 80vh;
        }

        .modal-header {
            color: var(--light-grey);
            font-weight: bold;
            font-size: 18px;
            line-height: 22px;
            letter-spacing: -0.26px;
            padding: 21px;
        }

        .modal-content {
          padding: 20px;
          height: 75%;
        }

        .button-container {
            display: flex;
            flex-direction: column;
            padding: 17px;
        }
    }
</style>

{#if $display}
    <div on:click={disableDimmerClose ? undefined : close} class="dimmer" />
    <div class={`modal ${size}`}>
        {#if header}
            <div class="modal-header">
                <h1>
                    {header}
                </h1>
            </div>
        {/if}
        <div class="modal-content">
            <slot />
        </div>
        {#if !hideCloseButton}
            <div class="button-container">
                <Button size="large" on:action={close}>Close</Button>
            </div>
        {/if}
    </div>
{/if}
