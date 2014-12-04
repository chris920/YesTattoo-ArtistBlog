
//http://stackoverflow.com/questions/5667888/counting-occurences-of-javascript-array-elements
Array.prototype.byCountWithCount= function(){
  var key, 
      counts;
  return _.reduce(this,function(counts,key){ counts[key]++; return counts },
                _.object( _.map( _.uniq(this), function(key) { return [key, 0] })));
}


var Image = require("parse-image");
var _ = require('underscore');
 
var editBooks = function(request, callback) {

  console.log('editBooks called with the request:');///clear
  console.log(request);///clear

  Parse.Cloud.useMasterKey(); 
  var query = new Parse.Query('Tattoo');
  query.get(request.params.tattooId)
    .then(function (tattoo) {
      console.log('editBooks tattoo add books');
      _.each(request.params.added, function (book) {
        tattoo.add('books', book);
      });
      return tattoo.save();
    })
    .then(function (tattoo) {
      console.log('editBooks tattoo remove books');
      var books = tattoo.attributes.books;
      _.each(request.params.removed, function (book) {
        var i = books.indexOf(book);
        if(i != -1) {
          books.splice(i, 1);
        }
      });
      return tattoo.save();
    })
    .then(function (tattoo) {
      console.log('editBooks tattoo fetch artist');
      var artist = tattoo.get('artistProfile');
      return artist.fetch();
    })
    .then(function (artist) {
      console.log('editBooks artist add books');
      console.log(artist);
      _.each(request.params.added, function (book) {
        artist.add('books', book);
      });
      return artist.save();
    })
    .then(function (artist) {
      console.log('editBooks artist remove books');
      var books = artist.attributes.books;
      _.each(request.params.removed, function (book) {
        var i = books.indexOf(book);
        if(i != -1) {
          books.splice(i, 1);
        }
      });
      return artist.save();
    })
    .then(function(result){
        console.log(result);
        callback.success(result);
      }, 
      function(error){
        console.log(error);
        callback.error(error);
    });
};

Parse.Cloud.define("books", function(request, response) {
  editBooks(request, {
    success: function(result) {
      response.success();
    },
    error: function(error) {
      response.error(error);
    }
  });
});


Parse.Cloud.define('featureArtist', function (request, response) {

  var artist;

  var query = new Parse.Query('ArtistProfile');
  query.get(request.params.id).then(function (profile) {

    artist = profile;

    query = new Parse.Query('ArtistProfile');
    query.exists('featureId');
    query.descending('featureId');
    return query.first();
  })
  .then( function (result) {

    // increment id, and set date artist will be featured
    artist.set('featureId', result.attributes.featureId + 1);
    artist.set('featureDate', new Date(result.attributes.featureDate.getTime() + 86400000));
    return artist.save();
  })
  .then(function(result) {
    response.success(result);
  }, function(error) {
    response.error(error);
  });
});

Parse.Cloud.beforeSave('ArtistProfile', function(request, response) {
  var profile = request.object;

  if (!profile.dirty("prof")) {
    // The profile photo isn't being modified.
    response.success();
    return;
  }
  Parse.Cloud.httpRequest({
    url: profile.get("prof").url()
  }).then(function(response) {
    var image = new Image();
    return image.setData(response.buffer);
  }).then(function(image) {
    // Crop the image to the smaller of width or height.
    var size = Math.min(image.width(), image.height());
    return image.crop({
      left: (image.width() - size) / 2,
      top: (image.height() - size) / 2,
      width: size,
      height: size
    });
  }).then(function(image) {
    // Resize the image to 64x64.
    return image.scale({
      width: 188,
      height: 188
    });
  }).then(function(image) {
    // Make sure it's a JPEG to save disk space and bandwidth.
    return image.setFormat("JPEG");
  }).then(function(image) {
    // Get the image data in a Buffer.
    return image.data();
  }).then(function(buffer) {
    // Save the image into a new file.
    var base64 = buffer.toString("base64");
    var cropped = new Parse.File("thumbnail.jpg", { base64: base64 });
    return cropped.save();
  }).then(function(cropped) {
    // Attach the image file to the original object.
    profile.set("profThumb", cropped);
  }).then(function(result) {
    response.success();
  }, function(error) {
    response.error(error);
  });
});


Parse.Cloud.afterSave('ArtistProfile', function(request) {
  var profile = request.object;
  var user = request.user;
  if (!profile.existed()) {
    var profileACL = new Parse.ACL(user);
    profile.setACL(profileACL);
    profileACL.setPublicReadAccess(true);
    profileACL.setRoleWriteAccess("Admin",true);
    profile.set('email', user.attributes.email);
    user.set('profile', profile);
    user.save();
    return;
  }
});

Parse.Cloud.beforeSave('UserProfile', function(request, response) {
  var profile = request.object;

  if (!profile.dirty("prof")) {
    // The profile photo isn't being modified.
    response.success();
    return;
  }
  Parse.Cloud.httpRequest({
    url: profile.get("prof").url()
  }).then(function(response) {
    var image = new Image();
    return image.setData(response.buffer);
  }).then(function(image) {
    // Crop the image to the smaller of width or height.
    var size = Math.min(image.width(), image.height());
    return image.crop({
      left: (image.width() - size) / 2,
      top: (image.height() - size) / 2,
      width: size,
      height: size
    });
  }).then(function(image) {
    // Resize the image to 64x64.
    return image.scale({
      width: 188,
      height: 188
    });
  }).then(function(image) {
    // Make sure it's a JPEG to save disk space and bandwidth.
    return image.setFormat("JPEG");
  }).then(function(image) {
    // Get the image data in a Buffer.
    return image.data();
  }).then(function(buffer) {
    // Save the image into a new file.
    var base64 = buffer.toString("base64");
    var cropped = new Parse.File("thumbnail.jpg", { base64: base64 });
    return cropped.save();
  }).then(function(cropped) {
    // Attach the image file to the original object.
    profile.set("profThumb", cropped);
  }).then(function(result) {
    response.success();
  }, function(error) {
    response.error(error);
  });
});

Parse.Cloud.afterSave('UserProfile', function(request) {
  var profile = request.object;
  var user = request.user;
  if (!profile.existed()) {
    var profileACL = new Parse.ACL(user);
    profile.setACL(profileACL);
    profileACL.setPublicReadAccess(true);
    profileACL.setRoleWriteAccess("Admin",true);
    user.set('userprofile', profile);
    user.save();
  }
});

Parse.Cloud.beforeSave("Tattoo", function(request, response) {
  var user = request.user;
  var tattoo = request.object;

  if (!tattoo.dirty("file")) {
    response.success();
    return;
  }

  var userACL = new Parse.ACL(user);
  userACL.setRoleWriteAccess("Admin",true);
  userACL.setPublicReadAccess(true);
  tattoo.setACL(userACL);

  Parse.Cloud.httpRequest({
    url: tattoo.get("file").url()
  }).then(function(response) {
    var image = new Image();
    return image.setData(response.buffer);
  }).then(function(image) {
    var width = Math.min(image.height() * 0.75, image.width());   
    var height = Math.min(image.width() * 1.33, image.height());
    if (width < 369 ) {
      return Parse.Promise.error("Choose a bigger image.");;
    }
    return image.crop({
      left: (image.width() - width) / 2,
      top: (image.height() - height) / 2,
      width: width,
      height: height
    });
  }).then(function(image) {
    tattoo.image = image
    return image.scale({ width: 369, height: 493 }); 
  }).then(function(image) {
    return image.setFormat("JPEG");
  }).then(function(image) {
    return image.data();
  }).then(function(buffer) {
    var base64 = buffer.toString("base64");
    var cropped = new Parse.File("thumbnail.jpg", { base64: base64 });
    return cropped.save();
  }).then(function(cropped) {
    tattoo.set("fileThumb", cropped);
  }).then(function() {
    return tattoo.image.scale({ width: 124, height: 166 });
  }).then(function(image) {
    return image.setFormat("JPEG");
  }).then(function(image) {
    return image.data();
  }).then(function(buffer) {
    var base64 = buffer.toString("base64");
    var cropped = new Parse.File("thumbnail.jpg", { base64: base64 });
    return cropped.save();
  }).then(function(cropped) {
    tattoo.set("fileThumbSmall", cropped);
  }).then(function(result) {
    response.success();
  }, function(error) {
    response.error(error);
  });
});

Parse.Cloud.beforeDelete("Tattoo", function(request, response) {
  console.log('beforeDelete tattoo called with the request:');///clear
  console.log(request);///clear
  var user = request.user;
  var tattoo = request.object;

  Parse.Cloud.useMasterKey();
  console.log('beforeDelete tattoo fetch artist');///clear
  var artist = tattoo.get('artistProfile');
  artist.fetch().then(function (artist) {
    console.log('removing books from artist: ' + tattoo.get('books'));///clear
    var books = artist.attributes.books;
    _.each(tattoo.get('books'), function (book) {
      var i = books.indexOf(book);
      if(i != -1) {
        books.splice(i, 1);
      }
    });
    return artist.save();
  }).then(function() {
    var query = new Parse.Query('Add');
    query.equalTo('tattoo', tattoo);
    return query.find();
  }).then(function(adds){
    console.log(adds);///clear
    return Parse.Object.destroyAll(adds);
  }).then(function(result) {
    console.log(result);
    return response.success();
  }, function(error) {
    return response.error(error);
  });

});

Parse.Cloud.beforeSave("Add", function(request, response) {
  var user = request.user;
  var add = request.object;
  Parse.Cloud.useMasterKey();

  if (!add.existed()) {
    var userACL = new Parse.ACL(user);
    add.setACL(userACL);
    add.set('user', user);
    userACL.setRoleWriteAccess("Admin",true);
    userACL.setPublicReadAccess(true);

    var query = new Parse.Query('Add');
    query.equalTo('user', user);
    query.equalTo('tattooId', add.attributes.tattooId);
    query.count().then(function(count){
      if( count > 0 ){
        response.error(JSON.stringify('Tattoo already added'));
      } else {
        var artistProfile;
        var collectors;
        add.attributes.artistProfile.fetch().then(function(profile){
          artistProfile = profile;
          collectors = profile.relation('collectors');
          var query = collectors.query();
          query.equalTo('user', user);
          return query.count();
        }).then(function(count){
          if( count < 1 ) {
            collectors.add(user.attributes.userprofile);
            artistProfile.increment("collectorCount");
            artistProfile.save();
            return add;
          } else {
            console.log('artist already added');
            return add;
          }
        }).then(function(result) {
          response.success(result);
        }, function(error) {
          response.error(error);
        });
      }
    });

  } else if (add.dirty('books')) {
    var oldBooks = add.get('oldBooks');
    var newBooks = add.get('books');
    var removed = _.difference(oldBooks, newBooks);
    var added = _.difference(newBooks, oldBooks);

    editBooks({params: {added: added, removed: removed, tattooId: add.get('tattooId')}}, {
      success: function(result) {
        add.set('oldBooks', newBooks);
        response.success();
      },
      error: function(error) {
        console.log(error);
        response.error();
      }
    });
  } else {
    response.success();
  }
});

Parse.Cloud.beforeDelete("Add", function(request, response) {
  console.log('beforeDelete Add called with the request:');///clear
  console.log(request);///clear

  var add = request.object;
  Parse.Cloud.useMasterKey();

  editBooks({params: {added: [], removed: add.get('books'), tattooId: add.get('tattooId')}}, {
    success: function(result) {
      console.log(result);
    },
    error: function(error) {
      console.log(error);
    }
  });

  var userProfile;
  add.attributes.user.fetch().then(function(user){
    userProfile = user.attributes.userprofile;

    var query = new Parse.Query('Add');
    query.equalTo('user', add.attributes.user);
    query.equalTo('artistProfile', add.attributes.artistProfile);
    return query.count();
  }).then(function(count){
    if (count <= 1) {
      add.attributes.artistProfile.fetch().then(function(profile){
        profile.increment("collectorCount", -1);
        var collectors = profile.relation('collectors');
        collectors.remove(userProfile);
        return profile.save();
      }).then(function(result) {
        console.log(result);
        return response.success();
      }, function(error) {
        return response.error(error);
      });
    } else {
      return response.success();
    }
  }).then(function(result) {
    console.log(result);
  }, function(error) {
    console.log(error);
  });
});


////// daily jobs

Parse.Cloud.job("updateGlobalBooks", function(request, status) {
  Parse.Cloud.useMasterKey();

  var that = this;
  var bookSets = [];
  var bookArray = [];
  var newBooks = [];
  // var allBooksByCount = [];
  var allBooksByCountWithCount = [];
  var query = new Parse.Query('ArtistProfile');
  // TODO ~ Need to implement a query skip once over 1k artists
  query.limit(1000);
  query.find().then(function(artists){

    //query all artists and get books///clear
    _.each(artists, function(artist) {
        bookSets.push(artist.get('books'));
    });
    console.log(bookSets);///clear

    //removes the undefined values and flattens to one array///clear
    bookArray = _.flatten(_.compact(bookSets));
    console.log(bookArray);///clear

    //converts the array into an object with the book name key and the count as the value///clear
    // allBooksByCountWithCount = bookArray.byCountWithCount();///clear
    var key,
      counts;
    allBooksByCountWithCount = _.reduce(bookArray,function(counts,key){ counts[key]++; return counts },
                _.object( _.map( _.uniq(bookArray), function(key) { return [key, 0] })));

    console.log('allBooksByCountWithCount = ');///clear
    console.log(allBooksByCountWithCount);///clear

    var globalBookQuery = new Parse.Query('GlobalBook');
    globalBookQuery.limit(1000);
    return globalBookQuery.find();
  }).then(function(globalBooks) {
    that.globalBooks = globalBooks;

    //get the names of each book in an array ///clear
    var globalBookNames= [];
    _.each(globalBooks, function(globalBook) {
      var name = globalBook.get('name');
      globalBookNames.push(name);
    });

    //gets the GlobalBooks that have not been created yet ///clear
    var newBooks = _.unique(_.difference(bookArray, globalBookNames));
    console.log('Making the new books: ');///clear
    console.log(newBooks);///clear
    //Creates new objects and assigns the name & picture URL ///clear
    var GlobalBook = Parse.Object.extend("GlobalBook");
    _.each(newBooks, function(book){
      var newGlobalBook = new GlobalBook();
      newGlobalBook.set('name', book);
      newGlobalBook.set('pics', []);
      newGlobalBook.set('assignedPics', []);
      that.globalBooks.push(newGlobalBook);
    });

    //Update the pictures if there is no assigned and under 6
    var picPromises = [];
    _.each(that.globalBooks, function(globalBook){
      var picsLength = globalBook.get('pics').length;
      var assignedPicLength = globalBook.get('assignedPics').length;
      if (picsLength < 6 && assignedPicLength < 1) {
        var query = new Parse.Query("Tattoo");
        query.equalTo('books', globalBook.get('name'));
        query.limit(6 - picsLength);
        var promise = query.find();
        promise.then(function(tattoos){
          _.each(tattoos, function(tattoo){
            var pic = tattoo.get('fileThumb');
            globalBook.add('pics',pic);
          });
        });
        picPromises.push(promise);
      }
    });
    return Parse.Promise.when(picPromises);

  }).then(function () {
    var promises = [];
    //Sets the count from the all count object ///clear
    //Filters down to the matching books sets and removes duplicates. ///clear
    _.each(that.globalBooks, function(globalBook) {
      var name = globalBook.get('name');
      var count = allBooksByCountWithCount[name];
      globalBook.set('count', count);
      // var matchingBookSets = _.filter(bookSets, function(bookSet){ 
      //   return _.contains(bookSet, name);
      // });
      // var bookMatches = _.unique(_.flatten(matchingBookSets));
      // globalBook.set('bookMatches', bookMatches);
      promises.push(globalBook.save());
    });
    return Parse.Promise.when(promises);
  }).then(function() {
    status.success("Books updated.");
  }, function() {
     status.error("Botched, something went wrong.");
  });
});



/////// DB Fix, one time only jobs

//adds the emails to the artist profiles.
Parse.Cloud.job("addEmail", function(request, status) {
  Parse.Cloud.useMasterKey();
  var counter = 0;
  var query = new Parse.Query("ArtistProfile");
  query.include('user');
  query.each(function(profile) {
      if(profile.attributes.email === ""){
        var tojson = profile.attributes.user.toJSON();
        var email = tojson.email;

        profile.set("email", email);
      }

      if (counter % 100 === 0) {
        status.message(counter + " users processed.");
      }
      counter += 1;
      return profile.save();
  }).then(function() {
    status.success("Emails added.");
  }, function(error) {
    status.error("Uh oh, something went wrong.");
  });
});

//set tattoo ACL
Parse.Cloud.job("tattooACL", function(request, status) {
  Parse.Cloud.useMasterKey();
  var counter = 0;
  var query = new Parse.Query("Tattoo");
  query.each(function(tattoo) {
      var acl = tattoo.get("ACL");
      acl.setRoleWriteAccess("Admin",true);
      if (counter % 100 === 0) {
        status.message(counter + " tattoos processed.");
      }
      counter += 1;
      return tattoo.save();
  }).then(function() {
    status.success("tattoo ACL added.");
  }, function(error) {
    status.error("Uh oh, something went wrong.");
  });
});

//get artist profile from user, all tattoos are uploaded by artist at this point
Parse.Cloud.job("addArtistProfile", function(request, status) {
  Parse.Cloud.useMasterKey();
  var counter = 0;
  var query = new Parse.Query("Tattoo");
  query.include('artist');
  query.each(function(tattoo) {

      if(tattoo.attributes.artistProfile === undefined){
        var artist = tattoo.attributes.artist;
        var artistProfile = artist.get("profile");
        tattoo.set("artistProfile", artistProfile);
      }

      if (counter % 100 === 0) {
        status.message(counter + " tattoos processed.");
      }
      counter += 1;
      return tattoo.save();
  }).then(function() {
    status.success("artist profile added.");
  }, function(error) {
    status.error("Uh oh, something went wrong.");
  });
});

//deletes the artists books on tattoos
Parse.Cloud.job("tattooEmptyArtistBooks", function(request, status) {
  Parse.Cloud.useMasterKey();
  var counter = 0;
  var query = new Parse.Query("Tattoo");
  query.include('artist');
  query.each(function(tattoo) {

      if(tattoo.attributes.artistBooks === undefined){
        var emptyArray = [];
        tattoo.set("artistBooks", emptyArray);
      }

      if (counter % 100 === 0) {
        status.message(counter + " tattoos processed.");
      }
      counter += 1;
      return tattoo.save();
  }).then(function() {
    status.success("books emptied.");
  }, function(error) {
    console.log(error);
    status.error("Uh oh, something went wrong.");
  });
});

//deletes location for artists that have been set to the default
Parse.Cloud.job("emptyLocation", function(request, status) {
  Parse.Cloud.useMasterKey();
  var counter = 0;
  var query = new Parse.Query("ArtistProfile");
  query.each(function(profile) {

      if(profile.attributes.address === ''){
        profile.unset("location");
        profile.set("locationName", "");
      }

      if (counter % 100 === 0) {
        status.message(counter + " profiles processed.");
      }
      counter += 1;
      return profile.save();
  }).then(function() {
    status.success("location cleared.");
  }, function(error) {
    status.error("Uh oh, something went wrong.");
  });
});

//deletes the artist's books
Parse.Cloud.job('addBooksToArtistsProfile', function (request, status) {
  Parse.Cloud.useMasterKey();
  console.log('Running ArtistProfile upgrade');
  var query = new Parse.Query('ArtistProfile');
  query.each(function (artist) {
    if (!artist.attributes.books) {
      artist.set('books', []);
    }
    return artist.save();
  })
  .then(function () {
    status.success('Books added to ArtistProfile');
  },
  function (error) {
    status.error('Failed to update ArtistProfile');
  });
});



/////// Upgrade live, one time only jobs

Parse.Cloud.job('setArtistFeatureId', function (request, status) {
  Parse.Cloud.useMasterKey();
  console.log('Running featured artist update ...');

  var today = new Date()
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  today.setMilliseconds(0);
  var count = 0;

  var query = new Parse.Query('ArtistProfile');
  query.containedIn("featuremonth", ["1","2","3","4","5","6","7","8","9","10","11","12"]);
  query.ascending('createdAt');
  query.find().then(function (artists) {

    today = new Date(today.getTime() - (artists.length * 86400000));

    var updates = [];
    for (var i = 0; i < artists.length; i++) {
      var artist = artists[i];

      count += 1;
      artist.set('featureId', count);
      
      today = new Date(today.getTime() + 86400000);
      artist.set('featureDate', today);
      
      updates.push(artist.save());
    }
    return Parse.Promise.when(updates);
  })
  .then(function () {
      status.success('Artists featured id updated');
    },
    function (error) {
      status.error('Failed to update featured id');
  });
});


Parse.Cloud.job('updateArtistAndTattooBooks', function (request, status) {
  Parse.Cloud.useMasterKey();

  //Empties all of the adds on the artist profile and tattoos
  var query = new Parse.Query('ArtistProfile');
  query.limit(1000);
  query.find().then(function (artists) {
    var artistClearPromises = [];
    _.each(artists, function(artist){
      artist.set('books', []);
      artistClearPromises.push(artist.save())
    });
    return Parse.Promise.when(artistClearPromises);
  }).then(function(){
    var query = new Parse.Query('Tattoo');
    query.limit(1000);
    return query.find();
  }).then(function(tattoos){
    var tattooClearPromises = [];
    _.each(tattoos, function(tattoo){
      tattoo.set('books', []);
      tattooClearPromises.push(tattoo.save())
    });
    return Parse.Promise.when(tattooClearPromises);
  }).then(function(){
    var query = new Parse.Query('Tattoo');
    query.limit(1000);
    query.skip(1000);
    return query.find();
  }).then(function(tattoos){
    var tattooClearPromises = [];
    _.each(tattoos, function(tattoo){
      tattoo.set('books', []);
      tattooClearPromises.push(tattoo.save())
    });
    return Parse.Promise.when(tattooClearPromises);
  }).then(function(){
    //Gets all of the Adds and adds each book
    var query = new Parse.Query('Add');
    query.limit(1000);
    query.include('artistProfile');
    query.include('tattoo');
    return query.find();
  }).then(function(adds){
    var addPromises = [];
    _.each(adds, function(add) {
      console.log('ADDING BOOKS FROM THE ADD: ');///clear
      console.log(add);///clear
      var books = _.flatten(add.get('books'));
      var artist = add.get('artistProfile');
      var tattoo = add.get('tattoo');
      //checks for the artist and tattoo before adding, hack for demo broken data
      if (artist && tattoo && books) {
        _.each(books, function(book){
          artist.add('books', book);
          tattoo.add('books', book);
        });
      };
      addPromises.push(add.save());
    });
    return Parse.Promise.when(addPromises);
  }).then(function(){
    //Updates the second 1k adds
    var query = new Parse.Query('Add');
    query.limit(1000);
    query.skip(1000);
    query.include('artistProfile');
    query.include('tattoo');
    return query.find();
  }).then(function(adds){
    var addPromises = [];
    _.each(adds, function(add) {
      var books = _.flatten(add.get('books'));
      var artist = add.get('artistProfile');
      var tattoo = add.get('tattoo');
      if (artist && tattoo && books) {
        _.each(books, function(book){
          artist.add('books', book);
          tattoo.add('books', book);
        });
      };
      addPromises.push(add.save());
    });
    return Parse.Promise.when(addPromises);
  }).then(function () {
    status.success('Books updated');
  },
  function (error) {
    status.error('Failed to update Books');
  });
});


Parse.Cloud.job('setArtistProfileRelationships', function (request, status) {
  Parse.Cloud.useMasterKey();
  console.log('Running artist profile relationship update ...');

  var query = new Parse.Query('ArtistProfile');
  query.find().then(function (artists) {
    var updates = [];
    for (var i = 0; i < artists.length; i++) {
      var artist = artists[i];

      var tattooRelation = artist.relation('tattoos');
      var tattoosQuery = new Parse.Query('Tattoo');
      tattoosQuery.equalTo('artistProfile', artist);
      tattoosQuery.each(function(tattoos){
        tattooRelation.add(tattoos);
      });
      
      var collectorRelation = artist.relation('collectors');
      var addQuery = new Parse.Query('Add');
      addQuery.equalTo('artistProfile', artist);
      addQuery.include('user');
      addQuery.include(['user.userProfile']);
      addQuery.each(function(add){
          collectorRelation.add(add.attributes.user.attributes.userProfile);
        });

      });

      updates.push(artist.save());
    }
    return Parse.Promise.when(updates);
  })
  .then(function () {
      status.success('Artists relations updated');
    },
    function (error) {
      status.error('Failed to update relations');
  });
});