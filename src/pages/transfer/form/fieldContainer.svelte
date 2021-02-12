<script lang="ts">
    import Icon from '~/components/elements/icon.svelte'

    export let label: string
    export let secondLabel: string | null = null
    export let value: string | null = null
    export let placeholder: string

    let editing: string = false
</script>

<style type="scss">
    div {
        margin: 20px 0;
        display: flex;

        label {
            display: block;
            margin: 5px 0;
        }

        a.edit-button {
            color: var(--main-blue);
        }

        a span.green {
            color: var(--success-green);
        }

        a span.green {
            color: var(--main-grey);
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
            <a on:click={() => (editing = false)}>
                <span class={valid ? 'green' : 'grey'} on:click={() => (open = !open)}>
                    <Icon name="check" />
                </span>
            </a>
        {:else}
            <a class="edit-button" on:click={() => (editing = true)}>
                {value || placeholder}
            </a>
        {/if}
    </div>
    <hr />
</div>
