<script>
    import Icon from '~/components/elements/icon.svelte'
    import type {ChainConfig} from '~/config'

    export let tx: string | undefined
    export let onClose: (() => undefined) | undefined = undefined
    export let activeBlockchain: ChainConfig

    let txUrl: string = ''

    $: {
        txUrl = `${activeBlockchain.bloksUrl}/transaction/${tx}`
    }
</script>

<style type="scss">
    div {
        margin: 20px 0;
        padding: 20px;
        color: white;
        background-color: var(--success-green);
        text-align: center;
        border-radius: 6px;
        position: relative;

        .iconContainer {
            position: absolute;
            top: 5px;
            right: 10px;
            cursor: pointer;
        }

        a {
            cursor: pointer;
            color: white;

            &.link {
                margin: 20px;
            }
        }

        h4 {
            margin-bottom: 20px;
        }
    }
</style>

<div>
    <div class="iconContainer" on:click={() => onClose && onClose()}>
        <Icon name="x-square" />
    </div>
    <h4>The transaction was successful!</h4>
    <a class="link" href={txUrl}> View on Block Explorer </a>
</div>
