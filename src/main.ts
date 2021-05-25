import App from './app.svelte'
import {init as initAuth} from './auth'
import {Preferences} from './preferences'
import {appReady} from './store'

// app initialization we show a full-screen loading spinner until this resolves
async function init() {
    try {
        await Promise.all([initAuth(), Preferences.shared.initStorage()])
    } catch (error) {
        console.warn('Error when initializing Anchor Link', error)
    }
}

// start initializing app
init()
    .then(() => {
        appReady.set(true)
    })
    .catch((error) => {
        console.error('Fatal error, unable to initialize app', error)
        // TODO: error display UI
    })

// remove loading placeholder before we render the app
document.body.querySelector('main')?.remove()

// render app
const app = new App({
    target: document.body,
})

export default app

if (import.meta.hot) {
    import.meta.hot.accept()
    import.meta.hot.dispose(() => {
        app.$destroy()
    })
}
