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
                mainBorder: '#dadce0'
            }
        },
    },
    plugins: [],
}

