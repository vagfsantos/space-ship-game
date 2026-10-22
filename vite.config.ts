import basicSsl from "@vitejs/plugin-basic-ssl";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  // Relative asset paths so dist/ works from any folder or static host.
  base: "./",
  // `npm run dev:mobile` serves over HTTPS on the local network: phones only
  // give pages access to the gyroscope over HTTPS.
  plugins: mode === "mobile" ? [basicSsl()] : [],
  // play2d-game-library is linked from ../play2d-game-library. Don't pre-bundle it,
  // so rebuilds of its dist/ (npm run dev in the library) are picked up on reload.
  optimizeDeps: { exclude: ["play2d-game-library"] },
}));
