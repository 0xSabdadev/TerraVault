/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        // './node_modules/flowbite-react/lib/**/*.js',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/**/*.{js,ts,jsx,tsx,mdx}',
        './public/**/*.html',
        './node_modules/flowbite/**/*.js',
    ],
    theme: {
        fontFamily: {
            roboto: ['Roboto Mono', 'monospace'],
        },
        extend: {
            colors: {
                purplemain: '#2F305E', //greenmain
                purplelight: '#F1F3FF', //greendark
                purpledark: '#6B42FE', //greenwood#9D71E8
                purplemiddle: '#A742E9',
                grey: '#F3F4F6',
                orange: '#FD9D46',
                light: '#F1E7FF', // dark
                lightmain: { // dark main
                    300: '#F8F7FF;',
                    500: '#E5E5FD;', 
                    800: '#FFFFFF;',
                },
            },
        },
    },
    plugins: [require('flowbite/plugin')],
}
