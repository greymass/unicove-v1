<script lang="ts">
    import Icon from '~/components/elements/icon.svelte'
    import StatusIcon from './fieldContainer/statusIcon.svelte'

    export let label: string
    export let secondLabel: string | null = null
    export let value: string | null = null
    export let placeholder: string
    export let valid: boolean = false

    console.log('fieldContainer')
    console.log({valid})
    console.log({value})

    let editing: string = false
    let valueToDisplay: string | null = null

    $: {
       valueToDisplay  = value && `${value.substring(0, 15)}${value.length > 16 ? '...' : ''}`
    }
</script>

<style type="scss">
    .container {
        display: flex;
        min-height: 60px;
        border-bottom: 1px solid var(--divider-grey);

        .label-container {
          padding: 10px 3px;

          label {
              display: block;
              margin: 5px 0;
          }
        }

        .value-container {
            margin-left: auto;
            padding: 10px;
            display: flex;

            .icons-container {
              min-width: 60px;
              display: flex;

              a.icon {
                padding: 8px;
                width: 30px;

                &.close {
                    color: var(--main-blue);
                    float: right;
                }
              }
            }

            a.edit-button {
                margin: 12px;
                color: var(--main-blue);
            }
        }
    }
</style>

<div class="container">
    <div class="label-container">
        <label> {label} </label>
    </div>

    <div class="value-container">
        {#if editing}
            <slot />

            <div class="icons-container">
                <StatusIcon {valid} />
                <a class="close icon" on:click={() => (editing = false)}>
                    <Icon size="large" name="x-circle" />
                </a>
            </div>
        {:else}
            <a class="edit-button" on:click={() => (editing = true)}>
                {valueToDisplay || placeholder}
            </a>
        {/if}
    </div>
</div>
