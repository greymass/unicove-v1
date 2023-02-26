<script>
    import Icon from '~/components/elements/icon.svelte'
    import type {ChainConfig} from '~/config'

    export let tx: string | undefined
    export let activeBlockchain: ChainConfig

    let txUrl: string = ''

    $: {
        txUrl = `${activeBlockchain.explorerUrl}/transaction/${tx}`
    }
</script>

<style type="scss">
    div {
        margin: 0;
        padding: 20px;
        text-align: center;
        border-radius: 6px;
        position: relative;

        .iconContainer {
            color: var(--success-green);
            margin-bottom: 20px;
        }

        a {
            cursor: pointer;
            color: var(--main-black);

            &.link {
                margin: 20px;
            }
        }

        h4 {
            margin-bottom: 20px;
            color: var(--main-black);
        }
    }
</style>

<div>
    <div class="iconContainer">
        <Icon size="massive" name="check-circle" />
    </div>
    <h4>The transaction was successful!</h4>
    <a class="link" href={txUrl} target="_blank"> View on Block Explorer </a>
</div>
