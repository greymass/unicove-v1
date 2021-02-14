<script>
    import Icon from '~/components/elements/icon.svelte'

    export let tx: string | undefined
    export let onClose: () => undefined | undefined = undefined
    export let activeBlockchain: ChainConfig | undefined

    let txUrl

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

        a {
            cursor: pointer;
            color: white;

            &.iconContainer {
                position: absolute;
                top: 5px;
                right: 10px;
            }

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
    <a href="" class="iconContainer" on:click={() => onClose && onClose()}>
        <Icon name="x-square" />
    </a>
    <h4>The transaction was successful!</h4>
    <a class="link" href={txUrl}> View on Block Explorer </a>
</div>
