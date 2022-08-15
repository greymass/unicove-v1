import {Action, APIClient, Name, NameType, Serializer, Transaction} from '@greymass/eosio'

export async function getProposal(
    client: APIClient,
    account: NameType,
    name: NameType
): Promise<Record<any, any>> {
    // Retrieve the proposal from eosio.msig
    const results = await client.v1.chain.get_table_rows({
        code: 'eosio.msig',
        scope: Name.from(account),
        lower_bound: Name.from(name),
        upper_bound: Name.from(name),
        table: 'proposal',
    })
    const [proposal] = results.rows
    // Decode transaction returned in table row
    const transaction = Serializer.decode({
        data: proposal.packed_transaction,
        type: Transaction,
    })
    // Get list of unique ABIs required to decode full transaction
    const abisNeeded: string[] = Array.from(
        new Set(transaction.actions.map((action) => String(action.account)))
    )
    // Create a promise for each ABI that needs to be loaded
    const promises = await abisNeeded.map(async (contract) => {
        const {abi} = await client.v1.chain.get_abi(contract)
        if (!abi) {
            throw new Error(`No ABI for ${String(contract)}`)
        }
        return {
            contract: Name.from(contract),
            abi,
        }
    })
    // Wait for all ABIs to be loaded
    const abis = await Promise.all(promises)
    // Map all transaction actions to their decoded state
    transaction.actions = transaction.actions.map((act): Action => {
        const abiDef = abis.find((abi) => abi.contract.equals(act.account))
        if (!abiDef) {
            throw new Error('ABI was not loaded, cannot decode action data.')
        }
        const action = Action.from(act, abiDef.abi)
        return Serializer.objectify(action.decodeData(abiDef.abi))
    })
    return Serializer.objectify(transaction)
}
