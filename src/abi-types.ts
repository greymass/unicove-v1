import {Asset, Float64, Int64, Name, Struct, TimePointSec, UInt8, UInt32} from 'anchor-link'

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

@Struct.type('powerupstateresource')
export class PowerUpStateResource extends Struct {
    @Struct.field('uint8') version!: UInt8
    @Struct.field('int64') weight!: Int64
    @Struct.field('int64') weight_ratio!: Int64
    @Struct.field('int64') assumed_stake_weight!: Int64
    @Struct.field('int64') initial_weight_ratio!: Int64
    @Struct.field('int64') target_weight_ratio!: Int64
    @Struct.field('time_point_sec') initial_timestamp!: TimePointSec
    @Struct.field('time_point_sec') target_timestamp!: TimePointSec
    @Struct.field('float64') exponent!: Float64
    @Struct.field('uint32') decay_secs!: UInt32
    @Struct.field('asset') min_price!: Asset
    @Struct.field('asset') max_price!: Asset
    @Struct.field('int64') utilization!: Int64
    @Struct.field('int64') adjusted_utilization!: Int64
    @Struct.field('time_point_sec') utilization_timestamp!: TimePointSec
}

@Struct.type('powerupstate')
export class PowerUpState extends Struct {
    @Struct.field('uint8') version!: UInt8
    @Struct.field(PowerUpStateResource) net!: PowerUpStateResource
    @Struct.field(PowerUpStateResource) cpu!: PowerUpStateResource
    @Struct.field('uint32') powerup_days!: UInt32
    @Struct.field('asset') min_powerup_fee!: Asset
}
