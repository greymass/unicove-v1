SRC_FILES := $(shell find src -type f)
REV := $(shell git rev-parse --short HEAD)
BRANCH := $(shell echo $${HEAD:-$$(git branch --show-current)})

build: $(SRC_FILES) node_modules package.json snowpack.config.js svelte.config.js tsconfig.json yarn.lock
	SNOWPACK_PUBLIC_BRANCH=$(BRANCH) SNOWPACK_PUBLIC_REV=$(REV) ./node_modules/.bin/snowpack build

.PHONY: check
check: node_modules
	@./node_modules/.bin/svelte-check
	@./node_modules/.bin/prettier -c src
	@./node_modules/.bin/eslint --max-warnings 0 src

.PHONY: format
format: node_modules
	@./node_modules/.bin/prettier -w src

node_modules:
	yarn install --non-interactive --frozen-lockfile --ignore-scripts
