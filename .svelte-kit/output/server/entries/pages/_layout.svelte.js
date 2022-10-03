import { c as create_ssr_component } from "../../chunks/index.js";
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<main><noscript><p>Unicove requires JavaScript to run, please add an exception for this domain if you wish
            to use it.
        </p></noscript>
    ${slots.default ? slots.default({}) : ``}</main>`;
});
export {
  Layout as default
};
