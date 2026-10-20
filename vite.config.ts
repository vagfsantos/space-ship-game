import { defineConfig } from "vite";

export default defineConfig({
  // Relative asset paths so dist/ works from any folder or static host.
  base: "./",
  // play2d-game-library is linked from ../play2d-game-library. Don't pre-bundle it,
  // so rebuilds of its dist/ (npm run dev in the library) are picked up on reload.
  optimizeDeps: { exclude: ["play2d-game-library"] },
});
