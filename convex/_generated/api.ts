/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type { ApiFromModules, FilterApi, FunctionReference } from "convex/server";
import { anyApi } from "convex/server";
import type * as admin from "../admin.js";
import type * as files from "../files.js";
import type * as gallery from "../gallery.js";
import type * as lib_admin from "../lib/admin.js";
import type * as projects from "../projects.js";
import type * as seed from "../seed.js";

const fullApi: ApiFromModules<{
  "admin": typeof admin;
  "files": typeof files;
  "gallery": typeof gallery;
  "lib/admin": typeof lib_admin;
  "projects": typeof projects;
  "seed": typeof seed;
}> = anyApi as any;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
> = anyApi as any;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
> = anyApi as any;
