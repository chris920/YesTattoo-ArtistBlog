

Parse.$ = jQuery;

// Initialize Parse with DEMO Parse application javascript keys
Parse.initialize("ROfcxRBpwDCFNI4DZluo4Q6okc6cFzUHgqOURSCf",
               "NI5bHQ6J0aCD4rc95ORxuFAtAIZLpLNDLRLuCrwY");


var App = new (Parse.View.extend({
	Models: {},
	Views: {},
	Collections: {},

	id: 'nav',
	template: _.template($("#navTemplate").html()),
	start: function(){
		Parse.history.start({pushState: false, root: '/'});

		// render initial nav 
		this.render();

	},
	events: {
		//simplifies html to use routers where needed
		"click [href^='/']": 			"links",
		"click #logout": 				"logout"
	},
	links: function(e){
		e.preventDefault();
		Parse.history.navigate(e.target.attributes.href.value, {trigger: true});
	},
	logout: function(e){
		Parse.User.logOut();
		this.render();
		$('.intro').html("<h3>You are logged out</h3>");
		Parse.history.navigate('', {trigger: true});
		$("html, body").animate({ scrollTop: 0 }, 200);
	},
	getProfile: function(){
		var user = Parse.User.current();
		if (user) {
			//gets the user's profile
			if (user.attributes.role === 'user'){
				var query = new Parse.Query(App.Models.UserProfile);
			} else {
				var query = new Parse.Query(App.Models.ArtistProfile);
			}
			query.equalTo("username", user.getUsername());
			query.first().then(function(result) {
				App.profile = result;

			}, function(error) {
			    console.log("Error: " + error.code + " " + error.message);
			});
		}


	},
	render: function() {
		//renders the nav, which has an if current user statement in template.
		$('.navs').html(this.template());

		var login = new App.Views.Login();

		this.getProfile();

	}
}))({el: document.body});


///////// Models
App.Models.User = Parse.User.extend({
	className: "User"
});

App.Models.ArtistProfile = Parse.Object.extend({
	className: "ArtistProfile",
	defaults: function() {
      return {
	    username:"",
	    name:"",
	    desc:"",
	    shop:"",
	    website:"",
	    ig:"",
	    fb:"",
	    twitter:"",
	    address:"",
	    email:"",
		locationName:"",
	    location: new Parse.GeoPoint({latitude: 37.8029802, longitude: -122.41325749999999}),
	    q1:"", q2:"", q3:"", q4:"", q5:"",
	    a1:"", a2:"", a3:"", a4:"", a5:"",
	    featuremonth:"", featureyear:"2014",
	   	author:""
      };
	}
});

App.Models.UserProfile = Parse.Object.extend({
	className: "UserProfile",
	defaults: function() {
      return {
	    username:"",
	    name:"",
	    desc:"",
	   	locationName:"",
	    location: new Parse.GeoPoint({latitude: 37.8029802, longitude: -122.41325749999999})
      };
	}
});

App.Models.Tattoo = Parse.Object.extend({
	className: "Tattoo"
});

App.Models.Add = Parse.Object.extend({
	className: "Add"
});

App.Models.FeaturedArtist = Parse.User.extend({
	className: "User"
});


///////// Views
App.Views.ArtistProfile = Parse.View.extend({
	model: App.Models.User,
	id: 'artistProfile',
	initialize: function() {
		
	},
	template: _.template($("#artistTemplate").html()),
	events: {
		'click [href="#portfolioTab"]': 'portfolioTab',
		'click [href="#aboutTab"]': 	'aboutTab',
		'click [href="#shopTab"]': 		'shopTab',
	},
	portfolioTab: function(e){
	    e.preventDefault();
	    $(this).tab('show');
	},
	aboutTab: function(e){
	    e.preventDefault();
	    $(this).tab('show');
	},
	shopTab: function(e){
	    e.preventDefault();
	    $(this).tab('show');
	    this.renderMap();
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

		$(window).scroll(this.activateAffix);

		return this;
	}
});

App.Views.Tattoos = Parse.View.extend({
	el: '.tattoos',
    render: function () {
      this.renderTattoos();
      return this;
    },
	renderTattoos: function(e){
    	this.$el.empty();
    	this.collection.forEach(this.renderTattoo);

	},
	renderTattoo: function(tattoo){
		var tattoo = new App.Views.Tattoo({model: tattoo});
		$('.tattoos').append(tattoo.render().el);
	}
});

App.Views.Tattoo = Parse.View.extend({
	className: 'tattoo',
	template: _.template($("#tattooTemplate").html()),
	initialize: function(){
		_.bindAll(this, 'add', 'remove', 'showAdd', 'showRemove');
	},
    events: {
     	'click .add': 				'add',
     	'click .remove': 			'remove'
    },
	add: function(){
		if (Parse.User.current()) {
			this.$('.add').addClass('added');
			this.$('.add').attr('disabled', 'disabled');
			var add = new App.Models.Add();
			add.set("uploader", this.model.attributes.uploader);
			add.set("user", Parse.User.current());
			add.set("artist", this.model.attributes.artist);
			add.set("tattoo", this.model);
			add.save().then(function (added) {
				var user = Parse.User.current();
				// Add the ids of the added tattoos
				user.addUnique('added', added.attributes.tattoo.id);

				return user.save();
			}).then(function(user) {
				console.log(this);
				this.showRemove();
			}, function(error) {
				console.log(error);
			});
		} else {
			Parse.history.navigate('/login', {trigger: true});
			$(".loginForm .error").html("You need to be logged in to collect tattoos.").show();
		}

	},
	remove: function(){
		// this.$('.add').addClass('added');
		// this.$('.add').attr('disabled', 'disabled');
		var user = Parse.User.current();
		var query = new Parse.Query(App.Models.Add)
		query.include('tattoo');
		query.equalTo('tattoo.id', this.model.id);


		query.equalTo('user', user)
		query.find().then(function(add){
			add.destroy();
			return add;
		}).then(function (added) {
			var user = Parse.User.current();
			// remove the ids of the added tattoos
			user.remove('added', added.attributes.tattoo.id);

			return user.save();
		}).then(function(user) {
			this.showAdd();
		}, function(error) {
			console.log(error);
		});
	},
	showAdd: function(){
		this.$('button').removeClass('remove').removeAttr("disabled").addClass('add btn-block').html('Add');

		///hide remove, show add
		console.log('show add triggered')
	},
	showRemove: function(){
		this.$('button').removeClass('add btn-block').removeAttr("disabled").addClass('remove').html('X');

		/// hide add, show remove......
		console.log('show remove triggered')
	},
	render: function(){
		var attributes = this.model.toJSON();
		$(this.el).append(this.template(attributes));
		return this;
	}
});

App.Views.MyTattoos = Parse.View.extend({
	el: '.tattoos',
    render: function () {
      this.renderTattoos();
      return this;
    },
	renderTattoos: function(e){
    	this.$el.empty();
    	// Renders all the featured artists in collection
    	this.collection.forEach(this.renderTattoo);

	},
	renderTattoo: function(tattoo){
		var tattoo = new App.Views.MyTattoo({model: tattoo});
		$('.tattoos').append(tattoo.render().el);
		//renders an additional featured artist
	}
});

App.Views.MyTattoo = Parse.View.extend({
	className: 'Tattoo',
	template: _.template($("#myTattooTemplate").html()),
	events: {
		'click button': 'edit'
	},
	edit: function(){
		var edit = new App.Views.ArtistEdit({model: this.model});
		$('.app').html(edit.render().el);

		// place the image into the edit preview
		var file = this.model.get("file");
		$("img")[0].src = file.url();
	},
	render: function(){
		var attributes = this.model.toJSON();
		$(this.el).append(this.template(attributes));
		return this;
	}
});

App.Views.Adds = Parse.View.extend({
	el: '.tattoos',
    render: function () {
      this.renderTattoos();
      return this;
    },
	renderTattoos: function(e){
    	this.collection.forEach(this.renderTattoo);

	},
	renderTattoo: function(tattoo){
		var tattoo = new App.Views.Add({model: tattoo});
		$('.tattoos').append(tattoo.render().el);
	}
});

App.Views.Add = Parse.View.extend({
	className: 'add',
	template: _.template($("#addTemplate").html()),
    events: {
     	'click .add': 			'add'
    },
	add: function(){
		if (Parse.User.current()) {
			this.$('.add').addClass('added');
			this.$('.add').attr('disabled', 'disabled');
			this.$('.add').addClass('hidden');
			var add = new App.Models.Add();
			add = this.model.clone();
			add.set("user", Parse.User.current());
			add.save().then(function (added) {
				var user = Parse.User.current();
				user.addUnique('added', added.attributes.tattoo.id);
				return user.save();
			}).then(function(user) {
				this.$('.add').removeAttr("disabled");
				this.$('.add').removeClass('added');
			}, function(error) {
				console.log(error);
			});
		} else {
			Parse.history.navigate('/login', {trigger: true});
			$(".loginForm .error").html("You need to be logged in to collect tattoos.").show();
		}

	},
	render: function(){
		var attributes = this.model.toJSON();
		$(this.el).append(this.template(attributes));
		return this;
	}
});

App.Views.UserProfile = Parse.View.extend({
	model: App.Models.User,
	id: 'userProfile',
	initialize: function() {


	},
	template: _.template($("#userTemplate").html()),
	events: {
		'click [href="#collectionTab"]': 'collectionTab'
	},
	collectionTab: function(e){
	    e.preventDefault();
	    $(this).tab('show');
	},
	activateAffix: function(){
		$('.profNavContainer').affix({
		      offset: { top: $('#userProfile > div.container').outerHeight(true) + 40 }
		});
	},
	render: function(){
		var attributes = this.model.attributes
		this.$el.html(this.template(attributes));
		$(window).scroll(this.activateAffix);
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
	loadTemplate: _.template(' <div class="end" style="display: none"><img src="img/yt-featuredend.png"><h5>See you tomorrow</h5><br><button type="button" id="more" class="btn-lg" href="/featured/p<%= page %>">More Artists</button></div>'),
    initialize: function () {
    	this.collection.on('reset', this.render, this);
    	this.collection.bind('add', this.addOne);

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
    events: {
    	'click #more': 'load'
    },
    render: function () {
      this.addAll();
      return this;
    },
    load: function(e) {
    	//hides load button after clicked
	 	$(e.target.parentElement).fadeOut("normal", function() {
	        $(this).remove();
	    });
    },
    renderLoad: function() {
    	this.collection.page++

    	///H ~ checks if there are no more artists. What is the better way to do this?
	  	if (this.collection.models.pop().id === 'hQUgHBN38S') {
	  		$('#more').remove();
			this.loadTemplate = _.template(' <div class="end" style="display: none"><img src="img/yt-featuredend.png"><h5>See you tomorrow</h5></div>');
	  	}

		this.$el.append(this.loadTemplate({page: this.collection.page}));


    },
    addAll: function(){
    	this.$el.empty();
    
    	this.addMore();

		/// Show initial artist
    	$('#homePage .featuredArtist:first').fadeIn();
		
	},
    addMore: function(){

		// Renders all the featured artists in collection
    	this.collection.forEach(this.addOne);
		
	},
	addOne: function(artist){

		//renders an additional featured artist
		var featuredArtist = new App.Views.FeaturedArtist({model: artist});
		$('#featuredArtists').append(featuredArtist.render().el);
	}
});

App.Views.FeaturedArtist = Parse.View.extend({
	className: 'featuredArtist',
	attributes: {
	    "style": "display: none;"
	},
	template: _.template($("#featuredArtistTemplate").html()),
    events: {
      'click button, .artistProf, h4, a': 'viewProfile'
    },
	viewProfile: function(){
		//navigate to the specific model's username
		Parse.history.navigate(this.model.attributes.username, {trigger: true});
		$("html, body").animate({ scrollTop: 0 }, 200);
	},
	render: function(){
		var that = this;
		var attributes = this.model.toJSON();
		$(this.el).append(this.template(attributes));

		// get 4 tattoos from the artist and append them to the container
	  	var tattoos = this.model.relation('tattoos');
	  	var query = tattoos.query();
	  	query.limit(4);
	  	query.find().then(function(tats) {
  			_.each(tats, function(tat) {
  				var thumb = tat.get('fileThumbSmall').url();
  				this.$('.portfolioContainer').append(_.template('<a class="tattooContainer"><img src='+thumb+' class="tattooImg"></a>'));
  			}, that);
	  	});

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
		this.user = Parse.User.current();
		this.profile = App.profile;

	},
    events: {
    	"submit form.infoForm": 			"saveInfo",
    	"keyup #editUsername": 				"usernameVal",
    	"submit form.profileForm": 			"saveProfile",
    	"blur #editFB, #editInstagram, #editTwitter, #editWebsite":"linkVal",
    	"change #profUpload": 				"updateProf",
    	"dblclick #profileSettings": 		"interview",
    	"click li": 						"scrollTo",
    	"click [href='/tattoo/new']": 		"upload"
    },
    saveInfo: function(e){
    	e.preventDefault();
    	this.user.set("username", this.$("#editUsername").val().replace(/\W/g, '').toLowerCase());
    	this.user.set("email", this.$("#editEmail").val());
    	this.user.set("password", this.$("#editPassword").val());
		this.user.save(null,{
			success: function(user) {
				// flash the success class
				$(".infoForm").each(function(){
				    $(".input-group").addClass("has-success").fadeIn("slow");
				    setTimeout(function() { $(".input-group").removeClass("has-success") }, 2400);
				});
				$("#editPassword").val("");

			},
			error: function(user, error) {
				$(".infoForm .error").html(error.message).show();
			}
		});
		this.profile.set("username", this.$("#editUsername").val());
		this.profile.save();
    },
    usernameVal: function() {
    	var validated = $("#editUsername").val().replace(/\W/g, '').toLowerCase();
		$("#editUsername").val(validated);
    },
    saveProfile: function(e){
    	e.preventDefault();
    	this.profile.set("name", this.$("#editName").val());
    	this.profile.set("shop", this.$("#editShop").val());
    	this.profile.set("desc", this.$("#editAbout").val());
    	this.profile.set("website", this.$("#editWebsite").val());
    	this.profile.set("fb", this.$("#editFB").val());
    	this.profile.set("ig", this.$("#editInstagram").val());
    	this.profile.set("twitter", this.$("#editTwitter").val());
		this.profile.save(null,{
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
    linkVal: function(e) {
    	var value = e.target.value
    	if (e.target.value) {
	    	if (!(/^http/).test(value)) {
	    		var current = value.split("/").pop();
	    		var updated = 'https://' + e.target.placeholder + current;
	    		e.target.value = updated;
	    	}
    	}

    },
    updateProf: function(e) {
		e.preventDefault();
		$( "span:contains('Choose Profile Picture')" ).addClass( "disabled" );
		$("#profUpload").attr("disabled", "disabled");
		var prof = $("#profUpload")[0];
		if (prof.files.length > 0) {
			var upload = prof.files[0];
			var name = this.user.getUsername() + "prof.jpg";
			var file = new Parse.File(name, upload);
			this.profile.set("prof", file);
			this.profile.save().then(function (profile) {
				/// update the profile thubmnail.
				var file = profile.get("profThumb");
				$(".artistProf")[0].src = file.url();
				$("#profUpload").removeAttr("disabled");
				$( "span:contains('Choose Profile Picture')" ).removeClass( "disabled" );
			}, function(error) {
				console.log(error);
				$(".error:eq( 3 )").html(error.message).show();
				$("#profUpload").removeAttr("disabled");
				$( "span:contains('Choose Profile Picture')" ).removeClass( "disabled" );
			});
		}
    },
	interview: function(){
		  Parse.history.navigate('interview', {trigger: true});
		  $("html, body").animate({ scrollTop: 0 }, 200);
	},
    scrollTo: function(e){
    	//get the section to scroll to from the data target attribute
    	var section = $(e.currentTarget).data('target');
    	//scroll to that section, less the nav bar height.
	   	$('html, body').animate({
	        scrollTop: $(section).offset().top - 110
	    }, 1200);
    },
    upload: function(e){
    	e.preventDefault();
    	Parse.history.navigate('/tattoo/new', {trigger: true});
    },
	render: function(){

		this.$el.html(this.artistTemplate(this.profile.attributes));
		return this;

	},
	renderMap: function(e){

		var profile = this.profile;

		///map style is defined twice...
		var mapStyles = [{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-100},{"lightness":20}]},{"featureType":"road","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-100},{"lightness":40}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-10},{"lightness":30}]},{"featureType": "water","elementType": "geometry.fill","stylers": [{ "color": "#d9d9d9" }]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"visibility":"simplified"},{"saturation":-60},{"lightness":10}]},{"featureType":"landscape.natural","elementType":"all","stylers":[{"visibility":"simplified"},{"saturation":-60},{"lightness":5}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]}];
	  
		$('#settingsMap').locationpicker({
			location: {latitude: profile.attributes.location.latitude, longitude: profile.attributes.location.longitude},
			radius: 0,
			zoom: 12,
			enableAutocomplete: true,
			enableReverseGeocode: true,
			styles: mapStyles,
			inputBinding: {
				locationNameInput: $('#settingsMapAddress')
			},
			onchanged: function(currentLocation, currentLocationNameFormatted) {

		    	var point = new Parse.GeoPoint({latitude: currentLocation.latitude, longitude: currentLocation.longitude});
		    	profile.set("location", point);
		    	profile.set("address", $("#settingsMapAddress").val());
		    	profile.set("locationName", currentLocationNameFormatted);
				profile.save(null,{
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
	},
	renderProf: function(){
		if(this.profile.get("prof")) {
			var file = this.profile.get("profThumb");
			$(".artistProf")[0].src = file.url();
		}
	}
});

App.Views.Interview = Parse.View.extend({
	id: 'settings',
	artistTemplate: _.template($("#artistInterviewTemplate").html()),
	initialize: function(){
		this.user = Parse.User.current();
		this.profile = App.profile;
	},
    events: {
    	"submit form.interviewForm": 		"saveInterview"
    },
    saveInterview: function(e){
    	e.preventDefault();
    	this.profile.set("q1", this.$("#editQuestion1").val());
    	this.profile.set("a1", this.$("#editAnswer1").val());
    	this.profile.set("q2", this.$("#editQuestion2").val());
    	this.profile.set("a2", this.$("#editAnswer2").val());
    	this.profile.set("q3", this.$("#editQuestion3").val());
    	this.profile.set("a3", this.$("#editAnswer3").val());
    	this.profile.set("q4", this.$("#editQuestion4").val());
    	this.profile.set("a4", this.$("#editAnswer4").val());
    	this.profile.set("q5", this.$("#editQuestion5").val());
    	this.profile.set("a5", this.$("#editAnswer5").val());
    	this.profile.set("author", this.$("#editAuthor").val());
    	this.profile.set("featureyear", this.$("#editFeatureYear").val());
    	this.profile.set("featuremonth", this.$("#editFeatureMonth").val());
		this.profile.save(null,{
			success: function(profile) {
				// flash the success class
				$(".interviewForm").each(function(){
				    $(".input-group").addClass("has-success").fadeIn("slow");
				    setTimeout(function() { $(".input-group").removeClass("has-success") }, 2400);
				});
			},
			error: function(user, error) {
				$(".interviewForm .error").html(error.message).show();
			}
		});
    },

	render: function(){
		this.$el.html(this.artistTemplate(this.profile.attributes));
		return this;
	}
});

App.Views.Join = Parse.View.extend({
	id: 'join',
	template: _.template($("#joinTemplate").html()),
	events: {
		'click .toggleArtist': 		'toggleArtist',
		"submit form.signupForm": 	"signUp",
		"keyup #inputUsername": 	"usernameVal"
	},
    initialize: function() {
      _.bindAll(this, "signUp");

    },
	toggleArtist: function() {
    	if($(".artistForm").is(':hidden')){
			$('.artistForm').fadeIn();
			$('.toggleArtist').text("Actually, not an artist...");
			$('#inputRole').val('artist');
    	} else if ($(".artistForm").is(':visible')) {
			$('.artistForm').fadeOut();
			$('.toggleArtist').text("Artist or shop?");
			$('#inputRole').val('user');
    	};
    },
    usernameVal: function() {
    	var validated = $("#editUsername").val().replace(/\W/g, '').toLowerCase();
		$("#editUsername").val(validated);
    },
    signUp: function() {
		var self = this;
		var username = this.$("#inputUsername").val().replace(/\W/g, '').toLowerCase();
		var email = this.$("#inputEmail").val();
		var password = this.$("#inputPassword").val();
		var role = this.$("#inputRole").val();
		var shop = this.$("#inputShop").val();
		var userACL = new Parse.ACL(Parse.User.current());

		Parse.User.signUp(username, password, { email: email, role: role, ACL: userACL }, {
			success: function(user) {
				App.Router.navigate('/', {trigger: true});
				$('.intro').html("<h3>Thanks for joining!</h3>");
		    	if(user.attributes.role === 'user'){
		    		var profile = new App.Models.UserProfile();
		    	} else  {
		    		var profile = new App.Models.ArtistProfile(); 
		    	};
		      	profile.set('user',user);
		      	profile.set('shop',shop);
		      	profile.save().then(function(){
		      		App.render();
		      	});
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

App.Views.Upload = Parse.View.extend({
	id: 'upload',
	template: _.template($("#uploadTemplate").html()),
    events: {
    	"click [data-dismiss='fileinput'],[data-trigger='fileinput']": 		"clear",
     	"submit form": 														"upload"
    },
    clear: function(){
    	$("#upload .error").hide();
    },
	upload: function(e){
		e.preventDefault();
		$("#upload button").attr("disabled", "disabled");
		var fileUpload = $("#fileUpload")[0];
		if (fileUpload.files.length > 0) {
			var upload = fileUpload.files[0];
			var name = "tattoo.jpg";
			var file = new Parse.File(name, upload);
			file.save().then(function(file) {
				var tattoo = new App.Models.Tattoo();
				tattoo.set("file", file);
				tattoo.set("uploader", Parse.User.current());

				if (Parse.User.current().attributes.role === 'user') {
			        tattoo.set("artistName", this.$("#editArtistName").val());
			        tattoo.set("artistEmail", this.$("#editArtistEmail").val());
				} else {
					tattoo.set("artist", Parse.User.current());
					tattoo.set("artistName", App.profile.attributes.name );
				}

				return tattoo.save();
			}).then(function (tattoo) {
				// adds the tattoo to the user's profile
				var tattoos = App.profile.relation("tattoos");
				tattoos.add(tattoo);
				return App.profile.save();
			}).then(function(user) {
  				Parse.history.navigate('myprofile', {trigger: true});
			}, function(error) {
				console.log(error);
				$("#upload .error").html(error.message).show();
				$("#upload button").removeAttr("disabled");
			});
		}


	},
	render: function(){
		this.$el.html(this.template());
		return this;
	}
});

App.Views.ArtistEdit = Parse.View.extend({
	id: 'edit',
	template: _.template($("#artistEditTemplate").html()),
    initialize: function() {
    	Parse.history.navigate("myprofile/edit", {trigger: false, replace: true});
    },
    events: {
      "click #cancel": 		"cancel",
      "click #delete": 		"delete"
    },
	cancel: function(e){
		Parse.history.navigate("myprofile", {trigger: true});
	},
	delete: function(e){
		this.model.destroy();
		Parse.history.navigate("myprofile", {trigger: true});
	},
	render: function(){
		this.$el.html(this.template());
		return this;
	}
});

App.Views.Login = Parse.View.extend({
	el: $('#login'),
	template: _.template($("#loginTemplate").html()),
    initialize: function() {
     	_.bindAll(this, "logIn");

    	//render the login modal
    	this.render();

    },
    events: {
      "submit form.loginForm": 		"logIn",
      "click #forgotPassword": 		"passwordForm"
    },
    logIn: function(e){
      var self = this;
      var username = this.$("#loginUsername").val();
      var password = this.$("#loginPassword").val();

      Parse.User.logIn(username, password, {
        success: function(user) {
        	$('#login').modal('hide');
			Parse.history.navigate('/', {trigger: true});
			$('.intro').html("<h3>Welcome back "+Parse.User.current().getUsername()+"!</h3>");
			App.render();
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
		var forgotPassword = new App.Views.ForgotPassword();
		$('.app').html(forgotPassword.render().el);
    },
	render: function(){
		this.$el.html(this.template());
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
    	var info = $("#inputInfo").val();
		Parse.User.requestPasswordReset(info, {
		  success: function() {
		    // Password reset request was sent successfully
		    this.$('p').html('Check your email for the password reset link!')
		    setTimeout(function() { Parse.history.navigate('', {trigger: true}) }, 2400);
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
	model: App.Models.User
});

App.Collections.Tattoos = Parse.Collection.extend({
	model: App.Models.Tattoo
});

App.Collections.Adds = Parse.Collection.extend({
	model: App.Models.Add
});

App.Collections.FeaturedArtists = Parse.Collection.extend({
	model: App.Models.User,
	page: 0
});


///////// Routers
App.Router = new (Parse.Router.extend({
	routes: {
		"":						"home",
		"featured/p:page":		"featured",
		"about":   				"about",
		"join":        		    "join",
		"login":        		"login",
		"settings":        		"settings",
		"interview":      		"interview",
		"myprofile":  	 		"myProfile",
		"tattoo/new": 			"upload",
		"user/:uname":   		"showUserProfile",
		":uname":   			"showProfile"
	},
	initialize: function(){

		//google analtic tracking
		this.bind('route', this._pageView);

		this.user = Parse.User.current();
		
		App.render();

	},
	home: function(){
		var intro = new App.Views.Intro();
		$('.app').html(intro.render().el);

		this.per = 7;
		var query = new Parse.Query(App.Models.ArtistProfile);
		query.containedIn("featuremonth", ["6", "7"]);
		query.limit(this.per);
		query.descending("createdAt");
		query.find({
		  success: function(artists) {
		    App.Collections.featuredArtists = new App.Collections.FeaturedArtists(artists);
			App.Views.featuredArtists = new App.Views.FeaturedArtists({collection:  App.Collections.featuredArtists});
			App.Views.featuredArtists.render();
			App.Views.featuredArtists.renderLoad();
		  },
		  error: function(message){
		  	console.log(message);
		  }
		});
	
	},
	featured: function(page) {
		var skip = page * this.per;
		var query = new Parse.Query(App.Models.ArtistProfile);
		query.containedIn("featuremonth", ["6", "7"]);
		query.skip(skip);
		query.limit(this.per);
		query.descending("createdAt");
		query.find({
		  success: function(artists) {
		  	App.Collections.featuredArtists.add(artists);
		  	App.Views.featuredArtists.renderLoad();
		  },
		  error: function(message){
		  	console.log(message);
		  }
		});
	},
	showProfile: function(uname){

		// define the parse query to get the artist from the router
		var query = new Parse.Query(App.Models.ArtistProfile);
		query.equalTo("username", uname);
		// find the first object with the above query
		query.first().then(function(artist) {
			if (typeof(artist)==='undefined'){
				// if the artist couldn't be found, search for user profiles
				Parse.history.navigate('user/'+uname, {trigger: true});
				
			} else  {
				var profile = new App.Views.ArtistProfile({model: artist});
				$('.app').html(profile.render().el);

			  	var tattoos = artist.relation('tattoos');
			  	var query = tattoos.query();
			  	query.descending("createdAt");
			  	query.find({
			  		success: function(tats) {
			  			var tattoos = new App.Collections.Tattoos(tats);
			  			var collection = new App.Views.Tattoos({collection: tattoos});
			  			collection.render();
			  		}
			  	});

			}

		}, function(error) {
		    console.log("Error: " + error.code + " " + error.message);
		});
	},
	showUserProfile: function(uname){
		// define the parse query to get the user from the router
		var query = new Parse.Query(App.Models.UserProfile);
		query.equalTo("username", uname);
		query.first().then(function(user) {
			if (typeof(user)==='undefined'){
				Parse.history.navigate('/', {trigger: true});
				$('.intro').html("<h3>Couldn't find the user you were looking for...</h3>");
			} else {
				var user = new App.Views.UserProfile({model: user});
				$('.app').html(user.render().el);

			  	var tattoos = user.relation('tattoos');
			  	var query = tattoos.query();
			  	query.descending("createdAt");
			  	query.find({
			  		success: function(tats) {
			  			var tattoos = new App.Collections.Tattoos(tats);
			  			var collection = new App.Views.Tattoos({collection: tattoos});
			  			collection.render();
			  		}
			  	});

			  	// var adds = user.relation('added');
			  	// var query = adds.query();
			  	// query.descending("createdAt");
			  	// query.include("tattoo");
			  	// query.find({
			  	// 	success: function(adds) {
			  	// 		var userTattoos = new App.Collections.Adds(adds);
			  	// 		var adds = new App.Views.Adds({collection: userTattoos});
			  	// 		adds.render();
			  	// 	}
			  	// });
			} 

		}, function(error) {
		    console.log("Error: " + error.code + " " + error.message);
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
		$('#login').modal('show');
	},
	settings: function(){

		var settings = new App.Views.Settings();
		$('.app').html(settings.render().el);

		settings.renderMap();
		settings.renderProf();

	},
	interview: function(){
		var interview = new App.Views.Interview();
		$('.app').html(interview.render().el);
	},
	myProfile: function(){
		if (this.user.attributes.role === 'user'){
			var myProfile = new App.Views.UserProfile({model: App.profile});
			//also try user.attributes.profile
		} else {
			var myProfile = new App.Views.ArtistProfile({model: App.profile});
		}
		
	  	$('.app').html(myProfile.render().el);

	  	var tattoos = App.profile.relation('tattoos');
	  	var query = tattoos.query();
	  	query.descending("createdAt");
	  	query.find({
	  		success: function(tats) {
	  			var tattoos = new App.Collections.Tattoos(tats);
	  			var portfolio = new App.Views.MyTattoos({collection: tattoos});
	  			portfolio.render();
	  		}
	  	});

	},
	upload: function(){
		var upload = new App.Views.Upload();
		$('.app').html(upload.render().el);
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

