SRC_FILES := $(shell find src -type f)
BIN := ./node_modules/.bin

.EXPORT_ALL_VARIABLES:
REV := $(shell git rev-parse --short HEAD)
BRANCH := $(shell git branch --show-current)

build: $(SRC_FILES) node_modules package.json vite.config.js svelte.config.js tsconfig.json yarn.lock
	@echo "Starting build of $(BRANCH)-$(REV)"
	@${BIN}/vite build || (rm -rf build && exit 1)

.PHONY: dev
dev: node_modules
	@${BIN}/vite dev

.PHONY: serve
serve: build
	@node server.js

.PHONY: check
check: node_modules
	@${BIN}/svelte-check
	@${BIN}/prettier -c src
	@${BIN}/eslint --max-warnings 0 src

.PHONY: format
format: node_modules
	@${BIN}/prettier -w src

node_modules:
	yarn install --non-interactive --frozen-lockfile

.PHONY: clean
clean:
	rm -rf build/

.PHONY: distclean
distclean: clean
	rm -rf node_modules/