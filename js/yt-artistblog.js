

Parse.$ = jQuery;

// Initialize Parse with DEMO Parse application javascript keys
Parse.initialize("joOsSXgFk7vRHT5N6DHOg6dogxBhk73FF88qNZly",
               "rAUugyr5fxT1InmnL7IPwhOBG8mXvF1eQRwyMObt");


var App = new (Parse.View.extend({
	Models: {},
	Views: {},
	Collections: {},
	events: {
		//simplifies html to use routers where needed
		"click [href^='/']": function(e){
			e.preventDefault();
			Parse.history.navigate(e.target.pathname, {trigger: true});
			console.log('bb nav triggered'); //event test
			$("html, body").animate({ scrollTop: 0 }, 200);
		},
		//above target.pathname does not work for buttons.... Need to move to the view
		"click [href='/about']": function(e){
			e.preventDefault();
			Parse.history.navigate('/about', {trigger: true});
			$("html, body").animate({ scrollTop: 0 }, 200);
		}
	},
	id: 'nav',
	template: _.template($("#navTemplate").html()),
	initialize: function() {
		var html = this.template();
		$(this.el).append(html);
		return this;
	},
	start: function(){
		Parse.history.start({pushState: true, root: '/'});
	}
}))({el: document.body});


///////// Models
App.Models.Artist = Parse.Object.extend({
	className: "Artists",
	defaults: function() {
      return {
	    username:"",
	    name:"",
        type: 'artist',
	    shop:"",
	    website:"",
	    ig:"",
	    address:"",
	    city:"",
	    state:"",
	    country:"",
	    lat:37.8029802,
	    lng:-122.41325749999999,
	    fb:"",
	    email:"",
	    a3:"",
	    a2:"",
	    a1:"",
	    q3:"",
	    q2:"",
	    q1:"",
	    desc:"",
        contacted: false
      };
	}
});


App.Models.FeaturedArtist = Parse.Object.extend({
	className: "Artists"
});


///////// Views
App.Views.ArtistProfile = Parse.View.extend({
	model: App.Models.Artist,
	id: 'artistProfile',
	template: _.template($("#artistTemplate").html()),
	events: {
		'click [href="#shopTab"]': 'renderMap'
	},
	//render map, using underscore _.debounce to delay the trigger because of hidden tab / responsive issue
	renderMap: _.debounce(function() {
		// Initiate Google map
    	var mapStyles = [{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-100},{"lightness":20}]},{"featureType":"road","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-100},{"lightness":40}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-10},{"lightness":30}]},{"featureType": "water","elementType": "geometry.fill","stylers": [{ "color": "#d9d9d9" }]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"visibility":"simplified"},{"saturation":-60},{"lightness":10}]},{"featureType":"landscape.natural","elementType":"all","stylers":[{"visibility":"simplified"},{"saturation":-60},{"lightness":5}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]}];
	    var mapLocation = new google.maps.LatLng( this.model.get('lat') , this.model.get('lng') );
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
		var attributes = this.model.toJSON();

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
    },
    render: function () {
      this.addAll();
      return this;
    },
    events: {
     	'scroll': 'scrollChecker'
    //  	,
    //  	'click #loaders': 'loadMore'
    // },
    // loadMore: function() {
    // 	//// Eventually will fetch the next month of artists and change loader counter
    // 	console.log('load more triggered');
		
    },
    scrollChecker: function () {
    	//checks the height and fades the artist in    	
		if ($(document).height() <= $(window).scrollTop() + $(window).height()) {
		  $('.featuredArtist:hidden:first').fadeIn("slow");
		  if($('.featuredArtist:eq(6)').is(':visible')) {
		    $('#homePage .load-fader, #homePage .load').hide();
		  }
		}

    },
    addAll: function(){
    	this.$el.empty();
    	//renders all the featured artists in collection
    	this.collection.forEach(this.addOne);

    	//temp load more function
    	$('#homePage .featuredArtist:gt(2)').hide();
		
	},
	addOne: function(artist){
		var featuredArtist = new App.Views.FeaturedArtist({model: artist});
		console.log(artist);
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

App.Views.Register = Parse.View.extend({
	id: 'register',
	template: _.template($("#registerTemplate").html()),
	events: {
		'click .toggleArtistRegistration': 'toggleArtistRegistration',
		"submit form.signupForm": "signUp"
	},
    initialize: function() {
      _.bindAll(this, "signUp");
    },
	toggleArtistRegistration: function(e) {
		e.preventDefault();
    	if($(".artistRegistration").is(':hidden')){
			$('.artistRegistration').fadeIn();
			$('.toggleArtistRegistration').text("Actually, not an artist...");
    	} else if ($(".artistRegistration").is(':visible')) {
			$('.artistRegistration').fadeOut();
			$('.toggleArtistRegistration').text("Artist or shop?");
    	}; 
    },
    signUp: function(e) {
		var self = this;
		var username = this.$("#inputUsername").val();
		var email = this.$("#inputEmail").val();
		var password = this.$("#inputPassword").val();
		var type = 'user';

    	if($(".artistRegistration").is(':visible')){
			var phone = this.$("#inputPhone").val();
			var name = this.$("#inputName").val();
			type = 'artist';
    	};
      
		Parse.User.signUp(username, password, { email: email, type: type, phone: phone, name: name, ACL: new Parse.ACL() }, {
			success: function(user) {
				App.Router.navigate('/', {trigger: true});
				$('.intro').html("<h3>Thanks for joining!</h3>");
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
		"register":        	    "register",
		":uname":   			"showProfile"
	},
	initialize: function(){
		//temp demo data, populates collection of artists
		App.Collections.artists = new App.Collections.Artists();
		App.Collections.artists.fetch();

		//temp create a featured artist collection
		App.Collections.featuredArtists = new App.Collections.FeaturedArtists();

	},
	home: function(){
		var intro = new App.Views.Intro();
		$('.app').html(intro.render().el);

		var featuredArtists = new App.Views.FeaturedArtists({collection: App.Collections.artists});
		featuredArtists.render();







		

	},
	showProfile: function(uname){
		//selects particular profile to render, eventually will change to get specific artist from server.
		console.log(uname);
		var artists = App.Collections.artists.toJSON() 
		console.log(artists);
		var artist = artists.findWhere({username: uname});
		console.log(artist);
		
		// If artist name is not found,
		//do nothing
		if (artist === undefined){









			console.log('Nothing found at '+uname)
		} else {
			//otherwise, create a new instance of the artist profile
			var artistProfile = new App.Views.ArtistProfile({model: artist});

			//render the artist profile
			$('.app').html(artistProfile.render().el);

			hideMore(); ////prototype load more
		};
		
	},
	about: function(){
		var about = new App.Views.About();
		$('.app').html(about.render().el);
		var register = new App.Views.Register();
		$('.app').append(register.render().el);
	},
	register: function(){
		var register = new App.Views.Register();
		$('.app').html(register.render().el);
	}
}));


$(function() {
	App.start();
});

