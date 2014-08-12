

Parse.$ = jQuery;

// Initialize Parse with DEMO Parse application javascript keys
Parse.initialize("ngHZQH087POwJiSqLsNy0QBPpVeq3rlu8WEEmrkR", "J1Co4nzSDVoQqC1Bp5KU7sFH3DY7IaskiP96kRaK");



var App = new (Parse.View.extend({
	Models: {},
	Views: {},
	Collections: {},
	initialize: function(){

	},
	start: function(){
		// render initial nav
		var nav = new App.Views.Nav();
		$('#footer').fadeIn( 800 );
		
		this.typeaheadInitialize();
		this.getProfile(this.startRouter);
		this.mapStyles = [{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-100},{"lightness":20}]},{"featureType":"road","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-100},{"lightness":40}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-10},{"lightness":30}]},{"featureType": "water","elementType": "geometry.fill","stylers": [{ "color": "#d9d9d9" }]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"visibility":"simplified"},{"saturation":-60},{"lightness":10}]},{"featureType":"landscape.natural","elementType":"all","stylers":[{"visibility":"simplified"},{"saturation":-60},{"lightness":5}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]}];
	},
	startRouter: function(){
		App.router = new App.Router();
		Parse.history.start({pushState: false, root: '/'});
	},
	getProfile: function(callBack){
		var user = Parse.User.current();
		if (!user) {
			_.once(App.Collections.adds = new App.Collections.Adds());
			if (callBack) { callBack(); }
			return;
		} else if (App.profile === undefined) {
			//gets the user's profile
			if (user.attributes.role === 'user'){
				var query = new Parse.Query(App.Models.UserProfile);
			} else {
				var query = new Parse.Query(App.Models.ArtistProfile);
			}
			query.equalTo("username", user.getUsername());
			query.first().then(function(result) {
				App.profile = result;
				return App.profile;
			}).then(function(profile){
			  	var addsQuery = new Parse.Query(App.Models.Add);
			  	addsQuery.descending("createdAt");
			  	addsQuery.equalTo('user', user);
			  	addsQuery.include('tattoo');
			  	addsQuery.include('artistProfile');
			  	return addsQuery.find();
			}).then(function(adds){
				App.Collections.adds = new App.Collections.Adds(adds);
				return;
			}).then(function(results){
				if (callBack) { callBack(); }
			}, function(error) {
			    console.log("Error: " + error.code + " " + error.message);
			});
		} else {
			if (callBack) { callBack(); }
		}
		return App.profile;
	},
	typeaheadInitialize: function(){
		var books =  [ "Abstract","Ambigram","Americana","Anchor","Angel","Animal","Ankle","Aquarius","Aries","Arm","Armband","Art","Asian","Astrology","Aztec","Baby","Back","Barcode","Beauty","Bible","Bicep","Biomechanical","Bioorganic","Birds","Black","Black And Gray","Blossom","Blue","Boats","Bold","Bright","Bubble","Buddha","Bugs","Bull","Butterfly","Cancer","Capricorn","Caricature","Cartoon","Cartoons","Cat","Celebrity","Celestial","Celtic","Cherry","Chest","Chinese","Christian","Classic","Clover","Coffin","Color","Comics","Couples","Cover Up","Creatures","Cross","Culture","Dagger","Dc","Death","Demon","Design","Detail","Devil","Disney","Dog","Dolphin","Dotwork","Dove","Dragon","Dragonfly","Dream Catcher","Eagles","Ear","Egyptian","Eye","Face","Fairy","Fantasy","Feather","Fine Line","Fire","Flag","Flash","Flower","Foot","Forearm","Full Back","Full Leg","Gambling","Geisha","Gemini","Geometric","Gore","Graffiti","Graphic","Gray","Green","Gun","Gypsy","Haida","Half Sleeve","Hand","Hands","Hawk","Head","Heart","Hello Kitty","Hip","Hip Hop","Horror","Horse","Icon","Indian","Infinity","Insect","Irish","Jagged Edge","Japanese","Jesus","Joker","Kanji","Knife","Knots","Koi","Leg","Leo","Lettering","Libra","Lion","Lip","Lizard","Looney Toon","Love","Lower Back","Lyric","Macabre","Maori","Marvel","Mashup","Memorial","Mermaid","Mexican","Military","Minimalist","Moari","Money","Monkey","Monsters","Moon","Mummy","Music","Name","Native American","Nature","Nautical","Neck","New School","Numbers","Old School","Orange","Oriental","Other","Owl","Ox","Paint","Panther","Passage","Patriotic","Pattern","Peace","Peacock","People","Phoenix","Photograph","Photoshop","Piercing","Pig","Pinup","Pirate","Pisces","Polynesian","Portrait","Purple","Quote","Rabbit","Rat","Realistic","Red","Refined","Religion","Religious","Ribcage","Ring","Roman Numerals","Rooster","Rose","Sagittarius","Saint","Samoan","Samurai","Scorpio","Scorpion","Script","Sea","Sexy","Sheep","Shoulder","Side","Simple","Skull","Sleeve","Snake","Snakes","Space","Sparrow","Spider","Spirals","Spiritual","Sports","Star","Statue","Stomach","Sun","Surreal","Swallow","Symbols","Tahitian","Tattoo Events","Taurus","Tiger","Traditional","Transformers","Trash Polka","Tree","Tribal","Trinity Knot","Trinket","Unicorn","Upper Back","Viking","Virgo","Warrior","Water Color","Wave","Western","White Ink","Wings","Wizard","Wolf","Women","Wrist","Yellow","Zodiac","Zombie"];
		///initial books local. needs to pull the user's books.
		this.booktt = new Bloodhound({
			datumTokenizer: Bloodhound.tokenizers.obj.whitespace('books'),
			queryTokenizer: Bloodhound.tokenizers.whitespace,
			local:  $.map(books, function(book) { return { books: book }; })
		});
		this.booktt.initialize();
	},
	events: {
		//simplifies html to use routers where needed
		"click [href^='/']": 	"links"
	},
	links: function(e){
		e.preventDefault();
		$(window).unbind();
		if(typeof(e.target.attributes.href.value) !== undefined){
			App.back = Parse.history.getFragment();
			Parse.history.navigate(e.target.attributes.href.value, {trigger: true});
		}
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
	   	author:"",
	   	collectorCount:0
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
	className: "Tattoo",
	createAdd: function(startupBooks) {
		var that = this;

		if ($.inArray(this.id, App.Collections.adds.pluck('tattooId')) > -1) {
			that.trigger('add:created', App.Collections.adds.getTattoo(this.id)[0]);
		} else {
			var add = new App.Models.Add();
			add.set("artistProfile", this.attributes.artistProfile);
			if(startupBooks instanceof Array){
				add.set("books", startupBooks);	
			}
			add.set("tattooId", this.id);
			add.set("tattoo", this);
			add.save().then(function(add){
				App.Collections.adds.add(add);
				that.trigger('add:created', add);
			}, function(error){
				console.log(error);
			});
		}

	},
	removeAdd: function(){
		var that = this;
		App.Collections.adds.getTattoo(this.id)[0].destroy().then(function(add) {
			that.trigger('add:removed', add);
		}, function(error) {
			console.log(error);
		});
	},
	deleteTattoo: function(){
		this.destroy().then(function(tattoo){
			return tattoo;
		}, function(error){
			console.log(error);
		});
	},
	defaults: function() {
      return {
	    books:[]
      };
	}
});

App.Models.Add = Parse.Object.extend({
	className: "Add",
	initialize: function(){

	},
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
		App.profile = undefined;
		App.Collections.adds = new App.Collections.Adds();
		this.render();
		var current = Parse.history.getFragment();
		if ( current == 'settings' || current == 'upload' || current == 'myprofile' ) {
			Parse.history.navigate('', {trigger: true});
		} else {
			Parse.history.navigate(current, {trigger: true});
		}
	},
    render: function () {
    	$('.navs').html(this.template());
    	return this;
    }
});

App.Views.Search = Parse.View.extend({
	id: 'search',
	initialize: function(){
		_.bindAll(this, 'focusIn', 'scrollToTop', 'scrollChecker', 'getTattoos', 'typeaheadInitialize', 'queryReset');

		this.bindSearch();
	},
	template: _.template($("#searchTemplate").html()),
	events: {

	},
	bindSearch: function(){
		$(window).bind('scroll',this.scrollChecker);
		$(window).bind('keypress', this.focusIn);
	},
	unbindSearch: function(){
		$(window).unbind('scroll',this.scrollChecker);
		$(window).unbind('keypress', this.focusIn);
	},
	focusIn: function(){
		var that = this;
		this.$('.tt-input').focus();
		if (this.$('.bootstrap-tagsinput').hasClass('bootstrap-tagsinput-max')) {
		    this.$('.tt-input').blur().val(' ');
		}

		this.$('.tt-input').val(this.$('input.tt-input:last').val().toProperCase());
		this.scrollToTop();
		return this;
	},
	scrollToTop: function(){
		if (1 <= $(window).scrollTop()) {
			$("html, body").animate({ scrollTop: 0 }, 200);
		}
	},
	scrollChecker: function(){
		var that = this;
		if (20 <= $(window).scrollTop()) {
			$('.tt-dropdown-menu, .globalBooks').fadeOut( 450 );
		} else {
			$('.tt-dropdown-menu, .globalBooks').fadeIn( 800 );
		}
		if (this.loadMore && $('#search').height()-280 <= $(window).scrollTop()) {
			this.loadMore = false;
			this.page++
			this.getTattoos();
		}
	},
	queryReset: function(){
		this.tattoosCollection.reset();
		this.booksQuery = [];
		this.page = 0;
		this.loadMore = true;
		return this;
	},
	getTattoos: function(books){
		var that = this;
	  	var query = new Parse.Query('Tattoo');
	  	if(this.booksQuery.length > 0) {
	  		query.containsAll("books", this.booksQuery);
	  	}
		var skip = this.page * 40;
		query.skip(skip);
		query.limit(40);
		query.include('artistProfile');
	  	query.descending('updatedAt');
	  	query.find({
	  		success: function(tats) {
	  			that.tattoosCollection.add(tats);
	  			if (tats.length < 40 ) {
	  				that.loadMore = false;
	  			} else {
					that.loadMore = true;
/// show end.
	  			}
	  		},
	  		error: function(error) {
	  			console.log(error);
	  			that.loadMore = true;
	  		}
	  	});
	},

	typeaheadInitialize: function(){
		var that = this;
		var input = this.$('input');
		input.tagsinput({
			tagClass: 'btn-tag',
			trimValue: true,
			maxChars: 20,
			maxTags: 5,
			confirmKeys: [13, 9, 39, 40, 188],
			onTagExists: function(item, $tag) {
				$tag.addClass('blured');
				window.setTimeout(function(){$tag.removeClass('blured');}, 1000);
			}
		});
		input.tagsinput('input').typeahead(null, {
			name: 'books',
			displayKey: 'books',
			source: App.booktt.ttAdapter(),
			templates: {
				empty: '<span>No tattoos with that book.</span>',
				suggestion: _.template('<span class="bookSuggestion" style="white-space: normal;"><%= books %></span>')
			}
		}).attr('placeholder','Search').on('typeahead:selected', function (obj,datum) {
			input.tagsinput('add', datum.books);
			input.tagsinput('input').typeahead('val', '');
		}).on('typeahead:opened', function(){
			$('.globalBooks').hide();
		}).on('typeahead:closed', function(){
			if($('.tt-dropdown-menu').is(":hidden")){
				$('.globalBooks').show();
			}
		}).on('focus', function () {
			that.$('.tt-input').attr('placeholder','');
		}).on('blur', function () {
			if (that.$('.bootstrap-tagsinput').hasClass('bootstrap-tagsinput-max')) {
			    that.$('.tt-input').attr('placeholder','').val('');
			} else {
				that.$('.tt-input').attr('placeholder','Search').val('');
			}
		});

		input.on('itemAdded', function(event) {
			that.queryReset()
			that.booksQuery = input.tagsinput('items');
			that.getTattoos();
		}).on('itemRemoved', function(event){
			that.queryReset()
			that.booksQuery = input.tagsinput('items');
			that.getTattoos();
		});

		window.setTimeout(function(){
			$('.bookSuggestion').on('click', function(e){
				input.tagsinput('add', e.target.textContent);
			});
		}, 400);

		this.focusIn();
	},
	render: function(){
		var html = this.template();
		$(this.el).html(html);

		this.tattoosCollection = new App.Collections.Tattoos();
		this.tattoosView = new App.Views.Tattoos({collection: this.tattoosCollection, el: this.$('.tattoos')});
		this.tattoosView.render();

		this.typeaheadInitialize();

		this.queryReset();
		this.getTattoos();

		return this;
	}
});

App.Views.ArtistsPage = Parse.View.extend({
	id: 'artistsPage',
	template: _.template($("#artistsTemplate").html()),
	initialize: function(){

	},
	render: function(){
		var html = this.template();
		$(this.el).html(html);
		return this;
	}
});

App.Views.Artists = Parse.View.extend({
	el: '.artists',
	initialize: function(){
		_.bindAll(this, 'render', 'renderArtists', 'renderArtist');

		this.collection.on('add', this.renderArtist, this);
		this.collection.on('reset', this.render, this);

		this.load();

	},
	load: function(){
		var that = this;
		var query = new Parse.Query('ArtistProfile');
		query.descending('createdAt');
		query.find().then(function(artists){
			that.collection.add(artists);
		});
	},
    render: function () {
		this.renderArtists();
		return this;
    },
	renderArtists: function(e){
    	this.$el.empty();
    	this.collection.forEach(this.renderArtist, this);
	},
	renderArtist: function(artist){
		var artist = new App.Views.Artist({model: artist});
		$('.artists').append(artist.render().el);
		return this;
	}
});

App.Views.Artist = Parse.View.extend({
	className: 'artist',
	template: _.template($("#artistTemplate").html()),
	initialize: function(){

	},
    events: {
      'click': 'viewProfile'
    },
	viewProfile: function(){
		Parse.history.navigate(this.model.attributes.username, {trigger: true});
		$("html, body").animate({ scrollTop: 0 }, 200);
	},
	render: function(){
		var that = this;
		var attributes = this.model.toJSON();
		$(this.el).append(this.template(attributes));

	  	var tattoos = this.model.relation('tattoos');
	  	var query = tattoos.query();
	  	query.limit(4);
	  	query.find().then(function(tats) {
  			_.each(tats, function(tat) {
  				var thumb = tat.get('fileThumbSmall').url();
  				this.$('.tattoos').append(_.template('<a class="tattooContainer open"><img src='+thumb+' class="tattooImg" href="/tattoo/' + tat.id + '"></a>'));
  			}, that);
	  	});
		return this;
	}
});

App.Views.Login = Backbone.Modal.extend({
	className: 'login',
	initialize: function(){
		Parse.history.navigate('login', {trigger: false});
		if(App.search){App.search.unbindSearch()};
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
			App.getProfile();
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
		if(App.search){App.search.bindSearch()};
	}
});

App.Views.ArtistProfile = Parse.View.extend({
	id: 'artistProfile',
	initialize: function() {
		this.activateAffix();
		var that = this;

	  	var tattoos = this.model.relation('tattoos');
	  	var query = tattoos.query();
	  	query.descending("createdAt");
	  	query.find({
	  		success: function(tats) {
	  			that.tattoos = new App.Collections.Tattoos(tats);
	  			var tattoosView = new App.Views.Tattoos({collection: that.tattoos});
	  			tattoosView.render().renderBooks();
	  		}
	  	});
	},
	template: _.template($("#artistProfileTemplate").html()),
	events: {
		'click [href="#portfolioTab"]': 'portfolioTab',
		'click [href="#aboutTab"]': 	'aboutTab',
		'click [href="#shopTab"]': 		'shopTab'
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
	renderMap: _.debounce(function() {
	    var mapLocation = new google.maps.LatLng( this.model.attributes.location.latitude , this.model.attributes.location.longitude );
	    var mapOptions = { zoom: 12, center: mapLocation, styles: App.mapStyles, scrollwheel: false, panControl: false, mapTypeControl: false };
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
		var center = this.map.getCenter();
		google.maps.event.trigger(this.map, "resize");
		this.map.setCenter(center); 
	},
	render: function(){
		var attributes = this.model.attributes
		this.$el.html(this.template(attributes));
		return this;
	}
});

App.Views.TattooProfile = Backbone.Modal.extend({
	className: 'tattooProfile',
	initialize: function(){
		Parse.history.navigate('/tattoo/'+this.model.id, {trigger: false});
		_.bindAll(this, 'focusIn');

		this.model.on('add:created', this.showYourBooks, this);
		this.model.on('add:removed', this.showAddButton, this);

		if(App.search){App.search.unbindSearch()};
	},
	template: _.template($("#tattooProfileTemplate").html()),
	cancelEl: '.x',
	events: {
		"click .more": 			"renderPopularBooks",
		"click .otherBook": 	"addOtherBook",
		"click .artistName": 	"triggerCancel",
     	'click .add': 			'createAdd',
     	'click .save': 			'saveBooks',
     	'click .clear': 		'clearBooks',
     	'click .remove': 		'removeAdd'
	},
	focusIn: function(){
		this.$('.tt-input').focus();
		if (this.$('.bootstrap-tagsinput').hasClass('bootstrap-tagsinput-max')) {
		    this.$('.tt-input').blur().val(' ');
		}
		this.$('.tt-input').val(this.$('input.tt-input:last').val().toProperCase());
		return this;
	},
	onRender: function(){
		$("body").css("overflow", "hidden");

		//checks if the user has added the tattoo
		if ($.inArray(this.model.id, App.Collections.adds.pluck('tattooId')) > -1) {
			this.showYourBooks(App.Collections.adds.getTattoo(this.model.id)[0]);
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

		this.booksByCount = this.model.attributes.books.byCount();
		this.renderPopularBooks();
	},
	renderPopularBooks: function(){
		// gets the most popular books and renders them
		if (this.model.attributes.books.length >= 1) {
			this.count = this.count || 0;
			var popularBooks = this.booksByCount.slice(this.count,(this.count+5));
			_.each(popularBooks, function(book) {
				this.$('.otherBooks span').append(_.template('<button type="button" class="btn-tag otherBook">'+ book +'</button>'));
			}, this);
			this.count = this.count + 5;
			this.$('.otherBooks').fadeIn( 1000 );
			var that = this;
			_.defer(function(){ 
				if($('.otherBooks span').children().length >= Math.min(that.booksByCount.length,10)){
					that.$('.more').attr('disabled', 'disabled').fadeOut(300);
				}
			});
		}
	},
	addOtherBook: function(e){
		if(!this.add) {
			this.createAdd([e.target.textContent])
		} else if ($(".booksInput").tagsinput('items').length < 5){
			$('.booksInput').tagsinput('add', e.target.textContent);
		}
	},
	setArtist: function(artist) {
		if(artist.profThumb !== undefined){this.$(".prof")[0].src = artist.profThumb.url};
		this.$(".artistName").html('By ' + artist.name).attr('href',"/" + artist.username);
		this.$(".artistLoc").html('<span>' + artist.username + '</span><br>' + artist.shop + ' / ' + artist.locationName);
		this.$(".infoBox").delay( 500 ).fadeIn();
	},
	createAdd: function(startupBooks){
		var user = Parse.User.current();
		var that = this;
		this.$('.add').attr('disabled', 'disabled');

		if (!Parse.User.current()) {
			Parse.history.navigate('/login', {trigger: true, replace: true});
			$(".loginForm .error").html("You need to be logged in to collect tattoos.").show();
		} else {
			this.$('.add').html('<span class="flaticon-book104"></span>Collected!!!');
			this.model.createAdd(startupBooks);
		}
	},
	clearBooks: function(){
		var that = this;
		this.$('.clear').attr('disabled', 'disabled');
		this.$('.bootstrap-tagsinput').removeClass('bootstrap-tagsinput-max');
		this.$('.booksInput').tagsinput('removeAll');
		this.$('.clear').fadeOut(800,function(){
			$(this).removeClass('clear').removeAttr("disabled").addClass('remove').html('Remove tattoo').fadeIn();
			that.saveBooks().focusIn();
		});
	},
	removeAdd: function(){
		this.$('.remove, .clear').attr('disabled', 'disabled');
		var user = Parse.User.current();
		var that = this;
		this.clearBooks();
		this.model.removeAdd();
	},
	showAddButton: function(){
		this.add = undefined;
		this.$('.remove, .clear, .add').fadeOut(800,function(){
			$(this).removeClass('remove btn-link').removeAttr("disabled").addClass('add btn-block btn-submit').html('<span class="flaticon-book104"></span>Collect').fadeIn( 800 );
		});
		$('.yourBooks').fadeOut();
	},
	showYourBooks: function(add){
		this.add = add;
		var that = this;

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
			that.$('.bootstrap-tagsinput > .btn-tag').removeClass('blured');
			that.$('.bootstrap-tagsinput').addClass('focused');
			that.$('.tt-input').attr('placeholder','');
		}).on('blur', function () {
			that.$('.bootstrap-tagsinput > .btn-tag').addClass('blured');
			that.$('.bootstrap-tagsinput').removeClass('focused');
			if (that.$('.bootstrap-tagsinput').hasClass('bootstrap-tagsinput-max')) {
			    that.$('.tt-input').attr('placeholder','').val('');
			} else {
				that.$('.tt-input').attr('placeholder','Add + + +').val('');
			}
		    if(that.$('.save').is(':visible')) {   
		        that.$('.save').click();
		    }
		});

		input.on('itemAdded', function(event) {
		 	that.$('.save').fadeIn();
			that.$('.remove').fadeOut(800,function(){
				$(this).removeClass('remove').addClass('clear').html('Clear books').fadeIn();
			});
		}).on('itemRemoved', function(event){
			that.$('.save').fadeIn();
		});
     	_.each(add.attributes.books, function(book) {
			that.$('.booksInput').tagsinput('add', book);
        });
		window.setTimeout(function(){
      		that.$('.btn-tag').addClass('blured');
			that.$('.save').hide();
			if(that.$('.booksInput').tagsinput('items').length === 5) {
				that.$('.booksInput').tagsinput('input').attr('placeholder','');
			}
		}, 400);
		//focus in on the add input on keypress
		$(window).bind('keypress', this.focusIn);
	},
	saveBooks: function() {
		$('.save').attr('disabled', 'disabled');
		var that = this;

		this.add.set('books', this.$('.booksInput').tagsinput('items').slice(0));
		this.add.save(null,{
			success: function(result) {
				$('.save').html('Saved!!!').fadeOut( 1200, function(){
					$('.save').removeAttr("disabled").html('Save');
				});
			},
			error: function(error) {
				$('.save').removeAttr("disabled");
				console.log(error);
			}
		});
		return this;
	},
	beforeCancel: function(){
		Parse.history.navigate(App.back, {trigger: false});
		if(App.search){App.search.bindSearch()};
		$("body").css("overflow", "auto");
		this.$('booksInput').tagsinput('destroy');
		$(window).unbind('keypress', this.focusIn);
		this.unbind();
	}
});

App.Views.Tattoos = Parse.View.extend({
	el: '.tattoos',
	initialize: function(){
		_.bindAll(this, 'render', 'renderTattoos', 'renderTattoo', 'renderMoreBooks','resetFilters');

		this.collection.on('add', this.renderTattoo, this);
		this.collection.on('reset', this.render, this);

		this.bookFilters = [];

	},
	bindAddsToProfile: function(){
		App.Collections.adds.on('remove', function(add) {
			var removedId = add.get('tattooId');
			this.collection.remove(removedId);
			this.renderTattoos();
		}, this);
		App.Collections.adds.on('add', function(add) {
			var added = add.get('tattoo');
			this.collection.add(added);
			this.renderTattoos();
		}, this);
	},
	events: {
		'click .bookFilter': 	'addBookFilter'
	},
	addBookFilter: function(book){
		this.bookFilters.push(book);
		this.renderTattoosByBooks(this.bookFilters);
	},
	removeBookFilter: function(book){
		this.bookFilters = _.without(this.bookFilters, book)
		this.renderTattoosByBooks(this.bookFilters);
	},
	resetFilters: function(){
		this.bookFilters = [];
		$('.bookFilter').removeClass('active');
		this.renderTattoos();
	},
	renderBooks: function(count){	
		var booksByCount = this.collection.byCount(count || 5);
		if (booksByCount.length > 0){
			$(this.el).before('<div class="tagFilters" data-toggle="buttons"><span class="flaticon-book104"></span></div>');

			_.each(booksByCount, function(book) {
				$('.tagFilters').append(_.template('<button type="button" class="btn-tag bookFilter">'+ book +'</button>'));
			}, this);

			var that = this;
			$('.bookFilter').on('click', function(e){ 
				if($(e.target).hasClass('active')){
					that.removeBookFilter(e.target.textContent);
					$(e.target).removeClass('active');
				} else {
					that.addBookFilter(e.target.textContent);
					$(e.target).addClass('active');
				}
			});

			if(!count){
				$('.tagFilters').append(_.template('<a class="more">More</a>'));			
				$('.more').on('click', this.renderMoreBooks);
			} else {
				this.resetFilters();
			}
		}
		return this;
	},
	renderMoreBooks: function(){
		$('.tagFilters').remove();
		$('.more').hide();
		this.renderBooks(10).renderTattoos();
	},
    render: function () {
      this.renderTattoos();
      return this;
    },
	renderTattoos: function(e){	
    	this.$el.empty();
    	this.collection.forEach(this.renderTattoo, this);
	},
	renderTattoo: function(tat){
		var tattoo = new App.Views.Tattoo({model: tat});
		$(this.el).append(tattoo.render().el);
		return this;
	},
    renderTattoosByBooks: function(books) {
    	this.$el.empty();
    	_.each(this.collection.byBook(books), function(tat){ this.renderTattoo(tat)}, this);

    	if (this.collection.byBook(books).length < 1){
    		$('.tattoos').html('<h5 class="text-center">No tattoos with those books. <a class="reset">Reset books?</a></h5>');
    		$('.reset').on('click', this.resetFilters);
    	}
    }
});

App.Views.Tattoo = Parse.View.extend({
	className: 'tattoo',
	template: _.template($("#tattooTemplate").html()),
	initialize: function(){
		_.bindAll(this, 'createAdd', 'edit', 'profile');
		this.model.on('add:created', this.showEdit, this);
		this.model.on('add:removed', this.showAddButton, this);
	},
    events: {
     	'click .open': 					'open',
     	'click .hover-text-content': 	'profile',
     	'click .add': 					'createAdd',
     	'click .edit': 					'edit'
    },
    open: function(){
    	App.back = Parse.history.getFragment();
    	var profile = new App.Views.TattooProfile({model: this.model});
		$('.modalayheehoo').html(profile.render().el);
		return profile;
    },
    profile: function(e){
    	e.stopPropagation();
    	Parse.history.navigate(this.model.attributes.artistProfile.attributes.username, {trigger: true, replace: true});
    	$("html, body").animate({ scrollTop: 0 }, 600);
    },
	createAdd: function(e){
		e.stopPropagation();
		var user = Parse.User.current();
		var that = this;

		if(!Parse.User.current()) {
			Parse.history.navigate('/login', {trigger: true, replace: true});
			$(".loginForm .error").html("You need to be logged in to collect tattoos.").show();
		} else {
			this.$('button').addClass('add:active').html('<span class="flaticon-book104"></span>Collected!!!');
			this.open().createAdd();
			this.showEdit();
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
		var attributes = this.model.toJSON();
		$(this.el).append(this.template(attributes));
		if (Parse.User.current() && $.inArray(this.model.id, App.Collections.adds.pluck('tattooId')) > -1) {
			this.showEdit();
		}
		return this;
	}
});

App.Views.MyTattoos = Parse.View.extend({
	el: '.tattoos',
	initialize: function(){
		_.bindAll(this, 'render', 'renderTattoos', 'renderTattoo');

		this.collection.on('add', this.prependTattoo, this);
		this.collection.on('reset', this.render, this);
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
		var tattoo = new App.Views.MyTattoo({model: tattoo});
		$('.tattoos').append(tattoo.render().el);
	},
	prependTattoo: function(tattoo){
		var tattoo = new App.Views.MyTattoo({model: tattoo});
		$('.tattoos').prepend(tattoo.render().el);
	}
});

App.Views.MyTattoo = Parse.View.extend({
	className: 'tattoo',
	template: _.template($("#myTattooTemplate").html()),
	initialize: function(){
		this.model.on('remove', this.remove, this);
	},
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

		var edit = new App.Views.EditTattoo({model: this.model});
		$('.modalayheehoo').html(edit.render().el);

	},
	render: function(){
		var attributes = this.model.toJSON();
		$(this.el).append(this.template(attributes));
		return this;
	}
});

App.Views.EditTattoo = Backbone.Modal.extend({
	id: 'edit',
	template: _.template($("#editTattooTemplate").html()),
	cancelEl: '.x, .cancel',
    initialize: function() {
    	Parse.history.navigate("myprofile/edit/"+this.model.id, {trigger: false, replace: true});
    },
    events: {
		"click .delete": 		"delete"
    },
	delete: function(e){
		this.model.deleteTattoo();
		this.triggerCancel();
	},
	onRender: function(){
		$("body").css("overflow", "hidden");
	},
	cancel: function(e){
		$("body").css("overflow", "auto");
		Parse.history.navigate("myprofile", {trigger: false});
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
		query.containedIn("featuremonth", ["1","2","3","4","5","6","7","8","9","10","11","12"]);
		query.count().then(function(count){
			that.totalArtists = count;
		});

		_.bindAll(this, 'removeLanding','loadArtist', 'continue');
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
		this.totalArtists = 50;
		var that = this;
		var query = new Parse.Query(App.Models.ArtistProfile);
		query.containedIn("featuremonth", ["1","2","3","4","5","6","7","8","9","10","11","12"]);
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
		var that = this;
		$("html, body").animate({ scrollTop: $(window).height()+101 }, 600, function() {
			that.removeLanding();
		});
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
			that.unbind();
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
		query.containedIn("featuremonth", ["1","2","3","4","5","6","7","8","9","10","11","12"]);
		var per = 7;
		var skip = this.collection.page * per;
		query.skip(skip);
		query.limit(per);
		query.descending("featuremonth,createdAt");
		query.find({
		  success: function(artists) {
		  	that.collection.add(artists);
		  	$('.featuredArtist:lt(3)').fadeIn();

		  	if (artists.length < 7) {
				that.loadTemplate = _.template(' <div class="end" style="display: none"><img src="img/yt-featuredend.png"><h5>That is all the aritsts for now.</h5></div>');
		  	}
		  	that.renderLoad();
		  },
		  error: function(message){
		  	console.log(message);
		  }
		});
		var p = (this.collection.page) ? '/p' + this.collection.page : '';
		Parse.history.navigate('featured'+p, {trigger: false});
    },
    renderLoad: function() {
    	this.collection.page++
		this.$el.append(this.loadTemplate({page: this.collection.page}));
    },
    addAll: function(){
    	this.$el.empty();
    	this.addMore();
	},
    addMore: function(){
    	this.collection.forEach(this.addOne);
	},
	addOne: function(artist){
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
	template: _.template($("#artistSettingsTemplate").html()),
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
	    		var updated = 'http://' + e.target.placeholder + current;
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
		this.$el.html(this.template(this.profile.attributes));
		return this;
	},
	renderMap: function(e){
		var profile = this.profile;

		$('#settingsMap').locationpicker({
			location: {latitude: profile.attributes.location.latitude, longitude: profile.attributes.location.longitude},
			radius: 0,
			zoom: 12,
			enableAutocomplete: true,
			enableReverseGeocode: true,
			styles: App.mapStyles,
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
	template: _.template($("#artistInterviewTemplate").html()),
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
		this.$el.html(this.template(this.profile.attributes));
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
			$('.toggleArtist').text("Actually, not an artist...").removeClass('btn-tag');
			$('#inputRole').val('artist');
    	} else if ($(".artistForm").is(':visible')) {
			$('.artistForm').fadeOut();
			$('.toggleArtist').text("Artist?").addClass('btn-tag');
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
		var userACL = new Parse.ACL(Parse.User.current());

		Parse.User.signUp(username, password, { email: email, role: role, ACL: userACL 
		}).then( function(user){
			console.log(user);
			return user;
		}).then(function(user){
	    	if(user.attributes.role === 'user'){
	    		var profile = new App.Models.UserProfile();
	    	} else  {
	    		var profile = new App.Models.ArtistProfile(); 
	    	};
	      	App.profile = profile;
	      	return profile.save();

		}).then(function(profile) {
			var nav = new App.Views.Nav();
			Parse.history.navigate('/', {trigger: true});
			$('.intro').html("<h3>Thanks for joining!</h3>");

			self.undelegateEvents();
			delete self;
		}, function(error) {
			console.log(error);
			$(".signupForm .error").html(error.message).show();
			$(".signupForm button").removeAttr("disabled");
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

App.Views.Upload = Backbone.Modal.extend({
	id: 'upload',
	template: _.template($("#uploadTemplate").html()),
	cancelEl: '.x, .cancel',
    initialize: function() {
    	Parse.history.navigate("myprofile/upload", {trigger: false, replace: true});
    },
    events: {
    	"click [data-dismiss='fileinput'],[data-trigger='fileinput']": 		"clear",
     	"submit form": 														"upload"
    },
    clear: function(){
    	$("#upload .error").hide();
    },
	upload: function(e){
		e.preventDefault;
		var that = this;
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
				App.myTattoos.add(tattoo);
				var tattoos = App.profile.relation("tattoos");
				tattoos.add(tattoo);
				return App.profile.save();
			}).then(function() {
				that.triggerCancel();
			}, function(error) {
				console.log(error);
				$("#upload .error").html(error.message).show();
				$("#upload button").removeAttr("disabled");
			});
		}
	},
	cancel: function(e){
		$("body").css("overflow", "auto");
		Parse.history.navigate("myprofile", {trigger: false});
	},
	onRender: function(){
		$("body").css("overflow", "hidden");
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
	model: App.Models.Tattoo,
	byCount: function(count){
		this.popularBooks = _.flatten(this.pluck('books')).byCount().slice(0, count || 10);
		return this.popularBooks;
	},
	byBook: function(books){
		//Takes an array of books, returns the tattoos where the books are inlcuded.
		return this.filter(function(tat){ return _.intersection(tat.get('books'), books).length >= books.length; });
	}
});

App.Collections.Adds = Parse.Collection.extend({
	model: App.Models.Add,
	initialize: function(){

	},
	byCount: function(count){
		this.popularBooks = _.flatten(this.pluck('books')).byCount().slice(0, count || 10);
		return this.popularBooks;
	},
	getTattoo: function(tattooId){
		return this.filter(function(add){ return add.get('tattooId') === tattooId; });
	}
});

App.Collections.FeaturedArtists = Parse.Collection.extend({
	model: App.Models.User,
	page: 0
});

///////// Routers
App.Router = Parse.Router.extend({
	routes: {
		"":								"landing",
		"search": 						"search",
		"home":							"home",
		"featured":	    				"featured",
		"featured/p:page":	 		    "featured",
		"artists": 						"artists",
		"about":   						"about",
		"join":        				    "join",
		"login":        				"login",
		"settings":        				"settings",
		"interview":      				"interview",
		"myprofile": 					"myProfile",
		"myprofile/edit/:tattooId": 	"editTattoo",
		"myprofile/upload": 			"upload",
		"tattoo/:id": 					"tattooProfile",
		"user/:uname":   				"showUserProfile",
		":uname":   					"showProfile"
	},
	initialize: function(){
		//google analtic tracking
		this.bind('route', this._pageView);

		this.user = Parse.User.current();

	},
	search: function(){
		// query = decodeURIComponent(query)
		App.search = new App.Views.Search();
		$('#app').html(App.search.render().el);

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
 	artists: function(){
 		var featured = new App.Views.ArtistsPage();
		$('#app').html(featured.render().el);

		var artistsCollection = new App.Collections.Artists();
		var artistsView = new App.Views.Artists({collection: artistsCollection});

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
			  	addsQuery.select("tattoo");
			  	addsQuery.include('tattoo');
			  	addsQuery.include('tattoo.artistProfile');
			  	addsQuery.find({
			  		success: function(adds) {
			  			tattoos = _.map(adds, function(add){ return add.attributes.tattoo; });
			  			var userTattoos = new App.Collections.Tattoos(tattoos);
			  			var userAdds = new App.Views.Tattoos({collection: userTattoos, el: '.adds'});
			  			userAdds.render().renderBooks();
			  		}
			  	});

			  	var tattoos = profile.relation('tattoos');
			  	var uploadsQuery = tattoos.query();
			  	uploadsQuery.descending("createdAt");
			  	uploadsQuery.find({
			  		success: function(tats) {
			  			var tattoos = new App.Collections.Tattoos(tats);
			  			var collection = new App.Views.Tattoos({collection: tattoos});
			  			collection.render().renderBooks();
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
		var settings = new App.Views.Settings();
		$('#app').html(settings.render().el);

		settings.renderMap();
		settings.renderProf();

	},
	interview: function(){
		var interview = new App.Views.Interview();
		$('#app').html(interview.render().el);
	},
	myProfile: function(){
		if (Parse.User.current().attributes.role === 'user'){
			var myProfile = new App.Views.UserProfile({model: App.profile});
			$('#app').html(myProfile.render().el);

			tattoos = _.map(App.Collections.adds.models, function(add){ 
				add.attributes.tattoo.attributes.artistProfile = add.attributes.artistProfile; 
				return add.attributes.tattoo;
			});
  			var userAddedTattoos = new App.Collections.Tattoos(tattoos);
  			var userAdds = new App.Views.Tattoos({collection: userAddedTattoos, el: '.adds'});
  			userAdds.render().bindAddsToProfile();
		} else {
			var myProfile = new App.Views.ArtistProfile({model: App.profile});
			$('#app').html(myProfile.render().el);
		}

	  	var tattoos = App.profile.relation('tattoos');
	  	var query = tattoos.query();
	  	query.descending("createdAt");
	  	query.find({
	  		success: function(tats) {
	  			App.myTattoos = new App.Collections.Tattoos(tats);
	  			var portfolio = new App.Views.MyTattoos({collection: App.myTattoos});
	  			portfolio.render();
	  		}
	  	});

	},
	editTattoo: function(tattooId){
		this.myProfile();

		var query = new Parse.Query(App.Models.Tattoo);
		query.get(tattooId, {
			success: function(tattoo) {
				var profile = new App.Views.EditTattoo({model: tattoo});
				$('.modalayheehoo').html(profile.render().el);
			},
			error: function(object, error) {
				console.log(error);
			}
		});
	},
	upload: function(){
		this.myProfile();
		var upload = new App.Views.Upload();
		$('.modalayheehoo').html(upload.render().el);
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
});


$(function() {
	App.start();
});

