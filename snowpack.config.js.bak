const pkg = require('./package.json')
process.env['VERSION'] = pkg.version

if (!process.env['BRANCH']) {
    process.env['BRANCH'] = 'HEAD'
}
const isProductionBuild = process.env['BRANCH'] === 'dev' || process.env['BRANCH'] === 'deploy'
if (!process.env['NODE_ENV']) {
    process.env['NODE_ENV'] = isProductionBuild ? 'production' : 'development'
}

const defaultValues = {
    WHALESPLAINER_URL: 'https://create.anchor.link',
}
// env vars to forward to snowpack (included in js bundle)
const forwardEnv = ['BRANCH', 'REV', 'VERSION', 'WHALESPLAINER_URL']
for (const key of forwardEnv) {
    process.env[`SNOWPACK_PUBLIC_${key}`] = process.env[key] || defaultValues[key]
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
