import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            colors: {
                'primary-bg': '#226185',
                'secondary-bg' : '#94d5ea',
                'app-complete' : '#727171',
                'app-coming': '#eb3710'
            },
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
                lily: ['Lily Script One', ...defaultTheme.fontFamily.sans]
            },
        },
    },

    plugins: [forms],
};
