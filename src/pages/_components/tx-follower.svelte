<script>
    import {getClient} from '~/api-client'

    import TxFollower from '~/components/tx-follower/index.svelte'
    import {chains} from '~/config'

    let selectedChain = chains[0].id
    $: chain = chains.find(({id}) => selectedChain === id)!
    $: client = getClient(chain)

    let id = 'a35a56175791292b51d8a8dbdf271d01aba76893dc55d06eaff73f36ef569d79'

    async function getUnconfirmed() {
        const info = await client.v1.chain.get_info()
        const headBlock = await client.v1.chain.get_block(info.head_block_num)
        const txns = headBlock.transactions
        const tx = txns[Math.floor(Math.random() * txns.length)]
        id = String(tx.id)
    }
</script>

<style>
    input {
        font-family: monospace;
        width: 64ch;
    }
</style>

<select name="chain" bind:value={selectedChain}>
    {#each chains as c}
        <option value={c.id}>{c.name}</option>
    {/each}
</select>
txid <input bind:value={id} />
<button on:click={getUnconfirmed}>🔁</button> <br />
<br />

<TxFollower {id} {chain} />
