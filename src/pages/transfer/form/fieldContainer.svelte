<script lang="ts">
    import Icon from '~/components/elements/icon.svelte'

    export let label: string
    export let secondLabel: string | null = null
    export let value: string | null = null
    export let placeholder: string
    export let valid: boolean = false

    console.log('fieldContainer')
    console.log({valid})

    let editing: string = false
</script>

<style type="scss">
    div {
        margin: 10px 5px;
        display: flex;

        label {
            display: block;
            margin: 5px 0;
        }

        .value-container {
            margin-left: auto;

            a.edit-button {
                color: var(--main-blue);
            }

             a.edit-button {
                color: var(--main-black);
             }

            span.green {
                color: var(--success-green);
            }

            a span.red {
                color: var(--error-red);
            }
        }
    }
</style>

<div>
    <div class="label-container">
        <label> {label} </label>
    </div>

    <div class="value-container">
        {#if editing}
            <slot />
            {#if valid}
                <span class="green" on:click={() => (editing = !open)}>
                    <Icon name="check" />
                </span>
            {/if}
            <a class="close-button" on:click={() => (editing = false)}>
                <Icon name="minus-square" />
            </a>
        {:else}
            <a class="edit-button" on:click={() => (editing = true)}>
                {value || placeholder}
            </a>
        {/if}
    </div>
</div>

<hr />
