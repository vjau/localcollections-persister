#LocalCollections-Persister

A meteor package that allow local (unmanaged) Collections to persist between hot codes pushes, like Session or Reactive-dict.

Installation
------------

For whole app availability : 

```js
meteor add vjau:localcollections-persister
```

or require it in your packages with the usual line in your package.js :

```js
use('vjau:localcollections-persister','client');
```

Since hot code pushes only make sense in the browser, it's only available on the client.

Usage
-----

### Getting the factory
The package export a single constructor, LocalCollectionsPersister.
Calling the constructor with new create a factory/manager  which create the collections for the user and manage their migration during hot code pushes.
The factory/manager is a singleton so calling the constructor multiples times always gives the same object.

```js
var factory1 = new LocalCollectionsPersister();
var factory2 = new LocalCollectionsPersister();
console.log(factory1===factory2);
// true
```

### Creating the Collections
For the Local Collections to be created, you have to create them through the factory with the createCollection(name, options) method.

```js
var factory = new LocalCollectionsPersister();
var fooColl = factory.createCollection("foo");
console.log(fooColl instanceOf Mongo.Collection);
// true
```
Contrary to a reactive-dict, creating two collections with the same name gives you one unique collection. This is useful to get a grip on a collection instance programmaticaly, and also mandatory for the package to work.

```js
var factory = new LocalCollectionsPersister();
var fooColl1 = factory.createCollection("foo");
var fooColl2 = factory.createCollection("foo");
console.log(fooColl1===fooColl2);
// true
```

### Enjoying hot codes pushes persistence
That's the easy part ;)

```js
var factory = new LocalCollectionsPersister();
var fooColl = factory.createCollection("foo");
fooColl.insert({a:1});
// after a hot code push to your unsuspecting users
fooColl.findOne({});
// {a:1}
// it works !
```
	

Options
-------
You can pass the usual options accepted by the Mongo.Collection constructor. Please keep in mind that LocalCollection can't have a connection.

```js
var factory = new LocalCollectionsPersister();
var transform = function(doc){
  doc.getFoo = function(){
    return "foo";
  };
};
var fooColl = factory.createCollection("foo", {transform : transform});
```

Why this package ?
------------------

Preservation of session state between hot code pushes is a nice feature of Meteor, however Session (==global) is only for small (toy) projects. Reactive-dict is a nice replacement but with it, transparent reactivity only works with the simplest scenarios, ie with single key/primitives.

```js
var rd = new ReactiveDict("foo");
rd.set("simpleFlag", true);
var isFlagOn = function(){
	return rd.get("simpleFlag");
}
// isFlagOn is a reactive dataSource
```

When you need a collection of some sort, reactive-dict doesn't make the trick.
There are a few alternatives like Reactive-Array which is cool, but doesn't support hot code pushes. When you want to do some filtering on your arrays, or editing of your objects in place,  reactivity doesn't work anymore.

As explained on minimongo's "why" :
>	Pretty soon you've invented your own database API for working with the data.
>	This homebrew database API ends up trying to do the same thing as any other database API, but it does it poorly, because you're not a database API designer

To store your objects that are not yet ready to be written in the "real" database, what better solution than to store them in a temporary client side database that will only persist during the session ? That way, you can access them however you want, with lookup, filtering, sorting.... all transparently reactive with the power of meteor mongo reactivity.

What this package is not ?
--------------------------
This package persist only the collections for the duration of the session. For full (real)  client side persistence, that persist between browser runs (and manual reload), you can try the more ambitious (but probably overkill to just store session state) [GroundDB](https://github.com/GroundMeteor/db)  package.

