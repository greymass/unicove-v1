<script lang="ts">
    import Button from './button.svelte'

    export let opened: boolean = false
    export let header: string | undefined = undefined
    export let size: string = 'small'
    export let hideCloseButton: boolean = false

    const handleClose = function () {
        opened = false
    }

    const preventClose = function (event: any) {
        event.stopPropagation()
    }
</script>

<style type="scss">
    .container {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto; /* Enable scroll if needed */
        background-color: rgba(0, 0, 0, 0.4);
        z-index: 999;

        .modal {
            background-color: white;
            position: relative;
            margin: 15% auto;
            border: 1px solid #888;
            width: 80%;
            max-width: 300px;
            border-radius: 20px;

            &.large {
                max-width: 500px;
            }

            .modal-header {
                padding: 20px;
            }

            hr {
                margin: 0;
            }

            .modal-content {
                padding: 20px;
            }

            .button-container {
                display: flex;
                flex-direction: column;
                padding: 20px;
            }
        }
    }
</style>

{#if opened}
    <div on:click={handleClose} class="container">
        <div on:click={preventClose} class={`modal ${size}`}>
            {#if header}
                <div class="modal-header">
                    <h1>
                        {header}
                    </h1>
                </div>
                <hr />
            {/if}
            <div class="modal-content">
                <slot />
            </div>
            {#if !hideCloseButton}
                <div class="button-container">
                    <Button size="large" on:action={handleClose}>Close</Button>
                </div>
            {/if}
        </div>
    </div>
{/if}
