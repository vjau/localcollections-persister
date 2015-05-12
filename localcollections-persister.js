/*global Reload, Mongo, LocalCollectionsPersister:true */

//closure for the singleton instance
var instance;
/**
 *
 * Singleton constructor
 * @constructor
 */
LocalCollectionsPersister = function(){
  "use strict";
  if (!instance){
    instance = this;
  } else {
    return instance;
  }
  this._collections = {};
};

/**
 *
 * @param name {string}
 * @returns {Mongo.Collection}
 */
LocalCollectionsPersister.prototype.createCollection = function(name){
  "use strict";
  if (this._collections[name]){
    return this._collections[name];
  }
  /**
   *
   * @type {Mongo.Collection}
   */
  var coll = new Mongo.Collection(null);
  var collsToRestore = Reload._migrationData('localcollections-persister') && Reload._migrationData('localcollections-persister').collections;
  var objectsToRestore = collsToRestore && collsToRestore[name];
  if (Array.isArray(objectsToRestore)){
    objectsToRestore.forEach(function(obj){
      coll.insert(obj);
    });
  }
  /**
   * @dict
   * @type {Object<string, Mongo.Collection>}
   */
  this._collections[name] = coll;
  return coll;
};

/**
 *
 * @returns {Object<string, Mongo.Collection>}
 */
LocalCollectionsPersister.prototype.getCollections = function(){
  "use strict";
  return this._collections;
};

//Register the function responsible for saving the collection content before incoming hot code push
Reload._onMigrate('localcollections-persister', function () {
  "use strict";
  var LCPersister = new LocalCollectionsPersister();
  var collsToMigrate = LCPersister.getCollections();
  var dataToMigrate = {};

  Object.keys(collsToMigrate).forEach(function(name){
    dataToMigrate[name] = collsToMigrate[name].find().fetch();
  });


  return [true, {collections: dataToMigrate}];
});