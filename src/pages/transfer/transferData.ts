import {writable} from 'svelte/store'

import type {TransferData} from './types'
import {Step} from './types'

export const transferData = writable<TransferData>({step: Step.Recipient})
transferData
