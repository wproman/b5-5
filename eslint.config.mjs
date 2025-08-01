// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  {
    rules: {
      // ✅ Add your custom rules here
      // Example:
      "no-console": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  }
);
