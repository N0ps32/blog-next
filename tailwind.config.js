module.exports = {
    purge: [
        './pages/**/*.tsx',
        './components/**/*.tsx'
    ],
    variants: {
        extend: {
            inset: ['focus'],
        }
    },
    theme: {
        colors: {
            gray: {
                light: '#f6f6f6',
                'very-light': '#f3f3f3',
                middle: '#dad8d8',
                DEFAULT: '#808080',
                dark: '#2d2d2d',
            },
            blue: {
                DEFAULT: '#01579a',
                dark: '#014e8a',
            },
            transparent: 'transparent',
            white: '#ffffff',
            red: '#ff0000',
            black: '#000000',
        },
        fontFamily: {
            sans: ['Roboto', 'sans-serif'],
        },
        extend: {
            keyframes: {
                slideRight: {
                    '0%': {transform: 'translate3d(-100%, 0, 0)'},
                    '100%': {transform: 'translate3d(0, 0, 0)'},
                }
            },
            animation: {
                'slide-right': "slideRight 0.2s linear"
            },
            screens: {
                '2xl': '1280px'
            },
        }
    }
}
