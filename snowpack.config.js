/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
    mount: {
        public: {url: '/', static: true},
        src: {url: '/dist'},
    },
    alias: {
        '~/': './src',
        '@/': './public',
    },
    routes: [
        {match: 'routes', src: '.*', dest: '/index.html'}
    ],
    plugins: ['@snowpack/plugin-webpack', '@snowpack/plugin-svelte', '@snowpack/plugin-typescript'],
    packageOptions: {
        packageLookupFields: ['svelte'],
    },
}
