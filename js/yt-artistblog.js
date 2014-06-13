

Parse.$ = jQuery;

// Initialize Parse with DEMO Parse application javascript keys
Parse.initialize("ROfcxRBpwDCFNI4DZluo4Q6okc6cFzUHgqOURSCf",
               "NI5bHQ6J0aCD4rc95ORxuFAtAIZLpLNDLRLuCrwY");


var App = new (Parse.View.extend({
	Models: {},
	Views: {},
	Collections: {},
	events: {
		//simplifies html to use routers where needed
		"click [href^='/']": function(e){
			e.preventDefault();
			Parse.history.navigate(e.target.pathname, {trigger: true});
			$("html, body").animate({ scrollTop: 0 }, 200);
		},
		//above target.pathname does not work for buttons.... Need to move to the view
		"click [href='/about']": function(e){
			e.preventDefault();
			Parse.history.navigate('/about', {trigger: true});
			$("html, body").animate({ scrollTop: 0 }, 200);
		},
		"click #logout": "logout"
	},
	id: 'nav',
	template: _.template($("#navTemplate").html()),
	renderNav: function() {
		var html = this.template();
		$(this.el).append(html);
		return this;
	},
	start: function(){
		Parse.history.start({pushState: false, root: '/'});
		this.renderNav();
	},
	logout: function(e){
		Parse.User.logOut();
		this.renderNav();
		$('.intro').html("<h3>You are logged out</h3>");
		var login = new App.Views.Login();
		$("html, body").animate({ scrollTop: 0 }, 200);
	}
}))({el: document.body});


///////// Models
App.Models.Artist = Parse.User.extend({
	className: "User",
	defaults: function() {
      return {
	    username:"",
	    name:"",
	    shop:"",
	    website:"",
	    ig:"",
	    fb:"",
	    twitter:"",
	    address:"",
	    email:"",
	    q1:"",
	    desc:"",
	   	author:"",
	    location: new Parse.GeoPoint({latitude: 37.8029802, longitude: -122.41325749999999}),
        contacted: false
      };
	}
});


App.Models.FeaturedArtist = Parse.User.extend({
	className: "User"
});


///////// Views
App.Views.ArtistProfile = Parse.View.extend({
	model: App.Models.Artist,
	id: 'artistProfile',
	template: _.template($("#artistTemplate").html()),
	events: {
		'click [href="#portfolioTab"]': 'portfolioTab',
		'click [href="#aboutTab"]': 'aboutTab',
		'click [href="#shopTab"]': 'shopTab',
		'scroll': 'activateAffix'
	},
	portfolioTab: function(e){
	    e.preventDefault();
	    $(this).tab('show');
	    // $('#profMenu a[href="#portfolioTab"]').tab('show')
	},
	aboutTab: function(e){
	    e.preventDefault();
	    $(this).tab('show');
	    //  $('#profMenu a[href="#aboutTab"]').tab('show')
	},
	shopTab: function(e){
	    e.preventDefault();
	    $(this).tab('show');
	    this.renderMap();
	    // $('#profMenu a[href="#shopTab"]').tab('show')
	},
	activateAffix: function(){
		/// *Is there a better place to activate the affix?
		$('.profNavContainer').affix({
		      offset: { top: $('.profHead').outerHeight(true) + 40 }
		});
	},

	//render map, using underscore _.debounce to delay the trigger because of hidden tab / responsive issue
	renderMap: _.debounce(function() {
		// Initiate Google map
    	var mapStyles = [{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-100},{"lightness":20}]},{"featureType":"road","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-100},{"lightness":40}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-10},{"lightness":30}]},{"featureType": "water","elementType": "geometry.fill","stylers": [{ "color": "#d9d9d9" }]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"visibility":"simplified"},{"saturation":-60},{"lightness":10}]},{"featureType":"landscape.natural","elementType":"all","stylers":[{"visibility":"simplified"},{"saturation":-60},{"lightness":5}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]}];
	    var mapLocation = new google.maps.LatLng( this.model.attributes.location.latitude , this.model.attributes.location.longitude );
	    var mapOptions = { zoom: 12, center: mapLocation, styles: mapStyles, scrollwheel: false, panControl: false, mapTypeControl: false };
	    var mapElement = document.getElementById('map');
	    this.map = new google.maps.Map(mapElement, mapOptions);
	    this.mapMarker = new google.maps.Marker({
	        animation: google.maps.Animation.DROP,
	        position: mapLocation,
	        map: this.map,
	        icon: ' img/mapmarker.png'
	    });
    }, 200),

	centerMap: function() {
		// for responsive, resizes maps to the center
		var center = this.map.getCenter();
		google.maps.event.trigger(this.map, "resize");
		this.map.setCenter(center); 
	},
	render: function(){
		// This is a artists object of the attributes of the models.
		var attributes = this.model.attributes

	  	// Pass this object onto the template function, returns an HTML string. Then use jQuerry to insert the html
		this.$el.html(this.template(attributes));

		return this;
	}
});

App.Views.Intro = Parse.View.extend({
	id: 'homePage',
	introTemplate: _.template($("#introTemplate").html()),
	featuredContainerTemplate: _.template($("#featuredContainerTemplate").html()),
	render: function(){
		var html = this.introTemplate();
		$(this.el).append(html);
		var html = this.featuredContainerTemplate();
		$(this.el).append(html);
		return this;
	}
});

App.Views.FeaturedArtists = Parse.View.extend({
	el: '#featuredArtists',
    initialize: function () {
    	this.collection.on('reset', this.render, this);

    	/// *better place to put this?
    	$(window).scroll(function () {
	    	//checks the height and fades the artist in    	
			if ($(document).height() - 1 <= $(window).scrollTop() + $(window).height()) {
			 	$('.featuredArtist:hidden:first').fadeIn("slow");
				//show end when all featured artist's have been shown
				if($('.featuredArtist:last').is(':visible')) {
			 		$('#homePage .end').fadeIn();
				}
			}
		});

    },
    render: function () {
      this.addAll();
      return this;
    },
    events: {
     	'scroll': 'scrollChecker',
     	'click #loaders': 'loadMore'
    },
    loadMore: function() {
    	/// Eventually will fetch the next month of artists and change loader counter
    	console.log('load more triggered');
    },
    scrollChecker: function () {
    	console.log('scroll triggered');


    },
    addAll: function(){
    	this.$el.empty();
    	// Renders all the featured artists in collection
    	this.collection.forEach(this.addOne);

    	//// hide for featured artist fade in
    	$('#homePage .featuredArtist:gt(2)').hide();
		
	},
	addOne: function(artist){
		var featuredArtist = new App.Views.FeaturedArtist({model: artist});
		$('#featuredArtists').append(featuredArtist.render().el);
		//renders an additional featured artist
	}
});

App.Views.FeaturedArtist = Parse.View.extend({
	className: 'featuredArtist',
	template: _.template($("#featuredArtistTemplate").html()),
    events: {
      'click button, .artistProf, h4': 'viewProfile'
    },
	viewProfile: function(){
		//navigate to the specific model's username
		Parse.history.navigate(this.model.attributes.username, {trigger: true});
		$("html, body").animate({ scrollTop: 0 }, 200);
	},
	render: function(){
		var attributes = this.model.toJSON();
		$(this.el).append(this.template(attributes));
		return this;
	}
});

App.Views.About = Parse.View.extend({
	id: 'aboutPage',
	template: _.template($("#aboutTemplate").html()),
	render: function(){
		var html = this.template();
		$(this.el).html(html);
		return this;
	}
});

App.Views.Settings = Parse.View.extend({
	id: 'settings',
	artistTemplate: _.template($("#artistSettingsTemplate").html()),
	initialize: function(){
		// refresh the users attributes in case changes have been made
		Parse.User.current().fetch()

		// Grabs the users attributes
		this.attributes = Parse.User.current().attributes

	},
    events: {
    	"submit form.infoForm": 	"saveInfo",
    	"submit form.profileForm": 	"saveProfile",
    	"click #forgotPassword": 	"resetPassword",
    	"click li": 				"scrollTo"
    },
    saveInfo: function(e){
    	e.preventDefault();
    	var user = Parse.User.current();
    	user.set("username", this.$("#editUsername").val());
    	user.set("email", this.$("#editEmail").val());
    	user.set("name", this.$("#editName").val());
		user.save(null,{
			success: function(user) {
				// flash the success class
				$(".infoForm").each(function(){
				    $(".input-group").addClass("has-success").fadeIn("slow");
				    setTimeout(function() { $(".input-group").removeClass("has-success") }, 2400);
				});
			},
			error: function(user, error) {
				$(".infoForm .error").html(error.message).show();
			}
		});
    },
    saveProfile: function(e){
    	e.preventDefault();
    	var user = Parse.User.current();
    	user.set("shop", this.$("#editShop").val());
    	user.set("desc", this.$("#editAbout").val());
    	user.set("website", this.$("#editWebsite").val());
    	user.set("fb", this.$("#editFB").val());
    	user.set("ig", this.$("#editInstagram").val());
    	user.set("twitter", this.$("#editTwitter").val());
		user.save(null,{
			success: function(user) {
				// flash the success class
				$(".profileForm").each(function(){
				    $(".input-group").addClass("has-success").fadeIn("slow");
				    setTimeout(function() { $(".input-group").removeClass("has-success") }, 2400);
				});
			},
			error: function(user, error) {
				$(".profileForm .error").html(error.message).show();
			}
		});
    },
    resetPassword: function(e) {
    	e.preventDefault();
    	email = Parse.User.current().attributes.email
		Parse.User.requestPasswordReset(email, {
		  success: function() {
		    // Password reset request was sent successfully
		    console.log('successsssss')
		    $('#forgotPassword').html('Check your email for the password reset link!')
		    self.undelegateEvents();
		  },
		  error: function(error) {
		    // Show the error message somewhere
		    $(".profileForm .error").html(error.message).show();
		  }
		});
    },
    scrollTo: function(e){
    	//get the section to scroll to from the data target attribute
    	var section = $(e.currentTarget).data('target');
    	//scroll to that section, less the nav bar height.
	   	$('html, body').animate({
	        scrollTop: $(section).offset().top - 110
	    }, 1200);
    },
	render: function(){

	  	// Pass the attributes onto the template function, returns an HTML string. Then use jQuerry to insert the html
		this.$el.html(this.artistTemplate(this.attributes));

		return this;

	},
	renderMap: function(e){
		///map style is defined twice...
		var mapStyles = [{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-100},{"lightness":20}]},{"featureType":"road","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-100},{"lightness":40}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-10},{"lightness":30}]},{"featureType": "water","elementType": "geometry.fill","stylers": [{ "color": "#d9d9d9" }]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"visibility":"simplified"},{"saturation":-60},{"lightness":10}]},{"featureType":"landscape.natural","elementType":"all","stylers":[{"visibility":"simplified"},{"saturation":-60},{"lightness":5}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]}];
	  
		$('#settingsMap').locationpicker({
			location: {latitude: this.attributes.location.latitude, longitude: this.attributes.location.longitude},
			radius: 0,
			zoom: 12,
			enableAutocomplete: true,
			enableReverseGeocode: true,
			styles: mapStyles,
			inputBinding: {
				locationNameInput: $('#settingsMapAddress')
			},
			onchanged: function(currentLocation, currentLocationNameFormatted) {

		    	var user = Parse.User.current();
		    	var point = new Parse.GeoPoint({latitude: currentLocation.latitude, longitude: currentLocation.longitude});
		    	user.set("location", point);
		    	user.set("address", $("#settingsMapAddress").val());
		    	user.set("locationName", currentLocationNameFormatted);
				user.save(null,{
					success: function(user) {
						// flash the success class
						$(".editLocation").addClass("has-success").fadeIn("slow");
						setTimeout(function() { $(".editLocation").removeClass("has-success") }, 2400);
					
						$("#locationSettings ~ .error").hide();
					},
					error: function(user, error) {
						$(".profileForm .error").html(error.message).show();
					}
				});
			},	
			onlocationnotfound: function(locationName) {
				$("#locationSettings ~ .error").html("Couldn't find "+locationName+", Try another address?").show();				
			}
		});
	}
});

App.Views.Join = Parse.View.extend({
	id: 'join',
	template: _.template($("#joinTemplate").html()),
	events: {
		'click .toggleArtist': 'toggleArtist',
		"submit form.signupForm": "signUp"
	},
    initialize: function() {
      _.bindAll(this, "signUp");
    },
	toggleArtist: function(e) {
		e.preventDefault();
    	if($(".artistForm").is(':hidden')){
			$('.artistForm').fadeIn();
			$('.toggleArtist').text("Actually, not an artist or shop...");
			$('#inputRole').val('artist');
    	} else if ($(".artistForm").is(':visible')) {
			$('.artistForm').fadeOut();
			$('.toggleArtist').text("Artist or shop?");
			$('#inputRole').val('user');
    	}; 
    },
    signUp: function(e) {
		var self = this;
		var username = this.$("#inputUsername").val();
		var email = this.$("#inputEmail").val();
		var password = this.$("#inputPassword").val();
		var role = 'user';

    	if($(".artistRegistration").is(':visible')){
			var shop = this.$("#inputShop").val();
			role = this.$("#inputRole").val()
    	};
      
		Parse.User.signUp(username, password, { email: email, role: role, shop: shop, ACL: new Parse.ACL() }, {
			success: function(user) {
				App.Router.navigate('/', {trigger: true});
				$('.intro').html("<h3>Thanks for joining!</h3>");
				App.renderNav();
				self.undelegateEvents();
				delete self;
			},
	        error: function(user, error) {
				$(".signupForm .error").html(error.message).show();
				$(".signupForm button").removeAttr("disabled");
	        }
	    });

		this.$(".signupForm button").attr("disabled", "disabled");

		return false;
    },
	render: function(){
		var html = this.template();
		$(this.el).append(html);
		return this;
	}
});

App.Views.Login = Parse.View.extend({
	id: 'loginContainer',
	template: _.template($("#loginTemplate").html()),
    initialize: function() {
      _.bindAll(this, "logIn");

      //render the login
      $('.login').html(this.render().el);

    },
    events: {
      "submit form.loginForm": 		"logIn",
      "click #forgotPassword": 		"passwordForm",
      // "submit form.passwordForm": 	"resetPassword"
    },
    logIn: function(e){
      var self = this;
      var username = this.$("#loginUsername").val();
      var password = this.$("#loginPassword").val();

      Parse.User.logIn(username, password, {
        success: function(user) {
        	$('#login').modal('hide');
			App.Router.navigate('/', {trigger: true});
			console.log(user)
			$('.intro').html("<h3>Welcome back "+Parse.User.current().getUsername()+"!</h3>");
			App.renderNav();
			$("html, body").animate({ scrollTop: 0 }, 200);
			self.undelegateEvents();
			delete self;
        },
        error: function(user, error) {
        	console.log(error);
        	$(".loginForm .error").html("Invalid username or password. Please try again.").show();
        	$(".loginForm button").removeAttr("disabled");
        }
      });
      this.$(".loginForm button").attr("disabled", "disabled");
      return false;
    },
    passwordForm: function(e){
    	console.log('password form triggered')

		var forgotPassword = new App.Views.ForgotPassword();
		$('.app').html(forgotPassword.render().el);
    },
	render: function(){
		var html = this.template();
		$(this.el).html(html);
		return this;
	}
});

App.Views.ForgotPassword = Parse.View.extend({
	id: 'password',
	template: _.template($("#passwordResetTemplate").html()),
    events: {
      "submit form.passwordForm": 	"resetPassword"
    },
    resetPassword: function(e){
    	e.preventDefault();
    	console.log('password reset triggered')
    	var info = $("#inputInfo").val();
		Parse.User.requestPasswordReset(info, {
		  success: function() {
		    // Password reset request was sent successfully
		    console.log('successsssss')
		    this.$('p').html('Check your email for the password reset link!')
		    setTimeout(function() { App.Router.navigate('/', {trigger: true}) }, 2400);
		  },
		  error: function(error) {
		    // Show the error message somewhere
		    $(".passwordForm .error").html(error.message).show();
		  }
		});
    },
	render: function(){
		var html = this.template();
		$(this.el).html(html);
		return this;
	}
});

///////// Collections
App.Collections.Artists = Parse.Collection.extend({
	model: App.Models.Artist
});

App.Collections.FeaturedArtists = Parse.Collection.extend({
	model: App.Models.Artist
});




///////// Routers
App.Router = new (Parse.Router.extend({
	routes: {
		"":						"home",
		"about":   				"about",
		"join":        		    "join",
		"login":        		"login",
		"settings":        		"settings",
		":uname":   			"showProfile"
	},
	initialize: function(){
		/// temp demo data, populates collection of artists
		App.Collections.artists = new App.Collections.Artists();

		//google analtic tracking
		 this.bind('route', this._pageView);

	},
	home: function(){
		var intro = new App.Views.Intro();
		$('.app').html(intro.render().el);

		//create the login view
		var login = new App.Views.Login();

		// find all artists featured this month
		App.Collections.artists.query = new Parse.Query(App.Models.Artist);
		/// temp set featured artist month manually
		App.Collections.artists.query.equalTo("featuremonth", 6);  
		App.Collections.artists.query.find({
		  success: function(artists) {
		    App.Collections.featuredArtists = new App.Collections.FeaturedArtists(artists);
			App.Views.featuredArtists = new App.Views.FeaturedArtists({collection:  App.Collections.featuredArtists});
			App.Views.featuredArtists.render();
		  },
		  error: function(artists, message){
		  	console.log(message);
		  }
		});
	
	},
	showProfile: function(uname){
		// define the parse query to get the user from the router
		App.Collections.artists.query = new Parse.Query(App.Models.Artist);
		App.Collections.artists.query.equalTo("username", uname);

		// find the first object with the above query
		App.Collections.artists.query.first({
		  success: function(results) {
		  	// render out the profile page
		  	var artistProfile = new App.Views.ArtistProfile({model: results});
		  	$('.app').html(artistProfile.render().el);

		  },
		  error: function(error) {
		    console.log("Error: " + error.code + " " + error.message);
		  }
		});
		
	},
	about: function(){
		var about = new App.Views.About();
		$('.app').html(about.render().el);
		var join = new App.Views.Join();
		$('.app').append(join.render().el);
	},
	join: function(){
		var join = new App.Views.Join();
		$('.app').html(join.render().el);
	},
	login: function(){
		$('#login').modal('show')
	},
	settings: function(){
		///need to render the correct user type settings

		var settings = new App.Views.Settings();

		$('.app').html(settings.render().el);

		settings.renderMap();
	},

	//google analytic tracking - http://nomethoderror.com/blog/2013/11/19/track-backbone-dot-js-page-views-with-google-analytics/
	_pageView: function() {
	  var path = Parse.history.getFragment();
	  ga('send', 'pageview', {page: "/" + path});
	}
}));


$(function() {
	App.start();
});

