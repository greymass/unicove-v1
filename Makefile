SRC_FILES := $(shell find src -type f)
REV := $(shell git rev-parse --short HEAD)
BRANCH := $(shell echo $${HEAD:-$$(git branch --show-current)})

build: $(SRC_FILES) node_modules package.json snowpack.config.js svelte.config.js tsconfig.json yarn.lock
	SNOWPACK_PUBLIC_BRANCH=$(BRANCH) SNOWPACK_PUBLIC_REV=$(REV) ./node_modules/.bin/snowpack build

node_modules:
	yarn install --non-interactive --frozen-lockfile --ignore-scripts
