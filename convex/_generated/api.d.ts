/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as avatars from "../avatars.js";
import type * as cleanup from "../cleanup.js";
import type * as crons from "../crons.js";
import type * as engine from "../engine.js";
import type * as games from "../games.js";
import type * as lib from "../lib.js";
import type * as packData from "../packData.js";
import type * as packs from "../packs.js";
import type * as presence from "../presence.js";
import type * as questionData from "../questionData.js";
import type * as round from "../round.js";
import type * as scaleData from "../scaleData.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  avatars: typeof avatars;
  cleanup: typeof cleanup;
  crons: typeof crons;
  engine: typeof engine;
  games: typeof games;
  lib: typeof lib;
  packData: typeof packData;
  packs: typeof packs;
  presence: typeof presence;
  questionData: typeof questionData;
  round: typeof round;
  scaleData: typeof scaleData;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
