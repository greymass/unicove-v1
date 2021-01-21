import {Asset, Int64, Name, Struct, UInt32} from 'anchor-link'

@Struct.type('transfer')
export class Transfer extends Struct {
    @Struct.field('name') from!: Name
    @Struct.field('name') to!: Name
    @Struct.field('asset') quantity!: Asset
    @Struct.field('string') memo!: string
}

@Struct.type('fiotransfer')
export class FIOTransfer extends Struct {
    @Struct.field('string') payee_public_key!: string
    @Struct.field('int64') amount!: Int64
    @Struct.field('int64') max_fee!: Int64
    @Struct.field('name') actor!: Name
    @Struct.field('string') tpid!: string
}

@Struct.type('powerup')
export class PowerUp extends Struct {
    @Struct.field('name') payer!: Name
    @Struct.field('name') receiver!: Name
    @Struct.field('uint32') days!: UInt32
    @Struct.field('int64') net_frac!: Int64
    @Struct.field('int64') cpu_frac!: Int64
    @Struct.field('asset') max_payment!: Asset
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

@Struct.type('stake')
export class Stake extends Struct {
    @Struct.field('name') from!: Name
    @Struct.field('name') receiver!: Name
    @Struct.field('asset') stake_net_quantity!: Asset
    @Struct.field('asset') stake_cpu_quantity!: Asset
    @Struct.field('bool') transfer!: boolean
}
