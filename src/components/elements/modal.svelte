<script lang="ts">
    import Button from './button.svelte'

    export let display: boolean = false
    export let header: string | null = null
    export let size: string = 'small'
    export let hideCloseButton: boolean = false

    const close = () => (display = false)
    const open = () => (display = true)
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
        z-index: 999;
    }

    .modal {
        font-family: Inter;
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 19px;
        text-align: center;
        letter-spacing: -0.26px;
        background-color: white;

        position: absolute;
        top: 25%;
        left: 50%;
        transform: translate(-50%, -50%);

        box-shadow: 0px 24px 32px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
            0px 4px 8px rgba(0, 0, 0, 0.04), 0px 0px 1px rgba(0, 0, 0, 0.04);
        border-radius: 20px;

        width: 80%;
        max-width: 300px;

        z-index: 1000;

        &.large {
            max-width: 500px;
        }

        .modal-header {
            color: #585d6e;
            font-weight: bold;
            font-size: 18px;
            line-height: 22px;
            letter-spacing: -0.26px;
            padding: 21px;
        }

        .modal-content {
            padding: 20px;
        }

        .button-container {
            display: flex;
            flex-direction: column;
            padding: 17px;
        }
    }
</style>

<span on:click={open}>
    <slot name="trigger" />
</span>

{#if display}
    <div on:click={close} class="dimmer" />
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
