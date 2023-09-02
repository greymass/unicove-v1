const currencyFormatter = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'})
export function fiatFormat(value: number) {
    return currencyFormatter.format(value)
}

export function valueInFiat(value: number, price: number) {
    return fiatFormat(value * price)
}