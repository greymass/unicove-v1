const currentBranch = process.env['SNOWPACK_PUBLIC_BRANCH']
const isProductionBuild = currentBranch === 'dev' || currentBranch === 'deploy'
if (!process.env['NODE_ENV']) {
    process.env['NODE_ENV'] = isProductionBuild ? 'production' : 'development'
}

/** @type { import("snowpack").SnowpackUserConfig } */
module.exports = {
    mount: {
        public: {url: '/', static: true},
        src: {url: '/dist'},
    },
    alias: {
        '~/': './src',
        '@/': './public',
    },
    routes: [{match: 'routes', src: '.*', dest: '/index.html'}],
    buildOptions: {
        sourcemap: !isProductionBuild,
    },
    plugins: [
        [
            '@snowpack/plugin-webpack',
            {
                sourceMap: !isProductionBuild,
                htmlMinifierOptions: isProductionBuild ? undefined : false,
            },
        ],
        '@snowpack/plugin-svelte',
        '@snowpack/plugin-typescript',
    ],
    packageOptions: {
        packageLookupFields: ['svelte'],
        packageExportLookupFields: ['svelte'],
    },
}
