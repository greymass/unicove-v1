
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), this module cannot be imported into public-facing code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```bash
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const GNOME_SHELL_SESSION_MODE: string;
	export const SSH_AGENT_LAUNCHER: string;
	export const FNM_DIR: string;
	export const PNPM_HOME: string;
	export const LC_NAME: string;
	export const LC_NUMERIC: string;
	export const WINDOWPATH: string;
	export const NVM_DIR: string;
	export const LC_ADDRESS: string;
	export const LIBVIRT_DEFAULT_URI: string;
	export const QT_ACCESSIBILITY: string;
	export const REV: string;
	export const PWD: string;
	export const XDG_DATA_DIRS: string;
	export const OLDPWD: string;
	export const NVM_INC: string;
	export const CONDA_PROMPT_MODIFIER: string;
	export const FNM_VERSION_FILE_STRATEGY: string;
	export const LANG: string;
	export const XAUTHORITY: string;
	export const FNM_NODE_DIST_MIRROR: string;
	export const GNOME_TERMINAL_SERVICE: string;
	export const MAKEFLAGS: string;
	export const FNM_LOGLEVEL: string;
	export const CURDIR: string;
	export const LESSOPEN: string;
	export const FNM_ARCH: string;
	export const MFLAGS: string;
	export const SSH_AUTH_SOCK: string;
	export const NVM_BIN: string;
	export const XDG_CONFIG_DIRS: string;
	export const XDG_SESSION_DESKTOP: string;
	export const MAKEFILE_LIST: string;
	export const CONDA_SHLVL: string;
	export const BRANCH: string;
	export const XDG_SESSION_TYPE: string;
	export const CONDA_PYTHON_EXE: string;
	export const SESSION_MANAGER: string;
	export const DBUS_SESSION_BUS_ADDRESS: string;
	export const GNOME_DESKTOP_SESSION_ID: string;
	export const CONDA_PREFIX: string;
	export const SHELL: string;
	export const XMODIFIERS: string;
	export const SHLVL: string;
	export const GNOME_TERMINAL_SCREEN: string;
	export const PATH: string;
	export const LANGUAGE: string;
	export const LC_MONETARY: string;
	export const LC_TIME: string;
	export const FNM_MULTISHELL_PATH: string;
	export const USERNAME: string;
	export const LESSCLOSE: string;
	export const LC_TELEPHONE: string;
	export const GTK_IM_MODULE: string;
	export const XDG_CURRENT_DESKTOP: string;
	export const LS_COLORS: string;
	export const DESKTOP_SESSION: string;
	export const GNUMAKEFLAGS: string;
	export const CONDA_DEFAULT_ENV: string;
	export const LOGNAME: string;
	export const SYSTEMD_EXEC_PID: string;
	export const EDITOR: string;
	export const DISPLAY: string;
	export const GTK_MODULES: string;
	export const USER: string;
	export const SRC_FILES: string;
	export const LC_MEASUREMENT: string;
	export const _: string;
	export const LC_PAPER: string;
	export const MAKE_TERMOUT: string;
	export const BIN: string;
	export const XDG_RUNTIME_DIR: string;
	export const GPG_AGENT_INFO: string;
	export const COLORTERM: string;
	export const _CE_M: string;
	export const NVM_CD_FLAGS: string;
	export const VISUAL: string;
	export const MAKE_TERMERR: string;
	export const XDG_SESSION_CLASS: string;
	export const HOME: string;
	export const QT_IM_MODULE: string;
	export const TERM: string;
	export const PAPERSIZE: string;
	export const VTE_VERSION: string;
	export const XDG_MENU_PREFIX: string;
	export const CONDA_EXE: string;
	export const _CE_CONDA: string;
	export const GDMSESSION: string;
	export const LC_IDENTIFICATION: string;
	export const MAKELEVEL: string;
}

/**
 * Similar to [`$env/static/private`](https://kit.svelte.dev/docs/modules#$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {

}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/master/packages/adapter-node) (or running [`vite preview`](https://kit.svelte.dev/docs/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env).
 * 
 * This module cannot be imported into public-facing code.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		GNOME_SHELL_SESSION_MODE: string;
		SSH_AGENT_LAUNCHER: string;
		FNM_DIR: string;
		PNPM_HOME: string;
		LC_NAME: string;
		LC_NUMERIC: string;
		WINDOWPATH: string;
		NVM_DIR: string;
		LC_ADDRESS: string;
		LIBVIRT_DEFAULT_URI: string;
		QT_ACCESSIBILITY: string;
		REV: string;
		PWD: string;
		XDG_DATA_DIRS: string;
		OLDPWD: string;
		NVM_INC: string;
		CONDA_PROMPT_MODIFIER: string;
		FNM_VERSION_FILE_STRATEGY: string;
		LANG: string;
		XAUTHORITY: string;
		FNM_NODE_DIST_MIRROR: string;
		GNOME_TERMINAL_SERVICE: string;
		MAKEFLAGS: string;
		FNM_LOGLEVEL: string;
		CURDIR: string;
		LESSOPEN: string;
		FNM_ARCH: string;
		MFLAGS: string;
		SSH_AUTH_SOCK: string;
		NVM_BIN: string;
		XDG_CONFIG_DIRS: string;
		XDG_SESSION_DESKTOP: string;
		MAKEFILE_LIST: string;
		CONDA_SHLVL: string;
		BRANCH: string;
		XDG_SESSION_TYPE: string;
		CONDA_PYTHON_EXE: string;
		SESSION_MANAGER: string;
		DBUS_SESSION_BUS_ADDRESS: string;
		GNOME_DESKTOP_SESSION_ID: string;
		CONDA_PREFIX: string;
		SHELL: string;
		XMODIFIERS: string;
		SHLVL: string;
		GNOME_TERMINAL_SCREEN: string;
		PATH: string;
		LANGUAGE: string;
		LC_MONETARY: string;
		LC_TIME: string;
		FNM_MULTISHELL_PATH: string;
		USERNAME: string;
		LESSCLOSE: string;
		LC_TELEPHONE: string;
		GTK_IM_MODULE: string;
		XDG_CURRENT_DESKTOP: string;
		LS_COLORS: string;
		DESKTOP_SESSION: string;
		GNUMAKEFLAGS: string;
		CONDA_DEFAULT_ENV: string;
		LOGNAME: string;
		SYSTEMD_EXEC_PID: string;
		EDITOR: string;
		DISPLAY: string;
		GTK_MODULES: string;
		USER: string;
		SRC_FILES: string;
		LC_MEASUREMENT: string;
		_: string;
		LC_PAPER: string;
		MAKE_TERMOUT: string;
		BIN: string;
		XDG_RUNTIME_DIR: string;
		GPG_AGENT_INFO: string;
		COLORTERM: string;
		_CE_M: string;
		NVM_CD_FLAGS: string;
		VISUAL: string;
		MAKE_TERMERR: string;
		XDG_SESSION_CLASS: string;
		HOME: string;
		QT_IM_MODULE: string;
		TERM: string;
		PAPERSIZE: string;
		VTE_VERSION: string;
		XDG_MENU_PREFIX: string;
		CONDA_EXE: string;
		_CE_CONDA: string;
		GDMSESSION: string;
		LC_IDENTIFICATION: string;
		MAKELEVEL: string;
		[key: string]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: string]: string | undefined;
	}
}
