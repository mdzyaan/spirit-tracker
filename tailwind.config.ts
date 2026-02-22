import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-plus-jakarta-sans)",
          "Plus Jakarta Sans",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        semantics: {
          base: {
            bg: {
              DEFAULT: "var(--semantics-base-bg-default)",
              hover: "var(--semantics-base-bg-hover)",
              active: "var(--semantics-base-bg-active)",
              muted: {
                DEFAULT: "var(--semantics-base-bg-muted-default)",
                hover: "var(--semantics-base-bg-muted-hover)",
                active: "var(--semantics-base-bg-muted-active)",
              },
              secondary: {
                DEFAULT: "var(--semantics-base-bg-secondary-default)",
                hover: "var(--semantics-base-bg-secondary-hover)",
                active: "var(--semantics-base-bg-secondary-active)",
              },
              dim: {
                DEFAULT: "var(--semantics-base-bg-dim-default)",
                hover: "var(--semantics-base-bg-dim-hover)",
                active: "var(--semantics-base-bg-dim-active)",
              },
              invert: {
                DEFAULT: "var(--semantics-base-bg-invert-default)",
                hover: "var(--semantics-base-bg-invert-hover)",
              },
            },
            fg: {
              DEFAULT: "var(--semantics-base-fg-default)",
              muted: {
                DEFAULT: "var(--semantics-base-fg-muted)",
                2: "var(--semantics-base-fg-muted-2)",
                3: "var(--semantics-base-fg-muted-3)",
              },
              invert: {
                DEFAULT: "var(--semantics-base-fg-invert)",
                white: "var(--semantics-base-fg-invert-white)",
                black: "var(--semantics-base-fg-invert-black)",
              },
            },
            border: {
              0: "var(--semantics-base-border-0)",
              1: "var(--semantics-base-border-1)",
              2: "var(--semantics-base-border-2)",
              3: "var(--semantics-base-border-3)",
            },
            shadow: "var(--semantics-base-shadow)",
          },
          brand: {
            bg: {
              DEFAULT: "var(--semantics-brand-bg-default)",
              hover: "var(--semantics-brand-bg-hover)",
              active: "var(--semantics-brand-bg-active)",
              soft: {
                DEFAULT: "var(--semantics-brand-bg-soft-default)",
                hover: "var(--semantics-brand-bg-soft-hover)",
                active: "var(--semantics-brand-bg-soft-active)",
              },
              glow: {
                DEFAULT: "var(--semantics-brand-bg-glow-default)",
                hover: "var(--semantics-brand-bg-glow-hover)",
                active: "var(--semantics-brand-bg-glow-active)",
              },
            },
            fg: {
              link: "var(--semantics-brand-fg-link)",
              bold: "var(--semantics-brand-fg-bold)",
              soft: "var(--semantics-brand-fg-soft)",
            },
            border: {
              1: "var(--semantics-brand-border-1)",
              2: "var(--semantics-brand-border-2)",
              3: "var(--semantics-brand-border-3)",
            },
          },
          error: {
            bg: {
              DEFAULT: "var(--semantics-error-bg-default)",
              hover: "var(--semantics-error-bg-hover)",
              active: "var(--semantics-error-bg-active)",
              soft: {
                DEFAULT: "var(--semantics-error-bg-soft-default)",
                hover: "var(--semantics-error-bg-soft-hover)",
                active: "var(--semantics-error-bg-soft-active)",
              },
              glow: {
                DEFAULT: "var(--semantics-error-bg-glow-default)",
                hover: "var(--semantics-error-bg-glow-hover)",
                active: "var(--semantics-error-bg-glow-active)",
              },
            },
            fg: {
              link: "var(--semantics-error-fg-link)",
              bold: "var(--semantics-error-fg-bold)",
              soft: "var(--semantics-error-fg-soft)",
            },
            border: {
              1: "var(--semantics-error-border-1)",
              2: "var(--semantics-error-border-2)",
              3: "var(--semantics-error-border-3)",
            },
          },
          warning: {
            bg: {
              DEFAULT: "var(--semantics-warning-bg-default)",
              hover: "var(--semantics-warning-bg-hover)",
              active: "var(--semantics-warning-bg-active)",
              soft: {
                DEFAULT: "var(--semantics-warning-bg-soft-default)",
                hover: "var(--semantics-warning-bg-soft-hover)",
                active: "var(--semantics-warning-bg-soft-active)",
              },
              glow: {
                DEFAULT: "var(--semantics-warning-bg-glow-default)",
                hover: "var(--semantics-warning-bg-glow-hover)",
                active: "var(--semantics-warning-bg-glow-active)",
              },
            },
            fg: {
              link: "var(--semantics-warning-fg-link)",
              bold: "var(--semantics-warning-fg-bold)",
              soft: "var(--semantics-warning-fg-soft)",
            },
            border: {
              1: "var(--semantics-warning-border-1)",
              2: "var(--semantics-warning-border-2)",
              3: "var(--semantics-warning-border-3)",
            },
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};

export default config;
