import { fileURLToPath } from "url";
import { dirname } from "path";

const isNode =
  typeof process !== "undefined" &&
  process.versions != null &&
  process.versions.node != null;

export const __filename = isNode
  ? fileURLToPath(import.meta.url) ||
    (typeof document === "undefined" ? require("path").resolve() : "")
  : "";
export const __dirname = isNode ? dirname(__filename) : "";
