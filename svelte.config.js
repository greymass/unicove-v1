/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import preprocess from 'svelte-preprocess'
import workersAdapter from '@sveltejs/adapter-cloudflare-workers'

// enviroment variables that will be included in the bundle
const envPrefix = 'UC_PUBLIC_'
// unprefixed env vars that will also be included in the bundle
const forwardEnv = ['REV', 'BRANCH', 'VERSION', 'DIRTY']

for (const key of forwardEnv) {
    process.env[envPrefix + key] = process.env[key]
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: preprocess(),
    compilerOptions: {
        cssHash: ({hash, css}) => `uc-${hash(css)}`,
    },
    kit: {
        adapter: workersAdapter(),
        appDir: '_uc',
        vite: {
            envPrefix,
        },
    },
}

export default config
