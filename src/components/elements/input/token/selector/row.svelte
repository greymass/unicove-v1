<script>
    import Icon from '~/components/elements/icon.svelte'
    import TokenImage from '~/components/elements/image/token.svelte'
    import type {Token} from '~/stores/tokens'

    export let token: Token
    export let onClick: () => void
    export let isTableRow: boolean

    let formattedTokenBalance: string | undefined = undefined

    $: {
        if (token.balance) {
            const tokenPrecision = token.balance.symbol.precision
            const unitValue = token.balance.units.value
            const fullTokenBalanceString = (
                Number(unitValue) / Math.pow(10, tokenPrecision)
            ).toFixed(tokenPrecision)

            if (isTableRow) {
                formattedTokenBalance =
                    fullTokenBalanceString.length > 8
                        ? `${fullTokenBalanceString.substring(0, 6)}..`
                        : fullTokenBalanceString
            } else {
                formattedTokenBalance = fullTokenBalanceString
            }
        }
    }
</script>

<style type="scss">
    .row {
        padding: 10px 12px;
        border-radius: 12px;
        max-width: 400px;
        border: 1px solid var(--divider-grey);
        position: relative;
        cursor: pointer;

        &:hover {
            background-color: var(--main-grey);
        }

        &.table {
            border: none;
        }

        .logo-container {
            position: absolute;
            top: 0;
            left: 0;
            padding: 10px;
            margin-right: 5px;
        }

        .name-text {
            font-family: Inter;
            font-style: normal;
            font-weight: 500;
            font-size: 14px;
            letter-spacing: -0.04px;
            color: var(--main-black);
            display: inline;
            margin-left: 25px;
            text-align: left;

            &.blueText {
                color: var(--main-blue);
            }
        }

        .balance-container {
            display: inline;
            float: right;
            padding: 5px;
            width: 70px;
            font-family: Inter;
            font-style: normal;
            font-weight: 500;
            font-size: 12px;

            &:not(.table) {
                margin-right: 10px;
                text-align: right;
                width: 120px;
            }

            &.table {
                padding: 2px;
            }
        }

        .arrow-container {
            position: absolute;
            right: 15px;
            top: 0;
            width: 20px;
            padding: 10px;
        }
    }
</style>

<div class="row {isTableRow ? 'table' : ''}" on:click={onClick}>
    <span class="logo-container">
        <TokenImage width="18" height="18" tokenKey={token.key} />
    </span>
    <h2 class="name-text {isTableRow ? 'blueText' : ''}">
        {token.name}
    </h2>
    <span class="balance-container {isTableRow ? 'table' : ''}">
        {formattedTokenBalance || 'N/A'}
    </span>
    <div class="arrow-container">
        <Icon name="chevron-right" size="large" />
    </div>
</div>
