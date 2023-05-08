/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                theme: '#0681FA',
                mainBg: '#F2F2F2',
                darkText: '#222222',
                lightText: '#454545',
                mainBorder: '#dadce0',
                themeHover: '#1A73E8',
            },
            screens: {
                xs: '360px'
            },
            boxShadow: {
                mainShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
            }
        },
    },
    plugins: [],
}

