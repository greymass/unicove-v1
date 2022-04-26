const pkg = require('./package.json')
process.env['VERSION'] = pkg.version

if (!process.env['BRANCH']) {
    process.env['BRANCH'] = 'HEAD'
}
const isProductionBuild = process.env['BRANCH'] === 'dev' || process.env['BRANCH'] === 'deploy'
if (!process.env['NODE_ENV']) {
    process.env['NODE_ENV'] = isProductionBuild ? 'production' : 'development'
}

// env vars to forward to snowpack (included in js bundle)
const forwardEnv = ['BRANCH', 'REV', 'VERSION']
for (const key of forwardEnv) {
    process.env[`SNOWPACK_PUBLIC_${key}`] = process.env[key]
}

process.env['SNOWPACK_PUBLIC_WHALESPLAINER_URL'] = process.env['WHALESPLAINER_URL'] || 'https://create.anchor.link';

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
