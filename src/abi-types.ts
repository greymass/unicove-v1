import {Asset, Name, Struct} from 'anchor-link'

@Struct.type('transfer')
export class Transfer extends Struct {
    @Struct.field('name') from!: Name
    @Struct.field('name') to!: Name
    @Struct.field('asset') quantity!: Asset
    @Struct.field('string') memo!: string
}

@Struct.type('rexdeposit')
export class REXDeposit extends Struct {
    @Struct.field('name') owner!: Name
    @Struct.field('asset') amount!: Asset
}

@Struct.type('rexrentcpu')
export class REXRentCPU extends Struct {
    @Struct.field('name') from!: Name
    @Struct.field('name') receiver!: Name
    @Struct.field('asset') loan_payment!: Asset
    @Struct.field('asset') loan_fund!: Asset
}

@Struct.type('rexrentnet')
export class REXRentNET extends Struct {
    @Struct.field('name') from!: Name
    @Struct.field('name') receiver!: Name
    @Struct.field('asset') loan_payment!: Asset
    @Struct.field('asset') loan_fund!: Asset
}
