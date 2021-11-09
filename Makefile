SRC_FILES := $(shell find src -type f)
BIN := ./node_modules/.bin

.EXPORT_ALL_VARIABLES:
REV := $(shell git rev-parse --short HEAD)
BRANCH := $(shell git branch --show-current)
VERSION := $(shell node -e "console.log(require('./package.json').version)")
DIRTY := $(shell git status --porcelain | grep -q . && echo "1" || echo "0")

build: $(SRC_FILES) node_modules package.json svelte.config.js tsconfig.json yarn.lock
	@echo "Starting build of $(VERSION) ($(BRANCH)-$(REV))"
	@if [ $$DIRTY -eq 1 ]; then echo "WARNING: Working directory is dirty, build may not be accurate"; fi
	@${BIN}/svelte-kit build || (rm -rf build && exit 1)

.PHONY: dev
dev: node_modules
	@${BIN}/svelte-kit dev

.PHONY: preview
preview: node_modules
	@${BIN}/svelte-kit preview

.PHONY: publish
publish: build
	@${BIN}/wrangler publish

.PHONY: publish-preview
publish-preview: build
	@${BIN}/wrangler preview

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