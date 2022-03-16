<script lang="ts">
    import type {Checksum256Type} from 'anchor-link'
    import {
        activeBlockchain,
        // activeSession
    } from '~/store'
    import {ChainFeatures} from '~/config'

    import Progress from '~/components/elements/progress.svelte'

    const {Fuel} = ChainFeatures

    interface ResourceProviderQuota {
        /** The name of the quota, as defined by the resource provider */
        name: string
        /** CPU resource availability, mimicking EOSIO, specified in microseconds*/
        cpu: {
            available: number
            max: number
            used: number
        }
        /** NET resource availability, mimicking EOSIO, specified in bytes */
        net: {
            available: number
            max: number
            used: number
        }
    }

    interface ResourceProviderUsage {
        /** Optional: The cost of the transaction */
        cost?: {
            /** Optional: The amount of cost associated to this transaction */
            amount?: string
            /** The source of how this cost was paid */
            source: string
        }
        /** The datatime the transaction took place */
        datetime: string
        /** Optional: The name of the quota that was utilized for this transaction */
        quota?: string
        /** Usage  */
        usage: {
            /** The estimated usage for the transaction */
            estimated: ResourceProviderUsageInstance
            /** Optional: The actual usage for the transaction, not set if actual usage has not been determined */
            actual?: ResourceProviderUsageInstance
        }
        /** The transaction ID of the transaction */
        transaction_id: Checksum256Type
    }

    interface ResourceProviderUsageInstance {
        /** Microseconds of CPU */
        cpu: number
        /** Bytes of NET */
        net: number
    }

    let usage: ResourceProviderUsage[] = []
    let quotas: ResourceProviderQuota[] = []

    async function loadUsage() {
        // const response = await $activeSession.client.provider.fetch(
        //     'http://eos.greymass.com/v1/resource_provider/get_account_usage',
        //     {
        //         method: 'POST',
        //         body: JSON.stringify({account: 'teamgreymass'}),
        //     }
        // )
        // usage = await response.json()
        usage = [
            {
                datetime: '2019-12-10T20:54:16.656Z',
                quota: 'free',
                usage: {
                    estimated: {
                        cpu: 50,
                        net: 100,
                    },
                },
                transaction_id: '7fa882e22f99d8f0c0f9c8b06a46792d6c3c29d8da671ebc2a627adcc7ea941c',
            },
            {
                datetime: '2019-12-07T10:14:18.616Z',
                cost: {
                    amount: '0.0023 EOS',
                    source: 'fee',
                },
                usage: {
                    actual: {
                        cpu: 90,
                        net: 200,
                    },
                    estimated: {
                        cpu: 70,
                        net: 100,
                    },
                },
                transaction_id: '7fa882e22f99d8f0c0f9c8b06a46792d6c3c29d8da671ebc2a627adcc7ea941c',
            },
            {
                datetime: '2019-12-09T20:54:16.656Z',
                quota: 'free',
                usage: {
                    actual: {
                        cpu: 60,
                        net: 100,
                    },
                    estimated: {
                        cpu: 50,
                        net: 100,
                    },
                },
                transaction_id: '7fa882e22f99d8f0c0f9c8b06a46792d6c3c29d8da671ebc2a627adcc7ea941c',
            },
            {
                datetime: '2019-12-07T10:14:18.616Z',
                cost: {
                    source: 'balance',
                },
                quota: 'prepaid',
                usage: {
                    actual: {
                        cpu: 90,
                        net: 200,
                    },
                    estimated: {
                        cpu: 70,
                        net: 100,
                    },
                },
                transaction_id: '7fa882e22f99d8f0c0f9c8b06a46792d6c3c29d8da671ebc2a627adcc7ea941c',
            },
        ]
    }

    async function loadQuotas() {
        // const response = await $activeSession.client.provider.fetch(
        //     'http://eos.greymass.com/v1/resource_provider/get_account_quota',
        //     {
        //         method: 'POST',
        //         body: JSON.stringify({account: 'teamgreymass'}),
        //     }
        // )
        // quota = await response.json()
        quotas = [
            {
                name: 'free',
                cpu: {
                    available: 3000,
                    max: 5000,
                    used: 2000,
                },
                net: {
                    available: 4400,
                    max: 5000,
                    used: 600,
                },
            },
            {
                name: 'prepaid',
                cpu: {
                    available: 43000,
                    max: 50000,
                    used: 7000,
                },
                net: {
                    available: 44000,
                    max: 50000,
                    used: 6000,
                },
            },
        ]
    }

    // load account based on active session
    $: loading = Promise.all([loadQuotas(), loadUsage()])
</script>

<style type="scss">
    .quota {
        margin: 32px 0;
        .name {
            line-height: 24px;
            font-size: 16px;
            font-weight: bold;
        }
    }
    .usage {
        .title {
            line-height: 24px;
            font-size: 16px;
            font-weight: bold;
        }
        table {
            border: 1px solid black;
            width: 100%;
            td,
            th {
                border: 1px solid black;
                padding: 10px;
            }
            th {
                font-weight: bold;
            }
        }
    }
</style>

{#await loading}
    <p>Hang on, fetching balances and stuff...</p>
{:then _}
    {#if $activeBlockchain?.chainFeatures.has(Fuel)}
        {#each quotas as quota}
            <div class="quota">
                <p class="name">
                    {quota.name}
                </p>
                <Progress percent={(quota.cpu.available / quota.cpu.max) * 100} />
                {(quota.cpu.available / quota.cpu.max) * 100}% available ({quota.cpu.used}μs of {quota
                    .cpu.max}μs used)
            </div>
        {/each}
        <div class="usage">
            <div class="title">Usage History</div>
            <table>
                <thead>
                    <tr>
                        <th colspan="4" />
                        <th colspan="2">Usage</th>
                    </tr>
                    <tr>
                        <th>Status</th>
                        <th>Date/Time</th>
                        <th>Type</th>
                        <th>Cost</th>
                        <th>CPU</th>
                        <th>NET</th>
                    </tr>
                </thead>
                <tbody>
                    {#each usage as transaction}
                        <tr>
                            <td>
                                <a
                                    href={`https://bloks.io/transaction/${transaction.transaction_id}`}
                                >
                                    {transaction.usage.actual ? 'Completed' : 'Pending'}
                                </a>
                            </td>
                            <td>{transaction.datetime}</td>
                            <td>
                                {#if transaction.cost && transaction.cost.source === 'fee'}
                                    Transaction Fee
                                {:else if transaction.cost && transaction.cost.source === 'balance'}
                                    Prepaid
                                {:else}
                                    Free Transaction
                                {/if}
                            </td>
                            <td>
                                {transaction.cost && transaction.cost.source === 'fee'
                                    ? transaction.cost.amount
                                    : '-'}
                            </td>
                            <td>
                                {transaction.usage.actual
                                    ? `${transaction.usage.actual.cpu}μs CPU`
                                    : `${transaction.usage.estimated.cpu}μs CPU`}
                            </td>
                            <td>
                                {transaction.usage.actual
                                    ? `${transaction.usage.actual.net} NET`
                                    : `${transaction.usage.estimated.net} NET`}
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {:else}
        <p>This feature is unavailable on this blockchain.</p>
    {/if}
{/await}
