import preprocess from 'svelte-preprocess'
import adapter from '@sveltejs/adapter-auto'

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: preprocess({
        defaults: {
            script: 'typescript',
        },
    }),
    kit: {
        adapter: adapter(),
    },
}

export default config
