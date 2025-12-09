import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import sourceMapperPlugin from "./source-mapper/src/index";
import { devToolsPlugin } from "./dev-tools/src/vite-plugin";
import { fullStoryPlugin } from "./fullstory-plugin";
import apiRoutes from "vite-plugin-api-routes";

const allowedHosts: string[] = [];
if (process.env.FRONTEND_DOMAIN) {
	allowedHosts.push(
		process.env.FRONTEND_DOMAIN,
		`http://${process.env.FRONTEND_DOMAIN}`,
		`https://${process.env.FRONTEND_DOMAIN}`,
	);
}
if (process.env.ALLOWED_ORIGINS) {
	allowedHosts.push(...process.env.ALLOWED_ORIGINS.split(","));
}
if (process.env.VITE_PARENT_ORIGIN) {
	allowedHosts.push(process.env.VITE_PARENT_ORIGIN);
}
if (allowedHosts.length === 0) {
	allowedHosts.push("*");
}

export default defineConfig(({ mode }) => ({
	plugins: [
		react({
			babel: {
				plugins: [sourceMapperPlugin],
			},
		}),
		apiRoutes({
			mode: "isolated",
			configure: "src/server/configure.js",
			dirs: [{ dir: "./src/server/api", route: "" }],
			forceRestart: mode === "development",
		}),
		...(mode === "development"
			? [devToolsPlugin() as Plugin, fullStoryPlugin()]
			: []),
	],

	resolve: {
		alias: {
			nothing: "/src/fallbacks/missingModule.ts",
			"@/api": path.resolve(__dirname, "./src/server/api"),
			"@": path.resolve(__dirname, "./src"),
		},
	},

	server: {
		host: "0.0.0.0",
		port: parseInt(process.env.PORT || "5173"),
		strictPort: !!process.env.PORT,
		allowedHosts,
		cors: {
			origin: allowedHosts,
			credentials: true,
			methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
			allowedHeaders: ["Content-Type", "Authorization", "Accept", "User-Agent"],
		},
		hmr: {
			overlay: false,
		},
	},

	build: {
		// Optimized build configuration for faster publishes
		chunkSizeWarningLimit: 1000,
		minify: 'esbuild', // Fastest minifier
		target: 'es2020', // Modern browsers for better optimization
		sourcemap: false, // Disable sourcemaps in production
		reportCompressedSize: false, // Skip compression reporting for speed
		assetsInlineLimit: 4096, // Inline small assets (4KB)
		cssCodeSplit: true, // Split CSS for better caching
		commonjsOptions: {
			transformMixedEsModules: true,
		},
		rollupOptions: {
			maxParallelFileOps: 20, // Parallel processing for speed
			cache: true, // Enable cache for faster rebuilds
			output: {
				chunkFileNames: 'assets/[name]-[hash].js',
				entryFileNames: 'assets/[name]-[hash].js',
				assetFileNames: 'assets/[name]-[hash].[ext]',
				// Optimized chunk splitting for caching
				manualChunks(id) {
					// React core (rarely changes)
					if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
						return 'vendor-react';
					}
					// React Router (rarely changes)
					if (id.includes('node_modules/react-router')) {
						return 'vendor-router';
					}
					// Radix UI (rarely changes)
					if (id.includes('node_modules/@radix-ui/')) {
						return 'vendor-radix';
					}
					// TanStack Query (rarely changes)
					if (id.includes('node_modules/@tanstack/')) {
						return 'vendor-query';
					}
					// Lucide icons (rarely changes)
					if (id.includes('node_modules/lucide-react')) {
						return 'vendor-icons';
					}
					// All other node_modules (rarely changes)
					if (id.includes('node_modules/')) {
						return 'vendor-libs';
					}
				},
			},
			onwarn(warning, warn) {
				if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;
				if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
				warn(warning);
			},
		},
	},
}));
