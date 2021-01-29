async function transfer(activeBlockchain: Object) {
    // TODO: status display && error handling
    let data
    switch (activeBlockchain.id) {
        case 'fio': {
            await loadFee()
            data = FIOTransfer.from({
                payee_public_key: toAddress,
                amount: quantity.units,
                max_fee: txfee.units,
                actor: $activeSession!.auth.actor,
                tpid: 'tpid@greymass',
            })
            break
        }
        default: {
            data = Transfer.from({
                from: $activeSession!.auth.actor,
                to: toAccount,
                quantity,
                memo,
            })
            break
        }
    }
    await $activeSession!.transact({
        action: {
            authorization: [$activeSession!.auth],
            account: $activeBlockchain.coreTokenContract,
            name: $activeBlockchain.coreTokenTransfer,
            data,
        },
    })
    // adjust balance to reflect transfer
    switch ($activeBlockchain.id) {
        case 'fio': {
            balance.units = UInt64.from(
                balance.units.toNumber() -
                Asset.from(quantity).units.toNumber() -
                Asset.from(txfee).units.toNumber()
            )
            break
        }
        default: {
            balance.units = UInt64.from(
                balance.units.toNumber() - Asset.from(quantity).units.toNumber()
            )
            break
        }
    }
}
