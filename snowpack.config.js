/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
    mount: {
        public: {url: '/', static: true},
        src: {url: '/dist'},
    },
    plugins: ['@snowpack/plugin-webpack', '@snowpack/plugin-svelte', '@snowpack/plugin-typescript'],
    installOptions: {
        packageLookupFields: ['svelte'],
    }
}
