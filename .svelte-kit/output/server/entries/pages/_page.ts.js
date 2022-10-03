import { o as appReady, q as init$1, P as Preferences } from "../../chunks/auth.js";
const ssr = false;
async function init() {
  try {
    await Promise.all([init$1(), Preferences.shared.initStorage()]);
  } catch (error) {
    console.warn("Error when initializing Anchor Link", error);
  }
}
const load = async () => {
  init().then(() => {
    appReady.set(true);
  }).catch((error) => {
    console.error("Fatal error, unable to initialize app", error);
  });
  return {};
};
export {
  load,
  ssr
};
