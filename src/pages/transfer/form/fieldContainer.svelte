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
        display: flex;
        height: 60px;
        border-bottom: 1px solid var(--divider-grey);

        .label-container {
          padding: 10px;

          label {
              display: block;
              margin: 5px 0;
          }
        }

        .value-container {
            margin-left: auto;
            padding: 10px;

            .icons-container {
              min-width: 60px;
              border: none;

              a.icon, span.icon {
                padding: 8px;
                width: 30px;

                &.close {
                    color: var(--main-blue);
                    float: right;
                }

                &.success {
                    color: var(--success-green);
                }

                &.error {
                    color: var(--error-red);
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

<div>
    <div class="label-container">
        <label> {label} </label>
    </div>

    <div class="value-container">
        {#if editing}
            <slot />
            <div class="icons-container">
                {#if valid}
                    <span class="success icon" on:click={() => (editing = !open)}>
                        <Icon name="check" size="large" />
                    </span>
                {:else}
                  <span class="error icon" on:click={() => (editing = !open)}>
                      <Icon name="alert-circle" size="large" />
                  </span>
                {/if}
                <a class="close icon" on:click={() => (editing = false)}>
                    <Icon size="large" name="x-circle" />
                </a>
            </div>
        {:else}
            <a class="edit-button" on:click={() => (editing = true)}>
                {value || placeholder}
            </a>
        {/if}
    </div>
</div>
