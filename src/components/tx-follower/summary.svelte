<script lang="ts">
    import type {TransactionStatus} from './utils'
    export let status: TransactionStatus

    let countdown: number
    $: countdown = (status.until_irreversible || 0) * 0.5

    const bnFormatter = new Intl.NumberFormat('en-US')
    const dateFormatter = new Intl.DateTimeFormat('en-US', {dateStyle: 'full', timeStyle: 'long'})
</script>

<style type="scss">
    section {
        margin-top: 50px;
    }
    div {
        font-size: 12px;
        display: flex;
        border-bottom: 1px solid var(--divider-grey);
        justify-content: space-between;
        align-items: center;
        padding: 1.5em 0;
        .title {
            font-weight: 700;
            white-space: nowrap;
            margin-right: 1em;
        }
        .content {
            text-align: right;
            max-width: 70%;
            font-weight: 600;
        }
        &:last-child {
            border: 0;
        }
    }
    .status .content {
        text-transform: capitalize;
    }
</style>

<section>
    <div class="status">
        <span class="title">Status</span>
        <span class="content">
            {status.status}
            {#if status.status == 'executed'}
                &nbsp; &nbsp; irreversible in ~{Math.ceil(countdown / 5) * 5 || 5}s
            {/if}
        </span>
    </div>
    {#if status.block_num}
        <div>
            <span class="title">Block Number</span>
            <span class="content">
                {bnFormatter.format(Number(status.block_num))}
            </span>
        </div>
    {/if}
    {#if status.block_time}
        <div>
            <span class="title">Block Time</span>
            <span class="content">
                {dateFormatter.format(status.block_time.toDate())}
            </span>
        </div>
    {/if}
    {#if status.info}
        <div>
            <span class="title">Resource Usage</span>
            <span class="content">
                CPU {(status.info.receipt.cpu_usage_us / 1000).toFixed(2)}ms
                <!-- -->
                &nbsp; &nbsp; NET {status.info.receipt.net_usage_words * 8} bytes
            </span>
        </div>
    {/if}
</section>
