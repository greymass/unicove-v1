SRC_FILES := $(shell find src -type f)
BIN := ./node_modules/.bin
REV := $(shell git rev-parse --short HEAD)
BRANCH := $(shell echo $${HEAD:-$$(git branch --show-current)})

build: $(SRC_FILES) node_modules package.json snowpack.config.js svelte.config.js tsconfig.json yarn.lock
	@echo "Starting build of $(BRANCH)-$(REV)"
	@SNOWPACK_PUBLIC_BRANCH=$(BRANCH) SNOWPACK_PUBLIC_REV=$(REV) ${BIN}/snowpack build || (rm -rf build && exit 1)

.PHONY: dev
dev: node_modules
	@${BIN}/snowpack dev

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