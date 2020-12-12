import type {LinkSession} from 'anchor-link'
import {writable} from 'svelte/store'
import type {SessionLike} from './auth'

/** Set to true when app initialization completes. */
export const appReady = writable<boolean>(false)

/** Active anchor link session, aka logged in user. */
export const activeSession = writable<LinkSession | null>(null)

/** List of all available anchor link sessions. */
export const availableSessions = writable<SessionLike[]>([])
