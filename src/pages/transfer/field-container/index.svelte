<script lang="ts">
    import Icon from '~/components/elements/icon.svelte'
    import StatusIcon from './status-icon.svelte'

    export let label: string
    export let secondLabel: string | undefined = undefined
    export let value: string | undefined = undefined
    export let placeholder: string
    export let valid: boolean = false
    export let optional: boolean = false

    let editing: boolean = false
    let valueToDisplay: string | undefined = undefined
    let displayOutsideCheck: boolean = false

    $: {
        valueToDisplay = value && `${value.substring(0, 15)}${value.length > 16 ? '...' : ''}`
        displayOutsideCheck = (!!value || !optional) && valid
    }
</script>

<style type="scss">
    .container {
        display: flex;
        min-height: 60px;
        border-bottom: 1px solid var(--divider-grey);
        &:first-child {
            border-top: 1px solid var(--divider-grey);
        }

        .label-container {
            padding: 10px 3px;

            h3 {
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

                .icon {
                    padding: 8px;
                    width: 30px;

                    &.close {
                        color: var(--main-blue);
                        float: right;
                        cursor: pointer;
                    }
                }
            }

            .edit-button {
                margin: 12px;
                color: var(--main-blue);
                cursor: pointer;
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
        <h3>{label}</h3>
        <p>{secondLabel || ''}</p>
    </div>

    <div class="value-container">
        <div class={editing ? 'visible' : 'hidden'}>
            <slot />

            <div class="icons-container">
                <StatusIcon {valid} />
                <div class="close icon" on:click={() => (editing = false)}>
                    <Icon size="large" name="x-circle" />
                </div>
            </div>
        </div>
        <div class={editing ? 'hidden' : 'visible'}>
            <div class="edit-button" on:click={() => (editing = true)}>
                {valueToDisplay || placeholder}
            </div>
            <StatusIcon noError valid={displayOutsideCheck} />
        </div>
    </div>
</div>
