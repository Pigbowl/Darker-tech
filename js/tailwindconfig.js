tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#0e0e0e',
                SOP: '#53C93D',
                DEV: '#D0D631',
                PLAN: '#E13F25',
                secondary: '#00B42A',
                accent: '#FF7D00',
                logoup: '#7B61FF',
                logobuttom:'#14F195',
                logotext:'#14F195',
                JW: '#F7FF11',
                dark: '#1a1a2e',
                'dark-light': '#2a2a4a',
                neon: '#00f7ff',
                purple: '#9d4edd',
                'purple-dark': '#5a189a',
                'light-blue': '#38BDF8',
                light: '#F7F8FA',
                ban:'#B2B2B2',
                EUF:"#78CFDE",
                MF:"#6AB6B9",
                TF:"#71A6DE",
                highlight: '#67F31B',
                highlight2: '#E5EB7D',
                top: '#EF9437',
                mid: '#45E1C2',
                bottom: '#818cf8',
                'tech-dark': '#0a1128',
                'tech-medium': '#122340',
                'tech-light': '#1e3a6f',
                'tech-accent': '#00f0ff',
                'tech-highlight': '#4facfe',
                'neon-pink': '#ff2a6d',
                'neon-yellow': '#feca57',
                'light-blue':'#00f0ff',
                'light2-blue':'#00f0f8',
                colorpri: '#0A0E17',
                colorsec: '#1A1F2B',
                logoup: '#7B61FF',
                logobuttom: '#14F191',
                darkAccent: '#0F172A',
                container:'#00ffea7a',
                box:'#302b2b',
                applybutton:'#165DFF',
            },
            fontFamily: {
                inter: ['Inter', 'sans-serif'],
                sans: ['Inter', 'system-ui', 'sans-serif'],
                'tech': ['Segoe UI', 'Roboto', 'sans-serif'],
                techoo: ['Orbitron', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
                'float': 'float 6s ease-in-out infinite',
                'float2': 'float 3s ease-in-out infinite',
            },
            boxShadow: {
                'card': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
                'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            },
            spacing: {
                'drawer': '280px', // 子卡片抽屉宽度
            },
            backgroundImage: {
                'tech-grid': "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300f0ff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
            },
            keyframes: {
                glow: {
                    '0%': { 'box-shadow': '0 0 5px rgba(22, 93, 255, 0.5)' },
                    '100%': { 'box-shadow': '0 0 20px rgba(22, 93, 255, 0.8), 0 0 30px rgba(22, 93, 255, 0.6)' }
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
            }
        }
    }
}