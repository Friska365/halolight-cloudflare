import { FlatCompat } from "@eslint/eslintrc";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    plugins: {
      "unused-imports": unusedImports,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      // 自动移除未使用的 imports
      "unused-imports/no-unused-imports": "error",
      // import 排序
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
  {
    ignores: [
      ".next/**",
      ".open-next/**",
      ".wrangler/**",
      "out/**",
      "build/**",
      "coverage/**",
      "public/sw.js",
      "public/workbox-*.js",
      "next-env.d.ts",
      "cloudflare-env.d.ts",
    ],
  },
];

export default eslintConfig;
