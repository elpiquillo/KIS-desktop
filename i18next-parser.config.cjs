const path = require('path');

module.exports = {
    locales: ['en', 'fr'],
    output: path.resolve(__dirname, 'src/locales/langs/$LOCALE/$NAMESPACE.json'), // Utilisation de path.resolve pour garantir le chemin correct
    useKeysAsDefaultValue: false,
    keySeparator: '.',
    namespaceSeparator: ':::',
    sort: true,
    createOldCatalogs: false,
  }
  