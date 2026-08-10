// Querying with "sanityFetch" will keep content automatically updated
// Before using it, import and render "<SanityLive />" in your layout, see
// https://github.com/sanity-io/next-sanity#live-content-api for more information.
import { defineLive } from "next-sanity/live";
import { client } from "./client";

export const { sanityFetch, SanityLive } = defineLive({
  client,
  // Silenced: this app only reads published content. To enable live draft
  // previewing, pass a read token as `serverToken` and a Viewer-only token
  // as `browserToken` (never a write token).
  serverToken: false,
  browserToken: false,
});
