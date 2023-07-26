<script>
    import Icon from '~/components/elements/icon.svelte'
    import TokenImage from '~/components/elements/image/token.svelte'
    import type {Token} from '~/stores/tokens'

    import {balances} from '~/stores/balances'

    export let token: Token
    export let onClick: () => void
    export let isTableRow: boolean | undefined = undefined

    let formattedTokenBalance: string | undefined = undefined

    let balance

    $: {
        if (token.balance) {
            balance = token.balance
        } else {
            balance =
                $balances && $balances.find((balance) => balance.tokenKey === token.key)?.quantity
        }

        if (balance) {
            const tokenPrecision = balance.symbol.precision
            const unitValue = balance.units.value
            const fullTokenBalanceString = (
                Number(unitValue) / Math.pow(10, tokenPrecision)
            ).toFixed(tokenPrecision)

            if (isTableRow) {
                formattedTokenBalance = formatBalanceString(fullTokenBalanceString)
            } else {
                formattedTokenBalance = fullTokenBalanceString
            }
        }
    }

    function formatBalanceString(balanceString: string) {
        if (balanceString.length < 9) {
            return balanceString
        }

        const balanceInIntegers = balanceString.split('.')[0]

        if (balanceInIntegers.length < 8) {
            return balanceInIntegers
        }

        return `${Number(balanceInIntegers) / 1000000} M`
    }
</script>

<style type="scss">
    .row {
        padding: 10px 12px;
        border-radius: 12px;
        max-width: 400px;
        border: 1px solid var(--divider-grey);
        display: flex;
        align-items: center;
        cursor: pointer;

        &:hover {
            background-color: var(--main-grey);
        }

        &.table {
            border: none;
        }

        .logo-container {
            display: flex;
            margin-right: 15px;
        }

        .name-text {
            flex: 1;
            font-family: Inter;
            font-style: normal;
            font-weight: 500;
            font-size: 14px;
            letter-spacing: -0.04px;
            color: var(--main-black);
            display: inline;
            text-align: left;

            &.blueText {
                color: var(--lapis-lazuli);
                :global(.darkmode) & {
                    color: var(--middle-green-eagle);
                }
            }
        }

        .balance-container {
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
            display: flex;
            width: 20px;
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
