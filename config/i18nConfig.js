const i18n = require('i18n');

i18n.configure({
    locales: ['en', 'tr'], // Define your supported languages
    directory: __dirname + '/../locales', // Path to your translation files
    defaultLocale: 'en',
    objectNotation: true,
});

module.exports = i18n;