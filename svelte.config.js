/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import preprocess from 'svelte-preprocess'
import workersAdapter from '@sveltejs/adapter-cloudflare-workers'

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: preprocess(),
    compilerOptions: {
        cssHash: ({hash, css}) => `uc-${hash(css)}`,
    },
    kit: {
        adapter: workersAdapter(),
        appDir: '_uc',
    },
}

export default config
