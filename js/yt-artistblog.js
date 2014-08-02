

Parse.$ = jQuery;

// Initialize Parse with DEMO Parse application javascript keys
Parse.initialize("ngHZQH087POwJiSqLsNy0QBPpVeq3rlu8WEEmrkR",
               "J1Co4nzSDVoQqC1Bp5KU7sFH3DY7IaskiP96kRaK");


var App = new (Parse.View.extend({
	Models: {},
	Views: {},
	Collections: {},

	start: function(){
		Parse.history.start({pushState: false, root: '/'});

		// render initial nav
		var nav = new App.Views.Nav();
		$('#footer').fadeIn( 800 );

		this.getProfile();
		this.typeaheadInitialize();
	},
	events: {
		//simplifies html to use routers where needed
		"click [href^='/']": 			"links"
	},
	links: function(e){
		e.preventDefault();
		App.back = Parse.history.getFragment();
		console.log(e.target.pathname);
		Parse.history.navigate(e.target.attributes.href.value, {trigger: true});
	},
	getProfile: function(callBack){
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

				//optional callback if page needs App.profile
				if (callBack) { callBack(); }

			}, function(error) {
			    console.log("Error: " + error.code + " " + error.message);
			});
		}
		return App.profile;
	},
	typeaheadInitialize: function(){
		var books = ['Realistic','OldSkool','Black&White','Abstract','Gray Wash',
		'Celtic','Biomechanical','Color', 'Tribal','Surrealist','Cartoon','WhiteInk', 'Polynesian', 'Asian', 'Animal', 'Flower', 'Skull', 'Japanese', 'Sexy', 'Fantasy', 'Bold','Graphic','Refined','OldWest'
		];  ///initial books local. needs to pull the user's books.

		this.booktt = new Bloodhound({
			datumTokenizer: Bloodhound.tokenizers.obj.whitespace('books'),
			queryTokenizer: Bloodhound.tokenizers.whitespace,
			local:  $.map(books, function(book) { return { books: book }; })
		});
		this.booktt.initialize();

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
	className: "Add",
	defaults: function() {
      return {
	    books:[]
      };
	}
});

App.Models.FeaturedArtist = Parse.User.extend({
	className: "User"
});


///////// Views
App.Views.Nav = Parse.View.extend({
	el: '.navs',
	initialize: function() {
		this.render();
	},
	template: _.template($("#navTemplate").html()),
	events: {
		"click #logout": 		"logout"
	},
	logout: function(){
		Parse.User.logOut();
		this.render();
		var current = Parse.history.getFragment();
		if ( current == 'settings' || current == 'upload' || current == 'myprofile' ) {
			Parse.history.navigate('', {trigger: true});
		}
	},
    render: function () {
    	$('.navs').html(this.template());
    	return this;
    }
});

App.Views.Login = Backbone.Modal.extend({
	className: 'login',
	initialize: function(){
		Parse.history.navigate('login', {trigger: false});
	},
	template: _.template($("#loginTemplate").html()),
	cancelEl: '.x',
	events: {
	      "submit form.loginForm": 		"logIn",
	      "click .btn-link": 			"passwordForm"
	},
    logIn: function(){
      var that = this;
      var username = this.$("#loginUsername").val();
      var password = this.$("#loginPassword").val();

      Parse.User.logIn(username, password, {
        success: function(user) {
			var nav = new App.Views.Nav();
			that.triggerCancel();
			that.undelegateEvents();
			delete that;
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
    passwordForm: function(){
		var forgotPassword = new App.Views.ForgotPassword();
		$('#app').html(forgotPassword.render().el);
		this.triggerCancel();
    },
	onRender: function(){
		$("body").css("overflow", "hidden");
	},
	cancel: function(){
		$("body").css("overflow", "auto");
		Parse.history.navigate(App.back, {trigger: false});
	}
});

App.Views.TattooProfile = Backbone.Modal.extend({
	className: 'tattooProfile',
	initialize: function(){
		Parse.history.navigate('/tattoo/'+this.model.id, {trigger: false});
		_.bindAll(this, 'focusIn');
	},
	template: _.template($("#tattooProfileTemplate").html()),
	cancelEl: '.x',
	events: {
		"click .artistName": 	"triggerCancel",
     	'click .add': 			'createAdd',
     	'click .save': 			'saveBooks',
     	'click .clear': 		'clearBooks',
     	'click .remove': 		'removeAdd'
	},
	onRender: function(){
		$("body").css("overflow", "hidden");

		//checks if the user has added the tattoo
		if (Parse.User.current()) {
			if ($.inArray(this.model.id, Parse.User.current().attributes.added) > -1) {
				this.showYourBooks();
			}
		}

		//checks if the artist was included and fetches the artist if not
		var that = this;
		if (this.model.attributes.artistProfile.username) {
			var artist = this.model.attributes.artistProfile;
			this.setArtist(artist);
		} else {
			that.model.attributes.artistProfile.fetch({
			  success: function(profile) {
			  	artist = profile.toJSON();
			  	that.setArtist(artist);
			  },
			  error: function(obj, error) {
			    console.log(error);
			  }
			});
		}
	},
	setArtist: function(artist) {
		if(artist.profThumb !== undefined){this.$(".prof")[0].src = artist.profThumb.url};
		this.$(".artistName").html('By ' + artist.name).attr('href',"/" + artist.username);
		this.$(".artistLoc").html('<span>' + artist.username + '</span><br>' + artist.shop + ' / ' + artist.locationName);
		this.$(".infoBox").delay( 500 ).fadeIn();
	},
	createAdd: function(){
		var user = Parse.User.current();
		var that = this;

		if (Parse.User.current()) {
			this.$('.add').attr('disabled', 'disabled');
			if ($.inArray(this.model.id, user.attributes.added) > -1) {
				this.$('.add').html('<span class="flaticon-book104"></span>Already Collected...');
				setTimeout(function(){that.showYourBooks()},1000)
			} else {
				this.$('.add').html('<span class="flaticon-book104"></span>Collected!!!');
				var add = new App.Models.Add();
				add.set("artistProfile", this.model.attributes.artistProfile);
				add.set("tattooId", this.model.id);
				add.set("tattoo", this.model);
				add.save().then(function (add) {
					// Add the ids of the added tattoos and assigns it to the view
					user.addUnique('added', add.attributes.tattoo.id);
					that.add = add;
					return user.save();
				}).then(function (user) {
					var collectedArtists = App.profile.relation("collectedArtists");
					collectedArtists.add(that.model.attributes.artistProfile);
					return App.profile.save();	
				}).then(function(profile) {
					console.log(profile);
					that.showYourBooks();
				}, function(error) {
					console.log(error);
					that.showAddButton();
				});
			}

		} else {
			Parse.history.navigate('/login', {trigger: true, replace: true});
			$(".loginForm .error").html("You need to be logged in to collect tattoos.").show();
		}

	},
	clearBooks: function(){
		var that = this;
		$('.clear').attr('disabled', 'disabled');
		$('.bootstrap-tagsinput').removeClass('bootstrap-tagsinput-max');
		$('.booksInput').tagsinput('removeAll');

		$('.clear').fadeOut(800,function(){
			$(this).removeClass('clear').removeAttr("disabled").addClass('remove').html('Remove tattoo').fadeIn();
			that.saveBooks().focusIn();
		});

	},
	removeAdd: function(){
		this.$('.remove').attr('disabled', 'disabled');

		var user = Parse.User.current();
		var that = this;

		this.add.destroy().then(function (added) {
			var user = Parse.User.current();
			user.remove('added', added.attributes.tattoo.id);
			return user.save();
		}).then(function(user) {
			Parse.history.navigate(App.back, {trigger: true});
			that.showAddButton();
		}, function(error) {
			console.log(error);
		});
	},
	showAddButton: function(){
		this.$('.remove').fadeOut(800,function(){
			$(this).removeClass('remove btn-link').removeAttr("disabled").addClass('add btn-block btn-submit').html('<span class="flaticon-book104"></span>Collect').slideDown();
		});
		$('.yourBooks').fadeOut();
	},
	getAdd: function(){
		var user = Parse.User.current();
		var that = this;
		//checks if the add is already stored
		if (!this.add) {
			var query = new Parse.Query(App.Models.Add);
			query.equalTo('tattooId', this.model.id);
			query.equalTo('user', user)
			query.first().then(function(add){
				that.add = add;
			}).then(function() {
				that.setBooks(that.add.attributes.books);
			}, function(error) {
				console.log(error);
			});
		} else {
			that.setBooks(that.add.attributes.books);
		}
	},
	setBooks: function(books){
     	_.each(books, function(book) {
			this.$('.booksInput').tagsinput('add', book);
        });
        $('.btn-tag').addClass('blured');
		window.setTimeout(function(){
			$('.save').hide();
			if(books.length === 5) {
				$('.booksInput').tagsinput('input').attr('placeholder','');
			}
		}, 400);
	},
	showYourBooks: function(){
		this.$('.add').fadeOut(700,function(){
			$(this).removeClass('add btn-block btn-submit').removeAttr("disabled").addClass('remove btn-link').html('Remove tattoo').fadeIn( 400 );
		});
		this.$('.yourBooks').slideDown(800);

		var input = this.$('.booksInput');
		input.tagsinput({
			tagClass: 'btn-tag',
			trimValue: true,
			maxChars: 20,
			maxTags: 5,
			onTagExists: function(item, $tag) {
				$tag.addClass('blured');
				window.setTimeout(function(){$tag.removeClass('blured');}, 1000);
			}
		});
		input.tagsinput('input').typeahead(null, {
			name: 'books',
			displayKey: 'books',
			source: App.booktt.ttAdapter()
		}).attr('placeholder','Type to add').on('typeahead:selected', $.proxy(function (obj, datum) {
			this.tagsinput('add', datum.books);
			this.tagsinput('input').typeahead('val', '');
		}, input)).on('focus', function () {
			$('.btn-tag').removeClass('blured');
			$('.bootstrap-tagsinput').addClass('focused');
			$('.tt-input').attr('placeholder','');
		}).on('blur', function () {
			$('.btn-tag').addClass('blured');
			$('.bootstrap-tagsinput').removeClass('focused');
			if ($('.bootstrap-tagsinput').hasClass('bootstrap-tagsinput-max')) {
			    $('.tt-input').attr('placeholder','').val('');
			} else {
				$('.tt-input').attr('placeholder','Add + + +').val('');
			}
		});
		input.on('itemAdded', function(event) {
		 	$('.save').fadeIn();
			$('.remove').fadeOut(800,function(){
				$(this).removeClass('remove').addClass('clear').html('Clear books').fadeIn();
			});
		}).on('itemRemoved', function(event){
			$('.save').fadeIn();
		});

		//focus in on the add window on keypress
		$(document).bind('keypress', this.focusIn);

		this.getAdd();
	},
	saveBooks: function() {
		$('.save').attr('disabled', 'disabled');

		var that = this;
		var oldBooks = this.add.attributes.books;
		var newBooks = this.$('.booksInput').tagsinput('items');
		var removed = _.difference(oldBooks, newBooks);
		var added = _.difference(newBooks, oldBooks);

		this.add.set('books', this.$('.booksInput').tagsinput('items').slice(0));
		this.add.save().then(function(add){
			Parse.Cloud.run('add', {added: added, removed: removed, tattooId: that.model.id}, {
			  success: function(result) {
			    console.log(result);
			    return result;
			  },
			  error: function(error) {
			  	console.log(error);
			  	return Parse.Promise.error(error);
			  }
			});			
		}).then(function(result) {
			console.log(result);
			$('.save').html('Saved!!!').fadeOut( 1200, function(){
				$(this).removeAttr("disabled").html('Save');
			});
		}, function(error) {
			$('.save').removeAttr("disabled");
			console.log(error);
		});
		return this;
	},
	focusIn: function(){
		var that = this;
		$('.tt-input').focus();
		if ($('.bootstrap-tagsinput').hasClass('bootstrap-tagsinput-max')) {
		    $('.tt-input').blur().val(' ');
		    if($('.save').is(':visible')) {   
		        $('.save').click();
		    }
		}
		return this;
	},
	beforeCancel: function(){
		Parse.history.navigate(App.back, {trigger: false});
		$("body").css("overflow", "auto");
		$(document).unbind('keypress', this.focusIn);
		this.unbind();
	}
});

App.Views.ArtistProfile = Parse.View.extend({
	model: App.Models.User,
	id: 'artistProfile',
	initialize: function() {
		this.activateAffix();
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
	    this.scroll();
	},
	aboutTab: function(e){
	    e.preventDefault();
	    $(this).tab('show');
		this.scroll();
	},
	shopTab: function(e){
	    e.preventDefault();
	    $(this).tab('show');
	    this.renderMap();
	    this.scroll();
	},
	scroll: function(){
		$("html, body").animate({ scrollTop: $('.profHead').outerHeight(true) + 41  }, 500);
	},
	activateAffix: _.debounce(function(){
		$('.profNavContainer').affix({
		      offset: { top: $('.profHead').outerHeight(true) + 40 }
		});
	}, 1000),

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
    }, 500),

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

App.Views.Tattoos = Parse.View.extend({
	el: '.tattoos',
	// userType: 'artist',
	initialize: function(){
		_.bindAll(this, 'renderTattoo');
	},
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
		$(this.el).append(tattoo.render().el);
		return this;
	}
});

App.Views.Tattoo = Parse.View.extend({
	className: 'tattoo',
	template: _.template($("#tattooTemplate").html()),
	initialize: function(){
		_.bindAll(this, 'add', 'edit', 'showAddButton', 'showEdit');
	},
    events: {
     	'click .open': 					'open',
     	'click .hover-text-content': 	'profile',
     	'click .add': 					'add',
     	'click .edit': 					'edit'
    },
    open: function(){
    	App.back = Parse.history.getFragment();
    	///needs to pass the tattoo events to the tattoo
    	var profile = new App.Views.TattooProfile({model: this.model});
		$('.modalayheehoo').html(profile.render().el);
		return profile;
    },
    profile: function(e){
    	e.stopPropagation();
    	Parse.history.navigate(this.model.attributes.artistProfile.username, {trigger: true, replace: true});
    	$("html, body").animate({ scrollTop: 0 }, 600);
    },
	add: function(e){
		e.stopPropagation();
		var user = Parse.User.current();
		var that = this;

		if (Parse.User.current()) {
			this.$('.add').attr('disabled', 'disabled');
			if ($.inArray(this.model.id, user.attributes.added) > -1) {
				this.$('button').html('<span class="flaticon-book104"></span>Already Collected...');
				setTimeout(function(){this.showEdit()},1000)
			} else {
				this.$('button').addClass('add:active').html('<span class="flaticon-book104"></span>Collected!!!');
				//opens the tattoo profile, returns the profile then calls the add function on the profile.
				this.open().createAdd();
				this.showEdit();
			}
		} else {
			Parse.history.navigate('/login', {trigger: true, replace: true});
			$(".loginForm .error").html("You need to be logged in to collect tattoos.").show();
		}
	},
	edit: function(e){
		e.stopPropagation();
		this.open();
	},
	showAddButton: function(){
		this.$('button').fadeOut().removeClass('edit').removeAttr("disabled").addClass('add btn-block').html('<span class="flaticon-book104"></span>Collect').fadeIn();
	},
	showEdit: function(){
		this.$('button').fadeOut().removeClass('add btn-block').removeAttr("disabled").addClass('edit pull-right').html('Edit&nbsp;&nbsp;<span class="flaticon-book104"></span>').fadeIn();
	},
	render: function(){
		// checks if the artist profile was included, then toJSONs the attributes and includes it when rendering.
		// The if statement avoids issues with saving the add, where it tries to save the JSONed tattoo as well.
		if (this.model.attributes.artistProfile.createdAt !== undefined) {
			this.model.attributes.artistProfile = this.model.attributes.artistProfile.toJSON();
		}
		var attributes = this.model.toJSON();
		$(this.el).append(this.template(attributes));

		//checks if the user has added the tattoo
		if (Parse.User.current()) {
			if ($.inArray(this.model.id, Parse.User.current().attributes.added) > -1) {
				this.showEdit();
			}
		}
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
	className: 'tattoo',
	template: _.template($("#myTattooTemplate").html()),
	events: {
		'click button': 'edit',
		'click .open': 	'open'
	},
    open: function(){
    	var profile = new App.Views.TattooProfile({model: this.model});
		$('.modalayheehoo').html(profile.render().el);
    },
	edit: function(e){
		e.stopPropagation();

		var edit = new App.Views.ArtistEdit({model: this.model});
		$('#app').html(edit.render().el);

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

App.Views.UserProfile = Parse.View.extend({
	model: App.Models.User,
	id: 'userProfile',
	initialize: function() {
		this.activateAffix();
	},
	template: _.template($("#userTemplate").html()),
	events: {
		'click [href="#addsTab"]': 'addsTab',
		'click [href="#tattoosTab"]': 'tattoosTab'
	},
	addsTab: function(e){
	    e.preventDefault();
	    $(this).tab('show');
	},
	tattoosTab: function(e){
	    e.preventDefault();
	    $(this).tab('show');
	},
	activateAffix: _.debounce(function(){
		$('.profNavContainer').affix({
		      offset: { top: $('#userProfile > div.container').outerHeight(true) + 40 }
		});
	}, 1000),
	render: function(){
		var attributes = this.model.attributes
		this.$el.html(this.template(attributes));
		return this;
	}
});

App.Views.Landing = Parse.View.extend({
	id: 'landing',
	landingTemplate: _.template($("#landingTemplate").html()),
	initialize: function(){
		var that = this;
		$('.navs').hide();
		this.loadArtist();

		/// Workaround for getting a random artist. Will not scale over 1,000 due to query constraint....
		var query = new Parse.Query(App.Models.ArtistProfile);
		query.containedIn("featuremonth", ["6", "7"]);
		query.count().then(function(count){
			that.totalArtists = count;
		});

		_.bindAll(this, 'removeLanding','loadArtist');
	    $(window).bind('scroll',this.removeLanding);
	},
    events: {
    	"click a":	"continue"
    },
	land: function(){
		var that = this;
		this.$('.welcome').delay( 100 ).fadeIn( 600 ).delay( 2800 ).animate({
			    marginTop: "5vh",
			    opacity: 0
			  }, 600, function() {
			    // Animation complete.
			  });
		this.$('.logo').delay( 500 ).fadeIn( 1000 ).delay( 2000 )
			.animate({
			    marginBottom: "+5vh"
			  }, 600, "swing", function() {
			    that.$('.landingLinks').fadeIn();
			    that.showNextArtist();
			  });
		this.$('.artistLoc').delay( 1000 ).fadeIn().delay( 2200 ).fadeOut( 300 );

	},
	scrollTattoos: function(tattoos){
		var that = this;
		$(tattoos).scrollLeft( 0 ).animate({scrollLeft: 300}, {
			duration: 6000, 
			easing: "linear", 
			start: function() {
				setTimeout(function(){that.showNextArtist();}, 5200)
			}
		});
	},
	showNextArtist: function(){
		var that = this;
		//// animate down to give a sinking effect.
		this.$('.landingTattooContainer:hidden:first').delay( 600 ).fadeIn( { 
			duration: 800,
			start: function() {
	    		that.scrollTattoos(this);
	  		},
			complete: function() {
	    		that.loadArtist();
	  		}
  		});
		this.$('.landingTattooContainer:visible:first').fadeOut( 700 );
		this.$('.artistName').fadeOut( 800, function() {
			$(this).html(that.artistName).fadeIn( 1000 );
			$(this).attr('href','/'+that.artistUsername);
		});
		this.$('.artistLoc').fadeOut( 700, function() {
			$(this).html(that.artistLocationName).fadeIn( 900 );
		});
		
	},
	loadArtist: function(){
		// initial total value
		this.totalArtists = 36;
		var that = this;
		var query = new Parse.Query(App.Models.ArtistProfile);
		query.containedIn("featuremonth", ["6", "7"]);
		query.limit(1);
		query.select("name", "username", "locationName");
		query.skip(Math.floor(Math.random() * this.totalArtists));
		query.first().then( function(artist){
			that.artistName = artist.attributes.name;
		  	that.artistUsername = artist.attributes.username;
		  	that.artistLocationName = artist.attributes.locationName;
		  	return artist;
		}).then(function(artist){
		  	var tattoos = artist.relation('tattoos');
		  	var query = tattoos.query();
		  	query.limit(8);
		  	query.find().then(function(tats) {
		  		that.$('.landingTattooContainer:hidden:first').html('');
	  			_.each(tats, function(tat) {
	  				var thumb = tat.get('fileThumb').url();
	  				that.$('.landingTattooContainer:hidden:first').append(_.template('<img src='+thumb+' class="tattooImg open">'));
	  			}, that);
		  	});
		}).then(function() {

		}, function(error) {
			console.log(error.message);
		});

	},
	continue:function(){
		//scrolls downward. 
		$('#app').fadeOut( 300 ).fadeIn( 900 );
		$("html, body").animate({ scrollTop: $(window).height()+100 }, 600);

	},
	render: function(){
		$(this.el).append(this.landingTemplate());
		return this;
	},
	removeLanding:function(){
		var that = this;
		if ($(window).height() - 150 <= $(window).scrollTop()) {
			$('.navs').fadeIn();
		}
		if ($(window).height()+100 <= $(window).scrollTop()) {
			$(window).unbind('scroll',this.removeLanding);
			that.remove();
			$(window).scrollTop( 0 );
		}
	}
});

App.Views.FeaturedArtistPage = Parse.View.extend({
	id: 'featured',
	featuredContainerTemplate: _.template($("#featuredContainerTemplate").html()),
	render: function(){
		var html = this.featuredContainerTemplate();
		$(this.el).append(html);
		return this;
	}
});

App.Views.FeaturedArtists = Parse.View.extend({
	el: '#featuredArtists',
	loadTemplate: _.template(' <div class="end" style="display: none"><img src="img/yt-featuredend.png"><h5>See you tomorrow</h5><br><button type="button" id="more" class="btn-lg">More Artists</button></div>'),
    initialize: function () {
    	this.load();
    	this.collection.on('reset', this.render, this);
    	this.collection.bind('add', this.addOne);
   	
    	/// *better place to put this?
    	$(window).scroll(function () {	
			if ($(document).height() - 1 <= $(window).scrollTop() + $(window).height()) {
			 	$('.featuredArtist:hidden:first').fadeIn("slow");
				if($('.featuredArtist:last').is(':visible')) {
			 		$('#featuredArtists .end').fadeIn();
				}
			}
		});
    },
    events: {
    	'click #more': 'more'
    },
    render: function () {
      this.addAll();
      return this;
    },
    more: function(e){
    	//hides load button after clicked
	 	$(e.target.parentElement).fadeOut("normal", function() {
	        $(this).remove();
	    });

    	this.load();
    	$("html, body").animate({ scrollTop: $('.end').offset().top }, 400);
    },
    load: function() {
    	var that = this;
		var query = new Parse.Query(App.Models.ArtistProfile);
		query.containedIn("featuremonth", ["6", "7", "8"]);
		var per = 7;
		var skip = this.collection.page * per;
		query.skip(skip);
		query.limit(per);
		query.descending("createdAt");
		query.find({
		  success: function(artists) {
		  	that.collection.add(artists);
		  	$('.featuredArtist:first').fadeIn();
		  	that.renderLoad();
		  },
		  error: function(message){
		  	console.log(message);
		  }
		});
		var p = (this.collection.page) ? '/p' + this.collection.page : '';
		Parse.history.navigate('featured'+p, {trigger: false});
    },
    renderLoad: function(e) {
    	this.collection.page++

    	/// H ~ checks if there are no more artists. What is the better way to do this?
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
      'click button, .prof, h4': 'viewProfile'
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
  				this.$('.portfolioContainer').append(_.template('<a class="tattooContainer open"><img src='+thumb+' class="tattooImg" href="/tattoo/' + tat.id + '"></a>'));
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
    	"keyup #editFB, #editInstagram, #editTwitter, #editWebsite":"linkVal",
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
				$(".prof")[0].src = file.url();
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
			$(".prof")[0].src = file.url();
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
    	var validated = $("#inputUsername").val().replace(/\W/g, '').toLowerCase();
		$("#inputUsername").val(validated);
    },
    signUp: function() {
		var self = this;
		var username = this.$("#inputUsername").val().replace(/\W/g, '').toLowerCase();
		var email = this.$("#inputEmail").val();
		var password = this.$("#inputPassword").val();
		var role = this.$("#inputRole").val();
		var shop = this.$("#inputShop").val();

		Parse.User.signUp(username, password, { email: email, role: role }, {
			success: function(user) {
				var nav = new App.Views.Nav();
				App.Router.navigate('/', {trigger: true});
				$('.intro').html("<h3>Thanks for joining!</h3>");
		    	if(user.attributes.role === 'user'){
		    		var profile = new App.Models.UserProfile();
		    	} else  {
		    		var profile = new App.Models.ArtistProfile(); 
		    	};
		      	profile.set('shop',shop);
		      	profile.save().then(function(profile){
		      		App.profile = profile;
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
					tattoo.set("artistProfile", App.profile );
				}

				return tattoo.save();
			}).then(function (tattoo) {
				// adds the tattoo to the user's profile
				var tattoos = App.profile.relation("tattoos");
				tattoos.add(tattoo);
				return App.profile.save();
			}).then(function() {
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
		"":						"landing",
		"home":					"home",
		"featured":	    		"featured",
		"featured/p:page":	    "featured",
		"about":   				"about",
		"join":        		    "join",
		"login":        		"login",
		"settings":        		"settings",
		"interview":      		"interview",
		"myprofile":  	 		"myProfile",
		"tattoo/new": 			"upload",
		"tattoo/:id": 			"tattooProfile",
		"user/:uname":   		"showUserProfile",
		":uname":   			"showProfile"
	},
	initialize: function(){

		//google analtic tracking
		this.bind('route', this._pageView);

		this.user = Parse.User.current();

	},
	landing: function(){
		var that = this;
		if (!Parse.User.current()){

			var landing = new App.Views.Landing();
			$('#landing').html(landing.render().el);
			landing.land();
			setTimeout(function() { Parse.history.navigate('featured', {trigger: true}) }, 1000);
		} else {
			/// this will eventually go to the newsfeed / home page
			this.featured();
		}
	},
	home: function(){
		
	},
	featured: function(p) {
		var featured = new App.Views.FeaturedArtistPage();
		$('#app').html(featured.render().el);

	    App.Collections.featuredArtists = new App.Collections.FeaturedArtists();
	    App.Collections.featuredArtists.page = (p) ? p : 0;
		App.Views.featuredArtists = new App.Views.FeaturedArtists({collection:  App.Collections.featuredArtists});

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
				$('#app').html(profile.render().el);
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
		query.first().then(function(profile) {
			if (typeof(profile)==='undefined'){
				Parse.history.navigate('/', {trigger: true});
				$('.intro').html("<h3>Couldn't find the user you were looking for...</h3>");
			} else {
				var userProfile = new App.Views.UserProfile({model: profile});
				$('#app').html(userProfile.render().el);

			  	var addsQuery = new Parse.Query(App.Models.Add);
			  	addsQuery.descending("createdAt");
			  	addsQuery.equalTo('user', profile.attributes.user);
			  	addsQuery.include('tattoo');
			  	addsQuery.include('tattoo.artistProfile');
			  	addsQuery.find({
			  		success: function(adds) {
			  			tattoos = _.map(adds, function(add){ return add.attributes.tattoo; });
			  			var userTattoos = new App.Collections.Tattoos(tattoos);
			  			var userAdds = new App.Views.Tattoos({collection: userTattoos, el: '.adds'});
			  			userAdds.render();
			  		}
			  	});

			  	var tattoos = profile.relation('tattoos');
			  	var uploadsQuery = tattoos.query();
			  	uploadsQuery.descending("createdAt");
			  	uploadsQuery.find({
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
	about: function(){
		var about = new App.Views.About();
		$('#app').html(about.render().el);
		var join = new App.Views.Join();
		$('#app').append(join.render().el);
	},
	join: function(){
		var join = new App.Views.Join();
		$('#app').html(join.render().el);
	},
	login: function(){
		var login = new App.Views.Login();
		$('.modalayheehoo').html(login.render().el);
	},
	settings: function(){
		App.getProfile(renderSettings);

		function renderSettings(){
			var settings = new App.Views.Settings();
			$('#app').html(settings.render().el);

			settings.renderMap();
			settings.renderProf();
		}

	},
	interview: function(){
		var interview = new App.Views.Interview();
		$('#app').html(interview.render().el);
	},
	myProfile: function(){

		//render profile is a callback to get profile in order to wait for App.profile execute
		App.getProfile(renderProfile);

		function renderProfile(){

			if (Parse.User.current().attributes.role === 'user'){
				var myProfile = new App.Views.UserProfile({model: App.profile});
				$('#app').html(myProfile.render().el);

			  	var addsQuery = new Parse.Query(App.Models.Add);
			  	addsQuery.descending("createdAt");
			  	addsQuery.equalTo('user', Parse.User.current());
			  	addsQuery.include('tattoo');
			  	addsQuery.include('tattoo.artistProfile');
			  	addsQuery.find({
			  		success: function(adds) {
			  			tattoos = _.map(adds, function(add){ return add.attributes.tattoo; });
			  			var userTattoos = new App.Collections.Tattoos(tattoos);
			  			var userAdds = new App.Views.Tattoos({collection: userTattoos, el: '.adds'});
			  			userAdds.render();
			  		}
			  	});

			} else {
				var myProfile = new App.Views.ArtistProfile({model: App.profile});
				$('#app').html(myProfile.render().el);

			}

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
		}

	},
	upload: function(){
		App.getProfile(renderUpload);
		function renderUpload(){
			var upload = new App.Views.Upload();
			$('#app').html(upload.render().el);
		}
	},
	tattooProfile: function(id){
		var query = new Parse.Query(App.Models.Tattoo);
		query.get(id, {
			success: function(tattoo) {
				var profile = new App.Views.TattooProfile({model: tattoo});
				$('.modalayheehoo').html(profile.render().el);
			},
			error: function(object, error) {
				console.log(error);
			}
		});
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

