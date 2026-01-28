import { defineConfig } from "vite";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

export default defineConfig({
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
  define: {
    global: {},
  },
  resolve: {
    alias: {
      crypto: require.resolve("node:crypto"),
    },
  },
});
