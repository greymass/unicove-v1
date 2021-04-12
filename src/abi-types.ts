import {
    Asset,
    Float64,
    Int64,
    Name,
    Struct,
    TimePoint,
    TimePointSec,
    TypeAlias,
    UInt8,
    UInt16,
    UInt32,
    UInt64,
} from 'anchor-link'

@Struct.type('buyrambytes')
export class BuyRamBytes extends Struct {
    @Struct.field(Name) payer!: Name
    @Struct.field(Name) receiver!: Name
    @Struct.field(UInt32) bytes!: UInt32
}

@Struct.type('delphioracledatapoint')
export class DelphiOracleDatapoint extends Struct {
    @Struct.field(UInt64) id!: UInt64
    @Struct.field(Name) owner!: Name
    @Struct.field(UInt64) value!: UInt64
    @Struct.field(UInt64) median!: UInt64
    @Struct.field(TimePoint) timestamp!: TimePoint
}

@TypeAlias('asset_type')
export class DelphiOracleAssetType extends UInt16 {
    // fiat=1,
    // cryptocurrency=2,
    // erc20_token=3,
    // eosio_token=4,
    // equity=5,
    // derivative=6,
    // other=7
}

@Struct.type('delphioraclepair')
export class DelphiOraclePair extends Struct {
    @Struct.field('bool') active!: boolean
    @Struct.field('bool') bounty_awarded!: boolean
    @Struct.field('bool') bounty_edited_by_custodians!: boolean
    @Struct.field(Name) proposer!: Name
    @Struct.field(Name) name!: Name
    @Struct.field(Asset) bounty_amount!: Asset
    @Struct.field(Name, {array: true}) approving_custodians!: Name[]
    @Struct.field(Name, {array: true}) approving_oracles!: Name[]
    @Struct.field(Asset.Symbol) base_symbol!: Asset.Symbol
    @Struct.field(DelphiOracleAssetType) base_type!: DelphiOracleAssetType
    @Struct.field(Name) base_contract!: Name
    @Struct.field(Asset.Symbol) quote_symbol!: Asset.Symbol
    @Struct.field(DelphiOracleAssetType) quote_type!: DelphiOracleAssetType
    @Struct.field(Name) quote_contract!: Name
    @Struct.field(UInt64) quoted_precision!: UInt64
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

@Struct.type('rexstate')
export class REXState extends Struct {
    @Struct.field('uint8') version!: UInt8
    @Struct.field('asset') total_lent!: Asset
    @Struct.field('asset') total_unlent!: Asset
    @Struct.field('asset') total_rent!: Asset
    @Struct.field('asset') total_lendable!: Asset
    @Struct.field('asset') total_rex!: Asset
    @Struct.field('asset') namebid_proceeds!: Asset
    @Struct.field('uint64') loan_num!: UInt64
}

@Struct.type('sellram')
export class Sellram extends Struct {
    @Struct.field(Name) account!: Name
    @Struct.field(Int64) bytes!: Int64
}

@Struct.type('stake')
export class Stake extends Struct {
    @Struct.field('name') from!: Name
    @Struct.field('name') receiver!: Name
    @Struct.field('asset') stake_net_quantity!: Asset
    @Struct.field('asset') stake_cpu_quantity!: Asset
    @Struct.field('bool') transfer!: boolean
}

@Struct.type('transfer')
export class Transfer extends Struct {
    @Struct.field('name') from!: Name
    @Struct.field('name') to!: Name
    @Struct.field('asset') quantity!: Asset
    @Struct.field('string') memo!: string
}
