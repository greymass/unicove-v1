export async function loadFee() {
    const fees = await $activeSession!.client.v1.chain.get_table_rows({
        code: 'fio.fee',
        table: 'fiofees',
        scope: 'fio.fee',
        key_type: 'i64',
        index_position: 'primary',
        lower_bound: UInt64.from(5),
        upper_bound: UInt64.from(5),
        limit: 1,
    })
    txfee = Asset.fromUnits(fees.rows[0].suf_amount, $activeBlockchain.coreTokenSymbol)
}
