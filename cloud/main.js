
Parse.Cloud.afterSave(Parse.User, function(request) {
  var user = request.user;
  if (!user.existed()) {
    var userACL = new Parse.ACL(user);
    user.setACL(userACL);
    user.save().then(function() {
        console.log('acl success')
      }, function(error) {
        console.log(error);
      });
  }
});

var Image = require("parse-image");
 

//////// Create profile picture thumbnail
Parse.Cloud.beforeSave('ArtistProfile', function(request, response) {
  var user = request.object;
  if (!user.dirty("prof")) {
    // The profile photo isn't being modified.
    response.success();
    return;
  }
  Parse.Cloud.httpRequest({
    url: user.get("prof").url()
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
    user.set("profThumb", cropped);
  }).then(function(result) {
    response.success();
  }, function(error) {
    response.error(error);
  });
});

//////// Create profile picture thumbnail
Parse.Cloud.beforeSave('UserProfile', function(request, response) {
  var user = request.object;
  if (!user.dirty("prof")) {
    // The profile photo isn't being modified.
    response.success();
    return;
  }
  Parse.Cloud.httpRequest({
    url: user.get("prof").url()
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
    user.set("profThumb", cropped);
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
    profile.set('username', user.attributes.username);
    profile.set('userId', user.id);
    user.set('userprofile', profile);
    profile.save();
    user.save();
  }
});

Parse.Cloud.afterSave('ArtistProfile', function(request) {
  var profile = request.object;
  var user = request.user;
  if (!profile.existed()) {
    var profileACL = new Parse.ACL(user);
    profile.setACL(profileACL);
    profileACL.setPublicReadAccess(true);
    profileACL.setRoleWriteAccess("Admin",true);
    profile.set('username', user.attributes.username);
    user.set('profile', profile);
    profile.save();
    user.save();
  }
});

//////// Create tattoo picture thumbnail
Parse.Cloud.beforeSave("Tattoo", function(request, response) {
  var tattoo = request.object;
  if (!tattoo.dirty("file")) {
    response.success();
    return;
  }
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

Parse.Cloud.afterSave("Tattoo", function(request) {
  console.log('after tattoo save triggered');
  var user = request.user;
  var tattoo = request.object;
  if (!tattoo.existed()) {
    console.log('tattoo did not exist.');
    var userACL = new Parse.ACL(user);
    tattoo.setACL(userACL);
    tattoo.setRoleWriteAccess("Admin",true);
    userACL.setPublicReadAccess(true);
    tattoo.save();
    console.log('tattoo saved');
  }
});

Parse.Cloud.afterSave("Add", function(request) {
  var user = request.user;
  var add = request.object;
  if (!add.existed()) {
    var userACL = new Parse.ACL(user);
    add.setACL(userACL);
    add.setRoleWriteAccess("Admin",true);
    userACL.setPublicReadAccess(true);
    add.save();
  }
});