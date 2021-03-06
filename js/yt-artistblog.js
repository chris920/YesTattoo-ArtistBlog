

Parse.$ = jQuery;

Parse.initialize("ngHZQH087POwJiSqLsNy0QBPpVeq3rlu8WEEmrkR", "J1Co4nzSDVoQqC1Bp5KU7sFH3DY7IaskiP96kRaK");
// Parse.initialize("1r0HsPw8zOPEX5NMWnoKw43AIrJza3RiXdKJQ2D7", "yyb4DXWL5BPdMq2y1HikNT1n5knp1rO4Z3dM6Rqr");

var App = new (Parse.View.extend({
	Models: {},
	Views: {},
	Collections: {},
	initialize: function(){
		// Setup app proxy for windows events
		$(window).on('scroll', function (e) { App.trigger('app:scroll', e); });
		$(window).on('keypress', function (e) { App.trigger('app:keypress', e); });
	},
	remove: function () {
		// Stop listening to windows events
		$(window).off('scroll');
		$(window).off('keypress');
	},
	start: function(){
		
		// Initialize session, tracks user log on/off 
		App.session = new App.Models.Session();
		App.session.on('change:logged_in', function (model, value) {
			App.setProfile();
		});

		this.initTypeahead();
		this.setProfile(this.startRouter);
		this.initScrollToTop;

		// TODO Should be managed by region / view manager
		var nav = new App.Views.Nav();
		var footer = new App.Views.Footer();
	},
	startRouter: function(){
		App.router = new App.Router();
		Parse.history.start({pushState: false, root: '/'});
	},
	setProfile: function (callBack) {

		if (!App.session.loggedIn()) {
			
			// Not logged in, reset profile data
			App.profile = undefined;
			App.Collections.adds = new App.Collections.Adds();
			if (callBack) { callBack(); }
		} 
		else if (App.profile === undefined) {

			// User lgoged in, fetch profile data
			Parse.Promise.when([App.query.profile(), App.query.adds()])
				.then(function (profile, adds) {
						console.log('profile ok');
						App.profile = profile;
						App.Collections.adds = new App.Collections.Adds(adds);
					},
					function (error) {
						console.log("Error: " + error.code + " " + error.message);
					}
				)
				.always(function () {
					if (callBack) { callBack(); }
				});
		}
	},
	initTypeahead: function(){
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
		"click [href^='/']": 	"links"
	},
	links: function(e){
		e.preventDefault();
		// $(window).unbind();
		if(typeof(e.currentTarget.attributes.href.value) !== undefined){
			// App.back = Parse.history.getFragment();
			Parse.history.navigate(e.currentTarget.attributes.href.value, {trigger: true});
		}
	},
	initScrollToTop: $(function(){
	 	// $(window).scroll(function () {
	 	App.on('app:scroll', function () {
	        if ($(this).scrollTop() > 800) {
	            $('#back-to-top').fadeIn();
	        } else {
	            $('#back-to-top').fadeOut();
	        }
	    });
	    $('#back-to-top').click(function () {
	        $('#back-to-top').tooltip('hide');
	        $('body,html').animate({
	            scrollTop: 0
	        }, 800);
	        return false;
	    });
	    $('#back-to-top').tooltip('show');
	}),
	mapStyles: [{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-100},{"lightness":20}]},{"featureType":"road","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-100},{"lightness":40}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-10},{"lightness":30}]},{"featureType": "water","elementType": "geometry.fill","stylers": [{ "color": "#d9d9d9" }]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"visibility":"simplified"},{"saturation":-60},{"lightness":10}]},{"featureType":"landscape.natural","elementType":"all","stylers":[{"visibility":"simplified"},{"saturation":-60},{"lightness":5}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]}]
}))({el: document.body});

///////// Models
App.Models.User = Parse.User.extend({
	className: "User"
});

App.Models.Session = Parse.Object.extend({
	className: 'Session',

	defaults: {
		logged_in: false
	},

	initialize: function () {
		console.log('session init : ' + arguments.callee.identity);
		this.checkAuth();
	},

	user: function () {
		return Parse.User.current();
	},

	loggedIn: function () {
		return this.get('logged_in');
	},

	checkAuth: function () {
		if (Parse.User.current() && Parse.User.current().authenticated()) {
			this.set('logged_in', true);
		}
		else {
			this.set('logged_in', false);
		}
	},

	login: function (user, pass, cb) {
		var self = this;
		Parse.User.logIn(user, pass, cb)
			.always(function () {
				self.checkAuth();
			});
	},

	loginFb: function (cb) {
		var self = this;
		Parse.FacebookUtils.logIn(null, cb)
			.always(function () {
				self.checkAuth();
			});	
	},

	logout: function () {
		console.log('session logout : ' + arguments.callee.identity);
		var self = this;
		$.when(Parse.User.logOut())
			.then(function () {
				self.checkAuth();
			});
	}
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
	   	locationName:""
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
				if(error.message === JSON.stringify('Tattoo already added')) {
					that.trigger('add:created', add);
				}
				console.log(error);
			});
		}
	},
	removeAdd: function(add){
		var that = this;
		add.destroy().then(function(add) {
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
	    books:[],
	    artistBooks:[]
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

App.Models.Book = Parse.Object.extend({
	className: "Book",
});

App.Models.FeaturedArtist = Parse.User.extend({
	className: "User"
});


///////// Views
App.Views.Nav = Parse.View.extend({
	el: '.navs',
	initialize: function() {
		self = this;
		self.render();
		App.session.on('change:logged_in', function (model, value) {
			self.render();
		});
	},
	template: _.template($("#navTemplate").html()),
	events: {
		"click #logout": "logout"
	},
	logout: function () {
		App.session.logout();
		// TODO This needs reviewing, should use events
		var current = Parse.history.getFragment();
		if ( current == 'settings' || current == 'upload' || current == 'myprofile' ) {
			Parse.history.navigate('', {trigger: true});
		} else {
			Parse.history.navigate(current, {trigger: true});
		}
	},
    render: function () {
    	$('#nav-main').html(this.template());
    }
});

App.Views.Footer = Parse.View.extend({
	id: 'footer',
	initialize: function() {
		this.render();
	},
	template: _.template($("#footerTemplate").html()),
	events: {
		'click a': 'link'
	},
	link: function(){
		$("html, body").animate({ scrollTop: 0 }, 400);
	},
    render: function(){
    	$('#footer').html(this.template());
    	return this;
    }
});

App.Views.Search = Parse.View.extend({
	id: 'search',
	initialize: function(){
		console.log('search init');
		_.bindAll(this, 'focusIn', 'scrollToTop', 'scrollChecker');
		// this.bindSearch();
		App.on('app:scroll', this.scrollChecker);
		App.on('app:keypress', this.focusIn);
	},
	remove: function () {
		console.log('search remove');
		App.off('app:scroll', this.scrollChecker);
		App.off('app:keypress', this.focusIn);
	},
	template: _.template($("#searchTemplate").html()),
	events: {
		'click #forTattoos': 	'tattooSearchInitialize',
		'click #forArtists': 	'artistSearchInitialize'
	},
	tattooSearchInitialize: function(){
		this.$('#forArtists').show();
		this.$('#artistsPage').fadeOut();
		this.$('.dropdown-toggle:first').html('Tattoos');

		this.searchingForView = new App.Views.TattoosPage({el: this.$('#tattoosPage')});
		this.searchingForView.render();
		this.searchingForView.query = this.$('input.searchInput').tagsinput('items');
		this.searchingForView.loadMore();

		this.$('#forTattoos').hide();
		this.$('#tattoosPage').fadeIn();
		return this;
	},
	artistSearchInitialize: function(){
		this.$('#forTattoos').show();
		this.$('#tattoosPage').fadeOut();
		this.$('.dropdown-toggle:first').html('Artists');
		
		this.searchingForView = new App.Views.ArtistsPage({el: this.$('#artistsPage')});
		this.searchingForView.render();
		this.searchingForView.query = this.$('input.searchInput').tagsinput('items');
		this.searchingForView.loadMore();

		this.$('#forArtists').hide();
		this.$('#artistsPage').fadeIn();
		return this;
	},
	typeaheadInitialize: function(){
		var that = this;
		var input = this.$('input.searchInput');
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
				// empty: '<span>No tattoos with that book.</span>',   /// implement once typeahead books pull from server
				suggestion: _.template('<span class="bookSuggestion" style="white-space: normal;"><%= books %></span>')
			}
		}).attr('placeholder','Search').on('typeahead:selected', function (obj,datum) {
			input.tagsinput('add', datum.books);
			input.tagsinput('input').typeahead('val', '');
		}).on('typeahead:opened', function(){
			$('.globalBooks').stop(true,true).hide();
		}).on('typeahead:closed', function(){
			$('.globalBooks').stop(true,true).show();
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
			that.searchingForView.queryReset();
			that.searchingForView.query = input.tagsinput('items');
			that.searchingForView.loadMore();
		}).on('itemRemoved', function(event){
			that.searchingForView.queryReset();
			that.searchingForView.query = input.tagsinput('items');
			that.searchingForView.loadMore();
		});
		window.setTimeout(function(){
			$('.bookSuggestion').on('click', function(e){
				input.tagsinput('add', e.target.textContent);
			});
		}, 400);
		this.focusIn();
	},
	// bindSearch: function(){
	// 	// $(window).bind('scroll',this.scrollChecker);
	// 	// $(window).bind('keypress', this.focusIn);
	// 	App.on('app:scroll', this.scrollChecker);
	// 	App.on('app:keypress', this.focusIn);
	// },
	// unbindSearch: function(){
	// 	// $(window).unbind('scroll',this.scrollChecker);
	// 	// $(window).unbind('keypress', this.focusIn);
	// 	App.off('app:scroll', this.scrollChecker);
	// 	App.off('app:keypress', this.focusIn);
	// },
	focusIn: function(){
		console.log('search focusIn');
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
		console.log('search scrollChecker');
		var that = this;
		if (1 <= $(window).scrollTop()) {
			that.$('.tt-dropdown-menu, .globalBooks').stop(true,true).fadeOut( 200 );
		} else if (that.$('.tt-dropdown-menu > div.tt-dataset-books').children().length) {
			that.$('.tt-dropdown-menu').stop(true,true).fadeIn( 300 );
			that.$('.globalBooks').stop(true,true).hide( 300 );
		} else {
			that.$('.globalBooks').stop(true,true).fadeIn( 300 );
			that.$('input.searchInput').tagsinput('input').typeahead('close');
		}
		if (this.searchingForView.moreToLoad && $('#search').height()-$(window).height()*2 <= $(window).scrollTop()) {
			this.searchingForView.moreToLoad = false;
			this.searchingForView.collection.page++;
			this.searchingForView.loadMore();
		}
	},
	render: function(){
		var html = this.template();
		$(this.el).html(html);

		this.typeaheadInitialize();
		this.$('.globalBooks').delay( 700 ).fadeIn( 1200 );
		// App.currentView = this;
		return this;
	}
});

App.Views.TattoosPage = Parse.View.extend({
	initialize: function(){
		// Parse.history.navigate('search/tattoo', {trigger: false});
		this.moreToLoad = true;
	},
	events: {

	},
	queryReset: function(){
		this.query = [];
		this.collection.reset();
		this.collection.page = 0;
		this.moreToLoad = true;
		this.$('.reset').fadeOut();
		return this;
	},
	loadMore: function(){
		var that = this;
	  	// var query = new Parse.Query('Tattoo');
	  	// if(this.query.length > 0) {
	  	// 	query.containsAll("books", this.query);
	  	// }
		// var skip = this.collection.page * 40;
		// query.skip(skip);
		// query.limit(40);
		// query.include('artistProfile');
	 //  	query.descending('updatedAt');
	  	// query.find({
	  	// var filters = [{ name: 'books', data: this.query }];
	  	var options = {
	  		skip: this.collection.page * 40,
	  		limit: 40
	  	};
	  	App.query.tattoos(this.query, options)
	  		.then(function (tats) {
		  			that.collection.add(tats);
		  			if ( tats.length === 0) {
		  				that.moreToLoad = false;
			    		that.$('.reset').html('<h5>No tattoos with those books.</h5><button class="btn-submit">Reset filters</button>')
			    		that.$('.reset').on('click', function(){
							$('input.searchInput').tagsinput('removeAll');
							that.queryReset().loadMore();
							that.$('.reset').fadeOut();
			    		}).fadeIn();
		  			} else if (tats.length < 40) {
	 				// that.$el.append('<div class="end" style="display: none"><img src="img/yt-featuredend.png"></div>');
		  				that.moreToLoad = false;
		  			} else {
						that.moreToLoad = true;
		  			}
		  		},
		  		function (error) {
		  			console.log(error);
		  			that.moreToLoad = true;
	  		});
	},
	render: function(){
		this.collection = new App.Collections.Tattoos();
		this.tattoosView = new App.Views.Tattoos({collection: this.collection, el: this.$('.tattoos')});
		this.tattoosView.render();
		return this;
	}
});

App.Views.ArtistsPage = Parse.View.extend({
	template: _.template($("#artistsTemplate").html()),
	initialize: function(){
		// Parse.history.navigate('search/artist', {trigger: false});
		this.moreToLoad = true;
		_.bindAll(this, 'initializeLocationPicker', 'queryReset');
	},
	events: {
	    'click .changeLocationButton': 	'showChangeLocation',
	    'click .byYou': 				'byYou',
	    'click .worldwide': 			'setWorldwide',
	    'click .cancel': 				'hideChangeLocation',
	    'focus #changeAddressInput': 	'initializeLocationPicker'
	},
	initializeLocationPicker: function(){
		// App.search.unbindSearch();
		var that = this;
		if (!this.locationPickerCreated) {
			if(Parse.User.current() && App.profile.attributes.location) {
				var initialLocation = {latitude: App.profile.attributes.location.latitude, longitude: App.profile.attributes.location.longitude};
			} else {
				var initialLocation = {latitude: 34.0500, longitude: -118.2500};
			}
			$('#changeAddressMap').locationpicker({
				location: initialLocation,
				radius: 0,
				zoom: 8,
				styles: App.mapStyles,
				enableAutocomplete: true,
				enableReverseGeocode: true,
				inputBinding: {
					locationNameInput: $('#changeAddressInput')
				},
				onchanged: function(currentLocation, currentLocationNameFormatted) {
					that.locationReset();
			    	that.locationQuery = new Parse.GeoPoint({latitude: currentLocation.latitude, longitude: currentLocation.longitude});
			    	that.loadMore();
			    	that.$('.gm-style').fadeIn();
			    	that.$('.changeLocationButton').html(currentLocationNameFormatted);
			    	that.hideChangeLocation( 1200 );
				},
				onlocationnotfound: function(locationName) {
					$("#changeAddressInput ~ .error").html("Couldn't find "+locationName+", Try another address?").show();				
				},
				oninitialized: function(component){
					that.$('#changeAddressInput').val('');
				}
			});
			this.locationPickerCreated = true;
		}
	},
	showChangeLocation: function(){
		this.$('#changeAddressMap').height($( window ).height()-100);
		this.$('.changeLocation').slideDown();
		this.$('.changeLocationButton').addClass('active');
		if(Parse.User.current() && App.profile.attributes.locationName){
			this.$('.byYou').html(App.profile.attributes.locationName.split(",").splice(0,1).join("")).fadeIn();
		}
	    $('html, body').animate({
	        scrollTop: this.$('#changeAddressMap').offset().top-100
	    }, 1000);
	},
	byYou: function(){
		this.$('.byYou').attr('disabled', 'disabled');
		this.$('.changeLocationButton').html(this.$('.byYou').html());
		this.locationReset().hideChangeLocation();
		this.locationQuery = App.profile.get('location');
		this.loadMore();
	},
	setWorldwide: function(){
		this.$('.worldwide').attr('disabled', 'disabled');
		this.$('.changeLocationButton').html('Worldwide');
		this.$('.gm-style').fadeOut();
		this.$('#changeAddressInput').val('');
		this.locationReset();
		this.loadMore();
		this.hideChangeLocation( 1200 );
	},
	locationReset: function(){
		this.locationPickerCreated = false;
		this.locationQuery = undefined;
		this.collection.reset();
		this.collection.page = 0;
		this.moreToLoad = true;
		return this;
	},
	hideChangeLocation: function( delay ){
		// App.search.bindSearch();
		var that = this;
		window.setTimeout(function(){
			that.$('.changeLocation').animate({ height: 'toggle', opacity: 'toggle' }, 'slow', function(){
				that.$('.input-group-btn > button').removeAttr('disabled');
			});
			that.$('.changeLocationButton').removeClass('active');
		}, delay || 0);

		return this;
	},
	queryReset: function(){
		this.query = [];
		this.collection.reset();
		this.collection.page = 0;
		this.moreToLoad = true;
		return this;
	},
	loadMore: function(){
		var that = this;
		// var query = new Parse.Query('ArtistProfile');
	 //  	if(this.locationQuery) {
	 //  		query.near("location", this.locationQuery);
	 //  	} else {
	 //  		query.descending('createdAt');
	 //  	}
		// var skip = 	this.collection.page * 20;
		// query.skip(skip);
		// query.limit(20);
	 //  	query.find({
	 	var options = {
	 		skip: this.collection.page * 20,
	 		limit: 20
	 	};
	 	App.query.artists(this.locationQuery, options)
	 		.then(function (artists) {
	  			that.collection.add(artists);
	  			if (artists.length < 20 ) {
	  				that.moreToLoad = false;
	  			} else {
					that.moreToLoad = true;
	  			}
	  		},
	  		function (error) {
	  			console.log(error);
	  			that.moreToLoad = true;
	  		});
	},
	render: function(){
		var html = this.template();
		$(this.el).html(html);

		this.collection = new App.Collections.Artists();
		this.artistsView = new App.Views.Artists({collection: this.collection, el: this.$('.artists')});
		this.artistsView.render();

		window.setTimeout(function(){
			$('.changeLocationButton').tooltip({
			    title: "Change location",
			    container: 'body',
			    delay: { show: 200, hide: 200 },
			    placement: 'auto'
			});
		},0);

		return this;
	}
});

App.Views.Artists = Parse.View.extend({
	el: '.artists',
	initialize: function(){
		_.bindAll(this, 'render', 'renderArtists', 'renderArtist');

		this.collection.on('add', this.renderArtist, this);
		this.collection.on('reset', this.render, this);
	},
    render: function () {
		this.renderArtists();
		return this;
    },
	renderArtists: function(){
    	this.$el.empty();
    	this.collection.forEach(this.renderArtist, this);
	},
	renderArtist: function(artist){
		var artist = new App.Views.Artist({model: artist});
		this.$el.append(artist.render().el);
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
		// Parse.history.navigate(this.model.attributes.username, {trigger: true});
		App.trigger('app:artist-profile', this.model.get('username'));
		// $("html, body").animate({ scrollTop: 0 }, 200);
	},
	render: function(){
		var that = this;
		var attributes = this.model.toJSON();
		$(this.el).append(this.template(attributes));

		// console.log('artist');
		// console.log(this.model);
	 //  	var tattoos = this.model.relation('tattoos');
	 //  	console.log(tattoos);
	 //  	var query = tattoos.query();
	 //  	if(App.search && App.search.searchingForView.query.length > 0) {
	 //  		query.containsAll("books", App.search.searchingForView.query);
	 //  	}
	 //  	query.limit(4);
	 //  	query.find().then(function(tats) {
	 	var books = App.search ? App.search.searchingForView.query : [];
	 	App.query.tattoosByProfile(this.model, books, { limit: 4 })
	 		.then(function (tats) {
		  		
		  		// console.log(tats);
	  			_.each(tats, function(tat) {
	  				var thumb = tat.get('fileThumbSmall').url();
	  				that.$('.artistTattoos').append(_.template('<a class="tattooContainer open"><img src='+thumb+' class="tattooImg" href="/tattoo/' + tat.id + '"></a>'));
	  			}, that);

				if (tats.length < 4) {
					_(4 - tats.length).times(function(){ 
						that.$('.artistTattoos').append(_.template('<a class="tattooContainer"><img src="img/empty-tattoo.png" class="tattooImg" style="border: 1px solid #d9d9d9;"></a>'));
					}, that);
	  			}
	  			if ( tats.length === 0 && App.search && App.search.searchingForView.query.length > 0) {
		    		that.$('.artistTattoos').append('<a class="resetArtistFilter">Reset</a>')
		    		that.$('.tattooImg').css('border', 'none');
		    		that.$('.resetArtistFilter').on('click', function(e){
		    			e.stopPropagation();
		    			e.preventDefault();
						$('.resetArtistFilter').tooltip('destroy');
						$('input.searchInput').tagsinput('removeAll');
						App.search.searchingForView.queryReset().loadMore();
		    		});
					window.setTimeout(function(){
						that.$('.resetArtistFilter').tooltip({
						    title: "No tattoos with those books, click to reset filters.",
						    container: 'body',
						    delay: { show: 200, hide: 200 },
						    placement: 'auto'
						});
					},0);
	  			} else if (tats.length === 0 ) {
		    		that.$('.artistTattoos').append('<span class="empty">No tattoos</span>')
		    		that.$('.tattooImg').css('border', 'none');
	  			}
	  		},
	  		function (error) {
	  			console.log(error);
	  		});
		return this;
	}
});

App.Views.Login = Backbone.Modal.extend({
	id: 'login',
	initialize: function(){
	},
	template: _.template($("#loginTemplate").html()),
	viewContainer: '.clearContainer',
	cancelEl: '.x',
	events: {
		"click #facebookLogin": "facebookLogin",
		"submit form.loginForm": "login",
		"click #forgotPassword": "passwordForm",
		'click #join': 'joinForm'
	},
	facebookLogin: function (e) {
		if (e) { e.preventDefault(); }
		
		this.enableLogin(false);

		var that = this;
		App.session.loginFb({
			success: function (user) {
				if (!user.existed()) { 
					user.destroy().then(function(user){
						App.session.logout();
						that.triggerCancel();
						App.trigger('app:join');
					});
				} else {
					// App.setProfile();
					that.undelegateEvents();
					that.triggerCancel();
				}
			},
			error: function (user, error) {
				console.log(error);
				$(".loginForm .error").html(error.message).show();
				that.enableLogin(true);
			}
		});
	},
	login: function (e) {
		if (e) { e.preventDefault(); }
		
		this.enableLogin(false);

		var that = this;
		var username = this.$("#loginUsername").val().replace(/\W/g, '').toLowerCase();
		var password = this.$("#loginPassword").val();
		App.session.login(username, password, {
			success: function (user) {
				// App.setProfile();
				that.triggerCancel();
				that.undelegateEvents();
			},
			error: function (user, error) {
				console.log(error);
				$(".loginForm .error").html("Invalid username or password. Please try again.").show();
				that.enableLogin(true);
			}
		});
	},
	enableLogin: function (enable) {
		$("#login .btn-submit").attr('disabled', !enable);
	},
	passwordForm: function(){
		App.trigger('app:forgot');
	},
	joinForm: function () {
		App.trigger('app:join');
	},
	onRender: function(){
		$("body").css("overflow", "hidden");
	},
	cancel: function(){
		$("body").css("overflow", "auto");
		App.trigger('app:modal-close');
	}
});

App.Views.ArtistProfile = Parse.View.extend({
	id: 'artistProfile',
	initialize: function() {
		this.activateAffix();
	},
	template: _.template($("#artistProfileTemplate").html()),
	events: {
		'click [href="#portfolioTab"]': 'portfolioTab',
		'click [href="#aboutTab"]': 	'aboutTab',
		'click [href="#shopTab"]': 		'shopTab'
	},
	portfolioTab: function (e) {
		if (e) { e.preventDefault(); }
	    $('a[href="#portfolioTab"]').tab('show');
	    this.scroll();
	    Parse.history.navigate(this.model.get('username') + '/portfolio', { trigger: false });
	},
	aboutTab: function (e) {
		if (e) { e.preventDefault(); }
	    $('a[href="#aboutTab"]').tab('show');
		this.scroll();
	    Parse.history.navigate(this.model.get('username') + '/about', { trigger: false });
	},
	shopTab: function (e) {
		if (e) { e.preventDefault(); }
	    $('a[href="#shopTab"]').tab('show');
	    this.renderMap();
	    this.scroll()
	    // Parse.history.navigate(this.model.get('username') + '/shop', { trigger: false });
	},
	scroll: function(){
		$("html, body").animate({ scrollTop: $('.profHead').outerHeight(true) + 41  }, 500);
	},
	activateAffix: _.debounce(function(){
		$('.profNavContainer').affix({
		      offset: { top: $('.profHead').outerHeight(true) + 40 }
		});
	}, 5000),
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
	getTattoos: function() {
		var that = this;
		console.log('getTattoos');
		console.log(this.model);
	  	// var tattoos = this.model.relation('tattoos');
	  	// var uploadsQuery = tattoos.query();
	  	// uploadsQuery.descending("createdAt");
	  	// uploadsQuery.find({
	  	App.query.tattoosByProfile(this.model, [], {})
	  		.then(function (tats) {
				var tattoosCollection = new App.Collections.Tattoos(tats);
				var tattoosView = new App.Views.Tattoos({collection: tattoosCollection});
				tattoosView.render().getBooks();
			},
			function (error) {
				console.log(error);
			});
	},
	getMyTattoos: function(){
		console.log('getMyTattoos');
		console.log(App.profile);
		// var tattoos = App.profile.relation('tattoos');
		// var query = tattoos.query();
		// query.descending("createdAt");
		// query.find({
		App.query.tattoosByProfile(App.profile, [], {})
			.then(function(tats) {
				App.myTattoos = new App.Collections.Tattoos(tats);
				var portfolio = new App.Views.Tattoos({collection: App.myTattoos, myTattoos: true});
				portfolio.render().getBooks();
			},
			function (error) {
				console.log(error);
			});
	},
	renderMyProfile: function(){
		this.$('.profButtons').before(_.template('<button href="/myprofile/settings" class="btn-submit"><i class="flaticon-settings13"></i>Edit Profile</button><button href="/myprofile/upload" class="btn-submit"><i class="flaticon-camera4"></i>Upload Tattoo</button>'));
	},
	render: function(){
		var attributes = this.model.attributes
		this.$el.html(this.template(attributes));
		if(Parse.User.current() && this.model.attributes.user.id === Parse.User.current().id){
			this.renderMyProfile();
			this.getMyTattoos();
		} else {
			this.getTattoos();
		}
		// App.currentView = this;
		return this;
	}
});

App.Views.TattooProfile = Backbone.Modal.extend({
	id: 'tattooProfile',
	initialize: function(){
		console.log('tattoo profile init');
		// Parse.history.navigate('/tattoo/'+this.model.id, {trigger: false});
		_.bindAll(this, 'focusIn');

		this.model.on('add:created', this.showYourBooks, this);
		this.model.on('add:removed', this.showAddButton, this);

		// $(window).unbind();
		// App.on('app:keypress', this.focusIn);
	},
	remove: function () {
		console.log('tattoo profile remove');
		// App.off('app:keypress', this.focusIn);
	},
	template: _.template($("#tattooProfileTemplate").html()),
    viewContainer: '.container',
	cancelEl: '.x',
	events: {
		'click .more': 			'renderPopularBooks',
		'click .otherBook': 	'addOtherBook',
		'click .artistName, h2[href="/myprofile/books"]': 	'triggerCancel',
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
		this.renderArtistsBooks().renderPopularBooks();
	},
	renderArtistsBooks: function(){
		if (this.model.attributes.artistBooks.length) {
			this.$('.byArtist h5').html('By the Artist');
			_.each(this.model.attributes.artistBooks, function(book) {
				this.$('.otherBooks span.byArtist').append(_.template('<button type="button" class="btn-tag otherBook artistBook">'+ book +'</button>'));
			}, this);
			this.$('.otherBooks').fadeIn( 1000 );
			var that = this;
			window.setTimeout(function(){
				var addTipTitle =  Parse.User.current() && Parse.User.current().attributes.role === 'artist' ? "Created by the artist" : "Add artist's book";
				$('.otherBook.artistBook').tooltip({
				    title: addTipTitle,
				    delay: { show: 200, hide: 200 },
				    placement: 'auto'
				});
			},0);
			this.popularBooksLimit = 5 - this.model.attributes.artistBooks.length;
			// this.loadMoreBooks = (this.model.attributes.artistBooks.length < 5) ? true : false;
		}  else {
			this.popularBooksLimit = 5;
		}
		return this;
	},
	renderPopularBooks: function(){
		if (this.model.attributes.books.length >= 1 && this.popularBooksLimit) {
			this.$('.byAll h5').html('By Everyone');
			this.count = this.count || 0;
			var popularBooks = this.booksByCount.slice(this.count, this.count + this.popularBooksLimit);
			_.each(popularBooks, function(book) {
				this.$('.otherBooks span.byAll').append(_.template('<button type="button" class="btn-tag otherBook userBook">'+ book +'</button>'));
			}, this);
			this.$('.otherBooks').fadeIn( 1000 );
			var that = this;
			window.setTimeout(function(){
				if($('.otherBook').length >= Math.min(that.booksByCount.length+that.model.attributes.artistBooks.length,10)){
					that.$('.more').attr('disabled', 'disabled').fadeOut(300);

				}
				var addTipTitle =  Parse.User.current() && Parse.User.current().attributes.role === 'artist' ? "Popular books by everyone" : "Add popular book";
				$('.otherBook.userBook').tooltip({
				    title: addTipTitle,
				    delay: { show: 200, hide: 200 },
				    placement: 'auto'
				});
			},0);
			this.count = this.count + this.popularBooksLimit
			this.popularBooksLimit = 5;
		} else { 
			this.popularBooksLimit = 5;
		}
	},
	addOtherBook: function(e){
		if (!Parse.User.current()) {
			// Parse.history.navigate('/login', {trigger: true, replace: true});
			App.trigger('app:login');
			$(".loginForm .error").html("You need to be logged in to collect tattoos.").show();
		} else if(Parse.User.current().attributes.role === 'artist') {



		} else if(!this.add) {
			this.createAdd([e.target.textContent])
		} else if ($(".booksInput").tagsinput('items').length < 5){
			$('.booksInput').tagsinput('add', e.target.textContent);
		}
	},
	setArtist: function(artist) {
		if(artist.profThumb !== undefined){this.$(".prof")[0].src = artist.profThumb.url};
		this.$(".artistName").html('Artist: ' + artist.name).attr('href',"/" + artist.username);
		this.$(".artistLoc").html('<span>' + artist.username + '</span><br>' + artist.shop + ' / ' + artist.locationName);
		this.$(".infoBox").delay( 500 ).fadeIn();
	},
	createAdd: function(startupBooks){
		var user = Parse.User.current();
		var that = this;
		this.$('.add').attr('disabled', 'disabled');

		if (!Parse.User.current()) {
			console.log('test login');
			// Parse.history.navigate('/login', {trigger: true, replace: true});
			App.trigger('app:login');
			$(".loginForm .error").html("You need to be logged in to collect tattoos.").show();
		} else {
			this.$('.add').html('<span class="flaticon-books8"></span>Collected!!!');
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
		this.model.removeAdd(this.add);
	},
	showAddButton: function(){
		this.add = undefined;
		this.$('.remove, .clear, .add').fadeOut(800,function(){
			$(this).removeClass('remove btn-link').removeAttr("disabled").addClass('add btn-block btn-submit').html('<span class="flaticon-books8"></span>Collect').fadeIn( 800 );
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
		}).attr('placeholder','Type to create a book').on('typeahead:selected', $.proxy(function (obj, datum) {
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
		// $(window).bind('keypress', this.focusIn);
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
		// Parse.history.navigate(App.back, {trigger: false});
		$("body").css("overflow", "auto");
		this.$('booksInput').tagsinput('destroy');
		// $(window).unbind('keypress', this.focusIn);
		this.off();
		// if(App.currentView){App.currentView.initialize()};
		// window.history.back();
		// App.trigger('app:modal-close');
	},
	cancel: function () {
		App.trigger('app:modal-close');
	}
});

App.Views.Tattoos = Parse.View.extend({
	el: '.tattoos',
	initialize: function(){
		_.bindAll(this, 'render', 'renderTattoos', 'renderTattoo', 'renderBooks', 'renderMoreBooks','resetFilters');

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
	getBooks: function(count){
		this.renderBooks(this.collection.getBooksByCount(count || 5));

		if(!count){
			$('.tagFilters').append(_.template('<a class="more">More</a>'));			
			$('.more').on('click', this.renderMoreBooks);
		} else {
			this.resetFilters();
		}

		return this;
	},
	renderBooks: function(books){
		if (books.length > 0){
			$(this.el).before('<div class="tagFilters" data-toggle="buttons"><span class="flaticon-book104"></span></div>');

			var that = this;
			window.setTimeout(function(){
				_.each(books, function(book) {
					$('.tagFilters .flaticon-book104').append(_.template('<button type="button" class="btn-tag bookFilter">'+ book +'</button>'));
				});

				$('.bookFilter').on('click', function(e){ 
					if($(e.target).hasClass('active')){
						that.removeBookFilter(e.target.textContent);
						$(e.target).removeClass('active');
					} else {
						that.addBookFilter(e.target.textContent);
						$(e.target).addClass('active');
					}
				});

				$('.bookFilter').tooltip({
				    title: "Filter by",
				    container: 'body',
				    delay: { show: 200, hide: 200 },
				    placement: 'auto'
				});
			}, 0);
		}

		return this;
	},
	renderMoreBooks: function(){
		$('.tagFilters').remove();
		$('.more').hide();
		this.getBooks(10);
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
		if (!this.options.myTattoos) {
			var tattoo = new App.Views.Tattoo({model: tat});
			$(this.el).append(tattoo.render().el);
			$('.reset').off('click', this.resetFilters);
		} else {
			var myTattoo = new App.Views.MyTattoo({model: tat});
			$(this.el).append(myTattoo.render().el);
			$('.reset').off('click', this.resetFilters);
		}
		return this;
	},
    renderTattoosByBooks: function(books) {
    	this.$el.empty();
    	var filteredTattoos = this.collection.byBooks(books)
    	_.each(filteredTattoos, function(tat){
    		this.renderTattoo(tat);
    	}, this);

    	if (filteredTattoos.length < 1) {
    		this.$el.html('<div class="reset"> <h5 class="text-center">No tattoos with those books.<button class="btn-submit">Reset filters</button></h5></div>');
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
    	// e.stopPropagation();
  //   	App.back = Parse.history.getFragment() || '';
  //   	var profile = new App.Views.TattooProfile({model: this.model});
		// $('.modalayheehoo').html(profile.render().el);
		// return profile;

		// TODO Not ideal, we shouldn't be calling the router direct or requerying the model 
		// but better than previous implementation as handled by single route.
		// Replace with events based architecture
		// console.log(this.model);
		// App.router.tattooProfile(this.model.id);
		App.trigger('app:tattoo-profile', this.model);
    },
    profile: function(e){
    	e.stopPropagation();
    	// TODO Replace with event controller, don't call navigate direct.
    	// Parse.history.navigate(this.model.attributes.artistProfile.attributes.username, {trigger: true, replace: true});
    	App.trigger('app:artist-profile-uname', this.model.attributes.artistProfile.attributes.username);
    	// $("html, body").animate({ scrollTop: 0 }, 600);
    },
	createAdd: function(e){
		e.stopPropagation();
		// var user = Parse.User.current();
		// var that = this;
		if(!Parse.User.current()) {
			// TODO Replace with event controller, don't call navigate direct.
			// Parse.history.navigate('/login', {trigger: true, replace: true});
			App.trigger('app:login');
			$(".loginForm .error").html("You need to be logged in to collect tattoos.").show();
		} else {
			this.$('button').addClass('add:active').html('<span class="flaticon-books8"></span>Collected!!!');
			this.open().createAdd();
			this.showEdit();
		}
	},
	edit: function(e){
		e.stopPropagation();
		this.open();
	},
	showAddButton: function(){
		this.$('button').fadeOut().removeClass('edit').removeAttr("disabled").addClass('add btn-block').html('<span class="flaticon-books8"></span>Collect').fadeIn();
	},
	showEdit: function(){
		this.$('button').fadeOut().removeClass('add btn-block').removeAttr("disabled").addClass('edit pull-right').html('Edit&nbsp;&nbsp;<span class="flaticon-books8"></span>').fadeIn();
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

App.Views.MyTattoo = Parse.View.extend({
	className: 'tattoo',
	template: _.template($("#myTattooTemplate").html()),
	initialize: function(){
		this.model.on('remove', this.remove, this);
	},
	events: {
		'click button, .open': 'edit',
		'click .open': 	'open'
	},
    open: function(){
  //   	var profile = new App.Views.TattooProfile({model: this.model});
		// // $('.modalayheehoo').html(profile.render().el);
		// App.viewManager.show(profile);
		App.trigger('app:tattoo-profile', this.model);
    },
	edit: function(e){
		e.stopPropagation();
		// var edit = new App.Views.EditTattoo({model: this.model});
		// // $('.modalayheehoo').html(edit.render().el);
		// App.viewManager.show(edit);
		App.trigger('app:edit-tattoo', this.model);
	},
	render: function(){
		var attributes = this.model.toJSON();
		$(this.el).append(this.template(attributes));
		return this;
	}
});

App.Views.EditTattoo = Backbone.Modal.extend({
	id: 'editTattoo',
	template: _.template($("#editTattooTemplate").html()),
    viewContainer: '.lightContainer',
	cancelEl: '.x, .cancel',
    initialize: function() {
    	// Parse.history.navigate("myprofile/edit/"+this.model.id, {trigger: false, replace: true});

		App.on('app:keypress', this.focusIn);
    },
    remove: function () {
    	App.off('app:keypress', this.focusIn);
    },
    events: {
		"click .delete": 		"delete"
    },
	focusIn: function(){
		this.$('.tt-input').focus();
		if (this.$('.bootstrap-tagsinput').hasClass('bootstrap-tagsinput-max')) {
		    this.$('.tt-input').blur().val(' ');
		}
		this.$('.tt-input').val(this.$('input.tt-input:last').val().toProperCase());
		return this;
	},
	renderPopularBooks: function(){
		this.booksByCount = this.model.attributes.books.byCount();
		if (this.booksByCount.length >= 1) {
			this.count = this.count || 0;
			var popularBooks = this.booksByCount.slice(this.count,(this.count+5));
			_.each(popularBooks, function(book) {
				this.$('.otherBooks span').append(_.template('<button type="button" class="btn-tag otherBook">'+ book +'</button>'));
			}, this);
			this.count = this.count + 5;
			this.$('.otherBooks').fadeIn( 1000 );
			var that = this;
			window.setTimeout(function(){
				if($('.otherBooks span').children().length >= Math.min(that.booksByCount.length,10)){
					that.$('.more').attr('disabled', 'disabled').fadeOut(300);
				}
				$('.otherBook').tooltip({
				    title: "Popular books by everyone",
				    delay: { show: 200, hide: 200 },
				    placement: 'auto'
				});
			},0);
		}
	},	
	initializeEditBooks: function(){
		var that = this;

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
		}).attr('placeholder','Type to create a book').on('typeahead:selected', $.proxy(function (obj, datum) {
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
		});

     	_.each(this.model.attributes.artistBooks, function(book) {
			that.$('.booksInput').tagsinput('add', book);
        });

		input.on('itemAdded', function(event) {
			that.saveBooks();
		}).on('itemRemoved', function(event){
			that.saveBooks();
		});

		window.setTimeout(function(){
      		that.$('.btn-tag').addClass('blured');
			if(that.$('.booksInput').tagsinput('items').length === 5) {
				that.$('.booksInput').tagsinput('input').attr('placeholder','');
			}
		}, 400);

		//focus in on the add input on keypress
		// $(window).bind('keypress', this.focusIn);
	},
	saveBooks: function(){
		var that = this;
		this.model.set('artistBooks', this.$('.booksInput').tagsinput('items').slice(0));
		this.model.save(null,{
			success: function(result) {
				that.$('.bookMessage').html('Saved!!!');
				window.setTimeout(function(){
					that.$('.bookMessage').html('&nbsp;');
				},2000)
			},
			error: function(error) {
				that.$('.bookMessage').html(error.message);
				console.log(error);
			}
		});
	},
	delete: function(e){
		this.model.deleteTattoo();
		this.triggerCancel();
	},
	onRender: function(){
		$("body").css("overflow", "hidden");
		this.initializeEditBooks();
		this.renderPopularBooks();
	},
	beforeCancel: function(){
		$("body").css("overflow", "auto");
		this.$('booksInput').tagsinput('destroy');
		// Parse.history.navigate("myprofile", {trigger: false});
		// $(window).unbind('keypress', this.focusIn);
		// if(App.currentView){App.currentView.initialize()};
		// window.history.back();
		// App.trigger('app:modal-close');
	},
	cancel: function () {
		App.trigger('app:modal-close');
	}
});

App.Views.UserProfile = Parse.View.extend({
	model: App.Models.User,
	id: 'userProfile',
	initialize: function() {
		this.activateAffix();
	},
	template: _.template($("#userProfileTemplate").html()),
	events: {
		'click [href="#collectionTab"]': 'collectionTab',
		'click [href="#booksTab"]': 'booksTab',
		'click [href="#artistsTab"]': 'artistsTab'
	},
	collectionTab: function (e) {
		if (e) { e.preventDefault(); }
		$('a[href="#collectionTab"]').tab('show');
	    this.scroll();
	    Parse.history.navigate('myprofile/collection', { trigger: false });
	},
	booksTab: function (e) {
		if (e) { e.preventDefault(); }
	    $('a[href="#booksTab"]').tab('show');
	    this.scroll();
	    Parse.history.navigate('myprofile/books', { trigger: false });
	},
	artistsTab: function (e) {
		if (e) { e.preventDefault(); }
	    $('a[href="#artistsTab"]').tab('show');
	    this.scroll();
	    Parse.history.navigate('myprofile/artists', { trigger: false });
	},
	scroll: function(){
		$("html, body").animate({ scrollTop: $('.userHead').outerHeight(true) + 41  }, 500);
	},
	activateAffix: _.debounce(function(){
		$('.profNavContainer').affix({
		      offset: { top: $('#userProfile > div.container').outerHeight(true) + 40 }
		});
	}, 1000),
	getAdds: function() {
		var that = this;
	  	// var addsQuery = new Parse.Query(App.Models.Add);
	  	// addsQuery.descending("createdAt");
	  	// addsQuery.equalTo('user', this.model.attributes.user);
	  	// addsQuery.include('tattoo');
	  	// addsQuery.include('artistProfile');
	  	// addsQuery.find({
		App.query.getAdd(this.model.attributes.user)
			.then(function (adds) {
				var addsCollection = new App.Collections.Adds(adds);
				that.renderAdds(addsCollection);
			},
			function (error) {
				console.log(error);
			});
	},
	renderAdds: function(addsCollection){
		this.addsTattoosCollection = new App.Collections.Tattoos(addsCollection.getTattoos());
		this.userAddsTattoos = new App.Views.Tattoos({collection: this.addsTattoosCollection, el: this.$('.adds')});
		var booksByCount =  addsCollection.getBooksByCount( );
		this.userAddsTattoos.render().renderBooks( booksByCount );
		console.log('renderBooks called on ~ addsCollection.getBooksByCount()');

		this.renderBooks(addsCollection, booksByCount);
		this.renderArtists(addsCollection);
		return this;
	},
	renderBooks: function(addsCollection, booksByCount){

		this.booksCollection = new App.Collections.Books();
		this.booksView = new App.Views.Books({collection: this.booksCollection, el: this.$('.books')});

    	_.each(booksByCount, function(book){
    		var bookModel = new App.Models.Book({book: book});
 ///need to put a count limiter on the by book filters rather than get all and boil down.

 			bookModel.set('tattoos', this.addsTattoosCollection.byBooks([book]).slice(0,4));
			this.booksCollection.add(bookModel);
    	}, this);

 		this.booksView.render();
		return this;
	},
	renderArtists: function(addsCollection) {
		this.artistsCollection = new App.Collections.Artists(addsCollection.getArtists());
		this.artistsView = new App.Views.Artists({collection: this.artistsCollection, el: this.$('.artists')});
		this.artistsView.render();
	},
	getTattoos: function() {
		console.log('user profile getTattoos');
		console.log(this.model);
	  	// var tattoos = this.model.relation('tattoos');
	  	// var uploadsQuery = tattoos.query();
	  	// uploadsQuery.descending("createdAt");
	  	// uploadsQuery.find({
		App.query.tattoosByProfile(this.model, [], {})
			.then(function (tats) {
				var tattoos = new App.Collections.Tattoos(tats);
				var collection = new App.Views.Tattoos({collection: tattoos});
				collection.render().getBooks();
			},
			function (error) {
				console.log(error);
			});
	},
	getMyTattoos: function(){
		console.log('user profile getMyTattoos');
		console.log(App.profile);
	  	// var tattoos = App.profile.relation('tattoos');
	  	// var query = tattoos.query();
	  	// query.descending("createdAt");
	  	// query.find({
		App.query.tattoosByProfile(App.profile, [], {})
			.then(function (tats) {
				App.myTattoos = new App.Collections.Tattoos(tats);
				var portfolio = new App.Views.Tattoos({collection: App.myTattoos, myTattoos: true});
				portfolio.render();
			},
			function (error) {
				console.log(error);
			});
	},
	renderMyProfile: function(){
		var that = this;
		this.userAddsTattoos.bindAddsToProfile();
		this.$('.bio').after(_.template('<button href="/myprofile/settings" class="btn-submit"><i class="flaticon-settings13"></i>Edit Profile</button>'));
	},
	render: function(){
		var attributes = this.model.attributes
		this.$el.html(this.template(attributes));

		if(Parse.User.current() && this.model.attributes.user.id === Parse.User.current().id){
			this.renderAdds(App.Collections.adds);
			this.getMyTattoos();
			this.renderMyProfile();
		} else {
			this.getAdds();
			this.getTattoos();
		}
		// App.currentView = this;
		return this;
	}
});

App.Views.Books = Parse.View.extend({
	el: '.books',
	initialize: function(){
		_.bindAll(this, 'render', 'renderBooks', 'renderBook');

		this.collection.on('add', this.renderBook, this);
		this.collection.on('reset', this.render, this);
	},
	events: {

	},
    render: function () {
		this.renderBooks();
		return this;
    },
	renderBooks: function(){
    	this.$el.empty();
    	this.collection.forEach(this.renderBook, this);
	},
	renderBook: function(book){
		var bookView = new App.Views.Book({model: book});
		this.$el.append(bookView.render().el);
		return this;
	}
});

App.Views.Book = Parse.View.extend({
	className: 'book',
	template: _.template($("#bookTemplate").html()),
	initialize: function(){

	},
    events: {
      'click h3': 'showAll'
    },
	showAll: function(){
		$('a[href="#collectionTab"]').tab('show');
		var that = this;
		$('.bookFilter.active').click();
		$(".bookFilter").filter(function() {
		    return $(this).text() === that.model.attributes.book;
		}).click();
		$("html, body").animate({ scrollTop: $('.userHead').outerHeight(true) + 41  }, 500);
	},
	render: function(){
		var that = this;
		var attributes = this.model.toJSON();
		$(this.el).append(this.template(attributes));
		_.each(this.model.attributes.tattoos, function(tat) {
			var thumb = tat.get('fileThumbSmall').url();
			that.$('.bookContainer').prepend(_.template('<a class="tattooContainer open"><img src='+thumb+' class="tattooImg" href="/tattoo/' + tat.id + '"></a>'));
		}, that);
		return this;
	}
});


App.Views.Landing = Parse.View.extend({
	id: 'landing',
	landingTemplate: _.template($("#landingTemplate").html()),
	initialize: function(){
		var that = this;
		$('.navs').hide();
		this.initiateArtists();

		/// Workaround for getting a random artist. Will not scale over 1,000 due to query constraint....
		// TODO Replace this with cloud code function, give all featured artists an incrementing id
		// ... then you can query max fid by sorting in descending order and using .first()
		// #20 Add auto-incrementing featured artists id [to better support random artists query]
		// I would also embed this first into the randomFeaturedArtists query for reusability
		var query = new Parse.Query(App.Models.ArtistProfile);
		query.containedIn("featuremonth", ["1","2","3","4","5","6","7","8","9","10","11","12"]);
		query.count().then(function(count){
			that.count = count;
		});

		_.bindAll(this, 'getArtists', 'continue', 'continueToFeatured','initiateArtists', 'hideLanding');
	    // $(window).bind('scroll',this.continueToFeatured);
	    App.on('app:scroll', this.continueToFeatured);

	},
	remove: function () {
		App.off('app:scroll', this.continueToFeatured);
	},
    events: {
    	"click a":	"continueToFeatured"
    },
	land: function(){
		var that = this;
		this.$('.welcome').delay( 100 ).fadeIn( 600 ).delay( 1800 ).animate({
			    marginTop: "5vh",
			    opacity: 0
			  }, 600, function() {
			    // Animation complete.
			  });
		this.$('.logo').delay( 500 ).fadeIn( 1000 ).delay( 1000 )
			.animate({
			    marginBottom: "+5vh"
			  }, 600, "swing", function() {
			  	that.showNextArtist();
			  });
		that.$('.landingLinks').fadeIn();
		this.$('.artistLoc').delay( 1000 ).fadeIn().delay( 1200 ).fadeOut( 300 );
	},
	initiateArtists: function(){
		var that = this;
		this.collection = new App.Collections.FeaturedArtists();
		this.getArtists();
		this.artistTimer = setInterval(function(){
			that.showNextArtist();
		}, 6000);
	},
	showNextArtist: function(){
		var that = this;
		var currentArtist = this.collection.at(0);
		this.collection.remove(currentArtist);
	  	if (this.collection.length == 0) {
	  		this.getArtists();
	  	}
		this.$('.landingTattooContainer:hidden:first').delay( 600 ).fadeIn( { 
			duration: 800,
			start: function() {
				$(this).scrollLeft( 0 ).animate({scrollLeft: 300}, {
					duration: 6000, 
					easing: "linear"
				});
	  		}
  		});
		this.$('.artistName').fadeOut( 800, function() {
			$(this).html(currentArtist.attributes.name).fadeIn( 1000 );
			$(this).attr('href','/'+currentArtist.attributes.username);
		});
		this.$('.artistLoc').fadeOut( 700, function() {
			$(this).html(currentArtist.attributes.locationName).fadeIn( 900 );
		});

		this.$('.landingTattooContainer:visible:first').fadeOut( 800 );

	  	// var tattoos = currentArtist.relation('tattoos');
	  	// var query = tattoos.query();
	  	// query.limit(8);
	  	// query.find().then(function(tats) {
		App.query.tattoosByProfile(currentArtist, [], { limit: 8 })
			.then(function (tats) {
				that.$('.landingTattooContainer:hidden:first').html('');
				_.each(tats, function(tat) {
					var thumb = tat.get('fileThumb').url();
					that.$('.landingTattooContainer:hidden:first').append(_.template('<img src='+thumb+' class="tattooImg open">'));
				}, that);
			}, function (error) {
				console.log(error);
			});
	},
	getArtists: function(){
		this.count = this.count || 50; // total number of artist profiles
		var that = this;
		// var that = this,
	 //    requestCount = 10, // number of random artists to query
	 //    query1, query2, randomQuery,
	 //    queries = [],
	 //    i;
		// for (i = 0; i < requestCount; i++) {
		//     query1 = new Parse.Query(App.Models.ArtistProfile);
		//     query2 = new Parse.Query(App.Models.ArtistProfile);
		//     query1.skip(Math.floor(Math.random() * this.count));
		//     // query1.containedIn("featuremonth", ["1","2","3","4","5","6","7","8","9","10","11","12"]);
		//     query1.notEqualTo('featuremonth','');
		//     query1.limit(1);
		//     // query2.select("name", "username", "locationName", "tattoos");
		//     query2.matchesKeyInQuery("objectId", "objectId", query1);
		//     queries.push(query2);
		//     console.log(query2);
		// }
		// return Parse.Query.or.apply(this, queries).find()
		App.query.randomFeaturedArtists({ limit: 10, count: this.count })
			.then(function (artists) {
				clearInterval(that.artistTimer);
				that.collection.reset(artists);
				that.artistTimer = setInterval(function(){
					that.showNextArtist();
				}, 6000);
			},
			function (error) {
				console.log(error);
			});
	},
	continue:function(){
		this.hideLanding();
	},
	continueToFeatured:function(){
		// Parse.history.navigate('featured', {trigger: true});
		console.log('landing continueToFeatured');
		App.trigger('app:featured');
		this.hideLanding();
	},
	render: function(){
		$(this.el).append(this.landingTemplate());
		this.land();
		return this;
	},
	hideLanding:function(){
		var that = this;
	    this.$el.stop(true, true).animate({
            height:"toggle",
            opacity:"toggle"
        },900, function(){
        	that.remove();
        });
		clearInterval(this.artistTimer);
		$('.navs').fadeIn( 900 );
		// $(window).unbind('scroll', this.continueToFeatured);
	}
});

App.Views.FeaturedArtistPage = Parse.View.extend({
	id: 'featured',
	featuredContainerTemplate: _.template($("#featuredContainerTemplate").html()),
	loadTemplate: _.template(' <div class="end" style="display: none"><img src="img/yt-featuredend.png"><br><br><button type="button" id="more" class="btn-lg">More Artists</button></div>'),
	initialize: function(){
		_.bindAll(this,'addAll', 'addOne', 'render')
    	this.collection.on('reset', this.render, this);
    	this.collection.on('add', this.addOne);

    	App.on('app:scroll', function () {
    		console.log('app.on scrolling....');	
			if ($(document).height() - 1 <= $(window).scrollTop() + $(window).height()) {
			 	$('.featuredArtist:hidden:first').fadeIn("slow");
				if($('.featuredArtist:last').is(':visible')) {
			 		$('.featuredArtists .end').fadeIn();
				}
			}
		});
	},
    events: {
    	'click #more': 'more'
    },
    more: function(e){
    	console.log('featured artist more');
    	//hides load button after clicked
	 	$(e.target.parentElement).fadeOut("normal", function() {
	        $(this).remove();
	    });
    	this.load();
    	$("html, body").animate({ scrollTop: $('.end').offset().top }, 400);
    },
    load: function() {
    	console.log('featured artist load');
    	var that = this;
		// var query = new Parse.Query(App.Models.ArtistProfile);
		// query.containedIn("featuremonth", ["1","2","3","4","5","6","7","8","9","10","11","12"]);
		// var per = 7;
		// var skip = this.collection.page * per;
		// query.skip(skip);
		// query.limit(per);
		// query.descending("featuremonth,createdAt");
		// query.find({
		var options = {
			skip: this.collection.page * 7,
			limit: 7
		};
		App.query.featuredArtists(options)
			.then(function (artists) {
				that.collection.add(artists);
				$('.featuredArtist:lt(3)').fadeIn();
				if (artists.length < 7) {
					that.loadTemplate = _.template(' <div class="end" style="display: none"><img src="img/yt-featuredend.png"><h5>That is all the aritsts for now. See you tomorrow!</h5></div>');
				}
				that.renderLoad();
			},
			function (error) {
				console.log(message);
			});

		var p = (this.collection.page) ? '/p' + this.collection.page : '';
		// TODO Not sure about this, needs revisiting
		Parse.history.navigate('featured'+p, {trigger: false});
    },
    renderLoad: function() {
    	this.collection.page++
		this.$('.featuredArtists').append(this.loadTemplate({page: this.collection.page}));
    },
    addAll: function(){
    	this.$('.featuredArtists').empty();
    	this.addMore();
	},
    addMore: function(){
    	this.collection.forEach(this.addOne);
	},
	addOne: function(artist){
		var featuredArtist = new App.Views.FeaturedArtist({model: artist});
		this.$('.featuredArtists').append(featuredArtist.render().el);
	},
	render: function(){
		var html = this.featuredContainerTemplate();
		$(this.el).append(html);
		this.load();
		// App.currentView = this;
		return this;
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
		// Parse.history.navigate(this.model.attributes.username, {trigger: true});
		App.trigger('app:artist-profile-uname', this.model.get('username'));
		// $("html, body").animate({ scrollTop: 0 }, 200);
	},
	render: function(){
		var that = this;
		var attributes = this.model.toJSON();
		$(this.el).append(this.template(attributes));

		// get 4 tattoos from the artist and append them to the container
	  	// var tattoos = this.model.relation('tattoos');
	  	// var query = tattoos.query();
	  	// query.limit(4);
	  	// query.find().then(function(tats) {
		App.query.tattoosByProfile(this.model, [], { limit: 4 })
			.then(function (tats) {
				_.each(tats, function(tat) {
					var thumb = tat.get('fileThumbSmall').url();
					that.$('.portfolioContainer').append(_.template('<a class="tattooContainer open"><img src='+thumb+' class="tattooImg" href="/tattoo/' + tat.id + '"></a>'));
				}, that);
			},
			function (error) {
				console.log(error);
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
	template: _.template($("#settingsTemplate").html()),
	initialize: function(){
		this.user = Parse.User.current();
		this.profile = App.profile;

		_.bindAll(this,'toggleFacebook', 'render');
	},
    events: {
    	"click #facebookLogin": 			"toggleFacebook",
    	"submit form.accountForm": 			"saveAccount",
    	"keyup #editUsername": 				"usernameVal",
    	"submit form.profileForm": 			"saveProfile",
    	"keyup #editFB, #editInstagram, #editTwitter, #editWebsite":"linkVal",
    	"change #profUpload": 				"updateProf",
    	"dblclick #profileSettings": 		"interview",
    	"click li": 						"scrollTo",
    	"click [href='/myprofile/upload']":	"upload",
	    'focus #settingsMapAddress': 		'initializeLocationPicker',
	    'click .saveLocation': 				'saveLocation',
	    'click .clearLocation': 			'clearLocation'
    },
    toggleFacebook: function(){
    	var that = this;
    	this.$('#facebookLogin').attr("disabled", "disabled");
		if(!Parse.FacebookUtils.isLinked(this.user)) {
			Parse.FacebookUtils.link(this.user, 'user_photos,user_location,user_friends,email,user_about_me,user_website', {
				success: function(user) {
					that.$('#facebookLogin').html('<i class="facebook"></i>Unlink Facebook').css({'background-color':'#cccccc'}).removeAttr("disabled");
				},
				error: function(user, error) {
					$(".accountForm .error").html(error.message).show();
				}
			});
		} else if (Parse.FacebookUtils.isLinked(this.user)) {
			Parse.FacebookUtils.unlink(this.user, {
				success: function(user) {
					that.$('#facebookLogin').html('<i class="facebook"></i>Link Facebook').css({'background-color':'#4f78b4'}).removeAttr("disabled");
					console.log("User no longer associated with their Facebook account.");
				}
			});
		}
    },
    saveAccount: function(e){
    	this.$('.saveAccount').attr("disabled", "disabled");
    	e.preventDefault();
    	this.user.set("username", this.$("#editUsername").val().replace(/\W/g, '').toLowerCase());
    	this.user.set("email", this.$("#editEmail").val());
    	this.user.set("password", this.$("#editPassword").val());
		this.user.save(null,{
			success: function(user) {
				// flash the success class
				$(".accountForm").each(function(){
				    $(".input-group").addClass("has-success").fadeIn("slow");
				    setTimeout(function() { $(".input-group").removeClass("has-success") }, 2400);
				});
				$("#editPassword").val("");
				this.$('.saveAccount').removeAttr("disabled");
			},
			error: function(user, error) {
				$(".accountForm .error").html(error.message).show();
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
		this.$('.saveProfile').attr("disabled", "disabled");
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
				this.$('.saveProfile').removeAttr("disabled");
			},
			error: function(user, error) {
				$(".profileForm .error").html(error.message).show();
			}
		});
    },
    linkVal: function(e) {
    	var value = e.target.value
		if (value && !(/^http/).test(value)) {
			var current = value.split("/").pop();
			var updated = 'http://' + e.target.placeholder + current;
			e.target.value = updated;
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
				$("span:contains('Choose Profile Picture')").removeClass( "disabled" );
			});
		}
    },
	interview: function(){
		  // Parse.history.navigate('interview', {trigger: true});
		  // $("html, body").animate({ scrollTop: 0 }, 200);
		  App.trigger('app:interview');
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
    	// Parse.history.navigate('/myprofile/upload', {trigger: true});
    	App.trigger('app:upload');
    },
	clearLocation: function(){
		this.locationPickerCreated = false;
		this.$('.saveLocation').fadeOut();
		this.$('.gm-style').fadeOut();
		this.$('.clearLocation').attr("disabled", "disabled");
    	App.profile.unset("location");
    	App.profile.set("address", "");
    	App.profile.set("locationName", "");
		App.profile.save(null,{
			success: function(user) {
				$(".editLocation").addClass("has-success").fadeIn("slow");
				setTimeout(function() { $(".editLocation").removeClass("has-success") }, 2400);

				$("#locationSettings ~ .error").hide();
				this.$('#settingsMapAddress').val('');
			    this.$('.clearLocation').removeAttr("disabled").fadeOut();
			},
			error: function(user, error) {
				$(".profileForm .error").html(error.message).show();
			}
		});
	},
	saveLocation: function(){
		var that = this;
		this.$('.saveLocation').attr("disabled", "disabled");
    	App.profile.set("location", this.locationPoint);
    	App.profile.set("address", $("#settingsMapAddress").val());
    	App.profile.set("locationName", this.locationName);
		App.profile.save(null,{
			success: function(user) {
				// flash the success class
				$(".editLocation").addClass("has-success").fadeIn("slow");
				setTimeout(function() { $(".editLocation").removeClass("has-success") }, 2400);
			
				$("#locationSettings ~ .error").hide();

			    that.$('.saveLocation').fadeOut();
			    that.$('.clearLocation').fadeIn();
			    that.$('.saveLocation').removeAttr("disabled");
			},
			error: function(user, error) {
				$(".profileForm .error").html(error.message).show();
			}
		});
	},
	initializeLocationPicker: function(e){
		var that = this;
		if (!this.locationPickerCreated) {
			if(Parse.User.current() && App.profile.attributes.location) {
				var initialLocation = {latitude: App.profile.attributes.location.latitude, longitude: App.profile.attributes.location.longitude};
			} else {
				var initialLocation = {latitude: 34.0500, longitude: -118.2500};
			}
			$('#settingsMap').locationpicker({
				location: initialLocation,
				radius: 0,
				zoom: 10,
				enableAutocomplete: true,
				enableReverseGeocode: true,
				styles: App.mapStyles,
				inputBinding: {
					locationNameInput: $('#settingsMapAddress')
				},
				onchanged: function(currentLocation, currentLocationNameFormatted) {
			    	that.locationPoint = new Parse.GeoPoint({latitude: currentLocation.latitude, longitude: currentLocation.longitude});
			    	that.locationName = currentLocationNameFormatted;
			    	that.$('.gm-style').fadeIn();
			    	that.$('.saveLocation').fadeIn();
				},
				onlocationnotfound: function(locationName) {
					$("#locationSettings ~ .error").html("Couldn't find "+locationName+", Try another address?").show();				
				},
				oninitialized: function(component){
			    	that.$('.clearLocation').fadeIn();
					if(!App.profile.attributes.location) {
				    	that.$('.gm-style').hide();
						that.$('#settingsMapAddress').val('');
					} else {
						that.$('.gm-style').fadeIn();
					}
				}
			});
			this.locationPickerCreated = true;
		}

	},
	renderProf: function(){
		if(this.profile.get("prof")) {
			var file = this.profile.get("profThumb");
			$(".prof")[0].src = file.url();
		}
	},
	render: function(){
		this.$el.html(this.template(this.profile.attributes));
		var that = this;
		window.setTimeout(function(){
			that.renderProf()
			if(App.profile.attributes.location){
				that.initializeLocationPicker();
			}
			if(Parse.FacebookUtils.isLinked(that.user)) {
				that.$('#facebookLogin').html('<i class="facebook"></i>Unlink Facebook').css({'background-color':'#cccccc'});
			}
		},0);
		return this;
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
    	"submit form.interviewForm": 	"saveInterview"
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
    	this.profile.set("featuremonth", this.$("#editFeatureMonth").val());
    	this.profile.set("featureyear", this.$("#editFeatureYear").val());
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
		"click .selectArtist": 		"selectArtist",
		"click .selectUser": 		"selectUser",
		"keypress #inputUsername": 	"initUsernameCheckTimer",
		"focus #inputEmail": 		"showEmailForm",
		"submit form.signupForm": 	"signUp",
		"click #facebookLogin": 	"signUpWithFacebook"
	},
    initialize: function() {
		_.bindAll(this, "signUp", "signUpWithFacebook", "initUsernameCheckTimer", "showEmailForm", "checkUsername");
		this.usernameCheckTimer;
		this.role = 'user';
    },
    selectArtist: function(){
    	this.$('.selectUser').removeClass('active');
    	this.$('.selectArtist').addClass('active');
    	this.role = 'artist';
    },
	selectUser: function(){
		this.$('.selectArtist').removeClass('active');
		this.$('.selectUser').addClass('active');
		this.role = 'user';
    },
    initUsernameCheckTimer: function(e){
    	this.$("#inputUsername").removeClass('inputError, inputSuccess');
    	var that = this;
		if ( e.which === 13 ) { 
			if (this.usernameCheckTimer) clearTimeout(this.usernameCheckTimer);

			that.checkUsername();
		} else {
			if (this.usernameCheckTimer) clearTimeout(this.usernameCheckTimer);
			this.usernameCheckTimer = setTimeout(function(){

				that.checkUsername();
			}, 1250);
		}
    },
    checkUsername: function(){
		this.username = this.$("#inputUsername").val().replace(/\W/g, '').toLowerCase();
    	this.$("#inputUsername").val(this.username).removeClass('inputError').addClass('inputChecking');
    	var that = this;
    	var totalCount;
    	var userQuery = new Parse.Query(App.Models.UserProfile);
    	userQuery.equalTo('username', this.username);
    	var artistQuery = new Parse.Query(App.Models.ArtistProfile);
    	artistQuery.equalTo('username', this.username);

    	userQuery.count().then(function(userCount){
    		totalCount = userCount;
    		return artistQuery.count();
    	}).then(function(artistCount){
    		totalCount = totalCount + artistCount;
    	}).then(function(success){
    		if(totalCount === 0 ) {
    			that.$("#inputUsername").removeClass('inputChecking').addClass('inputSuccess');
    			that.$(".signUpSelection").fadeIn( 800 );
    		} else {
    			that.$("#inputUsername").removeClass('inputChecking').addClass('inputError');
    		}
    	}, function(error){
    		console.log(error);
    	});
    },
    showEmailForm: function(){
    	var that = this;
    	this.$('#inputEmail').removeClass('btn-submit');
    	this.$('#facebookLogin').fadeOut( 600, function(){
    		that.$('.signUpSelection > p').html('<br>');
    		that.$('.signupForm').children().fadeIn( 1200 );
    	});
    },
    signUp: function() {
		this.$(".signupForm button").attr("disabled", "disabled");
		var that = this;
		var email = this.$("#inputEmail").val();
		var password = this.$("#inputPassword").val();
		var userACL = new Parse.ACL(Parse.User.current());
		Parse.User.signUp(this.username, password, { email: email, role: this.role, ACL: userACL 
		}).then(function(user){
	    	if(user.attributes.role === 'user'){
	    		var profile = new App.Models.UserProfile();
	    	} else  {
	    		var profile = new App.Models.ArtistProfile(); 
	    	};
	    	profile.set('user', user);
	    	profile.set('name', user.attributes.username);
	    	profile.set('username', user.attributes.username);
	      	App.profile = profile;
	      	return profile.save();
		}).then(function(profile) {
			var nav = new App.Views.Nav();
			App.trigger('app:tour');
			that.undelegateEvents();
			delete that;
		}, function(error) {
			console.log(error);
			$(".signupForm .error").html(error.message).show();
			$(".signupForm button").removeAttr("disabled");
		});
		return false;
    },
    signUpWithFacebook: function(){
		this.$("#facebookLogin").attr("disabled", "disabled");
		var user = new Parse.User();
		user.set('role', this.role);
    	var that = this;
		Parse.FacebookUtils.logIn('user_photos,user_location,user_friends,email,user_about_me,user_website', {
			success: function(user) {
				if (!user.existed()) {
					var userACL = new Parse.ACL(Parse.User.current());
					FB.api('/me', function(response) {
						user.set('email', response.email);
						user.set('username', that.username);
						var userACL = new Parse.ACL(user);
						user.setACL(userACL);
						user.save().then(function(user){
					    	if(user.attributes.role === 'user'){
					    		var profile = new App.Models.UserProfile();
					    	} else  {
					    		var profile = new App.Models.ArtistProfile(); 
					    	};
					    	profile.set('user', user);
					    	profile.set('username', that.username);
					    	profile.set('name', response.name);
					    	profile.set('desc', response.bio);

					    	/// set profile picture
					    	///https://developers.facebook.com/docs/graph-api/reference/v2.1/user/picture
							// FB.api(
							//     "/me/picture",
							//     function (response) {
							//       if (response && !response.error) {
							//         /* handle the result */
							//       }
							//     }
							// );
							// var upload = prof.files[0];
							// var name = this.user.getUsername() + "prof.jpg";
							// var file = new Parse.File(name, upload);
							// profile.set("prof", file);

					      	App.profile = profile;
					      	return profile.save();
						}).then(function(profile) {
							var nav = new App.Views.Nav();
							App.trigger('app:tour');
							that.undelegateEvents();
							delete that;
						}, function(error) {
							user.destroy().then(function(){
								// Parse.User.logOut();
								App.session.logout();
								// Parse.history.navigate('/login', {trigger: true});
								App.trigger('app:login');
							});
							$(".signupForm .error").html(error.message).show();
							console.log(error);
						});
					});
				} else {
					var nav = new App.Views.Nav();
					App.trigger('app:featured');
				}
			},
		 	error: function(user, error) {
				$(".signupForm .error").html(error.message).show();
		 	}
		});
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
    viewContainer: '.lightContainer',
	cancelEl: '.x, .cancel',
    initialize: function() {
    	Parse.history.navigate("myprofile/upload", {trigger: false, replace: true});
    },
    events: {
    	"click [data-dismiss='fileinput'],[data-trigger='fileinput']": 		"clear",
     	"click .upload": 													"upload"
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
	onRender: function(){
		$("body").css("overflow", "hidden");
	},
	cancel: function(e){
		$("body").css("overflow", "auto");
		// Parse.history.navigate("myprofile", {trigger: false});
		// if(App.currentView){App.currentView.initialize()};
		// window.history.back();s
		App.trigger('app:modal-close');
	}
});

App.Views.ForgotPassword = Parse.View.extend({
	id: 'password',
	template: _.template($("#passwordResetTemplate").html()),
    events: {
      "submit form.passwordForm": 	"resetPassword"
    },
    initialize: function() {
   
    },
    resetPassword: function(e){
    	e.preventDefault();
    	var info = $("#inputInfo").val();
		Parse.User.requestPasswordReset(info, {
		  success: function() {
		    // Password reset request was sent successfully
		    this.$('p').html('Check your email for the password reset link!')
		    // setTimeout(function() { Parse.history.navigate('', {trigger: true}) }, 2400);
		    setTimeout(function() { App.trigger('app:index'); }, 2400);
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

App.Views.UserTour = Backbone.Modal.extend({
	template: _.template($('#tourTemplate').html()),
	id: 'tour',
	initialize: function(){

	},
	viewContainer: '.clearContainer',
	cancelEl: '.done',
	views: {
		'click #step1': {
			view: _.template($('#userTour1Template').html())
		},
		'click #step2': {
			view: _.template($('#userTour2Template').html())
		},
		'click #step3': {
		 	view: _.template($('#userTour3Template').html())
		},
		'click #step4': {
		 	view: _.template($('#userTour4Template').html())
		},
		// 'click #step5': {
		//  	view: _.template($('#userTour5Template').html())
		// },
		'click #step5': {
		 	view: _.template($('#userTour6Template').html())
		}
	},
	events: {
		'click .back': 'previousStep',
		'click .next': 'nextStep',
		'click .skip': 'editProfile'
	},
	previousStep: function(e) {
		e.preventDefault();
		this.previous();
	},
	nextStep: function(e) {
		e.preventDefault();
		this.next();
	},
	editProfile: function(e) {
		e.preventDefault();
		this.triggerCancel();
		// Parse.history.navigate("myprofile/settings", {trigger: true});
		App.trigger('app:settings');
	},
	cancel: function(e){
		$("body").css("overflow", "auto");
		Parse.history.navigate("myprofile", {trigger: false});
	},
	onRender: function(){
		$("body").css("overflow", "hidden");
	},
	cancel: function () {
		App.trigger('app:modal-close');
	}
});

App.Views.ArtistTour = Backbone.Modal.extend({
	template: _.template($('#tourTemplate').html()),
	id: 'tour',
	initialize: function(){

	},
	viewContainer: '.clearContainer',
	cancelEl: '.done',
	views: {
		'click #step1': {
			view: _.template($('#userTour1Template').html())
		},
		'click #step2': {
			view: _.template($('#artistTour2Template').html())
		},
		'click #step3': {
		 	view: _.template($('#artistTour3Template').html())
		},
		'click #step4': {
		 	view: _.template($('#artistTour4Template').html())
		},
		'click #step5': {
		 	view: _.template($('#artistTour5Template').html())
		},
		'click #step6': {
		 	view: _.template($('#artistTour6Template').html())
		}
	},
	events: {
		'click .back': 'previousStep',
		'click .next': 'nextStep',
		'click .skip': 'editProfile'
	},
	previousStep: function(e) {
		e.preventDefault();
		this.previous();
	},
	nextStep: function(e) {
		e.preventDefault();
		this.next();
	},
	editProfile: function(e) {
		e.preventDefault();
		this.triggerCancel();
		// Parse.history.navigate("myprofile/settings", {trigger: true});
		App.trigger('app:settings');
	},
	// cancel: function(e){
	// 	$("body").css("overflow", "auto");
	// 	Parse.history.navigate("myprofile", {trigger: false});
	// },
	onRender: function(){
		$("body").css("overflow", "hidden");
	},
	cancel: function () {
		App.trigger('app:modal-close');
	}
});

App.Views.Feedback = Parse.View.extend({
	id: 'feedback',
	template: _.template($("#feedbackTemplate").html()),
    initialize: function() {
   
    },
	events: {
		'click [href="#feedbackTab"]': 	'feedbackTab',
		'click [href="#bugTab"]': 		'bugTab'
	},
	feedbackTab: function(){
	    $('a[href="#feedbackTab"]').tab('show');
	    return false;
	},
	bugTab: function(){
	    $('a[href="#bugTab"]').tab('show');
	    return false;
	},
	render: function(){
		var html = this.template();
		$(this.el).html(html);
		return this;
	}
});

///////// Collections

// A temp fix for the duplicate id exception being thrown, until Parse.Collection 
// is updated inline with Backbone.Collection, or a better solution is found
App.Collection = Parse.Collection.extend({
	// Override add method, catch duplicate id error to stop app from crashing
	add: function (models, options) {
		try {
			Parse.Collection.prototype.add.call(this, models, options);
		}
		catch (e) {
			console.error('Duplicate collection id : ' + e);
		}
	}
});

App.Collections.Artists = App.Collection.extend({
	initialize: function(){
		this.page = 0;
	},
	model: App.Models.User
});

App.Collections.Tattoos = App.Collection.extend({
	initialize: function(){
		this.page = 0;
	},
	model: App.Models.Tattoo,
	getBooksByCount: function(count){
		this.artistBooks = _.flatten(this.pluck('artistBooks')).byCount();
		this.popularBooks = _.flatten(this.pluck('books')).byCount();
		this.allBooks = this.artistBooks.concat(this.popularBooks)
		return this.allBooks.slice(0, count || 10);
	},
	byBooks: function(books){
		//Takes an array of books, returns the tattoos where the books are inlcuded.

		return this.filter(function(tat){ 
			return _.intersection(tat.attributes.books, books).length >= books.length; });
	}
});

App.Collections.Adds = App.Collection.extend({
	model: App.Models.Add,
	initialize: function(){

	},
	getBooksByCount: function(count){
		this.popularBooks = _.flatten(this.pluck('books')).byCount().slice(0, count || 10);
		return this.popularBooks;
	},
	getTattoo: function(tattooId){
		return this.filter(function(add){ return add.get('tattooId') === tattooId; });
	},
	getTattoos: function(){
		this.tattoos = _.map(this.models, function(add){
			add.attributes.tattoo.attributes.artistProfile = add.attributes.artistProfile;
			add.attributes.tattoo.attributes.books = add.attributes.books;
			return add.attributes.tattoo;
		});
		return this.tattoos;
	},
	getArtists: function(){
		var allArtists = _.uniq( _.map( this.models, function(add){ return add.attributes.artistProfile; }), function(artist){return JSON.stringify(artist)});
		this.artists = _.sortBy(allArtists, function(artist){ return artist.get('collectorCount') * -1; });
		return this.artists;
	}
});

App.Collections.Books = App.Collection.extend({
	model: App.Models.Book,
	initialize: function(){

	}
});

App.Collections.FeaturedArtists = App.Collection.extend({
	model: App.Models.User,
	page: 0
});

///////// Routers
App.Router = Parse.Router.extend({
	routes: {
		"":								"index",
		"landing":						"landing",
		"search": 						"search",
		"search/:searchFor": 			"search",
		"featured":	    				"featured",
		"featured/p:page":	 		    "featured",
		"about":   						"about",
		"join":        				    "join",
		"login":        				"login",
		"forgot": 						"forgot",
		"interview":      				"interview",
		"feedback":      				"feedback",
		"bug":      					"bug",

		"myprofile": 					"myProfile",
		"myprofile/tour":  				"tour",
		"myprofile/settings":  			"settings",
		"myprofile/upload": 			"upload",
		"myprofile/:tab": 				"myProfile",
		"myprofile/edit/:id": 			"editTattoo",

		"tattoo/:id": 					"tattooProfile",

		"user/:uname":   				"userProfile",
		"user/:uname/:tab":   			"userProfile",

		":uname":   					"artistProfile",
		":uname/:tab":   				"artistProfile"
	},
	initialize: function(){
		console.log('router init');
		
		// Track if we have app history, so closing modals don't send users away from site
		this.hitRoutes = [];
		this.on('all', function () { this.hitRoutes.push(Parse.history.getFragment); }, this);

		// Initialize controller
		App.controller.initialize();

		//google analtic tracking
		this.bind('route', this._pageView);
		// this.user = Parse.User.current(); // NOT USED?
	},
	back: function () {
		if (this.hitRoutes.length > 1) {
			window.history.back();
		}
		else {
			this.index();
		}
	},
	index: function(){
		console.log('route index');
		App.controller.index();
	},
	landing: function(){
		console.log('route landing');
		App.controller.landing();
	},
	search: function(searchFor){
		console.log('route search : ' + searchFor);
		App.controller.search(searchFor);
	},
	featured: function(page) {
		console.log('route featured : ' + page);
	    App.controller.featured(page);
	},
	about: function(){
		console.log('route about');
		App.controller.about();
	},
	join: function(){
		console.log('route join');
		App.controller.join();
	},
	login: function(){
		console.log('route login');
		App.controller.login();
	},
	forgot: function () {
		console.log('route forgot');
		App.controller.forgot();
	},
	interview: function(){
		console.log('route interview');
		App.controller.interview();
	},
	feedback: function(){
		console.log('route feedback');
		App.controller.feedback();
	},
	bug: function(){
		console.log('route bug');
		App.controller.bug();
	},
	myProfile: function(tab){
		console.log('route myProfile');
		App.controller.myProfile(tab);
	},
	tour: function(){
		console.log('route tour');
		App.controller.tour();
	},
	settings: function(){
		console.log('route settings');
		App.controller.settings();
	},
	editTattoo: function(id){
		console.log('show editTattoo');
		App.controller.editTattooById(id);
	},
	upload: function(){
		console.log('route upload');
		App.controller.upload();
	},
	tattooProfile: function(id){
		console.log('route tattooProfile');
		App.controller.tattooProfileById(id);
	},
	artistProfile: function(uname, tab){
		console.log('route artistProfile');
		App.controller.artistProfileByUname(uname, tab);
	},
	userProfile: function(uname, tab){
		console.log('route userProfile');
		App.controller.userProfileByUname(uname, tab);
	},
	//google analytic tracking - http://nomethoderror.com/blog/2013/11/19/track-backbone-dot-js-page-views-with-google-analytics/
	_pageView: function() {
	  var path = Parse.history.getFragment();
	  ga('send', 'pageview', {page: "/" + path});
	}
});


App.controller = (function Controller() {

	this.initialize = function (options) {
		console.log('controller init');

		App.viewManager.initialize();

		var self = this;
		App.on('app:index', function () { self.index(); });
		App.on('app:landing', function () { self.landing(); });
		App.on('app:search', function (searchFor) { self.search(searchFor); });
		App.on('app:featured', function (page) { self.featured(page); });
		App.on('app:login', function () { self.login(); });
		App.on('app:forgot', function () { self.forgot(); });
		App.on('app:about', function () { self.about(); });
		App.on('app:join', function () { self.join(); });
		App.on('app:interview', function () { self.interview(); });
		App.on('app:feedback', function () { self.feedback(); });
		App.on('app:bug', function () { self.bug(); });
		App.on('app:myprofile', function (tab) { self.myProfile(tab); });
		App.on('app:tour', function () { self.tour(); });
		App.on('app:settings', function () { self.settings(); });
		App.on('app:upload', function () { self.upload(); });
		App.on('app:edit-tattoo-id', function (id) { self.editTattooById(id); });
		App.on('app:edit-tattoo', function (tattoo) { self.editTattoo(tattoo); });
		App.on('app:tattoo-profile-id', function (id) { self.tattooProfileById(id); });
		App.on('app:tattoo-profile', function (tattoo) { self.tattooProfile(tattoo); });
		App.on('app:user-profile-uname', function (uname, tab) { self.userProfileByUname(uname, tab); });
		App.on('app:user-profile', function (user, tab) { self.userProfile(user, tab); });
		App.on('app:artist-profile-uname', function (uname, tab) { self.artistProfileByUname(uname, tab); });
		App.on('app:artist-profile', function (artist, tab) { self.artistProfile(artist, tab); });
	}

	this.destroy = function () {
		console.log('controller destory');
		App.off('app:index');
		App.off('app:landing');
		App.off('app:search');
		App.off('app:featured');
		App.off('app:login');
		App.off('app;forgot');
		App.off('app:about');
		App.off('app:join');
		App.off('app:interview');
		App.off('app:feedback');
		App.off('app:bug');
		App.off('app:myprofile');
		App.off('app:tour');
		App.off('app:settings');
		App.off('app:upload');
		App.off('app:edit-tattoo-id');
		App.off('app:edit-tattoo');
		App.off('app:tattoo-profile-id');
		App.off('app:tattoo-profile');
		App.off('app:user-profile-uname');
		App.off('app:user-profile');
		App.off('app:artist-profile-uname');
		App.off('app:artist-profile');
	}

	this.index = function () {
		console.log('controller index');
		if (!Parse.User.current()){
			this.landing();
		} else {
			this.featured();
		}
	}

	this.landing = function () {
		console.log('controller landing');
		var landing = new App.Views.Landing();
		$('#gutter').html(landing.render().el);
	}

	this.search = function (searchFor) {
		console.log('controller search : ' + searchFor);
		App.search = new App.Views.Search();
		App.viewManager.show(App.search);
		if (searchFor) {
			App.search[searchFor+'SearchInitialize']();
		}
		Parse.history.navigate('search/' + searchFor, { trigger: false });
	}

	this.featured = function (page) {
		console.log('controller featured : ' + page);
		var featuredArtists = new App.Collections.FeaturedArtists();
	    featuredArtists.page = (page) ? page : 0;
		var featuredArtistPage = new App.Views.FeaturedArtistPage({ collection: featuredArtists });
		App.viewManager.show(featuredArtistPage);
		Parse.history.navigate('featured', { trigger: false });
	}

	this.login = function () {
		console.log('controller login');
		var login = new App.Views.Login();
		App.viewManager.show(login);
		Parse.history.navigate('login', { trigger: false });
	}

	this.forgot = function () {
		console.log('controller forgot');
		var forgotPassword = new App.Views.ForgotPassword();
		App.viewManager.show(forgotPassword);
		Parse.history.navigate('forgot', { trigger: false });
	}

	this.about = function () {
		console.log('controller about');
		var about = new App.Views.About();
		App.viewManager.show(about);
		// Crude view switch doesn't work well here when appending views.
		// Would be better to use regions, or a composite view.
		var join = new App.Views.Join();
		$('#app').append(join.render().el);
		Parse.history.navigate('about', { trigger: false });
	}

	this.join = function () {
		console.log('controller join');
		var join = new App.Views.Join();
		App.viewManager.show(join);
		Parse.history.navigate('join', { trigger: false });
	}

	this.interview = function () {
		console.log('controller interview');
		var interview = new App.Views.Interview();
		App.viewManager.show(interview);
		Parse.history.navigate('interview', { trigger: false });
	}

	this.feedback = function () {
		console.log('controller feedback');
		var feedback = new App.Views.Feedback();
		App.viewManager.show(feedback);
		Parse.history.navigate('feedback', { trigger: false });
	}

	this.bug = function () {
		console.log('controller bug');
		var bug = new App.Views.Feedback();
		App.viewManager.show(bug);
		bug.bugTab();
		Parse.history.navigate('bug', { trigger: false });
	}

	this.myProfile = function (tab) {
		console.log('controller myprofile : ' + tab);
		var myProfile;
		if (Parse.User.current().attributes.role === 'user') {
			myProfile = new App.Views.UserProfile({ model: App.profile });
		} else {
			myProfile = new App.Views.ArtistProfile({ model: App.profile });
		}
		App.viewManager.show(myProfile);

		// TODO Bad, should be done in view init
		if (tab) {
			myProfile[tab+'Tab']();
		}

		Parse.history.navigate('myprofile', { trigger: false });
	}

	this.tour = function () {
		console.log('controller tour');
		this.myProfile();
		var tour;
		if (Parse.User.current().attributes.role === 'user') {
			tour = new App.Views.UserTour();
		} else  {
			tour = new App.Views.ArtistTour();
		};
		App.viewManager.show(tour);
		Parse.history.navigate('myprofile/tour', { trigger: false });
	}

	this.settings = function () {
		console.log('controller settings');
		this.myProfile();
		var settings = new App.Views.Settings();
		App.viewManager.show(settings);
		Parse.history.navigate('myprofile/settings', { trigger: false });
	}

	this.upload = function () {
		console.log('controller upload');
		this.myProfile();
		var upload = new App.Views.Upload();
		App.viewManager.show(upload);
		Parse.history.navigate('myprofile/upload', { trigger: false });
	}

	this.editTattooById = function (id) {
		console.log('controller editTattooById : ' + id);
		// var query = new Parse.Query(App.Models.Tattoo);
		// query.get(id, {
		App.query.tattooById(id)
			.then(function (tattoo) {
				this.editTattoo(tattoo);
			},
			function (object, error) {
				console.log(error);
			});
	}

	this.editTattoo = function (tattoo) {
		console.log('controller editTattoo : ' + tattoo.id);
		this.myProfile();
		var profile = new App.Views.EditTattoo({ model: tattoo });
		App.viewManager.show(profile);
		Parse.history.navigate('myprofile/edit/' + tattoo.id , { trigger: false });
	}

	this.tattooProfileById = function (id) {
		console.log('controller tattooProfileById : ' + id);
		// var query = new Parse.Query(App.Models.Tattoo);
		// query.get(id, {
		App.query.tattooById(id)
			.then(function (tattoo) {
				this.tattooProfile(tattoo);
			},
			function (object, error) {
				console.log(error);
			});
	}

	this.tattooProfile = function (tattoo) {
		console.log('controller tattooProfile : ' + tattoo.id);
		var profile = new App.Views.TattooProfile({ model: tattoo });
		App.viewManager.show(profile);
		Parse.history.navigate('tattoo/' + tattoo.id , { trigger: false });
	}

	this.userProfileByUname = function (uname, tab) {
		console.log('controller userProfileByUname : ' + uname + ' / ' + tab);
		// var query = new Parse.Query(App.Models.UserProfile);
		// query.equalTo("username", uname);
		// query.first().then(function (user) {
		App.query.usersProfile(uname)
			.then(function (user) {
				if (user) {
					this.userProfile(user, tab);
				} else {
					// Parse.history.navigate('/', { trigger: true });
					App.trigger('app:index');
					$('.intro').html("<h3>Couldn't find the user you were looking for...</h3>");
				}
			},
			function (error) {
				console.log("Error: " + error.code + " " + error.message);
			});
	}

	this.userProfile = function (user, tab) {
		console.log('controller userProfile : ' + user.get('username') + ' / ' + tab);
		var userProfile = new App.Views.UserProfile({model: user});
		App.viewManager.show(userProfile);
		if (tab) {
			userProfile[tab+'Tab']();
		}
		Parse.history.navigate('user/' + user.get('username') + (tab ? '/' + tab : ''), { trigger: false });
	}

	this.artistProfileByUname = function (uname, tab) {
		console.log('controller artistProfileByUname : ' + uname + ' / ' + tab);
		// var query = new Parse.Query(App.Models.ArtistProfile);
		// query.equalTo("username", uname);
		// query.first().then(function (artist) {
		App.query.artistsProfile(uname)
			.then(function (artist) {
				if (artist) {
					this.artistProfile(artist, tab);
				}
				else {
					App.trigger('app:user-profile-uname', uname);
				}
			}, 
			function (error) {
				console.log("Error: " + error.code + " " + error.message);
			});
	}

	this.artistProfile = function (artist, tab) {
		console.log('controller artistProfile : ' + artist.get('username') + ' / ' + tab);
		var profile = new App.Views.ArtistProfile({ model: artist, tab: tab });
		App.viewManager.show(profile);
		if (tab) {
			profile[tab+'Tab']();
		}
		Parse.history.navigate(artist.get('username') + (tab ? '/' + tab : ''), { trigger: false });
	}

	return this;
})();

App.viewManager = (function ViewManager() {

	var currentView;
	var currentModal;

	function initialize() {
		console.log('view manager init');
		App.on('app:modal-close', closeModal);
	}

	function destroy() {
		App.off('app:modal-close');
	}

	function show(view) {

		console.log('view manager - show ');
		if (currentView) {
			console.log('view manager - disposing view...');
			currentView.remove();
			currentView = undefined;
		}

		if (currentModal) {
			console.log('view manager - disposing modal...');
			currentModal.close();
			currentModal.remove();
			currentModal = undefined;
		}

		render(view);
	}

	function closeModal() {
		console.log('view manager - hide modal');

		if (currentModal) {
			console.log('view manager - disposing modal...');
			currentModal = undefined;
		}

		App.router.back();
	}

	function render(view) {
		console.log('view manager - rendering...');

		if (Backbone.Modal.prototype.isPrototypeOf(view)) {
			return _renderModal(view);
		}
		return _renderView(view);
		
		function _renderModal(view, callback) {
			currentModal = view;
			$('.modalayheehoo').html(currentModal.render().el);
		}

		function _renderView(view, callback) {
			currentView = view;
			$('#app').html(currentView.render().el);
			App.transition.scrollIntoView();
		}
	}

	return {
		initialize: initialize,
		destroy: destroy,
		show: show
	};
})();

App.transition = (function Transition() {

	var duration = 400;

	function scrollIntoView() {
		console.log($(window).scrollTop().valueOf());
		if ($(window).scrollTop().valueOf()) {
			console.log('Scrolling into view...');
			$('body, html').animate({ scrollTop: 0 }, duration);	
		}
	}

	return {
		scrollIntoView: scrollIntoView
	};
})();


/* 
	Query Handler 
*/
App.query = (function QueryHandler() {

	/*
		Query users profile,
		return either [User|Artist]Profile dependant on user account
	*/
	this.profile = function (user) {
		var user = user || App.session.user();
		var query = (user.attributes.role === 'user') ?
				new Parse.Query(App.Models.UserProfile) : 
				new Parse.Query(App.Models.ArtistProfile);
		query.equalTo('user', user);
		return query.first();
	}

	/*
		Query user profile, 
		by username
	*/
	this.usersProfile = function (uname) {
		var query = new Parse.Query(App.Models.UserProfile);
		query.equalTo("username", uname);
		return query.first();
	}

	/*
		Query artists profile,
		by username
	*/
	this.artistsProfile = function (uname) {
		var query = new Parse.Query(App.Models.ArtistProfile);
		query.equalTo("username", uname);
		return query.first();
	}

	/* 
		Query users adds
	*/
	this.adds = function (user) {
		var query = new Parse.Query(App.Models.Add);
		query.descending("createdAt");
		query.equalTo('user', user || App.session.user());
		query.include('tattoo');
		query.include('artistProfile');
		return query.find();
	}

	/*
		Query tattoos,
		filter by books
	*/
	this.tattoos = function (books, options) {
		var query = new Parse.Query('Tattoo');
		if (books && books.length > 0) {
			query.containsAll('books', books);
		}
		query.skip(options.skip || 0);
		query.limit(options.limit || 1000);
		query.include('artistProfile');
		query.descending('updatedAt');
		return query.find();
	}

	/* 	
		Query tattoos by profile, 
		filter by books 
	*/
	this.tattoosByProfile = function (profile, books, options) {
		var query = profile.relation('tattoos').query();
	  	if (books && books.length > 0) {
			query.containsAll('books', books);
		}
		query.skip(options.skip || 0);
		query.limit(options.limit || 1000);
		return query.find();
	}

	/*
		Query tattoo,
		by id
	*/
	this.tattooById = function (id) {
		var query = new Parse.Query('Tattoo');
		return query.get(id);
	}

	/*
		Query artists,
		filter either by location or date created
	*/
	this.artists = function (location, options) {
		var query = new Parse.Query('ArtistProfile');
		if (location) {
			query.near("location", location);
		}
		else {
			query.descending('createdAt');
		}
		query.skip(options.skip || 0);
		query.limit(options.limit || 1000);
		return query.find();
	}

	/*
		Query featured artists
	*/
	this.featuredArtists = function (options) {
		var query = new Parse.Query('ArtistProfile');
		query.notEqualTo('featuremonth', '')
		query.skip(options.skip || 0);
		query.limit(options.limit || 1000);
		query.descending("featuremonth,createdAt");
		return query.find();
	}

	/*
		Query random featured artists
	*/
	this.randomFeaturedArtists = function (options) {
		var queries = [];
		for (var i = 0; i < options.limit; i++) {

			var q = new Parse.Query(App.Models.ArtistProfile);
			q.notEqualTo('featuremonth','');
			q.skip(Math.floor(Math.random() * options.count)); // <- Replace options.count with pre-query once #20 implemented
			q.limit(1);
		    
		    var query = new Parse.Query(App.Models.ArtistProfile);
		    query.matchesKeyInQuery("objectId", "objectId", q);
			queries.push(query);
		}
		return Parse.Query.or.apply(this, queries).find();
	}

	return this;
})();

$(function() {
	App.start();
});

