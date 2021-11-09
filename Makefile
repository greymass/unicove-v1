SRC_FILES := $(shell find src -type f)
BIN := ./node_modules/.bin

.EXPORT_ALL_VARIABLES:
REV := $(shell git rev-parse --short HEAD)
BRANCH := $(shell git branch --show-current)

build: $(SRC_FILES) node_modules package.json snowpack.config.js svelte.config.js tsconfig.json yarn.lock
	@echo "Starting build of $(BRANCH)-$(REV)"
	@${BIN}/svelte-kit build || (rm -rf build && exit 1)

.PHONY: dev
dev: node_modules
	@${BIN}/svelte-kit dev

.PHONY: check
check: node_modules
	@${BIN}/svelte-check --tsconfig ./tsconfig.json

.PHONY: lint
lint: node_modules
	@${BIN}/prettier --ignore-path .gitignore --check --plugin-search-dir=. . && eslint --ignore-path .gitignore .

.PHONY: format
format: node_modules
	@${BIN}/prettier --ignore-path .gitignore --write --plugin-search-dir=. .

node_modules:
	yarn install --non-interactive --frozen-lockfile

.PHONY: clean
clean:
	rm -rf .svelte-kit build node_modules/.vite workers-site

.PHONY: distclean
distclean: clean
	rm -rf node_modules/