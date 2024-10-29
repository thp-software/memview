import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";

import pkg from "./package.json" assert { type: "json" };
const dependencies = ({ dependencies }) => Object.keys(dependencies || {});
const pkgDependencies = dependencies(pkg);

export default {
  input: "src/back/index.ts",
  output: [
    {
      file: "temp/index.cjs.js",
      format: "cjs", // CommonJS
    },
    {
      file: "temp/index.esm.js",
      format: "es", // ESModules
    },
  ],
  plugins: [typescript(), nodeResolve()],
  external: (id) => pkgDependencies.includes(id),
};
