/** @type {import('next').NextConfig} */

const nextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_TEMPO: "true",
  },
  reactStrictMode: false,
  // Prevent hydration issues
  experimental: {
    // Reduce memory usage during build
    workerThreads: false,
    cpus: 1,
    // Fix hydration issues and module resolution
    esmExternals: "loose",
    serverComponentsExternalPackages: ["tempo-devtools"],
  },
  images: {
    domains: ["i.imgur.com"],
  },

  // Optimize bundle size
  swcMinify: true,
  // Transpile specific modules to fix React Client Manifest errors
  transpilePackages: ["lucide-react"],
  // Bundle analyzer and optimization
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  // Optimize for production
  productionBrowserSourceMaps: false,
  // Reduce build memory usage
  webpack: (config, { dev, isServer }) => {
    // Fix module resolution issues
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    // Ignore problematic tempobook directories during build
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        "**/node_modules/**",
        "**/tempobook/dynamic/src/**",
        "**/tempobook/**",
        "**/.git/**",
        "**/.next/**",
      ],
    };

    // Fix module resolution for vendor chunks
    config.resolve.alias = {
      ...config.resolve.alias,
      "lucide-react": require.resolve("lucide-react"),
    };

    // Fix webpack factory issues and module loading
    config.module.rules.push({
      test: /\.m?js$/,
      type: "javascript/auto",
      resolve: {
        fullySpecified: false,
      },
    });

    // Handle tempo-devtools module loading - only externalize on server
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        "tempo-devtools": "commonjs tempo-devtools",
      });
    }

    // Ensure proper chunk loading and factory resolution
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        module: false,
      };

      // Fix factory call issues and prevent undefined factory errors
      config.optimization = {
        ...config.optimization,
        moduleIds: "deterministic",
        chunkIds: "deterministic",
        runtimeChunk: "single",
        splitChunks: {
          chunks: "all",
          minSize: 20000,
          maxSize: 200000,
          cacheGroups: {
            default: {
              minChunks: 1,
              priority: -20,
              reuseExistingChunk: true,
            },
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendors",
              priority: -10,
              chunks: "all",
              enforce: true,
            },
            common: {
              name: "common",
              minChunks: 2,
              priority: -5,
              reuseExistingChunk: true,
            },
            lucide: {
              test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
              name: "lucide",
              priority: 10,
              chunks: "all",
              enforce: true,
            },
            supabase: {
              test: /[\\/]node_modules[\\/]@supabase[\\/]/,
              name: "supabase",
              priority: 10,
              chunks: "all",
            },
          },
        },
      };
    }

    // Add error handling for module factory calls
    const originalFactory = config.module.rules;
    config.module.rules = originalFactory.map((rule) => {
      if (rule.use && Array.isArray(rule.use)) {
        rule.use = rule.use.map((use) => {
          if (typeof use === "object" && use.loader) {
            return {
              ...use,
              options: {
                ...use.options,
                errorDetails: true,
              },
            };
          }
          return use;
        });
      }
      return rule;
    });

    return config;
  },
};

module.exports = nextConfig;
