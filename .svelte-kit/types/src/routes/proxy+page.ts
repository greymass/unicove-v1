// @ts-nocheck
import type { PageLoad } from './$types';


import App from '../App.svelte'
import {init as initAuth} from '~/auth'
import {Preferences} from '~/preferences'
import {appReady} from '~/store'
export const prerender = false


// app initialization we show a full-screen loading spinner until this resolves
async function init() {
    try {
        await Promise.all([initAuth(), Preferences.shared.initStorage()])
    } catch (error) {
        console.warn('Error when initializing Anchor Link', error)
    }
}



// remove loading placeholder before we render the app
// document.body.querySelector('main')?.remove()

// render app
// const app = new App({
//     target: document.body,
// })

// export default app

// if (import.meta.hot) {
//     import.meta.hot.accept()
//     import.meta.hot.dispose(() => {
//         app.$destroy()
//     })
// }


export const load = async () => {
    // start initializing app
    init()
    .then(() => {
        appReady.set(true)
    })
    .catch((error) => {
        console.error('Fatal error, unable to initialize app', error)
        // TODO: error display UI
    })
    return {};
};;null as any as PageLoad;