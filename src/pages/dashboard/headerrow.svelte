<script lang="ts">
</script>

<style type="scss">
    .container {
        display: flex;
        min-height: 60px;
        max-height: 84px;
        padding: 12px;
        > * {
            display: inline-flex;
            align-items: center;
            margin-right: 10px;
            flex: 1;
        }
        > :last-child {
            flex: 0;
        }
    }

    .price,
    .quantity,
    .token,
    .value {
        color: var(--dark-grey);
        font-family: Inter;
        font-style: normal;
        font-weight: 600;
        font-size: 10px;
        line-height: 12px;
        letter-spacing: 0.1px;
        text-transform: uppercase;
    }

    .price,
    .quantity,
    .value {
        justify-content: flex-end;
    }

    .controls {
        min-width: 90px;
        padding-left: 1em;
    }

    @media only screen and (max-width: 999px) {
        .token {
            padding-left: 32px;
        }
        .quantity {
            padding-right: 32px;
        }
    }

    @media only screen and (max-width: 600px) {
        .controls,
        .value,
        .price {
            display: none;
        }
        .token {
            padding-left: 32px;
        }
        .quantity {
            padding-right: 32px;
        }
    }
</style>

<div class="container">
    <div class="token">Token</div>
    <div class="quantity">Balance</div>
    <div class="price">Price</div>
    <div class="value">Value</div>
    <div class="controls" />
</div>
