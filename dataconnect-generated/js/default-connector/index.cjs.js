const { validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'my-hilti-store-app',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

