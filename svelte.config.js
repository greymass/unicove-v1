import preprocess from 'svelte-preprocess'
import adapter from '@sveltejs/adapter-auto'

/** @type {import('@sveltejs/kit').Config} */

const config = {
    preprocess: preprocess({
        defaults: {
            script: 'typescript',
        },
        scss: {
            // prependData: `@import './src/style/global.scss';`,
        },
    }),
    kit: {
        adapter: adapter(),
        alias: {
            '~': 'src/',
        },
    },
}

export default config
