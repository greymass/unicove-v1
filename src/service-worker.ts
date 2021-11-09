/// <reference lib="webworker" />

import { build, files, timestamp } from '$service-worker'

import { ExpirationPlugin } from 'workbox-expiration'
import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { StaleWhileRevalidate } from 'workbox-strategies'

const revision = `r${timestamp}`

precacheAndRoute([
    // built scripts and styles (includes hash in filename)
    ...build.map((url) => ({ url, revision: null })),
    // static files
    ...files.map((url) => ({ url, revision }))
])

registerRoute(
    ({ url }) => url.pathname === '/abi.json',
    new StaleWhileRevalidate({
        cacheName: 'abi',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 100
            })
        ]
    })
)
