import { ChainId, Struct, Name as Name$1, UInt32, Asset as Asset$1, UInt64, TimePoint, TypeAlias, Int64, UInt16, APIClient, API, Serializer as Serializer$1, Link, PermissionLevel } from "anchor-link";
import Transport from "anchor-link-browser-transport";
import { w as get_store_value } from "./index.js";
import { d as derived$1, r as readable$1, w as writable } from "./index2.js";
import { Asset, Name, Serializer } from "@greymass/eosio";
import { openDB } from "idb";
const branch = { "BASE_URL": "/", "MODE": "production", "DEV": false, "PROD": true }.SNOWPACK_PUBLIC_BRANCH || "local";
const rev = { "BASE_URL": "/", "MODE": "production", "DEV": false, "PROD": true }.SNOWPACK_PUBLIC_REV || "head";
const ver = { "BASE_URL": "/", "MODE": "production", "DEV": false, "PROD": true }.SNOWPACK_PUBLIC_VERSION || "unknown";
const isRelease = branch === "HEAD";
const appId = !isRelease ? `w.${branch.replace(/[^1-5a-z]+/g, "").slice(0, 7)}.gm` : "wallet.gm";
const version = `${ver} (${branch}-${rev})`;
const releaseVersion = `Version ${ver}`;
var ChainFeatures = /* @__PURE__ */ ((ChainFeatures2) => {
  ChainFeatures2[ChainFeatures2["BidName"] = 0] = "BidName";
  ChainFeatures2[ChainFeatures2["BuyRAM"] = 1] = "BuyRAM";
  ChainFeatures2[ChainFeatures2["FIOBundledFees"] = 2] = "FIOBundledFees";
  ChainFeatures2[ChainFeatures2["Fuel"] = 3] = "Fuel";
  ChainFeatures2[ChainFeatures2["PowerUp"] = 4] = "PowerUp";
  ChainFeatures2[ChainFeatures2["REX"] = 5] = "REX";
  ChainFeatures2[ChainFeatures2["Staking"] = 6] = "Staking";
  ChainFeatures2[ChainFeatures2["VoteProducer"] = 7] = "VoteProducer";
  ChainFeatures2[ChainFeatures2["DelphiOracle"] = 8] = "DelphiOracle";
  return ChainFeatures2;
})(ChainFeatures || {});
const resourceFeatures = [
  3,
  6,
  5,
  4
];
var BalanceProviders = /* @__PURE__ */ ((BalanceProviders2) => {
  BalanceProviders2[BalanceProviders2["Bloks"] = 0] = "Bloks";
  return BalanceProviders2;
})(BalanceProviders || {});
const chains = [
  {
    id: "eos",
    chainFeatures: /* @__PURE__ */ new Set([
      0,
      1,
      3,
      4,
      5,
      6,
      7,
      8
    ]),
    chainId: ChainId.from("aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906"),
    coreTokenSymbol: Asset.Symbol.from("4,EOS"),
    coreTokenContract: Name.from("eosio.token"),
    coreTokenTransfer: Name.from("transfer"),
    name: "EOS",
    nodeUrl: "https://eos.greymass.com",
    testnet: false,
    bloksUrl: "https://bloks.io",
    balanceProviders: /* @__PURE__ */ new Set([0])
  },
  {
    id: "fio",
    chainFeatures: /* @__PURE__ */ new Set([2, 7]),
    chainId: ChainId.from("21dcae42c0182200e93f954a074011f9048a7624c6fe81d3c9541a614a88bd1c"),
    coreTokenSymbol: Asset.Symbol.from("9,FIO"),
    coreTokenContract: Name.from("fio.token"),
    coreTokenTransfer: Name.from("trnsfiopubky"),
    name: "FIO",
    nodeUrl: "https://fio.greymass.com",
    testnet: false,
    bloksUrl: "https://fio.bloks.io",
    balanceProviders: /* @__PURE__ */ new Set([0])
  },
  {
    id: "fio-testnet",
    chainFeatures: /* @__PURE__ */ new Set([2, 7]),
    chainId: ChainId.from("b20901380af44ef59c5918439a1f9a41d83669020319a80574b804a5f95cbd7e"),
    coreTokenSymbol: Asset.Symbol.from("9,FIO"),
    coreTokenContract: Name.from("fio.token"),
    coreTokenTransfer: Name.from("trnsfiopubky"),
    name: "FIO (Testnet)",
    nodeUrl: "https://fiotestnet.greymass.com",
    testnet: true,
    bloksUrl: "https://fio-test.bloks.io"
  },
  {
    id: "jungle3",
    chainFeatures: /* @__PURE__ */ new Set([
      0,
      1,
      3,
      4,
      5,
      6,
      7
    ]),
    chainId: ChainId.from("2a02a0053e5a8cf73a56ba0fda11e4d92e0238a4a2aa74fccf46d5a910746840"),
    coreTokenSymbol: Asset.Symbol.from("4,EOS"),
    coreTokenContract: Name.from("eosio.token"),
    coreTokenTransfer: Name.from("transfer"),
    name: "Jungle 3 (Testnet)",
    nodeUrl: "https://jungle3.greymass.com",
    testnet: true,
    bloksUrl: "https://jungle3.bloks.io",
    balanceProviders: /* @__PURE__ */ new Set([0])
  },
  {
    id: "proton",
    chainFeatures: /* @__PURE__ */ new Set([6, 7]),
    chainId: ChainId.from("384da888112027f0321850a169f737c33e53b388aad48b5adace4bab97f437e0"),
    coreTokenSymbol: Asset.Symbol.from("4,XPR"),
    coreTokenContract: Name.from("eosio.token"),
    coreTokenTransfer: Name.from("transfer"),
    name: "Proton",
    nodeUrl: "https://proton.greymass.com",
    testnet: false,
    bloksUrl: "https://proton.bloks.io",
    balanceProviders: /* @__PURE__ */ new Set([0])
  },
  {
    id: "telos",
    chainFeatures: /* @__PURE__ */ new Set([
      0,
      1,
      3,
      5,
      6,
      7
    ]),
    chainId: ChainId.from("4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11"),
    coreTokenSymbol: Asset.Symbol.from("4,TLOS"),
    coreTokenContract: Name.from("eosio.token"),
    coreTokenTransfer: Name.from("transfer"),
    name: "Telos",
    nodeUrl: "https://telos.greymass.com",
    resourceSampleAccount: "greymassfuel",
    resourceSampleMilliseconds: 1e3,
    testnet: false,
    bloksUrl: "https://telos.bloks.io",
    balanceProviders: /* @__PURE__ */ new Set([0])
  },
  {
    id: "telos-testnet",
    chainFeatures: /* @__PURE__ */ new Set([
      0,
      1,
      3,
      5,
      6,
      7
    ]),
    chainId: ChainId.from("1eaa0824707c8c16bd25145493bf062aecddfeb56c736f6ba6397f3195f33c9f"),
    coreTokenSymbol: Asset.Symbol.from("4,TLOS"),
    coreTokenContract: Name.from("eosio.token"),
    coreTokenTransfer: Name.from("transfer"),
    name: "Telos (Testnet)",
    nodeUrl: "https://testnet.telos.net",
    resourceSampleAccount: "greymassfuel",
    resourceSampleMilliseconds: 1e3,
    testnet: true,
    bloksUrl: "https://telos-test.bloks.io",
    balanceProviders: /* @__PURE__ */ new Set([0])
  },
  {
    id: "wax",
    chainFeatures: /* @__PURE__ */ new Set([
      0,
      1,
      3,
      6,
      7,
      8
    ]),
    chainId: ChainId.from("1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4"),
    coreTokenSymbol: Asset.Symbol.from("8,WAX"),
    coreTokenContract: Name.from("eosio.token"),
    coreTokenTransfer: Name.from("transfer"),
    name: "WAX",
    nodeUrl: "https://wax.greymass.com",
    resourceSampleAccount: "teamgreymass",
    testnet: false,
    bloksUrl: "https://wax.bloks.io"
  }
];
function chainConfig(chainId) {
  return chains.find((c) => c.chainId.equals(chainId));
}
/**
 * svelte-result-store v1.1.0
 * https://github.com/greymass/svelte-result-store
 *
 * @license
 * Copyright (c) 2021 FFF00 Agents AB & Greymass Inc. All Rights Reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 * 
 *  1. Redistribution of source code must retain the above copyright notice, this
 *     list of conditions and the following disclaimer.
 * 
 *  2. Redistribution in binary form must reproduce the above copyright notice,
 *     this list of conditions and the following disclaimer in the documentation
 *     and/or other materials provided with the distribution.
 * 
 *  3. Neither the name of the copyright holder nor the names of its contributors
 *     may be used to endorse or promote products derived from this software without
 *     specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 * IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE
 * OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 * 
 * YOU ACKNOWLEDGE THAT THIS SOFTWARE IS NOT DESIGNED, LICENSED OR INTENDED FOR USE
 * IN THE DESIGN, CONSTRUCTION, OPERATION OR MAINTENANCE OF ANY MILITARY FACILITY.
 */
class ReadableResult {
  subscribe;
  constructor(resultStore) {
    this.subscribe = resultStore.subscribe;
  }
  get value() {
    return {
      subscribe: (set) => this.subscribe((result) => {
        if (result.error === void 0) {
          set(result.value);
        }
      })
    };
  }
  catch(handler) {
    return {
      subscribe: (set) => this.subscribe((result) => {
        if (result.error !== void 0) {
          const value = handler(result.error);
          if (value) {
            set(value);
          }
        } else if (result.value !== void 0) {
          set(result.value);
        }
      })
    };
  }
  map(transform) {
    const store = {
      subscribe: (set) => this.subscribe((result) => {
        if (result.error !== void 0 || result.value !== void 0) {
          let newResult = {};
          try {
            newResult = transform(result);
          } catch (error) {
            newResult.error = error;
          }
          set(newResult);
        }
      })
    };
    return new ReadableResult(store);
  }
  mapValue(transform) {
    const store = {
      subscribe: (set) => this.subscribe((result) => {
        if (result.value !== void 0) {
          let value;
          try {
            value = transform(result.value);
          } catch (error) {
            set({ error });
            return;
          }
          set({ value });
        }
      })
    };
    return new ReadableResult(store);
  }
  flatMap(transform) {
    const store = {
      subscribe: (set) => this.subscribe((result) => {
        if (result.error !== void 0 || result.value !== void 0) {
          let value;
          try {
            value = transform(result);
          } catch (error) {
            set({ error });
            return;
          }
          set({ value });
        }
      })
    };
    return flatten(store);
  }
  flatMapValue(transform) {
    const store = {
      subscribe: (set) => this.subscribe((result) => {
        if (result.value !== void 0) {
          let value;
          try {
            value = transform(result.value);
          } catch (error) {
            set({ error });
            return;
          }
          set({ value });
        }
      })
    };
    return flatten(store);
  }
  get error() {
    return {
      subscribe: (set) => this.subscribe((result) => {
        if (result.error !== void 0) {
          set(result.error);
        }
      })
    };
  }
  get resolved() {
    return {
      subscribe: (set) => this.subscribe((result) => {
        set(result.error !== void 0 || result.value !== void 0);
      })
    };
  }
  get promise() {
    return new Promise((resolve, reject) => {
      const done = this.subscribe((result) => {
        if (result.error !== void 0) {
          reject(result.error);
        } else if (result.value !== void 0) {
          resolve(result.value);
        }
        if (result.error !== void 0 || result.value !== void 0) {
          setTimeout(() => {
            done();
          }, 0);
        }
      });
    });
  }
}
function readable(...args) {
  return new ReadableResult(internalWritable(...args));
}
function derived(stores, fn) {
  const single = !Array.isArray(stores);
  const auto = fn.length < 2;
  const store = derived$1(stores, (storeValues, set) => {
    const results = single ? [storeValues] : storeValues;
    const error = results.find((r) => r.error !== void 0);
    if (error) {
      set(error);
    } else {
      const values = results.map((r) => r.value);
      if (values.every((v) => v !== void 0)) {
        try {
          const rv = fn(single ? values[0] : values, (value) => {
            set({ value });
          }, (error2) => {
            set({ error: error2 });
          });
          if (rv instanceof Promise) {
            rv.then((value) => {
              set({ value });
            }).catch((error2) => {
              set({ error: error2 });
            });
          } else if (auto) {
            set({ value: rv });
          } else {
            return rv;
          }
        } catch (error2) {
          set({ error: error2 });
        }
      } else {
        set({});
      }
    }
  });
  return new ReadableResult(store);
}
function flatten(store, maxDepth) {
  const max = maxDepth || 10;
  const result = {};
  const flat = readable$1(result, (set) => {
    const next = (d) => (r) => {
      if (r.error) {
        set({ error: r.error });
      } else {
        if (r.value && typeof r.value.subscribe === "function" && d < max) {
          return subscribeCleanup(r.value, next(d + 1));
        } else {
          set(r);
        }
      }
    };
    return subscribeCleanup(store, next(0));
  });
  return new ReadableResult(flat);
}
function subscribeCleanup(store, run) {
  let cleanup = noop;
  const unsub = store.subscribe((v) => {
    cleanup();
    cleanup = run(v) || noop;
  });
  return () => {
    cleanup();
    unsub();
  };
}
function internalWritable(...args) {
  let start;
  let result = {};
  if (args.length === 2) {
    result = args[0];
    start = args[1];
  } else {
    start = typeof args[0] === "function" ? args[0] : noop;
    result = typeof args[0] === "object" && (args[0].value !== void 0 || args[0].error !== void 0) ? args[0] : {};
  }
  return writable(result, (setResult) => {
    try {
      const rv = start((value) => {
        setResult({ value });
      }, (error) => {
        setResult({ error });
      });
      if (rv instanceof Promise) {
        rv.then((value) => {
          if (value !== void 0) {
            setResult({ value });
          }
        }).catch((error) => {
          setResult({ error });
        });
      } else {
        return rv;
      }
    } catch (error) {
      setResult({ error });
    }
  });
}
function noop() {
}
const dbVersion = 3;
const dbPromise = openDB("wallet", dbVersion, {
  upgrade(db, version2) {
    if (version2 < 1) {
      const accountCache = db.createObjectStore("account-cache");
      accountCache.createIndex("by-updated", "updated", { unique: false });
    }
    if (version2 < 2) {
      db.createObjectStore("preferences");
    }
    if (version2 < 3) {
      const priceTicker2 = db.createObjectStore("price-ticker");
      priceTicker2.createIndex("by-updated", "updated", { unique: false });
    }
  }
});
function cachedRead(args) {
  return readable((set, error) => {
    const load = async () => {
      const db = await dbPromise;
      const data = await args.load();
      db.put(args.store, { updated: new Date(), data }, args.key).catch((error2) => {
        console.warn(`Error caching ${args.store}:${args.key}`, error2);
      });
      return data;
    };
    const init2 = async () => {
      const db = await dbPromise;
      const existing = await db.get(args.store, args.key);
      let value;
      if (existing && existing.updated && existing.data !== void 0) {
        const age = Date.now() - existing.updated.getTime();
        if (age < args.maxAge) {
          value = existing.data;
          if (age > args.refreshInterval) {
            load().then(set).catch(error);
          }
        }
      }
      if (value === void 0) {
        value = await load();
      }
      set(value);
    };
    init2().catch(error);
    const timer = setInterval(() => {
      load().then(set).catch(error);
    }, args.refreshInterval);
    return () => {
      clearInterval(timer);
    };
  });
}
var __defProp$2 = Object.defineProperty;
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$2 = (obj, key, value) => {
  __defNormalProp$2(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class ReadableObject {
  constructor() {
    __publicField$2(this, "subscribers", []);
  }
  subscribe(subscriber) {
    if (this.subscribers.length === 0 && this.subscriptionBecameActive) {
      this.subscriptionBecameActive();
    }
    this.subscribers.push(subscriber);
    subscriber(this);
    return () => {
      let idx = this.subscribers.indexOf(subscriber);
      if (idx !== -1) {
        this.subscribers.splice(idx, 1);
      }
      if (this.subscribers.length === 0 && this.subscriptionBecameInactive) {
        this.subscriptionBecameInactive();
      }
    };
  }
  didChange() {
    for (const subscriber of this.subscribers) {
      subscriber(this);
    }
  }
}
var __defProp$1 = Object.defineProperty;
var __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __decorateClass$1 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$1(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$1(target, key, result);
  return result;
};
var __publicField$1 = (obj, key, value) => {
  __defNormalProp$1(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const _Preferences = class extends ReadableObject {
  constructor() {
    super(...arguments);
    __publicField$1(this, "expandNavbar");
    __publicField$1(this, "expandNavbarAdvanced");
    __publicField$1(this, "darkmode");
    __publicField$1(this, "storage", {});
  }
  write(key, value) {
    this.storage[key] = value;
    this.didChange();
    this.save(key, value).catch((error) => {
      console.warn("Unable to save setting", error);
    });
  }
  read(key) {
    const setting = this.constructor.settings[key];
    if (!setting) {
      throw new TypeError(`Unknown setting: ${key}`);
    }
    return this.storage[key] === void 0 ? setting.default : this.storage[key];
  }
  async initStorage() {
    const db = await dbPromise;
    let cursor = await db.transaction("preferences").store.openCursor();
    let found = false;
    while (cursor) {
      found = true;
      this.storage[cursor.key] = cursor.value;
      cursor = await cursor.continue();
    }
    if (found) {
      this.didChange();
    }
  }
  async save(key, value) {
    const db = await dbPromise;
    await db.put("preferences", value, key);
  }
};
let Preferences = _Preferences;
__publicField$1(Preferences, "settings");
__publicField$1(Preferences, "shared", new _Preferences());
__decorateClass$1([
  Setting({ default: false })
], Preferences.prototype, "expandNavbar", 2);
__decorateClass$1([
  Setting({ default: false })
], Preferences.prototype, "expandNavbarAdvanced", 2);
__decorateClass$1([
  Setting({ default: null })
], Preferences.prototype, "darkmode", 2);
function Setting(args) {
  return (target, name) => {
    const ctor = target.constructor;
    if (!ctor.settings)
      ctor.settings = {};
    ctor.settings[name] = args;
    function get() {
      return this.read(name);
    }
    function set(newValue) {
      this.write(name, newValue);
    }
    Object.defineProperty(target, name, { get, set });
  };
}
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp(target, key, result);
  return result;
};
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
let BuyRamBytes = class extends Struct {
  constructor() {
    super(...arguments);
    __publicField(this, "payer");
    __publicField(this, "receiver");
    __publicField(this, "bytes");
  }
};
__decorateClass([
  Struct.field(Name$1)
], BuyRamBytes.prototype, "payer", 2);
__decorateClass([
  Struct.field(Name$1)
], BuyRamBytes.prototype, "receiver", 2);
__decorateClass([
  Struct.field(UInt32)
], BuyRamBytes.prototype, "bytes", 2);
BuyRamBytes = __decorateClass([
  Struct.type("buyrambytes")
], BuyRamBytes);
let DelegatedBandwidth = class extends Struct {
  constructor() {
    super(...arguments);
    __publicField(this, "from");
    __publicField(this, "to");
    __publicField(this, "net_weight");
    __publicField(this, "cpu_weight");
  }
};
__decorateClass([
  Struct.field(Name$1)
], DelegatedBandwidth.prototype, "from", 2);
__decorateClass([
  Struct.field(Name$1)
], DelegatedBandwidth.prototype, "to", 2);
__decorateClass([
  Struct.field(Asset$1)
], DelegatedBandwidth.prototype, "net_weight", 2);
__decorateClass([
  Struct.field(Asset$1)
], DelegatedBandwidth.prototype, "cpu_weight", 2);
DelegatedBandwidth = __decorateClass([
  Struct.type("delegated_bandwidth")
], DelegatedBandwidth);
let DelphiOracleDatapoint = class extends Struct {
  constructor() {
    super(...arguments);
    __publicField(this, "id");
    __publicField(this, "owner");
    __publicField(this, "value");
    __publicField(this, "median");
    __publicField(this, "timestamp");
  }
};
__decorateClass([
  Struct.field(UInt64)
], DelphiOracleDatapoint.prototype, "id", 2);
__decorateClass([
  Struct.field(Name$1)
], DelphiOracleDatapoint.prototype, "owner", 2);
__decorateClass([
  Struct.field(UInt64)
], DelphiOracleDatapoint.prototype, "value", 2);
__decorateClass([
  Struct.field(UInt64)
], DelphiOracleDatapoint.prototype, "median", 2);
__decorateClass([
  Struct.field(TimePoint)
], DelphiOracleDatapoint.prototype, "timestamp", 2);
DelphiOracleDatapoint = __decorateClass([
  Struct.type("delphioracledatapoint")
], DelphiOracleDatapoint);
let DelphiOracleAssetType = class extends UInt16 {
};
DelphiOracleAssetType = __decorateClass([
  TypeAlias("asset_type")
], DelphiOracleAssetType);
let DelphiOraclePair = class extends Struct {
  constructor() {
    super(...arguments);
    __publicField(this, "active");
    __publicField(this, "bounty_awarded");
    __publicField(this, "bounty_edited_by_custodians");
    __publicField(this, "proposer");
    __publicField(this, "name");
    __publicField(this, "bounty_amount");
    __publicField(this, "approving_custodians");
    __publicField(this, "approving_oracles");
    __publicField(this, "base_symbol");
    __publicField(this, "base_type");
    __publicField(this, "base_contract");
    __publicField(this, "quote_symbol");
    __publicField(this, "quote_type");
    __publicField(this, "quote_contract");
    __publicField(this, "quoted_precision");
  }
};
__decorateClass([
  Struct.field("bool")
], DelphiOraclePair.prototype, "active", 2);
__decorateClass([
  Struct.field("bool")
], DelphiOraclePair.prototype, "bounty_awarded", 2);
__decorateClass([
  Struct.field("bool")
], DelphiOraclePair.prototype, "bounty_edited_by_custodians", 2);
__decorateClass([
  Struct.field(Name$1)
], DelphiOraclePair.prototype, "proposer", 2);
__decorateClass([
  Struct.field(Name$1)
], DelphiOraclePair.prototype, "name", 2);
__decorateClass([
  Struct.field(Asset$1)
], DelphiOraclePair.prototype, "bounty_amount", 2);
__decorateClass([
  Struct.field(Name$1, { array: true })
], DelphiOraclePair.prototype, "approving_custodians", 2);
__decorateClass([
  Struct.field(Name$1, { array: true })
], DelphiOraclePair.prototype, "approving_oracles", 2);
__decorateClass([
  Struct.field(Asset$1.Symbol)
], DelphiOraclePair.prototype, "base_symbol", 2);
__decorateClass([
  Struct.field(DelphiOracleAssetType)
], DelphiOraclePair.prototype, "base_type", 2);
__decorateClass([
  Struct.field(Name$1)
], DelphiOraclePair.prototype, "base_contract", 2);
__decorateClass([
  Struct.field(Asset$1.Symbol)
], DelphiOraclePair.prototype, "quote_symbol", 2);
__decorateClass([
  Struct.field(DelphiOracleAssetType)
], DelphiOraclePair.prototype, "quote_type", 2);
__decorateClass([
  Struct.field(Name$1)
], DelphiOraclePair.prototype, "quote_contract", 2);
__decorateClass([
  Struct.field(UInt64)
], DelphiOraclePair.prototype, "quoted_precision", 2);
DelphiOraclePair = __decorateClass([
  Struct.type("delphioraclepair")
], DelphiOraclePair);
let FIOTransfer = class extends Struct {
  constructor() {
    super(...arguments);
    __publicField(this, "payee_public_key");
    __publicField(this, "amount");
    __publicField(this, "max_fee");
    __publicField(this, "actor");
    __publicField(this, "tpid");
  }
};
__decorateClass([
  Struct.field("string")
], FIOTransfer.prototype, "payee_public_key", 2);
__decorateClass([
  Struct.field("int64")
], FIOTransfer.prototype, "amount", 2);
__decorateClass([
  Struct.field("int64")
], FIOTransfer.prototype, "max_fee", 2);
__decorateClass([
  Struct.field("name")
], FIOTransfer.prototype, "actor", 2);
__decorateClass([
  Struct.field("string")
], FIOTransfer.prototype, "tpid", 2);
FIOTransfer = __decorateClass([
  Struct.type("fiotransfer")
], FIOTransfer);
let PowerUp = class extends Struct {
  constructor() {
    super(...arguments);
    __publicField(this, "payer");
    __publicField(this, "receiver");
    __publicField(this, "days");
    __publicField(this, "net_frac");
    __publicField(this, "cpu_frac");
    __publicField(this, "max_payment");
  }
};
__decorateClass([
  Struct.field("name")
], PowerUp.prototype, "payer", 2);
__decorateClass([
  Struct.field("name")
], PowerUp.prototype, "receiver", 2);
__decorateClass([
  Struct.field("uint32")
], PowerUp.prototype, "days", 2);
__decorateClass([
  Struct.field("int64")
], PowerUp.prototype, "net_frac", 2);
__decorateClass([
  Struct.field("int64")
], PowerUp.prototype, "cpu_frac", 2);
__decorateClass([
  Struct.field("asset")
], PowerUp.prototype, "max_payment", 2);
PowerUp = __decorateClass([
  Struct.type("powerup")
], PowerUp);
let PowerUpStateResource = class extends Struct {
  constructor() {
    super(...arguments);
    __publicField(this, "version");
    __publicField(this, "weight");
    __publicField(this, "weight_ratio");
    __publicField(this, "assumed_stake_weight");
    __publicField(this, "initial_weight_ratio");
    __publicField(this, "target_weight_ratio");
    __publicField(this, "initial_timestamp");
    __publicField(this, "target_timestamp");
    __publicField(this, "exponent");
    __publicField(this, "decay_secs");
    __publicField(this, "min_price");
    __publicField(this, "max_price");
    __publicField(this, "utilization");
    __publicField(this, "adjusted_utilization");
    __publicField(this, "utilization_timestamp");
  }
};
__decorateClass([
  Struct.field("uint8")
], PowerUpStateResource.prototype, "version", 2);
__decorateClass([
  Struct.field("int64")
], PowerUpStateResource.prototype, "weight", 2);
__decorateClass([
  Struct.field("int64")
], PowerUpStateResource.prototype, "weight_ratio", 2);
__decorateClass([
  Struct.field("int64")
], PowerUpStateResource.prototype, "assumed_stake_weight", 2);
__decorateClass([
  Struct.field("int64")
], PowerUpStateResource.prototype, "initial_weight_ratio", 2);
__decorateClass([
  Struct.field("int64")
], PowerUpStateResource.prototype, "target_weight_ratio", 2);
__decorateClass([
  Struct.field("time_point_sec")
], PowerUpStateResource.prototype, "initial_timestamp", 2);
__decorateClass([
  Struct.field("time_point_sec")
], PowerUpStateResource.prototype, "target_timestamp", 2);
__decorateClass([
  Struct.field("float64")
], PowerUpStateResource.prototype, "exponent", 2);
__decorateClass([
  Struct.field("uint32")
], PowerUpStateResource.prototype, "decay_secs", 2);
__decorateClass([
  Struct.field("asset")
], PowerUpStateResource.prototype, "min_price", 2);
__decorateClass([
  Struct.field("asset")
], PowerUpStateResource.prototype, "max_price", 2);
__decorateClass([
  Struct.field("int64")
], PowerUpStateResource.prototype, "utilization", 2);
__decorateClass([
  Struct.field("int64")
], PowerUpStateResource.prototype, "adjusted_utilization", 2);
__decorateClass([
  Struct.field("time_point_sec")
], PowerUpStateResource.prototype, "utilization_timestamp", 2);
PowerUpStateResource = __decorateClass([
  Struct.type("powerupstateresource")
], PowerUpStateResource);
let PowerUpState = class extends Struct {
  constructor() {
    super(...arguments);
    __publicField(this, "version");
    __publicField(this, "net");
    __publicField(this, "cpu");
    __publicField(this, "powerup_days");
    __publicField(this, "min_powerup_fee");
  }
};
__decorateClass([
  Struct.field("uint8")
], PowerUpState.prototype, "version", 2);
__decorateClass([
  Struct.field(PowerUpStateResource)
], PowerUpState.prototype, "net", 2);
__decorateClass([
  Struct.field(PowerUpStateResource)
], PowerUpState.prototype, "cpu", 2);
__decorateClass([
  Struct.field("uint32")
], PowerUpState.prototype, "powerup_days", 2);
__decorateClass([
  Struct.field("asset")
], PowerUpState.prototype, "min_powerup_fee", 2);
PowerUpState = __decorateClass([
  Struct.type("powerupstate")
], PowerUpState);
let REXDeposit = class extends Struct {
  constructor() {
    super(...arguments);
    __publicField(this, "owner");
    __publicField(this, "amount");
  }
};
__decorateClass([
  Struct.field("name")
], REXDeposit.prototype, "owner", 2);
__decorateClass([
  Struct.field("asset")
], REXDeposit.prototype, "amount", 2);
REXDeposit = __decorateClass([
  Struct.type("rexdeposit")
], REXDeposit);
let REXRentCPU = class extends Struct {
  constructor() {
    super(...arguments);
    __publicField(this, "from");
    __publicField(this, "receiver");
    __publicField(this, "loan_payment");
    __publicField(this, "loan_fund");
  }
};
__decorateClass([
  Struct.field("name")
], REXRentCPU.prototype, "from", 2);
__decorateClass([
  Struct.field("name")
], REXRentCPU.prototype, "receiver", 2);
__decorateClass([
  Struct.field("asset")
], REXRentCPU.prototype, "loan_payment", 2);
__decorateClass([
  Struct.field("asset")
], REXRentCPU.prototype, "loan_fund", 2);
REXRentCPU = __decorateClass([
  Struct.type("rexrentcpu")
], REXRentCPU);
let REXRentNET = class extends Struct {
  constructor() {
    super(...arguments);
    __publicField(this, "from");
    __publicField(this, "receiver");
    __publicField(this, "loan_payment");
    __publicField(this, "loan_fund");
  }
};
__decorateClass([
  Struct.field("name")
], REXRentNET.prototype, "from", 2);
__decorateClass([
  Struct.field("name")
], REXRentNET.prototype, "receiver", 2);
__decorateClass([
  Struct.field("asset")
], REXRentNET.prototype, "loan_payment", 2);
__decorateClass([
  Struct.field("asset")
], REXRentNET.prototype, "loan_fund", 2);
REXRentNET = __decorateClass([
  Struct.type("rexrentnet")
], REXRentNET);
let REXState = class extends Struct {
  constructor() {
    super(...arguments);
    __publicField(this, "version");
    __publicField(this, "total_lent");
    __publicField(this, "total_unlent");
    __publicField(this, "total_rent");
    __publicField(this, "total_lendable");
    __publicField(this, "total_rex");
    __publicField(this, "namebid_proceeds");
    __publicField(this, "loan_num");
  }
};
__decorateClass([
  Struct.field("uint8")
], REXState.prototype, "version", 2);
__decorateClass([
  Struct.field("asset")
], REXState.prototype, "total_lent", 2);
__decorateClass([
  Struct.field("asset")
], REXState.prototype, "total_unlent", 2);
__decorateClass([
  Struct.field("asset")
], REXState.prototype, "total_rent", 2);
__decorateClass([
  Struct.field("asset")
], REXState.prototype, "total_lendable", 2);
__decorateClass([
  Struct.field("asset")
], REXState.prototype, "total_rex", 2);
__decorateClass([
  Struct.field("asset")
], REXState.prototype, "namebid_proceeds", 2);
__decorateClass([
  Struct.field("uint64")
], REXState.prototype, "loan_num", 2);
REXState = __decorateClass([
  Struct.type("rexstate")
], REXState);
let Sellram = class extends Struct {
  constructor() {
    super(...arguments);
    __publicField(this, "account");
    __publicField(this, "bytes");
  }
};
__decorateClass([
  Struct.field(Name$1)
], Sellram.prototype, "account", 2);
__decorateClass([
  Struct.field(Int64)
], Sellram.prototype, "bytes", 2);
Sellram = __decorateClass([
  Struct.type("sellram")
], Sellram);
let Stake = class extends Struct {
  constructor() {
    super(...arguments);
    __publicField(this, "from");
    __publicField(this, "receiver");
    __publicField(this, "stake_net_quantity");
    __publicField(this, "stake_cpu_quantity");
    __publicField(this, "transfer");
  }
};
__decorateClass([
  Struct.field("name")
], Stake.prototype, "from", 2);
__decorateClass([
  Struct.field("name")
], Stake.prototype, "receiver", 2);
__decorateClass([
  Struct.field("asset")
], Stake.prototype, "stake_net_quantity", 2);
__decorateClass([
  Struct.field("asset")
], Stake.prototype, "stake_cpu_quantity", 2);
__decorateClass([
  Struct.field("bool")
], Stake.prototype, "transfer", 2);
Stake = __decorateClass([
  Struct.type("stake")
], Stake);
let Transfer = class extends Struct {
  constructor() {
    super(...arguments);
    __publicField(this, "from");
    __publicField(this, "to");
    __publicField(this, "quantity");
    __publicField(this, "memo");
  }
};
__decorateClass([
  Struct.field("name")
], Transfer.prototype, "from", 2);
__decorateClass([
  Struct.field("name")
], Transfer.prototype, "to", 2);
__decorateClass([
  Struct.field("asset")
], Transfer.prototype, "quantity", 2);
__decorateClass([
  Struct.field("string")
], Transfer.prototype, "memo", 2);
Transfer = __decorateClass([
  Struct.type("transfer")
], Transfer);
const clients = /* @__PURE__ */ new Map();
function getClient(chainOrId) {
  let chain;
  if (chainOrId instanceof ChainId) {
    const id = String(chainOrId);
    chain = chains.find((cfg) => cfg.chainId.equals(id));
    if (!chain) {
      throw new Error(`Unconfigured chain: ${id}`);
    }
  } else {
    chain = chainOrId;
  }
  let client = clients.get(String(chain.chainId));
  if (!client) {
    client = new APIClient({ url: chain.nodeUrl });
    clients.set(String(chain.chainId), client);
  }
  return client;
}
const UPDATE_INTERVAL = 1 * 60 * 1e3;
const MAX_AGE = 2 * 60 * 60 * 1e3;
function getOraclePairs(chain) {
  const client = getClient(chain);
  const pairs = cachedRead({
    store: "price-ticker",
    key: `${chain.id}-pairs`,
    load: async () => {
      let result = await client.v1.chain.get_table_rows({
        type: DelphiOraclePair,
        code: "delphioracle",
        scope: "delphioracle",
        table: "pairs",
        limit: 500
      });
      return Serializer.objectify(result.rows);
    },
    maxAge: 6048e5,
    refreshInterval: 864e5
  });
  return derived(pairs, ($pairs) => {
    return $pairs.map((p) => DelphiOraclePair.from(p)).filter((p) => p.active);
  });
}
function getOracleDatapoint(chain, pair) {
  const client = getClient(chain);
  const data = cachedRead({
    store: "price-ticker",
    key: `${chain.id}-${pair.name}`,
    load: async () => {
      let result = await client.v1.chain.get_table_rows({
        type: DelphiOracleDatapoint,
        code: "delphioracle",
        scope: `${pair.name}`,
        table: "datapoints",
        limit: 1
      });
      let latest = result.rows[0];
      if (!latest) {
        throw new Error(`No datapoints for ${pair.name} on ${chain.id}`);
      }
      return Serializer.objectify(latest);
    },
    maxAge: MAX_AGE,
    refreshInterval: UPDATE_INTERVAL
  });
  return derived(data, ($data) => DelphiOracleDatapoint.from($data));
}
function bloksFallback(chain, pairName) {
  const chainName = chain.id;
  return cachedRead({
    store: "price-ticker",
    key: `${chainName}-fallback`,
    load: async () => {
      if (pairName) {
        throw new Error("Fallback only supports core symbol");
      }
      let url = "https://www.api.bloks.io/ticker/banana";
      if (chainName !== "eos") {
        url = `https://www.api.bloks.io/${chainName}/ticker/banana`;
      }
      const response = await fetch(url);
      const data = await response.json();
      if (typeof data === "number") {
        return data;
      } else {
        throw new Error("Unexpected response from bloks");
      }
    },
    maxAge: MAX_AGE,
    refreshInterval: UPDATE_INTERVAL
  });
}
const tickerStores = {};
function priceTicker(chain, pairName) {
  const tickerName = `${chain.id}-${pairName || "coresymbol"}`;
  if (tickerStores[tickerName]) {
    return tickerStores[tickerName];
  }
  const pairs = chain.chainFeatures.has(
    ChainFeatures.DelphiOracle
  ) ? getOraclePairs(chain) : readable({ value: [] });
  const pair = derived(pairs, ($pairs) => {
    let pair2;
    if (!pairName) {
      pair2 = $pairs.find(
        (p) => p.base_symbol.equals(chain.coreTokenSymbol) && p.quote_symbol.name === "USD"
      );
    } else {
      pair2 = $pairs.find((p) => p.name.equals(pairName));
    }
    return pair2 || null;
  });
  const datapoint = flatten(
    derived(pair, ($pair) => {
      if ($pair) {
        return getOracleDatapoint(chain, $pair);
      } else {
        return null;
      }
    })
  );
  const ticker = flatten(
    derived([datapoint, pair], ([$datapoint, $pair]) => {
      if (chain.testnet) {
        return 0;
      } else if ($datapoint && $pair) {
        return $datapoint.median.toNumber() / Math.pow(10, $pair.quoted_precision.toNumber());
      } else {
        return bloksFallback(chain, pairName);
      }
    })
  );
  tickerStores[tickerName] = ticker;
  return ticker;
}
const maxAge = 60 * 1e3;
const isLoading = writable(false);
const initialAccountResponse = {
  stale: true
};
const accountProvider = writable(initialAccountResponse, () => {
  const interval = setInterval(() => {
    const session = get_store_value(activeSession);
    if (session) {
      updateAccount(session.auth.actor, session.chainId);
    }
  }, 3e4);
  const unsubscribe = activeSession.subscribe((session) => {
    if (session) {
      updateAccount(session.auth.actor, session.chainId);
    }
  });
  return () => {
    unsubscribe();
    clearInterval(interval);
  };
});
async function updateAccount(name, chainId, refresh = false) {
  isLoading.set(true);
  loadAccount(
    name,
    chainId,
    async (v) => {
      var _a;
      if (!((_a = v.account) == null ? void 0 : _a.core_liquid_balance)) {
        const assets = await fetchBalance(name, chainId).catch((err) => {
          console.warn("Error fetching account balance:", err);
        });
        if (assets) {
          v.account.core_liquid_balance = assets[0];
        }
      }
      accountProvider.set(v);
    },
    refresh
  );
  isLoading.set(false);
}
function fetchBalance(name, chainId) {
  const chain = chainConfig(chainId);
  return getClient(chainId).v1.chain.get_currency_balance(chain.coreTokenContract, name);
}
function accountKey(name, chainId) {
  return `${chainId}-${name}`;
}
async function storeAccount(account, chainId) {
  const db = await dbPromise;
  await db.put(
    "account-cache",
    {
      account: Serializer$1.objectify(account),
      updated: new Date()
    },
    accountKey(account.account_name, chainId)
  );
}
async function loadAccount(name, chainId, set, refresh = false) {
  const key = accountKey(name, chainId);
  let db = await dbPromise;
  let row = await db.get("account-cache", key);
  let stale = true;
  if (row) {
    const age = Date.now() - row.updated.getTime();
    stale = age > maxAge;
    set({ account: API.v1.AccountObject.from(row.account), stale });
  }
  if (stale || refresh) {
    const account = await getClient(chainId).v1.chain.get_account(name);
    await storeAccount(account, chainId);
    set({ account, stale: false });
  }
}
const appReady = writable(false);
const activeSession = writable(void 0);
const activeBlockchain = derived$1(activeSession, (session) => {
  if (session) {
    return chainConfig(session.chainId);
  } else {
    return chains[0];
  }
});
const activePriceTicker = derived$1(
  [activeBlockchain],
  ([$activeBlockchain], set) => priceTicker($activeBlockchain).value.subscribe((v) => {
    if (v !== void 0) {
      set(v);
    }
  })
);
const availableSessions = writable([]);
const preferences = Preferences.shared;
const currentAccount = derived$1(
  accountProvider,
  ($accountProvider) => $accountProvider.account
);
derived$1(
  currentAccount,
  ($currentAccount) => {
    if ($currentAccount) {
      return $currentAccount.core_liquid_balance;
    }
  }
);
const systemDarkMode = writable(
  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
);
if (window.matchMedia) {
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
    systemDarkMode.set(event.matches);
  });
}
const darkMode = derived$1(
  [systemDarkMode, preferences],
  ([$systemDarkMode, $preferences]) => {
    if ($preferences.darkmode !== null) {
      return $preferences.darkmode;
    } else {
      return $systemDarkMode;
    }
  }
);
const transport = new Transport({
  requestStatus: false
});
const link = new Link({
  chains: chains.map((chain) => ({ chainId: chain.chainId, nodeUrl: getClient(chain) })),
  transport
});
function sessionEquals(a, b) {
  return a.auth.equals(b.auth) && a.chainId.equals(b.chainId);
}
async function init() {
  const list = await link.listSessions(appId);
  let session = null;
  if (window.location.search.includes("auth=")) {
    const qs = new URLSearchParams(window.location.search);
    const auth = PermissionLevel.from(qs.get("auth") || "");
    let chainId;
    if (qs.has("chain")) {
      chainId = ChainId.from(qs.get("chain") || "");
    }
    session = await link.restoreSession(appId, auth, chainId);
    const removeQuery = () => {
      if (window.history) {
        window.history.replaceState(null, "", window.location.pathname);
      }
    };
    if (!session) {
      return login().finally(removeQuery);
    } else {
      removeQuery();
    }
  } else {
    session = await link.restoreSession(appId);
  }
  availableSessions.set(list);
  if (session) {
    activeSession.set(session);
  }
}
async function login() {
  const result = await link.login(appId);
  if (result.account) {
    storeAccount(result.account, result.session.chainId);
  }
  const list = await link.listSessions(appId);
  availableSessions.set(list);
  activeSession.set(result.session);
}
async function activate(id) {
  const session = await link.restoreSession(appId, id.auth, id.chainId);
  if (!session) {
    throw new Error("No such session");
  }
  activeSession.set(session);
}
export {
  BalanceProviders as B,
  ChainFeatures as C,
  DelegatedBandwidth as D,
  FIOTransfer as F,
  Preferences as P,
  Transfer as T,
  availableSessions as a,
  activeSession as b,
  chains as c,
  chainConfig as d,
  activate as e,
  darkMode as f,
  resourceFeatures as g,
  activeBlockchain as h,
  isRelease as i,
  activePriceTicker as j,
  currentAccount as k,
  getClient as l,
  priceTicker as m,
  readable as n,
  appReady as o,
  preferences as p,
  init as q,
  releaseVersion as r,
  sessionEquals as s,
  updateAccount as u,
  version as v
};
