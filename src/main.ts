import App from './app.svelte'
import {init as initAuth} from './auth'
import {appReady} from './store'

async function init() {
    try {
        initAuth()
    } catch (error) {
        console.warn('Error when initializing Anchor Link', error)
    }
}

init()
    .then(() => {
        appReady.set(true)
    })
    .catch((error) => {
        console.error('Fatal error, unable to initialize app', error)
        // TODO: error display UI
    })

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
