
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '1rem',
			screens: {
				'2xl': '768px' // Mobile-focused, so capping at tablet width
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Cyberpunk theme colors
				cyber: {
					'neon': '#0fff50',     // Bright neon green
					'blue': '#0031ad',     // Deep blue
					'purple': '#6e00ff',   // Purple
					'pink': '#ff00ea',     // Pink
					'dark': '#121212',     // Dark background
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				"pulse-glow": {
					"0%, 100%": { boxShadow: "0 0 8px 0 rgba(15, 255, 80, 0.7)" },
					"50%": { boxShadow: "0 0 20px 6px rgba(15, 255, 80, 0.7)" },
				},
				"gradient-flow": {
					"0%": { backgroundPosition: "0% 50%" },
					"50%": { backgroundPosition: "100% 50%" },
					"100%": { backgroundPosition: "0% 50%" },
				},
				"scanline": {
					"0%": { transform: "translateY(0)" },
					"100%": { transform: "translateY(100vh)" },
				},
				"flicker": {
					"0%": { opacity: "0.8" },
					"50%": { opacity: "1" },
					"100%": { opacity: "0.8" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"pulse-glow": "pulse-glow 2s infinite",
				"gradient-flow": "gradient-flow 5s ease infinite",
				"scanline": "scanline 8s linear infinite",
				"flicker": "flicker 0.5s ease-in-out infinite",
			},
			backgroundImage: {
				'cyber-gradient': 'linear-gradient(135deg, #0031ad 0%, #0fff50 100%)',
				'cyber-dark-gradient': 'linear-gradient(135deg, #121212 0%, #0c2b2b 100%)',
				'cyber-grid': 'linear-gradient(rgba(15, 255, 80, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 255, 80, 0.1) 1px, transparent 1px)',
			},
			boxShadow: {
				'neon': '0 0 5px #0fff50, 0 0 10px #0fff50, 0 0 15px #0fff50',
				'neon-sm': '0 0 2px #0fff50, 0 0 4px #0fff50',
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
