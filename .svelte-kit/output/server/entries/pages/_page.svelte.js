import { g as getContext, h as hasContext, t as tick, s as setContext, c as create_ssr_component, e as escape, d as null_to_empty, a as subscribe, f as createEventDispatcher, j as add_attribute, v as validate_component, k as each, l as add_classes, o as compute_slots, p as spread, q as escape_object, u as onDestroy, w as get_store_value, n as noop, m as missing_component, x as set_store_value, y as assign, z as now, A as loop, B as identity, C as is_promise } from "../../chunks/index.js";
import { w as writable, d as derived, r as readable } from "../../chunks/index2.js";
import { a as availableSessions, b as activeSession, c as chains, d as chainConfig, s as sessionEquals, e as activate, f as darkMode, p as preferences, i as isRelease, r as releaseVersion, v as version, g as resourceFeatures, h as activeBlockchain, B as BalanceProviders, j as activePriceTicker, k as currentAccount, C as ChainFeatures, l as getClient, D as DelegatedBandwidth, m as priceTicker, n as readable$1, u as updateAccount, T as Transfer$1, F as FIOTransfer, o as appReady } from "../../chunks/auth.js";
import { ChainId, Asset as Asset$1, PermissionLevel, UInt64, PublicKey as PublicKey$1, Name } from "anchor-link";
import lottie from "lottie-web";
import { Asset as Asset$2, Struct, Checksum256, UInt32, BlockTimestamp } from "@greymass/eosio";
import { Resources as Resources$1 } from "@greymass/eosio-resources";
import { SigningRequest } from "eosio-signing-request";
import zlib from "pako";
function p(e, a = false) {
  return e = e.slice(e.startsWith("/#") ? 2 : 0, e.endsWith("/*") ? -2 : void 0), e.startsWith("/") || (e = "/" + e), e === "/" && (e = ""), a && !e.endsWith("/") && (e += "/"), e;
}
function d(e, a) {
  e = p(e, true), a = p(a, true);
  let r = [], n = {}, t = true, s = e.split("/").map((o) => o.startsWith(":") ? (r.push(o.slice(1)), "([^\\/]+)") : o).join("\\/"), c = a.match(new RegExp(`^${s}$`));
  return c || (t = false, c = a.match(new RegExp(`^${s}`))), c ? (r.forEach((o, h) => n[o] = c[h + 1]), { exact: t, params: n, part: c[0].slice(0, -1) }) : null;
}
function x(e, a, r) {
  if (r === "")
    return e;
  if (r[0] === "/")
    return r;
  let n = (c) => c.split("/").filter((o) => o !== ""), t = n(e), s = a ? n(a) : [];
  return "/" + s.map((c, o) => t[o]).join("/") + "/" + r;
}
function m(e, a, r, n) {
  let t = [a, "data-" + a].reduce((s, c) => {
    let o = e.getAttribute(c);
    return r && e.removeAttribute(c), o === null ? s : o;
  }, false);
  return !n && t === "" ? true : t || n || false;
}
function S(e) {
  let a = e.split("&").map((r) => r.split("=")).reduce((r, n) => {
    let t = n[0];
    if (!t)
      return r;
    let s = n.length > 1 ? n[n.length - 1] : true;
    return typeof s == "string" && s.includes(",") && (s = s.split(",")), r[t] === void 0 ? r[t] = [s] : r[t].push(s), r;
  }, {});
  return Object.entries(a).reduce((r, n) => (r[n[0]] = n[1].length > 1 ? n[1] : n[1][0], r), {});
}
function M(e) {
  return Object.entries(e).map(([a, r]) => r ? r === true ? a : `${a}=${Array.isArray(r) ? r.join(",") : r}` : null).filter((a) => a).join("&");
}
function w(e, a) {
  return e ? a + e : "";
}
function k(e) {
  throw new Error("[Tinro] " + e);
}
var i = { HISTORY: 1, HASH: 2, MEMORY: 3, OFF: 4, run(e, a, r, n) {
  return e === this.HISTORY ? a && a() : e === this.HASH ? r && r() : n && n();
}, getDefault() {
  return !window || window.location.pathname === "srcdoc" ? this.MEMORY : this.HISTORY;
} };
var y, $, H, b = "", l = E();
function E() {
  let e = i.getDefault(), a, r = (c) => window.onhashchange = window.onpopstate = y = null, n = (c) => a && a(R(e)), t = (c) => {
    c && (e = c), r(), e !== i.OFF && i.run(e, (o) => window.onpopstate = n, (o) => window.onhashchange = n) && n();
  }, s = (c) => {
    let o = Object.assign(R(e), c);
    return o.path + w(M(o.query), "?") + w(o.hash, "#");
  };
  return { mode: t, get: (c) => R(e), go(c, o) {
    _(e, c, o), n();
  }, start(c) {
    a = c, t();
  }, stop() {
    a = null, t(i.OFF);
  }, set(c) {
    this.go(s(c), !c.path);
  }, methods() {
    return j(this);
  }, base: (c) => b = c };
}
function _(e, a, r) {
  !r && ($ = H);
  let n = (t) => history[`${r ? "replace" : "push"}State`]({}, "", t);
  i.run(e, (t) => n(b + a), (t) => n(`#${a}`), (t) => y = a);
}
function R(e) {
  let a = window.location, r = i.run(e, (t) => (b ? a.pathname.replace(b, "") : a.pathname) + a.search + a.hash, (t) => String(a.hash.slice(1) || "/"), (t) => y || "/"), n = r.match(/^([^?#]+)(?:\?([^#]+))?(?:\#(.+))?$/);
  return H = r, { url: r, from: $, path: n[1] || "", query: S(n[2] || ""), hash: n[3] || "" };
}
function j(e) {
  let a = () => e.get().query, r = (c) => e.set({ query: c }), n = (c) => r(c(a())), t = () => e.get().hash, s = (c) => e.set({ hash: c });
  return { hash: { get: t, set: s, clear: () => s("") }, query: { replace: r, clear: () => r(""), get(c) {
    return c ? a()[c] : a();
  }, set(c, o) {
    n((h) => (h[c] = o, h));
  }, delete(c) {
    n((o) => (o[c] && delete o[c], o));
  } } };
}
var f = T();
function T() {
  let { subscribe: e } = writable(l.get(), (a) => {
    l.start(a);
    let r = P(l.go);
    return () => {
      l.stop(), r();
    };
  });
  return { subscribe: e, goto: l.go, params: Q, meta: O, useHashNavigation: (a) => l.mode(a ? i.HASH : i.HISTORY), mode: { hash: () => l.mode(i.HASH), history: () => l.mode(i.HISTORY), memory: () => l.mode(i.MEMORY) }, base: l.base, location: l.methods() };
}
function P(e) {
  let a = (r) => {
    let n = r.target.closest("a[href]"), t = n && m(n, "target", false, "_self"), s = n && m(n, "tinro-ignore"), c = r.ctrlKey || r.metaKey || r.altKey || r.shiftKey;
    if (t == "_self" && !s && !c && n) {
      let o = n.getAttribute("href").replace(/^\/#/, "");
      /^\/\/|^#|^[a-zA-Z]+:/.test(o) || (r.preventDefault(), e(o.startsWith("/") ? o : n.href.replace(window.location.origin, "")));
    }
  };
  return addEventListener("click", a), () => removeEventListener("click", a);
}
function Q() {
  return getContext("tinro").meta.params;
}
var g = "tinro", K = v({ pattern: "", matched: true });
function q(e) {
  let a = getContext(g) || K;
  (a.exact || a.fallback) && k(`${e.fallback ? "<Route fallback>" : `<Route path="${e.path}">`}  can't be inside ${a.fallback ? "<Route fallback>" : `<Route path="${a.path || "/"}"> with exact path`}`);
  let r = e.fallback ? "fallbacks" : "childs", n = writable({}), t = v({ fallback: e.fallback, parent: a, update(s) {
    t.exact = !s.path.endsWith("/*"), t.pattern = p(`${t.parent.pattern || ""}${s.path}`), t.redirect = s.redirect, t.firstmatch = s.firstmatch, t.breadcrumb = s.breadcrumb, t.match();
  }, register: () => (t.parent[r].add(t), async () => {
    t.parent[r].delete(t), t.parent.activeChilds.delete(t), t.router.un && t.router.un(), t.parent.match();
  }), show: () => {
    e.onShow(), !t.fallback && t.parent.activeChilds.add(t);
  }, hide: () => {
    e.onHide(), t.parent.activeChilds.delete(t);
  }, match: async () => {
    t.matched = false;
    let { path: s, url: c, from: o, query: h } = t.router.location, u = d(t.pattern, s);
    if (!t.fallback && u && t.redirect && (!t.exact || t.exact && u.exact)) {
      let A = x(s, t.parent.pattern, t.redirect);
      return f.goto(A, true);
    }
    t.meta = u && { from: o, url: c, query: h, match: u.part, pattern: t.pattern, breadcrumbs: t.parent.meta && t.parent.meta.breadcrumbs.slice() || [], params: u.params, subscribe: n.subscribe }, t.breadcrumb && t.meta && t.meta.breadcrumbs.push({ name: t.breadcrumb, path: u.part }), n.set(t.meta), u && !t.fallback && (!t.exact || t.exact && u.exact) && (!t.parent.firstmatch || !t.parent.matched) ? (e.onMeta(t.meta), t.parent.matched = true, t.show()) : t.hide(), u && t.showFallbacks();
  } });
  return setContext(g, t), t;
}
function O() {
  return hasContext(g) ? getContext(g).meta : k("meta() function must be run inside any `<Route>` child component only");
}
function v(e) {
  let a = { router: {}, exact: false, pattern: null, meta: null, parent: null, fallback: false, redirect: false, firstmatch: false, breadcrumb: null, matched: false, childs: /* @__PURE__ */ new Set(), activeChilds: /* @__PURE__ */ new Set(), fallbacks: /* @__PURE__ */ new Set(), async showFallbacks() {
    if (!this.fallback && (await tick(), this.childs.size > 0 && this.activeChilds.size == 0 || this.childs.size == 0 && this.fallbacks.size > 0)) {
      let r = this;
      for (; r.fallbacks.size == 0; )
        if (r = r.parent, !r)
          return;
      r && r.fallbacks.forEach((n) => {
        if (n.redirect) {
          let t = x("/", n.parent.pattern, n.redirect);
          f.goto(t, true);
        } else
          n.show();
      });
    }
  }, start() {
    this.router.un || (this.router.un = f.subscribe((r) => {
      this.router.location = r, this.pattern !== null && this.match();
    }));
  }, match() {
    this.showFallbacks();
  } };
  return Object.assign(a, e), a.start(), a;
}
const Route = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { path = "/*" } = $$props;
  let { fallback = false } = $$props;
  let { redirect = false } = $$props;
  let { firstmatch = false } = $$props;
  let { breadcrumb = null } = $$props;
  let showContent = false;
  let params = {};
  let meta = {};
  const route = q({
    fallback,
    onShow() {
      showContent = true;
    },
    onHide() {
      showContent = false;
    },
    onMeta(newmeta) {
      meta = newmeta;
      params = meta.params;
    }
  });
  if ($$props.path === void 0 && $$bindings.path && path !== void 0)
    $$bindings.path(path);
  if ($$props.fallback === void 0 && $$bindings.fallback && fallback !== void 0)
    $$bindings.fallback(fallback);
  if ($$props.redirect === void 0 && $$bindings.redirect && redirect !== void 0)
    $$bindings.redirect(redirect);
  if ($$props.firstmatch === void 0 && $$bindings.firstmatch && firstmatch !== void 0)
    $$bindings.firstmatch(firstmatch);
  if ($$props.breadcrumb === void 0 && $$bindings.breadcrumb && breadcrumb !== void 0)
    $$bindings.breadcrumb(breadcrumb);
  {
    route.update({ path, redirect, firstmatch, breadcrumb });
  }
  return `${showContent ? `${slots.default ? slots.default({ params, meta }) : ``}` : ``}`;
});
const icon_svelte_svelte_type_style_lang = "";
const css$1n = {
  code: "@keyframes svelte-53dpwv-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}.icon.svelte-53dpwv{--size:16px;display:inline-flex;width:var(--size);height:var(--size)}.icon.svelte-53dpwv svg{display:block;width:100%;height:100%}.icon.spin.svelte-53dpwv{animation:svelte-53dpwv-spin 2s linear infinite}.icon.tiny.svelte-53dpwv{--size:0.5em}.icon.small.svelte-53dpwv{--size:0.75em}.icon.medium.svelte-53dpwv{--size:1.25em}.icon.large.svelte-53dpwv{--size:1.5em}.icon.huge.svelte-53dpwv{--size:2.5em}.icon.massive.svelte-53dpwv{--size:4em}",
  map: null
};
const Icon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { name = "help-circle" } = $$props;
  let { spin = false } = $$props;
  let { size = "regular" } = $$props;
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.spin === void 0 && $$bindings.spin && spin !== void 0)
    $$bindings.spin(spin);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  $$result.css.add(css$1n);
  return `<span class="${[escape(null_to_empty(`icon ${size}`)) + " svelte-53dpwv", spin ? "spin" : ""].join(" ").trim()}">${``}</span>`;
});
const button_svelte_svelte_type_style_lang$2 = "";
const css$1m = {
  code: ".button.svelte-hr985a.svelte-hr985a{--spacing:4px;--radius:8px;--gradient-size:200px;position:relative;font-size:14px;display:inline-flex;justify-content:center;border:1px solid var(--main-grey);background-color:var(--cultured);border-radius:var(--radius);padding:10px 12px;color:var(--main-blue);font-weight:bold;text-decoration:none;user-select:none;-webkit-user-select:none;cursor:pointer;overflow:visible;white-space:nowrap;transition:color, background-color, border-color, 150ms ease-in-out}.button.svelte-hr985a.svelte-hr985a:focus,.button.svelte-hr985a.svelte-hr985a:hover:not(.disabled){outline:0;background-color:var(--white);border-color:var(--main-blue)}.button.svelte-hr985a.svelte-hr985a:active:not(.disabled){border-color:var(--main-blue);background-color:var(--main-blue);color:var(--white)}.button.svelte-hr985a.svelte-hr985a:focus-visible{outline:0;text-decoration:underline}.button.primary.svelte-hr985a.svelte-hr985a{background-color:var(--lapis-lazuli);color:var(--white)}.button.primary.svelte-hr985a.svelte-hr985a:focus,.button.primary.svelte-hr985a.svelte-hr985a:hover:not(.disabled){background-color:var(--white);border-color:var(--main-blue);color:var(--main-blue)}.button.primary.svelte-hr985a.svelte-hr985a:active:not(.disabled){border-color:var(--main-blue);background-color:var(--main-blue);color:var(--white)}body.darkmode .button.primary.svelte-hr985a.svelte-hr985a{background-color:var(--middle-green-eagle);color:var(--white)}.button.secondary.svelte-hr985a.svelte-hr985a{border:1px solid var(--cultured);background-color:transparent;color:var(--lapis-lazuli)}.button.secondary.svelte-hr985a.svelte-hr985a:focus,.button.secondary.svelte-hr985a.svelte-hr985a:hover:not(.disabled){background-color:var(--white);border-color:var(--main-blue);color:var(--main-blue)}.button.secondary.svelte-hr985a.svelte-hr985a:active:not(.disabled){border-color:var(--main-blue);background-color:var(--main-blue);color:var(--white)}.darkmode .button.secondary.svelte-hr985a.svelte-hr985a{border-color:#3b3b3b;background-color:transparent;color:var(--middle-green-eagle)}.button.tertiary.svelte-hr985a.svelte-hr985a{border-color:var(--white);background-color:var(--white)}.button.no-frame.svelte-hr985a.svelte-hr985a{background-color:transparent;border-color:transparent}.button.no-frame.svelte-hr985a.svelte-hr985a:focus,.button.no-frame.svelte-hr985a.svelte-hr985a:hover:not(.disabled){background-color:var(--white);border-color:var(--main-blue);color:var(--main-blue)}.button.no-frame.svelte-hr985a.svelte-hr985a:active:not(.disabled){border-color:var(--main-blue);background-color:var(--main-blue);color:var(--white)}.darkmode .button.no-frame.svelte-hr985a.svelte-hr985a{background-color:transparent}.button.effect.svelte-hr985a.svelte-hr985a{background-color:var(--white)}.button.effect.svelte-hr985a .before.svelte-hr985a{position:absolute;border-radius:var(--radius);inset:0;z-index:-1;background:linear-gradient(90deg, var(--air-superiority-blue) 25%, var(--light-goldenrod-yellow) 41%, var(--sandy-brown) 58%, var(--melon) 75%);background-size:200%;background-position:25%;filter:blur(15px);animation:svelte-hr985a-bg-effect 4s infinite}@keyframes svelte-hr985a-bg-effect{0%{background-position:25%}50%{background-position:50%}100%{background-position:25%}}.button.disabled.svelte-hr985a.svelte-hr985a{pointer-events:none;cursor:default;opacity:0.3;cursor:not-allowed;pointer-events:all !important}.button.fluid.svelte-hr985a.svelte-hr985a{display:flex;flex-direction:column;align-items:center}.button.loading.svelte-hr985a .content .icon:not(.loading){display:none}.button.svelte-hr985a *{pointer-events:none}.button.svelte-hr985a .content.svelte-hr985a{z-index:1;display:flex;flex-direction:row;align-items:center}.button.svelte-hr985a .content > *{margin-right:var(--spacing)}.button.svelte-hr985a .content > *:last-child{margin-right:0}.button.size-large.svelte-hr985a.svelte-hr985a{--spacing:8px;border-radius:12px;font-size:16px;letter-spacing:-0.18px;padding:16px 32px}body.darkmode .button.svelte-hr985a.svelte-hr985a{background-color:#252525;color:var(--middle-green-eagle)}",
  map: null
};
const Button$2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let isDisabled;
  let $formDisabled, $$unsubscribe_formDisabled;
  let { href = void 0 } = $$props;
  let { target = void 0 } = $$props;
  let { style = "default" } = $$props;
  let { size = "regular" } = $$props;
  let { disabled = false } = $$props;
  let { fluid = false } = $$props;
  let { formValidation = false } = $$props;
  const formDisabled = getContext("formDisabled");
  $$unsubscribe_formDisabled = subscribe(formDisabled, (value) => $formDisabled = value);
  createEventDispatcher();
  if ($$props.href === void 0 && $$bindings.href && href !== void 0)
    $$bindings.href(href);
  if ($$props.target === void 0 && $$bindings.target && target !== void 0)
    $$bindings.target(target);
  if ($$props.style === void 0 && $$bindings.style && style !== void 0)
    $$bindings.style(style);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.fluid === void 0 && $$bindings.fluid && fluid !== void 0)
    $$bindings.fluid(fluid);
  if ($$props.formValidation === void 0 && $$bindings.formValidation && formValidation !== void 0)
    $$bindings.formValidation(formValidation);
  $$result.css.add(css$1m);
  isDisabled = formValidation && $formDisabled || disabled;
  $$unsubscribe_formDisabled();
  return `<a ${isDisabled ? "disabled" : ""} class="${[
    escape(null_to_empty(`button size-${size} ${style === "default" ? "" : style}`)) + " svelte-hr985a",
    (isDisabled ? "disabled" : "") + " " + (fluid ? "fluid" : "")
  ].join(" ").trim()}"${add_attribute("href", href, 0)}${add_attribute("target", target, 0)} role="${"button"}" tabindex="${"0"}">${style === "effect" ? `<span class="${"before svelte-hr985a"}"></span>` : ``}
    <span class="${"content svelte-hr985a"}">${slots.default ? slots.default({}) : `Click me`}</span></a>`;
});
const Text = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `
<span class="${"text"}">${slots.default ? slots.default({}) : `Text`}</span>`;
});
const toasts = writable([]);
const login_svelte_svelte_type_style_lang$1 = "";
const css$1l = {
  code: ".login.svelte-19ds40s{display:flex;flex-direction:column;justify-items:center;align-content:center;justify-content:center;align-items:center}",
  map: null
};
const Login$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let disabled = false;
  let { asLink = false } = $$props;
  let { style = "secondary" } = $$props;
  if ($$props.asLink === void 0 && $$bindings.asLink && asLink !== void 0)
    $$bindings.asLink(asLink);
  if ($$props.style === void 0 && $$bindings.style && style !== void 0)
    $$bindings.style(style);
  $$result.css.add(css$1l);
  return `${asLink ? `<a${add_attribute("href", void 0, 0)} alt="${"login link"}">${slots.default ? slots.default({}) : ``}</a>` : `<div class="${"login svelte-19ds40s"}">${validate_component(Button$2, "Button").$$render($$result, { disabled, size: "regular", style }, {}, {
    default: () => {
      return `${validate_component(Icon, "Icon").$$render($$result, { name: "log-in" }, {}, {})}
            ${validate_component(Text, "Text").$$render($$result, {}, {}, {
        default: () => {
          return `${slots.default ? slots.default({}) : ``}`;
        }
      })}`;
    }
  })}</div>`}`;
});
const segment_svelte_svelte_type_style_lang = "";
const css$1k = {
  code: '.segment.svelte-1m18g7d{background:var(--main-grey);border-radius:20px;color:var(--main-black);padding:22px 26px}.segment.white.svelte-1m18g7d{background:var(--main-white)}.segment.transparent.svelte-1m18g7d{background:transparent}.segment.image.svelte-1m18g7d{background-size:cover;background-image:url("/images/unicove-bright-mode-card-1.jpeg")}.darkmode .segment.image.svelte-1m18g7d{background-image:url("/images/unicove-dark-mode-card-1.jpeg")}.segment.image-alt.svelte-1m18g7d{background-size:cover;background-image:url("/images/unicove-bright-mode-card-2.jpeg")}.darkmode .segment.image-alt.svelte-1m18g7d{background-image:url("/images/unicove-dark-mode-card-2.jpeg")}.segment.bordered.svelte-1m18g7d{border:1px solid var(--divider-grey)}',
  map: null
};
const Segment = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { background = "" } = $$props;
  let { bordered = false } = $$props;
  if ($$props.background === void 0 && $$bindings.background && background !== void 0)
    $$bindings.background(background);
  if ($$props.bordered === void 0 && $$bindings.bordered && bordered !== void 0)
    $$bindings.bordered(bordered);
  $$result.css.add(css$1k);
  return `<div class="${[
    "segment " + escape(background) + " svelte-1m18g7d",
    bordered ? "bordered" : ""
  ].join(" ").trim()}">${slots.default ? slots.default({}) : ``}</div>`;
});
const list_svelte_svelte_type_style_lang = "";
const css$1j = {
  code: ".list.svelte-hyuc1j.svelte-hyuc1j.svelte-hyuc1j{margin:10px}.list.svelte-hyuc1j .network .header.svelte-hyuc1j.svelte-hyuc1j{color:var(--dark-grey);cursor:pointer;display:flex;justify-content:space-between;font-size:12px;font-weight:600;line-height:12px;padding:6px 10px;margin-top:26px;user-select:none}.list.svelte-hyuc1j .network .accounts.svelte-hyuc1j.svelte-hyuc1j{list-style-type:none;padding:0 16px}.list.svelte-hyuc1j .network .accounts.collapsed.svelte-hyuc1j.svelte-hyuc1j{display:none}.list.svelte-hyuc1j .network .accounts li.svelte-hyuc1j.svelte-hyuc1j{cursor:pointer;color:var(--main-blue);display:flex;font-size:13px;font-weight:500;line-height:33px;margin:10px 0;user-select:none;text-decoration:none}.list.svelte-hyuc1j .network .accounts li.active.svelte-hyuc1j.svelte-hyuc1j{background-color:var(--background-highlight);color:var(--main-black);border-radius:8px;font-weight:600}.list.svelte-hyuc1j .network .accounts li.active.svelte-hyuc1j>.icon.svelte-hyuc1j,.list.svelte-hyuc1j .network .accounts li.active.svelte-hyuc1j>.control.svelte-hyuc1j{color:var(--main-blue)}.list.svelte-hyuc1j .network .accounts li.active .control.svelte-hyuc1j.svelte-hyuc1j{display:flex}.list.svelte-hyuc1j .network .accounts li.svelte-hyuc1j>div.svelte-hyuc1j{order:0;flex:0 1 auto}.list.svelte-hyuc1j .network .accounts li.svelte-hyuc1j>div.icon.svelte-hyuc1j{color:var(--main-blue);padding:0 8px}.list.svelte-hyuc1j .network .accounts li.svelte-hyuc1j>div.icon.svelte-hyuc1j .icon{vertical-align:middle}.list.svelte-hyuc1j .network .accounts li.svelte-hyuc1j>div.account.svelte-hyuc1j{flex:1 1 auto;padding:0 2px;line-height:32px}.list.svelte-hyuc1j .network .accounts li.svelte-hyuc1j>div.control.svelte-hyuc1j{display:none;align-items:center;justify-content:center;margin:0 10px}.list.svelte-hyuc1j .button{line-height:1em;margin:0 16px}.login.svelte-hyuc1j.svelte-hyuc1j.svelte-hyuc1j{margin:0 26px;text-align:center}.login.svelte-hyuc1j .segment{background:var(--background-highlight)}.login.svelte-hyuc1j .circular-icon.svelte-hyuc1j.svelte-hyuc1j{background:var(--main-grey);border-radius:50%;margin:0 auto;position:relative;height:48px;width:48px}.login.svelte-hyuc1j .circular-icon.svelte-hyuc1j .icon{position:absolute;top:12px;left:12px;right:12px;height:24px;width:24px}.login.svelte-hyuc1j h3.svelte-hyuc1j.svelte-hyuc1j{font-family:Inter;font-style:normal;font-weight:bold;font-size:12px;line-height:14px;letter-spacing:0.01px;color:var(--main-black);margin-top:15px}.login.svelte-hyuc1j p.svelte-hyuc1j.svelte-hyuc1j{font-family:Inter;font-style:normal;font-weight:500;font-size:10px;line-height:14px;letter-spacing:0.01px;color:#9898b5;margin:7px 0 11px}",
  map: null
};
const List = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let isActive;
  let $availableSessions, $$unsubscribe_availableSessions;
  let $activeSession, $$unsubscribe_activeSession;
  let $groupings, $$unsubscribe_groupings;
  $$unsubscribe_availableSessions = subscribe(availableSessions, (value) => $availableSessions = value);
  $$unsubscribe_activeSession = subscribe(activeSession, (value) => $activeSession = value);
  let { onSelect } = $$props;
  const getGroupings = (chainIds) => chainIds.map((chainId) => {
    const config = chainConfig(ChainId.from(chainId));
    return {
      chainId,
      name: config.name,
      sessions: $availableSessions.filter((s) => String(s.chainId) === chainId)
    };
  }).sort((a, b2) => a.name.localeCompare(b2.name));
  const groupings = derived(availableSessions, ($availableSessions2) => {
    if ($availableSessions2) {
      const chainIds = [...new Set($availableSessions2.map((session) => String(session.chainId)))];
      return getGroupings(chainIds);
    }
    return [];
  });
  $$unsubscribe_groupings = subscribe(groupings, (value) => $groupings = value);
  let { collapsed = {} } = $$props;
  if ($$props.onSelect === void 0 && $$bindings.onSelect && onSelect !== void 0)
    $$bindings.onSelect(onSelect);
  if ($$props.collapsed === void 0 && $$bindings.collapsed && collapsed !== void 0)
    $$bindings.collapsed(collapsed);
  $$result.css.add(css$1j);
  isActive = (session) => sessionEquals(session, $activeSession);
  $$unsubscribe_availableSessions();
  $$unsubscribe_activeSession();
  $$unsubscribe_groupings();
  return `${$activeSession ? `<div class="${"list svelte-hyuc1j"}">${validate_component(Button$2, "Button").$$render($$result, { fluid: true, style: "primary" }, {}, {
    default: () => {
      return `${validate_component(Icon, "Icon").$$render($$result, { name: "user-plus" }, {}, {})}
            ${validate_component(Text, "Text").$$render($$result, {}, {}, {
        default: () => {
          return `Add another account`;
        }
      })}`;
    }
  })}
        ${each($groupings, (group) => {
    return `<div class="${"network"}"><div class="${"header svelte-hyuc1j"}">${validate_component(Text, "Text").$$render($$result, {}, {}, {
      default: () => {
        return `${escape(group.name)} (${escape(group.sessions.length)})`;
      }
    })}
                    ${validate_component(Icon, "Icon").$$render(
      $$result,
      {
        name: collapsed[group.chainId] ? "chevron-right" : "chevron-down"
      },
      {},
      {}
    )}</div>
                <ul class="${["accounts svelte-hyuc1j", collapsed[group.chainId] ? "collapsed" : ""].join(" ").trim()}">${each(group.sessions, (session) => {
      return `<li class="${["svelte-hyuc1j", isActive(session) ? "active" : ""].join(" ").trim()}"><div class="${"icon svelte-hyuc1j"}">${validate_component(Icon, "Icon").$$render(
        $$result,
        {
          name: isActive(session) ? "user-check" : "user"
        },
        {},
        {}
      )}</div>
                            <div class="${"account svelte-hyuc1j"}">${escape(session.auth.actor)}</div>
                            <div class="${"control svelte-hyuc1j"}">${validate_component(Icon, "Icon").$$render($$result, { name: "log-out", size: "large" }, {}, {})}</div>
                        </li>`;
    })}</ul>
            </div>`;
  })}</div>` : `<div class="${"login svelte-hyuc1j"}">${validate_component(Segment, "Segment").$$render($$result, {}, {}, {
    default: () => {
      return `<div class="${"circular-icon svelte-hyuc1j"}">${validate_component(Icon, "Icon").$$render($$result, { size: "medium", name: "user-check" }, {}, {})}</div>
            <h3 class="${"svelte-hyuc1j"}">Supported blockchains</h3>
            <p class="${"svelte-hyuc1j"}">${escape(chains.filter((chain) => !chain.testnet).map((chain) => chain.name).join(", "))}</p>
            ${validate_component(Login$1, "ButtonLogin").$$render($$result, {}, {}, {
        default: () => {
          return `Login`;
        }
      })}`;
    }
  })}</div>`}`;
});
const sidebar_svelte_svelte_type_style_lang = "";
const css$1i = {
  code: "aside.svelte-1y83251.svelte-1y83251{display:none;position:fixed;top:0;right:-100%;height:100%;max-height:100vh;width:268px;max-width:300px;overflow-x:hidden;overflow-y:scroll;background-color:var(--main-grey);border-color:var(--main-grey);border-right-width:2px;transition:left 0.3s ease-in-out;z-index:1001}aside.open.svelte-1y83251.svelte-1y83251{display:block;right:0}.header.svelte-1y83251.svelte-1y83251{border-bottom:1px solid var(--divider-grey);color:var(--dark-grey);line-height:16px;margin:24px;padding-bottom:21px}.header.svelte-1y83251 .icon.svelte-1y83251{vertical-align:middle;color:var(--main-blue)}.header.svelte-1y83251 a.svelte-1y83251{cursor:pointer;margin-right:5px;margin-bottom:-10px}",
  map: null
};
const Sidebar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { open = false } = $$props;
  function onSelect(session) {
    activate(session);
    open = false;
  }
  if ($$props.open === void 0 && $$bindings.open && open !== void 0)
    $$bindings.open(open);
  $$result.css.add(css$1i);
  return `<aside class="${["svelte-1y83251", open ? "open" : ""].join(" ").trim()}"><div class="${"header svelte-1y83251"}">
        <a class="${"icon svelte-1y83251"}">${validate_component(Icon, "Icon").$$render($$result, { name: "x" }, {}, {})}</a>
        Accounts
    </div>
    ${validate_component(List, "List").$$render($$result, { onSelect }, {}, {})}</aside>`;
});
const mode_svelte_svelte_type_style_lang = "";
const css$1h = {
  code: ".icon.svelte-d2xgzz{display:inline-flex;color:var(--main-blue);line-height:16px;margin-right:10px;vertical-align:middle}",
  map: null
};
const Mode = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $darkMode, $$unsubscribe_darkMode;
  $$unsubscribe_darkMode = subscribe(darkMode, (value) => $darkMode = value);
  $$result.css.add(css$1h);
  $$unsubscribe_darkMode();
  return `${$darkMode ? `<span class="${"icon svelte-d2xgzz"}">${validate_component(Icon, "Icon").$$render($$result, { name: "sun" }, {}, {})}</span>` : `<span class="${"icon svelte-d2xgzz"}">${validate_component(Icon, "Icon").$$render($$result, { name: "moon" }, {}, {})}</span>`}`;
});
const button_svelte_svelte_type_style_lang$1 = "";
const css$1g = {
  code: ".account-button.svelte-p0g17l.svelte-p0g17l{display:flex;align-items:center;color:var(--main-blue);cursor:pointer;font-size:14px;font-weight:600;margin:0 6px 0 auto}.account-button.svelte-p0g17l .icon.svelte-p0g17l{color:var(--main-blue);line-height:16px;margin-right:10px;vertical-align:middle}.accounts.svelte-p0g17l.svelte-p0g17l{display:flex;align-items:center}@media only screen and (max-width: 600px){.account-button.svelte-p0g17l .accounts .icon.svelte-p0g17l{margin-right:0}.account-button.svelte-p0g17l .accounts .text.svelte-p0g17l{display:none}}",
  map: null
};
const Button$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $activeSession, $$unsubscribe_activeSession;
  $$unsubscribe_activeSession = subscribe(activeSession, (value) => $activeSession = value);
  let { open = false } = $$props;
  if ($$props.open === void 0 && $$bindings.open && open !== void 0)
    $$bindings.open(open);
  $$result.css.add(css$1g);
  $$unsubscribe_activeSession();
  return `<div class="${"account-button svelte-p0g17l"}">${validate_component(Mode, "ThemeButton").$$render($$result, {}, {}, {})}
    <span class="${"accounts svelte-p0g17l"}"><span class="${"icon svelte-p0g17l"}">${validate_component(Icon, "Icon").$$render($$result, { name: "user" }, {}, {})}</span>
        <span class="${"text svelte-p0g17l"}">${$activeSession ? `${escape($activeSession == null ? void 0 : $activeSession.auth.actor)}` : `Login`}</span></span></div>`;
});
const header_svelte_svelte_type_style_lang = "";
const css$1f = {
  code: "h1.svelte-1edzahw{font-family:Inter;font-style:normal;font-weight:bold;font-size:24px;line-height:29px;letter-spacing:-0.47px;color:var(--black)}h3.svelte-1edzahw{font-family:Inter;font-style:normal;font-weight:normal;font-size:16px;line-height:19px;letter-spacing:-0.18px;color:var(--dark-grey)}",
  map: null
};
const Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { title = "" } = $$props;
  let { subtitle = "" } = $$props;
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  if ($$props.subtitle === void 0 && $$bindings.subtitle && subtitle !== void 0)
    $$bindings.subtitle(subtitle);
  $$result.css.add(css$1f);
  return `<h1 class="${"svelte-1edzahw"}">${escape(title)}</h1>
<h3 class="${"svelte-1edzahw"}">${escape(subtitle)}</h3>`;
});
const Media_query = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { query } = $$props;
  let matches = false;
  if ($$props.query === void 0 && $$bindings.query && query !== void 0)
    $$bindings.query(query);
  return `${slots.default ? slots.default({ matches }) : ``}`;
});
const logo_svelte_svelte_type_style_lang = "";
const css$1e = {
  code: "svg.svelte-mrlo47.svelte-mrlo47{max-height:100%}path.svelte-mrlo47.svelte-mrlo47{fill:var(--dark-grey)}.dark.svelte-mrlo47 path.svelte-mrlo47{fill:var(--middle-green-eagle)}.darkmode .dark.svelte-mrlo47 path.svelte-mrlo47{fill:#ffffff}.white.svelte-mrlo47 path.svelte-mrlo47{fill:#ffffff}.darkmode .white.svelte-mrlo47 path.svelte-mrlo47{fill:#c4c4c4}",
  map: null
};
const Logo = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { width = void 0 } = $$props;
  let { variant = void 0 } = $$props;
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.variant === void 0 && $$bindings.variant && variant !== void 0)
    $$bindings.variant(variant);
  $$result.css.add(css$1e);
  return `<svg viewBox="${"0 0 377 362"}" fill="${"none"}" xmlns="${"http://www.w3.org/2000/svg"}"${add_attribute("width", width, 0)} class="${escape(null_to_empty(variant ? variant : "")) + " svelte-mrlo47"}"><path d="${"M144.222 133.775C136.592 155.033 140.492 179.432 155.755 197.379L163.419 206.39L163.357 206.462L194.041 242.355L194.021 242.373L196.214 244.952C201.295 250.927 197.085 260.161 189.28 260.161C181.575 260.161 177.383 251.171 182.141 245.2L156.169 214.819L152.65 218.91C125.419 250.571 147.72 299.845 189.28 299.845C230.712 299.845 253.059 250.832 226.086 219.117L225.761 218.765L208.703 201.409C200.187 192.746 196.039 180.648 197.43 168.53L197.441 168.532C197.976 160.437 200.347 152.475 204.498 145.295L204.61 145.1C184.99 152.081 161.57 148.708 145.623 134.981L144.222 133.775Z"}" class="${"svelte-mrlo47"}"></path><path d="${"M124.727 138.851L124.34 141.358L128.828 146.172C129.63 147.032 129.477 148.411 128.507 149.072L117.377 156.652C116.221 157.44 114.645 156.744 114.436 155.352L112.859 144.877C117.03 143.34 121.023 141.331 124.727 138.851Z"}" class="${"svelte-mrlo47"}"></path><path d="${"M124.727 138.851C126.493 137.668 128.194 136.378 129.817 134.981L133.806 131.548C136.056 129.611 139.384 129.611 141.634 131.548L144.222 133.775L144.25 133.698L139.888 121.283L126.174 129.488L124.727 138.851Z"}" class="${"svelte-mrlo47"}"></path><path d="${"M208.049 174.422C208.326 180.805 210.675 186.946 214.764 191.877L226.523 177.552C236.971 180.2 247.773 181.273 258.575 180.717L259.747 180.656C261.322 180.575 261.372 178.248 259.802 178.098L259.21 178.041C249.641 177.128 245.083 165.705 251.357 158.362L254.611 154.554C255.634 153.358 254.137 151.667 252.843 152.556C244.375 158.371 233.03 151.56 234.063 141.282L234.164 140.278C234.33 138.631 231.987 138.17 231.526 139.758L230.243 144.18C227.939 152.117 224.635 159.71 220.421 166.777L208.049 174.422Z"}" class="${"svelte-mrlo47"}"></path><path fill-rule="${"evenodd"}" clip-rule="${"evenodd"}" d="${"M11.6366 239.277C2.02399 232.293 -1.99831 219.914 1.67337 208.614L63.0716 19.6495C66.7433 8.34923 77.2738 0.698364 89.1556 0.698364H287.844C299.726 0.698364 310.257 8.34923 313.928 19.6495L375.327 208.614C378.998 219.914 374.976 232.293 365.363 239.277L204.621 356.064C195.008 363.048 181.992 363.048 172.379 356.064L11.6366 239.277ZM169.407 28.0741L171.993 46.2055L147.39 33.1372C146.991 32.9254 146.497 33.0691 146.272 33.4628C146.057 33.8377 146.158 34.3156 146.505 34.5702L171.693 53.0437L171.122 55.0381C168.989 62.495 163.99 68.7228 157.321 72.3969C155.737 73.2695 155.122 75.3501 156.173 76.8301L162.654 85.9584C170.112 84.7943 177.116 81.6052 182.914 76.7329L183.009 76.653C186.05 88.1938 181.021 100.355 170.749 106.297L156.723 114.412L144.607 105.753C141.888 103.809 138.172 104.145 135.838 106.545L119.917 122.925C118.671 124.206 117.766 125.784 117.285 127.512L112.716 143.925L112.859 144.877C93.4962 152.01 70.2848 148.976 54.1965 135.773L27.7773 217.083L188.52 333.87L349.263 217.083L321.052 130.261C320.15 130.478 319.287 130.907 318.543 131.548L314.554 134.981C293.412 153.18 259.134 153.18 237.991 134.981L234.003 131.548C231.753 129.611 228.424 129.611 226.174 131.548L222.186 134.981C216.991 139.453 211.002 142.826 204.61 145.1L220.838 117.034C221.224 116.368 221.593 115.698 221.946 115.026L238.256 106.627L234.411 101.579C228.091 93.2819 228.154 81.7196 234.565 73.4937L238.256 68.7573C227.959 65.2533 221.496 54.8558 222.945 43.9948L223.668 38.5695L220.576 39.471C212.243 41.9003 203.628 36.6444 201.894 28.0741L200.409 29.2554C193.302 34.9092 183.543 35.7637 175.576 31.4297L169.407 28.0741ZM123.002 53.7104C118.921 54.1262 114.724 56.9456 111.847 59.7649C108.936 62.6713 106.03 66.9462 105.595 71.1148C105.165 66.9607 102.268 62.6955 99.3719 59.7939C96.4901 56.9601 92.2835 54.1311 88.188 53.7104C92.3367 53.2848 96.6013 50.3929 99.4976 47.5011C102.336 44.614 105.174 40.4068 105.595 36.3011C106.02 40.4455 108.907 44.7011 111.789 47.5978C114.675 50.4461 118.892 53.2896 123.002 53.7104ZM279.095 97.8973C281.415 95.6236 284.799 93.35 288.09 93.0146C284.776 92.6753 281.376 90.3821 279.048 88.0851C276.724 85.749 274.396 82.3171 274.053 78.9749C273.713 82.2859 271.424 85.6788 269.136 88.0071C266.8 90.3392 263.361 92.6714 260.015 93.0146C263.318 93.3539 266.71 95.6353 269.034 97.9207C271.37 100.261 273.706 103.7 274.053 107.05C274.404 103.689 276.747 100.241 279.095 97.8973Z"}" class="${"svelte-mrlo47"}"></path></svg>`;
});
const unicove_svelte_svelte_type_style_lang = "";
const css$1d = {
  code: "path.svelte-1oyqiuy.svelte-1oyqiuy{fill:var(--dark-grey)}.dark.svelte-1oyqiuy path.svelte-1oyqiuy{fill:var(--middle-green-eagle)}.darkmode .dark.svelte-1oyqiuy path.svelte-1oyqiuy{fill:#ffffff}.white.svelte-1oyqiuy path.svelte-1oyqiuy{fill:#ffffff}.darkmode .white.svelte-1oyqiuy path.svelte-1oyqiuy{fill:#c4c4c4}",
  map: null
};
const Unicove = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { width = void 0 } = $$props;
  let { variant = void 0 } = $$props;
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.variant === void 0 && $$bindings.variant && variant !== void 0)
    $$bindings.variant(variant);
  $$result.css.add(css$1d);
  return `<svg viewBox="${"0 0 850 142"}" fill="${"none"}" xmlns="${"http://www.w3.org/2000/svg"}"${add_attribute("width", width, 0)} class="${escape(null_to_empty(variant ? variant : "")) + " svelte-1oyqiuy"}"><path d="${"M146.242 0.500002L165.106 0.5C193.06 0.5 218.566 10.9116 237.904 28.0427V0.500002H274.501V108.507C274.502 108.714 274.503 108.922 274.503 109.13V141.5H237.904V108.621C237.671 74.9946 214.316 46.8227 182.838 38.9998L182.838 141.5H146.242L146.242 0.500002Z"}" class="${"svelte-1oyqiuy"}"></path><path d="${"M37.571 76.6434V0.500002H0.974365V76.6434C0.974365 112.463 30.2165 141.5 66.2886 141.5C102.361 141.5 131.603 112.463 131.603 76.6434V0.500002H95.0063V76.6434C95.0063 92.3926 82.1489 105.16 66.2886 105.16C50.4283 105.16 37.571 92.3926 37.571 76.6434Z"}" class="${"svelte-1oyqiuy"}"></path><path d="${"M619.805 141.5H600.945V0.500013L637.542 0.500016V102.976C668.769 95.1291 691.877 67.0404 691.877 33.5925V0.500009L728.473 0.500012V33.5925C728.473 93.1882 679.821 141.5 619.805 141.5Z"}" class="${"svelte-1oyqiuy"}"></path><path d="${"M325.738 0.5V141.5H289.141V0.500002L325.738 0.5Z"}" class="${"svelte-1oyqiuy"}"></path><path d="${"M849.974 0.500002H743.112V141.5H849.974V105.16H779.709V89.1701H828.243V52.8299H779.709V36.8402H849.974V0.500002Z"}" class="${"svelte-1oyqiuy"}"></path><path fill-rule="${"evenodd"}" clip-rule="${"evenodd"}" d="${"M444.311 71C444.311 32.0639 476.098 0.500002 515.309 0.500002C554.519 0.500002 586.306 32.0639 586.306 71C586.306 109.936 554.519 141.5 515.309 141.5C476.098 141.5 444.311 109.936 444.311 71ZM515.309 36.8402C496.31 36.8402 480.908 52.1341 480.908 71C480.908 89.8659 496.31 105.16 515.309 105.16C534.308 105.16 549.709 89.8659 549.709 71C549.709 52.1341 534.308 36.8402 515.309 36.8402Z"}" class="${"svelte-1oyqiuy"}"></path><path d="${"M376.973 71C376.973 52.1341 392.375 36.8402 411.374 36.8402H429.672V0.500002H411.374C372.163 0.500002 340.377 32.0639 340.377 71C340.377 109.936 372.163 141.5 411.374 141.5H429.672V105.16H411.374C392.375 105.16 376.973 89.8659 376.973 71Z"}" class="${"svelte-1oyqiuy"}"></path></svg>`;
});
const content_svelte_svelte_type_style_lang = "";
const css$1c = {
  code: 'nav.svelte-11nld0p.svelte-11nld0p.svelte-11nld0p{transition:300ms ease-in-out;transition-property:width, min-width;background-image:url("/images/nav-noise-light.png");padding:18px 26px;width:268px;min-width:268px;height:100vh}.darkmode nav.svelte-11nld0p.svelte-11nld0p.svelte-11nld0p{background-image:url("/images/nav-noise-dark.png")}nav.svelte-11nld0p header.svelte-11nld0p.svelte-11nld0p{display:flex;align-items:flex-start;height:60px;border-bottom:1px solid var(--divider-grey)}nav.svelte-11nld0p header .title.svelte-11nld0p.svelte-11nld0p{display:flex;flex:1;flex-direction:column;margin-left:12px}nav.svelte-11nld0p header .title .unicove.svelte-11nld0p.svelte-11nld0p{margin-bottom:4px}nav.svelte-11nld0p header .title .version.svelte-11nld0p.svelte-11nld0p{color:var(--dark-grey);font-size:10px;line-height:12px}nav.svelte-11nld0p header .button.svelte-11nld0p.svelte-11nld0p{color:var(--main-blue);cursor:pointer;display:none}nav.svelte-11nld0p>ul.svelte-11nld0p.svelte-11nld0p{margin-top:26px}nav.svelte-11nld0p>ul.svelte-11nld0p>li.svelte-11nld0p{border-radius:8px;margin-bottom:8px}nav.svelte-11nld0p>ul>li a.svelte-11nld0p.svelte-11nld0p{color:var(--main-blue);cursor:pointer;display:flex;text-decoration:none;height:32px;align-items:center;font-weight:500}nav.svelte-11nld0p>ul.svelte-11nld0p>li.svelte-11nld0p:hover{background-color:var(--background-highlight-hover)}nav.svelte-11nld0p>ul.svelte-11nld0p>li.active.svelte-11nld0p{background-color:var(--background-highlight);border-radius:8px}nav.svelte-11nld0p>ul>li.active a.svelte-11nld0p.svelte-11nld0p{color:var(--main-black)}nav.svelte-11nld0p>ul>li .icon.svelte-11nld0p.svelte-11nld0p{padding:8px}nav.svelte-11nld0p>ul>li .icon.svelte-11nld0p .icon{vertical-align:middle}nav.svelte-11nld0p>ul>li .name.svelte-11nld0p.svelte-11nld0p{padding-left:5px}nav.svelte-11nld0p>ul.svelte-11nld0p>li.advanced.svelte-11nld0p{cursor:pointer;color:var(--dark-grey);font-family:Inter;font-style:normal;font-weight:600;font-size:10px;line-height:26px;letter-spacing:0.1px;text-transform:uppercase;margin-top:27px}nav.svelte-11nld0p>ul>li.advanced .icon.svelte-11nld0p.svelte-11nld0p{float:right;padding:0;margin-right:10px}nav.svelte-11nld0p>ul>li.advanced .icon.svelte-11nld0p .icon{vertical-align:middle}nav.svelte-11nld0p>ul.svelte-11nld0p>li.advanced.svelte-11nld0p:hover{background-color:transparent}nav.svelte-11nld0p>ul>li ul.svelte-11nld0p.svelte-11nld0p{margin-top:0}nav.floating.svelte-11nld0p.svelte-11nld0p.svelte-11nld0p{position:absolute;z-index:2001;top:0;left:0}',
  map: null
};
const Content = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let currentPath;
  let expandAdvanced;
  let $preferences, $$unsubscribe_preferences;
  let $router, $$unsubscribe_router;
  $$unsubscribe_preferences = subscribe(preferences, (value) => $preferences = value);
  $$unsubscribe_router = subscribe(f, (value) => $router = value);
  createEventDispatcher();
  let { expand = true } = $$props;
  let { floating = false } = $$props;
  let { primaryNavigation = [] } = $$props;
  let { advancedNavigation = [] } = $$props;
  const pathMatches = (item) => {
    if (item.exactPath) {
      return currentPath === item.path;
    }
    return currentPath.startsWith(item.path);
  };
  if ($$props.expand === void 0 && $$bindings.expand && expand !== void 0)
    $$bindings.expand(expand);
  if ($$props.floating === void 0 && $$bindings.floating && floating !== void 0)
    $$bindings.floating(floating);
  if ($$props.primaryNavigation === void 0 && $$bindings.primaryNavigation && primaryNavigation !== void 0)
    $$bindings.primaryNavigation(primaryNavigation);
  if ($$props.advancedNavigation === void 0 && $$bindings.advancedNavigation && advancedNavigation !== void 0)
    $$bindings.advancedNavigation(advancedNavigation);
  $$result.css.add(css$1c);
  currentPath = $router.path;
  expandAdvanced = $preferences.expandNavbarAdvanced;
  $$unsubscribe_preferences();
  $$unsubscribe_router();
  return `<nav class="${["svelte-11nld0p", floating ? "floating" : ""].join(" ").trim()}"><header class="${"svelte-11nld0p"}">${validate_component(Logo, "Logo").$$render($$result, { width: 40 }, {}, {})}
        <div class="${"title svelte-11nld0p"}"><div class="${"unicove svelte-11nld0p"}">${validate_component(Unicove, "Unicove").$$render($$result, { width: 90 }, {}, {})}</div>
            <div class="${"version svelte-11nld0p"}">${isRelease ? `${escape(releaseVersion)}` : `${escape(version)}`}</div></div>
        <span class="${"button svelte-11nld0p"}">${expand ? `${validate_component(Icon, "Icon").$$render($$result, { name: "x" }, {}, {})}` : `${validate_component(Icon, "Icon").$$render($$result, { name: "menu" }, {}, {})}`}</span></header>
    <ul class="${"svelte-11nld0p"}">${each(primaryNavigation, (item) => {
    return `<li class="${["svelte-11nld0p", pathMatches(item) ? "active" : ""].join(" ").trim()}"><a${add_attribute("href", item.path, 0)} class="${"svelte-11nld0p"}"><span class="${"icon svelte-11nld0p"}">${validate_component(Icon, "Icon").$$render($$result, { name: item.icon }, {}, {})}</span>
                    <span class="${"name svelte-11nld0p"}">${escape(item.name)}</span></a>
            </li>`;
  })}
        ${advancedNavigation.length ? `<li class="${"advanced svelte-11nld0p"}"><span class="${"name svelte-11nld0p"}">Advanced</span>
                <span class="${"icon svelte-11nld0p"}">${validate_component(Icon, "Icon").$$render(
    $$result,
    {
      name: expandAdvanced ? "chevron-down" : "chevron-right"
    },
    {},
    {}
  )}</span></li>
            <li class="${"svelte-11nld0p"}">${$preferences.expandNavbarAdvanced ? `<ul class="${"svelte-11nld0p"}">${each(advancedNavigation, (item) => {
    return `<li${add_classes((pathMatches(item) ? "active" : "").trim())}><a${add_attribute("href", item.path, 0)} class="${"svelte-11nld0p"}"><span class="${"icon svelte-11nld0p"}">${validate_component(Icon, "Icon").$$render($$result, { name: item.icon }, {}, {})}</span>
                                    <span class="${"name svelte-11nld0p"}">${escape(item.name)}</span></a>
                            </li>`;
  })}</ul>` : ``}</li>` : ``}</ul></nav>`;
});
const Navigation = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let expand;
  let $preferences, $$unsubscribe_preferences;
  let $advancedNavigation, $$unsubscribe_advancedNavigation;
  $$unsubscribe_preferences = subscribe(preferences, (value) => $preferences = value);
  let { open = false } = $$props;
  const primaryNavigation = [
    {
      exactPath: true,
      icon: "layout",
      name: "Dashboard",
      path: "/"
    },
    {
      icon: "arrow-right",
      name: "Send & Receive",
      path: "/transfer"
    }
  ];
  const advancedNavigation = derived([activeBlockchain], ([$activeBlockchain]) => {
    const items = [];
    if ($activeBlockchain) {
      if (Array.from($activeBlockchain.chainFeatures).some((r) => resourceFeatures.includes(r))) {
        items.push({
          icon: "battery-charging",
          name: "Resources",
          path: "/resources"
        });
      }
    }
    return items;
  });
  $$unsubscribe_advancedNavigation = subscribe(advancedNavigation, (value) => $advancedNavigation = value);
  if ($$props.open === void 0 && $$bindings.open && open !== void 0)
    $$bindings.open(open);
  expand = $preferences.expandNavbar;
  $$unsubscribe_preferences();
  $$unsubscribe_advancedNavigation();
  return `${validate_component(Media_query, "MediaQuery").$$render($$result, { query: "(max-width: 999px)" }, {}, {
    default: ({ matches }) => {
      return `${!matches || open ? `${validate_component(Content, "NavigationContent").$$render(
        $$result,
        {
          primaryNavigation,
          advancedNavigation: $advancedNavigation,
          expand: matches || expand,
          floating: matches
        },
        {},
        {}
      )}` : ``}`;
    }
  })}`;
});
const button_svelte_svelte_type_style_lang = "";
const css$1b = {
  code: ".hamburger.svelte-1fp7cuz{cursor:pointer;color:var(--main-blue);padding:16px;margin:12px 6px}",
  map: null
};
const Button = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $activeSession, $$unsubscribe_activeSession;
  $$unsubscribe_activeSession = subscribe(activeSession, (value) => $activeSession = value);
  let { open = false } = $$props;
  if ($$props.open === void 0 && $$bindings.open && open !== void 0)
    $$bindings.open(open);
  $$result.css.add(css$1b);
  $$unsubscribe_activeSession();
  return `${validate_component(Media_query, "MediaQuery").$$render($$result, { query: "(max-width: 999px)" }, {}, {
    default: ({ matches }) => {
      return `${matches && $activeSession ? `<span class="${"hamburger svelte-1fp7cuz"}">${validate_component(Icon, "Icon").$$render($$result, { name: "menu", size: "large" }, {}, {})}</span>` : ``}`;
    }
  })}`;
});
const page_svelte_svelte_type_style_lang = "";
const css$1a = {
  code: '.dimmer.svelte-gmrtga.svelte-gmrtga{display:none;position:fixed;height:100vh;width:100vw;top:0;right:0;bottom:0;left:0;z-index:1001 !important;background-color:rgba(0, 0, 0, 0.5)}.dimmer.active.svelte-gmrtga.svelte-gmrtga{display:block}.grid.svelte-gmrtga.svelte-gmrtga{display:grid;column-gap:4em;row-gap:calc(4em / 2);grid-template-columns:268px auto 0;grid-template-rows:78px minmax(0, auto);grid-template-areas:"leftbar header" "leftbar main"}.grid.withoutsidebar.svelte-gmrtga.svelte-gmrtga{grid-template-rows:78px auto;grid-template-columns:100%;grid-template-areas:"header" "main"}.grid.withoutsidebar.svelte-gmrtga .page-header.svelte-gmrtga{left:0;right:0}.grid.navigation.svelte-gmrtga.svelte-gmrtga{max-height:100vh;overflow:hidden}.grid.noRowGap.svelte-gmrtga.svelte-gmrtga{row-gap:0}.grid.svelte-gmrtga .account-button{right:4em}.page-header.svelte-gmrtga.svelte-gmrtga{display:flex;grid-area:header;position:fixed;z-index:1000;top:0;left:calc(268px + 4em);right:4em;height:78px;background:var(--main-white)}.page-header.divider.svelte-gmrtga.svelte-gmrtga{border-bottom:1px solid var(--divider-grey)}.page-leftbar.svelte-gmrtga.svelte-gmrtga{min-height:100vh;grid-area:leftbar;position:fixed;left:0}.page-main.svelte-gmrtga.svelte-gmrtga{min-height:calc(100vh - 78px - 4em);padding-bottom:4em;grid-area:main}.page-main.svelte-gmrtga>.svelte-gmrtga{margin:0 auto;max-width:1200px}@media only screen and (max-width: 999px){.grid.svelte-gmrtga.svelte-gmrtga{grid-template-rows:78px auto;grid-template-columns:100vw;grid-template-areas:"header" "main"}.page-leftbar.svelte-gmrtga.svelte-gmrtga{min-height:auto;position:absolute}.page-header.svelte-gmrtga.svelte-gmrtga{top:0;left:0;right:0}.page-main.svelte-gmrtga.svelte-gmrtga{min-height:calc(100vh - 78px - 4em)}.page-main.svelte-gmrtga .header.svelte-gmrtga{padding:0 25px}.page-main.svelte-gmrtga .content.svelte-gmrtga{padding:0}}@media only screen and (max-width: 600px){.page-header.svelte-gmrtga.svelte-gmrtga{left:0;right:0}}',
  map: null
};
const Page$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$slots = compute_slots(slots);
  let $activeSession, $$unsubscribe_activeSession;
  $$unsubscribe_activeSession = subscribe(activeSession, (value) => $activeSession = value);
  let { title = "" } = $$props;
  let { subtitle = "" } = $$props;
  let { displayNavigation = true } = $$props;
  let { divider = true } = $$props;
  let accountSidebar = false;
  let navigationSidebar = false;
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  if ($$props.subtitle === void 0 && $$bindings.subtitle && subtitle !== void 0)
    $$bindings.subtitle(subtitle);
  if ($$props.displayNavigation === void 0 && $$bindings.displayNavigation && displayNavigation !== void 0)
    $$bindings.displayNavigation(displayNavigation);
  if ($$props.divider === void 0 && $$bindings.divider && divider !== void 0)
    $$bindings.divider(divider);
  $$result.css.add(css$1a);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `<div class="${[
      "grid svelte-gmrtga",
      (accountSidebar || navigationSidebar ? "navigation" : "") + " " + (!displayNavigation || !$activeSession ? "withoutsidebar" : "") + " " + (!divider ? "noRowGap" : "")
    ].join(" ").trim()}"><div class="${["dimmer svelte-gmrtga", accountSidebar || navigationSidebar ? "active" : ""].join(" ").trim()}"></div>

    ${displayNavigation && $activeSession ? `<aside class="${"page-leftbar svelte-gmrtga"}">${validate_component(Navigation, "NavigationSidebar").$$render(
      $$result,
      { open: navigationSidebar },
      {
        open: ($$value) => {
          navigationSidebar = $$value;
          $$settled = false;
        }
      },
      {}
    )}</aside>` : ``}

    <header class="${["page-header svelte-gmrtga", divider ? "divider" : ""].join(" ").trim()}">${validate_component(Button, "NavigationSidebarButton").$$render(
      $$result,
      { open: navigationSidebar },
      {
        open: ($$value) => {
          navigationSidebar = $$value;
          $$settled = false;
        }
      },
      {}
    )}
        ${$$slots.submenu ? `<div class="${"submenu"}">${slots.submenu ? slots.submenu({}) : ``}</div>` : ``}
        ${validate_component(Button$1, "AccountSidebarButton").$$render(
      $$result,
      { open: accountSidebar },
      {
        open: ($$value) => {
          accountSidebar = $$value;
          $$settled = false;
        }
      },
      {}
    )}</header>
    ${validate_component(Sidebar, "AccountSidebar").$$render(
      $$result,
      { open: accountSidebar },
      {
        open: ($$value) => {
          accountSidebar = $$value;
          $$settled = false;
        }
      },
      {}
    )}

    <div class="${"page-main svelte-gmrtga"}"><div class="${"header svelte-gmrtga"}">${title ? `<div class="${"title"}">${validate_component(Header, "Header").$$render($$result, { title, subtitle }, {}, {})}</div>` : ``}
            ${$$slots.controls ? `<div class="${"controls"}">${slots.controls ? slots.controls({}) : ``}</div>` : ``}</div>
        <div class="${"content svelte-gmrtga"}">${slots.default ? slots.default({}) : ``}</div></div></div>`;
  } while (!$$settled);
  $$unsubscribe_activeSession();
  return $$rendered;
});
const Features = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let viewBox;
  let { portion = void 0 } = $$props;
  if ($$props.portion === void 0 && $$bindings.portion && portion !== void 0)
    $$bindings.portion(portion);
  viewBox = portion === "left" ? "0 -20 186.5 140" : portion === "center" ? "270 0 250 104" : portion === "right" ? "576 0 267 104" : "0 0 812 104";
  return `<svg${add_attribute("viewBox", viewBox, 0)} fill="${"none"}" xmlns="${"http://www.w3.org/2000/svg"}">${!portion ? `<path d="${"M105 41H188.705L197.474 50H629"}" stroke="${"url(#paint0_linear_4_244)"}"></path>` : ``}<path fill-rule="${"evenodd"}" clip-rule="${"evenodd"}" d="${"M100 12H46C43.2386 12 41 14.2386 41 17V18.7929L46 23.7929V22.8696H46.5H47V24.7929L52.2071 30H62V31H52H51.7929L51.6464 30.8536L41 20.2071V41.5H50V42.5H47V44.4597H46.5H46V42.5H41V66.8107C41 66.9654 41.0072 67.1192 41.0213 67.2716L45.6464 62.6464L45.7929 62.5H46V62.1244H46.5H47V62.5H56V63.5H47V64.0871H46.5H46V63.7071L41.2714 68.4357C41.6111 69.4238 42.2567 70.2946 43.1358 70.909L70.1358 89.7783C71.856 90.9805 74.144 90.9805 75.8642 89.7783L102.864 70.909C104.203 69.9736 105 68.4436 105 66.8107V57.5H84V56.5H105V28H100V28.7578H99.5H99V28H84V27H99V26.7951H99.5H100V27H105V17C105 14.2386 102.761 12 100 12ZM106 56.5V28H115.5H115.707L115.854 27.8536L130.207 13.5H140V12.5H130H129.793L129.646 12.6464L115.293 27H106V17C106 13.6863 103.314 11 100 11H46C42.6863 11 40 13.6863 40 17V17.7929L37.8536 15.6464L37.7071 15.5H37.5H6V16.5H37.2929L40 19.2071V41.5H32.5H32.2929L32.1464 41.6464L17.7929 56H8V57H18H18.2071L18.3536 56.8536L32.7071 42.5H40V66.8107C40 67.2639 40.0512 67.7105 40.1497 68.1431L31.2929 77H0V78H31.5H31.7071L31.8536 77.8536L40.4995 69.2076C40.9356 70.2082 41.6427 71.0855 42.563 71.7287L69.563 90.598C71.6273 92.0406 74.3727 92.0406 76.437 90.598L103.437 71.7287C105.043 70.6062 106 68.7702 106 66.8107V57.5H115.293L129.646 71.8536L129.793 72H130H139.584C140.599 84.0426 150.695 93.5 163 93.5C175.979 93.5 186.5 82.9787 186.5 70C186.5 57.0213 175.979 46.5 163 46.5C150.021 46.5 139.5 57.0213 139.5 70C139.5 70.335 139.507 70.6684 139.521 71H130.207L115.854 56.6464L115.707 56.5H115.5H106ZM99.1562 67.6553L100 67.0312V66.0499H99.5H99V66.5271L98.5616 66.8513L98.8589 67.2533L99.1562 67.6553ZM100 17V16.9814V16.5V16H99.5H99.0357H99V16.9814H99.0357V17H100ZM47 16H46.9643H46.5H46V16.5V16.9814V17H46.9643V16.9814H47V16ZM46 66.0499H46.5H47V66.5271L47.4384 66.8513L47.1411 67.2533L46.8438 67.6553L46 67.0312V66.0499ZM48.5312 68.9033L48.8286 68.5013L49.1259 68.0993L50.8134 69.3474L50.5161 69.7494L50.2188 70.1514L48.5312 68.9033ZM51.9062 71.3994L52.2036 70.9974L52.5009 70.5954L54.1884 71.8435L53.8911 72.2455L53.5938 72.6475L51.9062 71.3994ZM55.2812 73.8955L55.5786 73.4935L55.8759 73.0915L57.5634 74.3396L57.2661 74.7416L56.9688 75.1436L55.2812 73.8955ZM58.6562 76.3916L58.9536 75.9896L59.2509 75.5876L60.9384 76.8356L60.6411 77.2376L60.3438 77.6396L58.6562 76.3916ZM62.0312 78.8877L62.3286 78.4857L62.6259 78.0837L64.3134 79.3317L64.0161 79.7337L63.7188 80.1357L62.0312 78.8877ZM65.4062 81.3838L65.7036 80.9818L66.0009 80.5798L67.6884 81.8278L67.3911 82.2298L67.0938 82.6318L65.4062 81.3838ZM68.7812 83.8799L69.0786 83.4779L69.3759 83.0759L71.0634 84.3239L70.7661 84.7259L70.4688 85.1279L68.7812 83.8799ZM72.1562 86.376L72.4536 85.974L72.7509 85.572L73 85.7562L73.2491 85.572L73.5464 85.974L73.8438 86.376L73 87L72.1562 86.376ZM75.5312 85.1279L75.2339 84.7259L74.9366 84.3239L76.6241 83.0759L76.9214 83.4779L77.2188 83.8799L75.5312 85.1279ZM80.5938 81.3838L80.2964 80.9818L79.9991 80.5798L78.3116 81.8278L78.6089 82.2298L78.9062 82.6318L80.5938 81.3838ZM82.2812 80.1357L83.9688 78.8877L83.6714 78.4857L83.3741 78.0837L81.6866 79.3317L81.9839 79.7337L82.2812 80.1357ZM85.6562 77.6396L87.3438 76.3916L87.0464 75.9896L86.7491 75.5876L85.0616 76.8356L85.3589 77.2376L85.6562 77.6396ZM89.0312 75.1436L88.7339 74.7416L88.4366 74.3396L90.1241 73.0915L90.4214 73.4935L90.7188 73.8955L89.0312 75.1436ZM92.4062 72.6475L92.1089 72.2455L91.8116 71.8435L93.4991 70.5954L93.7964 70.9974L94.0938 71.3994L92.4062 72.6475ZM95.7812 70.1514L95.4839 69.7494L95.1866 69.3474L96.8741 68.0993L97.1714 68.5013L97.4688 68.9033L95.7812 70.1514ZM46 60.1617H46.5H47V58.1989H46.5H46V60.1617ZM46 56.2362H46.5H47V54.2734H46.5H46V56.2362ZM46 52.3107H46.5H47V50.348H46.5H46V52.3107ZM46 48.3852H46.5H47V46.4225H46.5H46V48.3852ZM46 40.5343H46.5H47V38.5715H46.5H46V40.5343ZM46 36.6088H46.5H47V34.646H46.5H46V36.6088ZM46 32.6833H46.5H47V30.7206H46.5H46V32.6833ZM46 28.7578H46.5H47V26.7951H46.5H46V28.7578ZM46 20.9069H46.5H47V18.9441H46.5H46V20.9069ZM48.8929 16V16.5V17H50.8214V16.5V16H48.8929ZM52.75 16V16.5V17H54.6786V16.5V16H52.75ZM56.6071 16V16.5V17H58.5357V16.5V16H56.6071ZM60.4643 16V16.5V17H62.3929V16.5V16H60.4643ZM64.3214 16V16.5V17H66.25V16.5V16H64.3214ZM68.1786 16V16.5V17H70.1071V16.5V16H68.1786ZM72.0357 16V16.5V17H73.9643V16.5V16H72.0357ZM75.8929 16V16.5V17H77.8214V16.5V16H75.8929ZM79.75 16V16.5V17H81.6786V16.5V16H79.75ZM83.6071 16V16.5V17H85.5357V16.5V16H83.6071ZM87.4643 16V16.5V17H89.3929V16.5V16H87.4643ZM91.3214 16V16.5V17H93.25V16.5V16H91.3214ZM95.1786 16V16.5V17H97.1071V16.5V16H95.1786ZM100 18.9441H99.5H99V20.9068H99.5H100V18.9441ZM100 22.8696H99.5H99V24.8323H99.5H100V22.8696ZM100 30.7206H99.5H99V32.6833H99.5H100V30.7206ZM100 34.646H99.5H99V36.6088H99.5H100V34.646ZM100 38.5715H99.5H99V40.5343H99.5H100V38.5715ZM100 42.497H99.5H99V44.4597H99.5H100V42.497ZM100 46.4225H99.5H99V48.3852H99.5H100V46.4225ZM100 50.348H99.5H99V52.3107H99.5H100V50.348ZM100 54.2734H99.5H99V56.2362H99.5H100V54.2734ZM100 58.1989H99.5H99V60.1617H99.5H100V58.1989ZM100 62.1244H99.5H99V64.0871H99.5H100V62.1244ZM68 47H69H77H78H79C79.5523 47 80 47.4477 80 48V56C80 56.5523 79.5523 57 79 57H67C66.4477 57 66 56.5523 66 56V48C66 47.4477 66.4477 47 67 47H68ZM69 46H70H76H77V45V40C77 37.7909 75.2091 36 73 36C70.7909 36 69 37.7909 69 40V45V46ZM78 40C78 37.2386 75.7614 35 73 35C70.2386 35 68 37.2386 68 40V45V46H67C65.8954 46 65 46.8954 65 48V56C65 57.1046 65.8954 58 67 58H79C80.1046 58 81 57.1046 81 56V48C81 46.8954 80.1046 46 79 46H78V45V40ZM140.5 70C140.5 57.5736 150.574 47.5 163 47.5C175.426 47.5 185.5 57.5736 185.5 70C185.5 82.4264 175.426 92.5 163 92.5C150.574 92.5 140.5 82.4264 140.5 70ZM161.9 56.8155C162.104 56.3932 162.532 56.125 163.002 56.125C163.471 56.125 163.899 56.3932 164.104 56.8155L170.813 70.65H168.09L167.112 68.6318L166.975 68.35H166.662H159.342H159.029L158.892 68.6318L157.913 70.65H155.19L161.9 56.8155ZM163.002 55.125C162.149 55.125 161.372 55.6121 161 56.3791L153.942 70.9318L153.594 71.65H154.392H158.226H158.54L158.676 71.3682L159.655 69.35H166.349L167.327 71.3682L167.464 71.65H167.777H171.611H172.41L172.061 70.9318L165.004 56.3791C164.632 55.6121 163.854 55.125 163.002 55.125ZM163.452 61.085L163.002 60.1573L162.552 61.085L160.286 65.7568L159.938 66.475H160.736H165.268H166.066L165.717 65.7568L163.452 61.085ZM164.469 65.475H161.534L163.002 62.449L164.469 65.475ZM161.775 73.7375C161.775 73.061 162.324 72.5125 163 72.5125C163.677 72.5125 164.225 73.061 164.225 73.7375V80.6375V81.3395L164.889 81.11C166.888 80.4182 168.367 78.6562 168.635 76.5375H171.099C170.743 80.6609 167.24 83.875 163.002 83.875C158.764 83.875 155.26 80.6609 154.905 76.5375H157.369C157.636 78.6549 159.114 80.416 161.111 81.1087L161.775 81.3388V80.6363V73.7375ZM163 71.5125C161.771 71.5125 160.775 72.5087 160.775 73.7375V79.8745C159.357 79.1207 158.392 77.6716 158.328 76.0184L158.31 75.5375H157.829H154.377H153.866L153.877 76.0487C153.987 80.9704 158.059 84.875 163.002 84.875C167.944 84.875 172.016 80.9704 172.126 76.0487L172.138 75.5375H171.626H168.175H167.694L167.675 76.0184C167.612 77.673 166.646 79.1231 165.225 79.8764V73.7375C165.225 72.5087 164.229 71.5125 163 71.5125Z"}" fill="${"url(#paint0_linear_4_244)"}"></path><path fill-rule="${"evenodd"}" clip-rule="${"evenodd"}" d="${"M321 14H371C372.657 14 374 15.3431 374 17V49.5L368 49.5H364H318V17C318 15.3431 319.343 14 321 14ZM318 50.5V87C318 88.6569 319.343 90 321 90H371C372.657 90 374 88.6569 374 87V50.5L368 50.5H364H318ZM375 50.5V49.5V17C375 14.7909 373.209 13 371 13H321C318.791 13 317 14.7909 317 17V87C317 89.2091 318.791 91 321 91H371C373.209 91 375 89.2091 375 87V50.5ZM414 49.5C414 57.5393 407.701 64 400 64C392.299 64 386 57.5393 386 49.5C386 41.4607 392.299 35 400 35C407.701 35 414 41.4607 414 49.5ZM415 49.5C415 58.0604 408.284 65 400 65C391.716 65 385 58.0604 385 49.5C385 40.9396 391.716 34 400 34C408.284 34 415 40.9396 415 49.5ZM427 57C430.81 57 434 53.7001 434 49.5C434 45.2999 430.81 42 427 42C423.19 42 420 45.2999 420 49.5C420 53.7001 423.19 57 427 57ZM427 58C431.418 58 435 54.1944 435 49.5C435 44.8056 431.418 41 427 41C422.582 41 419 44.8056 419 49.5C419 54.1944 422.582 58 427 58ZM365.063 41.5C365.285 42.3626 366.068 43 367 43C368.105 43 369 42.1046 369 41C369 39.8954 368.105 39 367 39C366.068 39 365.285 39.6374 365.063 40.5H356V41.5H365.063ZM366 41C366 40.4477 366.448 40 367 40C367.552 40 368 40.4477 368 41C368 41.5523 367.552 42 367 42C366.448 42 366 41.5523 366 41ZM450.358 41.379C455.012 46.0329 455.012 53.5784 450.358 58.2323L451.065 58.9394C456.11 53.8949 456.11 45.7163 451.065 40.6719L450.358 41.379ZM459.134 67.0069C468.637 57.5038 468.637 42.0963 459.134 32.5933L459.841 31.8862C469.734 41.7798 469.734 57.8204 459.841 67.714L459.134 67.0069ZM467.919 23.8178C482.272 38.17 482.272 61.4395 467.919 75.7917L468.626 76.4988C483.369 61.7561 483.369 37.8534 468.626 23.1107L467.919 23.8178ZM441.902 51.2963C442.724 52.1181 444.056 52.1181 444.878 51.2963C445.7 50.4745 445.7 49.1422 444.878 48.3204C444.056 47.4987 442.724 47.4987 441.902 48.3204C441.081 49.1422 441.081 50.4745 441.902 51.2963ZM441.195 52.0034C442.408 53.2157 444.373 53.2157 445.585 52.0034C446.798 50.7911 446.798 48.8256 445.585 47.6133C444.373 46.401 442.408 46.401 441.195 47.6133C439.983 48.8256 439.983 50.7911 441.195 52.0034ZM329 24H328V25V31V32H329H335H336V31V25V24H335H329ZM329 25H330H334H335V26V30V31H334H330H329V30V26V25ZM341 30H342H344H345V29V27V26H344H342H341V27V29V30ZM343 29H342V28V27H343H344V28V29H343ZM331 30H330V29V27V26H331H333H334V27V29V30H333H331ZM331 29H332H333V28V27H332H331V28V29ZM355 61C351.474 61 348.556 63.6077 348.071 67H363.929C363.444 63.6077 360.526 61 357 61H355ZM364.938 67C364.446 63.0537 361.08 60 357 60H355C350.92 60 347.554 63.0537 347.062 67C347.021 67.3276 347 67.6613 347 68H348H364H365C365 67.6613 364.979 67.3276 364.938 67ZM364 76H365C365 76.3425 364.966 76.6769 364.9 77C364.437 79.2822 362.419 81 360 81H352C349.581 81 347.563 79.2822 347.1 77C347.034 76.6769 347 76.3425 347 76H348H364ZM352 80C350.136 80 348.57 78.7252 348.126 77H363.874C363.43 78.7252 361.864 80 360 80H352ZM349.412 70.5C349.318 70.5 349.233 70.554 349.193 70.6387L348.452 72.2129L347.548 71.7871L348.288 70.2129C348.493 69.7777 348.931 69.5 349.412 69.5C349.893 69.5 350.33 69.7777 350.535 70.2129L351.076 71.3613C351.115 71.446 351.201 71.5 351.294 71.5C351.388 71.5 351.473 71.446 351.513 71.3613L352.053 70.2129C352.258 69.7777 352.696 69.5 353.176 69.5C353.657 69.5 354.095 69.7777 354.3 70.2129L354.84 71.3613C354.88 71.446 354.965 71.5 355.059 71.5C355.152 71.5 355.238 71.446 355.277 71.3613L355.818 70.2129C356.023 69.7777 356.46 69.5 356.941 69.5C357.422 69.5 357.86 69.7777 358.065 70.2129L358.605 71.3613C358.645 71.446 358.73 71.5 358.824 71.5C358.917 71.5 359.002 71.446 359.042 71.3613L359.583 70.2129C359.787 69.7777 360.225 69.5 360.706 69.5C361.187 69.5 361.624 69.7777 361.829 70.2129L362.37 71.3613C362.41 71.446 362.495 71.5 362.588 71.5C362.682 71.5 362.767 71.446 362.807 71.3613L363.548 69.7871L364.452 70.2129L363.712 71.7871C363.507 72.2223 363.069 72.5 362.588 72.5C362.107 72.5 361.67 72.2223 361.465 71.7871L360.924 70.6387C360.885 70.554 360.799 70.5 360.706 70.5C360.612 70.5 360.527 70.554 360.487 70.6387L359.947 71.7871C359.742 72.2223 359.304 72.5 358.824 72.5C358.343 72.5 357.905 72.2223 357.7 71.7871L357.16 70.6387C357.12 70.554 357.035 70.5 356.941 70.5C356.848 70.5 356.762 70.554 356.723 70.6387L356.182 71.7871C355.977 72.2223 355.54 72.5 355.059 72.5C354.578 72.5 354.14 72.2223 353.935 71.7871L353.395 70.6387C353.355 70.554 353.27 70.5 353.176 70.5C353.083 70.5 352.998 70.554 352.958 70.6387L352.417 71.7871C352.213 72.2223 351.775 72.5 351.294 72.5C350.813 72.5 350.376 72.2223 350.171 71.7871L349.63 70.6387C349.59 70.554 349.505 70.5 349.412 70.5ZM347 74.5H365V73.5H347V74.5ZM330 41H331H333H334V40V38V37H333H331H330V38V40V41ZM332 40H331V39V38H332H333V39V40H332ZM327 23H348V44H327V23ZM326 22H327H348H349V23V44V45H348H327H326V44V23V22ZM337 24H338V32H337V24ZM338 35H337V43H338V35ZM347 33V34H339V33H347ZM336 33H328V34H336V33ZM339 24H340H346H347V25V31V32H346H340H339V31V25V24ZM341 25H340V26V30V31H341H345H346V30V26V25H345H341ZM329 35H328V36V42V43H329H335H336V42V36V35H335H329ZM329 36H330H334H335V37V41V42H334H330H329V41V37V36ZM339.5 35.5H340H341.5V36.5H340.5V37.5H339.5V36V35.5ZM344.5 35.5H346H346.5V36V37.5H345.5V36.5H344.5V35.5ZM339.5 40.5V42V42.5H340H341.5V41.5H340.5V40.5H339.5ZM346.5 40.5V42V42.5H346H344.5V41.5H345.5V40.5H346.5Z"}" fill="${"url(#paint0_linear_4_244)"}"></path><path fill-rule="${"evenodd"}" clip-rule="${"evenodd"}" d="${"M642 14H773C793.987 14 811 31.0132 811 52C811 72.9868 793.987 90 773 90H642C621.013 90 604 72.9868 604 52C604 31.0132 621.013 14 642 14ZM603 52C603 30.4609 620.461 13 642 13H773C794.539 13 812 30.4609 812 52C812 73.5391 794.539 91 773 91H642C620.461 91 603 73.5391 603 52ZM641 80C656.448 80 669 67.2563 669 51.5C669 35.7437 656.448 23 641 23C625.552 23 613 35.7437 613 51.5C613 67.2563 625.552 80 641 80ZM641 81C657.016 81 670 67.7924 670 51.5C670 35.2076 657.016 22 641 22C624.984 22 612 35.2076 612 51.5C612 67.7924 624.984 81 641 81ZM658.742 38.2421L658.964 37.6857L658.036 37.3143L657.813 37.8707C655.004 44.8944 648.201 49.5 640.636 49.5H626V50.5H640.636C648.61 50.5 655.78 45.6455 658.742 38.2421ZM699.375 52L693.6 44.3L694.4 43.7L700.4 51.7L700.625 52L700.4 52.3L694.4 60.3L693.6 59.7L699.375 52ZM705.6 44.3L711.375 52L705.6 59.7L706.4 60.3L712.4 52.3L712.625 52L712.4 51.7L706.4 43.7L705.6 44.3ZM723.375 52L717.6 44.3L718.4 43.7L724.4 51.7L724.625 52L724.4 52.3L718.4 60.3L717.6 59.7L723.375 52ZM623.5 40.7895C623.5 38.9979 625.041 37.5 627 37.5C628.959 37.5 630.5 38.9979 630.5 40.7895V43H631.5V40.7895C631.5 38.3953 629.459 36.5 627 36.5C624.541 36.5 622.5 38.3953 622.5 40.7895V43H623.5V40.7895ZM642 37.5C640.041 37.5 638.5 38.9979 638.5 40.7895V43H637.5V40.7895C637.5 38.3953 639.541 36.5 642 36.5C644.459 36.5 646.5 38.3953 646.5 40.7895V43H645.5V40.7895C645.5 38.9979 643.959 37.5 642 37.5ZM762.981 62.3489L786.358 38.3489L785.642 37.6511L762.623 61.2834L755.358 53.825L754.642 54.5228L762.265 62.3489L762.623 62.7166L762.981 62.3489Z"}" fill="${"url(#paint0_linear_4_244)"}"></path><defs><linearGradient id="${"paint0_linear_4_244"}" x1="${"-15"}" y1="${"47.289"}" x2="${"819"}" y2="${"47.2891"}" gradientUnits="${"userSpaceOnUse"}"><stop stop-color="${"#669BBC"}"></stop><stop offset="${"0.380208"}" stop-color="${"#9D2C7A"}"></stop><stop offset="${"0.708333"}" stop-color="${"#FFA253"}"></stop><stop offset="${"1"}" stop-color="${"#62D385"}"></stop></linearGradient></defs></svg>`;
});
const ColorPicker_svelte_svelte_type_style_lang = "";
const css$19 = {
  code: '.text-input.svelte-w9go3q.svelte-w9go3q{border:1px #ccc solid;border-radius:5px;padding:3px;width:60px;margin:0}.color-picker.svelte-w9go3q.svelte-w9go3q{display:flex;flex-direction:row;justify-content:space-between;height:90px}.color-selectors.svelte-w9go3q.svelte-w9go3q{display:flex;flex-direction:column;justify-content:space-between}.color-component.svelte-w9go3q.svelte-w9go3q{display:flex;flex-direction:row;font-size:12px;align-items:center;justify-content:center}.color-component.svelte-w9go3q strong.svelte-w9go3q{width:40px}.color-component.svelte-w9go3q input[type="range"].svelte-w9go3q{margin:0 0 0 10px}.color-component.svelte-w9go3q input[type="number"].svelte-w9go3q{width:50px;margin:0 0 0 10px}.color-preview.svelte-w9go3q.svelte-w9go3q{font-size:12px;display:flex;flex-direction:column;align-items:center;justify-content:space-between}.preview.svelte-w9go3q.svelte-w9go3q{height:60px;width:60px}',
  map: null
};
const ColorPicker = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let rgb;
  const dispatch = createEventDispatcher();
  let { color } = $$props;
  let red = 0;
  let green = 0;
  let blue = 0;
  let hex = null;
  const parseColor = (input) => {
    if (typeof input !== "string") {
      return;
    }
    let colorComponents = [];
    if (input[0] === "#") {
      colorComponents = input.length === 4 ? [input.slice(1, 2), input.slice(2, 3), input.slice(3, 4)].map((n) => parseInt(`${n}${n}`, 16)) : [input.slice(1, 3), input.slice(3, 5), input.slice(5, 7)].map((n) => parseInt(n, 16));
    } else if (input.startsWith("rgb")) {
      colorComponents = input.match(/\d+/g).map((n) => parseInt(n));
    }
    if (colorComponents.length) {
      red = colorComponents[0];
      green = colorComponents[1];
      blue = colorComponents[2];
    }
  };
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  $$result.css.add(css$19);
  {
    parseColor(color);
  }
  hex = "#" + (red | 1 << 8).toString(16).slice(1) + (green | 1 << 8).toString(16).slice(1) + (blue | 1 << 8).toString(16).slice(1);
  rgb = `rgb(${red}, ${green}, ${blue})`;
  {
    {
      dispatch("color", { hex, rgb });
    }
  }
  return `<div class="${"color-picker svelte-w9go3q"}"><div class="${"color-selectors svelte-w9go3q"}"><div class="${"color-component svelte-w9go3q"}"><strong class="${"svelte-w9go3q"}">Red</strong>
      <input type="${"range"}" min="${"0"}" max="${"255"}" class="${"svelte-w9go3q"}"${add_attribute("value", red, 0)}>
      <input class="${"text-input svelte-w9go3q"}" type="${"number"}"${add_attribute("value", red, 0)}></div>
    <div class="${"color-component svelte-w9go3q"}"><strong class="${"svelte-w9go3q"}">Green</strong>
      <input type="${"range"}" min="${"0"}" max="${"255"}" class="${"svelte-w9go3q"}"${add_attribute("value", green, 0)}>
      <input class="${"text-input svelte-w9go3q"}" type="${"number"}"${add_attribute("value", green, 0)}></div>
    <div class="${"color-component svelte-w9go3q"}"><strong class="${"svelte-w9go3q"}">Blue</strong>
      <input type="${"range"}" min="${"0"}" max="${"255"}" class="${"svelte-w9go3q"}"${add_attribute("value", blue, 0)}>
      <input class="${"text-input svelte-w9go3q"}" type="${"number"}"${add_attribute("value", blue, 0)}></div></div>
  <div class="${"color-preview svelte-w9go3q"}"><div class="${"preview svelte-w9go3q"}" style="${"background: " + escape(rgb)}"></div>
    <div><input class="${"text-input svelte-w9go3q"}" type="${"text"}"${add_attribute("value", hex, 0)}></div></div></div>`;
});
const Info_svelte_svelte_type_style_lang = "";
const css$18 = {
  code: "h4.svelte-1gm5gmt{font-size:0.85rem;padding:5px;margin:0}.property.svelte-1gm5gmt{display:flex;flex-direction:row;font-size:0.75rem;align-items:center;justify-content:space-between;padding:3px 5px}.label.svelte-1gm5gmt{display:block;color:#999}.value.svelte-1gm5gmt{display:block;color:#666}",
  map: null
};
const Info = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { animationData } = $$props;
  let author;
  let frameRate;
  let generator;
  let keywords;
  let numAssets;
  let numFonts;
  let numFrames;
  let numLayers;
  let themeColor;
  let version2;
  let hasMeta = false;
  if ($$props.animationData === void 0 && $$bindings.animationData && animationData !== void 0)
    $$bindings.animationData(animationData);
  $$result.css.add(css$18);
  {
    {
      if (animationData) {
        frameRate = animationData.fr;
        numAssets = animationData.assets ? animationData.assets.length : 0;
        numFonts = animationData.fonts ? animationData.fonts.length : 0;
        numFrames = animationData.op - animationData.ip;
        numLayers = animationData.layers ? animationData.layers.length : 0;
        version2 = animationData.v;
        if (animationData.meta) {
          hasMeta = true;
          author = animationData.meta.a;
          generator = animationData.meta.g;
          keywords = animationData.meta.k;
          themeColor = animationData.meta.tc;
        }
      }
    }
  }
  return `<h4 class="${"svelte-1gm5gmt"}">Info</h4>

${version2 ? `<div class="${"property svelte-1gm5gmt"}"><span class="${"label svelte-1gm5gmt"}">Lottie Version</span>
    <span class="${"value svelte-1gm5gmt"}">${escape(version2)}</span></div>` : ``}

${numFrames ? `<div class="${"property svelte-1gm5gmt"}"><span class="${"label svelte-1gm5gmt"}">Frames</span>
    <span class="${"value svelte-1gm5gmt"}">${escape(numFrames)}</span></div>` : ``}

${frameRate ? `<div class="${"property svelte-1gm5gmt"}"><span class="${"label svelte-1gm5gmt"}">Frame Rate</span>
    <span class="${"value svelte-1gm5gmt"}">${escape(frameRate)}</span></div>` : ``}

${numLayers ? `<div class="${"property svelte-1gm5gmt"}"><span class="${"label svelte-1gm5gmt"}">Layers</span>
    <span class="${"value svelte-1gm5gmt"}">${escape(numLayers)}</span></div>` : ``}

${numAssets ? `<div class="${"property svelte-1gm5gmt"}"><span class="${"label svelte-1gm5gmt"}">Assets</span>
    <span class="${"value svelte-1gm5gmt"}">${escape(numAssets)}</span></div>` : ``}

${numFonts ? `<div class="${"property svelte-1gm5gmt"}"><span class="${"label svelte-1gm5gmt"}">Fonts</span>
    <span class="${"value svelte-1gm5gmt"}">${escape(numFonts)}</span></div>` : ``}

${hasMeta ? `<hr>

  ${generator ? `<div class="${"property svelte-1gm5gmt"}"><span class="${"label svelte-1gm5gmt"}">Generator</span>
      <span class="${"value svelte-1gm5gmt"}">${escape(generator)}</span></div>` : ``}

  ${author ? `<div class="${"property svelte-1gm5gmt"}"><span class="${"label svelte-1gm5gmt"}">Author</span>
      <span class="${"value svelte-1gm5gmt"}">${escape(author)}</span></div>` : ``}

  ${keywords ? `<div class="${"property svelte-1gm5gmt"}"><span class="${"label svelte-1gm5gmt"}">Keywords</span>
      <span class="${"value svelte-1gm5gmt"}">${escape(keywords)}</span></div>` : ``}

  ${themeColor ? `<div class="${"property svelte-1gm5gmt"}"><span class="${"label svelte-1gm5gmt"}">Theme Color</span>
      <span class="${"value svelte-1gm5gmt"}">${escape(themeColor)}</span></div>` : ``}` : ``}`;
});
const Popover_svelte_svelte_type_style_lang = "";
const css$17 = {
  code: '.popover.svelte-cq7jp3.svelte-cq7jp3{position:relative}.popover-content.svelte-cq7jp3.svelte-cq7jp3{display:inline-block;position:absolute;opacity:1;visibility:visible;transform:translate(0, -10px);box-shadow:0 2px 5px 0 rgba(0, 0, 0, 0.26);transition:all 0.3s cubic-bezier(0.75, -0.02, 0.2, 0.97)}.popover-content.hidden.svelte-cq7jp3.svelte-cq7jp3{opacity:0;visibility:hidden;transform:translate(0, 0px)}.arrow.svelte-cq7jp3.svelte-cq7jp3{position:absolute;z-index:-1;content:"";bottom:-9px;border-style:solid;border-width:10px 10px 0px 10px}.left-align.svelte-cq7jp3.svelte-cq7jp3,.left-align.svelte-cq7jp3 .arrow.svelte-cq7jp3{left:0;right:unset}.right-align.svelte-cq7jp3.svelte-cq7jp3,.right-align.svelte-cq7jp3 .arrow.svelte-cq7jp3{right:0;left:unset}',
  map: null
};
const Popover = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { color = "transparent" } = $$props;
  let _triggerRef;
  let _contentRef;
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  $$result.css.add(css$17);
  return `<div class="${"popover svelte-cq7jp3"}"><div${add_attribute("this", _triggerRef, 0)}>${slots.target ? slots.target({}) : ``}</div>
  <div class="${[
    "popover-content svelte-cq7jp3",
    " left-align "
  ].join(" ").trim()}"${add_attribute("this", _contentRef, 0)}>${slots.content ? slots.content({}) : ``}
    <div class="${"arrow svelte-cq7jp3"}" style="${"border-color: " + escape(color) + " transparent transparent transparent;"}"></div></div></div>`;
});
const PlayerRender = {
  SVG: "svg",
  Canvas: "canvas"
};
const PlayerState = {
  Loading: "loading",
  Playing: "playing",
  Paused: "paused",
  Stopped: "stopped",
  Frozen: "frozen",
  Error: "error"
};
const PlayMode = {
  Normal: "normal",
  Bounce: "bounce"
};
const ControlsLayoutOptions = [
  "previousFrame",
  "playpause",
  "stop",
  "nextFrame",
  "progress",
  "frame",
  "loop",
  "spacer",
  "background",
  "snapshot",
  "info",
  "zoom"
];
const triggerDownload = (dataUri, filename) => {
  const element = document.createElement("a");
  element.href = dataUri;
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};
const Controls_svelte_svelte_type_style_lang = "";
const css$16 = {
  code: ".lottie-player-controls.svelte-9yox50.svelte-9yox50{align-items:center;display:flex;justify-content:space-between;padding:4px 8px;font-family:'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana,\n      sans-serif !important}.lottie-player-controls.svelte-9yox50>div.svelte-9yox50{margin-left:4px}.spacer.svelte-9yox50.svelte-9yox50{flex-grow:1;width:14px}.btn.svelte-9yox50.svelte-9yox50{cursor:pointer;fill:#999;width:14px}.btn.svelte-9yox50.svelte-9yox50:hover{fill:#222}.btn.active.svelte-9yox50.svelte-9yox50{fill:#555}.progress.svelte-9yox50.svelte-9yox50{-webkit-appearance:none;-moz-apperance:none;width:100%;margin:0 10px;height:4px;border-radius:3px;cursor:pointer}.progress.svelte-9yox50.svelte-9yox50:focus{outline:none;border:none}.progress.svelte-9yox50.svelte-9yox50::-moz-range-track{cursor:pointer;background:none;border:none;outline:none}.progress.svelte-9yox50.svelte-9yox50::-webkit-slider-thumb{-webkit-appearance:none !important;height:13px;width:13px;border:0;border-radius:50%;background:#0fccce;cursor:pointer}.progress.svelte-9yox50.svelte-9yox50::-moz-range-thumb{-moz-appearance:none !important;height:13px;width:13px;border:0;border-radius:50%;background:#0fccce;cursor:pointer}.progress.svelte-9yox50.svelte-9yox50::-ms-track{width:100%;height:3px;cursor:pointer;background:transparent;border-color:transparent;color:transparent}.progress.svelte-9yox50.svelte-9yox50::-ms-fill-lower{background:#ccc;border-radius:3px}.progress.svelte-9yox50.svelte-9yox50::-ms-fill-upper{background:#ccc;border-radius:3px}.progress.svelte-9yox50.svelte-9yox50::-ms-thumb{border:0;height:15px;width:15px;border-radius:50%;background:#0fccce;cursor:pointer}.progress.svelte-9yox50.svelte-9yox50:focus::-ms-fill-lower{background:#ccc}.progress.svelte-9yox50.svelte-9yox50:focus::-ms-fill-upper{background:#ccc}.popover.svelte-9yox50.svelte-9yox50{padding:10px;background:#fff;font-family:'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana,\n      sans-serif;font-size:0.75rem;border-radius:5px}.popover-snapshot.svelte-9yox50.svelte-9yox50{width:150px}.popover-snapshot.svelte-9yox50 h5.svelte-9yox50{margin:5px 0 10px 0;font-size:0.75rem}.popover-snapshot.svelte-9yox50 a.svelte-9yox50{display:block;text-decoration:none}.popover-snapshot.svelte-9yox50 a.svelte-9yox50:before{content:'\u297C';margin-right:5px}.popover-snapshot.svelte-9yox50 .note.svelte-9yox50{display:block;margin-top:10px;color:#999}.popover-info.svelte-9yox50.svelte-9yox50{width:250px}.frame-number.svelte-9yox50.svelte-9yox50{outline:none;border:1px #ccc solid;border-radius:3px;width:40px;text-align:center;color:#999;font-size:0.7rem;padding:0;font-family:inherit}.popover-background.svelte-9yox50.svelte-9yox50{width:350px}",
  map: null
};
const Controls = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let isPlaying;
  let isPaused;
  let isStopped;
  let formattedFrame;
  const ICON_SIZE = {
    width: 14,
    height: 14,
    viewBox: "0 0 24 24"
  };
  createEventDispatcher();
  let { animationData } = $$props;
  let { background } = $$props;
  let { currentState } = $$props;
  let { frame } = $$props;
  let { freeze } = $$props;
  let { instance } = $$props;
  let { layout = ControlsLayoutOptions } = $$props;
  let { loop: loop2 } = $$props;
  let { play } = $$props;
  let { progress } = $$props;
  let { seek } = $$props;
  let { snapshot } = $$props;
  let { stop } = $$props;
  let { toggleZoom } = $$props;
  let { toggleLooping } = $$props;
  let { togglePlay } = $$props;
  let { totalFrames = 0 } = $$props;
  if ($$props.animationData === void 0 && $$bindings.animationData && animationData !== void 0)
    $$bindings.animationData(animationData);
  if ($$props.background === void 0 && $$bindings.background && background !== void 0)
    $$bindings.background(background);
  if ($$props.currentState === void 0 && $$bindings.currentState && currentState !== void 0)
    $$bindings.currentState(currentState);
  if ($$props.frame === void 0 && $$bindings.frame && frame !== void 0)
    $$bindings.frame(frame);
  if ($$props.freeze === void 0 && $$bindings.freeze && freeze !== void 0)
    $$bindings.freeze(freeze);
  if ($$props.instance === void 0 && $$bindings.instance && instance !== void 0)
    $$bindings.instance(instance);
  if ($$props.layout === void 0 && $$bindings.layout && layout !== void 0)
    $$bindings.layout(layout);
  if ($$props.loop === void 0 && $$bindings.loop && loop2 !== void 0)
    $$bindings.loop(loop2);
  if ($$props.play === void 0 && $$bindings.play && play !== void 0)
    $$bindings.play(play);
  if ($$props.progress === void 0 && $$bindings.progress && progress !== void 0)
    $$bindings.progress(progress);
  if ($$props.seek === void 0 && $$bindings.seek && seek !== void 0)
    $$bindings.seek(seek);
  if ($$props.snapshot === void 0 && $$bindings.snapshot && snapshot !== void 0)
    $$bindings.snapshot(snapshot);
  if ($$props.stop === void 0 && $$bindings.stop && stop !== void 0)
    $$bindings.stop(stop);
  if ($$props.toggleZoom === void 0 && $$bindings.toggleZoom && toggleZoom !== void 0)
    $$bindings.toggleZoom(toggleZoom);
  if ($$props.toggleLooping === void 0 && $$bindings.toggleLooping && toggleLooping !== void 0)
    $$bindings.toggleLooping(toggleLooping);
  if ($$props.togglePlay === void 0 && $$bindings.togglePlay && togglePlay !== void 0)
    $$bindings.togglePlay(togglePlay);
  if ($$props.totalFrames === void 0 && $$bindings.totalFrames && totalFrames !== void 0)
    $$bindings.totalFrames(totalFrames);
  $$result.css.add(css$16);
  isPlaying = currentState === PlayerState.Playing;
  isPaused = currentState === PlayerState.Paused;
  isStopped = currentState === PlayerState.Stopped;
  formattedFrame = Math.round(frame);
  return `<div class="${"lottie-player-controls svelte-9yox50"}">${each(layout, (item) => {
    return `${item === "playpause" ? `<div class="${["btn svelte-9yox50", isPlaying || isPaused ? "active" : ""].join(" ").trim()}">${isPlaying ? `<svg${spread([escape_object(ICON_SIZE)], { classes: "svelte-9yox50" })}><rect height="${"22.9"}" rx="${"1.9"}" width="${"7.6"}" x="${"14"}" y="${".5"}"></rect><rect height="${"22.9"}" rx="${"1.9"}" width="${"7.6"}" x="${"2"}" y="${".5"}"></rect></svg>` : `<svg${spread([escape_object(ICON_SIZE)], { classes: "svelte-9yox50" })}><path d="${"M2 3.4C2 1.9 3.5 1 4.8 1.8l16.5 9.6c1.2.7 1.2 2.5 0 3.2L4.8 24.2C3.5 25 2 24.1 2 22.6V3.4z"}"></path></svg>`}
      </div>` : `${item === "stop" ? `<div class="${["btn svelte-9yox50", isStopped ? "active" : ""].join(" ").trim()}"><svg${spread([escape_object(ICON_SIZE)], { classes: "svelte-9yox50" })}><path d="${"M2 3.667A1.67 1.67 0 0 1 3.667 2h16.666A1.67 1.67 0 0 1 22 3.667v16.666A1.67 1.67 0 0 1 20.333\n            22H3.667A1.67 1.67 0 0 1 2 20.333z"}"></path></svg>
      </div>` : `${item === "progress" ? `<input class="${"progress svelte-9yox50"}" type="${"range"}" min="${"0"}" step="${"1"}" max="${"100"}"${add_attribute(
      "style",
      `
          background-image: -webkit-gradient(linear, left top, right top, color-stop(${progress}%, rgba(15, 204, 206, 0.4)), color-stop(${progress}%, #DAE1E7));
          background-image: -moz-linear-gradient(left center, rgba(15, 204, 206, 0.4) 0%, rgba(15, 204, 206, 0.4) ${progress}%, #DAE1E7 ${progress}%, #DAE1E7 100%);
        `,
      0
    )}${add_attribute("value", progress, 0)}>` : `${item === "loop" ? `<div class="${["btn svelte-9yox50", loop2 ? "active" : ""].join(" ").trim()}"><svg${spread([escape_object(ICON_SIZE)], { classes: "svelte-9yox50" })}><path d="${"M12.5 16.8137h-.13v1.8939h4.9696c3.6455 0 6.6113-2.9658 6.6113-6.6116\n            0-3.64549-2.9658-6.61131-6.6113-6.61131-.5231 0-.947.42391-.947.94696 0 .52304.4239.94696.947.94696 2.6011 0\n            4.7174 2.11634 4.7174 4.71739 0 2.6014-2.1166 4.7177-4.7174 4.7177H12.5zM13.6025\n            5.61469v-.13H7.48137C3.83582 5.48469.87 8.45051.87 12.096c0 3.6509 3.17269 6.6117 6.81304 6.6117.52304 0\n            .94696-.424.94696-.947 0-.5231-.42392-.947-.94696-.947-2.60804 0-4.91907-2.1231-4.91907-4.7176 0-2.60115\n            2.11634-4.71744 4.7174-4.71744h6.12113V5.61469z"}" stroke="${"#8795A1"}" stroke-width="${".26"}"></path><path d="${"M11.1482\n            2.20355h0l-.001-.00116c-.3412-.40061-.9405-.44558-1.33668-.0996h-.00001c-.39526.34519-.43936.94795-.09898\n            1.34767l2.51487 3.03683-2.51894 3.06468c-.33872.40088-.29282 1.00363.10347\n            1.34723l.08517-.0982-.08517.0982c.17853.1549.39807.2308.61647.2308.2671 0 .5328-.114.72-.3347h0l.0011-.0014\n            3.0435-3.68655.0006-.00068c.3035-.35872.3025-.88754-.0019-1.24526l-3.0425-3.65786zM13.9453\n            21.7965h0l.001.0011c.3413.4006.9407.4456 1.337.0996h0c.3953-.3452.4395-.9479.099-1.3477l-2.5154-3.0368\n            2.5195-3.0647c.3388-.4008.2929-1.0036-.1035-1.3472l-.0852.0982.0852-.0982c-.1786-.1549-.3981-.2308-.6166-.2308-.2671\n            0-.5329.114-.7202.3347h0l-.0011.0014-3.0442\n            3.6865c-.0001.0003-.0003.0005-.0005.0007-.3036.3587-.3027.8876.0019 1.2453l3.0431 3.6579z"}" fill="${"#8795A1"}" stroke="${"#8795A1"}" stroke-width="${".26"}"></path></svg>
      </div>` : `${item === "background" ? `<div class="${" svelte-9yox50"}">${validate_component(Popover, "Popover").$$render($$result, { color: "#fff" }, {}, {
      content: () => {
        return `<div slot="${"content"}" class="${"popover popover-background svelte-9yox50"}">${validate_component(ColorPicker, "ColorPicker").$$render($$result, { color: background }, {}, {})}
          </div>`;
      },
      target: () => {
        return `<div class="${"btn svelte-9yox50"}" slot="${"target"}"><svg${spread([escape_object(ICON_SIZE)], { classes: "svelte-9yox50" })}><path d="${"M12 3.1L6.1 8.6a7.6 7.6 0 00-2.2 4 7.2 7.2 0 00.4 4.4 7.9 7.9 0 003 3.5 8.7 8.7 0 004.7 1.3c1.6 0\n                3.2-.5 4.6-1.3s2.4-2 3-3.5a7.2 7.2 0 00.5-4.5 7.6 7.6 0 00-2.2-4L12 3.2zM12 0l7.5 7a9.8 9.8 0 013 5.1\n                9.3 9.3 0 01-.6 5.8c-.9 1.8-2.2 3.3-4 4.4A11.2 11.2 0 0112 24a11.2 11.2 0\n                01-6-1.7c-1.7-1-3-2.6-3.9-4.4a9.3 9.3 0 01-.6-5.8c.4-2 1.5-3.7 3-5L12 0zM6 14h12c0 1.5-.7 3-1.8 4s-2.6\n                1.6-4.2 1.6S9 19 7.8 18s-1.7-2.5-1.7-4z"}"></path></svg>
          </div>`;
      }
    })}
      </div>` : `${item === "snapshot" ? `<div class="${" svelte-9yox50"}">${validate_component(Popover, "Popover").$$render($$result, { color: "#fff" }, {}, {
      content: () => {
        return `<div slot="${"content"}" class="${"popover popover-snapshot svelte-9yox50"}"><h5 class="${"svelte-9yox50"}">Frame ${escape(formattedFrame)}</h5>
            <a href="${"#downloadsvg"}" class="${"svelte-9yox50"}">Download SVG</a>
            <a href="${"#downloadsvg"}" class="${"svelte-9yox50"}">Download PNG</a>
            <i class="${"note svelte-9yox50"}">Scroll with mousewheel to find exact frame</i>
          </div>`;
      },
      target: () => {
        return `<div class="${"btn svelte-9yox50"}" slot="${"target"}"><svg${spread([escape_object(ICON_SIZE)], { classes: "svelte-9yox50" })}><path clip-rule="${"evenodd"}" d="${"M0 3.01A2.983 2.983 0 012.983.027H16.99a2.983 2.983 0 012.983 2.983v14.008a2.982 2.982 0 01-2.983\n                2.983H2.983A2.983 2.983 0 010 17.018zm2.983-.941a.941.941 0 00-.942.94v14.01c0\n                .52.422.94.942.94H16.99a.94.94 0 00.941-.94V3.008a.941.941 0 00-.94-.94H2.981z"}" fill-rule="${"evenodd"}"></path><path d="${"M12.229 7.945l-2.07 4.598-2.586-2.605-2.414 2.758v2.146h9.656V11.93z"}"></path><circle cx="${"7.444"}" cy="${"6.513"}" r="${"2.032"}"></circle><path d="${"M9.561 23.916h11.25a2.929 2.929 0 002.926-2.927V9.954a1.06 1.06 0 10-2.122 0v11.035a.805.805 0\n                01-.803.804H9.562a1.061 1.061 0 100 2.123z"}" stroke="${"#8795a1"}" stroke-width="${".215"}"></path></svg>
          </div>`;
      }
    })}
      </div>` : `${item === "zoom" ? `<div class="${"btn svelte-9yox50"}">${`<svg${spread([escape_object(ICON_SIZE)], { classes: "svelte-9yox50" })}><path d="${"M21 8a1 1 0 102 0V4a3 3 0 00-3-3h-4a1 1 0 100 2h4a1 1 0 011 1v4zM1 8a1 1 0 102 0V4a1 1 0 011-1h4a1 1 0\n              100-2H4a3 3 0 00-3 3v4zm15 15h4a3 3 0 003-3v-4a1 1 0 10-2 0v4a1 1 0 01-1 1h-4a1 1 0 100 2zM4 23h4a1 1 0\n              100-2H4a1 1 0 01-1-1v-4a1 1 0 10-2 0v4a3 3 0 003 3z"}" stroke-width="${".2"}"></path></svg>`}
      </div>` : `${item === "info" ? `<div class="${" svelte-9yox50"}">${validate_component(Popover, "Popover").$$render($$result, { color: "#fff" }, {}, {
      content: () => {
        return `<div slot="${"content"}" class="${"popover popover-info svelte-9yox50"}">${validate_component(Info, "Info").$$render($$result, { animationData }, {}, {})}
          </div>`;
      },
      target: () => {
        return `<div class="${"btn svelte-9yox50"}" slot="${"target"}"><svg${spread([escape_object(ICON_SIZE)], { classes: "svelte-9yox50" })}><path fill-rule="${"evenodd"}" clip-rule="${"evenodd"}" d="${"M3.15 0h17.7A3.12 3.12 0 0124 3.1v17.8c0 1.71-1.4 3.1-3.15 3.1H3.15A3.12 3.12 0 010 20.9V3.1C0 1.39\n                1.4 0 3.15 0zm0 2.05c-.6 0-1.07.47-1.07 1.05v17.8c0 .58.48 1.05 1.07 1.05h17.7c.6 0 1.07-.47\n                1.07-1.05V3.1c0-.58-.48-1.05-1.07-1.05H3.15z"}"></path><path fill-rule="${"evenodd"}" clip-rule="${"evenodd"}" d="${"M12 10c.55 0 1 .42 1 .94v6.12c0 .52-.45.94-1 .94s-1-.42-1-.94v-6.12c0-.52.45-.94 1-.94zM12 6a1 1 0\n                011 1v.42a1 1 0 11-2 0V7a1 1 0 011-1z"}"></path></svg>
          </div>`;
      }
    })}
      </div>` : `${item === "frame" ? `<div class="${" svelte-9yox50"}"><input class="${"frame-number svelte-9yox50"}" type="${"text"}"${add_attribute("value", formattedFrame, 0)}>
      </div>` : `${item === "nextFrame" ? `<div class="${"btn svelte-9yox50"}"><svg${spread([escape_object(ICON_SIZE)], { classes: "svelte-9yox50" })}><path d="${"M2 19.513a1.429 1.429 0 0 0 2.148 1.234l12.88-7.513a1.429 1.429 0 0 0 0-2.468L4.147 3.253A1.429 1.429 0 0\n            0 2 4.487z"}"></path><rect height="${"17.143"}" rx="${"1.429"}" transform="${"matrix(1 0 0 -1 16.286 20.571)"}" width="${"5.714"}"></rect></svg>
      </div>` : `${item === "previousFrame" ? `<div class="${"btn svelte-9yox50"}"><svg${spread([escape_object(ICON_SIZE)], { classes: "svelte-9yox50" })}><path d="${"M22 4.5a1.4 1.4 0 00-2.1-1.2l-13 7.5a1.4 1.4 0 000 2.4l13 7.5a1.4 1.4 0 002.1-1.2z"}"></path><rect height="${"17.1"}" rx="${"1.4"}" transform="${"matrix(-1 0 0 1 7.7 3.4)"}" width="${"5.7"}"></rect></svg>
      </div>` : `${item === "spacer" ? `<div class="${"spacer svelte-9yox50"}"></div>` : ``}`}`}`}`}`}`}`}`}`}`}`}`;
  })}</div>`;
});
const LottiePlayer_svelte_svelte_type_style_lang = "";
const css$15 = {
  code: ".lottie-player.svelte-1aiskgp{box-sizing:border-box;display:flex;flex-direction:column;transition:box-shadow 0.6s}.lottie-player.is-zoomed.svelte-1aiskgp{position:absolute;top:0;left:0;right:0;box-shadow:0px 0px 56px -14px rgba(0, 0, 0, 0.6);margin:100px;border-radius:6px}.animation.svelte-1aiskgp{overflow:hidden}.lottie-player-error.svelte-1aiskgp{display:flex;justify-content:center;height:100%;align-items:center}",
  map: null
};
const LottiePlayer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { autoplay = false } = $$props;
  let { background } = $$props;
  let { controls } = $$props;
  let { controlsLayout } = $$props;
  let { count = void 0 } = $$props;
  let { defaultFrame = 0 } = $$props;
  let { direction = 1 } = $$props;
  let { height } = $$props;
  let { hover = false } = $$props;
  let { loop: loop2 = false } = $$props;
  let { mode = PlayMode.Normal } = $$props;
  let { onToggleZoom = void 0 } = $$props;
  let { renderer = PlayerRender.SVG } = $$props;
  let { speed = 1 } = $$props;
  let { src = "" } = $$props;
  let { style = "" } = $$props;
  let { width } = $$props;
  let animationData;
  let animationRef;
  let playerRef;
  let wrapperRef;
  let instance;
  let frame = 0;
  let progress = 0;
  let currentState = PlayerState.Loading;
  let isZoomed = false;
  let playerHeight;
  let playerWidth;
  let totalFrames;
  const onVisibilityChange = () => {
  };
  onDestroy(() => {
    document.removeEventListener("visibilitychange", onVisibilityChange);
  });
  const load = (srcValue) => {
    {
      return;
    }
  };
  const getLottie = () => {
    return instance;
  };
  const play = () => {
    {
      return;
    }
  };
  const pause = () => {
    {
      return;
    }
  };
  const stop = () => {
    {
      return;
    }
  };
  const freeze = () => {
    {
      return;
    }
  };
  const resize = () => {
    {
      return;
    }
  };
  const seek = (value) => {
    {
      return;
    }
  };
  const snapshot = (download = true) => {
    let data;
    if (renderer === PlayerRender.SVG) {
      const svgElement = animationRef.querySelector("svg");
      const serializedSvg = new XMLSerializer().serializeToString(svgElement);
      data = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(serializedSvg);
      if (download) {
        triggerDownload(data, `snapshot_${progress}.svg`);
      }
    } else if (renderer === PlayerRender.Canvas) {
      const canvas = animationRef.querySelector("canvas");
      data = canvas.toDataURL("image/png");
      if (download) {
        triggerDownload(data, `snapshot_${progress}.png`);
      }
    }
    return data;
  };
  const setLooping = (value) => {
  };
  const setSpeed = (value) => {
  };
  const setDirection = (value) => {
  };
  const togglePlay = () => {
    return play();
  };
  const toggleLooping = () => {
  };
  const setBackground = (value) => {
    background = value;
  };
  const toggleZoom = () => {
    if (typeof onToggleZoom === "function") {
      isZoomed = Boolean(onToggleZoom(isZoomed));
      return;
    }
    if (!isZoomed) {
      wrapperRef.style.height = playerHeight + "px";
      wrapperRef.style.width = playerWidth + "px";
      document.body.appendChild(playerRef);
    } else {
      wrapperRef.appendChild(playerRef);
      wrapperRef.style.height = void 0;
      wrapperRef.style.width = void 0;
    }
    isZoomed = !isZoomed;
    setTimeout(() => resize(), 100);
  };
  if ($$props.autoplay === void 0 && $$bindings.autoplay && autoplay !== void 0)
    $$bindings.autoplay(autoplay);
  if ($$props.background === void 0 && $$bindings.background && background !== void 0)
    $$bindings.background(background);
  if ($$props.controls === void 0 && $$bindings.controls && controls !== void 0)
    $$bindings.controls(controls);
  if ($$props.controlsLayout === void 0 && $$bindings.controlsLayout && controlsLayout !== void 0)
    $$bindings.controlsLayout(controlsLayout);
  if ($$props.count === void 0 && $$bindings.count && count !== void 0)
    $$bindings.count(count);
  if ($$props.defaultFrame === void 0 && $$bindings.defaultFrame && defaultFrame !== void 0)
    $$bindings.defaultFrame(defaultFrame);
  if ($$props.direction === void 0 && $$bindings.direction && direction !== void 0)
    $$bindings.direction(direction);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.hover === void 0 && $$bindings.hover && hover !== void 0)
    $$bindings.hover(hover);
  if ($$props.loop === void 0 && $$bindings.loop && loop2 !== void 0)
    $$bindings.loop(loop2);
  if ($$props.mode === void 0 && $$bindings.mode && mode !== void 0)
    $$bindings.mode(mode);
  if ($$props.onToggleZoom === void 0 && $$bindings.onToggleZoom && onToggleZoom !== void 0)
    $$bindings.onToggleZoom(onToggleZoom);
  if ($$props.renderer === void 0 && $$bindings.renderer && renderer !== void 0)
    $$bindings.renderer(renderer);
  if ($$props.speed === void 0 && $$bindings.speed && speed !== void 0)
    $$bindings.speed(speed);
  if ($$props.src === void 0 && $$bindings.src && src !== void 0)
    $$bindings.src(src);
  if ($$props.style === void 0 && $$bindings.style && style !== void 0)
    $$bindings.style(style);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.load === void 0 && $$bindings.load && load !== void 0)
    $$bindings.load(load);
  if ($$props.getLottie === void 0 && $$bindings.getLottie && getLottie !== void 0)
    $$bindings.getLottie(getLottie);
  if ($$props.play === void 0 && $$bindings.play && play !== void 0)
    $$bindings.play(play);
  if ($$props.pause === void 0 && $$bindings.pause && pause !== void 0)
    $$bindings.pause(pause);
  if ($$props.stop === void 0 && $$bindings.stop && stop !== void 0)
    $$bindings.stop(stop);
  if ($$props.freeze === void 0 && $$bindings.freeze && freeze !== void 0)
    $$bindings.freeze(freeze);
  if ($$props.resize === void 0 && $$bindings.resize && resize !== void 0)
    $$bindings.resize(resize);
  if ($$props.seek === void 0 && $$bindings.seek && seek !== void 0)
    $$bindings.seek(seek);
  if ($$props.snapshot === void 0 && $$bindings.snapshot && snapshot !== void 0)
    $$bindings.snapshot(snapshot);
  if ($$props.setLooping === void 0 && $$bindings.setLooping && setLooping !== void 0)
    $$bindings.setLooping(setLooping);
  if ($$props.setSpeed === void 0 && $$bindings.setSpeed && setSpeed !== void 0)
    $$bindings.setSpeed(setSpeed);
  if ($$props.setDirection === void 0 && $$bindings.setDirection && setDirection !== void 0)
    $$bindings.setDirection(setDirection);
  if ($$props.togglePlay === void 0 && $$bindings.togglePlay && togglePlay !== void 0)
    $$bindings.togglePlay(togglePlay);
  if ($$props.toggleLooping === void 0 && $$bindings.toggleLooping && toggleLooping !== void 0)
    $$bindings.toggleLooping(toggleLooping);
  if ($$props.setBackground === void 0 && $$bindings.setBackground && setBackground !== void 0)
    $$bindings.setBackground(setBackground);
  if ($$props.toggleZoom === void 0 && $$bindings.toggleZoom && toggleZoom !== void 0)
    $$bindings.toggleZoom(toggleZoom);
  $$result.css.add(css$15);
  return `<div style="${escape(width ? `width:${width}px;` : "") + escape(height ? `height:${height}px;` : "") + escape(style)}"${add_attribute("this", wrapperRef, 0)}><div class="${[
    "lottie-player svelte-1aiskgp",
    (controls ? "with-controls" : "") + " " + (isZoomed ? "is-zoomed" : "")
  ].join(" ").trim()}"${add_attribute("this", playerRef, 0)}><div style="${"background: " + escape(background)}" class="${["svelte-1aiskgp", "animation"].join(" ").trim()}"${add_attribute("this", animationRef, 0)}>${``}</div>
    ${controls ? `${validate_component(Controls, "Controls").$$render(
    $$result,
    {
      layout: controlsLayout,
      animationData,
      background,
      controls,
      currentState,
      frame,
      freeze,
      instance,
      loop: loop2,
      lottie,
      pause,
      play,
      progress,
      seek,
      setDirection,
      setSpeed,
      setLooping,
      snapshot,
      src,
      stop,
      toggleZoom,
      toggleLooping,
      togglePlay,
      totalFrames
    },
    {},
    {}
  )}` : ``}</div></div>`;
});
const unicoveAnimated_svelte_svelte_type_style_lang = "";
const css$14 = {
  code: ".container.svelte-mmq6w7{display:flex;justify-content:center}.darkmode .container.svelte-mmq6w7 g > rect{fill:#c4c4c4}",
  map: null
};
const Unicove_animated = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { style = "" } = $$props;
  let controlsLayout = [
    "previousFrame",
    "playpause",
    "stop",
    "nextFrame",
    "progress",
    "frame",
    "loop",
    "spacer",
    "background",
    "snapshot",
    "zoom",
    "info"
  ];
  if ($$props.style === void 0 && $$bindings.style && style !== void 0)
    $$bindings.style(style);
  $$result.css.add(css$14);
  return `<div class="${"container svelte-mmq6w7"}">${validate_component(LottiePlayer, "LottiePlayer").$$render(
    $$result,
    {
      src: "/images/logo-animated.json",
      autoplay: true,
      loop: true,
      controls: false,
      renderer: "svg",
      background: "transparent",
      width: void 0,
      height: void 0,
      style,
      controlsLayout
    },
    {},
    {}
  )}</div>`;
});
const login_svelte_svelte_type_style_lang = "";
const css$13 = {
  code: '.container.svelte-1ux72un.svelte-1ux72un.svelte-1ux72un{--padding:30px;background-image:url("/images/noise-light.jpeg");overflow:hidden;isolation:isolate}.darkmode .container.svelte-1ux72un.svelte-1ux72un.svelte-1ux72un{background-image:url("/images/noise-dark.jpeg")}.container.svelte-1ux72un>.svelte-1ux72un.svelte-1ux72un{margin:0 auto;max-width:1200px}.container.svelte-1ux72un header.svelte-1ux72un.svelte-1ux72un{max-width:950px}h2.svelte-1ux72un.svelte-1ux72un.svelte-1ux72un,h3.svelte-1ux72un.svelte-1ux72un.svelte-1ux72un{font-size:24px;line-height:29px;text-align:center;color:var(--rich-black-FOGRA);font-weight:normal}header.svelte-1ux72un.svelte-1ux72un.svelte-1ux72un{display:flex;align-items:center;justify-content:space-between;padding:36px 10px 20px 10px}header.svelte-1ux72un .logo.svelte-1ux72un.svelte-1ux72un{display:flex}header.svelte-1ux72un .logo .title.svelte-1ux72un.svelte-1ux72un{display:flex;flex:1;flex-direction:column;margin-left:12px}header.svelte-1ux72un .logo .title .unicove.svelte-1ux72un.svelte-1ux72un{margin-bottom:4px}header.svelte-1ux72un .logo .title .version.svelte-1ux72un.svelte-1ux72un{color:var(--middle-green-eagle);font-size:10px;line-height:12px}.darkmode header.svelte-1ux72un .logo .title .version.svelte-1ux72un.svelte-1ux72un{color:#ffffff}header.svelte-1ux72un .account.svelte-1ux72un.svelte-1ux72un{display:grid;align-items:center;justify-content:space-between;grid-template-columns:repeat(3, auto);gap:10px}@media(max-width: 535px){header.svelte-1ux72un .account.svelte-1ux72un.svelte-1ux72un{grid-template-columns:repeat(2, auto)}}.tagline.svelte-1ux72un.svelte-1ux72un.svelte-1ux72un{display:flex;flex-direction:column;align-items:center;justify-content:flex-start;position:relative;padding:0 var(--padding)}.tagline.svelte-1ux72un.svelte-1ux72un.svelte-1ux72un::after{position:absolute;content:"";inset:0;background-image:url("/images/unicove-bg-light.jpeg");background-repeat:no-repeat;background-size:contain;background-position:top center}.darkmode .tagline.svelte-1ux72un.svelte-1ux72un.svelte-1ux72un::after{background-image:url("/images/unicove-bg-dark.jpeg")}.tagline.svelte-1ux72un .unicove.svelte-1ux72un.svelte-1ux72un{width:100%;padding-top:160px;max-width:535px;z-index:10}@media(max-width: 535px){.tagline.svelte-1ux72un .unicove.svelte-1ux72un.svelte-1ux72un{padding-top:30%}}.tagline.svelte-1ux72un .description.svelte-1ux72un.svelte-1ux72un{margin-top:20px;max-width:535px;z-index:10}.tagline.svelte-1ux72un .actions.svelte-1ux72un.svelte-1ux72un{z-index:10;display:flex;justify-content:space-evenly;flex-wrap:wrap;width:100%}.tagline.svelte-1ux72un .action.svelte-1ux72un.svelte-1ux72un{width:300px;padding:70px 10px;display:flex;flex-direction:column;justify-content:stretch;align-items:center}.tagline.svelte-1ux72un .action p.svelte-1ux72un.svelte-1ux72un{flex:1;margin:20px 0;text-align:center}.transactions.svelte-1ux72un.svelte-1ux72un.svelte-1ux72un{margin-top:30px;max-width:950px;position:relative;display:grid;grid-template-columns:repeat(auto-fill, minmax(350px, 1fr))}@media(max-width: 699px){.transactions.svelte-1ux72un.svelte-1ux72un.svelte-1ux72un{grid-template-columns:1fr}}.transactions.svelte-1ux72un .image.svelte-1ux72un.svelte-1ux72un{position:relative;margin-top:30px;display:flex;align-items:center;justify-content:center;max-height:250px}.transactions.svelte-1ux72un .image.svelte-1ux72un img.svelte-1ux72un{max-width:100%}@media(max-width: 699px){.transactions.svelte-1ux72un .image.svelte-1ux72un img.svelte-1ux72un{width:100%;height:500px;object-fit:cover}}.transactions.svelte-1ux72un .image .logo.svelte-1ux72un.svelte-1ux72un{position:absolute;inset:0;display:flex;justify-content:center;align-items:center}.transactions.svelte-1ux72un .content.svelte-1ux72un.svelte-1ux72un{margin-top:30px;padding:0 var(--padding)}.transactions.svelte-1ux72un .content h3.svelte-1ux72un.svelte-1ux72un{text-align:left}.transactions.svelte-1ux72un .content.svelte-1ux72un h4.svelte-1ux72un{color:var(--light-grey)}.transactions.svelte-1ux72un .content.svelte-1ux72un p.svelte-1ux72un{line-height:15px}.transactions.svelte-1ux72un .content.svelte-1ux72un>.svelte-1ux72un{margin-bottom:20px}.transactions.svelte-1ux72un .blockchains.svelte-1ux72un.svelte-1ux72un{display:grid;grid-auto-flow:column;column-gap:15px}.transactions.svelte-1ux72un .blockchain.svelte-1ux72un.svelte-1ux72un{display:flex;flex-direction:column;align-items:center}.transactions.svelte-1ux72un .blockchain p.svelte-1ux72un.svelte-1ux72un{color:var(--light-grey);margin-top:8px}@media(max-width: 355px){.transactions.svelte-1ux72un .blockchains.svelte-1ux72un.svelte-1ux72un{justify-content:space-between}.transactions.svelte-1ux72un .blockchain.svelte-1ux72un.svelte-1ux72un{margin-right:0}}.usage.svelte-1ux72un.svelte-1ux72un.svelte-1ux72un{margin-top:150px;max-width:900px;padding:0 var(--padding);position:relative;z-index:10;display:flex;flex-direction:column;align-items:center}@media(max-width: 842px){.usage.svelte-1ux72un.svelte-1ux72un.svelte-1ux72un{margin-top:0}}.usage.svelte-1ux72un h3.svelte-1ux72un.svelte-1ux72un{font-size:20px;text-align:left}.usage.svelte-1ux72un p.svelte-1ux72un.svelte-1ux72un{margin-top:20px}.usage.svelte-1ux72un .big-image.svelte-1ux72un.svelte-1ux72un{display:flex;justify-content:center;visibility:hidden;height:0;width:100%}@media(min-width: 843px){.usage.svelte-1ux72un .big-image.svelte-1ux72un.svelte-1ux72un{visibility:visible;height:auto}}.usage.svelte-1ux72un .big-image.svelte-1ux72un svg{width:100%}.usage.svelte-1ux72un .features.svelte-1ux72un.svelte-1ux72un{width:100%;margin-top:40px;display:grid;grid-template-columns:repeat(3, 1fr);column-gap:50px}@media(max-width: 842px){.usage.svelte-1ux72un .features.svelte-1ux72un.svelte-1ux72un{grid-template-columns:1fr}}.usage.svelte-1ux72un .feature.svelte-1ux72un.svelte-1ux72un{display:flex;flex-direction:column}.usage.svelte-1ux72un .feature .image.svelte-1ux72un.svelte-1ux72un{display:none;width:250px;height:150px;align-self:center}@media(max-width: 842px){.usage.svelte-1ux72un .feature .image.svelte-1ux72un.svelte-1ux72un{display:flex}}.usage.svelte-1ux72un .feature .image.svelte-1ux72un svg{width:100%}.anchor.svelte-1ux72un.svelte-1ux72un.svelte-1ux72un,.greymass.svelte-1ux72un.svelte-1ux72un.svelte-1ux72un{margin-top:120px;max-width:900px;display:grid;grid-template-columns:1fr 1fr;align-items:center}@media(max-width: 899px){.anchor.svelte-1ux72un.svelte-1ux72un.svelte-1ux72un,.greymass.svelte-1ux72un.svelte-1ux72un.svelte-1ux72un{grid-template-columns:1fr}}.anchor.svelte-1ux72un h3.svelte-1ux72un.svelte-1ux72un,.greymass.svelte-1ux72un h3.svelte-1ux72un.svelte-1ux72un{font-size:20px;text-align:left}.anchor.svelte-1ux72un p.svelte-1ux72un.svelte-1ux72un,.greymass.svelte-1ux72un p.svelte-1ux72un.svelte-1ux72un{margin-top:20px}.anchor.svelte-1ux72un .text.svelte-1ux72un.svelte-1ux72un,.greymass.svelte-1ux72un .text.svelte-1ux72un.svelte-1ux72un{padding:0 var(--padding)}.anchor.svelte-1ux72un .image.svelte-1ux72un.svelte-1ux72un,.greymass.svelte-1ux72un .image.svelte-1ux72un.svelte-1ux72un{display:flex;align-items:center;justify-content:center}.anchor.svelte-1ux72un.svelte-1ux72un.svelte-1ux72un{grid-template-areas:"text image"}@media(max-width: 899px){.anchor.svelte-1ux72un.svelte-1ux72un.svelte-1ux72un{grid-template-areas:"image" "text"}}.anchor.svelte-1ux72un .text.svelte-1ux72un.svelte-1ux72un{grid-area:text}.anchor.svelte-1ux72un .image.svelte-1ux72un.svelte-1ux72un{grid-area:image;min-height:300px;background-image:url("/images/anchor-bg-light.jpeg");background-size:auto;background-repeat:no-repeat;background-position:center}.darkmode .anchor.svelte-1ux72un .image.svelte-1ux72un.svelte-1ux72un{background-image:url("/images/anchor-bg-dark.jpeg")}.anchor.svelte-1ux72un .link.svelte-1ux72un.svelte-1ux72un{margin-top:20px}.greymass.svelte-1ux72un.svelte-1ux72un.svelte-1ux72un{margin-top:0;margin-bottom:50px}.greymass.svelte-1ux72un .image.svelte-1ux72un.svelte-1ux72un{min-height:500px;background-image:url("/images/greymass-bg-light.jpeg");background-size:auto;background-repeat:no-repeat;background-position:center}.darkmode .greymass.svelte-1ux72un .image.svelte-1ux72un.svelte-1ux72un{background-image:url("/images/greymass-bg-dark.jpeg")}footer.svelte-1ux72un.svelte-1ux72un.svelte-1ux72un{padding:70px 30px;background:var(--white)}@media(max-width: 550px){footer.svelte-1ux72un.svelte-1ux72un.svelte-1ux72un{padding:40px 30px}}footer.svelte-1ux72un .content.svelte-1ux72un.svelte-1ux72un{display:grid;grid-template-areas:"logo links support" "bottom bottom bottom";grid-template-columns:repeat(3, 1fr);row-gap:50px;max-width:850px;margin:0 auto}@media(max-width: 550px){footer.svelte-1ux72un .content.svelte-1ux72un.svelte-1ux72un{grid-template-columns:100px 1fr;grid-template-areas:"logo links" "support support" "bottom bottom"}}footer.svelte-1ux72un .content.svelte-1ux72un h4.svelte-1ux72un{font-weight:bold;font-size:10px;line-height:12px;text-transform:uppercase;color:var(--rich-black-FOGRA)}footer.svelte-1ux72un .content.svelte-1ux72un p.svelte-1ux72un,footer.svelte-1ux72un .content.svelte-1ux72un li.svelte-1ux72un{margin-top:10px;color:var(--main-black);font-style:normal;font-weight:normal;font-size:13px;line-height:16px}footer.svelte-1ux72un .content .logo.svelte-1ux72un.svelte-1ux72un{grid-area:logo}footer.svelte-1ux72un .content .links.svelte-1ux72un.svelte-1ux72un{grid-area:links}footer.svelte-1ux72un .content.svelte-1ux72un .links li.svelte-1ux72un,footer.svelte-1ux72un .content .links a.svelte-1ux72un.svelte-1ux72un{color:var(--main-black);text-decoration:none}footer.svelte-1ux72un .content .support.svelte-1ux72un.svelte-1ux72un{grid-area:support}footer.svelte-1ux72un .content .support .button.svelte-1ux72un.svelte-1ux72un{margin-top:20px}footer.svelte-1ux72un .content .bottom.svelte-1ux72un.svelte-1ux72un{grid-area:bottom;border-top:1px solid var(--cultured);padding-top:10px;color:var(--dark-grey);display:flex;justify-content:space-between}footer.svelte-1ux72un .content.svelte-1ux72un .bottom p.svelte-1ux72un{color:var(--dark-grey)}',
  map: null
};
const Login = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $darkMode, $$unsubscribe_darkMode;
  $$unsubscribe_darkMode = subscribe(darkMode, (value) => $darkMode = value);
  let creatingAccount = false;
  $$result.css.add(css$13);
  $$unsubscribe_darkMode();
  return `<div class="${"container svelte-1ux72un"}"><header class="${"svelte-1ux72un"}"><div class="${"logo svelte-1ux72un"}">${validate_component(Logo, "Logo").$$render($$result, { width: 40, variant: "dark" }, {}, {})}
            <div class="${"title svelte-1ux72un"}"><div class="${"unicove svelte-1ux72un"}">${validate_component(Unicove, "Unicove").$$render($$result, { width: 90, variant: "dark" }, {}, {})}</div>
                <div class="${"version svelte-1ux72un"}">${isRelease ? `${escape(releaseVersion)}` : `${escape(version)}`}</div></div></div>
        <div class="${"account svelte-1ux72un"}">${validate_component(Mode, "ThemeButton").$$render($$result, {}, {}, {})}
            ${validate_component(Media_query, "MediaQuery").$$render($$result, { query: "(min-width: 536px)" }, {}, {
    default: ({ matches }) => {
      return `${matches ? `${validate_component(Button$2, "Button").$$render(
        $$result,
        {
          style: "tertiary",
          size: "regular",
          disabled: creatingAccount
        },
        {},
        {
          default: () => {
            return `${validate_component(Icon, "Icon").$$render($$result, { name: "plus" }, {}, {})}${validate_component(Text, "Text").$$render($$result, {}, {}, {
              default: () => {
                return `New Account`;
              }
            })}`;
          }
        }
      )}` : ``}`;
    }
  })}
            ${validate_component(Login$1, "ButtonLogin").$$render($$result, { style: "tertiary" }, {}, {
    default: () => {
      return `Login`;
    }
  })}</div></header>
    <section class="${"tagline svelte-1ux72un"}"><div class="${"unicove svelte-1ux72un"}">${validate_component(Unicove, "Unicove").$$render($$result, { variant: "white" }, {}, {})}</div>
        <h2 class="${"description svelte-1ux72un"}">Unicove is your portal to EOSIO blockchains, a secure &amp; easy to use web wallet
        </h2>
        <div class="${"actions svelte-1ux72un"}"><div class="${"action svelte-1ux72un"}"><h3 class="${"svelte-1ux72un"}">New account</h3>
                <p class="${"svelte-1ux72un"}">An easy way to create a new account. Supported chains are EOS, WAX, TELOS,
                    Proton, and FIO.
                </p>
                ${validate_component(Button$2, "Button").$$render(
    $$result,
    {
      style: "effect",
      size: "regular",
      disabled: creatingAccount
    },
    {},
    {
      default: () => {
        return `${validate_component(Icon, "Icon").$$render($$result, { name: "plus" }, {}, {})}${validate_component(Text, "Text").$$render($$result, {}, {}, {
          default: () => {
            return `Create new account`;
          }
        })}`;
      }
    }
  )}</div>
            <div class="${"action svelte-1ux72un"}"><h3 class="${"svelte-1ux72un"}">Login to wallet</h3>
                <p class="${"svelte-1ux72un"}">Use Anchor to login and manage your account and tokens.</p>
                ${validate_component(Login$1, "ButtonLogin").$$render($$result, { style: "effect" }, {}, {
    default: () => {
      return `Login`;
    }
  })}</div></div></section>
    <section class="${"transactions svelte-1ux72un"}"><div class="${"image svelte-1ux72un"}"><img${add_attribute(
    "src",
    $darkMode ? "/images/logo-bg-dark.jpeg" : "/images/logo-bg-light.jpeg",
    0
  )} alt="${"Unicove Logo"}" class="${"svelte-1ux72un"}">
            <div class="${"logo svelte-1ux72un"}">${validate_component(Media_query, "MediaQuery").$$render($$result, { query: "(max-width: 699px)" }, {}, {
    default: ({ matches }) => {
      return `${matches ? `${validate_component(Unicove_animated, "UnicoveAnimated").$$render($$result, { style: "width: 70%;" }, {}, {})}` : `${validate_component(Unicove_animated, "UnicoveAnimated").$$render($$result, { style: "width: 42%;" }, {}, {})}`}`;
    }
  })}</div></div>
        <div class="${"content svelte-1ux72un"}"><h3 class="${"svelte-1ux72un"}">The place where your blockchain transactions come to life</h3>
            <p class="${"svelte-1ux72un"}">Unicove is built for token holders. It\u2019s a comprehensive interface for all of your
                EOSIO account needs. Create transactions, manage your accounts, monitor your
                activity, and so much more.
            </p>
            <h4 class="${"svelte-1ux72un"}">Supported Blockchains</h4>
            <ul class="${"blockchains svelte-1ux72un"}">${each(chains.filter((chain) => !chain.testnet), (chain) => {
    return `<li class="${"blockchain svelte-1ux72un"}"><img${add_attribute("alt", chain.name, 0)}${add_attribute("src", `/images/chains/${chain.id}-${$darkMode ? "dark" : "light"}.svg`, 0)} class="${"svelte-1ux72un"}">
                        <p class="${"svelte-1ux72un"}">${escape(chain.name)}</p>
                    </li>`;
  })}</ul></div></section>
    <section class="${"usage svelte-1ux72un"}"><div class="${"big-image svelte-1ux72un"}">${validate_component(Features, "Features").$$render($$result, {}, {}, {})}</div>
        <ul class="${"features svelte-1ux72un"}"><li class="${"feature svelte-1ux72un"}"><div class="${"image svelte-1ux72un"}">${validate_component(Features, "Features").$$render($$result, { portion: "left" }, {}, {})}</div>
                <h3 class="${"svelte-1ux72un"}">Robustly secure</h3>
                <p class="${"svelte-1ux72un"}">Unicove is built to work with Anchor, the secure wallet developed by Greymass.
                    With mobile, desktop, and hardware options, you get access to best-in-class key
                    management and security.
                </p></li>
            <li class="${"feature svelte-1ux72un"}"><div class="${"image svelte-1ux72un"}">${validate_component(Features, "Features").$$render($$result, { portion: "center" }, {}, {})}</div>
                <h3 class="${"svelte-1ux72un"}">Seamless and intuitive</h3>
                <p class="${"svelte-1ux72un"}">Unicove\u2019s intutive interface makes it easy to take advantage of every feature
                    your favorite blockchain has to offer. With your keys safe in Anchor, you can
                    fully manage your account from any web browser.
                </p></li>
            <li class="${"feature svelte-1ux72un"}"><div class="${"image svelte-1ux72un"}">${validate_component(Features, "Features").$$render($$result, { portion: "right" }, {}, {})}</div>
                <h3 class="${"svelte-1ux72un"}">Built for users</h3>
                <p class="${"svelte-1ux72un"}">Create transactions, make new accounts, and even earn rewards from your tokens.
                    All with an easy interface that is always up to date. Super easy to use just
                    sign in and get stuff done.
                </p></li></ul></section>
    <section class="${"anchor svelte-1ux72un"}"><div class="${"text svelte-1ux72un"}"><h3 class="${"svelte-1ux72un"}">Your keys are always safely held by Anchor</h3>
            <p class="${"svelte-1ux72un"}">Use Anchor to seamlessly and securely interact with any supported EOSIO-based
                blockchain. Anchor allows you to login to Unicove and manage your account.
            </p>
            <div class="${"link svelte-1ux72un"}">${validate_component(Button$2, "Button").$$render(
    $$result,
    {
      href: "https://greymass.com/anchor/",
      style: "secondary"
    },
    {},
    {
      default: () => {
        return `Learn more about Anchor -&gt;`;
      }
    }
  )}</div></div>
        <div class="${"image svelte-1ux72un"}"><img src="${"/images/anchor.svg"}" alt="${"Anchor Logo"}" class="${"svelte-1ux72un"}"></div></section>
    <section class="${"greymass svelte-1ux72un"}"><div class="${"image svelte-1ux72un"}"><img src="${"/images/greymass.svg"}" alt="${"Greymass Logo"}" class="${"svelte-1ux72un"}"></div>
        <div class="${"text svelte-1ux72un"}"><h3 class="${"svelte-1ux72un"}">Greymass is an organization dedicated to making blockchain technology more usable
                and accessible.
            </h3>
            <p class="${"svelte-1ux72un"}">We fix the broken and complicated things in crypto so that you can realize the full
                potential of blockchain while having fun and staying safe. Our team consists of
                developers, designers, product experts, and more. Unicove is our newest project \u2014 a
                one-stop-shop interface for EOSIO blockchains.
            </p>
            <p class="${"svelte-1ux72un"}">We\u2019re always looking for feedback, so if you have some get in touch!</p></div></section></div>
<footer class="${"svelte-1ux72un"}"><div class="${"content svelte-1ux72un"}"><div class="${"logo svelte-1ux72un"}">${validate_component(Logo, "Logo").$$render($$result, { width: 65 }, {}, {})}</div>
        <div class="${"links svelte-1ux72un"}"><h4 class="${"svelte-1ux72un"}">Unicove</h4>
            <ul><li class="${"svelte-1ux72un"}">${validate_component(Login$1, "ButtonLogin").$$render($$result, { asLink: true }, {}, {
    default: () => {
      return `Sign In`;
    }
  })}</li>
                <li class="${"svelte-1ux72un"}"><a href="${"https://create.anchor.link/"}" class="${"svelte-1ux72un"}">Create new account</a></li>
                <li class="${"svelte-1ux72un"}"><a href="${"https://forums.eoscommunity.org/c/greymass/anchor-wallet/5"}" target="${"_blank"}" class="${"svelte-1ux72un"}">Feedback</a></li>
                <li class="${"svelte-1ux72un"}"><a href="${"https://forums.eoscommunity.org/c/greymass/anchor-wallet/5"}" target="${"_blank"}" class="${"svelte-1ux72un"}">Support</a></li>
                <li class="${"svelte-1ux72un"}">Press</li>
                <li class="${"svelte-1ux72un"}"><a href="${"https://greymass.com/anchor/download"}" target="${"_blank"}" class="${"svelte-1ux72un"}">Get Anchor</a></li></ul></div>
        <div class="${"support svelte-1ux72un"}"><h4 class="${"svelte-1ux72un"}">Vote and support our endavours</h4>
            <p class="${"svelte-1ux72un"}">Like our commitment to making the boring blockchain stuff less tedious? Vote for us
                so we can make fun stuff that simplifies and enhances your blockchain experience!
            </p>
            <div class="${"button svelte-1ux72un"}">${validate_component(Button$2, "Button").$$render(
    $$result,
    {
      href: "https://greymass.com/support-us",
      target: "_blank"
    },
    {},
    {
      default: () => {
        return `${validate_component(Icon, "Icon").$$render($$result, { name: "thumbs-up" }, {}, {})}${validate_component(Text, "Text").$$render($$result, {}, {}, {
          default: () => {
            return `Vote for teamgreymass`;
          }
        })}`;
      }
    }
  )}</div></div>
        <div class="${"bottom svelte-1ux72un"}"><p class="${"version svelte-1ux72un"}">Unicove
                ${isRelease ? `${escape(releaseVersion)}` : `${escape(version)}`}</p>
            <p class="${"svelte-1ux72un"}">\xA92021 Greymass. All rights reserved</p></div></div></footer>`;
});
const isLoading = writable(false);
const initialBalances$1 = {
  balances: [],
  tokens: []
};
const balancesProvider = writable(initialBalances$1, () => {
  const interval = setInterval(() => {
    const session = get_store_value(activeSession);
    if (session) {
      updateBalances(session);
    }
  }, 3e4);
  const unsubscribe = activeSession.subscribe((session) => {
    if (session) {
      updateBalances(session);
    }
  });
  return () => {
    unsubscribe();
    clearInterval(interval);
  };
});
async function updateBalances(session) {
  var _a;
  isLoading.set(true);
  const chain = chainConfig(session.chainId);
  const { Bloks } = BalanceProviders;
  if ((_a = chain.balanceProviders) == null ? void 0 : _a.has(Bloks)) {
    const data = await fetchData(session);
    const balances2 = parseTokenBalances(session, data);
    const tokens2 = parseTokens(session, data);
    balancesProvider.set({
      balances: balances2,
      tokens: tokens2
    });
  }
  isLoading.set(false);
}
async function fetchData(session) {
  const chain = chainConfig(session.chainId);
  const apiUrl = `https://www.api.bloks.io${chain.id === "eos" ? "" : `/${chain.id}`}/account/${session.auth.actor}?type=getAccountTokens&coreSymbol=${chain.coreTokenSymbol}`;
  return await fetch(apiUrl).then(async (response) => {
    const jsonBody = response && await response.json().catch((error) => {
      console.warn(
        "An error occured while parsing the token balances response body:",
        {
          error
        }
      );
    });
    return jsonBody.tokens;
  }).catch((error) => {
    console.warn("An error occured while fetching token balances:", { error });
    return [];
  });
}
function parseTokenInfo(session, balance) {
  var _a;
  const chain = chainConfig(session.chainId);
  const symbol = Asset$1.Symbol.from(`${balance.decimals},${balance.currency}`);
  const key = makeTokenKey({
    chainId: chain.chainId,
    contract: balance.contract,
    name: symbol.name
  });
  return {
    key,
    chainId: chain.chainId,
    contract: balance.contract,
    symbol,
    name: symbol.name,
    price: balance.usd_value / balance.amount,
    logo: (_a = balance.metadata) == null ? void 0 : _a.logo
  };
}
function parseTokens(session, balances2) {
  return balances2.map((balance) => parseTokenInfo(session, balance));
}
function parseTokenBalances(session, balances2) {
  return balances2.map((balance) => {
    const symbol = Asset$1.Symbol.from(`${balance.decimals},${balance.currency}`);
    const token = parseTokenInfo(session, balance);
    const asset = Asset$1.from(balance.amount || 0, symbol);
    return createBalanceFromToken(session, token, asset);
  });
}
const initialTokens = [];
const tokens = derived(
  [activePriceTicker, activeSession, balancesProvider],
  ([$activePriceTicker, $activeSession, $balancesProvider], set) => {
    const records = [];
    if ($activeSession) {
      records.push(createTokenFromChainId($activeSession.chainId, $activePriceTicker));
    }
    records.push(...$balancesProvider.tokens);
    set(records);
  },
  initialTokens
);
function makeTokenKey(token) {
  return [String(token.chainId), String(token.contract), String(token.name)].join("-").toLowerCase();
}
const systemTokenKey = derived(activeBlockchain, ($activeBlockchain) => {
  if ($activeBlockchain) {
    const params = {
      chainId: $activeBlockchain.chainId,
      contract: $activeBlockchain.coreTokenContract,
      name: $activeBlockchain.coreTokenSymbol.name
    };
    return makeTokenKey(params);
  }
  return "";
});
const systemToken = derived(
  activeBlockchain,
  ($activeBlockchain) => {
    if ($activeBlockchain) {
      return createTokenFromChainId($activeBlockchain.chainId);
    }
  }
);
function createTokenFromChainId(chainId, price = void 0) {
  const chain = chainConfig(chainId);
  const token = {
    chainId,
    contract: chain.coreTokenContract,
    symbol: chain.coreTokenSymbol,
    name: chain.coreTokenSymbol.name,
    logo: `https://www.bloks.io/img/chains/${chain.coreTokenSymbol.name.toLowerCase()}.png`,
    price
  };
  const record = {
    ...token,
    key: makeTokenKey(token)
  };
  return record;
}
function getToken(key) {
  const existing = get_store_value(tokens);
  return existing.find((t) => t.key === key);
}
const initialBalances = [];
const balances = derived(
  [activeSession, activeBlockchain, balancesProvider, currentAccount],
  ([$activeSession, $activeBlockchain, $balancesProvider, $currentAccount], set) => {
    const records = [];
    if ($activeSession && $currentAccount) {
      let coreBalance = $currentAccount.core_liquid_balance;
      if (!coreBalance) {
        coreBalance = Asset$1.from(0, $activeBlockchain.coreTokenSymbol);
      }
      records.push(createBalanceFromCoreToken($activeSession, coreBalance));
    }
    records.push(...$balancesProvider.balances);
    set(records);
  },
  initialBalances
);
function makeBalanceKey(token, account) {
  return [
    String(token.chainId),
    String(token.contract),
    String(token.symbol.name),
    String(account)
  ].join("-").toLowerCase();
}
function createBalanceFromCoreToken(session, balance) {
  const token = createTokenFromChainId(session.chainId);
  return createBalanceFromToken(session, token, balance);
}
function createBalanceFromToken(session, token, balance) {
  const key = makeBalanceKey(token, session.auth.actor);
  const record = {
    key,
    chainId: session.chainId,
    account: session.auth.actor,
    tokenKey: makeTokenKey(token),
    quantity: balance
  };
  return record;
}
const systemTokenBalance = derived(
  [activeBlockchain, balances],
  ([$activeBlockchain, $balances]) => {
    if ($activeBlockchain) {
      const token = createTokenFromChainId($activeBlockchain.chainId);
      return $balances.find((b2) => b2.tokenKey === token.key);
    }
  }
);
const getResourceClient = (chain) => {
  const api = getClient(chain);
  const options = { api };
  if (chain.resourceSampleAccount) {
    options.sampleAccount = chain.resourceSampleAccount;
  }
  return new Resources$1(options);
};
const getSampleUsage = async (set, chain) => getResourceClient(chain).getSampledUsage().then((v2) => set(v2)).catch((e) => {
  console.error(e);
  set(void 0);
});
const sampleUsage = derived(
  [activeBlockchain],
  ([$activeBlockchain], set) => {
    if ($activeBlockchain && Array.from($activeBlockchain.chainFeatures).some((r) => resourceFeatures.includes(r))) {
      getSampleUsage(set, $activeBlockchain);
      const interval = setInterval(() => getSampleUsage(set, $activeBlockchain), 3e4);
      return () => {
        clearInterval(interval);
      };
    }
  }
);
const getInfo = async (set, chain) => getClient(chain).v1.chain.get_info().then((result) => set(result)).catch((e) => {
  console.error(e);
  set(void 0);
});
const info = derived(
  [activeBlockchain],
  ([$activeBlockchain], set) => {
    if ($activeBlockchain) {
      getInfo(set, $activeBlockchain);
    }
  }
);
const getPowerUpState = async (set, chain) => getResourceClient(chain).v1.powerup.get_state().then((result) => set(result)).catch((e) => {
  console.error(e);
  set(void 0);
});
const statePowerUp = derived(
  [activeBlockchain],
  ([$activeBlockchain], set) => {
    if ($activeBlockchain && $activeBlockchain.chainFeatures.has(ChainFeatures.PowerUp)) {
      getPowerUpState(set, $activeBlockchain);
      const interval = setInterval(() => getPowerUpState(set, $activeBlockchain), 3e4);
      return () => {
        clearInterval(interval);
      };
    }
  }
);
const msToRent = derived(activeBlockchain, ($activeBlockchain) => {
  if ($activeBlockchain.resourceSampleMilliseconds) {
    return $activeBlockchain.resourceSampleMilliseconds;
  }
  return 1;
});
const powerupPrice = derived(
  [msToRent, sampleUsage, statePowerUp, info],
  ([$msToRent, $sampleUsage, $statePowerUp, $info]) => {
    if ($msToRent && $sampleUsage && $statePowerUp) {
      return Asset$2.from(
        $statePowerUp.cpu.price_per_ms($sampleUsage, $msToRent, $info),
        "4,EOS"
      );
    }
    return Asset$2.from(0, "4,EOS");
  }
);
const stakingPrice = derived(
  [activeBlockchain, msToRent, sampleUsage],
  ([$activeBlockchain, $msToRent, $sampleUsage]) => {
    if ($msToRent && $sampleUsage) {
      const { account } = $sampleUsage;
      const cpu_weight = Number(account.total_resources.cpu_weight.units);
      const cpu_limit = Number(account.cpu_limit.max.value);
      let price = cpu_weight / cpu_limit;
      if ($activeBlockchain.resourceSampleMilliseconds) {
        price *= $activeBlockchain.resourceSampleMilliseconds;
      }
      return Asset$2.fromUnits(price, $activeBlockchain.coreTokenSymbol);
    }
    return Asset$2.from(0, $activeBlockchain.coreTokenSymbol);
  }
);
const getREXState = async (set, chain) => getResourceClient(chain).v1.rex.get_state().then((result) => set(result)).catch((e) => {
  console.error(e);
  set(void 0);
});
const stateREX = derived(
  [activeBlockchain],
  ([$activeBlockchain], set) => {
    if ($activeBlockchain && $activeBlockchain.chainFeatures.has(ChainFeatures.REX)) {
      getREXState(set, $activeBlockchain);
      const interval = setInterval(() => getREXState(set, $activeBlockchain), 3e4);
      return () => {
        clearInterval(interval);
      };
    }
  }
);
const rexPrice = derived(
  [msToRent, sampleUsage, stateREX],
  ([$msToRent, $sampleUsage, $stateREX]) => {
    if ($msToRent && $sampleUsage && $stateREX) {
      return Asset$2.from($stateREX.price_per($sampleUsage, $msToRent * 3e4), "4,EOS");
    }
    return Asset$2.from(0, "4,EOS");
  }
);
const stateRAM$1 = derived(
  [activeBlockchain],
  ([$activeBlockchain], set) => {
    if ($activeBlockchain && $activeBlockchain.chainFeatures.has(ChainFeatures.BuyRAM)) {
      getRAMState(set, $activeBlockchain);
      const interval = setInterval(() => getRAMState(set, $activeBlockchain), 3e4);
      return () => {
        clearInterval(interval);
      };
    }
  }
);
const getRAMState = async (set, chain) => getResourceClient(chain).v1.ram.get_state().then((result) => set(result)).catch((e) => {
  console.error(e);
  set(void 0);
});
const group_svelte_svelte_type_style_lang = "";
const css$12 = {
  code: ".segment-group.svelte-4g0d5g{--gap:12px;display:inline-flex;flex-wrap:wrap;margin:calc(-1 * var(--gap)) 0 0 calc(-1 * var(--gap));width:calc(100% + var(--gap))}.segment-group.svelte-4g0d5g>*{margin:var(--gap) 0 0 var(--gap)}.segment-group.svelte-4g0d5g .segment{flex-grow:1}.segment-group.vertical.svelte-4g0d5g{flex-direction:column}",
  map: null
};
const Group = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { vertical = false } = $$props;
  if ($$props.vertical === void 0 && $$bindings.vertical && vertical !== void 0)
    $$bindings.vertical(vertical);
  $$result.css.add(css$12);
  return `<div class="${["segment-group svelte-4g0d5g", vertical ? "vertical" : ""].join(" ").trim()}">${slots.default ? slots.default({}) : ``}</div>`;
});
const Image = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let srcToUse;
  let altToUse;
  let { src = "" } = $$props;
  let { alt = "" } = $$props;
  let { fallbackSrc = "/images/placeholder.png" } = $$props;
  let { fallbackAlt = "placeholder image" } = $$props;
  let { width = void 0 } = $$props;
  let { height = void 0 } = $$props;
  if ($$props.src === void 0 && $$bindings.src && src !== void 0)
    $$bindings.src(src);
  if ($$props.alt === void 0 && $$bindings.alt && alt !== void 0)
    $$bindings.alt(alt);
  if ($$props.fallbackSrc === void 0 && $$bindings.fallbackSrc && fallbackSrc !== void 0)
    $$bindings.fallbackSrc(fallbackSrc);
  if ($$props.fallbackAlt === void 0 && $$bindings.fallbackAlt && fallbackAlt !== void 0)
    $$bindings.fallbackAlt(fallbackAlt);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  srcToUse = src;
  altToUse = alt;
  return `<img${add_attribute("src", srcToUse, 0)}${add_attribute("alt", altToUse, 0)}${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}>`;
});
const tokenIcons = {
  "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906-eosio.token-eos": {
    name: "EOS",
    src: "/images/token-eos.svg",
    darkSrc: "/images/token-eos-dark.svg"
  },
  "4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11-eosio.token-tlos": {
    name: "TELOS",
    src: "/images/chains/telos-light.svg",
    darkSrc: "/images/chains/telos-dark.svg"
  }
};
const Token = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $tokens, $$unsubscribe_tokens;
  let $darkMode, $$unsubscribe_darkMode;
  $$unsubscribe_tokens = subscribe(tokens, (value) => $tokens = value);
  $$unsubscribe_darkMode = subscribe(darkMode, (value) => $darkMode = value);
  let { tokenKey } = $$props;
  let { width = "32" } = $$props;
  let { height = "32" } = $$props;
  let src;
  let name;
  if ($$props.tokenKey === void 0 && $$bindings.tokenKey && tokenKey !== void 0)
    $$bindings.tokenKey(tokenKey);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  {
    {
      if (tokenIcons[tokenKey]) {
        const icon = tokenIcons[tokenKey];
        src = $darkMode ? icon.darkSrc || icon.src : icon.src;
        name = icon.name;
      } else {
        const token = ($tokens || []).find((t) => t.key === tokenKey);
        if (token) {
          src = token.logo;
          name = String(token.name);
        }
      }
    }
  }
  $$unsubscribe_tokens();
  $$unsubscribe_darkMode();
  return `${src ? `${validate_component(Image, "Image").$$render($$result, { height, width, alt: name, src }, {}, {})}` : ``}`;
});
const headerrow_svelte_svelte_type_style_lang = "";
const css$11 = {
  code: ".container.svelte-5ahdlg.svelte-5ahdlg{display:flex;min-height:60px;max-height:84px;padding:12px}.container.svelte-5ahdlg>.svelte-5ahdlg{display:inline-flex;align-items:center;margin-right:10px;flex:1}.container.svelte-5ahdlg>.svelte-5ahdlg:last-child{flex:0}.price.svelte-5ahdlg.svelte-5ahdlg,.quantity.svelte-5ahdlg.svelte-5ahdlg,.token.svelte-5ahdlg.svelte-5ahdlg,.value.svelte-5ahdlg.svelte-5ahdlg{color:var(--dark-grey);font-family:Inter;font-style:normal;font-weight:600;font-size:10px;line-height:12px;letter-spacing:0.1px;text-transform:uppercase}.price.svelte-5ahdlg.svelte-5ahdlg,.quantity.svelte-5ahdlg.svelte-5ahdlg,.value.svelte-5ahdlg.svelte-5ahdlg{justify-content:flex-end}.controls.svelte-5ahdlg.svelte-5ahdlg{min-width:90px;padding-left:1em}@media only screen and (max-width: 999px){.token.svelte-5ahdlg.svelte-5ahdlg{padding-left:32px}.quantity.svelte-5ahdlg.svelte-5ahdlg{padding-right:32px}}@media only screen and (max-width: 600px){.controls.svelte-5ahdlg.svelte-5ahdlg,.value.svelte-5ahdlg.svelte-5ahdlg,.price.svelte-5ahdlg.svelte-5ahdlg{display:none}.token.svelte-5ahdlg.svelte-5ahdlg{padding-left:32px}.quantity.svelte-5ahdlg.svelte-5ahdlg{padding-right:32px}}",
  map: null
};
const Headerrow = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$11);
  return `<div class="${"container svelte-5ahdlg"}"><div class="${"token svelte-5ahdlg"}">Token</div>
    <div class="${"quantity svelte-5ahdlg"}">Balance</div>
    <div class="${"price svelte-5ahdlg"}">Price</div>
    <div class="${"value svelte-5ahdlg"}">Value</div>
    <div class="${"controls svelte-5ahdlg"}"></div></div>`;
});
const number_svelte_svelte_type_style_lang = "";
const css$10 = {
  code: ".int.svelte-1wfjzvy,.dec.svelte-1wfjzvy{font-family:Inter;font-style:normal;font-weight:500;font-size:13px;line-height:300%;display:flex;align-items:center;letter-spacing:-0.04px}.int.svelte-1wfjzvy{justify-content:flex-end;flex:1}.dec.svelte-1wfjzvy{color:var(--dark-grey);min-width:5em}",
  map: null
};
const Number_1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { asset } = $$props;
  let whole;
  let int;
  let dec;
  if ($$props.asset === void 0 && $$bindings.asset && asset !== void 0)
    $$bindings.asset(asset);
  $$result.css.add(css$10);
  {
    {
      whole = Math.floor(Number(asset.value)) || 0;
      int = new Intl.NumberFormat().format(whole);
      dec = (Number(asset.value) - whole).toFixed(asset.symbol.precision || 1).split(".")[1];
    }
  }
  return `<div class="${"int svelte-1wfjzvy"}">${escape(int)}</div>
<div class="${"dec svelte-1wfjzvy"}">${dec ? `.${escape(dec)}` : ``}</div>`;
});
const row_svelte_svelte_type_style_lang$1 = "";
const css$$ = {
  code: ".container.svelte-13a7o3t.svelte-13a7o3t.svelte-13a7o3t:nth-child(even){background:linear-gradient(90deg, rgba(248, 248, 248, 0) 0%, #f8f8f8 17.71%, #f8f8f8 80.73%, rgba(249, 249, 249, 0) 100%)}.darkmode .container.svelte-13a7o3t.svelte-13a7o3t.svelte-13a7o3t:nth-child(even){background:linear-gradient(90deg, rgba(17, 17, 17, 0) 0%, #111111 17.71%, #111111 80.73%, rgba(17, 17, 17, 0) 100%)}.container.svelte-13a7o3t:nth-child(even) .logo .wrapper.svelte-13a7o3t.svelte-13a7o3t{background:var(--main-white)}.container.svelte-13a7o3t.svelte-13a7o3t.svelte-13a7o3t:hover{background:linear-gradient(90deg, rgba(102, 155, 188, 0) 0%, rgba(102, 155, 188, 0.1) 17.71%, rgba(102, 155, 188, 0.1) 80.73%, rgba(102, 155, 188, 0) 100%)}.darkmode .container.svelte-13a7o3t.svelte-13a7o3t.svelte-13a7o3t:hover{background:linear-gradient(90deg, rgba(153, 100, 67, 0) 0%, rgba(153, 100, 67, 0.2) 17.71%, rgba(153, 100, 67, 0.2) 80.73%, rgba(153, 100, 67, 0) 100%)}.container.svelte-13a7o3t .row.svelte-13a7o3t.svelte-13a7o3t{display:flex;min-height:60px;max-height:84px;padding:12px}.container.svelte-13a7o3t .row.svelte-13a7o3t>.svelte-13a7o3t{display:inline-flex;align-items:center;margin-right:10px;flex:1}.container.svelte-13a7o3t .row.svelte-13a7o3t>.svelte-13a7o3t:nth-child(1){flex:0}.container.svelte-13a7o3t .row.svelte-13a7o3t>.svelte-13a7o3t:last-child{flex:0}.container.svelte-13a7o3t .row:hover .controls.svelte-13a7o3t .button{display:block}.container.svelte-13a7o3t .row .logo .wrapper.svelte-13a7o3t.svelte-13a7o3t{background-color:var(--main-grey);width:24px;height:24px;border-radius:50%}.container.svelte-13a7o3t .row .price.svelte-13a7o3t.svelte-13a7o3t,.container.svelte-13a7o3t .row .value.svelte-13a7o3t.svelte-13a7o3t{justify-content:flex-end}.container.svelte-13a7o3t .row .price.svelte-13a7o3t.svelte-13a7o3t,.container.svelte-13a7o3t .row .token.svelte-13a7o3t.svelte-13a7o3t,.container.svelte-13a7o3t .row .value.svelte-13a7o3t.svelte-13a7o3t{font-family:Inter;font-style:normal;font-weight:500;font-size:13px;line-height:300%;display:flex;align-items:center;letter-spacing:-0.04px}.container.svelte-13a7o3t .row .controls.svelte-13a7o3t.svelte-13a7o3t{min-width:90px;padding-left:1em}.container.svelte-13a7o3t .row .controls.svelte-13a7o3t .button{display:none}.container.svelte-13a7o3t .row .controls .mobile.svelte-13a7o3t.svelte-13a7o3t{display:none}.container.svelte-13a7o3t .row .controls .mobile.svelte-13a7o3t .icon{color:var(--dark-grey)}.container.svelte-13a7o3t .extra.svelte-13a7o3t.svelte-13a7o3t{display:none}.container.svelte-13a7o3t .extra .values.svelte-13a7o3t.svelte-13a7o3t{padding:0 12px;display:flex}.container.svelte-13a7o3t .extra .values.svelte-13a7o3t>.svelte-13a7o3t{flex-grow:1}.container.svelte-13a7o3t .extra .values .label.svelte-13a7o3t.svelte-13a7o3t{font-family:Inter;font-style:normal;font-weight:600;font-size:10px;line-height:12px;letter-spacing:0.1px;text-transform:uppercase;color:var(--dark-grey)}.container.svelte-13a7o3t .extra .values .amount.svelte-13a7o3t.svelte-13a7o3t{font-family:Inter;font-style:normal;font-weight:500;font-size:13px;line-height:300%;display:flex;align-items:center;letter-spacing:-0.04px;color:var(--main-black)}@media(hover: none){.container.svelte-13a7o3t .row .controls.svelte-13a7o3t .button{display:block}}@media only screen and (max-width: 600px){.container.svelte-13a7o3t .row .controls.svelte-13a7o3t.svelte-13a7o3t{min-width:auto;padding:0;margin:0}.container.svelte-13a7o3t .row .controls .desktop.svelte-13a7o3t.svelte-13a7o3t{display:none}.container.svelte-13a7o3t .row .controls .mobile.svelte-13a7o3t.svelte-13a7o3t{display:block}.container.svelte-13a7o3t .row .value.svelte-13a7o3t.svelte-13a7o3t,.container.svelte-13a7o3t .row .price.svelte-13a7o3t.svelte-13a7o3t{display:none}.container.svelte-13a7o3t .extra.svelte-13a7o3t .button{margin:9px}.container.expanded.svelte-13a7o3t .extra.svelte-13a7o3t.svelte-13a7o3t{display:block}}",
  map: null
};
function fiatFormat(value, precision2 = 2) {
  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: precision2
    }
  ).format(value);
}
const Row$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $token, $$unsubscribe_token;
  let $url, $$unsubscribe_url;
  let { balance } = $$props;
  let { name = "" } = $$props;
  let { transferable = true } = $$props;
  let token = derived([tokens], ([$tokens]) => {
    if (balance && $tokens) {
      return $tokens.find((t) => t.key === balance.tokenKey);
    }
  });
  $$unsubscribe_token = subscribe(token, (value) => $token = value);
  const url = derived(token, ($token2) => {
    if ($token2) {
      return `/transfer/${String($token2.contract).toLowerCase()}/${String($token2.name).toLowerCase()}`;
    }
  });
  $$unsubscribe_url = subscribe(url, (value) => $url = value);
  if ($$props.balance === void 0 && $$bindings.balance && balance !== void 0)
    $$bindings.balance(balance);
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.transferable === void 0 && $$bindings.transferable && transferable !== void 0)
    $$bindings.transferable(transferable);
  $$result.css.add(css$$);
  $$unsubscribe_token();
  $$unsubscribe_url();
  return `${$token && balance ? `<div class="${["container svelte-13a7o3t", ""].join(" ").trim()}"><div class="${"row svelte-13a7o3t"}"><div class="${"logo svelte-13a7o3t"}"><div class="${"wrapper svelte-13a7o3t"}">${validate_component(Token, "TokenImage").$$render(
    $$result,
    {
      width: "24",
      height: "24",
      tokenKey: $token.key
    },
    {},
    {}
  )}</div></div>
            <div class="${"token svelte-13a7o3t"}"><span class="${"name"}">${name ? `${escape(name)}` : `${$token ? `${escape($token.name)}` : `${escape(balance.quantity.symbol.name)}`}`}</span></div>
            ${balance.quantity ? `${validate_component(Number_1, "Number").$$render($$result, { asset: balance.quantity }, {}, {})}` : ``}
            <div class="${"price svelte-13a7o3t"}">${$token.price ? `${escape(fiatFormat($token.price, 4))}` : ``}</div>
            <div class="${"value svelte-13a7o3t"}">${$token.price ? `${escape(fiatFormat($token.price * balance.quantity.value, 2))}` : ``}</div>
            <div class="${"controls svelte-13a7o3t"}"><div class="${"desktop svelte-13a7o3t"}">${transferable ? `${validate_component(Button$2, "Button").$$render($$result, { href: $url, style: "secondary" }, {}, {
    default: () => {
      return `${validate_component(Icon, "Icon").$$render($$result, { name: "arrow-up" }, {}, {})}
                            ${validate_component(Text, "Text").$$render($$result, {}, {}, {
        default: () => {
          return `Send`;
        }
      })}`;
    }
  })}` : ``}</div>
                <div class="${"mobile svelte-13a7o3t"}">${validate_component(Icon, "Icon").$$render(
    $$result,
    {
      name: "chevron-right"
    },
    {},
    {}
  )}</div></div></div>
        <div class="${"extra svelte-13a7o3t"}"><div class="${"values svelte-13a7o3t"}">${$token.price ? `<div class="${"value svelte-13a7o3t"}"><div class="${"label svelte-13a7o3t"}">Value</div>
                        <div class="${"amount svelte-13a7o3t"}">${escape(fiatFormat($token.price * balance.quantity.value))}</div></div>
                    <div class="${"price svelte-13a7o3t"}"><div class="${"label svelte-13a7o3t"}">Price</div>
                        <div class="${"amount svelte-13a7o3t"}">${escape(fiatFormat($token.price))}</div></div>` : ``}</div>
            ${transferable ? `${validate_component(Button$2, "Button").$$render(
    $$result,
    {
      fluid: true,
      href: $url,
      style: "secondary"
    },
    {},
    {
      default: () => {
        return `${validate_component(Icon, "Icon").$$render($$result, { name: "arrow-up" }, {}, {})}
                    ${validate_component(Text, "Text").$$render($$result, {}, {}, {
          default: () => {
            return `Send`;
          }
        })}`;
      }
    }
  )}` : ``}</div></div>` : ``}`;
});
const table_svelte_svelte_type_style_lang = "";
const css$_ = {
  code: ".records.svelte-fztn99{display:flex;flex-direction:column}",
  map: null
};
const Table = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $systemTokenBalance, $$unsubscribe_systemTokenBalance;
  let $stakedBalance, $$unsubscribe_stakedBalance;
  let $systemToken, $$unsubscribe_systemToken;
  let $rexBalance, $$unsubscribe_rexBalance;
  let $records, $$unsubscribe_records;
  $$unsubscribe_systemToken = subscribe(systemToken, (value) => $systemToken = value);
  let { balances: balances2 } = $$props;
  let { delegatedTokens } = $$props;
  let { rexTokens } = $$props;
  const records = derived([activeSession, balances2, systemTokenKey], ([$activeSession, $balances, $systemTokenKey]) => {
    const results = [];
    if ($activeSession && $balances) {
      results.push(...$balances.filter((b2) => b2.chainId.equals($activeSession.chainId) && b2.account.equals($activeSession.auth.actor) && b2.tokenKey !== $systemTokenKey));
    }
    return results;
  });
  $$unsubscribe_records = subscribe(records, (value) => $records = value);
  const systemTokenBalance2 = derived([activeSession, balances2, systemTokenKey], ([$activeSession, $balances, $systemTokenKey]) => {
    if ($activeSession && $balances) {
      return $balances.find((b2) => b2.chainId.equals($activeSession.chainId) && b2.account.equals($activeSession.auth.actor) && b2.tokenKey === $systemTokenKey);
    }
  });
  $$unsubscribe_systemTokenBalance = subscribe(systemTokenBalance2, (value) => $systemTokenBalance = value);
  const rexBalance = derived([activeSession, rexTokens, systemToken], ([$activeSession, $rexTokens, $systemToken2]) => {
    if ($activeSession && $rexTokens && $systemToken2) {
      const token = createBalanceFromToken($activeSession, $systemToken2, Asset$1.from($rexTokens, $systemToken2.symbol));
      return token;
    }
  });
  $$unsubscribe_rexBalance = subscribe(rexBalance, (value) => $rexBalance = value);
  const stakedBalance = derived([activeSession, delegatedTokens, systemToken], ([$activeSession, $delegatedTokens, $systemToken2]) => {
    if ($activeSession && $delegatedTokens && $systemToken2) {
      const token = createBalanceFromToken($activeSession, $systemToken2, Asset$1.from($delegatedTokens, $systemToken2.symbol));
      return token;
    }
  });
  $$unsubscribe_stakedBalance = subscribe(stakedBalance, (value) => $stakedBalance = value);
  if ($$props.balances === void 0 && $$bindings.balances && balances2 !== void 0)
    $$bindings.balances(balances2);
  if ($$props.delegatedTokens === void 0 && $$bindings.delegatedTokens && delegatedTokens !== void 0)
    $$bindings.delegatedTokens(delegatedTokens);
  if ($$props.rexTokens === void 0 && $$bindings.rexTokens && rexTokens !== void 0)
    $$bindings.rexTokens(rexTokens);
  $$result.css.add(css$_);
  $$unsubscribe_systemTokenBalance();
  $$unsubscribe_stakedBalance();
  $$unsubscribe_systemToken();
  $$unsubscribe_rexBalance();
  $$unsubscribe_records();
  return `<div class="${"records svelte-fztn99"}">${validate_component(Headerrow, "TokenHeaderRow").$$render($$result, {}, {}, {})}
    ${$systemTokenBalance ? `${validate_component(Row$1, "TokenRow").$$render($$result, { balance: $systemTokenBalance }, {}, {})}` : ``}
    ${$stakedBalance && $systemToken ? `${validate_component(Row$1, "TokenRow").$$render(
    $$result,
    {
      balance: $stakedBalance,
      name: `${$systemToken.name} (Staked)`,
      transferable: false
    },
    {},
    {}
  )}` : ``}
    ${$rexBalance && $systemToken ? `${validate_component(Row$1, "TokenRow").$$render(
    $$result,
    {
      balance: $rexBalance,
      name: `${$systemToken.name} (REX)`,
      transferable: false
    },
    {},
    {}
  )}` : ``}
    ${$records ? `${each($records, (balance) => {
    return `${validate_component(Row$1, "TokenRow").$$render($$result, { balance }, {}, {})}`;
  })}` : ``}</div>`;
});
const index_svelte_svelte_type_style_lang$5 = "";
const css$Z = {
  code: ".container.svelte-1sxzdh2.svelte-1sxzdh2{margin-top:16px}.balances.svelte-1sxzdh2 .segment{display:flex;align-items:center}.balances.svelte-1sxzdh2 .info.svelte-1sxzdh2{flex-grow:1;display:flex;flex-direction:column}.balances.svelte-1sxzdh2 .label.svelte-1sxzdh2{font-weight:bold;font-size:10px;line-height:12px;letter-spacing:0.1px;text-transform:uppercase;color:var(--main-black)}.balances.svelte-1sxzdh2 .amount.svelte-1sxzdh2{font-size:20px;line-height:24px;margin:10px 0 6px;color:var(--black)}.balances.svelte-1sxzdh2 .symbol.svelte-1sxzdh2{font-size:16px;line-height:19px;color:var(--black)}.balances.svelte-1sxzdh2 .icon.svelte-1sxzdh2{width:60px;line-height:60px;font-size:38px;font-weight:300;text-align:center;color:#000000;background:#ffffff;border-radius:50%}.options.svelte-1sxzdh2.svelte-1sxzdh2{text-align:right}@media only screen and (max-width: 999px){.balances.svelte-1sxzdh2.svelte-1sxzdh2{padding:0 25px}}",
  map: null
};
const Dashboard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $activeSession, $$unsubscribe_activeSession;
  let $activeBlockchain, $$unsubscribe_activeBlockchain;
  let $isLoading, $$unsubscribe_isLoading;
  let $balances, $$unsubscribe_balances;
  let $totalSystemTokens, $$unsubscribe_totalSystemTokens;
  let $systemTokenKey, $$unsubscribe_systemTokenKey;
  let $totalUsdValue, $$unsubscribe_totalUsdValue;
  $$unsubscribe_activeSession = subscribe(activeSession, (value) => $activeSession = value);
  $$unsubscribe_activeBlockchain = subscribe(activeBlockchain, (value) => $activeBlockchain = value);
  $$unsubscribe_isLoading = subscribe(isLoading, (value) => $isLoading = value);
  $$unsubscribe_balances = subscribe(balances, (value) => $balances = value);
  $$unsubscribe_systemTokenKey = subscribe(systemTokenKey, (value) => $systemTokenKey = value);
  const delegations = derived([activeBlockchain, currentAccount], ([$activeBlockchain2, $currentAccount], set) => {
    if ($activeBlockchain2 && $activeBlockchain2.chainFeatures.has(ChainFeatures.Staking) && $currentAccount) {
      getClient($activeBlockchain2.chainId).v1.chain.get_table_rows({
        code: "eosio",
        table: "delband",
        scope: $currentAccount.account_name,
        type: DelegatedBandwidth
      }).then((result) => {
        set(result);
      }).catch((err) => {
        console.warn("Error retrieving delegations", err);
        set({ rows: [] });
      });
    }
  });
  const delegatedTokens = derived([currentAccount, delegations], ([$currentAccount, $delegations]) => {
    let delegated = 0;
    if ($currentAccount && $delegations && $delegations.rows.length > 0) {
      $delegations.rows.filter((record) => record.from.equals($currentAccount.account_name)).forEach((record) => {
        delegated += record.cpu_weight.value;
        delegated += record.net_weight.value;
      });
    }
    return delegated;
  });
  const rexTokens = derived([currentAccount, stateREX], ([$currentAccount, $stateREX]) => {
    if ($currentAccount && $currentAccount.rex_info && $stateREX && $stateREX.value) {
      return $stateREX.value * $currentAccount.rex_info.rex_balance.value;
    }
    return 0;
  });
  const totalUsdValue = derived([balances, currentAccount, delegatedTokens, activePriceTicker, rexTokens], ([$balances2, $currentAccount, $delegated, $price, $rex]) => {
    let value = 0;
    if ($currentAccount && $price !== void 0) {
      value += $rex * $price;
      value += $delegated * $price;
      $balances2.filter((record) => record.account.equals($currentAccount.account_name)).map((record) => {
        const token = getToken(record.tokenKey);
        if (token && token.price) {
          value += record.quantity.value * token.price;
        }
      });
    }
    return value;
  });
  $$unsubscribe_totalUsdValue = subscribe(totalUsdValue, (value) => $totalUsdValue = value);
  const totalSystemTokens = derived([balances, currentAccount, delegatedTokens, rexTokens, systemTokenKey], ([$balances2, $currentAccount, $delegated, $rex, $systemTokenKey2]) => {
    let amount = 0;
    if ($currentAccount) {
      $balances2.filter((record) => record.account.equals($currentAccount.account_name) && record.tokenKey === $systemTokenKey2).map((record) => {
        amount += record.quantity.value;
      });
    }
    if ($delegated) {
      amount += $delegated;
    }
    if ($rex) {
      amount += $rex;
    }
    return Asset$1.from(amount, $activeBlockchain.coreTokenSymbol);
  });
  $$unsubscribe_totalSystemTokens = subscribe(totalSystemTokens, (value) => $totalSystemTokens = value);
  const currencyFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
  function fiatFormat2(value) {
    return currencyFormatter.format(value);
  }
  $$result.css.add(css$Z);
  $$unsubscribe_activeSession();
  $$unsubscribe_activeBlockchain();
  $$unsubscribe_isLoading();
  $$unsubscribe_balances();
  $$unsubscribe_totalSystemTokens();
  $$unsubscribe_systemTokenKey();
  $$unsubscribe_totalUsdValue();
  return `${validate_component(Page$1, "Page").$$render(
    $$result,
    {
      title: "Account",
      subtitle: String($activeSession == null ? void 0 : $activeSession.auth.actor)
    },
    {},
    {
      header: () => {
        return `<span slot="${"header"}"><div class="${"options svelte-1sxzdh2"}">${validate_component(Button$2, "Button").$$render($$result, {}, {}, {
          default: () => {
            return `${validate_component(Icon, "Icon").$$render($$result, { spin: $isLoading, name: "refresh-cw" }, {}, {})}`;
          }
        })}</div></span>`;
      },
      default: () => {
        return `${$balances ? `<div class="${"container svelte-1sxzdh2"}"><div class="${"balances svelte-1sxzdh2"}">${validate_component(Group, "SegmentGroup").$$render($$result, {}, {}, {
          default: () => {
            return `${validate_component(Segment, "Segment").$$render($$result, { background: "image" }, {}, {
              default: () => {
                return `<div class="${"info svelte-1sxzdh2"}"><span class="${"label svelte-1sxzdh2"}">Total ${escape($totalSystemTokens.symbol.name)} Balance
                            </span>
                            <span class="${"amount svelte-1sxzdh2"}">${escape($totalSystemTokens.value)}</span>
                            <span class="${"symbol svelte-1sxzdh2"}">${escape($totalSystemTokens.symbol.name)}</span></div>
                        <div class="${"image"}">${validate_component(Token, "TokenImage").$$render(
                  $$result,
                  {
                    width: "60",
                    height: "60",
                    tokenKey: $systemTokenKey
                  },
                  {},
                  {}
                )}</div>`;
              }
            })}
                    ${validate_component(Segment, "Segment").$$render($$result, { background: "image-alt" }, {}, {
              default: () => {
                return `<div class="${"info svelte-1sxzdh2"}"><span class="${"label svelte-1sxzdh2"}">Account Value</span>
                            <span class="${"amount svelte-1sxzdh2"}">${escape(fiatFormat2($totalUsdValue))}</span>
                            <span class="${"symbol svelte-1sxzdh2"}">USD</span></div>
                        <div class="${"icon svelte-1sxzdh2"}">$</div>`;
              }
            })}`;
          }
        })}</div>
            ${validate_component(Table, "TokenTable").$$render($$result, { balances, rexTokens, delegatedTokens }, {}, {})}</div>` : ``}`;
      }
    }
  )}`;
});
let currentRoute = writable(void 0);
let currentChain = writable(void 0);
let currentChainConfig;
currentChain.subscribe((value) => currentChainConfig = value);
let apiClient = derived(currentChain, ($currentChain) => {
  if ($currentChain) {
    return getClient($currentChain.chainId);
  }
});
let abiProvider = derived(apiClient, ($apiClient) => {
  if ($apiClient) {
    return {
      getAbi: async (account) => {
        return (await $apiClient.v1.chain.get_abi(account)).abi;
      }
    };
  }
});
const currentRequest = derived(
  currentRoute,
  ($currentRoute) => {
    if ($currentRoute) {
      return SigningRequest.from(`esr:${$currentRoute.params.payload}`, {
        zlib
      });
    }
  }
);
currentRequest.subscribe((request) => {
  if (request) {
    const id = request.getChainId();
    if (!currentChainConfig || !currentChainConfig.chainId.equals(id)) {
      currentChain.set(chainConfig(id));
    }
  }
});
const abis = derived(
  [abiProvider, currentRequest],
  ([$abiProvider, $currentRequest], set) => {
    if ($currentRequest && currentChainConfig) {
      $currentRequest.fetchAbis($abiProvider).then((abis2) => set(abis2));
    }
  }
);
derived(currentRequest, ($currentRequest) => {
  if ($currentRequest) {
    return $currentRequest.isMultiChain();
  }
  return false;
});
const currentTransaction = derived(
  [abis, activeSession, apiClient, currentRequest],
  ([$abis, $activeSession, $apiClient, $currentRequest], set) => {
    if ($apiClient && $abis && $currentRequest) {
      let auth = PermissionLevel.from({
        actor: "test",
        permission: "active"
      });
      if ($activeSession) {
        auth = $activeSession.auth;
      }
      $apiClient.v1.chain.get_info().then((info2) => {
        const header = info2.getTransactionHeader();
        set($currentRequest.resolveTransaction($abis, auth, header));
      });
    }
    return void 0;
  }
);
const templates = [
  {
    name: "newaccount",
    actions: ["eosio::newaccount", "eosio::buyrambytes"]
  }
];
const currentTemplate = derived(
  currentTransaction,
  ($currentTransaction) => {
    if ($currentTransaction) {
      const actions = $currentTransaction.actions.map(
        (action) => `${action.account}::${action.name}`
      );
      const matching = templates.find(
        (template) => JSON.stringify(template.actions) === JSON.stringify(actions)
      );
      if (matching) {
        return matching.name;
      }
      return "default";
    }
    return "loading";
  }
);
const qrcode_svelte_svelte_type_style_lang = "";
const css$Y = {
  code: "div.svelte-1xfvjso{background:#ffffff;border:1px solid #e0e6ee;box-sizing:border-box;border-radius:24px;margin:0 auto;padding:15px;position:relative;width:280px}div.svelte-1xfvjso .icon{position:absolute;left:0;right:0;margin-left:auto;margin-right:auto;color:var(--white);background:var(--main-blue);border-radius:50%;padding:7px}",
  map: null
};
const Qrcode$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data = "" } = $$props;
  let { size = 250 } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  $$result.css.add(css$Y);
  return `<div class="${"svelte-1xfvjso"}">${``}
    ${validate_component(Icon, "Icon").$$render($$result, { size: "huge", name: "zoom-in" }, {}, {})}</div>`;
});
const Default = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $request, $$unsubscribe_request;
  let $chain, $$unsubscribe_chain;
  let $session, $$unsubscribe_session;
  let $transaction, $$unsubscribe_transaction;
  let { transaction } = $$props;
  $$unsubscribe_transaction = subscribe(transaction, (value) => $transaction = value);
  let { session } = $$props;
  $$unsubscribe_session = subscribe(session, (value) => $session = value);
  let { chain } = $$props;
  $$unsubscribe_chain = subscribe(chain, (value) => $chain = value);
  let { request } = $$props;
  $$unsubscribe_request = subscribe(request, (value) => $request = value);
  let { sign } = $$props;
  if ($$props.transaction === void 0 && $$bindings.transaction && transaction !== void 0)
    $$bindings.transaction(transaction);
  if ($$props.session === void 0 && $$bindings.session && session !== void 0)
    $$bindings.session(session);
  if ($$props.chain === void 0 && $$bindings.chain && chain !== void 0)
    $$bindings.chain(chain);
  if ($$props.request === void 0 && $$bindings.request && request !== void 0)
    $$bindings.request(request);
  if ($$props.sign === void 0 && $$bindings.sign && sign !== void 0)
    $$bindings.sign(sign);
  $$unsubscribe_request();
  $$unsubscribe_chain();
  $$unsubscribe_session();
  $$unsubscribe_transaction();
  return `<div>${validate_component(Qrcode$1, "QRCode").$$render($$result, { data: String($request) }, {}, {})}

    ${$chain && $session ? `${$chain.chainId.equals($session.chainId) ? `${validate_component(Button$2, "Button").$$render($$result, {}, {}, {
    default: () => {
      return `Sign Transaction`;
    }
  })}` : `<p>Switch to an account on ${escape($chain.name)} to sign this transaction.</p>`}` : ``}

    ${$transaction ? `<code><pre>${escape(JSON.stringify($transaction, null, 4))}</pre></code>` : ``}</div>`;
});
const loading_svelte_svelte_type_style_lang$1 = "";
const css$X = {
  code: "div.svelte-16xiifc.svelte-16xiifc{padding:3em;text-align:center}div.svelte-16xiifc svg g.svelte-16xiifc{stroke:var(--main-blue)}div.svelte-16xiifc p.svelte-16xiifc{margin:1em}",
  map: null
};
const Loading$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$X);
  return `<div class="${"svelte-16xiifc"}">
    <svg width="${"128"}" height="${"128"}" viewBox="${"0 0 45 45"}" xmlns="${"http://www.w3.org/2000/svg"}" stroke="${"#fff"}"><g fill="${"none"}" fill-rule="${"evenodd"}" transform="${"translate(1 1)"}" stroke-width="${"2"}" class="${"svelte-16xiifc"}"><circle cx="${"22"}" cy="${"22"}" r="${"6"}" stroke-opacity="${"0"}"><animate attributeName="${"r"}" begin="${"1.5s"}" dur="${"3s"}" values="${"6;22"}" calcMode="${"linear"}" repeatCount="${"indefinite"}"></animate><animate attributeName="${"stroke-opacity"}" begin="${"1.5s"}" dur="${"3s"}" values="${"1;0"}" calcMode="${"linear"}" repeatCount="${"indefinite"}"></animate><animate attributeName="${"stroke-width"}" begin="${"1.5s"}" dur="${"3s"}" values="${"2;0"}" calcMode="${"linear"}" repeatCount="${"indefinite"}"></animate></circle><circle cx="${"22"}" cy="${"22"}" r="${"6"}" stroke-opacity="${"0"}"><animate attributeName="${"r"}" begin="${"3s"}" dur="${"3s"}" values="${"6;22"}" calcMode="${"linear"}" repeatCount="${"indefinite"}"></animate><animate attributeName="${"stroke-opacity"}" begin="${"3s"}" dur="${"3s"}" values="${"1;0"}" calcMode="${"linear"}" repeatCount="${"indefinite"}"></animate><animate attributeName="${"stroke-width"}" begin="${"3s"}" dur="${"3s"}" values="${"2;0"}" calcMode="${"linear"}" repeatCount="${"indefinite"}"></animate></circle><circle cx="${"22"}" cy="${"22"}" r="${"8"}"><animate attributeName="${"r"}" begin="${"0s"}" dur="${"1.5s"}" values="${"6;1;2;3;4;5;6"}" calcMode="${"linear"}" repeatCount="${"indefinite"}"></animate></circle></g></svg>
    <p class="${"svelte-16xiifc"}">Loading Request...</p></div>`;
});
let resourceClient = derived(apiClient, ($apiClient) => {
  if ($apiClient) {
    return new Resources$1({ api: $apiClient });
  }
});
const stateRAM = derived(
  [resourceClient],
  ([$resourceClient], set) => {
    if ($resourceClient) {
      $resourceClient.v1.ram.get_state().then((result) => set(result)).catch((e) => {
        console.error(e);
        set(void 0);
      });
    }
  }
);
const newaccount_svelte_svelte_type_style_lang = "";
const css$W = {
  code: ".info.svelte-1fnutgs.svelte-1fnutgs{text-align:center}.info.svelte-1fnutgs h2.svelte-1fnutgs{margin-top:2em;font-family:Inter;font-style:normal;font-weight:bold;font-size:24px;line-height:29px;text-align:center;letter-spacing:-0.47px;color:#585d6e}.info.svelte-1fnutgs .button{margin:2em 0 1em}ul.request.svelte-1fnutgs.svelte-1fnutgs{margin:2em auto;font-size:1.25em}ul.request.svelte-1fnutgs li.svelte-1fnutgs{padding:1em 0;display:flex;flex-direction:row;flex-wrap:wrap;width:100%;border-bottom:1px solid black;font-family:Inter;font-style:normal;font-weight:bold;display:flex;align-items:center;letter-spacing:0.01px;color:#585d6e}ul.request.svelte-1fnutgs li span.svelte-1fnutgs{display:flex;flex-direction:column;flex-basis:100%;flex:1;text-align:right}ul.request.svelte-1fnutgs li span.svelte-1fnutgs:first-child{text-align:left}ul.request.svelte-1fnutgs li.svelte-1fnutgs:last-child{border:none}",
  map: null
};
const Newaccount = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let price;
  let $chain, $$unsubscribe_chain;
  let $accountExists, $$unsubscribe_accountExists;
  let $request, $$unsubscribe_request;
  let $session, $$unsubscribe_session;
  let $price, $$unsubscribe_price = noop, $$subscribe_price = () => ($$unsubscribe_price(), $$unsubscribe_price = subscribe(price, ($$value) => $price = $$value), price);
  let { transaction } = $$props;
  let { session } = $$props;
  $$unsubscribe_session = subscribe(session, (value) => $session = value);
  let { chain } = $$props;
  $$unsubscribe_chain = subscribe(chain, (value) => $chain = value);
  let { request } = $$props;
  $$unsubscribe_request = subscribe(request, (value) => $request = value);
  let { sign } = $$props;
  let loading = true;
  let newaccount;
  let buyram;
  let cost = Asset$2.fromUnits(0, $chain.coreTokenSymbol);
  transaction.subscribe((tx) => {
    newaccount = tx.actions.find((action) => action.account.equals("eosio") && action.name.equals("newaccount"));
    buyram = tx.actions.find((action) => action.account.equals("eosio") && action.name.equals("buyrambytes"));
  });
  const getAccountExists = async (set) => {
    if (newaccount) {
      getClient($chain).v1.chain.get_account(newaccount.data.name).then((response) => {
        if (response.account_name.equals(newaccount.data.name)) {
          set(true);
        }
      }).catch((error) => {
        const isUnkownAccountError = error.toString().includes("exception: unknown key");
        if (isUnkownAccountError) {
          set(false);
          return;
        }
        throw error;
      }).finally(() => loading = false);
    }
  };
  const accountExists = readable(void 0, (set) => {
    getAccountExists(set);
    const interval = setInterval(() => getAccountExists(set), 15e3);
    return () => {
      clearInterval(interval);
    };
  });
  $$unsubscribe_accountExists = subscribe(accountExists, (value) => $accountExists = value);
  stateRAM.subscribe((state) => {
    if (state) {
      cost = Asset$2.from(state.price_per(buyram.data.bytes), $chain.coreTokenSymbol);
    }
  });
  if ($$props.transaction === void 0 && $$bindings.transaction && transaction !== void 0)
    $$bindings.transaction(transaction);
  if ($$props.session === void 0 && $$bindings.session && session !== void 0)
    $$bindings.session(session);
  if ($$props.chain === void 0 && $$bindings.chain && chain !== void 0)
    $$bindings.chain(chain);
  if ($$props.request === void 0 && $$bindings.request && request !== void 0)
    $$bindings.request(request);
  if ($$props.sign === void 0 && $$bindings.sign && sign !== void 0)
    $$bindings.sign(sign);
  if ($$props.getAccountExists === void 0 && $$bindings.getAccountExists && getAccountExists !== void 0)
    $$bindings.getAccountExists(getAccountExists);
  if ($$props.accountExists === void 0 && $$bindings.accountExists && accountExists !== void 0)
    $$bindings.accountExists(accountExists);
  $$result.css.add(css$W);
  $$subscribe_price(price = priceTicker($chain).catch((error) => {
    console.warn(`Unable to load price on ${$chain.id}`, error);
  }));
  $$unsubscribe_chain();
  $$unsubscribe_accountExists();
  $$unsubscribe_request();
  $$unsubscribe_session();
  $$unsubscribe_price();
  return `${loading ? `${validate_component(Loading$1, "Loading").$$render($$result, {}, {}, {})}` : `${$accountExists === true ? `<div>This account was already created!</div>` : `<div>${validate_component(Qrcode$1, "QRCode").$$render($$result, { data: String($request) }, {}, {})}

        <div class="${"info svelte-1fnutgs"}"><h2 class="${"svelte-1fnutgs"}">Account Creation Request</h2>
            <p>Someone has requested the creation of a new account.</p></div>

        <ul class="${"request svelte-1fnutgs"}">${newaccount ? `<li class="${"svelte-1fnutgs"}"><span class="${"svelte-1fnutgs"}">EOSIO Network</span>
                    <span class="${"svelte-1fnutgs"}">${escape(String($chain.name))}</span></li>` : ``}
            ${newaccount ? `<li class="${"svelte-1fnutgs"}"><span class="${"svelte-1fnutgs"}">Account Name</span>
                    <span class="${"svelte-1fnutgs"}">${escape(String(newaccount.data.name))}</span></li>` : ``}
            ${buyram ? `<li class="${"svelte-1fnutgs"}"><span class="${"svelte-1fnutgs"}">Purchase RAM</span>
                    <span class="${"svelte-1fnutgs"}">${escape(String(buyram.data.bytes))} bytes</span></li>` : ``}</ul>

        <div class="${"info svelte-1fnutgs"}">${$chain ? `${$session ? `${$chain.chainId.equals($session.chainId) ? `${validate_component(Button$2, "Button").$$render($$result, { style: "primary", size: "large" }, {}, {
    default: () => {
      return `Pay to create this account`;
    }
  })}` : `<h2 class="${"svelte-1fnutgs"}">Switch to an account on ${escape($chain.name)} to sign.</h2>
                        ${validate_component(Button$2, "Button").$$render(
    $$result,
    {
      style: "primary",
      size: "large",
      disabled: true
    },
    {},
    {
      default: () => {
        return `Pay to create this account`;
      }
    }
  )}`}` : `<p>To approve this request, either scan the QR code above with a compatible
                        wallet or use the button below to manually sign this request with Anchor.
                    </p>
                    ${validate_component(Button$2, "Button").$$render($$result, { style: "primary", size: "large" }, {}, {
    default: () => {
      return `Pay to create this account`;
    }
  })}`}` : ``}
            ${cost && $chain ? `<div><p>Estimated account creation cost of ${escape(cost)}</p>
                    ${$price ? `<p>Valued at $${escape(Asset$2.from(cost.value * Number($price), "2,USD"))} ($${escape(Asset$2.from(Number($price), "2,USD").value)}
                            ${escape($chain.coreTokenSymbol.name)}/USD)
                        </p>` : ``}</div>` : ``}</div></div>`}`}`;
});
const Request = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $currentRequest, $$unsubscribe_currentRequest;
  let $activeSession, $$unsubscribe_activeSession;
  let $currentTemplate, $$unsubscribe_currentTemplate;
  $$unsubscribe_currentRequest = subscribe(currentRequest, (value) => $currentRequest = value);
  $$unsubscribe_activeSession = subscribe(activeSession, (value) => $activeSession = value);
  $$unsubscribe_currentTemplate = subscribe(currentTemplate, (value) => $currentTemplate = value);
  O();
  const templates2 = { loading: Loading$1, newaccount: Newaccount };
  async function sign() {
    if ($activeSession) {
      const info2 = await $activeSession.client.v1.chain.get_info();
      const header = info2.getTransactionHeader();
      const abis2 = await $currentRequest.fetchAbis();
      const transaction = $currentRequest.resolveTransaction(abis2, $activeSession.auth, header);
      $activeSession.transact({ transaction });
    } else if ($currentRequest) {
      window.location.href = $currentRequest.encode();
    }
  }
  $$unsubscribe_currentRequest();
  $$unsubscribe_activeSession();
  $$unsubscribe_currentTemplate();
  return `${validate_component(Page$1, "Page").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(templates2[$currentTemplate] || Default || missing_component, "svelte:component").$$render(
        $$result,
        {
          chain: currentChain,
          request: currentRequest,
          session: activeSession,
          transaction: currentTransaction,
          sign
        },
        {},
        {}
      )}`;
    }
  })}`;
});
var Step = /* @__PURE__ */ ((Step2) => {
  Step2[Step2["Token"] = 0] = "Token";
  Step2[Step2["Recipient"] = 1] = "Recipient";
  Step2[Step2["Amount"] = 2] = "Amount";
  Step2[Step2["Confirm"] = 3] = "Confirm";
  Step2[Step2["Memo"] = 4] = "Memo";
  Step2[Step2["Sending"] = 5] = "Sending";
  Step2[Step2["Sent"] = 6] = "Sent";
  Step2[Step2["Failed"] = 7] = "Failed";
  Step2[Step2["Receive"] = 8] = "Receive";
  return Step2;
})(Step || {});
const transferData = writable({ step: 1 });
const txFee = writable(void 0);
async function fetchTxFee() {
  const session = get_store_value(activeSession);
  const blockchain = get_store_value(activeBlockchain);
  let fee;
  if (blockchain.id === "fio") {
    const fees = await (session == null ? void 0 : session.client.v1.chain.get_table_rows({
      code: "fio.fee",
      table: "fiofees",
      scope: "fio.fee",
      key_type: "i64",
      index_position: "primary",
      lower_bound: UInt64.from(5),
      upper_bound: UInt64.from(5),
      limit: 1
    }));
    fee = Asset$1.fromUnits((fees == null ? void 0 : fees.rows[0].suf_amount) || 0, blockchain.coreTokenSymbol);
  }
  txFee.set(fee);
}
const Form = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $formDisabled, $$unsubscribe_formDisabled;
  createEventDispatcher();
  let formFields = {};
  let formDisabled = writable(true);
  $$unsubscribe_formDisabled = subscribe(formDisabled, (value) => $formDisabled = value);
  const form = {
    setInput: (name, valid = false) => {
      formFields[name] = valid;
      validate();
    },
    onChange: (response) => {
      formFields[response.name] = response.valid;
      validate();
    }
  };
  setContext("form", form);
  setContext("formDisabled", formDisabled);
  function validate() {
    set_store_value(formDisabled, $formDisabled = Object.values(formFields).some((v2) => v2 === false), $formDisabled);
  }
  $$unsubscribe_formDisabled();
  return `<form>${slots.default ? slots.default({}) : ``}</form>`;
});
const card_svelte_svelte_type_style_lang = "";
const css$V = {
  code: ".card.svelte-1y3kouq{border:1px solid var(--divider-grey);border-radius:10px;padding:40px 52px}@media(max-width: 600px){.card.svelte-1y3kouq{padding:0;border:0;margin:0 16px}}",
  map: null
};
const Card = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$V);
  return `<section class="${"card svelte-1y3kouq"}">${slots.default ? slots.default({}) : ``}</section>`;
});
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp(target, key, result);
  return result;
};
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
function followTransaction(id, chain) {
  const client = getClient(chain);
  const ctx = { interval: 10 * 1e3 };
  const tx = pollStore(null, () => getTransaction(id, client), ctx);
  return tx.map((result) => {
    if (result.value) {
      const { last_irreversible_block, block_num, trx: info2, block_time } = result.value;
      const until_irreversible = Math.max(
        0,
        Number(block_num) - Number(last_irreversible_block)
      );
      const irreversible = until_irreversible === 0;
      if (irreversible) {
        ctx.stop();
      }
      return {
        value: {
          block_num,
          block_time,
          until_irreversible,
          info: info2,
          status: irreversible ? "irreversible" : info2.receipt.status
        }
      };
    }
    return {
      value: {
        status: "pending"
      }
    };
  });
}
function exporerUrl(id, chain) {
  return `${chain.bloksUrl}/transaction/${id}`;
}
function pollStore(initial, fn, ctx) {
  return readable$1({ value: initial }, (set, error) => {
    let running = true;
    let timer;
    const run = () => {
      const start = Date.now();
      fn().then(set).catch(error).finally(() => {
        if (running) {
          const delta = Date.now() - start;
          timer = setTimeout(run, Math.max(0, ctx.interval - delta));
        }
      });
    };
    run();
    ctx.stop = () => {
      running = false;
      clearTimeout(timer);
    };
    return ctx.stop;
  });
}
let GetTransactionResponse = class extends Struct {
  constructor() {
    super(...arguments);
    __publicField(this, "id");
    __publicField(this, "block_num");
    __publicField(this, "block_time");
    __publicField(this, "last_irreversible_block");
    __publicField(this, "traces");
    __publicField(this, "trx");
  }
};
__decorateClass([
  Struct.field(Checksum256)
], GetTransactionResponse.prototype, "id", 2);
__decorateClass([
  Struct.field(UInt32)
], GetTransactionResponse.prototype, "block_num", 2);
__decorateClass([
  Struct.field(BlockTimestamp)
], GetTransactionResponse.prototype, "block_time", 2);
__decorateClass([
  Struct.field(UInt32)
], GetTransactionResponse.prototype, "last_irreversible_block", 2);
__decorateClass([
  Struct.field("any?")
], GetTransactionResponse.prototype, "traces", 2);
__decorateClass([
  Struct.field("any")
], GetTransactionResponse.prototype, "trx", 2);
GetTransactionResponse = __decorateClass([
  Struct.type("get_transaction_response")
], GetTransactionResponse);
async function getTransaction(id, client) {
  return client.call({
    path: "/v1/history/get_transaction",
    params: { traces: false, id },
    responseType: GetTransactionResponse
  });
}
const summary_svelte_svelte_type_style_lang = "";
const css$U = {
  code: "section.svelte-1aa9l9t.svelte-1aa9l9t{margin-top:50px}div.svelte-1aa9l9t.svelte-1aa9l9t{font-size:12px;display:flex;border-bottom:1px solid var(--divider-grey);justify-content:space-between;align-items:center;padding:1.5em 0}div.svelte-1aa9l9t .title.svelte-1aa9l9t{font-weight:700;white-space:nowrap;margin-right:1em}div.svelte-1aa9l9t .content.svelte-1aa9l9t{text-align:right;max-width:70%;font-weight:500}div.svelte-1aa9l9t.svelte-1aa9l9t:last-child{border:0}.status.svelte-1aa9l9t .content.svelte-1aa9l9t{text-transform:capitalize}",
  map: null
};
const Summary = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { status } = $$props;
  let countdown;
  const bnFormatter = new Intl.NumberFormat("en-US");
  const dateFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: "full", timeStyle: "long" });
  if ($$props.status === void 0 && $$bindings.status && status !== void 0)
    $$bindings.status(status);
  $$result.css.add(css$U);
  countdown = (status.until_irreversible || 0) * 0.5;
  return `<section class="${"svelte-1aa9l9t"}"><div class="${"status svelte-1aa9l9t"}"><span class="${"title svelte-1aa9l9t"}">Status</span>
        <span class="${"content svelte-1aa9l9t"}">${escape(status.status)}
            ${status.status == "executed" ? `\xA0 \xA0 irreversible in ~${escape(Math.ceil(countdown / 5) * 5 || 5)}s` : ``}</span></div>
    ${status.block_num ? `<div class="${"svelte-1aa9l9t"}"><span class="${"title svelte-1aa9l9t"}">Block Number</span>
            <span class="${"content svelte-1aa9l9t"}">${escape(bnFormatter.format(Number(status.block_num)))}</span></div>` : ``}
    ${status.block_time ? `<div class="${"svelte-1aa9l9t"}"><span class="${"title svelte-1aa9l9t"}">Block Time</span>
            <span class="${"content svelte-1aa9l9t"}">${escape(dateFormatter.format(status.block_time.toDate()))}</span></div>` : ``}
    ${status.info ? `<div class="${"svelte-1aa9l9t"}"><span class="${"title svelte-1aa9l9t"}">Resource Usage</span>
            <span class="${"content svelte-1aa9l9t"}">CPU ${escape((status.info.receipt.cpu_usage_us / 1e3).toFixed(2))}ms
                
                \xA0 \xA0 NET ${escape(status.info.receipt.net_usage_words * 8)} bytes
            </span></div>` : ``}</section>`;
});
const advanced_svelte_svelte_type_style_lang = "";
const css$T = {
  code: "pre.svelte-1kmhlum{overflow:auto;font-family:monospace;padding:2em}",
  map: null
};
const Advanced = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { status } = $$props;
  if ($$props.status === void 0 && $$bindings.status && status !== void 0)
    $$bindings.status(status);
  $$result.css.add(css$T);
  return `<pre class="${"svelte-1kmhlum"}">
    ${escape(JSON.stringify(status, null, 4))}
</pre>`;
});
const index_svelte_svelte_type_style_lang$4 = "";
const css$S = {
  code: "header.svelte-1q29iek.svelte-1q29iek{text-align:center}header.svelte-1q29iek h1.svelte-1q29iek{font-size:24px;letter-spacing:-0.47px;padding:15px 0 24px}header.svelte-1q29iek .icon{color:var(--main-green)}header.svelte-1q29iek a.svelte-1q29iek{text-decoration:none;text-overflow:ellipsis;overflow:hidden;display:block;color:var(--main-blue)}header.svelte-1q29iek a.svelte-1q29iek:visited{color:var(--main-blue)}header.svelte-1q29iek nav.svelte-1q29iek{margin-top:30px;border-bottom:1px solid var(--divider-grey)}header.svelte-1q29iek nav ul.svelte-1q29iek{display:flex;justify-content:center}header.svelte-1q29iek nav ul a.svelte-1q29iek{display:block;border-bottom:3px solid transparent;padding:10px 9px;text-transform:uppercase;font-size:10px;font-weight:bold;margin:0 21px}header.svelte-1q29iek nav ul a.active.svelte-1q29iek{color:var(--main-black);border-bottom-color:var(--main-blue)}footer.svelte-1q29iek.svelte-1q29iek{margin-top:48px;display:flex}footer.svelte-1q29iek div.svelte-1q29iek{width:100%}footer.svelte-1q29iek div.svelte-1q29iek:first-child{margin-right:10px}@media(max-width: 600px){footer.svelte-1q29iek.svelte-1q29iek{display:block}footer.svelte-1q29iek div.svelte-1q29iek:first-child{margin:0 0 10px}}",
  map: null
};
const Tx_follower$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let status;
  let $status, $$unsubscribe_status = noop, $$subscribe_status = () => ($$unsubscribe_status(), $$unsubscribe_status = subscribe(status, ($$value) => $status = $$value), status);
  let { id } = $$props;
  let { chain } = $$props;
  let { title = "Transaction sent" } = $$props;
  let txId;
  let tabs = [
    {
      id: "summary",
      title: "Summary",
      component: Summary
    },
    {
      id: "advanced",
      title: "Advanced",
      component: Advanced
    }
  ];
  let activeTab = tabs[0];
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.chain === void 0 && $$bindings.chain && chain !== void 0)
    $$bindings.chain(chain);
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  $$result.css.add(css$S);
  {
    {
      try {
        txId = Checksum256.from(id);
      } catch (error) {
        console.warn("Invalid transaction id passed to TxFollower", error);
        txId = Checksum256.from("0000000000000000000000000000000000000000000000000000000000000000");
      }
    }
  }
  $$subscribe_status(status = followTransaction(txId, chain).value);
  $$unsubscribe_status();
  return `${validate_component(Card, "Card").$$render($$result, {}, {}, {
    default: () => {
      return `<header class="${"svelte-1q29iek"}">${validate_component(Icon, "Icon").$$render($$result, { size: "massive", name: "check-circle" }, {}, {})}
        <h1 class="${"svelte-1q29iek"}">${escape(title)}</h1>
        <a target="${"_blank"}"${add_attribute("href", exporerUrl(txId, chain), 0)} class="${"svelte-1q29iek"}">${escape(txId)}</a>
        <nav class="${"svelte-1q29iek"}"><ul class="${"svelte-1q29iek"}">${each(tabs, (tab) => {
        return `<li><a${add_attribute("href", `#tab-${tab.id}`, 0)} class="${["svelte-1q29iek", tab === activeTab ? "active" : ""].join(" ").trim()}">${escape(tab.title)}</a>
                    </li>`;
      })}</ul></nav></header>
    ${$status ? `${validate_component(activeTab.component || missing_component, "svelte:component").$$render($$result, { status: $status }, {}, {})}` : ``}
    <footer class="${"svelte-1q29iek"}"><div class="${"svelte-1q29iek"}">${slots.done ? slots.done({}) : `
                ${validate_component(Button$2, "Button").$$render(
        $$result,
        {
          style: "primary",
          fluid: true,
          size: "large"
        },
        {},
        {
          default: () => {
            return `Done`;
          }
        }
      )}
            `}</div>
        <div class="${"svelte-1q29iek"}">${validate_component(Button$2, "Button").$$render(
        $$result,
        {
          fluid: true,
          size: "large",
          href: exporerUrl(txId, chain),
          target: "_blank"
        },
        {},
        {
          default: () => {
            return `View on block explorer
            `;
          }
        }
      )}</div></footer>`;
    }
  })}`;
});
const transaction_svelte_svelte_type_style_lang = "";
const css$R = {
  code: ".segment .controls.svelte-v7r5qi.svelte-v7r5qi{padding:51px 0 24px;text-align:center}.segment .controls.svelte-v7r5qi .icon{color:var(--main-green)}.segment div.error.svelte-v7r5qi.svelte-v7r5qi{color:var(--main-black);overflow:hidden;text-overflow:ellipsis;text-align:center;padding:24px 0 0}.error.svelte-v7r5qi.svelte-v7r5qi{text-align:center}.error.svelte-v7r5qi .icon{color:var(--error-red);margin-bottom:10px}.error.svelte-v7r5qi h2.svelte-v7r5qi{font-family:Inter;font-style:normal;font-weight:bold;font-size:24px;line-height:29px;text-align:center;letter-spacing:-0.47px}form{margin:0 auto}@keyframes svelte-v7r5qi-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}",
  map: null
};
const Transaction = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $currentAccount, $$unsubscribe_currentAccount;
  let $activeSession, $$unsubscribe_activeSession;
  let $transaction_id, $$unsubscribe_transaction_id;
  let $activeBlockchain, $$unsubscribe_activeBlockchain;
  $$unsubscribe_currentAccount = subscribe(currentAccount, (value) => $currentAccount = value);
  $$unsubscribe_activeSession = subscribe(activeSession, (value) => $activeSession = value);
  $$unsubscribe_activeBlockchain = subscribe(activeBlockchain, (value) => $activeBlockchain = value);
  let { retryCallback = void 0 } = $$props;
  let { resetCallback = void 0 } = $$props;
  let error = false;
  let errorMessage = "";
  let transaction_id = writable(void 0);
  $$unsubscribe_transaction_id = subscribe(transaction_id, (value) => $transaction_id = value);
  let refreshInterval;
  function refreshAccount(account_name) {
    updateAccount(account_name, $activeSession.chainId, true);
  }
  const context = {
    awaitAccountUpdate: (field) => {
      const initialValue = get_store_value(field);
      let currentValue = initialValue;
      refreshInterval = setInterval(
        () => {
          refreshAccount($currentAccount.account_name);
          field.subscribe((v2) => currentValue = v2);
          if (!currentValue.equals(initialValue)) {
            clearInterval(refreshInterval);
          }
        },
        1e3
      );
      setTimeout(
        () => {
          clearInterval(refreshInterval);
        },
        3e4
      );
    },
    clear: () => {
      error = false;
      console.log("clearing");
      transaction_id.set(void 0);
    },
    retryTransaction: () => {
      context.clear();
      if (retryCallback) {
        retryCallback();
      }
    },
    setTransaction: (id) => {
      console.log("setting");
      transaction_id.set(id);
    },
    setTransactionError: (err) => {
      error = true;
      errorMessage = String(err);
    }
  };
  setContext("transaction", context);
  if ($$props.retryCallback === void 0 && $$bindings.retryCallback && retryCallback !== void 0)
    $$bindings.retryCallback(retryCallback);
  if ($$props.resetCallback === void 0 && $$bindings.resetCallback && resetCallback !== void 0)
    $$bindings.resetCallback(resetCallback);
  $$result.css.add(css$R);
  $$unsubscribe_currentAccount();
  $$unsubscribe_activeSession();
  $$unsubscribe_transaction_id();
  $$unsubscribe_activeBlockchain();
  return `${$transaction_id ? `${validate_component(Tx_follower$1, "TxFollower").$$render(
    $$result,
    {
      id: $transaction_id,
      chain: $activeBlockchain
    },
    {},
    {}
  )}` : `${error ? `${validate_component(Segment, "Segment").$$render($$result, { background: "white" }, {}, {
    default: () => {
      return `<div class="${"error svelte-v7r5qi"}">${validate_component(Icon, "Icon").$$render($$result, { name: "alert-circle", size: "massive" }, {}, {})}
            <h2 class="${"svelte-v7r5qi"}">Transaction Failed</h2>
            <p>${escape(errorMessage)}</p></div>
        <div class="${"controls svelte-v7r5qi"}">${retryCallback ? `${validate_component(Button$2, "Button").$$render($$result, { size: "large", style: "primary" }, {}, {
        default: () => {
          return `Try Again`;
        }
      })}` : ``}</div>`;
    }
  })}` : `${validate_component(Form, "Form").$$render($$result, {}, {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`}`}`;
});
const label_svelte_svelte_type_style_lang = "";
const css$Q = {
  code: ".label.svelte-d0tfp9{color:var(--main-black);font-weight:600;font-size:10px;line-height:12px;letter-spacing:0.1px;text-transform:uppercase;margin-bottom:12px}",
  map: null
};
const Label = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$Q);
  return `<div class="${"label svelte-d0tfp9"}">${slots.default ? slots.default({}) : ``}</div>`;
});
const input_svelte_svelte_type_style_lang = "";
const css$P = {
  code: "input.svelte-xvzxgy{background:var(--main-grey);border:1px solid var(--dark-grey);border-radius:12px;color:var(--main-black);font-size:14px;padding:10px 12px}input.svelte-xvzxgy:focus{border:1px solid var(--lapis-lazuli);color:var(--main-black);outline:none}input.fullWidth.svelte-xvzxgy{width:100%}body.darkmode input.svelte-xvzxgy{background-color:#252525;border-color:var(--middle-green-eagle)}",
  map: null
};
const Input = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { disabled = false } = $$props;
  let { focus = false } = $$props;
  let { inputmode = "" } = $$props;
  let { name = "" } = $$props;
  let { placeholder = "" } = $$props;
  let { value = "" } = $$props;
  let { fluid = false } = $$props;
  let ref;
  let { isValid = () => true } = $$props;
  let { assumeValid = false } = $$props;
  const form = getContext("form");
  const setInitialFormValidation = async () => {
    form.setInput(name, isValid ? await isValid(value) : true);
  };
  if (form) {
    setInitialFormValidation();
  }
  createEventDispatcher();
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.focus === void 0 && $$bindings.focus && focus !== void 0)
    $$bindings.focus(focus);
  if ($$props.inputmode === void 0 && $$bindings.inputmode && inputmode !== void 0)
    $$bindings.inputmode(inputmode);
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.placeholder === void 0 && $$bindings.placeholder && placeholder !== void 0)
    $$bindings.placeholder(placeholder);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.fluid === void 0 && $$bindings.fluid && fluid !== void 0)
    $$bindings.fluid(fluid);
  if ($$props.isValid === void 0 && $$bindings.isValid && isValid !== void 0)
    $$bindings.isValid(isValid);
  if ($$props.assumeValid === void 0 && $$bindings.assumeValid && assumeValid !== void 0)
    $$bindings.assumeValid(assumeValid);
  $$result.css.add(css$P);
  return `<input class="${escape(null_to_empty(fluid ? "fullWidth" : "")) + " svelte-xvzxgy"}" type="${"text"}"${add_attribute("name", name, 0)} ${disabled ? "disabled" : ""}${add_attribute("inputmode", inputmode, 0)}${add_attribute("placeholder", placeholder, 0)} autocapitalize="${"none"}" autocorrect="${"off"}" autocomplete="${"off"}"${add_attribute("this", ref, 0)}${add_attribute("value", value, 0)}>`;
});
const errorMessage_svelte_svelte_type_style_lang = "";
const css$O = {
  code: "div.svelte-suoc48.svelte-suoc48{padding:10px 5px}div.svelte-suoc48 h3.svelte-suoc48{color:var(--error-red)}",
  map: null
};
const ErrorMessage = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { errorMessage } = $$props;
  if ($$props.errorMessage === void 0 && $$bindings.errorMessage && errorMessage !== void 0)
    $$bindings.errorMessage(errorMessage);
  $$result.css.add(css$O);
  return `${!!errorMessage ? `<div class="${"svelte-suoc48"}"><h3 class="${"svelte-suoc48"}">${escape(errorMessage)}</h3></div>` : ``}`;
});
const Labelled = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { errorMessage = void 0 } = $$props;
  let { name = "" } = $$props;
  let { fluid = false } = $$props;
  let { focus = false } = $$props;
  let { inputmode = "" } = $$props;
  let { isValid = () => true } = $$props;
  let { placeholder = void 0 } = $$props;
  let { value = "" } = $$props;
  if ($$props.errorMessage === void 0 && $$bindings.errorMessage && errorMessage !== void 0)
    $$bindings.errorMessage(errorMessage);
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.fluid === void 0 && $$bindings.fluid && fluid !== void 0)
    $$bindings.fluid(fluid);
  if ($$props.focus === void 0 && $$bindings.focus && focus !== void 0)
    $$bindings.focus(focus);
  if ($$props.inputmode === void 0 && $$bindings.inputmode && inputmode !== void 0)
    $$bindings.inputmode(inputmode);
  if ($$props.isValid === void 0 && $$bindings.isValid && isValid !== void 0)
    $$bindings.isValid(isValid);
  if ($$props.placeholder === void 0 && $$bindings.placeholder && placeholder !== void 0)
    $$bindings.placeholder(placeholder);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `<div>${validate_component(Input, "Input").$$render(
      $$result,
      {
        name,
        fluid,
        focus,
        inputmode,
        isValid,
        placeholder,
        value
      },
      {
        name: ($$value) => {
          name = $$value;
          $$settled = false;
        },
        fluid: ($$value) => {
          fluid = $$value;
          $$settled = false;
        },
        focus: ($$value) => {
          focus = $$value;
          $$settled = false;
        },
        inputmode: ($$value) => {
          inputmode = $$value;
          $$settled = false;
        },
        isValid: ($$value) => {
          isValid = $$value;
          $$settled = false;
        },
        placeholder: ($$value) => {
          placeholder = $$value;
          $$settled = false;
        },
        value: ($$value) => {
          value = $$value;
          $$settled = false;
        }
      },
      {}
    )}
    ${validate_component(ErrorMessage, "ErrorMessage").$$render($$result, { errorMessage }, {}, {})}</div>`;
  } while (!$$settled);
  return $$rendered;
});
const Lookup = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { name = "" } = $$props;
  let { value = "" } = $$props;
  let { errorMessage = void 0 } = $$props;
  let { activeSession: activeSession2 = void 0 } = $$props;
  let { focus = false } = $$props;
  let { fluid = false } = $$props;
  let { loading = false } = $$props;
  let { placeholder = void 0 } = $$props;
  const isValid = async (value2) => {
    try {
      if (value2) {
        loading = true;
        await validateExistence(value2);
        loading = false;
      } else {
        errorMessage = void 0;
        return false;
      }
    } catch (errorObject) {
      errorMessage = errorObject.message;
      return false;
    }
    errorMessage = void 0;
    return true;
  };
  async function validateExistence(value2) {
    if (!activeSession2) {
      return;
    }
    return activeSession2.client.v1.chain.get_account(value2).catch((error) => {
      const isUnkownAccountError = error.toString().includes("exception: unknown key");
      if (loading) {
        loading = false;
      }
      if (isUnkownAccountError) {
        throw {
          valid: false,
          message: "Account name not found."
        };
      }
    });
  }
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.errorMessage === void 0 && $$bindings.errorMessage && errorMessage !== void 0)
    $$bindings.errorMessage(errorMessage);
  if ($$props.activeSession === void 0 && $$bindings.activeSession && activeSession2 !== void 0)
    $$bindings.activeSession(activeSession2);
  if ($$props.focus === void 0 && $$bindings.focus && focus !== void 0)
    $$bindings.focus(focus);
  if ($$props.fluid === void 0 && $$bindings.fluid && fluid !== void 0)
    $$bindings.fluid(fluid);
  if ($$props.loading === void 0 && $$bindings.loading && loading !== void 0)
    $$bindings.loading(loading);
  if ($$props.placeholder === void 0 && $$bindings.placeholder && placeholder !== void 0)
    $$bindings.placeholder(placeholder);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `${validate_component(Labelled, "InputLabelled").$$render(
      $$result,
      {
        name,
        fluid,
        focus,
        placeholder,
        errorMessage,
        isValid,
        value
      },
      {
        value: ($$value) => {
          value = $$value;
          $$settled = false;
        }
      },
      {}
    )}`;
  } while (!$$settled);
  return $$rendered;
});
function validatePresence(value) {
  if (value.length === 0) {
    throw {
      valid: false,
      message: void 0
    };
  }
}
function validatePublicKey(value) {
  try {
    PublicKey$1.from(value);
  } catch (error) {
    throw {
      valid: false,
      message: "Invalid public key."
    };
  }
}
const PublicKey = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { name = "" } = $$props;
  let { value = "" } = $$props;
  let { errorMessage = void 0 } = $$props;
  let { valid = false } = $$props;
  let { focus = false } = $$props;
  let { fluid = false } = $$props;
  let { placeholder = void 0 } = $$props;
  const validate = async (value2) => {
    try {
      validatePresence(value2);
      validatePublicKey(value2);
    } catch (errorObject) {
      errorMessage = errorObject.message;
      valid = false;
      return false;
    }
    errorMessage = void 0;
    valid = true;
    return true;
  };
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.errorMessage === void 0 && $$bindings.errorMessage && errorMessage !== void 0)
    $$bindings.errorMessage(errorMessage);
  if ($$props.valid === void 0 && $$bindings.valid && valid !== void 0)
    $$bindings.valid(valid);
  if ($$props.focus === void 0 && $$bindings.focus && focus !== void 0)
    $$bindings.focus(focus);
  if ($$props.fluid === void 0 && $$bindings.fluid && fluid !== void 0)
    $$bindings.fluid(fluid);
  if ($$props.placeholder === void 0 && $$bindings.placeholder && placeholder !== void 0)
    $$bindings.placeholder(placeholder);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `${validate_component(Labelled, "InputLabelled").$$render(
      $$result,
      {
        name,
        fluid,
        focus,
        placeholder,
        isValid: validate,
        value
      },
      {
        value: ($$value) => {
          value = $$value;
          $$settled = false;
        }
      },
      {}
    )}`;
  } while (!$$settled);
  return $$rendered;
});
const Recipient = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $transferData, $$unsubscribe_transferData;
  let $activeBlockchain, $$unsubscribe_activeBlockchain;
  let $activeSession, $$unsubscribe_activeSession;
  $$unsubscribe_transferData = subscribe(transferData, (value) => $transferData = value);
  $$unsubscribe_activeBlockchain = subscribe(activeBlockchain, (value) => $activeBlockchain = value);
  $$unsubscribe_activeSession = subscribe(activeSession, (value) => $activeSession = value);
  let { balance } = $$props;
  let { token } = $$props;
  let loading = false;
  let toAddress = String($transferData.toAddress || "");
  let toAccount = String($transferData.toAccount || "");
  if ($$props.balance === void 0 && $$bindings.balance && balance !== void 0)
    $$bindings.balance(balance);
  if ($$props.token === void 0 && $$bindings.token && token !== void 0)
    $$bindings.token(token);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `<div class="${"container"}">${balance && token ? `${validate_component(Form, "Form").$$render($$result, {}, {}, {
      default: () => {
        return `${validate_component(Label, "InputLabel").$$render($$result, {}, {}, {
          default: () => {
            return `To`;
          }
        })}
            ${$activeBlockchain && $activeBlockchain.id === "fio" ? `${validate_component(PublicKey, "InputPublicKey").$$render(
          $$result,
          {
            focus: true,
            fluid: true,
            name: "to",
            placeholder: "Enter public key",
            value: toAddress
          },
          {
            value: ($$value) => {
              toAddress = $$value;
              $$settled = false;
            }
          },
          {}
        )}` : `${validate_component(Lookup, "InputAccountLookup").$$render(
          $$result,
          {
            focus: true,
            fluid: true,
            name: "to",
            placeholder: "Enter account name",
            activeSession: $activeSession,
            loading,
            value: toAccount
          },
          {
            loading: ($$value) => {
              loading = $$value;
              $$settled = false;
            },
            value: ($$value) => {
              toAccount = $$value;
              $$settled = false;
            }
          },
          {}
        )}`}
            ${validate_component(Button$2, "Button").$$render(
          $$result,
          {
            style: "primary",
            disabled: loading,
            size: "large",
            fluid: true,
            formValidation: true
          },
          {},
          {
            default: () => {
              return `${loading ? `${validate_component(Icon, "Icon").$$render($$result, { spin: true, name: "life-buoy" }, {}, {})}` : ``}
                ${$transferData.backStep ? `${validate_component(Text, "Text").$$render($$result, {}, {}, {
                default: () => {
                  return `Done`;
                }
              })}` : `${validate_component(Text, "Text").$$render($$result, {}, {}, {
                default: () => {
                  return `Next`;
                }
              })}`}`;
            }
          }
        )}`;
      }
    })}` : `No balance for this token to send!`}</div>`;
  } while (!$$settled);
  $$unsubscribe_transferData();
  $$unsubscribe_activeBlockchain();
  $$unsubscribe_activeSession();
  return $$rendered;
});
function validateBalance(value, balance) {
  const { units } = Asset$2.from(Number(value), balance.symbol);
  if (Number(units) > Number(balance.units)) {
    throw {
      valid: false,
      message: "Insufficient funds available."
    };
  }
}
function validateIsNumber(value, symbol) {
  const { units } = Asset$2.from(Number(value), symbol);
  const unitsAreNotNumber = isNaN(Number(units));
  if (unitsAreNotNumber) {
    throw {
      valid: false,
      message: "Should be a number."
    };
  }
}
function validateNonZero(value, symbol) {
  const asset = Asset$2.from(Number(value), symbol);
  const isLessThanZero = asset.value <= 0;
  if (isLessThanZero) {
    throw {
      valid: false,
      message: "Should be greater than zero."
    };
  }
}
const Asset = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $activeBlockchain, $$unsubscribe_activeBlockchain;
  $$unsubscribe_activeBlockchain = subscribe(activeBlockchain, (value2) => $activeBlockchain = value2);
  let { symbol = $activeBlockchain.coreTokenSymbol } = $$props;
  let { name = "" } = $$props;
  let { value = "" } = $$props;
  let { allowZero = false } = $$props;
  let { balance = void 0 } = $$props;
  let { valid = false } = $$props;
  let { focus = false } = $$props;
  let { fluid = false } = $$props;
  let { placeholder = void 0 } = $$props;
  let errorMessage;
  const isValid = (value2) => {
    try {
      validatePresence(value2);
      validateIsNumber(value2, symbol);
      if (!allowZero) {
        validateNonZero(value2, symbol);
      }
      if (balance) {
        validateBalance(value2, balance);
      }
    } catch (errorObject) {
      errorMessage = errorObject.message;
      valid = false;
      return false;
    }
    errorMessage = void 0;
    valid = true;
    return true;
  };
  if ($$props.symbol === void 0 && $$bindings.symbol && symbol !== void 0)
    $$bindings.symbol(symbol);
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.allowZero === void 0 && $$bindings.allowZero && allowZero !== void 0)
    $$bindings.allowZero(allowZero);
  if ($$props.balance === void 0 && $$bindings.balance && balance !== void 0)
    $$bindings.balance(balance);
  if ($$props.valid === void 0 && $$bindings.valid && valid !== void 0)
    $$bindings.valid(valid);
  if ($$props.focus === void 0 && $$bindings.focus && focus !== void 0)
    $$bindings.focus(focus);
  if ($$props.fluid === void 0 && $$bindings.fluid && fluid !== void 0)
    $$bindings.fluid(fluid);
  if ($$props.placeholder === void 0 && $$bindings.placeholder && placeholder !== void 0)
    $$bindings.placeholder(placeholder);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    {
      {
        if (value) {
          errorMessage = void 0;
        }
      }
    }
    $$rendered = `${validate_component(Labelled, "InputLabelled").$$render(
      $$result,
      {
        errorMessage,
        fluid,
        focus,
        name,
        placeholder,
        isValid,
        inputmode: "decimal",
        value
      },
      {
        value: ($$value) => {
          value = $$value;
          $$settled = false;
        }
      },
      {}
    )}`;
  } while (!$$settled);
  $$unsubscribe_activeBlockchain();
  return $$rendered;
});
const modal_svelte_svelte_type_style_lang = "";
const css$N = {
  code: ".dimmer.svelte-znmkpu.svelte-znmkpu{position:fixed;left:0;top:0;width:100%;height:100%;overflow:auto;background-color:rgba(0, 0, 0, 0.4);z-index:1001}.modal.svelte-znmkpu.svelte-znmkpu{font-family:Inter;font-style:normal;font-weight:500;font-size:16px;line-height:19px;letter-spacing:-0.26px;color:var(--main-black);background-color:var(--main-white);position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);box-shadow:0px 24px 32px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 0px 1px rgba(0, 0, 0, 0.04);border-radius:20px;width:80%;max-width:300px;z-index:2000}.modal.large.svelte-znmkpu.svelte-znmkpu{max-width:500px}.modal.svelte-znmkpu .modal-header.svelte-znmkpu{color:var(--light-grey);font-weight:bold;font-size:18px;line-height:22px;letter-spacing:-0.26px;padding:21px}.modal.svelte-znmkpu .modal-content.svelte-znmkpu{padding:20px}.modal.svelte-znmkpu .button-container.svelte-znmkpu{display:flex;flex-direction:column;padding:17px}",
  map: null
};
const Modal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $display, $$unsubscribe_display;
  let { display = writable(false) } = $$props;
  $$unsubscribe_display = subscribe(display, (value) => $display = value);
  let { header = null } = $$props;
  let { size = "small" } = $$props;
  let { hideCloseButton = false } = $$props;
  let { disableDimmerClose = false } = $$props;
  let { close = () => set_store_value(display, $display = false, $display) } = $$props;
  if ($$props.display === void 0 && $$bindings.display && display !== void 0)
    $$bindings.display(display);
  if ($$props.header === void 0 && $$bindings.header && header !== void 0)
    $$bindings.header(header);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.hideCloseButton === void 0 && $$bindings.hideCloseButton && hideCloseButton !== void 0)
    $$bindings.hideCloseButton(hideCloseButton);
  if ($$props.disableDimmerClose === void 0 && $$bindings.disableDimmerClose && disableDimmerClose !== void 0)
    $$bindings.disableDimmerClose(disableDimmerClose);
  if ($$props.close === void 0 && $$bindings.close && close !== void 0)
    $$bindings.close(close);
  $$result.css.add(css$N);
  $$unsubscribe_display();
  return `${$display ? `<div class="${"dimmer svelte-znmkpu"}"></div>
    <div class="${escape(null_to_empty(`modal ${size}`)) + " svelte-znmkpu"}">${header ? `<div class="${"modal-header svelte-znmkpu"}"><h1>${escape(header)}</h1></div>` : ``}
        <div class="${"modal-content svelte-znmkpu"}">${slots.default ? slots.default({}) : ``}</div>
        ${!hideCloseButton ? `<div class="${"button-container svelte-znmkpu"}">${validate_component(Button$2, "Button").$$render($$result, { size: "large" }, {}, {
    default: () => {
      return `Close`;
    }
  })}</div>` : ``}</div>` : ``}`;
});
const row_svelte_svelte_type_style_lang = "";
const css$M = {
  code: ".row.svelte-mhd4sq.svelte-mhd4sq{padding:10px 12px;border-radius:12px;max-width:400px;border:1px solid var(--divider-grey);display:flex;align-items:center;cursor:pointer}.row.svelte-mhd4sq.svelte-mhd4sq:hover{background-color:var(--main-grey)}.row.table.svelte-mhd4sq.svelte-mhd4sq{border:none}.row.svelte-mhd4sq .logo-container.svelte-mhd4sq{display:flex;margin-right:15px}.row.svelte-mhd4sq .name-text.svelte-mhd4sq{flex:1;font-family:Inter;font-style:normal;font-weight:500;font-size:14px;letter-spacing:-0.04px;color:var(--main-black);display:inline;text-align:left}.row.svelte-mhd4sq .name-text.blueText.svelte-mhd4sq{color:var(--lapis-lazuli)}.darkmode .row.svelte-mhd4sq .name-text.blueText.svelte-mhd4sq{color:var(--middle-green-eagle)}.row.svelte-mhd4sq .balance-container.svelte-mhd4sq{padding:5px;width:70px;font-family:Inter;font-style:normal;font-weight:500;font-size:12px}.row.svelte-mhd4sq .balance-container.svelte-mhd4sq:not(.table){margin-right:10px;text-align:right;width:120px}.row.svelte-mhd4sq .balance-container.table.svelte-mhd4sq{padding:2px}.row.svelte-mhd4sq .arrow-container.svelte-mhd4sq{display:flex;width:20px}",
  map: null
};
function formatBalanceString(balanceString) {
  if (balanceString.length < 9) {
    return balanceString;
  }
  const balanceInIntegers = balanceString.split(".")[0];
  if (balanceInIntegers.length < 8) {
    return balanceInIntegers;
  }
  return `${Number(balanceInIntegers) / 1e6} M`;
}
const Row = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $balances, $$unsubscribe_balances;
  $$unsubscribe_balances = subscribe(balances, (value) => $balances = value);
  let { token } = $$props;
  let { onClick } = $$props;
  let { isTableRow = void 0 } = $$props;
  let formattedTokenBalance = void 0;
  let balance;
  if ($$props.token === void 0 && $$bindings.token && token !== void 0)
    $$bindings.token(token);
  if ($$props.onClick === void 0 && $$bindings.onClick && onClick !== void 0)
    $$bindings.onClick(onClick);
  if ($$props.isTableRow === void 0 && $$bindings.isTableRow && isTableRow !== void 0)
    $$bindings.isTableRow(isTableRow);
  $$result.css.add(css$M);
  {
    {
      balance = $balances && $balances.find((balance2) => balance2.tokenKey === token.key);
      if (balance) {
        const tokenPrecision = balance.quantity.symbol.precision;
        const unitValue = balance.quantity.units.value;
        const fullTokenBalanceString = (Number(unitValue) / Math.pow(10, tokenPrecision)).toFixed(tokenPrecision);
        if (isTableRow) {
          formattedTokenBalance = formatBalanceString(fullTokenBalanceString);
        } else {
          formattedTokenBalance = fullTokenBalanceString;
        }
      }
    }
  }
  $$unsubscribe_balances();
  return `<div class="${"row " + escape(isTableRow ? "table" : "") + " svelte-mhd4sq"}"><span class="${"logo-container svelte-mhd4sq"}">${validate_component(Token, "TokenImage").$$render(
    $$result,
    {
      width: "18",
      height: "18",
      tokenKey: token.key
    },
    {},
    {}
  )}</span>
    <h2 class="${"name-text " + escape(isTableRow ? "blueText" : "") + " svelte-mhd4sq"}">${escape(token.name)}</h2>
    <span class="${"balance-container " + escape(isTableRow ? "table" : "") + " svelte-mhd4sq"}">${escape(formattedTokenBalance || "N/A")}</span>
    <div class="${"arrow-container svelte-mhd4sq"}">${validate_component(Icon, "Icon").$$render($$result, { name: "chevron-right", size: "large" }, {}, {})}</div></div>`;
});
const selector_svelte_svelte_type_style_lang = "";
const css$L = {
  code: ".close-button.svelte-3jopx.svelte-3jopx{color:var(--lapis-lazuli);cursor:pointer;padding:32px 22px;position:absolute;right:0;top:0}.darkmode .close-button.svelte-3jopx.svelte-3jopx{color:var(--middle-green-eagle)}h2.svelte-3jopx.svelte-3jopx{text-align:left;margin:10px 3px}.table-container.svelte-3jopx.svelte-3jopx{max-height:60vh;overflow-y:scroll;margin-top:20px}.table-container.svelte-3jopx table.svelte-3jopx{table-layout:fixed;width:100%;white-space:nowrap}.table-container.svelte-3jopx table th.svelte-3jopx{text-align:left;color:var(--dark-grey);font-family:Inter;font-style:normal;font-weight:600;font-size:10px;line-height:12px;letter-spacing:0.1px;text-transform:uppercase;padding:5px}.table-container.svelte-3jopx table th h3.svelte-3jopx{margin:20px;font-size:12px;text-align:center}.table-container.svelte-3jopx table td.svelte-3jopx{padding:3px}",
  map: null
};
const Selector = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $activeBlockchain, $$unsubscribe_activeBlockchain;
  let $tokens, $$unsubscribe_tokens;
  let $displayModal, $$unsubscribe_displayModal;
  $$unsubscribe_activeBlockchain = subscribe(activeBlockchain, (value) => $activeBlockchain = value);
  $$unsubscribe_tokens = subscribe(tokens, (value) => $tokens = value);
  let { defaultToken } = $$props;
  let { onTokenSelect } = $$props;
  let selectedToken = defaultToken;
  let displayModal = writable(false);
  $$unsubscribe_displayModal = subscribe(displayModal, (value) => $displayModal = value);
  let query = "";
  function changeToken(token) {
    selectedToken = token;
    onTokenSelect(token);
    set_store_value(displayModal, $displayModal = false, $displayModal);
  }
  let filteredTokens = [];
  if ($$props.defaultToken === void 0 && $$bindings.defaultToken && defaultToken !== void 0)
    $$bindings.defaultToken(defaultToken);
  if ($$props.onTokenSelect === void 0 && $$bindings.onTokenSelect && onTokenSelect !== void 0)
    $$bindings.onTokenSelect(onTokenSelect);
  $$result.css.add(css$L);
  {
    {
      filteredTokens = $tokens && $tokens.filter((token) => {
        const blockchainMatches = token.chainId.equals($activeBlockchain.chainId);
        const queryExists = query.length === 0;
        const queryMatches = String(token.name).toLowerCase().includes(query.toLowerCase());
        return blockchainMatches && (queryExists || queryMatches);
      }) || [];
    }
  }
  $$unsubscribe_activeBlockchain();
  $$unsubscribe_tokens();
  $$unsubscribe_displayModal();
  return `${validate_component(Modal, "Modal").$$render(
    $$result,
    {
      display: displayModal,
      hideCloseButton: true
    },
    {},
    {
      default: () => {
        return `<div class="${"close-button svelte-3jopx"}">${validate_component(Icon, "Icon").$$render($$result, { name: "x" }, {}, {})}</div>
    <h2 class="${"svelte-3jopx"}">Select Token</h2>
    ${validate_component(Form, "Form").$$render($$result, {}, {}, {
          default: () => {
            return `${validate_component(Input, "Input").$$render(
              $$result,
              {
                value: query,
                name: "query",
                focus: true,
                fluid: true,
                placeholder: "Search tokens..."
              },
              {},
              {}
            )}`;
          }
        })}
    <div class="${"table-container svelte-3jopx"}"><table class="${"svelte-3jopx"}"><tr><th colspan="${"2"}" class="${"svelte-3jopx"}">Token </th>
                <th class="${"svelte-3jopx"}">Balance </th></tr>

            ${filteredTokens.length > 0 ? `${each(filteredTokens, (token) => {
          return `<tr><td colspan="${"3"}" class="${"svelte-3jopx"}">${validate_component(Row, "TokenSelectorRow").$$render(
            $$result,
            {
              onClick: () => changeToken(token),
              token,
              isTableRow: true
            },
            {},
            {}
          )}</td>
                    </tr>`;
        })}` : `<tr><th colspan="${"3"}" class="${"svelte-3jopx"}"><h3 class="${"svelte-3jopx"}">No tokens found...</h3></th></tr>`}</table></div>`;
      }
    }
  )}

${validate_component(Row, "TokenSelectorRow").$$render(
    $$result,
    {
      onClick: () => $displayModal = true,
      token: selectedToken
    },
    {},
    {}
  )}`;
});
const amount_svelte_svelte_type_style_lang = "";
const css$K = {
  code: ".token-selector.svelte-7yh0tb.svelte-7yh0tb{margin-bottom:32px}.controls.svelte-7yh0tb.svelte-7yh0tb{display:flex;padding:1em}.controls.svelte-7yh0tb .actions.svelte-7yh0tb{cursor:pointer;margin-left:auto;font-family:Inter;font-style:normal;font-weight:bold;font-size:10px;line-height:12px;display:flex;align-items:center;text-align:center;letter-spacing:0.1px;text-transform:uppercase;color:var(--main-blue);user-select:none;-webkit-user-select:none}.controls.svelte-7yh0tb .value.svelte-7yh0tb{font-family:Inter;font-style:normal;font-weight:550;font-size:10px;line-height:12px;display:flex;align-items:center;letter-spacing:0.1px;text-transform:uppercase;color:var(--light-grey)}",
  map: null
};
const Amount = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $balance, $$unsubscribe_balance;
  let $transferData, $$unsubscribe_transferData;
  $$unsubscribe_transferData = subscribe(transferData, (value) => $transferData = value);
  let { balance } = $$props;
  $$unsubscribe_balance = subscribe(balance, (value) => $balance = value);
  let { token } = $$props;
  let amount = String($transferData.quantity && $transferData.quantity.value || "");
  let amountValid = false;
  function changeToken(token2) {
    transferData.update((data) => ({
      ...data,
      quantity: void 0,
      tokenKey: token2.key
    }));
    amount = "";
    amountValid = false;
  }
  if ($$props.balance === void 0 && $$bindings.balance && balance !== void 0)
    $$bindings.balance(balance);
  if ($$props.token === void 0 && $$bindings.token && token !== void 0)
    $$bindings.token(token);
  $$result.css.add(css$K);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `<div class="${"container"}">${$balance ? `${validate_component(Form, "Form").$$render($$result, {}, {}, {
      default: () => {
        return `${validate_component(Label, "InputLabel").$$render($$result, {}, {}, {
          default: () => {
            return `Token`;
          }
        })}
            <div class="${"token-selector svelte-7yh0tb"}">${validate_component(Selector, "TokenSelector").$$render(
          $$result,
          {
            defaultToken: token,
            onTokenSelect: changeToken
          },
          {},
          {}
        )}</div>
            ${validate_component(Label, "InputLabel").$$render($$result, {}, {}, {
          default: () => {
            return `Amount`;
          }
        })}
            ${validate_component(Asset, "InputAsset").$$render(
          $$result,
          {
            focus: true,
            fluid: true,
            name: "amount",
            placeholder: `Enter amount of tokens`,
            balance: $balance.quantity,
            valid: amountValid,
            value: amount
          },
          {
            valid: ($$value) => {
              amountValid = $$value;
              $$settled = false;
            },
            value: ($$value) => {
              amount = $$value;
              $$settled = false;
            }
          },
          {}
        )}
            <div class="${"controls svelte-7yh0tb"}">${token && token.price ? `<div class="${"value svelte-7yh0tb"}">\u2248 $ ${escape((Number(amount) * token.price).toFixed(2))} USD</div>` : ``}
                <div class="${"actions svelte-7yh0tb"}"><span>Entire Balance</span></div></div>`;
      }
    })}` : ``}
    ${validate_component(Button$2, "Button").$$render(
      $$result,
      {
        fluid: true,
        style: "primary",
        size: "large",
        disabled: !amountValid,
        formValidation: true
      },
      {},
      {
        default: () => {
          return `${$transferData.backStep ? `Done` : `Continue`}`;
        }
      }
    )}</div>`;
  } while (!$$settled);
  $$unsubscribe_balance();
  $$unsubscribe_transferData();
  return $$rendered;
});
const container_svelte_svelte_type_style_lang = "";
const css$J = {
  code: ".container.svelte-12jd4yx{display:flex;min-height:60px;border-bottom:1px solid var(--divider-grey);align-items:center}",
  map: null
};
const Container = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$J);
  return `<div class="${"container svelte-12jd4yx"}">${slots.default ? slots.default({}) : ``}</div>`;
});
const change_svelte_svelte_type_style_lang = "";
const css$I = {
  code: "div.svelte-1hxaivj{color:var(--main-blue);cursor:pointer;display:flex;flex-direction:column;justify-content:center;padding:16px 0 16px 16px}",
  map: null
};
const Change = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { changeStep } = $$props;
  if ($$props.changeStep === void 0 && $$bindings.changeStep && changeStep !== void 0)
    $$bindings.changeStep(changeStep);
  $$result.css.add(css$I);
  return `<div class="${"svelte-1hxaivj"}">${validate_component(Icon, "Icon").$$render($$result, { size: "large", name: "edit-2" }, {}, {})}</div>`;
});
const completed_svelte_svelte_type_style_lang = "";
const css$H = {
  code: ".label.svelte-bjufte h3.svelte-bjufte{display:block;font-weight:bold}.value.svelte-bjufte.svelte-bjufte{flex:1;text-align:right}",
  map: null
};
const Completed = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { header } = $$props;
  let { subheader = void 0 } = $$props;
  let { changeStep = void 0 } = $$props;
  if ($$props.header === void 0 && $$bindings.header && header !== void 0)
    $$bindings.header(header);
  if ($$props.subheader === void 0 && $$bindings.subheader && subheader !== void 0)
    $$bindings.subheader(subheader);
  if ($$props.changeStep === void 0 && $$bindings.changeStep && changeStep !== void 0)
    $$bindings.changeStep(changeStep);
  $$result.css.add(css$H);
  return `${validate_component(Container, "Container").$$render($$result, {}, {}, {
    default: () => {
      return `<div class="${"label svelte-bjufte"}"><h3 class="${"svelte-bjufte"}">${escape(header)}</h3>
        ${subheader ? `<p>${escape(subheader)}</p>` : ``}</div>

    <div class="${"value svelte-bjufte"}">${slots.default ? slots.default({}) : ``}</div>
    ${changeStep ? `${validate_component(Change, "StatusChange").$$render($$result, { changeStep }, {}, {})}` : ``}`;
    }
  })}`;
});
const address_svelte_svelte_type_style_lang = "";
const css$G = {
  code: "span.svelte-cwr761{line-height:32px}",
  map: null
};
const Address = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $activeBlockchain, $$unsubscribe_activeBlockchain;
  $$unsubscribe_activeBlockchain = subscribe(activeBlockchain, (value) => $activeBlockchain = value);
  let { toAddress } = $$props;
  let { editable = false } = $$props;
  function changeRecipient() {
    transferData.update((data) => ({
      ...data,
      step: Step.Recipient,
      backStep: data.step
    }));
  }
  const changeStep = editable ? changeRecipient : void 0;
  if ($$props.toAddress === void 0 && $$bindings.toAddress && toAddress !== void 0)
    $$bindings.toAddress(toAddress);
  if ($$props.editable === void 0 && $$bindings.editable && editable !== void 0)
    $$bindings.editable(editable);
  $$result.css.add(css$G);
  $$unsubscribe_activeBlockchain();
  return `${validate_component(Completed, "Completed").$$render($$result, { header: "Receiving Address", changeStep }, {}, {
    default: () => {
      return `<span class="${"svelte-cwr761"}">${escape(toAddress.toLegacyString($activeBlockchain == null ? void 0 : $activeBlockchain.coreTokenSymbol.name))}</span>`;
    }
  })}`;
});
const Account$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { toAccount } = $$props;
  let { editable = false } = $$props;
  function changeRecipient() {
    transferData.update((data) => ({
      ...data,
      step: Step.Recipient,
      backStep: data.step
    }));
  }
  const changeStep = editable ? changeRecipient : void 0;
  if ($$props.toAccount === void 0 && $$bindings.toAccount && toAccount !== void 0)
    $$bindings.toAccount(toAccount);
  if ($$props.editable === void 0 && $$bindings.editable && editable !== void 0)
    $$bindings.editable(editable);
  return `${validate_component(Completed, "Completed").$$render($$result, { header: "To", changeStep }, {}, {
    default: () => {
      return `<span>${escape(toAccount)}</span>`;
    }
  })}`;
});
const quantity_svelte_svelte_type_style_lang = "";
const css$F = {
  code: ".quantity.svelte-qz5gmu{display:flex;justify-content:flex-end;align-items:center}.logo-container.svelte-qz5gmu{display:flex;margin-right:10px}.value.svelte-qz5gmu{padding-top:8px;font-weight:550;font-size:10px;line-height:12px;letter-spacing:0.1px;text-transform:uppercase;color:var(--light-grey)}",
  map: null
};
const Quantity = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { quantity } = $$props;
  let { editable = false } = $$props;
  let { token } = $$props;
  let usd = token.price ? (Number(quantity.value) * token.price).toFixed(2) : null;
  function changeAmount() {
    transferData.update((data) => ({
      ...data,
      step: Step.Amount,
      backStep: data.step
    }));
  }
  const changeStep = editable ? changeAmount : void 0;
  if ($$props.quantity === void 0 && $$bindings.quantity && quantity !== void 0)
    $$bindings.quantity(quantity);
  if ($$props.editable === void 0 && $$bindings.editable && editable !== void 0)
    $$bindings.editable(editable);
  if ($$props.token === void 0 && $$bindings.token && token !== void 0)
    $$bindings.token(token);
  $$result.css.add(css$F);
  return `${validate_component(Completed, "Completed").$$render($$result, { header: "Token Quantity", changeStep }, {}, {
    default: () => {
      return `<div class="${"quantity svelte-qz5gmu"}"><span class="${"logo-container svelte-qz5gmu"}">${validate_component(Token, "TokenImage").$$render(
        $$result,
        {
          width: "18",
          height: "18",
          tokenKey: token.key
        },
        {},
        {}
      )}</span>
        <span>${escape(quantity)}</span></div>
    ${usd ? `<div class="${"value svelte-qz5gmu"}">\u2248 $ ${escape(usd)} USD</div>` : ``}`;
    }
  })}`;
});
const fee_svelte_svelte_type_style_lang = "";
const css$E = {
  code: "span.svelte-8vi9al{line-height:32px;vertical-align:middle}",
  map: null
};
const Fee = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $activeBlockchain, $$unsubscribe_activeBlockchain;
  $$unsubscribe_activeBlockchain = subscribe(activeBlockchain, (value) => $activeBlockchain = value);
  let { txFee: txFee2 = void 0 } = $$props;
  let { quantity = void 0 } = $$props;
  let total = void 0;
  if ($$props.txFee === void 0 && $$bindings.txFee && txFee2 !== void 0)
    $$bindings.txFee(txFee2);
  if ($$props.quantity === void 0 && $$bindings.quantity && quantity !== void 0)
    $$bindings.quantity(quantity);
  $$result.css.add(css$E);
  {
    {
      total = quantity && txFee2 && Asset$1.fromUnits(quantity.units.toNumber() + txFee2.units.toNumber(), $activeBlockchain.coreTokenSymbol);
    }
  }
  $$unsubscribe_activeBlockchain();
  return `${validate_component(Completed, "Completed").$$render($$result, { header: "Network Fee" }, {}, {
    default: () => {
      return `<span class="${"svelte-8vi9al"}">${escape(txFee2)}</span>`;
    }
  })}

${validate_component(Completed, "Completed").$$render($$result, { header: "Total" }, {}, {
    default: () => {
      return `<span class="${"svelte-8vi9al"}">${escape(total)}</span>`;
    }
  })}`;
});
const confirm_svelte_svelte_type_style_lang = "";
const css$D = {
  code: ".memo-container.svelte-644k9z.svelte-644k9z{padding:20px 0 0 0}.memo-container.svelte-644k9z span.svelte-644k9z{font-weight:bold}",
  map: null
};
const Confirm = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $transferData, $$unsubscribe_transferData;
  let $txFee, $$unsubscribe_txFee;
  let $activeBlockchain, $$unsubscribe_activeBlockchain;
  $$unsubscribe_transferData = subscribe(transferData, (value) => $transferData = value);
  $$unsubscribe_txFee = subscribe(txFee, (value) => $txFee = value);
  $$unsubscribe_activeBlockchain = subscribe(activeBlockchain, (value) => $activeBlockchain = value);
  let { handleTransfer } = $$props;
  let { token } = $$props;
  let memo = "";
  if ($$props.handleTransfer === void 0 && $$bindings.handleTransfer && handleTransfer !== void 0)
    $$bindings.handleTransfer(handleTransfer);
  if ($$props.token === void 0 && $$bindings.token && token !== void 0)
    $$bindings.token(token);
  $$result.css.add(css$D);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `
${$transferData.toAddress ? `${validate_component(Address, "StatusAddress").$$render(
      $$result,
      {
        editable: true,
        toAddress: $transferData.toAddress
      },
      {},
      {}
    )}` : ``}
${$transferData.toAccount ? `${validate_component(Account$1, "StatusAccount").$$render(
      $$result,
      {
        editable: true,
        toAccount: $transferData.toAccount
      },
      {},
      {}
    )}` : ``}
${$transferData.quantity ? `${validate_component(Quantity, "StatusQuantity").$$render(
      $$result,
      {
        editable: true,
        quantity: $transferData.quantity,
        token
      },
      {},
      {}
    )}` : ``}
${$transferData.quantity && $txFee ? `${validate_component(Fee, "StatusFee").$$render(
      $$result,
      {
        txFee: $txFee,
        quantity: $transferData.quantity
      },
      {},
      {}
    )}` : ``}
${$activeBlockchain && $activeBlockchain.id !== "fio" ? `<div class="${"memo-container svelte-644k9z"}"><span class="${"svelte-644k9z"}">Memo (Optional)</span>
        <br>
        <br>
        ${validate_component(Input, "Input").$$render(
      $$result,
      {
        name: "memo",
        assumeValid: true,
        fluid: true,
        placeholder: "Memo",
        value: memo
      },
      {
        value: ($$value) => {
          memo = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div>` : ``}
${validate_component(Button$2, "Button").$$render(
      $$result,
      {
        fluid: true,
        style: "primary",
        size: "large",
        formValidation: true
      },
      {},
      {
        default: () => {
          return `${validate_component(Text, "Text").$$render($$result, {}, {}, {
            default: () => {
              return `Sign Transaction`;
            }
          })}`;
        }
      }
    )}`;
  } while (!$$settled);
  $$unsubscribe_transferData();
  $$unsubscribe_txFee();
  $$unsubscribe_activeBlockchain();
  return $$rendered;
});
const clipboard_svelte_svelte_type_style_lang = "";
const css$C = {
  code: "textarea.svelte-13u8gy9{left:0;bottom:0;margin:0;padding:0;opacity:0;width:1px;height:1px;border:none;display:block;position:absolute}",
  map: null
};
const Clipboard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const dispatch = createEventDispatcher();
  let { text } = $$props;
  let textarea;
  async function copy() {
    textarea.select();
    document.execCommand("Copy");
    await tick();
    textarea.blur();
    dispatch("copy");
  }
  if ($$props.text === void 0 && $$bindings.text && text !== void 0)
    $$bindings.text(text);
  $$result.css.add(css$C);
  return `${slots.default ? slots.default({ copy }) : ``}
<textarea class="${"svelte-13u8gy9"}"${add_attribute("this", textarea, 0)}>${escape(text)}</textarea>`;
});
const receive_svelte_svelte_type_style_lang = "";
const css$B = {
  code: ".container.svelte-1yhwhzf{text-align:center}h2.svelte-1yhwhzf,p.svelte-1yhwhzf{line-height:2em}h2.svelte-1yhwhzf{color:var(--black);font-size:2em;margin:0.5em 0}p.svelte-1yhwhzf{color:var(--dark-grey);margin-top:1em}",
  map: null
};
const Receive = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $currentAccount, $$unsubscribe_currentAccount;
  let $activeBlockchain, $$unsubscribe_activeBlockchain;
  $$unsubscribe_currentAccount = subscribe(currentAccount, (value) => $currentAccount = value);
  $$unsubscribe_activeBlockchain = subscribe(activeBlockchain, (value) => $activeBlockchain = value);
  $$result.css.add(css$B);
  $$unsubscribe_currentAccount();
  $$unsubscribe_activeBlockchain();
  return `${$currentAccount ? `<div class="${"container svelte-1yhwhzf"}"><h2 class="${"svelte-1yhwhzf"}">${escape($currentAccount.account_name)}</h2>
        ${validate_component(Clipboard, "Clipboard").$$render($$result, { text: $currentAccount.account_name }, {}, {
    default: ({ copy }) => {
      return `${validate_component(Button$2, "Button").$$render($$result, { style: "primary" }, {}, {
        default: () => {
          return `${validate_component(Icon, "Icon").$$render($$result, { name: "clipboard" }, {}, {})}
                ${validate_component(Text, "Text").$$render($$result, {}, {}, {
            default: () => {
              return `Copy to clipboard`;
            }
          })}`;
        }
      })}`;
    }
  })}
        <p class="${"svelte-1yhwhzf"}">To receive tokens on ${escape($activeBlockchain.name)}, send them directly to your account name
            as shown above.
        </p></div>` : ``}`;
});
const memo_svelte_svelte_type_style_lang = "";
const css$A = {
  code: "span.svelte-cwr761{line-height:32px}",
  map: null
};
const Memo = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { memo } = $$props;
  let { editable = false } = $$props;
  function changeMemo() {
    transferData.update((data) => ({
      ...data,
      step: Step.Memo,
      backStep: data.step
    }));
  }
  const changeStep = editable ? changeMemo : void 0;
  if ($$props.memo === void 0 && $$bindings.memo && memo !== void 0)
    $$bindings.memo(memo);
  if ($$props.editable === void 0 && $$bindings.editable && editable !== void 0)
    $$bindings.editable(editable);
  $$result.css.add(css$A);
  return `${validate_component(Completed, "Completed").$$render($$result, { header: "Transation Memo", changeStep }, {}, {
    default: () => {
      return `<span class="${"svelte-cwr761"}">${escape(memo ? memo : "(Optional)")}</span>`;
    }
  })}`;
});
const sending_svelte_svelte_type_style_lang = "";
const css$z = {
  code: ".container.svelte-107ey7m{margin-top:1em}",
  map: null
};
const Sending = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $transferData, $$unsubscribe_transferData;
  let $txFee, $$unsubscribe_txFee;
  let $activeBlockchain, $$unsubscribe_activeBlockchain;
  $$unsubscribe_transferData = subscribe(transferData, (value) => $transferData = value);
  $$unsubscribe_txFee = subscribe(txFee, (value) => $txFee = value);
  $$unsubscribe_activeBlockchain = subscribe(activeBlockchain, (value) => $activeBlockchain = value);
  let { token } = $$props;
  if ($$props.token === void 0 && $$bindings.token && token !== void 0)
    $$bindings.token(token);
  $$result.css.add(css$z);
  $$unsubscribe_transferData();
  $$unsubscribe_txFee();
  $$unsubscribe_activeBlockchain();
  return `<div class="${"container svelte-107ey7m"}">${$transferData.toAddress ? `${validate_component(Address, "StatusAddress").$$render($$result, { toAddress: $transferData.toAddress }, {}, {})}` : ``}
    ${$transferData.toAccount ? `${validate_component(Account$1, "StatusAccount").$$render($$result, { toAccount: $transferData.toAccount }, {}, {})}` : ``}
    ${$transferData.quantity ? `${validate_component(Quantity, "StatusQuantity").$$render($$result, { quantity: $transferData.quantity, token }, {}, {})}` : ``}
    ${$transferData.quantity && $txFee ? `${validate_component(Fee, "StatusFee").$$render(
    $$result,
    {
      txFee: $txFee,
      quantity: $transferData.quantity
    },
    {},
    {}
  )}` : ``}
    ${$activeBlockchain && $activeBlockchain.id !== "fio" ? `${validate_component(Memo, "StatusMemo").$$render($$result, { memo: $transferData.memo }, {}, {})}` : ``}</div>`;
});
const main_svelte_svelte_type_style_lang = "";
const css$y = {
  code: ".container.svelte-11v60z.svelte-11v60z{margin:0 auto;max-width:28rem}.controls.svelte-11v60z.svelte-11v60z{text-align:center}.controls.svelte-11v60z .button{background:none;color:var(--main-blue);font-size:10px;text-transform:uppercase}.header.svelte-11v60z.svelte-11v60z{color:var(--black);font-family:Inter;font-style:normal;font-weight:bold;font-size:24px;line-height:29px;text-align:center;letter-spacing:-0.47px;margin-bottom:7px}.subheader.svelte-11v60z.svelte-11v60z{color:var(--dark-grey);font-family:Inter;font-style:normal;font-weight:normal;font-size:16px;line-height:19px;text-align:center;letter-spacing:-0.18px}.progress.svelte-11v60z.svelte-11v60z{margin:18px 0 42px;text-align:center}.progress.svelte-11v60z .step.svelte-11v60z{display:inline-block;height:4px;width:105px;margin:0 3px 0 0;background:var(--main-blue);opacity:0.3}.progress.step-1.svelte-11v60z .step.svelte-11v60z:nth-child(-n+1),.progress.step-2.svelte-11v60z .step.svelte-11v60z:nth-child(-n+2),.progress.step-3.svelte-11v60z .step.svelte-11v60z:nth-child(-n+3){opacity:1}@media only screen and (max-width: 600px){.progress.svelte-11v60z.svelte-11v60z{margin:12px 0 24px}.progress.svelte-11v60z .step.svelte-11v60z{width:85px}}",
  map: null
};
const Main = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $activeBlockchain, $$unsubscribe_activeBlockchain;
  let $activeSession, $$unsubscribe_activeSession;
  let $transferData, $$unsubscribe_transferData;
  let $txFee, $$unsubscribe_txFee;
  let $tokenContract, $$unsubscribe_tokenContract;
  let $balance, $$unsubscribe_balance;
  let $token, $$unsubscribe_token;
  $$unsubscribe_activeBlockchain = subscribe(activeBlockchain, (value) => $activeBlockchain = value);
  $$unsubscribe_activeSession = subscribe(activeSession, (value) => $activeSession = value);
  $$unsubscribe_transferData = subscribe(transferData, (value) => $transferData = value);
  $$unsubscribe_txFee = subscribe(txFee, (value) => $txFee = value);
  let { balance } = $$props;
  $$unsubscribe_balance = subscribe(balance, (value) => $balance = value);
  let { token } = $$props;
  $$unsubscribe_token = subscribe(token, (value) => $token = value);
  let { resetData } = $$props;
  const context = getContext("transaction");
  const tokenContract = derived([token], ([$token2]) => {
    if ($token2) {
      return Name.from($token2.contract);
    }
    return Name.from($activeBlockchain.coreTokenContract);
  });
  $$unsubscribe_tokenContract = subscribe(tokenContract, (value) => $tokenContract = value);
  function getActionData() {
    switch (String($tokenContract)) {
      case "fio.token": {
        return FIOTransfer.from({
          payee_public_key: $transferData.toAddress.toLegacyString($activeBlockchain.coreTokenSymbol.name),
          amount: $transferData.quantity && $transferData.quantity.units,
          max_fee: $txFee.units,
          actor: $activeSession.auth.actor,
          tpid: "tpid@greymass"
        });
      }
      default: {
        return Transfer$1.from({
          from: $activeSession.auth.actor,
          to: $transferData.toAccount,
          quantity: $transferData.quantity,
          memo: $transferData.memo || ""
        });
      }
    }
  }
  const field = derived([balance], ([$balance2]) => {
    if ($balance2) {
      return $balance2.quantity;
    }
    return void 0;
  });
  async function handleTransfer() {
    transferData.update((data) => ({
      ...data,
      step: Step.Sending,
      backStep: void 0
    }));
    try {
      const result = await $activeSession.transact({
        action: {
          authorization: [$activeSession.auth],
          account: get_store_value(tokenContract),
          name: $activeBlockchain.coreTokenTransfer,
          data: getActionData()
        }
      });
      resetData();
      if (context) {
        const txid = String(result.transaction.id);
        context.setTransaction(txid);
        context.awaitAccountUpdate(field);
      }
    } catch (error) {
      console.warn("Error during transact", error);
      if (context) {
        context.setTransactionError(error);
      }
    }
  }
  if ($$props.balance === void 0 && $$bindings.balance && balance !== void 0)
    $$bindings.balance(balance);
  if ($$props.token === void 0 && $$bindings.token && token !== void 0)
    $$bindings.token(token);
  if ($$props.resetData === void 0 && $$bindings.resetData && resetData !== void 0)
    $$bindings.resetData(resetData);
  if ($$props.field === void 0 && $$bindings.field && field !== void 0)
    $$bindings.field(field);
  $$result.css.add(css$y);
  $$unsubscribe_activeBlockchain();
  $$unsubscribe_activeSession();
  $$unsubscribe_transferData();
  $$unsubscribe_txFee();
  $$unsubscribe_tokenContract();
  $$unsubscribe_balance();
  $$unsubscribe_token();
  return `<div class="${"container svelte-11v60z"}">${![Step.Sending].includes($transferData.step) ? `<div class="${"header svelte-11v60z"}">${escape($transferData.step === Step.Receive ? "Receive tokens" : "Send tokens")}</div>
        ${$transferData.step === Step.Receive ? `<div class="${"subheader svelte-11v60z"}">Use your account name</div>` : ``}` : ``}
    ${[Step.Recipient, Step.Amount, Step.Confirm].includes($transferData.step) ? `${$transferData.step === Step.Recipient ? `<div class="${"subheader svelte-11v60z"}">Add recipient</div>` : ``}
        ${$transferData.step === Step.Amount ? `<div class="${"subheader svelte-11v60z"}">Select an amount</div>` : ``}
        ${$transferData.step === Step.Token ? `<div class="${"subheader svelte-11v60z"}">Select the token</div>` : ``}
        ${$transferData.step === Step.Confirm && $transferData.quantity ? `<div class="${"subheader svelte-11v60z"}">Review and sign</div>` : ``}
        <div class="${escape(null_to_empty(`progress step-${Number($transferData.step)}`)) + " svelte-11v60z"}"><div class="${"step svelte-11v60z"}"></div>
            <div class="${"step svelte-11v60z"}"></div>
            <div class="${"step svelte-11v60z"}"></div></div>` : ``}
    ${[Step.Sending].includes($transferData.step) ? `<div class="${"header svelte-11v60z"}">${validate_component(Icon, "Icon").$$render($$result, { size: "huge", name: "radio" }, {}, {})}
            <div>Sending Tokens</div></div>
        <div class="${"subheader svelte-11v60z"}">Requesting signature from wallet</div>` : ``}
    ${$balance && $token ? `${$transferData.step === Step.Recipient ? `${validate_component(Recipient, "TransferRecipient").$$render($$result, { balance, token: $token }, {}, {})}` : ``}
        ${$transferData.step === Step.Amount ? `${validate_component(Amount, "TransferAmount").$$render($$result, { balance, token: $token }, {}, {})}` : ``}
        ${$transferData.step === Step.Confirm && $transferData.quantity ? `${validate_component(Confirm, "TransferConfirm").$$render($$result, { handleTransfer, token: $token }, {}, {})}` : ``}
        ${$transferData.step === Step.Receive ? `${validate_component(Receive, "TransferReceive").$$render($$result, {}, {}, {})}` : ``}
        ${$transferData.step === Step.Sending ? `${validate_component(Sending, "TransferSending").$$render($$result, { token: $token }, {}, {})}` : ``}` : `No balance of this token to transfer!`}
    ${![Step.Receive, Step.Sending].includes($transferData.step) ? `<div class="${"controls svelte-11v60z"}">${$transferData.step > 1 ? `${validate_component(Button$2, "Button").$$render($$result, { style: "no-frame" }, {}, {
    default: () => {
      return `${validate_component(Icon, "Icon").$$render($$result, { size: "medium", name: "arrow-left" }, {}, {})}<span>Back</span>`;
    }
  })}` : `${validate_component(Button$2, "Button").$$render($$result, { href: "/", style: "no-frame" }, {}, {
    default: () => {
      return `Cancel`;
    }
  })}`}</div>` : ``}</div>`;
});
const index_svelte_svelte_type_style_lang$3 = "";
const css$x = {
  code: ".container.svelte-1v5vyoa.svelte-1v5vyoa{border:1px solid var(--divider-grey);border-radius:20px;padding:26px}.container.svelte-1v5vyoa .button{margin-top:31px}.options.svelte-1v5vyoa.svelte-1v5vyoa{display:inline-flex;padding:22px 0px 15px;text-align:right}.options.svelte-1v5vyoa .toggle.svelte-1v5vyoa{font-weight:bold;margin-right:10px;font-size:10px;line-height:12px;display:flex;align-items:center;text-align:center;letter-spacing:0.1px;text-transform:uppercase;padding:10px;cursor:pointer;color:var(--main-blue);border-radius:8px}.options.svelte-1v5vyoa .toggle.active.svelte-1v5vyoa{opacity:1;background-color:var(--main-grey);color:var(--main-black)}.options.svelte-1v5vyoa .toggle.svelte-1v5vyoa:last-child{margin-right:0}@media only screen and (max-width: 999px){.container.svelte-1v5vyoa.svelte-1v5vyoa{margin:0 32px}}@media only screen and (max-width: 600px){.container.svelte-1v5vyoa.svelte-1v5vyoa{border:none;padding:12px;margin:0 8px}}",
  map: null
};
const Transfer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $transferData, $$unsubscribe_transferData;
  let $activeSession, $$unsubscribe_activeSession;
  let $activeBlockchain, $$unsubscribe_activeBlockchain;
  $$unsubscribe_transferData = subscribe(transferData, (value) => $transferData = value);
  $$unsubscribe_activeSession = subscribe(activeSession, (value) => $activeSession = value);
  $$unsubscribe_activeBlockchain = subscribe(activeBlockchain, (value) => $activeBlockchain = value);
  let { meta = void 0 } = $$props;
  const token = derived([activeSession, systemTokenKey, transferData, tokens], ([$activeSession2, $systemTokenKey, $transferData2, $tokens]) => {
    if ($activeSession2 && $systemTokenKey && $tokens) {
      if ($transferData2.tokenKey) {
        return $tokens.find((t) => t.key === $transferData2.tokenKey);
      }
      if (meta) {
        const params = {
          chainId: $activeBlockchain.chainId,
          contract: Name.from(meta.params.contract),
          name: Name.from(meta.params.token)
        };
        const key = makeTokenKey(params);
        return $tokens.find((t) => t.key === key);
      }
      return $tokens.find((t) => t.key === $systemTokenKey);
    }
  });
  const balance = derived([activeSession, balances, token], ([$activeSession2, $currentBalances, $token]) => {
    if ($token) {
      const key = makeBalanceKey($token, $activeSession2.auth.actor);
      return $currentBalances.find((b2) => b2.key === key);
    }
  });
  let currentSession = $activeSession;
  function resetData() {
    transferData.set({ step: Step.Recipient });
    fetchTxFee();
  }
  function retryCallback() {
    set_store_value(transferData, $transferData.step = Step.Confirm, $transferData);
  }
  function resetCallback() {
    set_store_value(transferData, $transferData.step = Step.Recipient, $transferData);
  }
  if ($$props.meta === void 0 && $$bindings.meta && meta !== void 0)
    $$bindings.meta(meta);
  $$result.css.add(css$x);
  {
    {
      if ($activeSession !== currentSession) {
        resetData();
        f.goto("/transfer");
        currentSession = $activeSession;
      }
    }
  }
  $$unsubscribe_transferData();
  $$unsubscribe_activeSession();
  $$unsubscribe_activeBlockchain();
  return `${validate_component(Page$1, "Page").$$render($$result, { divider: false }, {}, {
    submenu: () => {
      return `<span slot="${"submenu"}"><div class="${"options svelte-1v5vyoa"}"><span class="${[
        "toggle svelte-1v5vyoa",
        $transferData.step !== Step.Receive ? "active" : ""
      ].join(" ").trim()}">${validate_component(Text, "Text").$$render($$result, {}, {}, {
        default: () => {
          return `\u2191 Send`;
        }
      })}</span>
            <span class="${[
        "toggle svelte-1v5vyoa",
        $transferData.step === Step.Receive ? "active" : ""
      ].join(" ").trim()}">${validate_component(Text, "Text").$$render($$result, {}, {}, {
        default: () => {
          return `\u2193 Receive`;
        }
      })}</span></div></span>`;
    },
    default: () => {
      return `${validate_component(Transaction, "TransactionForm").$$render($$result, { resetCallback, retryCallback }, {}, {
        default: () => {
          return `<div class="${"container svelte-1v5vyoa"}">${validate_component(Main, "TransferMain").$$render($$result, { balance, token, resetData }, {}, {})}</div>`;
        }
      })}`;
    }
  })}`;
});
function cubicInOut(t) {
  return t < 0.5 ? 4 * t * t * t : 0.5 * Math.pow(2 * t - 2, 3) + 1;
}
function is_date(obj) {
  return Object.prototype.toString.call(obj) === "[object Date]";
}
function get_interpolator(a, b2) {
  if (a === b2 || a !== a)
    return () => a;
  const type = typeof a;
  if (type !== typeof b2 || Array.isArray(a) !== Array.isArray(b2)) {
    throw new Error("Cannot interpolate values of different type");
  }
  if (Array.isArray(a)) {
    const arr = b2.map((bi, i2) => {
      return get_interpolator(a[i2], bi);
    });
    return (t) => arr.map((fn) => fn(t));
  }
  if (type === "object") {
    if (!a || !b2)
      throw new Error("Object cannot be null");
    if (is_date(a) && is_date(b2)) {
      a = a.getTime();
      b2 = b2.getTime();
      const delta = b2 - a;
      return (t) => new Date(a + t * delta);
    }
    const keys = Object.keys(b2);
    const interpolators = {};
    keys.forEach((key) => {
      interpolators[key] = get_interpolator(a[key], b2[key]);
    });
    return (t) => {
      const result = {};
      keys.forEach((key) => {
        result[key] = interpolators[key](t);
      });
      return result;
    };
  }
  if (type === "number") {
    const delta = b2 - a;
    return (t) => a + t * delta;
  }
  throw new Error(`Cannot interpolate ${type} values`);
}
function tweened(value, defaults = {}) {
  const store = writable(value);
  let task;
  let target_value = value;
  function set(new_value, opts) {
    if (value == null) {
      store.set(value = new_value);
      return Promise.resolve();
    }
    target_value = new_value;
    let previous_task = task;
    let started = false;
    let { delay = 0, duration = 400, easing = identity, interpolate = get_interpolator } = assign(assign({}, defaults), opts);
    if (duration === 0) {
      if (previous_task) {
        previous_task.abort();
        previous_task = null;
      }
      store.set(value = target_value);
      return Promise.resolve();
    }
    const start = now() + delay;
    let fn;
    task = loop((now2) => {
      if (now2 < start)
        return true;
      if (!started) {
        fn = interpolate(value, new_value);
        if (typeof duration === "function")
          duration = duration(value, new_value);
        started = true;
      }
      if (previous_task) {
        previous_task.abort();
        previous_task = null;
      }
      const elapsed = now2 - start;
      if (elapsed > duration) {
        store.set(value = new_value);
        return false;
      }
      store.set(value = fn(easing(elapsed / duration)));
      return true;
    });
    return task.promise;
  }
  return {
    set,
    update: (fn, opts) => set(fn(target_value, value), opts),
    subscribe: store.subscribe
  };
}
const gauge_svelte_svelte_type_style_lang = "";
const css$w = {
  code: ".container.svelte-gasc41.svelte-gasc41{position:relative;width:120px}path.svelte-gasc41.svelte-gasc41{stroke-width:9;stroke:var(--main-blue);stroke-opacity:0.15;fill:none}path.color.svelte-gasc41.svelte-gasc41{stroke-opacity:1}.icon.svelte-gasc41.svelte-gasc41{position:absolute;inset:0;top:-20px;display:flex;justify-content:center;align-items:center}p.svelte-gasc41.svelte-gasc41{margin-top:-30px;display:flex;flex-direction:column;align-items:center}p.svelte-gasc41 .percentage.svelte-gasc41{font-size:16px;font-weight:600;line-height:19px;color:var(--main-black)}p.svelte-gasc41 .usage.svelte-gasc41{margin-top:5px;font-weight:500;font-size:10px;line-height:12px;color:var(--main-black)}",
  map: null
};
const finalAngle = 140;
function polarToCartesian(center, radius, angle) {
  const radians = (angle - 90) * Math.PI / 180;
  return {
    x: center.x + radius * Math.cos(radians),
    y: center.y + radius * Math.sin(radians)
  };
}
function svgCircleArcPath({ center, radius, startAngle, endAngle }) {
  const start = polarToCartesian(center, radius, endAngle);
  const end = polarToCartesian(center, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}
const Gauge = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let percentageAnimatedRound;
  let path;
  let $percentageAnimated, $$unsubscribe_percentageAnimated;
  let { icon } = $$props;
  let { percentage } = $$props;
  let { fallback = "" } = $$props;
  const initialAngle = -140;
  const percentageAnimated = tweened(0, { duration: 400, easing: cubicInOut });
  $$unsubscribe_percentageAnimated = subscribe(percentageAnimated, (value) => $percentageAnimated = value);
  if ($$props.icon === void 0 && $$bindings.icon && icon !== void 0)
    $$bindings.icon(icon);
  if ($$props.percentage === void 0 && $$bindings.percentage && percentage !== void 0)
    $$bindings.percentage(percentage);
  if ($$props.fallback === void 0 && $$bindings.fallback && fallback !== void 0)
    $$bindings.fallback(fallback);
  $$result.css.add(css$w);
  percentageAnimatedRound = $percentageAnimated >= 0 ? ($percentageAnimated * 100).toFixed(1) : 0;
  path = svgCircleArcPath({
    center: { x: 50, y: 50 },
    radius: 40,
    startAngle: initialAngle,
    endAngle: ($percentageAnimated >= 0 ? $percentageAnimated : 0) * (finalAngle - initialAngle) + initialAngle
  });
  {
    percentageAnimated.set(percentage / 100);
  }
  $$unsubscribe_percentageAnimated();
  return `<div class="${"container svelte-gasc41"}"><svg viewBox="${"0 0 100 100"}"><path${add_attribute(
    "d",
    svgCircleArcPath({
      center: { x: 50, y: 50 },
      radius: 40,
      startAngle: initialAngle,
      endAngle: finalAngle
    }),
    0
  )} class="${"svelte-gasc41"}"></path><path class="${"color svelte-gasc41"}"${add_attribute("d", path, 0)}></path></svg>
    <div class="${"icon svelte-gasc41"}">${validate_component(Icon, "Icon").$$render($$result, { name: icon, size: "huge" }, {}, {})}</div>
    <p class="${"svelte-gasc41"}">${percentage < 100 ? `<span class="${"percentage svelte-gasc41"}">${escape(percentageAnimatedRound)}%</span>
            <span class="${"usage svelte-gasc41"}">Quota used</span>` : `<span class="${"percentage svelte-gasc41"}">${escape(fallback)}</span>`}</p></div>`;
});
const index_svelte_svelte_type_style_lang$2 = "";
const css$v = {
  code: ".state.svelte-u18r6a.svelte-u18r6a{display:flex;justify-content:center;background:var(--main-grey);border-radius:20px;color:var(--main-black);padding:22px 26px}.state.extra.svelte-u18r6a.svelte-u18r6a{background:transparent;padding-left:0;padding-right:0}.state.svelte-u18r6a .content.svelte-u18r6a{flex:1;width:100%;display:flex;flex-direction:column;justify-content:space-between}.state.extra.svelte-u18r6a .content.svelte-u18r6a{max-width:120px}.state.svelte-u18r6a .extra.svelte-u18r6a{flex:1 1 auto;margin-left:20px}.state.svelte-u18r6a .extra.svelte-u18r6a ul li{color:var(--light-grey);font-size:16px;line-height:16px;padding:2px 0;display:flex;max-width:200px;justify-content:space-between}.state.svelte-u18r6a h3{font-size:16px;font-weight:normal;line-height:19px;margin-bottom:8px;color:var(--light-grey);text-align:center}.state.svelte-u18r6a .extra h3{margin-top:10px;text-align:left;font-weight:bold;font-size:12px;line-height:14px;text-transform:uppercase}.state.svelte-u18r6a h4{font-weight:bold;font-size:18px;line-height:22px;color:var(--black);text-transform:uppercase;text-align:center}.state.svelte-u18r6a .extra h4{text-align:left}.state.svelte-u18r6a .gauge{display:flex;justify-content:center}.state.svelte-u18r6a p{display:flex;flex-direction:column;font-size:16px;line-height:19px;letter-spacing:-0.26px;color:var(--light-grey);margin-bottom:8px}@media(max-width: 460px){.extra.svelte-u18r6a.svelte-u18r6a{display:none}}",
  map: null
};
const State = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { showExtra = false } = $$props;
  if ($$props.showExtra === void 0 && $$bindings.showExtra && showExtra !== void 0)
    $$bindings.showExtra(showExtra);
  $$result.css.add(css$v);
  return `<div class="${["state svelte-u18r6a", showExtra ? "extra" : ""].join(" ").trim()}"><div class="${"content svelte-u18r6a"}">${slots.default ? slots.default({}) : ``}</div>
    ${showExtra ? `<div class="${"extra svelte-u18r6a"}">${slots.extra ? slots.extra({}) : ``}</div>` : ``}</div>`;
});
const precision$2 = 2;
const Cpu$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let usagePerc;
  let $currentAccount, $$unsubscribe_currentAccount;
  let $used, $$unsubscribe_used;
  $$unsubscribe_currentAccount = subscribe(currentAccount, (value) => $currentAccount = value);
  let { showExtra = false } = $$props;
  const used = derived([currentAccount], ([$currentAccount2]) => {
    let percentage = 100;
    if ($currentAccount2) {
      const max = Number($currentAccount2 == null ? void 0 : $currentAccount2.cpu_limit.max);
      const usage = Number($currentAccount2 == null ? void 0 : $currentAccount2.cpu_limit.used);
      percentage = isNaN(max) || isNaN(usage) ? 0 : usage / max * 100;
      if (max === 0 || percentage > 100) {
        percentage = 100;
      }
      return percentage.toFixed(1);
    } else {
      return 0 .toFixed(1);
    }
  });
  $$unsubscribe_used = subscribe(used, (value) => $used = value);
  if ($$props.showExtra === void 0 && $$bindings.showExtra && showExtra !== void 0)
    $$bindings.showExtra(showExtra);
  if ($$props.used === void 0 && $$bindings.used && used !== void 0)
    $$bindings.used(used);
  usagePerc = (Number($currentAccount == null ? void 0 : $currentAccount.cpu_limit.available) / 1e3).toFixed(precision$2);
  $$unsubscribe_currentAccount();
  $$unsubscribe_used();
  return `${validate_component(State, "Wrapper").$$render($$result, { showExtra }, {}, {
    extra: () => {
      return `<div slot="${"extra"}">${showExtra ? `<h4>CPU</h4>
            <h3>Resource Statistics</h3>` : ``}
        <ul><li><span>Available:</span>
                <span>${escape((Number($currentAccount == null ? void 0 : $currentAccount.cpu_limit.available) / 1e3).toFixed(precision$2))} ms</span></li>
            <li><span>Used:</span>
                <span>${escape((Number($currentAccount == null ? void 0 : $currentAccount.cpu_limit.used) / 1e3).toFixed(precision$2))} ms</span></li>
            <li><span>Maximum:</span>
                <span>${escape((Number($currentAccount == null ? void 0 : $currentAccount.cpu_limit.max) / 1e3).toFixed(precision$2))} ms</span></li></ul></div>`;
    },
    default: () => {
      return `${!showExtra ? `<h4>CPU</h4>
        <h3>${escape(usagePerc)} <span>ms</span></h3>` : ``}
    <div class="${"gauge"}">${validate_component(Gauge, "Gauge").$$render(
        $$result,
        {
          icon: "cpu",
          percentage: Number($used),
          fallback: "N/A"
        },
        {},
        {}
      )}</div>
    ${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const precision$1 = 2;
const Net$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let usagePerc;
  let $currentAccount, $$unsubscribe_currentAccount;
  let $used, $$unsubscribe_used;
  $$unsubscribe_currentAccount = subscribe(currentAccount, (value) => $currentAccount = value);
  let { showExtra = false } = $$props;
  const used = derived([currentAccount], ([$currentAccount2]) => {
    let percentage = 100;
    if ($currentAccount2) {
      const max = Number($currentAccount2 == null ? void 0 : $currentAccount2.net_limit.max);
      const usage = Number($currentAccount2 == null ? void 0 : $currentAccount2.net_limit.used);
      percentage = isNaN(max) || isNaN(usage) ? 0 : usage / max * 100;
      if (max === 0 || percentage > 100) {
        percentage = 100;
      }
      return percentage.toFixed(1);
    } else {
      return 0 .toFixed(1);
    }
  });
  $$unsubscribe_used = subscribe(used, (value) => $used = value);
  if ($$props.showExtra === void 0 && $$bindings.showExtra && showExtra !== void 0)
    $$bindings.showExtra(showExtra);
  if ($$props.used === void 0 && $$bindings.used && used !== void 0)
    $$bindings.used(used);
  usagePerc = (Number($currentAccount == null ? void 0 : $currentAccount.net_limit.available) / 1e3).toFixed(precision$1);
  $$unsubscribe_currentAccount();
  $$unsubscribe_used();
  return `${validate_component(State, "Wrapper").$$render($$result, { showExtra }, {}, {
    extra: () => {
      return `<div slot="${"extra"}">${showExtra ? `<h4>NET</h4>
            <h3>Resource Statistics</h3>` : ``}
        <ul><li><span>Available:</span>
                <span>${escape((Number($currentAccount == null ? void 0 : $currentAccount.net_limit.available) / 1e3).toFixed(precision$1))} kb</span></li>
            <li><span>Used:</span>
                <span>${escape((Number($currentAccount == null ? void 0 : $currentAccount.net_limit.used) / 1e3).toFixed(precision$1))}<span>\xA0kb</span></span></li>
            <li><span>Maximum:</span>
                <span>${escape((Number($currentAccount == null ? void 0 : $currentAccount.net_limit.max) / 1e3).toFixed(precision$1))} kb</span></li></ul></div>`;
    },
    default: () => {
      return `${!showExtra ? `<h4>NET</h4>
        <h3>${escape(usagePerc)} <span>kb</span></h3>` : ``}
    <div class="${"gauge"}">${validate_component(Gauge, "Gauge").$$render(
        $$result,
        {
          icon: "wifi",
          percentage: Number($used),
          fallback: "N/A"
        },
        {},
        {}
      )}</div>
    ${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const precision = 3;
const Ram = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let usagePerc;
  let $currentAccount, $$unsubscribe_currentAccount;
  let $used, $$unsubscribe_used;
  $$unsubscribe_currentAccount = subscribe(currentAccount, (value) => $currentAccount = value);
  let { showExtra = false } = $$props;
  const used = derived([currentAccount], ([$currentAccount2]) => {
    let percentage = 100;
    if ($currentAccount2) {
      const max = Number($currentAccount2 == null ? void 0 : $currentAccount2.ram_quota);
      const usage = Number($currentAccount2 == null ? void 0 : $currentAccount2.ram_usage);
      percentage = isNaN(max) || isNaN(usage) ? 0 : usage / max * 100;
      if (max === 0 || percentage > 100) {
        percentage = 100;
      }
      return percentage.toFixed(1);
    } else {
      return 0 .toFixed(1);
    }
  });
  $$unsubscribe_used = subscribe(used, (value) => $used = value);
  if ($$props.showExtra === void 0 && $$bindings.showExtra && showExtra !== void 0)
    $$bindings.showExtra(showExtra);
  if ($$props.used === void 0 && $$bindings.used && used !== void 0)
    $$bindings.used(used);
  usagePerc = ((Number($currentAccount == null ? void 0 : $currentAccount.ram_quota) - Number($currentAccount == null ? void 0 : $currentAccount.ram_usage)) / 1e3).toFixed(precision);
  $$unsubscribe_currentAccount();
  $$unsubscribe_used();
  return `${validate_component(State, "Wrapper").$$render($$result, { showExtra }, {}, {
    extra: () => {
      return `<div slot="${"extra"}">${showExtra ? `<h4>RAM</h4>
            <h3>Resource Statistics</h3>` : ``}
        <ul><li><span>Available:</span>
                <span>${escape(((Number($currentAccount == null ? void 0 : $currentAccount.ram_quota) - Number($currentAccount == null ? void 0 : $currentAccount.ram_usage)) / 1e3).toFixed(precision))} kb</span></li>
            <li><span>Used:</span>
                <span>${escape((Number($currentAccount == null ? void 0 : $currentAccount.ram_usage) / 1e3).toFixed(precision))} kb</span></li>
            <li><span>Maximum:</span>
                <span>${escape((Number($currentAccount == null ? void 0 : $currentAccount.ram_quota) / 1e3).toFixed(precision))} kb</span></li></ul></div>`;
    },
    default: () => {
      return `${!showExtra ? `<h4>RAM</h4>
        <h3>${escape(usagePerc)} <span>kb</span></h3>` : ``}
    <div class="${"gauge"}">${validate_component(Gauge, "Gauge").$$render(
        $$result,
        {
          icon: "hard-drive",
          percentage: Number($used),
          fallback: "N/A"
        },
        {},
        {}
      )}</div>
    ${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const index_svelte_svelte_type_style_lang$1 = "";
const css$u = {
  code: ".wrapper.svelte-ygrgu6{margin:16px 0;display:grid;grid-template-columns:repeat(auto-fill, minmax(270px, 1fr));gap:25px}.buttons.svelte-ygrgu6{display:flex;justify-content:center;margin-top:20px}.buttons.svelte-ygrgu6>*{min-width:80px;margin-left:15px;margin-right:15px}@media only screen and (max-width: 999px){.wrapper.svelte-ygrgu6{margin:16px}}",
  map: null
};
const Pages = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $hasBuyRAM, $$unsubscribe_hasBuyRAM;
  let $hasREX, $$unsubscribe_hasREX;
  let $hasPowerUp, $$unsubscribe_hasPowerUp;
  let $hasStaking, $$unsubscribe_hasStaking;
  const { BuyRAM, PowerUp, REX, Staking: Staking2 } = ChainFeatures;
  const hasBuyRAM = derived(activeBlockchain, ($activeBlockchain) => {
    return $activeBlockchain && $activeBlockchain.chainFeatures.has(BuyRAM);
  });
  $$unsubscribe_hasBuyRAM = subscribe(hasBuyRAM, (value) => $hasBuyRAM = value);
  const hasPowerUp = derived(activeBlockchain, ($activeBlockchain) => {
    return $activeBlockchain && $activeBlockchain.chainFeatures.has(PowerUp);
  });
  $$unsubscribe_hasPowerUp = subscribe(hasPowerUp, (value) => $hasPowerUp = value);
  const hasREX = derived(activeBlockchain, ($activeBlockchain) => {
    return $activeBlockchain && $activeBlockchain.chainFeatures.has(REX);
  });
  $$unsubscribe_hasREX = subscribe(hasREX, (value) => $hasREX = value);
  const hasStaking = derived(activeBlockchain, ($activeBlockchain) => {
    return $activeBlockchain && $activeBlockchain.chainFeatures.has(Staking2);
  });
  $$unsubscribe_hasStaking = subscribe(hasStaking, (value) => $hasStaking = value);
  $$result.css.add(css$u);
  $$unsubscribe_hasBuyRAM();
  $$unsubscribe_hasREX();
  $$unsubscribe_hasPowerUp();
  $$unsubscribe_hasStaking();
  return `<div class="${"wrapper svelte-ygrgu6"}">${validate_component(Ram, "ResourceStateRAM").$$render($$result, {}, {}, {
    default: () => {
      return `${$hasBuyRAM ? `<div class="${"buttons svelte-ygrgu6"}">${validate_component(Button$2, "Button").$$render(
        $$result,
        {
          style: "no-frame",
          href: "/resources/ram/buy"
        },
        {},
        {
          default: () => {
            return `${validate_component(Text, "Text").$$render($$result, {}, {}, {
              default: () => {
                return `BUY`;
              }
            })}`;
          }
        }
      )}
                ${validate_component(Button$2, "Button").$$render(
        $$result,
        {
          style: "no-frame",
          href: "/resources/ram/sell"
        },
        {},
        {
          default: () => {
            return `${validate_component(Text, "Text").$$render($$result, {}, {}, {
              default: () => {
                return `SELL`;
              }
            })}`;
          }
        }
      )}</div>` : ``}`;
    }
  })}
    ${validate_component(Cpu$1, "ResourceStateCPU").$$render($$result, {}, {}, {
    default: () => {
      return `<div class="${"buttons svelte-ygrgu6"}">${$hasREX || $hasPowerUp ? `${validate_component(Button$2, "Button").$$render(
        $$result,
        {
          style: "no-frame",
          href: "/resources/cpu"
        },
        {},
        {
          default: () => {
            return `${validate_component(Text, "Text").$$render($$result, {}, {}, {
              default: () => {
                return `RENT`;
              }
            })}`;
          }
        }
      )}` : `${$hasStaking ? `${validate_component(Button$2, "Button").$$render(
        $$result,
        {
          style: "no-frame",
          href: "/resources/cpu/stake"
        },
        {},
        {
          default: () => {
            return `${validate_component(Text, "Text").$$render($$result, {}, {}, {
              default: () => {
                return `STAKE`;
              }
            })}`;
          }
        }
      )}` : ``}`}</div>`;
    }
  })}
    ${validate_component(Net$1, "ResourceStateNET").$$render($$result, {}, {}, {
    default: () => {
      return `<div class="${"buttons svelte-ygrgu6"}">${$hasREX || $hasPowerUp ? `${validate_component(Button$2, "Button").$$render(
        $$result,
        {
          style: "no-frame",
          href: "/resources/net"
        },
        {},
        {
          default: () => {
            return `${validate_component(Text, "Text").$$render($$result, {}, {}, {
              default: () => {
                return `RENT`;
              }
            })}`;
          }
        }
      )}` : `${$hasStaking ? `${validate_component(Button$2, "Button").$$render(
        $$result,
        {
          style: "no-frame",
          href: "/resources/net/stake"
        },
        {},
        {
          default: () => {
            return `${validate_component(Text, "Text").$$render($$result, {}, {}, {
              default: () => {
                return `STAKE`;
              }
            })}`;
          }
        }
      )}` : ``}`}</div>`;
    }
  })}</div>`;
});
const prices_svelte_svelte_type_style_lang = "";
const css$t = {
  code: ".svelte-436mvb .segment{margin-top:12px;background-color:transparent;border:1px solid var(--divider-grey)}.offers.svelte-436mvb{border:1px solid var(--divider-grey);border-radius:20px;padding:20px}.header.svelte-436mvb{font-weight:bold;font-size:18px;line-height:22px}.description.svelte-436mvb{font-size:16px;line-height:19px;margin:8px 0 20px 0}h4.svelte-436mvb{margin-bottom:16px}.offer.svelte-436mvb{text-align:center}.offer.svelte-436mvb a span{text-transform:uppercase}.price.svelte-436mvb{margin-top:18px;font-weight:bold;font-size:13px;line-height:16px;color:var(--main-black)}.service.svelte-436mvb{font-weight:600;font-size:16px;line-height:19px}.pair.svelte-436mvb{margin-top:5px;font-weight:bold;font-size:10px;line-height:12px;color:var(--light-grey);text-transform:uppercase}.term.svelte-436mvb{margin:15px 0 40px 0;color:var(--light-grey)}.svelte-436mvb p{font-size:16px;line-height:19px;color:var(--light-grey);margin-bottom:8px}",
  map: null
};
const Prices = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $hasPowerUp, $$unsubscribe_hasPowerUp;
  let $powerupPrice, $$unsubscribe_powerupPrice;
  let $token, $$unsubscribe_token;
  let $hasREX, $$unsubscribe_hasREX;
  let $rexPrice, $$unsubscribe_rexPrice;
  let $activeBlockchain, $$unsubscribe_activeBlockchain;
  let $hasStaking, $$unsubscribe_hasStaking;
  let $stakingPrice, $$unsubscribe_stakingPrice;
  $$unsubscribe_powerupPrice = subscribe(powerupPrice, (value) => $powerupPrice = value);
  $$unsubscribe_rexPrice = subscribe(rexPrice, (value) => $rexPrice = value);
  $$unsubscribe_activeBlockchain = subscribe(activeBlockchain, (value) => $activeBlockchain = value);
  $$unsubscribe_stakingPrice = subscribe(stakingPrice, (value) => $stakingPrice = value);
  let { resource = "cpu" } = $$props;
  const unit = resource === "cpu" ? "ms" : "kb";
  const { PowerUp, REX, Staking: Staking2 } = ChainFeatures;
  const hasPowerUp = derived(activeBlockchain, ($activeBlockchain2) => {
    return $activeBlockchain2 && $activeBlockchain2.chainFeatures.has(PowerUp);
  });
  $$unsubscribe_hasPowerUp = subscribe(hasPowerUp, (value) => $hasPowerUp = value);
  const hasREX = derived(activeBlockchain, ($activeBlockchain2) => {
    return $activeBlockchain2 && $activeBlockchain2.chainFeatures.has(REX);
  });
  $$unsubscribe_hasREX = subscribe(hasREX, (value) => $hasREX = value);
  const hasStaking = derived(activeBlockchain, ($activeBlockchain2) => {
    return $activeBlockchain2 && $activeBlockchain2.chainFeatures.has(Staking2);
  });
  $$unsubscribe_hasStaking = subscribe(hasStaking, (value) => $hasStaking = value);
  const token = derived(activeBlockchain, ($activeBlockchain2) => {
    if ($activeBlockchain2) {
      return String($activeBlockchain2.coreTokenSymbol.name);
    }
  });
  $$unsubscribe_token = subscribe(token, (value) => $token = value);
  if ($$props.resource === void 0 && $$bindings.resource && resource !== void 0)
    $$bindings.resource(resource);
  $$result.css.add(css$t);
  $$unsubscribe_hasPowerUp();
  $$unsubscribe_powerupPrice();
  $$unsubscribe_token();
  $$unsubscribe_hasREX();
  $$unsubscribe_rexPrice();
  $$unsubscribe_activeBlockchain();
  $$unsubscribe_hasStaking();
  $$unsubscribe_stakingPrice();
  return `<div class="${"offers svelte-436mvb"}"><h2 class="${"header svelte-436mvb"}">Resource Provider Costs for ${escape(resource.toUpperCase())}</h2>
    <h4 class="${"description svelte-436mvb"}">Select a Resource Provider from the choices below to increase your ${escape(resource.toUpperCase())}.
    </h4>
    ${validate_component(Group, "SegmentGroup").$$render($$result, {}, {}, {
    default: () => {
      return `
        ${$hasPowerUp ? `${validate_component(Segment, "Segment").$$render($$result, {}, {}, {
        default: () => {
          return `<div class="${"offer svelte-436mvb"}"><div class="${"service svelte-436mvb"}">Power up</div>
                    <div class="${"price svelte-436mvb"}">${escape($powerupPrice.value.toFixed($powerupPrice.symbol.precision))}</div>
                    <div class="${"pair svelte-436mvb"}">${escape($token)} per ${escape(unit)}</div>
                    <div class="${"term svelte-436mvb"}">Usable for up to <br class="${"svelte-436mvb"}"> 24 hours.</div>
                    ${validate_component(Button$2, "Button").$$render(
            $$result,
            {
              style: "no-frame",
              href: "/resources/" + resource + "/powerup"
            },
            {},
            {
              default: () => {
                return `Rent via PowerUp`;
              }
            }
          )}</div>`;
        }
      })}` : ``}
        ${$hasREX ? `${validate_component(Segment, "Segment").$$render($$result, {}, {}, {
        default: () => {
          return `<div class="${"offer svelte-436mvb"}"><div class="${"service svelte-436mvb"}">REX</div>
                    <div class="${"price svelte-436mvb"}">${escape($rexPrice.value.toFixed($rexPrice.symbol.precision))}</div>
                    <div class="${"pair svelte-436mvb"}">${escape($token)} per
                        ${$activeBlockchain.resourceSampleMilliseconds ? `${escape($activeBlockchain.resourceSampleMilliseconds)}` : ``}
                        ${escape(unit)}</div>
                    <div class="${"term svelte-436mvb"}">Usable each day for <br class="${"svelte-436mvb"}">the next 30 days.</div>
                    ${validate_component(Button$2, "Button").$$render(
            $$result,
            {
              style: "no-frame",
              href: "/resources/" + resource + "/rex"
            },
            {},
            {
              default: () => {
                return `Rent via REX`;
              }
            }
          )}</div>`;
        }
      })}` : ``}
        ${$hasStaking ? `${validate_component(Segment, "Segment").$$render($$result, {}, {}, {
        default: () => {
          return `<div class="${"offer svelte-436mvb"}"><div class="${"service svelte-436mvb"}">Staking</div>
                    <div class="${"price svelte-436mvb"}">${escape((Number($stakingPrice.value) * 1e3).toFixed($stakingPrice.symbol.precision))}</div>
                    <div class="${"pair svelte-436mvb"}">${escape($token)} per
                        ${$activeBlockchain.resourceSampleMilliseconds ? `${escape($activeBlockchain.resourceSampleMilliseconds)}` : ``}
                        ${escape(unit)}</div>
                    <div class="${"term svelte-436mvb"}">Usable each day until <br class="${"svelte-436mvb"}">they are unstaked.</div>
                    ${validate_component(Button$2, "Button").$$render(
            $$result,
            {
              style: "no-frame",
              href: "/resources/" + resource + "/stake"
            },
            {},
            {
              default: () => {
                return `<span class="${"svelte-436mvb"}">Stake Tokens</span>`;
              }
            }
          )}</div>`;
        }
      })}` : ``}`;
    }
  })}</div>`;
});
const cpu_svelte_svelte_type_style_lang = "";
const css$s = {
  code: ".form.svelte-1g2t1y9,.wrapper.svelte-1g2t1y9{margin:16px 0}@media only screen and (max-width: 999px){.wrapper.svelte-1g2t1y9{margin:16px}}",
  map: null
};
const Cpu = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$s);
  return `<div class="${"wrapper svelte-1g2t1y9"}">${validate_component(Cpu$1, "ResourceStateCPU").$$render($$result, { showExtra: true }, {}, {})}
    <div class="${"form svelte-1g2t1y9"}">${validate_component(Prices, "ResourceStatePrices").$$render($$result, { resource: "cpu" }, {}, {})}</div></div>`;
});
const net_svelte_svelte_type_style_lang = "";
const css$r = {
  code: ".form.svelte-1g2t1y9,.wrapper.svelte-1g2t1y9{margin:16px 0}@media only screen and (max-width: 999px){.wrapper.svelte-1g2t1y9{margin:16px}}",
  map: null
};
const Net = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$r);
  return `<div class="${"wrapper svelte-1g2t1y9"}">${validate_component(Net$1, "ResourceStateNET").$$render($$result, { showExtra: true }, {}, {})}
    <div class="${"form svelte-1g2t1y9"}">${validate_component(Prices, "ResourceStatePrices").$$render($$result, { resource: "net" }, {}, {})}</div></div>`;
});
const balance_svelte_svelte_type_style_lang = "";
const css$q = {
  code: '.container.svelte-1uppepf.svelte-1uppepf{display:flex;min-height:60px;padding:10px 0}.token.svelte-1uppepf.svelte-1uppepf{display:inline-flex;align-items:center;justify-content:center;background-color:var(--main-grey);padding:6px;border-radius:50%;vertical-align:middle;margin-right:10px}.token.svelte-1uppepf img.svelte-1uppepf{height:32px;width:32px}.token.svelte-1uppepf.svelte-1uppepf:before{content:"";float:left;width:auto}.balance.svelte-1uppepf .quantity.svelte-1uppepf{color:var(--main-black);font-family:Inter;font-style:normal;font-weight:bold;font-size:18px;line-height:28px;letter-spacing:-0.26px;vertical-align:middle}',
  map: null
};
const Balance = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $balance, $$unsubscribe_balance;
  let { token } = $$props;
  let { balance } = $$props;
  $$unsubscribe_balance = subscribe(balance, (value) => $balance = value);
  if ($$props.token === void 0 && $$bindings.token && token !== void 0)
    $$bindings.token(token);
  if ($$props.balance === void 0 && $$bindings.balance && balance !== void 0)
    $$bindings.balance(balance);
  $$result.css.add(css$q);
  $$unsubscribe_balance();
  return `<div class="${"container svelte-1uppepf"}"><div class="${"token svelte-1uppepf"}"><img${add_attribute("alt", String(token.name), 0)}${add_attribute("src", token.logo, 0)} class="${"svelte-1uppepf"}"></div>
    ${$balance ? `<div class="${"balance svelte-1uppepf"}"><div class="${"quantity svelte-1uppepf"}">${escape($balance.quantity)}</div>
            <div>Available Balance (${escape($balance.account)})</div></div>` : ``}
    ${slots.default ? slots.default({}) : ``}</div>`;
});
const Rambuy = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $kb, $$unsubscribe_kb;
  let $$unsubscribe_activeSession;
  let $activeBlockchain, $$unsubscribe_activeBlockchain;
  let $systemToken, $$unsubscribe_systemToken;
  let $cost, $$unsubscribe_cost;
  $$unsubscribe_activeSession = subscribe(activeSession, (value) => value);
  $$unsubscribe_activeBlockchain = subscribe(activeBlockchain, (value) => $activeBlockchain = value);
  $$unsubscribe_systemToken = subscribe(systemToken, (value) => $systemToken = value);
  getContext("transaction");
  let kb = writable("");
  $$unsubscribe_kb = subscribe(kb, (value) => $kb = value);
  let error;
  const { BuyRAM } = ChainFeatures;
  const field = derived([currentAccount], ([$currentAccount]) => {
    if ($currentAccount) {
      return $currentAccount.ram_quota;
    }
    return void 0;
  });
  const cost = derived([activeBlockchain, kb, stateRAM$1], ([$activeBlockchain2, $kb2, $stateRAM]) => {
    if ($stateRAM && $kb2) {
      return Asset$1.from($stateRAM.price_per(Number($kb2) * 1e3), $activeBlockchain2.coreTokenSymbol);
    }
  });
  $$unsubscribe_cost = subscribe(cost, (value) => $cost = value);
  if ($$props.field === void 0 && $$bindings.field && field !== void 0)
    $$bindings.field(field);
  if ($$props.cost === void 0 && $$bindings.cost && cost !== void 0)
    $$bindings.cost(cost);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `${validate_component(Segment, "Segment").$$render($$result, { background: "white" }, {}, {
      default: () => {
        return `${($activeBlockchain == null ? void 0 : $activeBlockchain.chainFeatures.has(BuyRAM)) ? `${validate_component(Form, "Form").$$render($$result, {}, {}, {
          default: () => {
            return `<p>Amount of kb to buy:</p>
            ${validate_component(Asset, "InputAsset").$$render(
              $$result,
              {
                focus: true,
                fluid: true,
                name: "kb",
                placeholder: `number of kb`,
                value: $kb
              },
              {
                value: ($$value) => {
                  $kb = $$value;
                  $$settled = false;
                }
              },
              {}
            )}
            ${$systemToken ? `${validate_component(Balance, "FormBalance").$$render(
              $$result,
              {
                token: $systemToken,
                balance: systemTokenBalance
              },
              {},
              {}
            )}` : ``}
            ${validate_component(ErrorMessage, "InputErrorMessage").$$render($$result, { errorMessage: error }, {}, {})}
            ${validate_component(Button$2, "Button").$$render(
              $$result,
              {
                style: "primary",
                fluid: true,
                size: "large",
                formValidation: true
              },
              {},
              {
                default: () => {
                  return `Buy ${escape($kb)} kb for ${escape($cost)}`;
                }
              }
            )}`;
          }
        })}` : `<p>This feature is unavailable on this blockchain.</p>`}`;
      }
    })}`;
  } while (!$$settled);
  $$unsubscribe_kb();
  $$unsubscribe_activeSession();
  $$unsubscribe_activeBlockchain();
  $$unsubscribe_systemToken();
  $$unsubscribe_cost();
  return $$rendered;
});
const buy_svelte_svelte_type_style_lang = "";
const css$p = {
  code: ".form.svelte-1g2t1y9,.wrapper.svelte-1g2t1y9{margin:16px 0}@media only screen and (max-width: 999px){.wrapper.svelte-1g2t1y9{margin:16px}}",
  map: null
};
const Buy = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $currentAccount, $$unsubscribe_currentAccount;
  $$unsubscribe_currentAccount = subscribe(currentAccount, (value) => $currentAccount = value);
  $$result.css.add(css$p);
  $$unsubscribe_currentAccount();
  return `<div class="${"wrapper svelte-1g2t1y9"}">${validate_component(Ram, "ResourceStateRAM").$$render($$result, {}, {}, {})}
    ${$currentAccount ? `<div class="${"form svelte-1g2t1y9"}">${validate_component(Transaction, "FormTransaction").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Rambuy, "RAMBuy").$$render($$result, {}, {}, {})}`;
    }
  })}</div>` : ``}</div>`;
});
const Ramsell = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $kb, $$unsubscribe_kb;
  let $$unsubscribe_activeSession;
  let $activeBlockchain, $$unsubscribe_activeBlockchain;
  let $systemToken, $$unsubscribe_systemToken;
  let $cost, $$unsubscribe_cost;
  $$unsubscribe_activeSession = subscribe(activeSession, (value) => value);
  $$unsubscribe_activeBlockchain = subscribe(activeBlockchain, (value) => $activeBlockchain = value);
  $$unsubscribe_systemToken = subscribe(systemToken, (value) => $systemToken = value);
  getContext("transaction");
  let kb = writable("");
  $$unsubscribe_kb = subscribe(kb, (value) => $kb = value);
  let error;
  const { BuyRAM } = ChainFeatures;
  const field = derived([currentAccount], ([$currentAccount]) => {
    if ($currentAccount) {
      return $currentAccount.ram_quota;
    }
    return void 0;
  });
  const cost = derived([activeBlockchain, kb, stateRAM$1], ([$activeBlockchain2, $kb2, $stateRAM]) => {
    if ($stateRAM && $kb2) {
      return Asset$1.from($stateRAM.price_per(Number($kb2) * 1e3), $activeBlockchain2.coreTokenSymbol);
    }
  });
  $$unsubscribe_cost = subscribe(cost, (value) => $cost = value);
  if ($$props.field === void 0 && $$bindings.field && field !== void 0)
    $$bindings.field(field);
  if ($$props.cost === void 0 && $$bindings.cost && cost !== void 0)
    $$bindings.cost(cost);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `${validate_component(Segment, "Segment").$$render($$result, { background: "white" }, {}, {
      default: () => {
        return `${($activeBlockchain == null ? void 0 : $activeBlockchain.chainFeatures.has(BuyRAM)) ? `${validate_component(Form, "Form").$$render($$result, {}, {}, {
          default: () => {
            return `<p>Amount of kb to sell:</p>
            ${validate_component(Asset, "InputAsset").$$render(
              $$result,
              {
                focus: true,
                fluid: true,
                name: "kb",
                placeholder: `number of kb`,
                value: $kb
              },
              {
                value: ($$value) => {
                  $kb = $$value;
                  $$settled = false;
                }
              },
              {}
            )}
            ${$systemToken ? `${validate_component(Balance, "FormBalance").$$render(
              $$result,
              {
                token: $systemToken,
                balance: systemTokenBalance
              },
              {},
              {}
            )}` : ``}
            ${validate_component(ErrorMessage, "InputErrorMessage").$$render($$result, { errorMessage: error }, {}, {})}
            ${validate_component(Button$2, "Button").$$render(
              $$result,
              {
                style: "primary",
                fluid: true,
                size: "large",
                formValidation: true
              },
              {},
              {
                default: () => {
                  return `Sell ${escape($kb)} kb for ${escape($cost)}`;
                }
              }
            )}`;
          }
        })}` : `<p>This feature is unavailable on this blockchain.</p>`}`;
      }
    })}`;
  } while (!$$settled);
  $$unsubscribe_kb();
  $$unsubscribe_activeSession();
  $$unsubscribe_activeBlockchain();
  $$unsubscribe_systemToken();
  $$unsubscribe_cost();
  return $$rendered;
});
const sell_svelte_svelte_type_style_lang = "";
const css$o = {
  code: ".form.svelte-1g2t1y9,.wrapper.svelte-1g2t1y9{margin:16px 0}@media only screen and (max-width: 999px){.wrapper.svelte-1g2t1y9{margin:16px}}",
  map: null
};
const Sell = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $currentAccount, $$unsubscribe_currentAccount;
  $$unsubscribe_currentAccount = subscribe(currentAccount, (value) => $currentAccount = value);
  $$result.css.add(css$o);
  $$unsubscribe_currentAccount();
  return `<div class="${"wrapper svelte-1g2t1y9"}">${validate_component(Ram, "ResourceStateRAM").$$render($$result, {}, {}, {})}
    ${$currentAccount ? `<div class="${"form svelte-1g2t1y9"}">${validate_component(Transaction, "FormTransaction").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Ramsell, "RAMSell").$$render($$result, {}, {}, {})}`;
    }
  })}</div>` : ``}</div>`;
});
const progress_svelte_svelte_type_style_lang$1 = "";
const css$n = {
  code: ".progress-bar.svelte-s4brxv.svelte-s4brxv{display:flex;background-color:var(--cultured);border-radius:12px;margin:0;padding:0}.progress-bar.svelte-s4brxv .indicator.svelte-s4brxv{background-color:var(--lapis-lazuli);border-radius:12px;margin:0;min-height:10px;padding:0;width:var(--percent)}.darkmode .progress-bar.svelte-s4brxv .indicator.svelte-s4brxv{background-color:var(--middle-green-eagle)}",
  map: null
};
const Progress = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { percent = "0" } = $$props;
  if ($$props.percent === void 0 && $$bindings.percent && percent !== void 0)
    $$bindings.percent(percent);
  $$result.css.add(css$n);
  return `<div class="${"progress-bar svelte-s4brxv"}"><div class="${"indicator svelte-s4brxv"}" style="${"--percent:" + escape(percent) + "%"}"></div></div>`;
});
const fuel_svelte_svelte_type_style_lang$2 = "";
const css$m = {
  code: ".quota.svelte-o563cz.svelte-o563cz{margin:32px 0}.quota.svelte-o563cz .name.svelte-o563cz{line-height:24px;font-size:16px;font-weight:bold}.usage.svelte-o563cz .title.svelte-o563cz{line-height:24px;font-size:16px;font-weight:bold}.usage.svelte-o563cz table.svelte-o563cz{border:1px solid black;width:100%}.usage.svelte-o563cz table td.svelte-o563cz,.usage.svelte-o563cz table th.svelte-o563cz{border:1px solid black;padding:10px}.usage.svelte-o563cz table th.svelte-o563cz{font-weight:bold}",
  map: null
};
const Fuel_1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let loading;
  let $activeBlockchain, $$unsubscribe_activeBlockchain;
  $$unsubscribe_activeBlockchain = subscribe(activeBlockchain, (value) => $activeBlockchain = value);
  const { Fuel: Fuel2 } = ChainFeatures;
  let usage = [];
  let quotas = [];
  async function loadUsage() {
    usage = [
      {
        datetime: "2019-12-10T20:54:16.656Z",
        quota: "free",
        usage: { estimated: { cpu: 50, net: 100 } },
        transaction_id: "7fa882e22f99d8f0c0f9c8b06a46792d6c3c29d8da671ebc2a627adcc7ea941c"
      },
      {
        datetime: "2019-12-07T10:14:18.616Z",
        cost: { amount: "0.0023 EOS", source: "fee" },
        usage: {
          actual: { cpu: 90, net: 200 },
          estimated: { cpu: 70, net: 100 }
        },
        transaction_id: "7fa882e22f99d8f0c0f9c8b06a46792d6c3c29d8da671ebc2a627adcc7ea941c"
      },
      {
        datetime: "2019-12-09T20:54:16.656Z",
        quota: "free",
        usage: {
          actual: { cpu: 60, net: 100 },
          estimated: { cpu: 50, net: 100 }
        },
        transaction_id: "7fa882e22f99d8f0c0f9c8b06a46792d6c3c29d8da671ebc2a627adcc7ea941c"
      },
      {
        datetime: "2019-12-07T10:14:18.616Z",
        cost: { source: "balance" },
        quota: "prepaid",
        usage: {
          actual: { cpu: 90, net: 200 },
          estimated: { cpu: 70, net: 100 }
        },
        transaction_id: "7fa882e22f99d8f0c0f9c8b06a46792d6c3c29d8da671ebc2a627adcc7ea941c"
      }
    ];
  }
  async function loadQuotas() {
    quotas = [
      {
        name: "free",
        cpu: { available: 3e3, max: 5e3, used: 2e3 },
        net: { available: 4400, max: 5e3, used: 600 }
      },
      {
        name: "prepaid",
        cpu: { available: 43e3, max: 5e4, used: 7e3 },
        net: { available: 44e3, max: 5e4, used: 6e3 }
      }
    ];
  }
  Promise.all([loadQuotas(), loadUsage()]).then(() => {
    loading = false;
  });
  $$result.css.add(css$m);
  loading = true;
  $$unsubscribe_activeBlockchain();
  return `${function(__value) {
    if (is_promise(__value)) {
      __value.then(null, noop);
      return `
    <p>Hang on, fetching balances and stuff...</p>
`;
    }
    return function(_2) {
      return `
    ${($activeBlockchain == null ? void 0 : $activeBlockchain.chainFeatures.has(Fuel2)) ? `${each(quotas, (quota) => {
        return `<div class="${"quota svelte-o563cz"}"><p class="${"name svelte-o563cz"}">${escape(quota.name)}</p>
                ${validate_component(Progress, "Progress").$$render(
          $$result,
          {
            percent: quota.cpu.available / quota.cpu.max * 100
          },
          {},
          {}
        )}
                ${escape(quota.cpu.available / quota.cpu.max * 100)}% available (${escape(quota.cpu.used)}\u03BCs of ${escape(quota.cpu.max)}\u03BCs used)
            </div>`;
      })}
        <div class="${"usage svelte-o563cz"}"><div class="${"title svelte-o563cz"}">Usage History</div>
            <table class="${"svelte-o563cz"}"><thead><tr><th colspan="${"4"}" class="${"svelte-o563cz"}"></th>
                        <th colspan="${"2"}" class="${"svelte-o563cz"}">Usage</th></tr>
                    <tr><th class="${"svelte-o563cz"}">Status</th>
                        <th class="${"svelte-o563cz"}">Date/Time</th>
                        <th class="${"svelte-o563cz"}">Type</th>
                        <th class="${"svelte-o563cz"}">Cost</th>
                        <th class="${"svelte-o563cz"}">CPU</th>
                        <th class="${"svelte-o563cz"}">NET</th></tr></thead>
                <tbody>${each(usage, (transaction) => {
        return `<tr><td class="${"svelte-o563cz"}"><a${add_attribute("href", `https://bloks.io/transaction/${transaction.transaction_id}`, 0)}>${escape(transaction.usage.actual ? "Completed" : "Pending")}
                                </a></td>
                            <td class="${"svelte-o563cz"}">${escape(transaction.datetime)}</td>
                            <td class="${"svelte-o563cz"}">${transaction.cost && transaction.cost.source === "fee" ? `Transaction Fee` : `${transaction.cost && transaction.cost.source === "balance" ? `Prepaid` : `Free Transaction`}`}</td>
                            <td class="${"svelte-o563cz"}">${escape(transaction.cost && transaction.cost.source === "fee" ? transaction.cost.amount : "-")}</td>
                            <td class="${"svelte-o563cz"}">${escape(transaction.usage.actual ? `${transaction.usage.actual.cpu}\u03BCs CPU` : `${transaction.usage.estimated.cpu}\u03BCs CPU`)}</td>
                            <td class="${"svelte-o563cz"}">${escape(transaction.usage.actual ? `${transaction.usage.actual.net} NET` : `${transaction.usage.estimated.net} NET`)}</td>
                        </tr>`;
      })}</tbody></table></div>` : `<p>This feature is unavailable on this blockchain.</p>`}
`;
    }();
  }(loading)}`;
});
const fuel_svelte_svelte_type_style_lang$1 = "";
const css$l = {
  code: ".form.svelte-62jp4r,.wrapper.svelte-62jp4r{margin:16px 0}@media only screen and (max-width: 999px){.wrapper.svelte-62jp4r{margin:16px}}",
  map: null
};
const Fuel$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$l);
  return `<div class="${"wrapper svelte-62jp4r"}">${validate_component(Cpu$1, "ResourceStateCPU").$$render($$result, { showExtra: true }, {}, {})}
    <div class="${"form svelte-62jp4r"}">${validate_component(Transaction, "FormTransaction").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Fuel_1, "ResourcesFuel").$$render($$result, {}, {}, {})}`;
    }
  })}</div></div>`;
});
const Powerup$2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $cost, $$unsubscribe_cost;
  let $$unsubscribe_activeSession;
  let $amount, $$unsubscribe_amount;
  let $$unsubscribe_sampleUsage;
  let $$unsubscribe_statePowerUp;
  let $activeBlockchain, $$unsubscribe_activeBlockchain;
  let $systemToken, $$unsubscribe_systemToken;
  $$unsubscribe_activeSession = subscribe(activeSession, (value) => value);
  $$unsubscribe_sampleUsage = subscribe(sampleUsage, (value) => value);
  $$unsubscribe_statePowerUp = subscribe(statePowerUp, (value) => value);
  $$unsubscribe_activeBlockchain = subscribe(activeBlockchain, (value) => $activeBlockchain = value);
  $$unsubscribe_systemToken = subscribe(systemToken, (value) => $systemToken = value);
  getContext("transaction");
  let { resource = "cpu" } = $$props;
  const unit = resource === "cpu" ? "ms" : "kb";
  let amount = writable("");
  $$unsubscribe_amount = subscribe(amount, (value) => $amount = value);
  let error;
  const { PowerUp: PowerUpFeature } = ChainFeatures;
  const cost = derived([activeBlockchain, amount, powerupPrice], ([$activeBlockchain2, $amount2, $powerupPrice]) => {
    if ($activeBlockchain2 && $powerupPrice) {
      return Asset$1.from(Number($powerupPrice.value) * Number($amount2), $activeBlockchain2.coreTokenSymbol);
    }
  });
  $$unsubscribe_cost = subscribe(cost, (value) => $cost = value);
  const field = derived([currentAccount], ([$currentAccount]) => {
    if ($currentAccount && $currentAccount.self_delegated_bandwidth) {
      switch (resource) {
        case "net": {
          return $currentAccount.net_limit.max;
        }
        case "cpu":
        default: {
          return $currentAccount.cpu_limit.max;
        }
      }
    }
    return void 0;
  });
  if ($$props.resource === void 0 && $$bindings.resource && resource !== void 0)
    $$bindings.resource(resource);
  if ($$props.field === void 0 && $$bindings.field && field !== void 0)
    $$bindings.field(field);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `${validate_component(Segment, "Segment").$$render($$result, { background: "white" }, {}, {
      default: () => {
        return `${($activeBlockchain == null ? void 0 : $activeBlockchain.chainFeatures.has(PowerUpFeature)) ? `${validate_component(Form, "Form").$$render($$result, {}, {}, {
          default: () => {
            return `<p>Amount of ${escape(unit)} to rent from PowerUp.</p>
            ${validate_component(Input, "Input").$$render(
              $$result,
              {
                focus: true,
                fluid: true,
                inputmode: "decimal",
                name: "amount",
                placeholder: `number of ${unit}`,
                value: $amount
              },
              {
                value: ($$value) => {
                  $amount = $$value;
                  $$settled = false;
                }
              },
              {}
            )}
            ${$systemToken ? `${validate_component(Balance, "FormBalance").$$render(
              $$result,
              {
                token: $systemToken,
                balance: systemTokenBalance
              },
              {},
              {}
            )}` : ``}
            ${validate_component(ErrorMessage, "InputErrorMessage").$$render($$result, { errorMessage: error }, {}, {})}
            ${validate_component(Button$2, "Button").$$render(
              $$result,
              {
                fluid: true,
                size: "large",
                formValidation: true
              },
              {},
              {
                default: () => {
                  return `Rent ${escape(Number($amount))}
                ${escape(unit)} for ${escape($cost)}`;
                }
              }
            )}`;
          }
        })}` : `<p>This feature is unavailable on this blockchain.</p>`}`;
      }
    })}`;
  } while (!$$settled);
  $$unsubscribe_cost();
  $$unsubscribe_activeSession();
  $$unsubscribe_amount();
  $$unsubscribe_sampleUsage();
  $$unsubscribe_statePowerUp();
  $$unsubscribe_activeBlockchain();
  $$unsubscribe_systemToken();
  return $$rendered;
});
const powerup_svelte_svelte_type_style_lang$1 = "";
const css$k = {
  code: ".form.svelte-62jp4r,.wrapper.svelte-62jp4r{margin:16px 0}@media only screen and (max-width: 999px){.wrapper.svelte-62jp4r{margin:16px}}",
  map: null
};
const Powerup$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$k);
  return `<div class="${"wrapper svelte-62jp4r"}">${validate_component(Cpu$1, "ResourceStateCPU").$$render($$result, { showExtra: true }, {}, {})}
    <div class="${"form svelte-62jp4r"}">${validate_component(Transaction, "FormTransaction").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Powerup$2, "ResourcesSystemPowerUp").$$render($$result, { resource: "cpu" }, {}, {})}`;
    }
  })}</div></div>`;
});
const Rex$2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_activeSession;
  let $cost, $$unsubscribe_cost;
  let $activeBlockchain, $$unsubscribe_activeBlockchain;
  let $amount, $$unsubscribe_amount;
  let $systemToken, $$unsubscribe_systemToken;
  $$unsubscribe_activeSession = subscribe(activeSession, (value) => value);
  $$unsubscribe_activeBlockchain = subscribe(activeBlockchain, (value) => $activeBlockchain = value);
  $$unsubscribe_systemToken = subscribe(systemToken, (value) => $systemToken = value);
  getContext("transaction");
  let { resource = "cpu" } = $$props;
  const unit = resource === "cpu" ? "ms" : "kb";
  let amount = writable("");
  $$unsubscribe_amount = subscribe(amount, (value) => $amount = value);
  let error;
  const { REX } = ChainFeatures;
  const cost = derived([activeBlockchain, amount, rexPrice], ([$activeBlockchain2, $amount2, $rexPrice]) => {
    if ($activeBlockchain2 && $rexPrice) {
      return Asset$1.from(Number($rexPrice.value) * Number($amount2), $activeBlockchain2.coreTokenSymbol);
    }
  });
  $$unsubscribe_cost = subscribe(cost, (value) => $cost = value);
  const field = derived([currentAccount], ([$currentAccount]) => {
    if ($currentAccount && $currentAccount.self_delegated_bandwidth) {
      switch (resource) {
        case "net": {
          return $currentAccount.net_limit.max;
        }
        case "cpu":
        default: {
          return $currentAccount.cpu_limit.max;
        }
      }
    }
    return void 0;
  });
  if ($$props.resource === void 0 && $$bindings.resource && resource !== void 0)
    $$bindings.resource(resource);
  if ($$props.field === void 0 && $$bindings.field && field !== void 0)
    $$bindings.field(field);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `${validate_component(Segment, "Segment").$$render($$result, { background: "white" }, {}, {
      default: () => {
        return `${($activeBlockchain == null ? void 0 : $activeBlockchain.chainFeatures.has(REX)) ? `${validate_component(Form, "Form").$$render($$result, {}, {}, {
          default: () => {
            return `<p>Amount of ${escape(unit)} to rent from REX.</p>
            ${validate_component(Input, "Input").$$render(
              $$result,
              {
                focus: true,
                fluid: true,
                inputmode: "decimal",
                name: "amount",
                placeholder: `number of ${unit}`,
                value: $amount
              },
              {
                value: ($$value) => {
                  $amount = $$value;
                  $$settled = false;
                }
              },
              {}
            )}
            ${$systemToken ? `${validate_component(Balance, "FormBalance").$$render(
              $$result,
              {
                token: $systemToken,
                balance: systemTokenBalance
              },
              {},
              {}
            )}` : ``}
            ${validate_component(ErrorMessage, "InputErrorMessage").$$render($$result, { errorMessage: error }, {}, {})}
            ${validate_component(Button$2, "Button").$$render(
              $$result,
              {
                fluid: true,
                size: "large",
                formValidation: true
              },
              {},
              {
                default: () => {
                  return `Rent ${escape(Number($amount))} ${escape(unit)} for ${escape($cost)}`;
                }
              }
            )}`;
          }
        })}` : `<p>This feature is unavailable on this blockchain.</p>`}`;
      }
    })}`;
  } while (!$$settled);
  $$unsubscribe_activeSession();
  $$unsubscribe_cost();
  $$unsubscribe_activeBlockchain();
  $$unsubscribe_amount();
  $$unsubscribe_systemToken();
  return $$rendered;
});
const rex_svelte_svelte_type_style_lang$1 = "";
const css$j = {
  code: ".form.svelte-62jp4r,.wrapper.svelte-62jp4r{margin:16px 0}@media only screen and (max-width: 999px){.wrapper.svelte-62jp4r{margin:16px}}",
  map: null
};
const Rex$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$j);
  return `<div class="${"wrapper svelte-62jp4r"}">${validate_component(Cpu$1, "ResourceStateCPU").$$render($$result, { showExtra: true }, {}, {})}
    <div class="${"form svelte-62jp4r"}">${validate_component(Transaction, "FormTransaction").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Rex$2, "ResourcesSystemREX").$$render($$result, { resource: "cpu" }, {}, {})}`;
    }
  })}</div></div>`;
});
const fuel_svelte_svelte_type_style_lang = "";
const css$i = {
  code: ".form.svelte-62jp4r,.wrapper.svelte-62jp4r{margin:16px 0}@media only screen and (max-width: 999px){.wrapper.svelte-62jp4r{margin:16px}}",
  map: null
};
const Fuel = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$i);
  return `<div class="${"wrapper svelte-62jp4r"}">${validate_component(Net$1, "ResourceStateNET").$$render($$result, { showExtra: true }, {}, {})}
    <div class="${"form svelte-62jp4r"}">${validate_component(Transaction, "FormTransaction").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Fuel_1, "ResourcesFuel").$$render($$result, {}, {}, {})}`;
    }
  })}</div></div>`;
});
const powerup_svelte_svelte_type_style_lang = "";
const css$h = {
  code: ".form.svelte-62jp4r,.wrapper.svelte-62jp4r{margin:16px 0}@media only screen and (max-width: 999px){.wrapper.svelte-62jp4r{margin:16px}}",
  map: null
};
const Powerup = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$h);
  return `<div class="${"wrapper svelte-62jp4r"}">${validate_component(Net$1, "ResourceStateNET").$$render($$result, { showExtra: true }, {}, {})}
    <div class="${"form svelte-62jp4r"}">${validate_component(Transaction, "FormTransaction").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Powerup$2, "ResourcesSystemPowerUp").$$render($$result, { resource: "net" }, {}, {})}`;
    }
  })}</div></div>`;
});
const rex_svelte_svelte_type_style_lang = "";
const css$g = {
  code: ".form.svelte-62jp4r,.wrapper.svelte-62jp4r{margin:16px 0}@media only screen and (max-width: 999px){.wrapper.svelte-62jp4r{margin:16px}}",
  map: null
};
const Rex = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$g);
  return `<div class="${"wrapper svelte-62jp4r"}">${validate_component(Net$1, "ResourceStateNET").$$render($$result, { showExtra: true }, {}, {})}
    <div class="${"form svelte-62jp4r"}">${validate_component(Transaction, "FormTransaction").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Rex$2, "ResourcesSystemREX").$$render($$result, { resource: "net" }, {}, {})}`;
    }
  })}</div></div>`;
});
const Staking_1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_amountCPU;
  let $$unsubscribe_amountNET;
  let $$unsubscribe_activeSession;
  let $activeBlockchain, $$unsubscribe_activeBlockchain;
  let $cpu, $$unsubscribe_cpu;
  let $net, $$unsubscribe_net;
  let $systemToken, $$unsubscribe_systemToken;
  $$unsubscribe_activeSession = subscribe(activeSession, (value) => value);
  $$unsubscribe_activeBlockchain = subscribe(activeBlockchain, (value) => $activeBlockchain = value);
  $$unsubscribe_systemToken = subscribe(systemToken, (value) => $systemToken = value);
  getContext("transaction");
  let { resource = "cpu" } = $$props;
  let error;
  let cpu = writable("");
  $$unsubscribe_cpu = subscribe(cpu, (value) => $cpu = value);
  let net = writable("");
  $$unsubscribe_net = subscribe(net, (value) => $net = value);
  const { Staking: Staking2 } = ChainFeatures;
  const amountCPU = derived(cpu, ($cpu2) => {
    let amount = parseFloat($cpu2);
    if (isNaN(amount)) {
      amount = 0;
    }
    return Asset$1.fromFloat(amount, $activeBlockchain.coreTokenSymbol);
  });
  $$unsubscribe_amountCPU = subscribe(amountCPU, (value) => value);
  const amountNET = derived(net, ($net2) => {
    let amount = parseFloat($net2);
    if (isNaN(amount)) {
      amount = 0;
    }
    return Asset$1.fromFloat(amount, $activeBlockchain.coreTokenSymbol);
  });
  $$unsubscribe_amountNET = subscribe(amountNET, (value) => value);
  const field = derived([currentAccount], ([$currentAccount]) => {
    if ($currentAccount && $currentAccount.self_delegated_bandwidth) {
      return $currentAccount.self_delegated_bandwidth.cpu_weight;
    }
    return void 0;
  });
  if ($$props.resource === void 0 && $$bindings.resource && resource !== void 0)
    $$bindings.resource(resource);
  if ($$props.field === void 0 && $$bindings.field && field !== void 0)
    $$bindings.field(field);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `${validate_component(Segment, "Segment").$$render($$result, { background: "white" }, {}, {
      default: () => {
        return `${($activeBlockchain == null ? void 0 : $activeBlockchain.chainFeatures.has(Staking2)) ? `${validate_component(Form, "Form").$$render($$result, {}, {}, {
          default: () => {
            return `${resource === "cpu" ? `<p>Amount of ${escape($activeBlockchain.coreTokenSymbol.name)} to stake as CPU:</p>
                ${validate_component(Asset, "InputAsset").$$render(
              $$result,
              {
                allowZero: true,
                focus: true,
                fluid: true,
                name: "cpu",
                placeholder: `number of tokens`,
                value: $cpu
              },
              {
                value: ($$value) => {
                  $cpu = $$value;
                  $$settled = false;
                }
              },
              {}
            )}` : ``}
            ${resource === "net" ? `<p>Amount of EOS to stake as NET:</p>
                ${validate_component(Asset, "InputAsset").$$render(
              $$result,
              {
                allowZero: true,
                focus: true,
                fluid: true,
                name: "net",
                placeholder: `number of tokens`,
                value: $net
              },
              {
                value: ($$value) => {
                  $net = $$value;
                  $$settled = false;
                }
              },
              {}
            )}` : ``}
            ${$systemToken ? `${validate_component(Balance, "FormBalance").$$render(
              $$result,
              {
                token: $systemToken,
                balance: systemTokenBalance
              },
              {},
              {}
            )}` : ``}
            ${validate_component(ErrorMessage, "InputErrorMessage").$$render($$result, { errorMessage: error }, {}, {})}
            ${validate_component(Button$2, "Button").$$render(
              $$result,
              {
                fluid: true,
                size: "large",
                formValidation: true
              },
              {},
              {
                default: () => {
                  return `Stake Tokens`;
                }
              }
            )}`;
          }
        })}
        <ul></ul>` : `<p>This feature is unavailable on this blockchain.</p>`}`;
      }
    })}`;
  } while (!$$settled);
  $$unsubscribe_amountCPU();
  $$unsubscribe_amountNET();
  $$unsubscribe_activeSession();
  $$unsubscribe_activeBlockchain();
  $$unsubscribe_cpu();
  $$unsubscribe_net();
  $$unsubscribe_systemToken();
  return $$rendered;
});
const staking_svelte_svelte_type_style_lang$1 = "";
const css$f = {
  code: ".form.svelte-62jp4r,.wrapper.svelte-62jp4r{margin:16px 0}@media only screen and (max-width: 999px){.wrapper.svelte-62jp4r{margin:16px}}",
  map: null
};
const Staking$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$f);
  return `<div class="${"wrapper svelte-62jp4r"}">${validate_component(Cpu$1, "ResourceStateCPU").$$render($$result, { showExtra: true }, {}, {})}
    <div class="${"form svelte-62jp4r"}">${validate_component(Transaction, "FormTransaction").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Staking_1, "ResourcesStaking").$$render($$result, { resource: "cpu" }, {}, {})}`;
    }
  })}</div></div>`;
});
const staking_svelte_svelte_type_style_lang = "";
const css$e = {
  code: ".form.svelte-62jp4r,.wrapper.svelte-62jp4r{margin:16px 0}@media only screen and (max-width: 999px){.wrapper.svelte-62jp4r{margin:16px}}",
  map: null
};
const Staking = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$e);
  return `<div class="${"wrapper svelte-62jp4r"}">${validate_component(Net$1, "ResourceStateNET").$$render($$result, { showExtra: true }, {}, {})}
    <div class="${"form svelte-62jp4r"}">${validate_component(Transaction, "FormTransaction").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Staking_1, "ResourcesStaking").$$render($$result, { resource: "net" }, {}, {})}`;
    }
  })}</div></div>`;
});
const Resources = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $activeBlockchain, $$unsubscribe_activeBlockchain;
  let $activeSession, $$unsubscribe_activeSession;
  let $enabled, $$unsubscribe_enabled;
  $$unsubscribe_activeBlockchain = subscribe(activeBlockchain, (value) => $activeBlockchain = value);
  $$unsubscribe_activeSession = subscribe(activeSession, (value) => $activeSession = value);
  const enabled = derived(activeBlockchain, ($activeBlockchain2) => {
    if ($activeBlockchain2) {
      return Array.from($activeBlockchain2.chainFeatures).some((r) => resourceFeatures.includes(r));
    }
    return false;
  });
  $$unsubscribe_enabled = subscribe(enabled, (value) => $enabled = value);
  $$unsubscribe_activeBlockchain();
  $$unsubscribe_activeSession();
  $$unsubscribe_enabled();
  return `${$activeBlockchain ? `${validate_component(Page$1, "Page").$$render(
    $$result,
    {
      title: "Network Resources",
      subtitle: String($activeSession == null ? void 0 : $activeSession.auth.actor)
    },
    {},
    {
      default: () => {
        return `${$enabled ? `${validate_component(Route, "Route").$$render($$result, { path: "/" }, {}, {
          default: () => {
            return `${validate_component(Pages, "ResourcesOverview").$$render($$result, {}, {}, {})}`;
          }
        })}
            
            ${validate_component(Route, "Route").$$render($$result, { path: "/cpu" }, {}, {
          default: () => {
            return `${validate_component(Cpu, "ResourcesOverviewCpu").$$render($$result, {}, {}, {})}`;
          }
        })}
            ${validate_component(Route, "Route").$$render($$result, { path: "/cpu/fuel" }, {}, {
          default: () => {
            return `${validate_component(Fuel$1, "ResourcesCPUFuel").$$render($$result, {}, {}, {})}`;
          }
        })}
            ${validate_component(Route, "Route").$$render($$result, { path: "/cpu/powerup" }, {}, {
          default: () => {
            return `${validate_component(Powerup$1, "ResourcesCPUPowerUp").$$render($$result, {}, {}, {})}`;
          }
        })}
            ${validate_component(Route, "Route").$$render($$result, { path: "/cpu/rex" }, {}, {
          default: () => {
            return `${validate_component(Rex$1, "ResourcesCPUREX").$$render($$result, {}, {}, {})}`;
          }
        })}
            
            ${validate_component(Route, "Route").$$render($$result, { path: "/net" }, {}, {
          default: () => {
            return `${validate_component(Net, "ResourcesOverviewNet").$$render($$result, {}, {}, {})}`;
          }
        })}
            ${validate_component(Route, "Route").$$render($$result, { path: "/net/fuel" }, {}, {
          default: () => {
            return `${validate_component(Fuel, "ResourcesNETFuel").$$render($$result, {}, {}, {})}`;
          }
        })}
            ${validate_component(Route, "Route").$$render($$result, { path: "/net/powerup" }, {}, {
          default: () => {
            return `${validate_component(Powerup, "ResourcesNETPowerUp").$$render($$result, {}, {}, {})}`;
          }
        })}
            ${validate_component(Route, "Route").$$render($$result, { path: "/net/rex" }, {}, {
          default: () => {
            return `${validate_component(Rex, "ResourcesNETREX").$$render($$result, {}, {}, {})}`;
          }
        })}
            
            ${validate_component(Route, "Route").$$render($$result, { path: "/ram/buy" }, {}, {
          default: () => {
            return `${validate_component(Buy, "ResourcesRAMBuy").$$render($$result, {}, {}, {})}`;
          }
        })}
            ${validate_component(Route, "Route").$$render($$result, { path: "/ram/sell" }, {}, {
          default: () => {
            return `${validate_component(Sell, "ResourcesRAMSell").$$render($$result, {}, {}, {})}`;
          }
        })}
            
            ${validate_component(Route, "Route").$$render($$result, { path: "/cpu/stake" }, {}, {
          default: () => {
            return `${validate_component(Staking$1, "ResourcesCPUStaking").$$render($$result, {}, {}, {})}`;
          }
        })}
            ${validate_component(Route, "Route").$$render($$result, { path: "/net/stake" }, {}, {
          default: () => {
            return `${validate_component(Staking, "ResourcesNETStaking").$$render($$result, {}, {}, {})}`;
          }
        })}` : `<p>Resource management not available on the ${escape($activeBlockchain.name)} blockchain.</p>
            ${validate_component(Button$2, "Button").$$render($$result, { href: "/" }, {}, {
          default: () => {
            return `Back to Dashboard`;
          }
        })}`}`;
      }
    }
  )}` : ``}`;
});
const buttons_svelte_svelte_type_style_lang = "";
const css$d = {
  code: "div.svelte-1sn9wtn{display:flex;margin:16px 0;margin-left:-8px}div.svelte-1sn9wtn>*{margin-bottom:8px;margin-left:8px}p.svelte-1sn9wtn{border-top:1px solid black;font-size:1.25em;font-weight:bold;padding:2em}.overunder.svelte-1sn9wtn{flex-direction:column}",
  map: null
};
const Buttons = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$d);
  return `<p class="${"svelte-1sn9wtn"}">Standard</p>
<div class="${"svelte-1sn9wtn"}">${validate_component(Button$2, "Button").$$render($$result, {}, {}, {
    default: () => {
      return `Standard`;
    }
  })}
    ${validate_component(Button$2, "Button").$$render($$result, { style: "primary" }, {}, {
    default: () => {
      return `Primary`;
    }
  })}
    ${validate_component(Button$2, "Button").$$render($$result, { style: "secondary" }, {}, {
    default: () => {
      return `Secondary`;
    }
  })}
    ${validate_component(Button$2, "Button").$$render($$result, { style: "tertiary" }, {}, {
    default: () => {
      return `Tertiary`;
    }
  })}
    ${validate_component(Button$2, "Button").$$render($$result, { style: "no-frame" }, {}, {
    default: () => {
      return `No Frame`;
    }
  })}
    ${validate_component(Button$2, "Button").$$render($$result, { style: "effect" }, {}, {
    default: () => {
      return `Effect`;
    }
  })}
    ${validate_component(Button$2, "Button").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Text, "Text").$$render($$result, {}, {}, {
        default: () => {
          return `Icon`;
        }
      })}
        ${validate_component(Icon, "Icon").$$render($$result, { name: "external-link" }, {}, {})}`;
    }
  })}
    ${validate_component(Button$2, "Button").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Icon, "Icon").$$render($$result, { name: "external-link" }, {}, {})}
        ${validate_component(Text, "Text").$$render($$result, {}, {}, {
        default: () => {
          return `Icon left`;
        }
      })}`;
    }
  })}
    ${validate_component(Button$2, "Button").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Icon, "Icon").$$render($$result, { name: "bell" }, {}, {})}
        ${validate_component(Text, "Text").$$render($$result, {}, {}, {
        default: () => {
          return `Icon`;
        }
      })}
        ${validate_component(Icon, "Icon").$$render($$result, { name: "activity" }, {}, {})}
        ${validate_component(Text, "Text").$$render($$result, {}, {}, {
        default: () => {
          return `everywhere`;
        }
      })}
        ${validate_component(Icon, "Icon").$$render($$result, { name: "octagon" }, {}, {})}`;
    }
  })}</div>

<p class="${"svelte-1sn9wtn"}">Large</p>
<div class="${"svelte-1sn9wtn"}">${validate_component(Button$2, "Button").$$render($$result, { size: "large" }, {}, {
    default: () => {
      return `Large`;
    }
  })}
    ${validate_component(Button$2, "Button").$$render($$result, { size: "large", style: "primary" }, {}, {
    default: () => {
      return `Large Primary`;
    }
  })}
    ${validate_component(Button$2, "Button").$$render($$result, { size: "large", style: "secondary" }, {}, {
    default: () => {
      return `Secondary`;
    }
  })}
    ${validate_component(Button$2, "Button").$$render($$result, { size: "large", style: "tertiary" }, {}, {
    default: () => {
      return `Tertiary`;
    }
  })}
    ${validate_component(Button$2, "Button").$$render($$result, { size: "large", style: "no-frame" }, {}, {
    default: () => {
      return `No Frame`;
    }
  })}
    ${validate_component(Button$2, "Button").$$render($$result, { size: "large", style: "effect" }, {}, {
    default: () => {
      return `Effect`;
    }
  })}
    ${validate_component(Button$2, "Button").$$render($$result, { size: "large" }, {}, {
    default: () => {
      return `${validate_component(Icon, "Icon").$$render($$result, { name: "unlock" }, {}, {})}
        ${validate_component(Text, "Text").$$render($$result, {}, {}, {
        default: () => {
          return `Icon here`;
        }
      })}`;
    }
  })}
    ${validate_component(Button$2, "Button").$$render($$result, { size: "large" }, {}, {
    default: () => {
      return `${validate_component(Text, "Text").$$render($$result, {}, {}, {
        default: () => {
          return `Icon there`;
        }
      })}
        ${validate_component(Icon, "Icon").$$render($$result, { name: "external-link" }, {}, {})}`;
    }
  })}
    ${validate_component(Button$2, "Button").$$render($$result, { size: "large" }, {}, {
    default: () => {
      return `${validate_component(Icon, "Icon").$$render($$result, { name: "bell" }, {}, {})}
        ${validate_component(Text, "Text").$$render($$result, {}, {}, {
        default: () => {
          return `Icon`;
        }
      })}
        ${validate_component(Icon, "Icon").$$render($$result, { name: "activity" }, {}, {})}
        ${validate_component(Text, "Text").$$render($$result, {}, {}, {
        default: () => {
          return `everywhere`;
        }
      })}
        ${validate_component(Icon, "Icon").$$render($$result, { name: "octagon" }, {}, {})}`;
    }
  })}</div>

<p class="${"svelte-1sn9wtn"}">Disabled</p>
<div class="${"svelte-1sn9wtn"}">${validate_component(Button$2, "Button").$$render($$result, { disabled: true, size: "large" }, {}, {
    default: () => {
      return `Disabled`;
    }
  })}
    ${validate_component(Button$2, "Button").$$render(
    $$result,
    {
      disabled: true,
      style: "primary",
      size: "large"
    },
    {},
    {
      default: () => {
        return `Disabled Primary`;
      }
    }
  )}</div>

<p class="${"svelte-1sn9wtn"}">Flexbox</p>
<div class="${"overunder svelte-1sn9wtn"}">${validate_component(Button$2, "Button").$$render($$result, { size: "large" }, {}, {
    default: () => {
      return `Flexy`;
    }
  })}
    ${validate_component(Button$2, "Button").$$render($$result, { size: "large", style: "primary" }, {}, {
    default: () => {
      return `Flexy Primary`;
    }
  })}
    ${validate_component(Button$2, "Button").$$render($$result, { size: "large", style: "primary" }, {}, {
    default: () => {
      return `${validate_component(Icon, "Icon").$$render($$result, { name: "layout" }, {}, {})}
        ${validate_component(Text, "Text").$$render($$result, {}, {}, {
        default: () => {
          return `Flexy with icon`;
        }
      })}`;
    }
  })}
    ${validate_component(Button$2, "Button").$$render($$result, { size: "large", style: "primary" }, {}, {
    default: () => {
      return `${validate_component(Icon, "Icon").$$render($$result, { name: "tool" }, {}, {})}
        ${validate_component(Text, "Text").$$render($$result, {}, {}, {
        default: () => {
          return `Flexing`;
        }
      })}
        ${validate_component(Icon, "Icon").$$render($$result, { name: "trash" }, {}, {})}
        ${validate_component(Text, "Text").$$render($$result, {}, {}, {
        default: () => {
          return `my`;
        }
      })}
        ${validate_component(Icon, "Icon").$$render($$result, { name: "layout" }, {}, {})}
        ${validate_component(Text, "Text").$$render($$result, {}, {}, {
        default: () => {
          return `icons`;
        }
      })}
        ${validate_component(Icon, "Icon").$$render($$result, { name: "twitter" }, {}, {})}`;
    }
  })}</div>`;
});
function validateAccountLength(value) {
  if (value.length > 12) {
    throw {
      valid: false,
      message: "Should be 12 characters or less."
    };
  }
}
const Account = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { name = "" } = $$props;
  let { fluid = false } = $$props;
  let { focus = false } = $$props;
  let { inputmode = "" } = $$props;
  let { placeholder = void 0 } = $$props;
  let { value = "" } = $$props;
  let { errorMessage = void 0 } = $$props;
  let { isValid = (value2) => {
    try {
      validatePresence(value2);
      validateAccountLength(value2);
    } catch (errorObject) {
      errorMessage = errorObject.message;
      return false;
    }
    errorMessage = void 0;
    return true;
  } } = $$props;
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.fluid === void 0 && $$bindings.fluid && fluid !== void 0)
    $$bindings.fluid(fluid);
  if ($$props.focus === void 0 && $$bindings.focus && focus !== void 0)
    $$bindings.focus(focus);
  if ($$props.inputmode === void 0 && $$bindings.inputmode && inputmode !== void 0)
    $$bindings.inputmode(inputmode);
  if ($$props.placeholder === void 0 && $$bindings.placeholder && placeholder !== void 0)
    $$bindings.placeholder(placeholder);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.errorMessage === void 0 && $$bindings.errorMessage && errorMessage !== void 0)
    $$bindings.errorMessage(errorMessage);
  if ($$props.isValid === void 0 && $$bindings.isValid && isValid !== void 0)
    $$bindings.isValid(isValid);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `${validate_component(Labelled, "InputLabelled").$$render(
      $$result,
      {
        name,
        fluid,
        focus,
        inputmode,
        placeholder,
        isValid,
        errorMessage,
        value
      },
      {
        value: ($$value) => {
          value = $$value;
          $$settled = false;
        }
      },
      {}
    )}`;
  } while (!$$settled);
  return $$rendered;
});
const forms_svelte_svelte_type_style_lang = "";
const css$c = {
  code: "div.svelte-1xn0kow{margin:16px 0}",
  map: null
};
const Forms = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const numberValidityCheck = (v2) => parseInt(v2, 10) > 0;
  $$result.css.add(css$c);
  return `<div class="${"svelte-1xn0kow"}"><h2>Empty Fields</h2>
    ${validate_component(Form, "Form").$$render($$result, {}, {}, {
    default: () => {
      return `<p>Enter a number greater than 0</p>
        ${validate_component(Input, "Input").$$render(
        $$result,
        {
          name: "number",
          isValid: numberValidityCheck
        },
        {},
        {}
      )}
        <p>Enter an account name</p>
        ${validate_component(Account, "InputAccount").$$render($$result, { name: "account" }, {}, {})}
        <p>This button will always work:</p>
        ${validate_component(Button$2, "Button").$$render($$result, {}, {}, {})}
        <p>The button will only enable when the form is all valid:</p>
        ${validate_component(Button$2, "Button").$$render($$result, { formValidation: true }, {}, {})}`;
    }
  })}</div>

<div class="${"svelte-1xn0kow"}"><h2>Prefilled Fields</h2>
    ${validate_component(Form, "Form").$$render($$result, {}, {}, {
    default: () => {
      return `<p>Enter a number greater than 0</p>
        ${validate_component(Input, "Input").$$render(
        $$result,
        {
          name: "number",
          isValid: numberValidityCheck,
          value: "1"
        },
        {},
        {}
      )}
        <p>Enter an account name</p>
        ${validate_component(Account, "InputAccount").$$render($$result, { name: "account", value: "teamgreymass" }, {}, {})}
        <p>The button will only enable when the form is all valid:</p>
        ${validate_component(Button$2, "Button").$$render($$result, { formValidation: true }, {}, {})}`;
    }
  })}</div>`;
});
const icons_svelte_svelte_type_style_lang = "";
const css$b = {
  code: "h2.svelte-ocddyi{margin-top:40px}",
  map: null
};
const Icons = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$b);
  return `<div><p>tiny</p>
    ${validate_component(Icon, "Icon").$$render($$result, { name: "anchor", size: "tiny" }, {}, {})}
    <p>small</p>
    ${validate_component(Icon, "Icon").$$render($$result, { name: "anchor", size: "small" }, {}, {})}
    <p>default</p>
    ${validate_component(Icon, "Icon").$$render($$result, { name: "anchor" }, {}, {})}
    <p>medium</p>
    ${validate_component(Icon, "Icon").$$render($$result, { name: "anchor", size: "medium" }, {}, {})}
    <p>large</p>
    ${validate_component(Icon, "Icon").$$render($$result, { name: "anchor", size: "large" }, {}, {})}
    <p>huge</p>
    ${validate_component(Icon, "Icon").$$render($$result, { name: "anchor", size: "huge" }, {}, {})}
    <p>massive</p>
    ${validate_component(Icon, "Icon").$$render($$result, { name: "anchor", size: "massive" }, {}, {})}

    <h2 class="${"svelte-ocddyi"}">Image Component with fallback</h2>
    ${validate_component(Image, "Image").$$render(
    $$result,
    {
      fallbackSrc: "https://www.bloks.io/img/chains/eos.png",
      src: "http://random.com/test.image",
      width: "30"
    },
    {},
    {}
  )}</div>`;
});
const inputs_svelte_svelte_type_style_lang = "";
const css$a = {
  code: "div.svelte-bte6jp{margin:16px 0}div.fullWidthContainer.svelte-bte6jp{width:500px}",
  map: null
};
const Inputs = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $tokens, $$unsubscribe_tokens;
  $$unsubscribe_tokens = subscribe(tokens, (value) => $tokens = value);
  let examples = {
    "example-on-changed": { valid: true, value: "" },
    "example-is-valid": { valid: false, value: "0" }
  };
  const numberValidityCheck = (v2) => parseInt(v2, 10) > 0;
  let selectedToken = $tokens[0] || createTokenFromChainId(ChainId.from("aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906"));
  const handleTokenSelect = (token) => {
    selectedToken = token;
  };
  $$result.css.add(css$a);
  $$unsubscribe_tokens();
  return `<div class="${"svelte-bte6jp"}"><p>Default</p>
    ${validate_component(Input, "Input").$$render($$result, {}, {}, {})}</div>
<div class="${"fullWidthContainer svelte-bte6jp"}"><p>Full Width</p>
    ${validate_component(Input, "Input").$$render($$result, { fluid: true }, {}, {})}</div>
<div class="${"svelte-bte6jp"}"><p>Disabled</p>
    ${validate_component(Input, "Input").$$render($$result, { disabled: true }, {}, {})}</div>
<div class="${"svelte-bte6jp"}"><p>Placeholder</p>
    ${validate_component(Input, "Input").$$render($$result, { placeholder: "Testing" }, {}, {})}</div>
<div class="${"svelte-bte6jp"}"><p>Default Value</p>
    ${validate_component(Input, "Input").$$render($$result, { value: "Default Value" }, {}, {})}</div>
<div class="${"svelte-bte6jp"}"><p>onChange Callback</p>
    ${validate_component(Input, "Input").$$render($$result, { name: "example-on-changed" }, {}, {})}
    <p>Value: ${escape(examples["example-on-changed"].value)}</p>
    <p>Is Valid: ${escape(examples["example-on-changed"].valid)}</p></div>
<div class="${"svelte-bte6jp"}"><p>Custom isValid Call (number &gt; 0)</p>
    ${validate_component(Input, "Input").$$render(
    $$result,
    {
      name: "example-is-valid",
      isValid: numberValidityCheck
    },
    {},
    {}
  )}
    <p>Value: ${escape(examples["example-is-valid"].value)}</p>
    <p>Is Valid: ${escape(examples["example-is-valid"].valid)}</p></div>
<div class="${"svelte-bte6jp"}"><p>Token Selector</p>
    ${validate_component(Selector, "TokenSelector").$$render(
    $$result,
    {
      defaultToken: selectedToken,
      onTokenSelect: handleTokenSelect
    },
    {},
    {}
  )}

    <p>Selected Token: ${escape(selectedToken.name)}</p></div>`;
});
const progress_svelte_svelte_type_style_lang = "";
const css$9 = {
  code: "p.svelte-1fc2hl3{margin-bottom:10px}",
  map: null
};
const Progress_1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let percent = 50;
  $$result.css.add(css$9);
  return `<p class="${"svelte-1fc2hl3"}">${validate_component(Progress, "Progress").$$render($$result, { percent }, {}, {})}</p>
<p class="${"svelte-1fc2hl3"}">${validate_component(Button$2, "Button").$$render($$result, {}, {}, {
    default: () => {
      return `Increase`;
    }
  })}
    ${validate_component(Button$2, "Button").$$render($$result, {}, {}, {
    default: () => {
      return `Decrease`;
    }
  })}</p>`;
});
const Trigger = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $display, $$unsubscribe_display;
  let { content = "Open Modal" } = $$props;
  let { disabled = false } = $$props;
  let { display = writable(false) } = $$props;
  $$unsubscribe_display = subscribe(display, (value) => $display = value);
  let close = () => set_store_value(display, $display = false, $display);
  if ($$props.content === void 0 && $$bindings.content && content !== void 0)
    $$bindings.content(content);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.display === void 0 && $$bindings.display && display !== void 0)
    $$bindings.display(display);
  $$unsubscribe_display();
  return `${validate_component(Button$2, "Button").$$render($$result, { disabled }, {}, {
    default: () => {
      return `${escape(content)}`;
    }
  })}

${$display ? `${slots.default ? slots.default({ display, close }) : ``}` : ``}`;
});
const modals_svelte_svelte_type_style_lang = "";
const css$8 = {
  code: "div.svelte-1cwzysk,h2.svelte-1cwzysk{padding-bottom:20px}",
  map: null
};
const Modals = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $displayExternallyControlled, $$unsubscribe_displayExternallyControlled = noop, $$subscribe_displayExternallyControlled = () => ($$unsubscribe_displayExternallyControlled(), $$unsubscribe_displayExternallyControlled = subscribe(displayExternallyControlled, ($$value) => $displayExternallyControlled = $$value), displayExternallyControlled);
  let $displaySmallModal, $$unsubscribe_displaySmallModal;
  let displayExternallyControlled = writable(false);
  $$subscribe_displayExternallyControlled();
  let displaySmallModal = writable(false);
  $$unsubscribe_displaySmallModal = subscribe(displaySmallModal, (value) => $displaySmallModal = value);
  $$result.css.add(css$8);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `<div class="${"svelte-1cwzysk"}"><div class="${"svelte-1cwzysk"}"><div class="${"svelte-1cwzysk"}"><h2 class="${"svelte-1cwzysk"}">Independent Modals</h2>
            <div class="${"svelte-1cwzysk"}">${validate_component(Button$2, "Button").$$render($$result, {}, {}, {
      default: () => {
        return `Open Small Modal`;
      }
    })}

                ${$displaySmallModal ? `${validate_component(Modal, "Modal").$$render(
      $$result,
      {
        size: "small",
        display: displaySmallModal
      },
      {},
      {
        default: () => {
          return `<p>This is where your modal body goes.</p>`;
        }
      }
    )}` : ``}</div>
            <div class="${"svelte-1cwzysk"}">${validate_component(Button$2, "Button").$$render($$result, {}, {}, {
      default: () => {
        return `Open Externally Controlled Modal`;
      }
    })}
                Opened: ${escape($displayExternallyControlled)}

                ${validate_component(Modal, "Modal").$$render(
      $$result,
      {
        header: "Test Header",
        display: displayExternallyControlled
      },
      {
        display: ($$value) => {
          displayExternallyControlled = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `<p>This is where your modal body goes.</p>`;
        }
      }
    )}</div></div>

        <div class="${"svelte-1cwzysk"}"><h2 class="${"svelte-1cwzysk"}">Modals wrapped in Triggers</h2>

            ${validate_component(Trigger, "ModalTrigger").$$render($$result, { content: "Basic" }, {}, {
      default: ({ display }) => {
        return `${validate_component(Modal, "Modal").$$render($$result, { display }, {}, {
          default: () => {
            return `<p>This was from a ModalTrigger.</p>`;
          }
        })}`;
      }
    })}

            ${validate_component(Trigger, "ModalTrigger").$$render($$result, { content: "With a header" }, {}, {
      default: ({ display }) => {
        return `${validate_component(Modal, "Modal").$$render(
          $$result,
          {
            header: "A different test header",
            display
          },
          {},
          {
            default: () => {
              return `<p>This is where your modal body goes.</p>`;
            }
          }
        )}`;
      }
    })}

            ${validate_component(Trigger, "ModalTrigger").$$render($$result, { content: "Large!" }, {}, {
      default: ({ display }) => {
        return `${validate_component(Modal, "Modal").$$render($$result, { size: "large", display }, {}, {
          default: () => {
            return `<p>This is where your modal body goes.</p>`;
          }
        })}`;
      }
    })}

            ${validate_component(Trigger, "ModalTrigger").$$render($$result, { content: "No close button" }, {}, {
      default: ({ display }) => {
        return `${validate_component(Modal, "Modal").$$render($$result, { hideCloseButton: true, display }, {}, {
          default: () => {
            return `<p>This is where your modal body goes.</p>`;
          }
        })}`;
      }
    })}

            ${validate_component(Trigger, "ModalTrigger").$$render($$result, { content: "No dimmer close" }, {}, {
      default: ({ display }) => {
        return `${validate_component(Modal, "Modal").$$render($$result, { disableDimmerClose: true, display }, {}, {
          default: () => {
            return `<p>This is where your modal body goes.</p>`;
          }
        })}`;
      }
    })}

            ${validate_component(Trigger, "ModalTrigger").$$render($$result, { content: "Disabled", disabled: true }, {}, {
      default: ({ display }) => {
        return `${validate_component(Modal, "Modal").$$render($$result, { disableDimmerClose: true, display }, {}, {
          default: () => {
            return `<p>This is where your modal body goes.</p>`;
          }
        })}`;
      }
    })}

            ${validate_component(Trigger, "ModalTrigger").$$render(
      $$result,
      {
        content: "Close when performing custom action"
      },
      {},
      {
        default: ({ display, close }) => {
          return `${validate_component(Modal, "Modal").$$render(
            $$result,
            {
              disableDimmerClose: true,
              hideCloseButton: true,
              display
            },
            {},
            {
              default: () => {
                return `<p>This is where your modal body goes.</p>
                    ${validate_component(Button$2, "Button").$$render($$result, {}, {}, {
                  default: () => {
                    return `Callback &amp; Close!`;
                  }
                })}`;
              }
            }
          )}`;
        }
      }
    )}</div></div></div>`;
  } while (!$$settled);
  $$unsubscribe_displayExternallyControlled();
  $$unsubscribe_displaySmallModal();
  return $$rendered;
});
const segments_svelte_svelte_type_style_lang = "";
const css$7 = {
  code: "h2.svelte-s1r74q{margin:20px 0}",
  map: null
};
const Segments = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$7);
  return `<h2 class="${"svelte-s1r74q"}">Segment</h2>

${validate_component(Segment, "Segment").$$render($$result, {}, {}, {
    default: () => {
      return `<p>Some test content within a segment.</p>`;
    }
  })}

<h2 class="${"svelte-s1r74q"}">Segment Group</h2>

<p>Two Elements</p>

${validate_component(Group, "SegmentGroup").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Segment, "Segment").$$render($$result, {}, {}, {
        default: () => {
          return `Left`;
        }
      })}
    ${validate_component(Segment, "Segment").$$render($$result, {}, {}, {
        default: () => {
          return `Right`;
        }
      })}`;
    }
  })}

<p>Three Elements</p>

${validate_component(Group, "SegmentGroup").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Segment, "Segment").$$render($$result, {}, {}, {
        default: () => {
          return `One`;
        }
      })}
    ${validate_component(Segment, "Segment").$$render($$result, {}, {}, {
        default: () => {
          return `Two`;
        }
      })}
    ${validate_component(Segment, "Segment").$$render($$result, {}, {}, {
        default: () => {
          return `Three`;
        }
      })}`;
    }
  })}

<p>Eight Elements</p>

${validate_component(Group, "SegmentGroup").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Segment, "Segment").$$render($$result, {}, {}, {
        default: () => {
          return `One`;
        }
      })}
    ${validate_component(Segment, "Segment").$$render($$result, {}, {}, {
        default: () => {
          return `Two`;
        }
      })}
    ${validate_component(Segment, "Segment").$$render($$result, {}, {}, {
        default: () => {
          return `Three`;
        }
      })}
    ${validate_component(Segment, "Segment").$$render($$result, {}, {}, {
        default: () => {
          return `Four`;
        }
      })}
    ${validate_component(Segment, "Segment").$$render($$result, {}, {}, {
        default: () => {
          return `Five`;
        }
      })}
    ${validate_component(Segment, "Segment").$$render($$result, {}, {}, {
        default: () => {
          return `Six`;
        }
      })}
    ${validate_component(Segment, "Segment").$$render($$result, {}, {}, {
        default: () => {
          return `Seven`;
        }
      })}
    ${validate_component(Segment, "Segment").$$render($$result, {}, {}, {
        default: () => {
          return `Eight`;
        }
      })}`;
    }
  })}

<h2 class="${"svelte-s1r74q"}">Vertical Segment Group</h2>

<p>Two Elements</p>

${validate_component(Group, "SegmentGroup").$$render($$result, { vertical: true }, {}, {
    default: () => {
      return `${validate_component(Segment, "Segment").$$render($$result, {}, {}, {
        default: () => {
          return `Top`;
        }
      })}
    ${validate_component(Segment, "Segment").$$render($$result, {}, {}, {
        default: () => {
          return `Bottom`;
        }
      })}`;
    }
  })}

<p>Three Elements</p>

${validate_component(Group, "SegmentGroup").$$render($$result, { vertical: true }, {}, {
    default: () => {
      return `${validate_component(Segment, "Segment").$$render($$result, {}, {}, {
        default: () => {
          return `One`;
        }
      })}
    ${validate_component(Segment, "Segment").$$render($$result, {}, {}, {
        default: () => {
          return `Two`;
        }
      })}
    ${validate_component(Segment, "Segment").$$render($$result, {}, {}, {
        default: () => {
          return `Three`;
        }
      })}`;
    }
  })}`;
});
const txFollower_svelte_svelte_type_style_lang = "";
const css$6 = {
  code: "input.svelte-uo30ul{font-family:monospace;width:64ch}",
  map: null
};
const Tx_follower = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let chain;
  let selectedChain = chains[0].id;
  let id = "a35a56175791292b51d8a8dbdf271d01aba76893dc55d06eaff73f36ef569d79";
  $$result.css.add(css$6);
  chain = chains.find(({ id: id2 }) => selectedChain === id2);
  getClient(chain);
  return `<select name="${"chain"}">${each(chains, (c) => {
    return `<option${add_attribute("value", c.id, 0)}>${escape(c.name)}</option>`;
  })}</select>
txid <input class="${"svelte-uo30ul"}"${add_attribute("value", id, 0)}>
<button>\u{1F501}</button> <br>
<br>

${validate_component(Tx_follower$1, "TxFollower").$$render($$result, { id, chain }, {}, {})}`;
});
const Qrcode = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div>${validate_component(Qrcode$1, "QRCode").$$render($$result, { data: "nani" }, {}, {})}</div>`;
});
const nav_svelte_svelte_type_style_lang = "";
const css$5 = {
  code: "nav.svelte-663ca9 ul.svelte-663ca9{display:inline-flex;flex-wrap:wrap;margin-left:-8px;margin-top:-8px}nav.svelte-663ca9 a.svelte-663ca9{margin-left:8px;margin-top:8px;font-size:13px;font-weight:500;color:var(--main-blue);border-radius:8px;display:block;line-height:32px;background:var(--main-white);padding:0 10px;text-decoration:none;border:1px solid var(--main-grey)}nav.svelte-663ca9 a.svelte-663ca9:hover{border-color:var(--light-blue)}nav.svelte-663ca9 a.svelte-663ca9:active{border-color:var(--main-blue)}nav.svelte-663ca9 a.active{background:var(--main-blue);color:var(--main-white)}",
  map: null
};
const Nav = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $metadata, $$unsubscribe_metadata;
  let { home = void 0 } = $$props;
  let { routes = [] } = $$props;
  const metadata = O();
  $$unsubscribe_metadata = subscribe(metadata, (value) => $metadata = value);
  if ($$props.home === void 0 && $$bindings.home && home !== void 0)
    $$bindings.home(home);
  if ($$props.routes === void 0 && $$bindings.routes && routes !== void 0)
    $$bindings.routes(routes);
  $$result.css.add(css$5);
  $$unsubscribe_metadata();
  return `${validate_component(Route, "Route").$$render($$result, { path: "/*" }, {}, {
    default: () => {
      return `<nav class="${"svelte-663ca9"}"><ul class="${"svelte-663ca9"}">${home ? `<li><a${add_attribute("href", $metadata.pattern, 0)} class="${["svelte-663ca9", $metadata.url === $metadata.pattern ? "active" : ""].join(" ").trim()}">${escape(home)}</a></li>` : ``}
            ${each(routes, (route) => {
        return `<li><a${add_attribute("href", `${$metadata.pattern}/${route.path || ""}`, 0)} class="${"svelte-663ca9"}">${escape(route.name)}</a>
                </li>`;
      })}</ul></nav>`;
    }
  })}`;
});
const index_svelte_svelte_type_style_lang = "";
const css$4 = {
  code: "h1.svelte-xk0orb.svelte-xk0orb{font-size:24px;font-weight:bold;letter-spacing:-0.47px;margin-bottom:16px}header.svelte-xk0orb.svelte-xk0orb{display:flex;flex-direction:column;padding:16px;background-color:var(--main-grey)}.title.svelte-xk0orb.svelte-xk0orb{display:flex;justify-content:space-between}hr.svelte-xk0orb.svelte-xk0orb{margin:0;border-style:solid;color:var(--light-blue)}section.svelte-xk0orb.svelte-xk0orb{margin:16px}section.svelte-xk0orb .component.svelte-xk0orb{margin-bottom:32px}section.svelte-xk0orb .component h2.svelte-xk0orb{font-size:16px;font-weight:600;letter-spacing:-0.18px;margin-bottom:8px}section.svelte-xk0orb .component hr.svelte-xk0orb{margin:8px -8px 16px;border:0;height:1px}",
  map: null
};
const Components = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const routes = [
    {
      name: "Buttons",
      path: "buttons",
      component: Buttons
    },
    {
      name: "Forms",
      path: "forms",
      component: Forms
    },
    {
      name: "Icons",
      path: "icons",
      component: Icons
    },
    {
      name: "Inputs",
      path: "inputs",
      component: Inputs
    },
    {
      name: "Progress Bar",
      path: "progress",
      component: Progress_1
    },
    {
      name: "Modals",
      path: "modals",
      component: Modals
    },
    {
      name: "QR-Code",
      path: "qrcode",
      component: Qrcode
    },
    {
      name: "Segments",
      path: "segment",
      component: Segments
    },
    {
      name: "Transaction Follower",
      path: "txfollower",
      component: Tx_follower,
      excludeFromAll: true
    }
  ];
  $$result.css.add(css$4);
  return `${validate_component(Route, "Route").$$render($$result, { path: "/*" }, {}, {
    default: () => {
      return `<header class="${"svelte-xk0orb"}"><div class="${"title svelte-xk0orb"}"><h1 class="${"svelte-xk0orb"}">Component library \u{1F984}</h1>
            ${validate_component(Mode, "ThemeButton").$$render($$result, {}, {}, {})}</div>
        ${validate_component(Nav, "Nav").$$render($$result, { routes, home: "Overview" }, {}, {})}</header>
    <section class="${"svelte-xk0orb"}">${validate_component(Route, "Route").$$render($$result, { path: "/" }, {}, {
        default: () => {
          return `${each(routes, (route) => {
            return `${!route.excludeFromAll ? `<div class="${"component svelte-xk0orb"}"><h2 class="${"svelte-xk0orb"}">${escape(route.name)}</h2>
                        <hr class="${"svelte-xk0orb"}">
                        ${validate_component(route.component || missing_component, "svelte:component").$$render($$result, {}, {}, {})}
                    </div>` : ``}`;
          })}`;
        }
      })}
        ${each(routes, (route) => {
        return `${validate_component(Route, "Route").$$render($$result, { path: `/${route.path}` }, {}, {
          default: () => {
            return `<div class="${"component svelte-xk0orb"}"><h2 class="${"svelte-xk0orb"}">${escape(route.name)}</h2>
                    <hr class="${"svelte-xk0orb"}">
                    ${validate_component(route.component || missing_component, "svelte:component").$$render($$result, {}, {}, {})}</div>
            `;
          }
        })}`;
      })}</section>`;
    }
  })}`;
});
const loading_svelte_svelte_type_style_lang = "";
const css$3 = {
  code: ".app-loading{--size:60px;position:fixed;top:calc(50% - var(--size) / 2);left:calc(50vw - var(--size) / 2);border-top:3px solid var(--main-blue);border-right:0;animation:app-loading-spin 1.618s linear infinite;height:var(--size);width:var(--size);background:var(--main-white);border-radius:50%}@keyframes app-loading-spin{to{transform:rotate(360deg)}}",
  map: null
};
const Loading = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$3);
  return `<div class="${"app-loading"}"></div>`;
});
const toast_svelte_svelte_type_style_lang = "";
const css$2 = {
  code: ".toast.svelte-egolea{background:var(--main-white);box-shadow:0px 24px 32px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 0px 1px rgba(0, 0, 0, 0.04);border-radius:8px;padding:10px}.darkmode .toast.svelte-egolea{box-shadow:0px 24px 32px rgba(180, 180, 180, 0.04), 0px 16px 24px rgba(180, 180, 180, 0.04), 0px 4px 8px rgba(180, 180, 180, 0.04), 0px 0px 1px rgba(180, 180, 180, 0.04)}header.svelte-egolea{display:flex;justify-content:space-between}.title.svelte-egolea{flex:1;font-weight:700;font-size:12px;line-height:14px;color:var(--main-black)}.close.svelte-egolea{color:var(--main-blue);background:transparent;border:0 none;padding:0;margin:0 0 0 auto}.close.svelte-egolea circle{fill:var(--main-grey);stroke:var(--main-grey);transition:all 0.2s ease-in-out}.close.svelte-egolea line{transition:all 0.2s ease-in-out}.close.svelte-egolea:hover circle{fill:var(--main-white);stroke:var(--main-blue)}.close.svelte-egolea:active circle{fill:var(--main-blue);stroke:var(--main-blue)}.close.svelte-egolea:active line{fill:var(--main-blue);stroke:var(--main-white)}.text.svelte-egolea{font-weight:500;font-size:12px;line-height:14px;color:var(--main-black)}",
  map: null
};
const Toast = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  createEventDispatcher();
  let { dismissible = true } = $$props;
  let { title } = $$props;
  let { message } = $$props;
  if ($$props.dismissible === void 0 && $$bindings.dismissible && dismissible !== void 0)
    $$bindings.dismissible(dismissible);
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  if ($$props.message === void 0 && $$bindings.message && message !== void 0)
    $$bindings.message(message);
  $$result.css.add(css$2);
  return `<section class="${"toast svelte-egolea"}" role="${"alert"}">${dismissible || title ? `<header class="${"svelte-egolea"}"><h3 class="${"title svelte-egolea"}">${escape(title)}</h3>
            ${dismissible ? `<button class="${"close svelte-egolea"}">${validate_component(Icon, "Icon").$$render($$result, { name: "x-circle" }, {}, {})}</button>` : ``}</header>` : ``}
    <p class="${"text svelte-egolea"}">${escape(message)}</p></section>`;
});
const toasts_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: ".toasts.svelte-7sbrza{position:fixed;right:0;bottom:0;width:250px;padding:10px;display:flex;justify-content:center;flex-direction:column}.toast.svelte-7sbrza:not(:last-child){margin-bottom:15px}",
  map: null
};
const Toasts = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $toasts, $$unsubscribe_toasts;
  $$unsubscribe_toasts = subscribe(toasts, (value) => $toasts = value);
  $$result.css.add(css$1);
  $$unsubscribe_toasts();
  return `${$toasts ? `<div class="${"toasts svelte-7sbrza"}">${each($toasts.reverse(), (toast) => {
    return `<div class="${"toast svelte-7sbrza"}">${validate_component(Toast, "Toast").$$render(
      $$result,
      {
        title: toast.title,
        message: toast.message,
        dismissible: toast.dismissible
      },
      {},
      {}
    )}
            </div>`;
  })}</div>` : ``}`;
});
const App_svelte_svelte_type_style_lang = "";
const css = {
  code: '*,*:before,*:after{box-sizing:border-box}html,body,div,span,object,iframe,figure,h1,h2,h3,h4,h5,h6,p,blockquote,pre,a,code,em,img,small,strike,strong,sub,sup,tt,b,u,i,ol,ul,li,fieldset,form,label,table,caption,tbody,tfoot,thead,tr,th,td,main,canvas,embed,footer,header,nav,section,video{margin:0;padding:0;border:0;font-size:100%;font:inherit;vertical-align:baseline}footer,header,nav,section,main{display:block}body{line-height:1}ol,ul{list-style:none}blockquote,q{quotes:none}blockquote:before,blockquote:after,q:before,q:after{content:"";content:none}table{border-collapse:collapse;border-spacing:0}input{-webkit-appearance:none;border-radius:0}@font-face{font-family:"Inter";font-style:normal;font-weight:100;font-display:swap;src:url("/fonts/inter/Inter-Thin.woff2?v=3.19") format("woff2"), url("/fonts/inter/Inter-Thin.woff?v=3.19") format("woff")}@font-face{font-family:"Inter";font-style:italic;font-weight:100;font-display:swap;src:url("/fonts/inter/Inter-ThinItalic.woff2?v=3.19") format("woff2"), url("/fonts/inter/Inter-ThinItalic.woff?v=3.19") format("woff")}@font-face{font-family:"Inter";font-style:normal;font-weight:200;font-display:swap;src:url("/fonts/inter/Inter-ExtraLight.woff2?v=3.19") format("woff2"), url("/fonts/inter/Inter-ExtraLight.woff?v=3.19") format("woff")}@font-face{font-family:"Inter";font-style:italic;font-weight:200;font-display:swap;src:url("/fonts/inter/Inter-ExtraLightItalic.woff2?v=3.19") format("woff2"), url("/fonts/inter/Inter-ExtraLightItalic.woff?v=3.19") format("woff")}@font-face{font-family:"Inter";font-style:normal;font-weight:300;font-display:swap;src:url("/fonts/inter/Inter-Light.woff2?v=3.19") format("woff2"), url("/fonts/inter/Inter-Light.woff?v=3.19") format("woff")}@font-face{font-family:"Inter";font-style:italic;font-weight:300;font-display:swap;src:url("/fonts/inter/Inter-LightItalic.woff2?v=3.19") format("woff2"), url("/fonts/inter/Inter-LightItalic.woff?v=3.19") format("woff")}@font-face{font-family:"Inter";font-style:normal;font-weight:400;font-display:swap;src:url("/fonts/inter/Inter-Regular.woff2?v=3.19") format("woff2"), url("/fonts/inter/Inter-Regular.woff?v=3.19") format("woff")}@font-face{font-family:"Inter";font-style:italic;font-weight:400;font-display:swap;src:url("/fonts/inter/Inter-Italic.woff2?v=3.19") format("woff2"), url("/fonts/inter/Inter-Italic.woff?v=3.19") format("woff")}@font-face{font-family:"Inter";font-style:normal;font-weight:500;font-display:swap;src:url("/fonts/inter/Inter-Medium.woff2?v=3.19") format("woff2"), url("/fonts/inter/Inter-Medium.woff?v=3.19") format("woff")}@font-face{font-family:"Inter";font-style:italic;font-weight:500;font-display:swap;src:url("/fonts/inter/Inter-MediumItalic.woff2?v=3.19") format("woff2"), url("/fonts/inter/Inter-MediumItalic.woff?v=3.19") format("woff")}@font-face{font-family:"Inter";font-style:normal;font-weight:600;font-display:swap;src:url("/fonts/inter/Inter-SemiBold.woff2?v=3.19") format("woff2"), url("/fonts/inter/Inter-SemiBold.woff?v=3.19") format("woff")}@font-face{font-family:"Inter";font-style:italic;font-weight:600;font-display:swap;src:url("/fonts/inter/Inter-SemiBoldItalic.woff2?v=3.19") format("woff2"), url("/fonts/inter/Inter-SemiBoldItalic.woff?v=3.19") format("woff")}@font-face{font-family:"Inter";font-style:normal;font-weight:700;font-display:swap;src:url("/fonts/inter/Inter-Bold.woff2?v=3.19") format("woff2"), url("/fonts/inter/Inter-Bold.woff?v=3.19") format("woff")}@font-face{font-family:"Inter";font-style:italic;font-weight:700;font-display:swap;src:url("/fonts/inter/Inter-BoldItalic.woff2?v=3.19") format("woff2"), url("/fonts/inter/Inter-BoldItalic.woff?v=3.19") format("woff")}@font-face{font-family:"Inter";font-style:normal;font-weight:800;font-display:swap;src:url("/fonts/inter/Inter-ExtraBold.woff2?v=3.19") format("woff2"), url("/fonts/inter/Inter-ExtraBold.woff?v=3.19") format("woff")}@font-face{font-family:"Inter";font-style:italic;font-weight:800;font-display:swap;src:url("/fonts/inter/Inter-ExtraBoldItalic.woff2?v=3.19") format("woff2"), url("/fonts/inter/Inter-ExtraBoldItalic.woff?v=3.19") format("woff")}@font-face{font-family:"Inter";font-style:normal;font-weight:900;font-display:swap;src:url("/fonts/inter/Inter-Black.woff2?v=3.19") format("woff2"), url("/fonts/inter/Inter-Black.woff?v=3.19") format("woff")}@font-face{font-family:"Inter";font-style:italic;font-weight:900;font-display:swap;src:url("/fonts/inter/Inter-BlackItalic.woff2?v=3.19") format("woff2"), url("/fonts/inter/Inter-BlackItalic.woff?v=3.19") format("woff")}@font-face{font-family:"Inter var";font-weight:100 900;font-style:normal;font-named-instance:"Regular";font-display:swap;src:url("/fonts/inter/Inter-roman.var.woff2?v=3.19") format("woff2 supports variations(gvar)"), url("/fonts/inter/Inter-roman.var.woff2?v=3.19") format("woff2-variations"), url("/fonts/inter/Inter-roman.var.woff2?v=3.19") format("woff2")}@font-face{font-family:"Inter var";font-weight:100 900;font-style:italic;font-named-instance:"Italic";font-display:swap;src:url("/fonts/inter/Inter-italic.var.woff2?v=3.19") format("woff2 supports variations(gvar)"), url("/fonts/inter/Inter-italic.var.woff2?v=3.19") format("woff2-variations"), url("/fonts/inter/Inter-italic.var.woff2?v=3.19") format("woff2")}@font-face{font-family:"Inter var experimental";font-weight:100 900;font-style:oblique 0deg 10deg;font-display:swap;src:url("/fonts/inter/Inter.var.woff2?v=3.19") format("woff2-variations"), url("/fonts/inter/Inter.var.woff2?v=3.19") format("woff2")}html{font-family:"Inter", "system-ui", sans-serif;font-size:13px}@supports (font-variation-settings: normal){html{font-family:"Inter var", "system-ui", sans-serif}}h1{font-size:24px;letter-spacing:-0.47px;font-weight:600}h2{font-weight:600;font-size:16px;line-height:19px;letter-spacing:-0.18px}p{font-weight:400;font-size:12px;line-height:22px}#greymass-wallet-version{font-size:0.2em;opacity:0.2;position:fixed;bottom:1em;right:1em;pointer-events:none}html{height:100%;overflow:auto}label,p,h1,h2,h3,h4,h5,tr,td{color:var(--main-black)}a{cursor:pointer}:root{--main-white:#fff;--always-white:var(--main-white);--main-green:#26c64b;--main-grey:#f7f7fc;--main-red:#ff931e;--background-highlight:#fff;--background-highlight-hover:#fbfbfe;--dark-grey:#b7c1cb;--divider-grey:#e0e6ee;--light-black:#2c3e50;--light-blue:#e0eeff;--light-grey:#9898b5;--light-red:rgba(255, 146, 30, 0.1);--success-green:#4bca81;--error-red:#ff0033;--mobile-breakpoint:600px;--melon:#f9c5b8;--sandy-brown:#ffa253;--light-goldenrod-yellow:#f5f1cc;--air-superiority-blue:#669bbc;--middle-blue-green:#7de8d1;--emerald:#62d385;--cultured:#eeeeee;--black:#000000;--white:#ffffff;--middle-green-eagle:#063a47;--lapis-lazuli:#005dac;--oxford-blue:#0a0e33;--brown-sugar:#996443;--antic-ruby:#82172e;--violet-crayola:#9d2c7a;--rich-black-FOGRA:#111111;--main-blue:var(--lapis-lazuli);--main-black:#585d6e}body.darkmode{--main-white:#1c1c1e;--main-grey:#2c2c2e;--background-highlight:#3a3a3c;--background-highlight-hover:#3a3a3c57;--light-blue:#2a415e;--dark-grey:#8e8e93;--divider-grey:#3a3a3c;--melon:#063a47;--sandy-brown:#005dac;--light-goldenrod-yellow:#0a0e33;--air-superiority-blue:#996443;--middle-blue-green:#82172e;--emerald:#9d2c7a;--cultured:#111111;--black:#ffffff;--white:#000000;--middle-green-eagle:#f9c5b8;--lapis-lazuli:#ffa253;--oxford-blue:#f5f1cc;--brown-sugar:#669bbc;--antic-ruby:#7de8d1;--violet-crayola:#62d385;--rich-black-FOGRA:#eeeeee;--main-blue:var(--middle-green-eagle);--main-black:#c4c4c4}body{background:var(--main-white);color:var(--main-black);height:100%}main{min-height:100vh}',
  map: null
};
const App = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var _a, _b;
  let needLogin;
  let $router, $$unsubscribe_router;
  let $activeSession, $$unsubscribe_activeSession;
  let $darkMode, $$unsubscribe_darkMode;
  let $appReady, $$unsubscribe_appReady;
  $$unsubscribe_router = subscribe(f, (value) => $router = value);
  $$unsubscribe_activeSession = subscribe(activeSession, (value) => $activeSession = value);
  $$unsubscribe_darkMode = subscribe(darkMode, (value) => $darkMode = value);
  $$unsubscribe_appReady = subscribe(appReady, (value) => $appReady = value);
  $$result.css.add(css);
  needLogin = $activeSession === void 0 && !$router.path.startsWith("/_components") && !$router.path.startsWith("/request");
  {
    {
      document.body.classList.toggle("darkmode", $darkMode);
      if ($darkMode) {
        (_a = document.querySelector("meta[name=theme-color]")) == null ? void 0 : _a.setAttribute("content", needLogin ? "#101010" : "#1c1c1e");
      } else {
        (_b = document.querySelector("meta[name=theme-color]")) == null ? void 0 : _b.setAttribute("content", needLogin ? "#ececec" : "#ffffff");
      }
    }
  }
  $$unsubscribe_router();
  $$unsubscribe_activeSession();
  $$unsubscribe_darkMode();
  $$unsubscribe_appReady();
  return `${$$result.head += `<script async defer${add_attribute(
    "data-domain",
    isRelease ? "wallet.greymass.com" : "wallet-staging.greymass.com",
    0
  )} src="${"https://stats.greymass.com/js/plausible.exclusions.js"}" data-exclude="${"/account/*, /request/*"}" data-svelte="svelte-gegoir">"use strict";
<\/script>`, ""}
<main>${!$appReady ? `${validate_component(Loading, "Loading").$$render($$result, {}, {}, {})}` : `${needLogin ? `${validate_component(Login, "Login").$$render($$result, {}, {}, {})}` : `${validate_component(Route, "Route").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Route, "Route").$$render($$result, { path: "/" }, {}, {
        default: () => {
          return `${validate_component(Dashboard, "Dashboard").$$render($$result, {}, {}, {})}`;
        }
      })}
            ${validate_component(Route, "Route").$$render($$result, { path: "/transfer" }, {}, {
        default: () => {
          return `${validate_component(Transfer, "Transfer").$$render($$result, {}, {}, {})}`;
        }
      })}
            ${validate_component(Route, "Route").$$render($$result, { path: "/transfer/:contract/:token" }, {}, {
        default: ({ meta }) => {
          return `${validate_component(Transfer, "Transfer").$$render($$result, { meta }, {}, {})}`;
        }
      })}
            ${validate_component(Route, "Route").$$render($$result, { path: "/request/:payload" }, {}, {
        default: () => {
          return `${validate_component(Request, "Request").$$render($$result, {}, {}, {})}`;
        }
      })}
            ${validate_component(Route, "Route").$$render($$result, { path: "/resources/*" }, {}, {
        default: () => {
          return `${validate_component(Resources, "Resources").$$render($$result, {}, {}, {})}`;
        }
      })}
            ${validate_component(Route, "Route").$$render($$result, { fallback: true }, {}, {
        default: () => {
          return `${validate_component(Page$1, "Page").$$render($$result, { title: "Page not found" }, {}, {
            default: () => {
              return `<p>You shouldn&#39;t be here. Get out before it&#39;s too late.</p>
                    <img src="${"/images/404.jpg"}" alt="${"404"}">`;
            }
          })}`;
        }
      })}
            ${!isRelease ? `${validate_component(Route, "Route").$$render($$result, { path: "/_components/*" }, {}, {
        default: () => {
          return `${validate_component(Components, "Components").$$render($$result, {}, {}, {})}`;
        }
      })}` : ``}`;
    }
  })}`}`}
    ${validate_component(Toasts, "Toasts").$$render($$result, {}, {}, {})}</main>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${appReady ? `${validate_component(App, "App").$$render($$result, {}, {}, {})}` : `<div class="${"app-loading"}"></div>`}`;
});
export {
  Page as default
};
