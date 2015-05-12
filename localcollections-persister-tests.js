Tinytest.add('LocalCollectionPersister constructor always gives the same singleton object', function (test) {
  var obj1 = new LocalCollectionsPersister();
  var obj2 = new LocalCollectionsPersister();
  test.equal(obj1, obj2);
});

Tinytest.add('The factory creates local (unmanaged) collections', function(test){
  "use strict";
  var lcp = new LocalCollectionsPersister();
  var coll = lcp.createCollection("foo");
  test.instanceOf(coll, Mongo.Collection);
  test.isNull(coll._connection);
  test.isNull(coll._name);
});

Tinytest.add('The factory gives back existing collection when a new collection with same name is created', function(test){
  "use strict";
  var lcp = new LocalCollectionsPersister();
  var coll1 = lcp.createCollection("foo");
  var coll2 = lcp.createCollection("foo");
  var coll3 = lcp.createCollection("bar");
  test.equal(coll1, coll2);
  test.notEqual(coll2, coll3);
});