const env = import.meta.env as Record<string, string>

const branch = env.UC_PUBLIC_BRANCH || 'local'
const ver = env.UC_PUBLIC_VERSION || '0.0.0'
const dirty = env.UC_PUBLIC_DIRTY || '0'

let rev = env.UC_PUBLIC_REV || 'HEAD'
if (dirty === '1') {
    rev = `${rev}*`
}

/** Only true in a production build. */
export const isRelease = branch === 'deploy'

/** App identifier, used for anchor link (session persistence). */
export const appId = !isRelease
    ? `w.${branch
          .replace(/[^1-5a-z]+/gi, '')
          .toLowerCase()
          .slice(0, 7)}.gm`
    : 'wallet.gm'

/** App version taken in the format 1.2.3 (git-shortrev), for staging and local builds it also includes the branch name. */
export const version = isRelease ? `${ver} (${rev})` : `${ver} (${branch}-${rev})`
