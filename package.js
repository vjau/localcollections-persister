Package.describe({
  name: 'vjau:localcollections-persister',
  version: '0.0.1',
  summary: 'persist local (unmanaged) collections between hot code pushes',
  git: 'https://github.com/vjau/localcollections-persister',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.use('reload','client');
  api.use('mongo','client');
  api.addFiles('localcollections-persister.js','client');
  api.export('LocalCollectionsPersister','client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('vjau:localcollections-persister');
  api.addFiles('localcollections-persister-tests.js','client');
});
