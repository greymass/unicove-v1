<script lang="ts">
    import Icon from '~/components/elements/icon.svelte'
    import StatusIcon from './fieldContainer/statusIcon.svelte'

    export let label: string
    export let secondLabel: string | null = null
    export let value: string | null = null
    export let placeholder: string
    export let valid: boolean = false
    export let optional: boolean = false

    let editing: string = false
    let valueToDisplay: string | null = null
    let displayOutsideCheck: boolean = false

    $: {
        valueToDisplay = value && `${value.substring(0, 15)}${value.length > 16 ? '...' : ''}`
        displayOutsideCheck = (value || !optional) && valid
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
                font-weight: bold;
            }
        }

        .value-container {
            margin-left: auto;
            padding: 13px;
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
        .hidden {
            display: none;
        }
        .visible {
            display: flex;
        }
    }
</style>

<div class="container">
    <div class="label-container">
        <label> {label} </label>
        <p>{secondLabel || ''}</p>
    </div>

    <div class="value-container">
        <div class={editing ? 'visible' : 'hidden'}>
            <slot />

            <div class="icons-container">
                <StatusIcon {valid} />
                <a class="close icon" on:click={() => (editing = false)}>
                    <Icon size="large" name="x-circle" />
                </a>
            </div>
        </div>
        <div class={editing ? 'hidden' : 'visible'}>
            <a class="edit-button" on:click={() => (editing = true)}>
                {valueToDisplay || placeholder}
            </a>
            <StatusIcon noError valid={displayOutsideCheck} />
        </div>
    </div>
</div>
