var Image = require("parse-image");
var _ = require('underscore');

Parse.Cloud.beforeSave(Parse.User, function(request, response) {
  var user = request.user;
  if (user !== null) {
    var userACL = new Parse.ACL(user);
    user.setACL(userACL);
    response.success();
  } else {
    response.success();
  }
});
 
Parse.Cloud.beforeSave('ArtistProfile', function(request, response) {

  var profile = request.object;
  var user = request.user;

  if (!profile.existed()) {
    var profileACL = new Parse.ACL(user);
    profile.setACL(profileACL);
    profileACL.setPublicReadAccess(true);
    profileACL.setRoleWriteAccess("Admin",true);
    profile.set('username', user.attributes.username);
    profile.set('email', user.attributes.email);
    profile.set('name', user.attributes.username);
    profile.set('user', user);
    user.set('profile', profile);
    user.save();
    response.success();
    return;
  }

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

Parse.Cloud.beforeSave('UserProfile', function(request, response) {

  var profile = request.object;
  var user = request.user;

  if (!profile.existed()) {
    var profileACL = new Parse.ACL(user);
    profile.setACL(profileACL);
    profileACL.setPublicReadAccess(true);
    profileACL.setRoleWriteAccess("Admin",true);
    profile.set('username', user.attributes.username);
    profile.set('name', user.attributes.username);
    profile.set('user', user);
    user.set('userprofile', profile);
    user.save();

    response.success();
    return;
  }

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


Parse.Cloud.beforeSave("Add", function(request, response) {
  var user = request.user;
  var add = request.object;

  if (!add.existed() && user.attributes.role === 'user') {
    var userACL = new Parse.ACL(user);
    add.setACL(userACL);
    add.set('user', user);
    userACL.setRoleWriteAccess("Admin",true);
    userACL.setPublicReadAccess(true);

    Parse.Cloud.useMasterKey();

    var artistProfile;
    var collectors;

    add.attributes.artistProfile.fetch().then(function(profile){
      artistProfile = profile;
      collectors = profile.relation('collectors');

      var query = collectors.query();
      query.equalTo('user', user);
      return query.find();

    }).then(function(prof){
      console.log('prof from collectors')
      if( prof.length < 1 ) {
        collectors.add(user.attributes.userprofile)
        artistProfile.increment("collectorCount")
        return artistProfile.save();
      } else {
        console.log('artist already added');
        return;
      }
    }).then(function(result) {
      response.success();
    }, function(error) {
      response.error(error);
    });
  } else {
      response.success();
  }
});

Parse.Cloud.define("add", function(request, response) {
    Parse.Cloud.useMasterKey(); 
    var query = new Parse.Query('Tattoo');
    query.get(request.params.tattooId).then(function(tattoo){
      _.each(request.params.added, function(book) {
        tattoo.add('books', book);
      });
      return tattoo.save();
    }).then(function(tattoo){      
      var books = tattoo.attributes.books;
      _.each(request.params.removed, function(book) {
        var i = books.indexOf(book);
        if(i != -1) {
          books.splice(i, 1);
        }
      });
      return tattoo.save();
    }).then(function(result){
      console.log(result);
      response.success(result);
    }, function(error){
      console.log(error);
      response.error(error);
    });
});


////// database update jobs

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