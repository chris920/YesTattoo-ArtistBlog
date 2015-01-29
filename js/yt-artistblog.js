Parse.$ = jQuery;
// Parse.initialize("ngHZQH087POwJiSqLsNy0QBPpVeq3rlu8WEEmrkR", "J1Co4nzSDVoQqC1Bp5KU7sFH3DY7IaskiP96kRaK"); ///demo    ///c
// Parse.initialize("IErIorHCGoWUsq2yyUr4XwX5T93NsAGPXvXfAUl7", "FRJ92cNhdzkOGWqwCzyd6ZomtAsNTNMZNaH2ftlO"); ///test    ///c
Parse.initialize("1r0HsPw8zOPEX5NMWnoKw43AIrJza3RiXdKJQ2D7", "yyb4DXWL5BPdMq2y1HikNT1n5knp1rO4Z3dM6Rqr"); ///live

var App = new (Parse.View.extend({
    Models: {},
    Views: {},
    Collections: {},
    Promises: {},
    initialize: function(){
        // Setup app proxy for windows events   ///c
        $(window).on('scroll', function (e) { App.trigger('app:scroll', e); });
        $(window).on('keypress', function (e) { App.trigger('app:keypress', e); });
    },
    disable: function () {
        // Stop listening to windows events ///c
        $(window).off('scroll');
        $(window).off('keypress');
    },
    start: function(){
        // Initialize session, tracks user log on/off   ///c
        App.session = new App.Models.Session();
        App.session.on('change:logged_in', function (model, value) {
            App.setProfile();
        });

        this.initTypeahead();
        this.setGlobalBooks();
        this.setProfile(this.startRouter);
        this.initScrollToTop();
        this.initAlertWindow();

        var nav = new App.Views.Nav();
        var footer = new App.Views.Footer();
    },
    startRouter: function(){
        App.router = new App.Router();
        Parse.history.start({pushState: false, root: '/'});
    },
    setProfile: function (callBack) {
        if (!App.session.loggedIn()) {
            // Not logged in, reset profile data    ///c
            App.profile = undefined;
            App.Collections.adds = new App.Collections.Adds();
            if (callBack) { callBack(); }
        } else if (App.profile === undefined) {
            // User lgoged in, fetch profile data   ///c
            Parse.Promise.when([App.query.profile(), App.query.adds()])
                .then(function (profile, adds) {
                        console.log('profile and adds set');    ///c
                        App.profile = profile;
                        App.Collections.adds = new App.Collections.Adds(adds);
                    },
                    function (error) {
                        console.log("Error: " + error.code + " " + error.message);  ///c
                    }
                )
                .always(function () {
                    if (callBack) { callBack(); }
                });
        }
    },
	setGlobalBooks: function () {
		App.Collections.globalBooks = new App.Collections.GlobalBooks();
		App.Promises.globalBooks = new $.Deferred();
		App.query.allGlobalBooks()
			.then(function (globalBooks) {
				console.log('globalBooks set'); ///c
				App.Collections.globalBooks.reset(globalBooks);
				//Gets the names of the globalBooks and re-init typeahead   ///c
				var bookNames = App.Collections.globalBooks.pluck('name');
				App.initTypeahead(bookNames);
				App.Promises.globalBooks.resolve();
			},
			function (error) {
				console.log("Error: " + error.code + " " + error.message);  ///c
				App.Promises.globalBooks.reject(error);
			});
	},
    initTypeahead: function(books){
        if (!books) {
            var books =  [ "Abstract","Ambigram","Americana","Anchor","Angel","Animal","Ankle","Aquarius","Aries","Arm","Armband","Art","Asian","Astrology","Aztec","Baby","Back","Barcode","Beauty","Bible","Bicep","Biomechanical","Bioorganic","Birds","Black","Black And Gray","Blossom","Blue","Boats","Bold","Bright","Bubble","Buddha","Bugs","Bull","Butterfly","Cancer","Capricorn","Caricature","Cartoon","Cartoons","Cat","Celebrity","Celestial","Celtic","Cherry","Chest","Chinese","Christian","Classic","Clover","Coffin","Color","Comics","Couples","Cover Up","Creatures","Cross","Culture","Dagger","Dc","Death","Demon","Design","Detail","Devil","Disney","Dog","Dolphin","Dotwork","Dove","Dragon","Dragonfly","Dream Catcher","Eagles","Ear","Egyptian","Eye","Face","Fairy","Fantasy","Feather","Fine Line","Fire","Flag","Flash","Flower","Foot","Forearm","Full Back","Full Leg","Gambling","Geisha","Gemini","Geometric","Gore","Graffiti","Graphic","Gray","Green","Gun","Gypsy","Haida","Half Sleeve","Hand","Hands","Hawk","Head","Heart","Hello Kitty","Hip","Hip Hop","Horror","Horse","Icon","Indian","Infinity","Insect","Irish","Jagged Edge","Japanese","Jesus","Joker","Kanji","Knife","Knots","Koi","Leg","Leo","Lettering","Libra","Lion","Lip","Lizard","Looney Toon","Love","Lower Back","Lyric","Macabre","Maori","Marvel","Mashup","Memorial","Mermaid","Mexican","Military","Minimalist","Moari","Money","Monkey","Monsters","Moon","Mummy","Music","Name","Native American","Nature","Nautical","Neck","New School","Numbers","Old School","Orange","Oriental","Other","Owl","Ox","Paint","Panther","Passage","Patriotic","Pattern","Peace","Peacock","People","Phoenix","Photograph","Photoshop","Piercing","Pig","Pinup","Pirate","Pisces","Polynesian","Portrait","Purple","Quote","Rabbit","Realistic","Red","Refined","Religion","Religious","Ribcage","Ring","Roman Numerals","Rooster","Rose","Sagittarius","Saint","Samoan","Samurai","Scorpio","Scorpion","Script","Sea","Sexy","Sheep","Shoulder","Side","Simple","Skull","Sleeve","Snake","Snakes","Space","Sparrow","Spider","Spirals","Spiritual","Sports","Star","Statue","Stomach","Sun","Surreal","Swallow","Symbols","Tahitian","Taurus","Tiger","Traditional","Transformers","Trash Polka","Tree","Tribal","Trinity Knot","Trinket","Unicorn","Upper Back","Viking","Virgo","Warrior","Water Color","Wave","Western","White Ink","Wings","Wizard","Wolf","Women","Wrist","Yellow","Zodiac","Zombie"];
        }        
        this.booktt = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('books'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local:  $.map(books, function(book) { return { books: book }; })
        });
        this.booktt.initialize();
    },
    events: {
        "click [href^='/']":    "links"
    },
    links: function(e){
        if(e) { e.preventDefault(); };
        if(typeof(e.currentTarget.attributes.href.value) !== undefined){
            Parse.history.navigate(e.currentTarget.attributes.href.value, {trigger: true});
        }
    },
    initScrollToTop: function(){
        App.on('app:scroll', function () {
            if ($(window).scrollTop() > 1000) {
                $('#back-to-top').stop().fadeIn();
            } else {
                $('#back-to-top').stop().fadeOut();
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
    },
    initAlertWindow: function(){
        $.growl(false, {
            element: 'body',
            type: "info",
            allow_dismiss: true,
            placement: {
                from: "bottom",
                align: "right"
            },
            offset: 20,
            spacing: 20,
            z_index: 5000,
            delay: 2500,
            timer: 1000,
            url_target: '_self',
            mouse_over: true,
            animate: {
                enter: 'liftIn',
                exit: 'liftOut'
            },
            icon_type: 'class',
            template: '<div data-growl="container" class="alert" role="alert"><button type="button" class="close" data-growl="dismiss"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button><span data-growl="icon"></span><span data-growl="title"></span><span data-growl="message"></span><a href="#" data-growl="url"></a></div>'
        });
    },
    mapStyles: [{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-100},{"lightness":20}]},{"featureType":"road","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-100},{"lightness":40}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-10},{"lightness":30}]},{"featureType": "water","elementType": "geometry.fill","stylers": [{ "color": "#d9d9d9" }]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"visibility":"simplified"},{"saturation":-60},{"lightness":10}]},{"featureType":"landscape.natural","elementType":"all","stylers":[{"visibility":"simplified"},{"saturation":-60},{"lightness":5}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]}]
}))({el: document.body});

App.geocoder = (function Geocoder() {
    var _location = {
        location: null,
        position: {
            lat: null,
            lng: null
        },
        address: null
    };

    // W3C HTML5 recommends using navigator.geolocation     ///c
    // Relies on user granting sites access to location info, can be override in browser settings.  ///c
    function getLocation(defer) {
        var deferred = defer || $.Deferred();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                _location = {
                    location: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                    position: {
                        lat: position.coords.latitude, 
                        lng: position.coords.longitude
                    }
                };
                getAddress(defer);
            }, function (error) {
                console.log('Error querying current position'); ///c
                deferred.reject();
            });
        } else {
            console.log('Error accessing geolocation'); ///c
            deferred.reject();
        }
        return deferred.promise();
    }

    function getAddress(defer) {
        var deferred = defer || $.Deferred();
        new google.maps.Geocoder().geocode({'latLng': _location.location }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                    _location.address = results[1].formatted_address;
                    console.log(_location.address); ///c
                    console.log(_location); ///c
                    deferred.resolve();
                }
            } else {
                console.log("Error with reverse geocode : " + status);  ///c
                deferred.reject();
            }
        });
        return deferred.promise();
    }

    function userLocation () {
        return _location;
    }

    return {
        getLocation: getLocation,
        userLocation: userLocation
    };
})();

///////// Models    ///c
App.Models.User = Parse.User.extend({
    className: "User"
});

App.Models.Session = Parse.Object.extend({
    className: 'Session',
    defaults: {
        logged_in: false
    },
    initialize: function () {
        console.log('session init : ' + arguments.callee.identity); ///c
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
        } else {
            this.set('logged_in', false);
        }
    },
    login: function (user, pass, cb) {
        var that = this;
        Parse.User.logIn(user, pass, cb)
            .always(function () {
                that.checkAuth();
            });
    },
    loginFb: function (cb) {
        var that = this;
        Parse.FacebookUtils.logIn(null, cb)
            .always(function () {
                that.checkAuth();
            }); 
    },
    logout: function () {
        console.log('session logout : ' + arguments.callee.identity);   ///c
        var that = this;
        $.when(Parse.User.logOut())
            .then(function () {
                that.checkAuth();
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
        collectorCount:0,
        books: []
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
                $.growl({
                    message: "Added to favorites",
                    icon: add.attributes.tattoo.attributes.fileThumbSmall.url(),
                    url: '/myprofile'
                }, {
                    icon_type: 'img'
                });
            }, function(error){
                if(error.message === JSON.stringify('Tattoo already added')) {
                    that.trigger('add:created', add);
                }
                console.log(error); ///c
            });
        }
    },
    removeAdd: function(add){
        var that = this;
        add.destroy().then(function(add) {
            that.trigger('add:removed', add);
            $.growl({
                message: "Removed from favorites",
                icon: add.attributes.tattoo.attributes.fileThumbSmall.url(),
                url: '/myprofile'
            }, {
                icon_type: 'img'
            });
        }, function(error) {
            console.log(error); ///c
        });
    },
    deleteTattoo: function(){
        return this.destroy();
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
    defaults: function() {
      return {
        books:[]
      };
    }
});

App.Models.Book = Parse.Object.extend({
    className: "Book"
});

App.Models.FeaturedArtist = Parse.User.extend({
    className: "User"
});

App.Models.GlobalBook = Parse.Object.extend({
    className: "GlobalBook"
});

///////// Collections   ///c
App.Collections.Artists = Parse.Collection.extend({
    initialize: function(){
        this.page = 0;
    },
    model: App.Models.User
});

App.Collections.Tattoos = Parse.Collection.extend({
    initialize: function(){
        this.page = 0;
    },
    model: App.Models.Tattoo,
    getBooksByCount: function(count){
        this.booksByCount = _.flatten(this.pluck('books')).byCount();
        console.log('got books: ' + this.booksByCount);   ///c
        return this.booksByCount.slice(0, count || 10);
    },
    getArtistBooksByCount: function(count){
        this.artistBooksByCount = _.flatten(this.pluck('artistBooks')).byCount();
        console.log('got artist books: ' + this.artistBooksByCount);   ///c
        return this.artistBooksByCount.slice(0, count || 10);
    },
    byBooks: function(books){
        //Takes an array of books, returns the tattoos where the books are inlcuded.    ///c
        return this.filter(function(tat){ 
            return _.intersection(tat.attributes.books, books).length >= books.length; });
    }
});

App.Collections.Adds = Parse.Collection.extend({
    model: App.Models.Add,
    getAddBooksByCount: function(count){
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

App.Collections.Books = Parse.Collection.extend({
    model: App.Models.Book
});

App.Collections.FeaturedArtists = Parse.Collection.extend({
    model: App.Models.User,
    page: 0
});

App.Collections.GlobalBooks = Parse.Collection.extend({
    model: App.Models.GlobalBook,
    comparator: function(book){
        return -book.get("count");
    },
    resetActive: function () {
        // Only reset models that are active,   ///c
        // attempt to minimise the number of events handlers being unnecessarily initiated  ///c
        this.forEach(function (model) {
        	if (model.get('active') === true) {
				model.set('active', false);
        	}
        });
    },
	getActiveBooks: function(){
	    return this.filter(function(globalBook) {
	        return globalBook.get("active") === true;
	    });
	},
	// Accepts array of books name filters e.g. partial search strings ///c
	// Returns array of global books models    ///c
    filterByNames: function (names) {
		return this.filter(function (model) {
			return _.some(names, function (name) {
				return model.get('name').toLowerCase().indexOf(name.toLowerCase()) != -1;
			});
		});
	},
    // Accepts array of book names  ///c
    // Return an array of global book models    ///c
    findByNames: function (names) {
		return this.filter(function (model) {
			return _.some(names, function (name) {
				return model.get('name').toLowerCase() === name.toLowerCase();
			});
		});
    }
});

///////// Views ///c
App.Views.Nav = Parse.View.extend({
    el: '#navs',
    initialize: function() {
        that = this;
        that.render();
        App.session.on('change:logged_in', function (model, value) {
            that.render();
        });
    },
    template: _.template($("#navTemplate").html()),
    events: {
        "click #logOutButton": "logOut",
        "click #logInButton": "logIn",
        "click #searchButton": "search",
        "click #uploadButton": "upload",
    },
    logIn: function(){
        console.log('login triggered from nav view'); ///c
        App.trigger('app:login');
    },
    logOut: function () {
        App.session.logout();
        var current = Parse.history.getFragment();
        if ( current.substr(0, 9) == "myprofile" ) {
            Parse.history.navigate('', {trigger: true});
        } else {
            Parse.history.navigate(current, {trigger: true});
        }
    },
    search: function(){
        console.log('search triggered from nav view'); ///c
        App.trigger('app:search');
    },
    upload: function(){
        console.log('upload triggered from nav view'); ///c
        // navigate first so currentView is myprofile and App.router.hitRoutes is not stored    ///c
        Parse.history.navigate('myprofile', {trigger: true});
        App.trigger('app:upload');
    },
    render: function () {
        $('#navs').html(this.template());
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

App.Views.Search = Backbone.Modal.extend({
    id: 'search',
    initialize: function(){
        console.log('search init'); ///c
        this.searchTimer;

        _.bindAll(this, 'focusIn', 'keypressSearchTimer', 'initSearchTimer', 'searchAll', 'resetAll', 'showReset', 'clearSearch');
        App.on('app:keypress', this.focusIn);
    },
    disable: function () {
        console.log('search disabled'); ///c
        App.off('app:keypress', this.focusIn);
    },
    template: _.template($("#searchTemplate").html()),
    cancelEl: '.x',
    events: {
        'keyup': 'keypressSearchTimer',
        'click .artistBookSearch': 'artistBookSearch',
        'click .reset': 'clearSearch'
    },
    keypressSearchTimer: function(e){
        if ( e.which === 13 ) {
            this.searchAll();
        } else {
            this.initSearchTimer(this);
        }
    },
    initSearchTimer: _.debounce(function(){ this.searchAll(); }, 1000),
    searchAll: function(){
        var that = this;
        
        var newQuery = this.$('.mainSearchInput').val().trim();
        if (this.query === newQuery) {
            return;
        }
        this.query = newQuery;
        
        if (this.query.length === 0) {
            this.resetAll();
        } else {
            var elements = this.$('.resultsMessage, .bookResultsContainer, .artistResultsContainer, .userResultsContainer');
            var length = elements.length;
            elements.fadeOut(800, function () {
            	if (--length > 0) { return; }
                that.resetAll();
                that.searchBooks();
                that.searchArtists();
                that.searchUsers();
                that.showReset();
            });
        }
    },
    resetAll: function () {
        this.resetShown = false;
        this.noResultsFor = [];
        this.$('.reset span, .bookResults, .artistResults, .userResults').html('');
        this.$('.reset, .bookResultsContainer, .artistResultsContainer, .userResultsContainer').fadeOut();
    },
    searchBooks: function(){
        var that = this;
        var bookResults = App.Collections.globalBooks.filterByNames([this.query]);
        console.log('book search results: '+bookResults);   ///c
        if (bookResults.length) {
            this.$('.bookResults').html('');
            _.each( _.uniq(bookResults), function(book){
                var bookModel = new App.Models.GlobalBook(book);
                var bookResult = new App.Views.BookSearchResult({model: bookModel});
                that.$('.bookResults').append(bookResult.render().el);
            });
            this.$('.bookResultsContainer').fadeIn();
        } else {
            this.$('.bookResultsContainer').fadeOut();
            this.noResultsFor.push('Tattoo Stlye or Theme');
            that.showReset();
        }
    },
    searchArtists: function(){
        var that = this;
        App.query.searchArtists(this.query)
            .then(function (artists) {
                this.$('.artistResults').html('');
                if (artists.length) {
                    _.each( _.uniq(artists), function(artist){
                        var artistResult = new App.Views.ArtistSearchResult({model: artist});
                        that.$('.artistResults').append(artistResult.render().el);
                    });
                    that.$('.artistResultsContainer').fadeIn();
                } else {
                    that.$('.artistResultsContainer').fadeOut();
                    that.noResultsFor.push('Artists');
                    that.showReset();
                }
            },
            function (error) {
                console.log("Error: " + error.code + " " + error.message);  ///c
                that.$('.artistResultsContainer').fadeOut();
            });
    },
    searchUsers: function(){
        var that = this;
        App.query.searchUsers(this.query)
            .then(function (users) {
                this.$('.userResults').html('');
                if (users.length) {
                    _.each( _.uniq(users), function(user){
                        var userResult = new App.Views.UserSearchResult({model: user});
                        that.$('.userResults').append(userResult.render().el);
                    });
                    that.$('.userResultsContainer').fadeIn();
                } else {
                    that.$('.userResultsContainer').fadeOut();
                    that.noResultsFor.push('Enthusiasts');
                    that.showReset();
                }
            },
            function (error) {
                console.log("Error: " + error.code + " " + error.message);  ///c
                that.$('.userResultsContainer').fadeOut();
            });
    },
    showReset: function(){
        if (this.noResultsFor.length === 3) {
            var noResultsMessage = 'No ' + this.noResultsFor[0] + ', ' + this.noResultsFor[1] + ' or ' + this.noResultsFor[2] + ' found.';
        } else if (this.noResultsFor.length === 2) {
            var noResultsMessage = 'No ' + this.noResultsFor[0] + ' or ' + this.noResultsFor[1] + ' found.';
        } else if (this.noResultsFor.length === 1){
            var noResultsMessage = 'No ' + this.noResultsFor + ' found.';
        }
        this.$('.reset span').html(noResultsMessage);

        if (!this.resetShown) {
            this.$('.reset').fadeIn();
            this.resetShown = true;
        }
    },
    clearSearch: function(){
        this.resetAll();
        this.$('.mainSearchInput').val('').focus();
        this.$('.resultsMessage').fadeIn();
    },
    artistBookSearch: function(){
        // navigate instead of App.trigger so App.router.hitRoutes is stored ///c
        Parse.history.navigate('artists', {trigger: true});
    },
    focusIn: function(){
        this.$('input.mainSearchInput').focus();
    },
    onRender: function(){
        this.focusIn();
    },
    cancel: function(){
        App.trigger('app:modal-close');
    }
});

App.Views.BookSearchResult = Parse.View.extend({
    template: _.template('<span><%= name %></span>'),
    className: 'btn-tag bookSuggestion',
    initialize: function(){
        _.bindAll(this, 'viewTattoos', 'render');
    },
    disable: function () {

    },
    events: {
        'click': 'viewTattoos'
    },
    viewTattoos: function(){
        console.log('viewTattoos triggered');   ///c
        // navigate instead of App.trigger so App.router.hitRoutes is stored ///c
        Parse.history.navigate('tattoos' + '/' + this.model.get('name'), {trigger: true});
    },
    render: function(){
        var attributes = this.model.toJSON();
        $(this.el).append(this.template(attributes));

        //Get's a random image from the array and assigns it to the bg url  ///c
        var picCount = this.model.attributes.pics.length;
        var randomPicIndex = Math.floor(Math.random() * picCount);
        $(this.el).attr('style',"background-image: url("+this.model.attributes.pics[randomPicIndex]._url+");");
        return this;
    }
});

App.Views.UserSearchResult = Parse.View.extend({
    template: _.template($("#userResultTemplate").html()),
    // view user event triggered by app link router handler
    render: function () {
        var that = this;
        var attributes = this.model.toJSON();
        $(this.el).append(this.template(attributes));
        return this;
    }
});

App.Views.ArtistSearchResult = Parse.View.extend({
    template: _.template($("#artistResultTemplate").html()),
    // view user event triggered by app link router handler
    render: function () {
        var that = this;
        var attributes = this.model.toJSON();
        $(this.el).append(this.template(attributes));
        return this;
    }
});

App.Views.Explore = Parse.View.extend({
    template: _.template($("#exploreTemplate").html()),
    id: 'explore',
    initialize: function(){
        _.bindAll(this, 'render', 'renderBookThumbnails');
        this.moreToLoad = true;
    },
    events: {
        "click #findArtists":   "findArtists"
    },
    findArtists: function(){
        // navigate instead of App.trigger so App.router.hitRoutes is stored ///c
        // TODO ~ add ?showmap=true to the router once router options can accept
        Parse.history.navigate('artists', {trigger: true});
    },
    render: function(){
        var that = this;
        var templateRendered = $(this.el).html(this.template()).promise();
        $.when(templateRendered, App.Promises.globalBooks.promise())
            .done(that.renderBookThumbnails);
        return this;
    },
    renderBookThumbnails: function(){
        //TODO Start at a random point from the start of popular    ///c
        var that = this;
        this.collection = App.Collections.globalBooks.first(7);
        _.each(this.collection, function(book){
            var bookThubmnail = new App.Views.ExploreBookThumbnail({model: book});
            that.$('.explorePopularBooks').append(bookThubmnail.render().el);
        });
        this.$('.popularBook:first, .popularBook:last').removeClass('col-sm-4').addClass('col-sm-8');
    }
});

App.Views.ExploreBookThumbnail = Parse.View.extend({
    template: _.template('<h2><%= name %></h2><img src="" class="popularBookImage">'),
    className: 'col-xs-12 col-sm-4 popularBook',
    initialize: function(){
        _.bindAll(this, 'viewTattoos', 'render');
    },
    disable: function () {

    },
    events: {
        'click': 'viewTattoos'
    },
    viewTattoos: function(){
        // navigate instead of App.trigger so App.router.hitRoutes is stored ///c
        Parse.history.navigate('tattoos' + '/' + this.model.get('name'), {trigger: true});
    },
    render: function(){
        var attributes = this.model.toJSON();
        $(this.el).append(this.template(attributes));

        //Get's a random image from the array and sets it as the url    ///c
        var picCount = this.model.attributes.pics.length;
        var randomPicIndex = Math.floor(Math.random() * picCount);
        this.$('.popularBookImage').attr('src',this.model.attributes.pics[randomPicIndex]._url);
        return this;
    }
});

App.Views.BookFilter = Parse.View.extend({
    template: _.template($("#bookFilterTemplate").html()),
    el: '.bookFilterHeader',
    initialize: function (options){
        console.log('Book filter init');    ///c
        _.bindAll(this, 'disable', 'typeaheadInitialize', 'keypressFilterTimer', 'initSearchTimer', 'filterBooks', 'showBookFilter', 'hideBookFilter', 'focus', 'updateBookFilter', 'activateBookFilter', 'disableBookFilter', 'scrollerInitialize', 'render');
        this.bookFilterShown = false;
        this.query = [];

        this.collection = App.Collections.globalBooks;
        // Need to reset active otherwise can't re-select previous book once re-initialized ///c
        this.collection.resetActive();  
        this.collection.on('change:active', this.updateBookFilter, this);
        
        this.initialized = true;
	},
	disable: function () {
		if (this.initialized) {
			console.log('filter header disabled');   ///c
			if (this.globalBookManagerView) { this.globalBookManagerView.disable(); }
			if (this.activeBookFilterManagerView) { this.activeBookFilterManagerView.disable(); }

			this.collection.off('change:active', this.updateBookFilter);

			this.initialized = false;
		}
	},
    focus: function(){
        if (this.bookFilterShown) {
            this.$('input.bookFilterInput').focus();
        } else if (!this.bookFilterShown){
            this.showBookFilter();
            this.$('input.bookFilterInput').focus();
        }
    },
    updateBookFilter: function (book){
        console.log('updateBookFilter called from the bookFilter view');    ///c
        console.log(book);  ///c
        if (book.get('active') === true) {
            this.activateBookFilter(book);
        } else if (book.get('active') === false){
            this.disableBookFilter(book);
        }
    },
    activateBookFilter: function(book){
        this.$('.tattoosTitle').html('');
        var that = this;
        var bookName = book.get('name');
        var addUniqueBook = function(book) {
            console.log('Add book to query and trigger update from activateBookFilter in the bookFilter view'); ///c
            that.query.push(bookName);
            App.trigger('books:book-update', that.query);
        }
        var limit = 4;
        //Prevents duplicate books from being added ///c
        if($.inArray(bookName, this.query) > -1) {
            this.$( "span.filterTitle:contains("+bookName+")" ).animate({
                opacity: 0
            }, 200).delay(400).animate({
                opacity: 1
            }, 600);
        } else {
            console.log('Adding UNIQUE BOOK from activeBookFilter of the book filter view');    ///c
            addUniqueBook(book);
        }
    },
    disableBookFilter: function(book){
        this.query = _.without(this.query, book.get('name'));
        App.trigger('books:book-update', this.query);
        if(this.activeBookFilterManagerView.collection.getActiveBooks().length === 0){
            this.$('.tattoosTitle').html(this.options.title);
        }
    },
    scrollerInitialize: function(){
        this.$('.bookSuggestionScroll').slick({
          lazyLoad: 'ondemand',
          infinite: false,
          slidesToShow: 5,
          slidesToScroll: 4,
          centerMode: false,
          variableWidth: true,
          speed: 750,
          nextArrow: this.$('.arrow.right'),
          prevArrow: this.$('.arrow.left'),
          responsive: [
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 4,
                slidesToScroll: 3,
              }
            },
            {
              breakpoint: 768,
              settings: {
                arrows: false,
                speed: 300,
                slidesToShow: 3,
                slidesToScroll: 2
              }
            }
          ]
        }).slickPrev();
    },
    typeaheadInitialize: function(){
        var that = this;
        var input = this.$('input.bookFilterInput');
        input.typeahead({
                highlight: false,
                minLength: 1
            },
            {
                name: 'books',
                displayKey: 'books',
                source: App.booktt.ttAdapter(),
                templates: {
                    // TODO ~ empty: '<span>No tattoos with that book.</span>',     ///c
                    // suggestion: _.template('<span class="bookSuggestion" style="white-space: normal;"><%= books %></span>')  ///c
                }
        }).attr('placeholder','Enter a style or theme.').on('typeahead:selected', function (obj,datum) {
            that.addQuery(datum.books);
            input.typeahead('val', '');
        }).on('focus', function () {
            that.$('.tt-input').attr('placeholder','');
        }).on('blur', function () {
            that.$('.tt-input').attr('placeholder','Enter a style or theme.');
        });
    },
    events: {
        'click .toggleBookFilter.inactive': 'showBookFilter',
        'click .toggleBookFilter.active': 'hideBookFilter',
        'keyup': 'keypressFilterTimer',
        'click .resetSearch': 'unfilterBooks'
    },
    keypressFilterTimer: function(e){
        if ( e.which === 13 ) {
            this.filterBooks();
        } else {
            this.initSearchTimer(this);
        }
    },
    initSearchTimer: _.debounce(function(){ this.filterBooks(); }, 250),
    filterBooks: function(e){
        var that = this;
        var query = that.$('input.bookFilterInput').val().toLowerCase();
        // var query = that.$('input.bookFilterInput.tt-input').val().toLowerCase(); // needs to specify .tt-input when typeahead is activated  //c 
        if (query.length > 0) {
            // Filters down the book suggestions that match the search fragment ///c
            this.$('.bookSuggestionScroll').slickFilter(function( index ) {
                var book = this.textContent.toLowerCase();    
                return book.indexOf(query) >= 0;
            });
            // Gets the length of the results   ///c
            var resultCount = this.$('.bookSuggestion:not(.slick-cloned)').length;
            // Determines if the results are plural or singular ///c
            if(resultCount !== 1){
                var s = 's'
            } else {
                var s = ''
            };
            this.$('.slick-track').prepend(_.template('<div class="btn-tag bookSuggestion resetSearch"><span>'+resultCount+' Result'+s+':</span><a>Restart search</a></div>'));
            // Unused full set of blank book suggestions    ///c
            // this.$('.slick-track').append(_.template('<div class="btn-tag bookSuggestion"></div>'+'<div class="btn-tag bookSuggestion"></div>'+'<div class="btn-tag bookSuggestion"></div>'+'<div class="btn-tag bookSuggestion"></div>'+'<div class="btn-tag bookSuggestion"></div>'));     ///c
        } else {
            this.unfilterBooks();
        }
    },
    unfilterBooks: function(){
        this.$('input.bookFilterInput').val('');
        this.$('.bookSuggestionScroll').slickUnfilter();
    },
    showBookFilter: function(){
        console.log('showBookFilter triggered');    ///c
        var that =this;
        that.$('.bookFilterContainer').slideDown(function () {
            that.$('.toggleBookFilter, .filterHeader, .bookFilterContainer').addClass('active');
            that.$('.toggleBookFilter, .filterHeader, .bookFilterContainer').removeClass('inactive');
            that.$('.toggleBookFilter').html('Hide Filters');
            that.bookFilterShown = true;
            that.trigger('book-filter:show', {});
        });
    },
    hideBookFilter: function(){
        var that = this;
        that.$('.bookFilterContainer').slideUp(function () {
            that.$('.toggleBookFilter, .filterHeader, .bookFilterContainer').removeClass('active');
            that.$('.toggleBookFilter, .filterHeader, .bookFilterContainer').addClass('inactive');    
            that.$('.toggleBookFilter').html('Show Filters');
            that.bookFilterShown = false;
            that.trigger('book-filter:hide', {});
        });
    },
    queryReset: function(){
        this.query = [];
        this.collection.resetActive();
        this.$('.filterTitle').remove();
        this.$('.tattoosTitle').html(this.options.title);
        return this;
    },
	render: function () {
		var that = this;
		var templateRendered = $(this.el).html(this.template()).promise();
        this.$('.tattoosTitle').html(this.options.title);
		$.when(templateRendered, App.Promises.globalBooks.promise())
			.done(function _renderChildViews() {
				that.activeBookFilterManagerView = new App.Views.ActiveBookFilterManager({ collection: that.collection, el: that.$('.filterTitles') });

				that.globalBookManagerView = new App.Views.GlobalBookManager({ collection: that.collection, el: that.$('.bookSuggestionScroll') });
				that.globalBookManagerView.showAll();

				that.scrollerInitialize();
			})
			.done(function _setInitialBooks() {

				if (that.options.books && that.options.books.length > 0) {
					var bookModels = that.collection.findByNames(that.options.books);
					if (bookModels) {
						for (var i = 0; i < bookModels.length; i++) {
							bookModels[i].set('active', true);
						}
					}	
				}
			});

		return this;
	}
});

App.Views.ActiveBookFilterManager = Parse.View.extend({
    el: '.filterTitles',
    initialize: function(){
        _.bindAll(this, 'disable', 'disableChildViews', 'renderBookTitle');
        this.childViews = [];
        this.collection.on('change:active', this.renderBookTitle, this);
        this.initialized = true;
    },
    disable: function() {
    	if (this.initialized) {
    		this.disableChildViews();
	        this.collection.off('change:active', this.renderBookTitle);
	        this.initialized = false;
	    }
    },
    disableChildViews: function () {
    	for (var i = 0; i < this.childViews.length; i++) {
            this.childViews[i].disable();
        }
        this.childViews = [];
    },
    renderBookTitle: function (book) {
        if (book.attributes.active === true) {
        	// Add the new view    ///c
            var bookTitle = new App.Views.ActiveBookFilter({model: book});
            this.$el.append(bookTitle.render().el);
            this.childViews.push(bookTitle);
        } else {
        	// Find the view to remove ///c
        	for (var i = 0; i < this.childViews.length; i++) {
	            if (book === this.childViews[i].model) {
	            	this.childViews[i].disable();
	            	this.childViews.splice(i, 1);
	            }
	        }
        }
    }
});

App.Views.ActiveBookFilter = Parse.View.extend({
    template: _.template('<%= name %>'),
    className: 'filterTitle',
    tagName: 'span',
    initialize: function () {
        _.bindAll(this, 'disable', 'removeBookTitle', 'render');
        this.model.on('change:active', this.removeBookTitle, this);
        this.initialized = true;
    },
    disable: function () {
    	if (this.initialized) {
        	this.model.off('change:active', this.removeBookTitle);
        	this.initialized = false;
        }
    },
    events: {
        'click': 'removeBookTitle',
    },
    removeBookTitle: function () {
        this.disable();
        this.model.set('active', false);
        this.remove();
    },
    render: function () {
        var attributes = this.model.toJSON();
        $(this.el).append(this.template(attributes));
        return this;
    }
});

App.Views.GlobalBookManager = Parse.View.extend({
    el: '.bookSuggestionScroll',
    initialize: function(){
        console.log('GlobalBookManager collection length is '+ this.collection.length); ///c

        _.bindAll(this, 'disable', 'disableChildViews', 'showAll', 'showOne');
        this.childViews = [];
        this.initialized = true;
    },
    disable: function(){
    	if (this.initialized) {
    		this.disableChildViews();
    		this.initialized = false;
    	}
    },
    disableChildViews: function () {
    	for (var i = 0; i < this.childViews.length; i++) {
            this.childViews[i].disable();
        }
        this.childViews = [];
    },
    showAll: function(){
        this.disableChildViews();
        this.collection.each(function(book){
            this.showOne(book);
        }, this);
    },
    showOne: function(book){
        var book = new App.Views.GlobalBookThumbnail({model: book});
        this.$el.append(book.render().el);
        this.childViews.push(book);
    }
});

App.Views.GlobalBookThumbnail = Parse.View.extend({
    template: _.template('<span><%= name %></span>'+'<img data-lazy=""/>'),
    className: 'btn-tag bookSuggestion',
    initialize: function(){
        _.bindAll(this, 'disable', 'updateBookFilterClass', 'toggleBookFilter', 'render');
        this.model.on('change:active', this.updateBookFilterClass, this);
        this.initialized = true;
    },
    disable: function () {
    	if (this.initialized) {
    		this.model.off('change:active', this.updateBookFilterClass);
    		this.initialized = false;
    	}
    },
    events: {
        'click': 'toggleBookFilter',
    },
    updateBookFilterClass: function(){
        console.log(this.model);    ///c
        console.log('updateBookFilterClass triggered from the GlobalBookThumbnail View');   ///c
        if (this.model.get('active') === false) {
            this.$el.removeClass('active');
        } else if (this.model.get('active') === true){
            this.$el.addClass('active');
        }
    },
    toggleBookFilter: function(){
        console.log('toggleBookFilter triggered from the GlobalBookThumbnail View');    ///c
        console.log(this.model) ///c
        if (this.model.get('active') === true) {
            console.log('addBookFilter triggered from the GlobalBookThumbnail View');   ///c
            this.model.set('active', false);
        } else {
            console.log('removeBookFilter triggered from the GlobalBookThumbnail View');    ///c
            this.model.set('active', true);
        }
    },
    render: function(){
        var attributes = this.model.toJSON();
        $(this.el).append(this.template(attributes));

        //Get's a random image from the array and assigns it as the lazy image loader   ///c
        var picCount = this.model.attributes.pics.length;
        var randomPicIndex = Math.floor(Math.random() * picCount);
        this.$('img').attr('data-lazy', this.model.attributes.pics[randomPicIndex]._url);
        return this;
    }
});

App.Views.TattoosPage = Parse.View.extend({
    template: _.template($("#tattoosPageTemplate").html()),
    id: 'tattoosPage',
    initialize: function(options){
        console.log('tattoos page init = ' + JSON.stringify(options));  ///c
        _.bindAll(this, 'disable', 'focus', 'scrollChecker', 'render', 'bookUpdate', 'showReset', 'loadMore', 'updateURL');
        this.collection = new App.Collections.Tattoos();

        App.on('app:scroll', this.scrollChecker);
        App.on('books:book-update', this.bookUpdate);
        App.on('app:keypress', this.focus);

        this.initialized = true;
    },
    disable: function () {
    	if (this.initialized) {
			console.log('tattoos page disabled');    ///c
			if (this.bookFilterView) { this.bookFilterView.disable(); }

			App.off('app:scroll', this.scrollChecker);
			App.off('books:book-update', this.bookUpdate);
			App.off('app:keypress', this.focus);

			this.initialized = false;
		}
    },
    focus: function () {
    	if (this.bookFilterView) this.bookFilterView.focus();
    },
    scrollChecker: function(){
        if (this.moreToLoad && $('#tattoosPage').height()-$(window).height()*2 <= $(window).scrollTop()) {
            console.log('load more triggered from scroll checker'); ///c
            this.moreToLoad = false;
            this.collection.page++;
            this.loadMore(false);
        }
    },
    updateURL: function (books) {
    	var url = 'tattoos';
        if (this.bookFilterView && this.bookFilterView.query) {
        	var path = this.bookFilterView.query.join('+').split(" ").join("-");
        	if (path) {
        		url += '/' + path;
        	}
        } 
        if (Parse.history.fragment !== url) {
        	Parse.history.navigate(url, { trigger: false });	
        }
    },
    bookUpdate: function(){
        console.log('TattoosPage view called bookUpdate with this:');   ///c
        console.log(this);  ///c
        this.loadMore(true);
    },
    loadMore: function (reset) {
        var that = this;
        console.log('1*** Loadmore triggered with reset: ' + reset);   ///c
        if (reset) {
            this.collection.reset();
            this.collection.page = 0;
            this.moreToLoad = true;
            console.log('moreToLoad = ' + this.moreToLoad);   ///c
        }
        var options = {
            skip: this.collection.page * 40,
            limit: 40
        };
        var books = this.bookFilterView ? this.bookFilterView.query : [];
        console.log('2*** App.query.tattoos triggered with books: ' + books);   ///c
        App.query.tattoos(books, options)
            .then(function (tats) {
                console.log('3*** Adding tattoos to collection: ');   ///c
                console.log(that.collection);   ///c
                that.collection.add(tats);
                that.showReset();
                that.updateURL(books);
                
                if (tats.length < 40) {
                    that.moreToLoad = false;
                    console.log('moreToLoad = ' + that.moreToLoad);   ///c
                } else {
                    window.setTimeout( function(){
                        that.moreToLoad = true;
                        console.log('moreToLoad = ' + that.moreToLoad);   ///c
                    }, 500);
                }
            },
            function (error) {
                console.log(error);
                that.moreToLoad = true;
        });
    },
	showReset: function () {
		var that = this;
		if (this.collection.length === 0) {
			this.$('.reset')
				.html('<h5>No tattoos with those books.</h5><button class="btn-submit">Reset filters</button>')
				.fadeIn()
				.on('click', function () {
					that.bookFilterView.queryReset();
					that.hideReset();
				});
		} else {
			this.hideReset();
		}
	},
	hideReset: function () {
		if ($('.reset').length > 0) {
			$('.reset').fadeOut();
		}
	},
    render: function(){
        var that = this;
        var html = this.template();
        $(this.el).html(html).promise().done(function () {
			var options = that.options;
			options.el = that.$('.bookFilterHeader');
			options.title = 'Tattoos';
			that.bookFilterView = new App.Views.BookFilter(options);
            that.bookFilterView.render();

            that.tattoosView = new App.Views.Tattoos({ el: that.$('.tattoos'), collection: that.collection });
            that.tattoosView.render();

            that.loadMore(true);
        });
        return this;
    }
});

App.Views.Paginator = Parse.View.extend({
    el: '#paginator',
    events: {
        'click .page-select': 'selectPage',
        'click .page-prev': 'prevPage',
        'click .page-next': 'nextPage'
    },
    /*                                                          ///c
        Options:                                                ///c
            pageIndex:      current page index                  ///c
            pageCount:      number of pages to display          ///c
            pageResult:     results per page                    ///c
            pageMax:        max pages (based on result count)   ///c
    */                                                          ///c
    initialize: function (options) {
        this.options = options;
        this.pageIndex = options.pageIndex || 0;
        this.pageCount = options.pageCount || 10;
        this.pageResults = options.pageResults || 10;
        this.pageMax = options.pageMax || 0;
        this.render();
    },
    reset: function (options) {
        this.initialize(options || this.options);
    },
    setMaxPages: function (query) {
        var that = this;
        query.then(function (count) {
            that.pageMax = (count / that.pageResults);
            that.render();
        },
        function (error) {
            if (error.code === 124) {
                // Error code 124 is documented as timeout,     ///c
                // timeout occur with results over 1000 ///c
                // so we'll set max pages to 100 (100 * 10 = 1000)  ///c
                that.pageMax = 100;
            } else {
                // Any other error,     ///c
                // and there's probably nothing to display  ///c
                that.pageMax = 0;
            }
            that.render();
        });
    },
    triggerPageEvent: function () {
        this.trigger('paginator:paged', this.pageIndex);
    },
    prevPage: function (e) {
        e.preventDefault();
        if (this.pageIndex > 0) {
            this.pageIndex--;
            this.triggerPageEvent();
            this.render();
        }
    },
    nextPage: function (e) {
        e.preventDefault();
        if (this.pageIndex < (this.pageMax - 1)) {
            this.pageIndex++;
            this.triggerPageEvent();
            this.render();
        }
    },
    selectPage: function (e) {
        e.preventDefault();
        var index = $(e.currentTarget).attr('data-page');
        if (this.pageIndex !== index) {
            this.pageIndex = +index;
            this.triggerPageEvent();
            this.render();
        }
    },
    render: function () {
        this.$el.empty();
        if (this.pageMax > 0) {
            this.$el.append(this.renderPaginator());
        }
        return this;
    },
    renderPaginator: function () {
        var startIndex = 0;
        if (this.pageIndex > (this.pageCount - 1)) {
            startIndex = (this.pageIndex - (this.pageCount - 1));
        }

        var endIndex = startIndex + this.pageCount;
        if (endIndex > this.pageMax) {
            endIndex = this.pageMax;
        }

        var paginator = $('<ul class="pagination"></ul>');
        paginator.append($('<li></li>')
                .append($('<a href="" class="page-prev"></a>')
                    .append('&laquo;')
                )
            );

        for (var i = startIndex; i < endIndex; i++) {
            var isActive = (i === this.pageIndex) ? 'active' : '';
            paginator.append($('<li class="' + isActive + '"></li>')
                .append($('<a href="" class="page-select" data-page="' + i + '"></a>')
                    .append(i+1)
                )
            );
        }
        
        paginator.append($('<li></li>')
                .append($('<a href="" class="page-next"></a>')
                    .append('&raquo;')
                )
            );

        return paginator;
    }
});

App.Views.ArtistsPage = Parse.View.extend({
	template: _.template($("#artistsTemplate").html()),
	id: 'artistsPage',
    events: {
        'click .toggleMap:not(.active)': 'showMap',
        'click .toggleMap.active':		'hideMap',
    },
	initialize: function (options) {
		console.log('artists page init with options: ' + JSON.stringify(options));    ///c
		_.bindAll(this, 'disable', 'scrollToTop', 'bookUpdate', 'locationUpdate', 'hideMap', 'showMap', 'showReset', 'render', 'updateURL');
		this.requestLimit = 10;

		this.collection = new App.Collections.Artists();
		this.collection.on('reset', this.scrollToTop, this);

		App.on('books:book-update', this.bookUpdate, this);
		App.on('artists:location-update', this.locationUpdate, this);
		App.on('app:keypress', this.focus, this);

		this.initialized = true;
	},
	disable: function () {
		if (this.initialized) {
			// Disable child views   ///c
			if (this.bookFilterView) { this.bookFilterView.disable(); }
			if (this.artistsView) { this.artistsView.disable(); }
			if (this.artistsMapView) { this.artistsMapView.disable(); }

			// Disable our own events    ///c
			this.collection.off('reset', this.scrollToTop);
			App.off('books:book-update', this.bookUpdate);
			App.off('artists:location-update', this.locationUpdate);
			App.off('app:keypress', this.focus);

			this.initialized = false;
		}
	},
	focus: function () {
		if (this.artistsMapView && this.artistsMapView.hasFocus()) {
			this.artistsMapView.focus();
		} else if (this.bookFilterView) {
			this.bookFilterView.focus();
		}
	},
	scrollToTop: function () {
		$('html, body').animate({
			scrollTop: 0
		}, 600);
	},
	activateAffix: function () {
        console.log('artists map affix activated'); ///c
		$('#map-container').affix({
			offset: { 
				top: $('.bookFilterHeader').outerHeight(true),
				bottom: $('#footer').innerHeight()
			}
		})
		.on('affix.bs.affix', function () {
			// Fixed map flickering when scroll down from top ~ http://stackoverflow.com/questions/15228224/twitter-bootstrap-affix-how-to-stick-to-bottom   ///c
			$(this).width();
		})
		.on('affix-bottom.bs.affix', function () {
			// Fixes map flickering when scroll back up from bottom ~ http://stackoverflow.com/questions/15228224/twitter-bootstrap-affix-how-to-stick-to-bottom ///c
			$(this).css('bottom', 'auto');
		});
	},
    deactivateAffix: function () {
        $(window).off('.affix');
        $("#map-container").removeClass("affix affix-top affix-bottom").removeData("bs.affix");
    },
    updateURL: function (books) {
    	var url = 'artists';
        if (this.bookFilterView && this.bookFilterView.query) {
        	var path = this.bookFilterView.query.join('+').split(" ").join("-");
        	if (path) {
        		url += '/' + path;
        	}
        } 
        if (Parse.history.fragment !== url) {
        	Parse.history.navigate(url, { trigger: false });	
        }
    },
	bookUpdate: function () {
		console.log('artists book update');   ///c
		this.loadArtists(true);
	},
	locationUpdate: function (location) {
        if (location) {
            this.locationQuery = new Parse.GeoPoint({ latitude: location.k, longitude: location.D });
        } else {
            this.locationQuery = null;
        }
		this.loadArtists(true);
	},
	showMap: function () {
		this.$('.artistsResultContainer, .mapContainer, .toggleMap').addClass('active');
		this.$('.artists').removeClass('lg8container');

		if (App.session.loggedIn() && App.profile.attributes.locationName){
			this.$('.byYou').html(App.profile.attributes.locationName.split(",").splice(0,1).join("")).fadeIn();
		}

		if (this.artistsMapView) {
			this.artistsMapView.initialize();
		} else {
			this.artistsMapView = new App.Views.ArtistsMapView({ collection: this.collection, el: this.$('#map-container') });
			this.artistsMapView.render();
		}
		this.activateAffix();
	},
	hideMap: function () {
		this.$('.artistsResultContainer, .mapContainer, .toggleMap').removeClass('active');
		this.$('.artists').addClass('lg8container');
		if (this.artistsMapView) {
			this.artistsMapView.disable();
		}
        this.deactivateAffix();
	},
	loadArtists: function (reset) {
		var that = this;
        that.collection.reset();
        that.moreToLoad = true;
        var location = that.locationQuery;
        var books = that.bookFilterView ? that.bookFilterView.query : [];

		if (reset && that.paginator) {
            that.paginator.reset();
            that.paginator.setMaxPages(App.query.artistsCount(location, books));
        }

		App.query.artists(location, books, {
				skip: that.paginator.pageIndex * that.requestLimit,
				limit: that.requestLimit
			})
			.then(function (artists) {
				that.collection.add(artists);
                that.showReset();
				that.updateURL(books);
				if (artists.length < that.requestLimit) {
					that.moreToLoad = false;
				} else {
                    window.setTimeout( function(){
                        that.moreToLoad = true;
                    }, 500);
				}
			},
			function (error) {
				console.log(error); ///c
				that.moreToLoad = true;
			})
			.then(function () {
				that.collection.trigger('finito');
			});
	},
    showReset: function () {
        var that = this;
        if (this.collection.length === 0) {
            this.$('.reset')
                .html('<h5>No artists with those books.</h5><button class="btn-submit">Reset filters</button>')
                .fadeIn()
                .on('click', function () {
                    that.bookFilterView.queryReset();
                    that.hideReset();
                });
        } else {
            this.hideReset();
        }
    },
    hideReset: function () {
        if ($('.reset').length > 0) {
            $('.reset').fadeOut();
        }
    },
	render: function () {
		var that = this;
		$(this.el).html(this.template()).promise().done(function () { 
			var options = that.options;
			options.el = that.$('.bookFilterHeader');
			options.title = 'Artists';
			that.bookFilterView = new App.Views.BookFilter(options);
			that.bookFilterView.render().$('.toggleBookFilter')
				.before('<button class="btn-tag toggleMap"> Map </button>');
            that.bookFilterView.on('book-filter:show book-filter:hide', function () {
                that.deactivateAffix();
                that.activateAffix();
            });

			that.artistsView = new App.Views.Artists({ collection: that.collection, el: that.$('.artists') });
			that.artistsView.render();

            that.paginator = new App.Views.Paginator({ el: that.$('#artists-paginator'), pageResults: that.requestLimit });
            that.paginator.render();
            that.paginator.on('paginator:paged', function (pageIndex) {
                that.loadArtists(false);
            });

			if (that.options.showMap) {
				that.showMap();
                _.debounce(function(){that.activateAffix();},1000);
			}
            that.loadArtists(true);
		});

		return this;
	}
});

App.Views.ArtistsMapView = Parse.View.extend({
	el: '#map-container',
	mapOptions: {
		radius: 0,
		zoom: 8,
		styles: App.mapStyles,
		zoom: 10,
		zoomControl: true,
		zoomControlOptions: {
			style: google.maps.ZoomControlStyle.LARGE,
			position: google.maps.ControlPosition.LEFT_CENTER
		},
		streetViewControl: false,
		mapTypeControl: false,
		panControl: false,
		scrollwheel: false
	},
	events: {
		'mouseenter': 'gotFocus',
		'mouseleave': 'lostFocus'
	},
	gotFocus: function () {
		this.setFocus(true);
	},
	lostFocus: function () {
		this.setFocus(false);
	},
	setFocus: function (focus) {
		this._hasFocus = focus;
	},
	hasFocus: function () {
		return this._hasFocus;
	},
	initialize: function () {
		var that = this;
		_.bindAll(this, 'disable', 'focus', 'initializeMap', 'setMapLocation', 'addUserMarker', 'addArtistMarker', 'render');

        $.when(that.getMapLocation(), that.initializeMap())
    		.done(function _initialize() {
    			// Load initial artists from existing collection ///c
                that.clearMap();
                that.collection.each(function (model) {
                    that.addArtistMarker(model);
                });

                // Add users marker, if available   ///c
    			that.addUserMarker();
    			
    			// Setup event listeners ///c
    			that.collection.on('add', that.addArtistMarker, that);
    			that.collection.on('reset', that.clearMap, that);
    			App.on('artists-list:artist-selected', that.setSelectedArtistMarker, that);
    			App.on('artists-map:artist-selected', that.setSelectedArtistMarker, that);

    			this.initialized = true;
    		});
	},
	disable: function () {
		if (this.initialized) { 
			this.collection.off('add', this.addArtistMarker);
			this.collection.off('reset', this.clearMap);
			App.off('artists-list:artist-selected', this.setSelectedArtistMarker);
			App.off('artists-map:artist-selected', this.setSelectedArtistMarker);
			this.initialized = false;
		}
	},
	focus: function () {
		if (this.input) this.input.focus();
	},
	initializeMap: function () {
		var deferred = $.Deferred();
		var that = this;
		that.markers = [];
		that.bounds = new google.maps.LatLngBounds();
		that.map = new google.maps.Map(that.$el[0], that.mapOptions);
		google.maps.event.addListenerOnce(that.map, 'idle', function () {
			// Construct location search input   ///c
			that.inputEl = $('<input type="text" class="form-control grayInput" id="changeAddressInput" placeholder="Enter your location">');
            that.myLocationEl = $('<button id="myLocation" class="btn-submit" title="' + that.usersLocationName + '"><i class="flaticon-cursor6"></i></button>')
                .on('click', function (e) {
                    e.preventDefault();
                    that.inputEl.val(that.usersLocationName);
                    that.setMapLocation(that.usersLocation);
                });
			that.cancelEl = $('<span class="input-group-addon btn-submit cancel grayInput" title="Clear location">X</span>')
				.on('click', function (e) {
					e.preventDefault();
					that.inputEl.val('');
					that.setMapLocation(null);
				});
			var divEl = $('<div class="input-group" id="mapLocation"></div>')
				.append(that.inputEl)
				.append(that.myLocationEl)
                .append(that.cancelEl);

			// Wire location input to map controls   ///c
			var locationInput = new google.maps.places.SearchBox((that.inputEl[0]));
			that.map.controls[google.maps.ControlPosition.TOP_LEFT].push(divEl[0]);

			// Listen to location changes, trigger map update on change  ///c
			google.maps.event.addListener(locationInput, 'places_changed', function () {
				var places = locationInput.getPlaces();
				if (places.length == 0) {
					return;
				}
				that.setMapLocation(places[0].geometry.location);
			});
			deferred.resolve();
		});
		return deferred.promise();
	},
	setMapLocation: function (location) {
		this.clearMap();
		this.mapLocation = location;
		App.trigger('artists:location-update', location);
	},
	getMapLocation: function () {
		var deferred = new $.Deferred();
		if (App.session.loggedIn() && App.profile.attributes.location) {
            // User logged in and has location defined, getting location from profile    ///c
			this.usersLocation = new google.maps.LatLng(App.profile.attributes.location.latitude, App.profile.attributes.location.longitude);
            this.usersLocationName = App.profile.attributes.locationName;
			deferred.resolve();
		} else {
            // User is either not logged in, or has not completed their profile ///c
            var that = this;
            App.geocoder.getLocation(deferred)
                .done(function () {
                    var usersLocation = App.geocoder.userLocation();
                    that.usersLocation = usersLocation.location;
                    that.usersLocationName = usersLocation.address;
                });
		}
		return deferred.promise();
	},
	addUserMarker: function () {
		if (this.usersLocation) {
			new google.maps.Marker({
				map: this.map,
				icon: 'img/mapmarker-user.png',
				title: 'You',
				position: this.usersLocation,
				zIndex: 1049
			});
		}
	},
	addArtistMarker: function (artist) {
		if (artist.attributes.location) {
			var artistLocation = new google.maps.LatLng(artist.attributes.location.latitude, artist.attributes.location.longitude);
			var label = artist.attributes.name;
			if (artist.attributes.shop) {
				label += ' @ ' + artist.attributes.shop;
			}
			if (artist.attributes.locationName) {
				label += '\n' + artist.attributes.locationName;
			}
			var marker = new google.maps.Marker({
				map: this.map,
				icon: 'img/mapmarker-artist.png',
				title: label,
				position: artistLocation,
				// Custom attribute added for event handlers    ///c
				artistId: artist.id
			});
			// Listen to events, trigger artist-selected event   ///c
			google.maps.event.addListener(marker, 'mouseover', function () {
				App.trigger('artists-map:artist-selected', marker.artistId);
			});
			this.markers.push(marker);
			this.bounds.extend(artistLocation);
		}
		this.map.fitBounds(this.bounds);
	},
	findMarkerByArtistId: function (artistId) {
		for (var i = 0; i < this.markers.length; i++) {
			if (this.markers[i].artistId === artistId) {
				return this.markers[i];
			}
		}
	},
	setSelectedArtistMarker: function (artistId) {
		// Clear previous selection   ///c
		if (this.selectedArtistMarker) {
			this.selectedArtistMarker.setIcon('img/mapmarker-artist.png');
		}
		// Set new selection  ///c
		var marker = this.findMarkerByArtistId(artistId);
		if (marker) {
			marker.setIcon('img/mapmarker-artist-active.png');
            marker.setZIndex(1050);
			this.selectedArtistMarker = marker;
		}
	},
	clearMap: function () {
		if (this.markers) {
			for (var i = 0, marker; marker = this.markers[i]; i++) {
				marker.setMap(null);
			}
		}
		this.markers = [];
		this.selectedArtistMarker = null;
		this.bounds = new google.maps.LatLngBounds();
	}
});

App.Views.Artists = Parse.View.extend({
	el: '.artists',
	initialize: function () {
		_.bindAll(this, 'disable', 'disableChildViews', 'resetArtists', 'render' ,'renderArtist', 'setMinHeight');
		this.childViews = [];
		this.collection.on('add', this.renderArtist, this);
		this.collection.on('reset', this.resetArtists, this);
		this.collection.on('finito', this.setMinHeight, this);
		this.initialized = true;
	},
	disable: function () {
		if (this.initialized) {
			this.disableChildViews();
			this.collection.off('add', this.renderArtist);
			this.collection.off('reset', this.resetArtists);
			this.collection.off('finito', this.setMinHeight);
			this.initialized = false;
		}
	},
	disableChildViews: function () {
		for (var i = 0; i < this.childViews.length; i++) {
		    this.childViews[i].disable();
		}
		this.childViews = [];
	},
	// Transition between result sets/pages by setting the min-height  to the current height of results.   ///c
	// Also resolves occassional map activating the bottom affix due to load sequencing    ///c
	setMinHeight: function () {
		this.$el.css('min-height', this.$el.height());
	},
	resetArtists: function () {
		this.disableChildViews();
		this.$el.empty();
	},
    render: function () {
        this.resetArtists();
        this.collection.forEach(this.renderArtist, this);
    },
	renderArtist: function (artist) {
		var artist = new App.Views.Artist({ model: artist });
		this.$el.append(artist.render().el);
		this.childViews.push(artist);
		return this;
	}
});

App.Views.Artist = Parse.View.extend({
	className: 'artist',
	template: _.template($("#artistTemplate").html()),
	events: {
		'click': 'viewProfile',
		'mouseover': 'activate'
	},
	initialize: function () {
		_.bindAll(this, 'disable', 'activate', 'highlight', 'scrollIntoView', 'viewProfile', 'render');
        App.on('artists-list:artist-selected', this.highlight);
		App.on('artists-map:artist-selected', this.highlight);
        App.on('artists-map:artist-selected', this.scrollIntoView);
        this.initialized = true;
	},
    disable: function () {
    	if (this.initialized) {
    		App.off('artists-list:artist-selected', this.highlight);
	        App.off('artists-map:artist-selected', this.highlight);
	        App.off('artists-map:artist-selected', this.scrollIntoView);
	        this.initialized = false;
    	}
    },
	activate: function () {
		App.trigger('artists-list:artist-selected', this.model.id);
	},
    highlight: function (artistId) {
        if ((this.model.id === artistId ) && (false === $(this.el).hasClass('active'))) {
            $(this.el).addClass('active');
        } else if (this.model.id !== artistId ) {
            $(this.el).removeClass('active');
        }
    },
    scrollIntoView: function (artistId) {
        if ((this.model.id === artistId ) && (false === $(this.el).hasClass('visible'))) {
            // Calculate scroll require to render artists within window ///c
            // ... maxScroll ensure we don't scroll to far when selecting the last artist on the page   ///c
            var scrollTo = ($(this.el).offset().top - 100);
            var maxScroll = ($(document).height() - ($(window).height() + $('#footer').height() + 100));
            if (scrollTo > maxScroll) {
                scrollTo = maxScroll;
            }

            // Animate to scroll to artists, stopping any previous animates first   ///c
            $('html, body')
                .stop()
                .animate({
                    scrollTop: scrollTo
                }, 1200);
            $(this.el).addClass('visible');
        } else {
            $(this.el).removeClass('visible');
        }
    },
	viewProfile: function () {
        // navigate instead of App.trigger so App.router.hitRoutes is stored ///c
        Parse.history.navigate(this.model.get('username'), {trigger: true});
	},
	render: function () {
		var that = this;
		var attributes = this.model.toJSON();
		$(this.el).append(this.template(attributes));
        var books = [];

	 	App.query.tattoosByProfile(this.model, books, { limit: 4 })
	 		.then(function (tats) {
	  			_.each(tats, function(tat) {
                    var tattooThumbnail = new App.Views.ArtistsTattooThumbnail({ model: tat });
                    that.$('.artistTattoos').append(tattooThumbnail.render().el);
	  			}, that);
				if (tats.length < 4) {
					_(4 - tats.length).times(function(){ 
						that.$('.artistTattoos').append(_.template('<a class="tattooContainer"><img src="img/empty-tattoo.png" class="tattooImg" style="border: 1px solid #d9d9d9;"></a>'));
					}, that);
	  			}
	  			if (tats.length === 0 ) {
		    		that.$('.artistTattoos').append('<span class="empty">No tattoos</span>')
		    		that.$('.tattooImg').css('border', 'none');
	  			}
	  		},
	  		function (error) {
	  			console.log(error);   ///c
	  		});
		return this;
	}
});

App.Views.ArtistsTattooThumbnail = Parse.View.extend({
    template: _.template('<a class="tattooContainer open"><img src=<%= fileThumb.url %> class="tattooImg" href="#"></a>'),
    initialize: function () {
        _.bindAll(this, 'disable', 'render');
        this.initialized = true;
    },
    disable: function () {
    },
    events: {
        'click': 'openTattoo',
    },
    openTattoo: function (e) {
        e.preventDefault();
        e.stopPropagation();
        App.trigger('app:tattoo-profile-id', this.model.id);
    },
    render: function () {
        var attributes = this.model.toJSON();
        $(this.el).append(this.template(attributes));
        return this;
    }
});

App.Views.Login = Backbone.Modal.extend({
    id: 'login',
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
                        Parse.history.navigate('join', {trigger: true});
                    });
                } else {
                    that.undelegateEvents();
                    that.triggerCancel();
                }
            },
            error: function (user, error) {
                console.log(error); ///c
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
                that.triggerCancel();
                that.undelegateEvents();
            },
            error: function (user, error) {
                console.log(error); ///c
                $(".loginForm .error").html("Invalid username or password. Please try again.").show();
                that.enableLogin(true);
            }
        });
    },
    enableLogin: function (enable) {
        $("#login .btn-submit").attr('disabled', !enable);
    },
    passwordForm: function(){
        // navigate instead of App.trigger so App.router.hitRoutes is stored ///c
        Parse.history.navigate('forgot', {trigger: true});
    },
    joinForm: function () {
        Parse.history.navigate('join', {trigger: true});
    },
    onRender: function(){
    },
    cancel: function(){
        App.trigger('app:modal-close');
    }
});

App.Views.ArtistProfile = Parse.View.extend({
    id: 'artistProfile',
    initialize: function() {
        this.activateAffix();

        if(Parse.User.current() && this.model.attributes.user.id === Parse.User.current().id){
            this.isMyProfile = true;
            this.routePrefix = 'myprofile';
        } else {
            this.isMyProfile = false;
            this.routePrefix = this.model.get('username');
        }
    },
    template: _.template($("#artistProfileTemplate").html()),
    events: {
        'click [href="#portfolioTab"]': 'portfolioTab',
        'click [href="#aboutTab"]':     'aboutTab',
        'click [href="#shopTab"]':      'shopTab',
        'click #uploadButton':  'upload'
    },
    portfolioTab: function (e) {
        if (e) { e.preventDefault(); }
        $('a[href="#portfolioTab"]').tab('show');
        this.scroll();
        Parse.history.navigate(this.routePrefix + '/portfolio', { trigger: false });
    },
    aboutTab: function (e) {
        if (e) { e.preventDefault(); }
        $('a[href="#aboutTab"]').tab('show');
        this.scroll();
        Parse.history.navigate(this.routePrefix + '/about', { trigger: false });
    },
    shopTab: function (e) {
        if (e) { e.preventDefault(); }
        $('a[href="#shopTab"]').tab('show');
        this.renderMap();
        this.scroll();
        Parse.history.navigate(this.routePrefix + '/shop', { trigger: false });
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
            icon: 'img/mapmarker-user.png'
        });
    }, 500),
    centerMap: function() {
        var center = this.map.getCenter();
        google.maps.event.trigger(this.map, "resize");
        this.map.setCenter(center); 
    },
    getTattoos: function() {
        var that = this;
        console.log('getTattoos triggered');    ///c
        console.log(this.model);    ///c
        var options = {
            order: 'createdAt'
        };
        App.query.tattoosByProfile(this.model, [], options)
            .then(function (tats) {
                var tattoosCollection = new App.Collections.Tattoos(tats);
                var tattoosView = new App.Views.Tattoos({collection: tattoosCollection});
                tattoosView.render().getAndRenderBooks();
            },
            function (error) {
                console.log(error); ///c
            });
    },
    getMyTattoos: function(){
        console.log('getMyTattoos triggered');  ///c
        console.log(App.profile);   ///c
        var options = {
            order: 'createdAt'
        };
        App.query.tattoosByProfile(App.profile, [], options)
            .then(function(tats) {
                App.myTattoos = new App.Collections.Tattoos(tats);
                var portfolio = new App.Views.Tattoos({collection: App.myTattoos, myTattoos: true});
                portfolio.render().getAndRenderBooks();
            },
            function (error) {
                console.log(error); ///c
            });
    },
    renderMyProfile: function(){
        this.$('.profButtons').before(_.template('<button href="/myprofile/settings" class="btn-submit"><i class="flaticon-settings13"></i>Edit Profile</button><button class="btn-submit" id="uploadButton"><i class="flaticon-camera4"></i>Upload Tattoo</button>'));
    },
    upload: function(){
        // navigate to myprofile first so currentView is myprofile and App.router.hitRoutes is not stored ///c
        Parse.history.navigate('myprofile', {trigger: true});
        App.trigger('app:upload');
    },
    render: function(){
        var attributes = this.model.attributes;
        this.$el.html(this.template(attributes));
        if(this.isMyProfile){
            this.renderMyProfile();
            this.getMyTattoos();
        } else {
            this.getTattoos();
        }
        return this;
    }
});

App.Views.TattooProfile = Backbone.Modal.extend({
    id: 'tattooProfile',
    initialize: function(){
        console.log('tattoo profile init'); ///c
        this.model.on('add:created', this.showRemoveButton, this);
        this.model.on('add:removed', this.showAddButton, this);
    },
    disable: function () {
        console.log('tattoo profile disable');  ///c
        this.model.off();
    },
    template: _.template($("#tattooProfileTemplate").html()),
    viewContainer: '.container',
    cancelEl: '.x',
    events: {
        'click .artistName':   'triggerCancel',
        'click .add':           'createAdd',
        'click .removeAdd':      'removeAdd',
        'click .artistBook':    'searchTattoos'
    },
    onRender: function(){
        //checks if the user has added the tattoo   ///c
        if ($.inArray(this.model.id, App.Collections.adds.pluck('tattooId')) > -1) {
            this.showRemoveButton(App.Collections.adds.getTattoo(this.model.id)[0]);
        }

        //checks if the artist was included and fetches the artist if not   ///c
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
                console.log(error); ///c
              }
            });
        }

        this.renderArtistsBooks();
    },
    renderArtistsBooks: function(){
        if (this.model.attributes.artistBooks.length) {
            _.each(this.model.attributes.artistBooks, function(book) {
                this.$('.info .artistBooks').append(_.template('<button type="button" class="btn-link artistBook">'+ book +'</button>'));
            }, this);
            this.$('.info').fadeIn( 1000 );
            window.setTimeout(function(){
                var addTipTitle =  "Search for more";
                $('.artistBook').tooltip({
                    title: addTipTitle,
                    delay: { show: 200, hide: 200 },
                    placement: 'auto'
                });
            },0);
        }
        return this;
    },
    searchTattoos: function(e){
        // navigate instead of App.trigger so App.router.hitRoutes is stored ///c
        Parse.history.navigate('tattoos/' + e.currentTarget.textContent, {trigger: true});
    },
    setArtist: function(artist) {
        if(artist.profThumb !== undefined){this.$(".prof")[0].src = artist.profThumb.url};
        this.$(".artistName").html(artist.name + ' / ' +'<span>' + artist.username + '</span>').attr('href',"/" + artist.username);
        this.$(".name").html(artist.name)
        this.$(".artistLoc").html(artist.shop + ' / ' + artist.locationName);
        this.$(".infoBox").delay( 500 ).fadeIn();
    },
    createAdd: function(startupBooks){
        this.$('.add').attr('disabled', 'disabled');

        if (!Parse.User.current()) {
            App.trigger('app:login');
            $(".loginForm .error").html("You need to be logged in to favorite tattoos.").show();
        } else {
            this.model.createAdd(startupBooks);
        }
    },
    removeAdd: function(){
        this.$('.removeAdd').attr('disabled', 'disabled');
        this.model.removeAdd(this.add);
    },
    showRemoveButton: function(add){
        this.add = add;
        this.$('.add').removeClass('add').addClass('removeAdd').html('<span class="flaticon-bookmark50"></span>Remove from favorites').removeAttr("disabled");
    },
    showAddButton: function(){
        this.$('.removeAdd').removeClass('removeAdd').addClass('add').html('<span class="flaticon-bookmark50"></span>Add to favorites').removeAttr("disabled");
    },
    beforeCancel: function(){
        this.$('booksInput').tagsinput('destroy');
        this.off();
    },
    cancel: function () {
        App.trigger('app:modal-close');
    }
});


    //Author tattoo profile functions   ///c
    // initialize: function(){
    //     _.bindAll(this, 'focusIn', 'saveBooks');

    //     this.model.on('add:created', this.showYourBooks, this);
    //     this.model.on('add:removed', this.showAddButton, this);

    // },
    // events: {
    //     'click .more':          'renderPopularBooks',
    //     'click .otherBook':     'addOtherBook',
    //     'click .save':          'saveBooks',
    //     'click .clear':         'clearBooks'
    // },
    // focusIn: function(){
    //     this.$('.tt-input').focus();
    //     if (this.$('.bootstrap-tagsinput').hasClass('bootstrap-tagsinput-max')) {
    //         this.$('.tt-input').blur().val(' ');
    //     }
    //     this.$('.tt-input').val(this.$('input.tt-input:last').val().toProperCase());
    //     return this;
    // },
    // onRender: function(){
    //     this.booksByCount = this.model.attributes.books.byCount();
    //     this.renderArtistsBooks().renderPopularBooks();
    // },
    // removeAdd: function(){
    //     this.$('.removeAdd').attr('disabled', 'disabled');
    //     this.clearBooks();
    //     this.model.removeAdd(this.add);
    // },
    // showAddButton: function(){
    //     this.$('.clear, .save, .yourBooks').fadeOut(800);
    //     this.$('.removeAdd').removeClass('removeAdd').removeAttr("disabled").addClass('add').html('<span class="flaticon-books8"></span>Collect');
    // },
    // renderPopularBooks: function(){
    //     if (this.model.attributes.books.length >= 1 && this.popularBooksLimit) {
    //         this.$('.byAll h5').html('By Everyone');
    //         this.count = this.count || 0;
    //         var popularBooks = this.booksByCount.slice(this.count, this.count + this.popularBooksLimit);
    //         _.each(popularBooks, function(book) {
    //             this.$('.otherBooks span.byAll').append(_.template('<button type="button" class="btn-tag otherBook userBook">'+ book +'</button>'));
    //         }, this);
    //         this.$('.otherBooks').fadeIn( 1000 );
    //         var that = this;
    //         window.setTimeout(function(){
    //             if($('.otherBook').length >= Math.min(that.booksByCount.length+that.model.attributes.artistBooks.length,10)){
    //                 that.$('.more').attr('disabled', 'disabled').fadeOut(300);

    //             }
    //             var addTipTitle =  Parse.User.current() && Parse.User.current().attributes.role === 'artist' ? "Popular books by everyone" : "Add popular book";
    //             $('.otherBook.userBook').tooltip({
    //                 title: addTipTitle,
    //                 delay: { show: 200, hide: 200 },
    //                 placement: 'auto'
    //             });
    //         },0);
    //         this.count = this.count + this.popularBooksLimit
    //         this.popularBooksLimit = 5;
    //     } else { 
    //         this.popularBooksLimit = 5;
    //     }
    // },
    // addOtherBook: function(e){
    //     if (!Parse.User.current()) {
    //         // Parse.history.navigate('/login', {trigger: true, replace: true});
    //         App.trigger('app:login');
    //         $(".loginForm .error").html("You need to be logged in to favorite tattoos.").show();
    //     } else if(Parse.User.current().attributes.role === 'artist') {

    //         return;
    //     } else if(!this.add) {
    //         this.createAdd([e.target.textContent])
    //     } else if ($(".booksInput").tagsinput('items').length < 5){
    //         $('.booksInput').tagsinput('add', e.target.textContent);
    //     }
    // },
    // showYourBooks: function(add){
    //     this.add = add;
    //     var that = this;

    //     this.$('.add').removeClass('add').addClass('removeAdd').removeAttr("disabled");
    //     this.$('.yourBooks').slideDown(800);

    //     var input = this.$('.booksInput');
    //     input.tagsinput({
    //         tagClass: 'btn-tag',
    //         trimValue: true,
    //         maxChars: 20,
    //         maxTags: 5,
    //         onTagExists: function(item, $tag) {
    //             $tag.addClass('blured');
    //             window.setTimeout(function(){$tag.removeClass('blured');}, 1000);
    //         }
    //     });
    //     input.tagsinput('input').typeahead(null, {
    //         name: 'books',
    //         displayKey: 'books',
    //         source: App.booktt.ttAdapter()
    //     }).attr('placeholder','Add book').on('typeahead:selected', $.proxy(function (obj, datum) {
    //         this.tagsinput('add', datum.books);
    //         this.tagsinput('input').typeahead('val', '');
    //     }, input)).on('focus', function () {
    //         that.$('.bootstrap-tagsinput > .btn-tag').removeClass('blured');
    //         that.$('.bootstrap-tagsinput').addClass('focused');
    //         that.$('.tt-input').attr('placeholder','');
    //     }).on('blur', function () {
    //         that.$('.bootstrap-tagsinput > .btn-tag').addClass('blured');
    //         that.$('.bootstrap-tagsinput').removeClass('focused');
    //         if (that.$('.bootstrap-tagsinput').hasClass('bootstrap-tagsinput-max')) {
    //             that.$('.tt-input').attr('placeholder','').val('');
    //         } else {
    //             that.$('.tt-input').attr('placeholder','Add book').val('');
    //         }
    //         if(that.$('.save').is(':visible')) {   
    //             that.$('.save').click();
    //         }
    //     });

    //     input.on('itemAdded', function(event) {
    //         that.$('.save').fadeIn();
    //         that.$('.clear').fadeIn();
    //     }).on('itemRemoved', function(event){
    //         that.$('.save').fadeIn();
    //     });
    //     _.each(add.attributes.books, function(book) {
    //         that.$('.booksInput').tagsinput('add', book);
    //     });
    //     window.setTimeout(function(){
    //         that.$('.btn-tag').addClass('blured');
    //         that.$('.save').hide();
    //         if(that.$('.booksInput').tagsinput('items').length === 5) {
    //             that.$('.booksInput').tagsinput('input').attr('placeholder','');
    //         }
    //     }, 400);
    // },
    // saveBooks: function() {
    //     $('.save').attr('disabled', 'disabled');
    //     var that = this;

    //     var books = _.map(this.$('.booksInput').tagsinput('items').slice(0), function(book) { return book.toProperCase(); });
    //     this.add.set('books', books);
    //     this.add.save(null,{
    //         success: function(result) {
    //             $('.save').html('Saved!!!').fadeOut( 1200, function(){
    //                 $('.save').removeAttr("disabled").html('Save');
    //             });
    //         },
    //         error: function(error) {
    //             $('.save').removeAttr("disabled");
    //             console.log(error);
    //         }
    //     });
    //     return this;
    // },
    // clearBooks: function(){
    //     var that = this;
    //     this.$('.clear').attr('disabled', 'disabled');
    //     this.$('.bootstrap-tagsinput').removeClass('bootstrap-tagsinput-max');
    //     this.$('.booksInput').tagsinput('removeAll');
    //     this.$('.clear').fadeOut(800,function(){
    //         $(this).removeClass('clear').removeAttr("disabled");
    //         that.saveBooks().focusIn();
    //     });
    // },

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
            this.collection.add(added,{at:0});
            this.renderTattoos();
        }, this);
    },
    addBookFilter: function(book){
        this.bookFilters.push(book);
        this.renderTattoosByBooks(this.bookFilters);
    },
    removeBookFilter: function(book){
        this.bookFilters = _.without(this.bookFilters, book);
        this.renderTattoosByBooks(this.bookFilters);
    },
    resetFilters: function(){
        this.bookFilters = [];
        $('.bookFilter').removeClass('active');
        this.renderTattoos();
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
                    title: "Filter by style or theme",
                    container: 'body',
                    delay: { show: 200, hide: 200 },
                    placement: 'auto'
                });
            }, 0);
        }
        return this;
    },
    getAndRenderBooks: function(){
        console.log('get and render books called from the tattoos view');   ///c
        var books = this.collection.getArtistBooksByCount(10);
        this.renderBooks(books.slice(0,5));

        if(books.length > 5){
            $('.tagFilters').append(_.template('<a class="more">More</a>'));
            $('.more').on('click', books, this.renderMoreBooks);
        } 
        return this;
    },
    renderMoreBooks: function(e){
        $('.tagFilters').remove();
        this.resetFilters();

        var books = e.data;
        this.renderBooks(books);
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
        _.bindAll(this, 'createAdd', 'removeAdd', 'profile');
        this.model.on('add:created', this.showRemoveButton, this);
        this.model.on('add:removed', this.showAddButton, this);
    },
    events: {
        'click .open':                  'open',
        'click .hover-text-content':    'profile',
        'click .add':                   'createAdd',
        'click .removeAdd':             'removeAdd'
    },
    open: function(e){
        e.stopPropagation();
        App.trigger('app:tattoo-profile-id', this.model.id);
    },
    profile: function(e){
        e.stopPropagation();
        // navigate instead of App.trigger so App.router.hitRoutes is stored ///c
        Parse.history.navigate(this.model.attributes.artistProfile.attributes.username, {trigger: true});
    },
    createAdd: function(e){
        e.stopPropagation();
        this.$('.add').attr('disabled', 'disabled');
        if(!Parse.User.current()) {
            App.trigger('app:login');
            $(".loginForm .error").html("You need to be logged in to favorite tattoos.").show();
        } else {
            this.model.createAdd();
        }
    },
    removeAdd: function(e){
        e.stopPropagation();
        this.$('.removeAdd').attr('disabled', 'disabled');
        this.model.removeAdd(this.add);
    },
    showAddButton: function(){
        this.$('button').removeClass('removeAdd').addClass('add').removeAttr("disabled");
    },
    showRemoveButton: function(add){
        //assigns the add for removing
        this.add = add;

        this.$('button').removeClass('add').addClass('removeAdd').removeAttr("disabled");
    },
    render: function(){
        var attributes = this.model.toJSON();
        $(this.el).append(this.template(attributes));
        var add = App.Collections.adds.getTattoo(this.model.id);
        if (Parse.User.current() && add.length) {
            this.showRemoveButton(add[0]);
        }
        return this;
    }
});

App.Views.MyTattoo = Parse.View.extend({
    className: 'tattoo',
    template: _.template($("#myTattooTemplate").html()),
    initialize: function(){
        this.model.on('destroy', this.remove, this);
    },
    events: {
        'click .edit': 'edit',
        'click .open': 'open'
    },
    open: function(){
        App.trigger('app:tattoo-profile', this.model);
    },
    edit: function(e){
        e.stopPropagation();
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
        _.bindAll(this, 'addOtherBook');
        App.on('app:keypress', this.focusIn);
    },
    disable: function () {
        console.log('EditTattoo disabled'); ///c
        App.off('app:keypress', this.focusIn);
    },
    events: {
        "click .otherBook":     "addOtherBook",
        "click .otherBooks .more":     "renderMoreBookSuggestions",
        "click .delete":        "delete"
    },
    focusIn: function(){
        this.$('.tt-input').focus();
        if (this.$('.bootstrap-tagsinput').hasClass('bootstrap-tagsinput-max')) {
            this.$('.tt-input').blur().val(' ');
        }
        this.$('.tt-input').val(this.$('input.tt-input:last').val().toProperCase());
        return this;
    },
    initializeBookSuggestions: function(){
        // gets all the books, unique in order of count
        this.allBookSuggestions = this.model.attributes.books.byCount();

        if (App.myTattoos) {
            // adds other books the user has added to other tattoos
            this.allBookSuggestions.push(App.myTattoos.getArtistBooksByCount());   
            this.allBookSuggestions = _.unique( _.flatten( this.allBookSuggestions ));
        }

        // removes already added books  ///c
        this.allBookSuggestions = _.difference(this.allBookSuggestions, this.model.attributes.artistBooks);

        if (this.allBookSuggestions.length >= 1) {
            this.count = this.count || 0;
            var bookSuggestions = this.allBookSuggestions.slice(this.count,(this.count+10));
            this.renderBookSuggestions(bookSuggestions);

            this.count = this.count + 10;
            this.$('.otherBooks').fadeIn( 1000 );

        }
    },
    renderBookSuggestions: function(bookSuggestions){
        _.each(bookSuggestions, function(book) {
            this.$('.otherBooks span').append(_.template('<button type="button" class="btn-tag otherBook">'+ book +'</button>'));
        }, this);

        var that = this;
        window.setTimeout(function(){
            if($('.otherBooks span').children('.otherBook').length >= that.allBookSuggestions.length){
                that.$('.more').attr('disabled', 'disabled').fadeOut(300);
            }
            $('.otherBook').tooltip({
                title: "Add style or theme",
                delay: { show: 200, hide: 200 },
                placement: 'auto'
            });
        },0);
    },
    renderMoreBookSuggestions: function(){
        var bookSuggestions = this.allBookSuggestions.slice(this.count,(this.count+20));
        this.renderBookSuggestions(bookSuggestions);
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
                $tag.addClass('shake');
                window.setTimeout(function(){$tag.removeClass('shake');}, 1000);
            }
        });
        input.tagsinput('input').typeahead(null, {
            name: 'books',
            displayKey: 'books',
            source: App.booktt.ttAdapter()
        }).attr('placeholder','Start typing').on('typeahead:selected', $.proxy(function (obj, datum) {
            this.tagsinput('add', datum.books);
            this.tagsinput('input').typeahead('val', '');
        }, input)).on('focus', function () {
            that.$('.bootstrap-tagsinput').addClass('focused');
        }).on('blur', function () {
            that.$('.bootstrap-tagsinput').removeClass('focused');
            that.maxBookInput();
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
            if(that.$('.booksInput').tagsinput('items').length === 5) {
                that.$('.booksInput').tagsinput('input').attr('placeholder','');
            }
        }, 400);
    },
    saveBooks: function(){
        console.log('save books called');   ///c
        var that = this;
        var books = _.map(this.$('.booksInput').tagsinput('items').slice(0), function(book) { return book.toProperCase(); });
        this.model.set('artistBooks', books);
        this.model.save(null,{
            success: function(result) {
                console.log('tattoo saved');    ///c
                console.log(result);    ///c
                $.growl({
                    message: "Tattoo saved"
                });
            },
            error: function(error) {
                that.$('.bookMessage').html(error.message);
                console.log(error); ///c
            }
        });

        this.maxBookInput();
    },
    maxBookInput: function(){
        var that = this;
        if (that.$('.bootstrap-tagsinput').hasClass('bootstrap-tagsinput-max')) {
            that.$('.tt-input').attr('placeholder','').val('');
            that.$('.bookMessage').html('5 max, remove one first.');
            that.$('.otherBook').attr("disabled", "disabled");
            window.setTimeout(function(){
                that.$('.bookMessage').html('&nbsp;');
            },3000)
        } else {
            that.$('.tt-input').attr('placeholder','Start typing').val('');
            that.$('.otherBook').removeAttr("disabled");
        }
    },
    addOtherBook: function(e){
        this.$('.booksInput').tagsinput('add', e.target.textContent);
    },
    delete: function(e){
        this.$('.delete').attr("disabled", "disabled");
        var that = this;
        this.model.deleteTattoo().then(function(tattoo){
            Parse.history.navigate('myprofile', {trigger: true});
            $.growl({
                message: "Deleted",
                icon: tattoo.attributes.fileThumbSmall.url()
            }, {
                icon_type: 'img'
            });
        }, function(error){
            console.log(error); ///c
            that.$('.bookMessage').html(error.message);
        });
    },
    onRender: function(){
        this.initializeEditBooks();
        this.initializeBookSuggestions();
    },
    beforeCancel: function(){
        this.$('booksInput').tagsinput('destroy');
    },
    cancel: function () {
        App.trigger('app:modal-close');
    }
});

// App.Views.AuthorProfile = Parse.View.extend({
//     model: App.Models.User,
//     id: 'userProfile',
//     initialize: function() {
//         this.routePrefix = Parse.history.fragment;
//         this.activateAffix();
//     },
//     template: _.template($("#userProfileTemplate").html()),
//     events: {
//         'click [href="#collectionTab"]': 'collectionTab',
//         'click [href="#booksTab"]': 'booksTab',
//         'click [href="#artistsTab"]': 'artistsTab'
//     },
//     collectionTab: function (e) {
//         if (e) { e.preventDefault(); }
//         $('a[href="#collectionTab"]').tab('show');
//         this.scroll();
//         Parse.history.navigate(this.routePrefix + '/collection', { trigger: false });
//     },
//     booksTab: function (e) {
//         if (e) { e.preventDefault(); }
//         $('a[href="#booksTab"]').tab('show');
//         this.scroll();
//         Parse.history.navigate(this.routePrefix + '/books', { trigger: false });
//     },
//     artistsTab: function (e) {
//         if (e) { e.preventDefault(); }
//         $('a[href="#artistsTab"]').tab('show');
//         this.scroll();
//         Parse.history.navigate(this.routePrefix + '/artists', { trigger: false });
//     },
//     scroll: function(){
//         $("html, body").animate({ scrollTop: $('.userHead').outerHeight(true) + 41  }, 500);
//     },
//     activateAffix: _.debounce(function(){
//         $('.profNavContainer').affix({
//               offset: { top: $('#userProfile > div.container').outerHeight(true) + 40 }
//         });
//     }, 1000),
//     getAdds: function() {
//         var that = this;
//         App.query.adds(this.model.attributes.user)
//             .then(function (adds) {
//                 var addsCollection = new App.Collections.Adds(adds);
//                 that.renderAdds(addsCollection);
//             },
//             function (error) {
//                 console.log(error);
//             });
//     },
//     renderAdds: function(addsCollection){
//         this.addsTattoosCollection = new App.Collections.Tattoos(addsCollection.getTattoos());
//         this.userAddsTattoos = new App.Views.Tattoos({collection: this.addsTattoosCollection, el: this.$('.adds')});
//         var booksByCount =  addsCollection.getAddBooksByCount( );
//         this.userAddsTattoos.render().renderBooks( booksByCount );
//         console.log('renderBooks called on ~ addsCollection.getAddBooksByCount()');

//         this.renderBooks(addsCollection, booksByCount);
//         this.renderArtists(addsCollection);
//         return this;
//     },
//     renderBooks: function(addsCollection, booksByCount){

//         this.booksCollection = new App.Collections.Books();
//         this.booksView = new App.Views.Books({collection: this.booksCollection, el: this.$('.books')});

//         _.each(booksByCount, function(book){
//             var bookModel = new App.Models.Book({book: book});
//             ///TODO ~ improve this
//             bookModel.set('tattoos', this.addsTattoosCollection.byBooks([book]).slice(0,4));
//             this.booksCollection.add(bookModel);
//         }, this);

//         this.booksView.render();
//         return this;
//     },
//     renderArtists: function(addsCollection) {
//         this.artistsCollection = new App.Collections.Artists(addsCollection.getArtists());
//         this.artistsView = new App.Views.Artists({collection: this.artistsCollection, el: this.$('.artists')});
//         this.artistsView.render();
//     },
//     getTattoos: function() {
//         console.log('user profile getTattoos');
//         console.log(this.model);
        // var options = {
        //     order: 'createdAt'
        // };
//         App.query.tattoosByProfile(this.model, [], options)
//             .then(function (tats) {
//                 var tattoos = new App.Collections.Tattoos(tats);
//                 var collection = new App.Views.Tattoos({collection: tattoos});
//                 collection.render().getAndRenderBooks();
//             },
//             function (error) {
//                 console.log(error);
//             });
//     },
//     getMyTattoos: function(){
//         console.log('user profile getMyTattoos');
//         console.log(App.profile);
        // var options = {
        //     order: 'createdAt'
        // };
//         App.query.tattoosByProfile(App.profile, [], options)
//             .then(function (tats) {
//                 App.myTattoos = new App.Collections.Tattoos(tats);
//                 var portfolio = new App.Views.Tattoos({collection: App.myTattoos, myTattoos: true});
//                 portfolio.render();
//             },
//             function (error) {
//                 console.log(error);
//             });
//     },
//     renderMyProfile: function(){
//         var that = this;
//         this.userAddsTattoos.bindAddsToProfile();
//         this.$('.bio').after(_.template('<button href="/myprofile/settings" class="btn-submit"><i class="flaticon-settings13"></i>Edit Profile</button>'));
//     },
//     render: function(){
//         var attributes = this.model.attributes
//         this.$el.html(this.template(attributes));

//         if(Parse.User.current() && this.model.attributes.user.id === Parse.User.current().id){
//             this.renderAdds(App.Collections.adds);
//             this.getMyTattoos();
//             this.renderMyProfile();
//         } else {
//             this.getAdds();
//             this.getTattoos();
//         }
//         return this;
//     }
// });

App.Views.UserProfile = Parse.View.extend({
    model: App.Models.User,
    id: 'userProfile',
    initialize: function() {
        this.activateAffix();

        if(Parse.User.current() && this.model.attributes.user.id === Parse.User.current().id){
            this.isMyProfile = true;
            this.routePrefix = 'myprofile';
        } else {
            this.isMyProfile = false;
            this.routePrefix = 'user/'+this.model.get('username');
        }
    },
    template: _.template($("#userProfileTemplate").html()),
    events: {
        'click [href="#favoritesTab"]': 'favoritesTab',
        'click [href="#artistsTab"]': 'artistsTab'
    },
    favoritesTab: function (e) {
        if (e) { e.preventDefault(); }
        $('a[href="#favoritesTab"]').tab('show');
        this.scroll();
        Parse.history.navigate(this.routePrefix + '/favorites', { trigger: false });
    },
    artistsTab: function (e) {
        if (e) { e.preventDefault(); }
        $('a[href="#artistsTab"]').tab('show');
        this.scroll();
        Parse.history.navigate(this.routePrefix + '/artists', { trigger: false });
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
        App.query.adds(this.model.attributes.user)
            .then(function (adds) {
                var addsCollection = new App.Collections.Adds(adds);
                that.renderAdds(addsCollection);
            },
            function (error) {
                console.log(error); ///c
            });
    },
    renderAdds: function(addsCollection){
        this.addsTattoosCollection = new App.Collections.Tattoos(addsCollection.getTattoos());
        this.userAddsTattoos = new App.Views.Tattoos({collection: this.addsTattoosCollection, el: this.$('.favorites')});
        this.userAddsTattoos.render();

        this.renderArtists(addsCollection);
        return this;
    },
    renderArtists: function(addsCollection) {
        this.artistsCollection = new App.Collections.Artists(addsCollection.getArtists());
        this.artistsView = new App.Views.Artists({collection: this.artistsCollection, el: this.$('.artists')});
        this.artistsView.render();
    },
    getTattoos: function() {
        console.log('user profile getTattoos'); ///c
        var options = {
            order: 'createdAt'
        };
        App.query.tattoosByProfile(this.model, [], options)
            .then(function (tats) {
                var tattoos = new App.Collections.Tattoos(tats);
                var collection = new App.Views.Tattoos({collection: tattoos});
                collection.render();
            },
            function (error) {
                console.log(error); ///c
            });
    },
    getMyTattoos: function(){
        console.log('user profile getMyTattoos');   ///c
        var options = {
            order: 'createdAt'
        };
        App.query.tattoosByProfile(App.profile, [], options)
            .then(function (tats) {
                App.myTattoos = new App.Collections.Tattoos(tats);
                var portfolio = new App.Views.Tattoos({collection: App.myTattoos, myTattoos: true});
                portfolio.render();
            },
            function (error) {
                console.log(error); ///c
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

        if(this.isMyProfile){
            this.renderAdds(App.Collections.adds);
            this.getMyTattoos();
            this.renderMyProfile();
        } else {
            this.getAdds();
            this.getTattoos();
        }
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
        $('#navs').hide();
        this.initiateArtists();

        /// Workaround for getting a random artist. Will not scale over 1,000 due to query constraint....   ///c
        var query = new Parse.Query(App.Models.ArtistProfile);
        query.containedIn("featuremonth", ["1","2","3","4","5","6","7","8","9","10","11","12"]);
        query.count().then(function(count){
            that.count = count;
        });

        _.bindAll(this, 'getArtists', 'continue', 'continueExplore', 'initiateArtists', 'hideLanding');
        App.on('app:scroll', this.continueExplore);
    },
    disable: function(){
        App.off('app:scroll', this.continueExplore);
    },
    events: {
        "click a":  "continue"
    },
    land: function(){
        var that = this;
        this.$('.welcome').delay( 100 ).fadeIn( 600 ).delay( 3300 ).animate({
            marginTop: "5vh",
            opacity: 0
        }, 600);
        this.$('.logo').delay( 500 ).fadeIn( 1000 ).delay( 2500 )
            .animate({
                marginBottom: "+5vh"
              }, 600, "swing", function() {
                that.showNextArtist();
              });
        this.$('.landingLinks').fadeIn();
        this.$('.artistLoc').delay( 1000 ).fadeIn().delay( 2700 ).fadeOut( 300 );
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

        App.query.tattoosByProfile(currentArtist, [], { limit: 8 })
            .then(function (tats) {
                that.$('.landingTattooContainer:hidden:first').html('');
                _.each(tats, function(tat) {
                    var thumb = tat.get('fileThumb').url();
                    that.$('.landingTattooContainer:hidden:first').append(_.template('<img src='+thumb+' class="tattooImg open">'));
                }, that);
            }, function (error) {
                console.log(error); ///c
            });
    },
    getArtists: function(){
        this.count = this.count || 100;
        var that = this;
        App.query.randomFeaturedArtists({ limit: 10, count: this.count })
            .then(function (artists) {
                clearInterval(that.artistTimer);
                that.collection.reset(artists);
                that.artistTimer = setInterval(function(){
                    that.showNextArtist();
                }, 6000);
            },
            function (error) {
                console.log(error); ///c
            });
    },
    continue:function(){
        this.hideLanding();
    },
    continueExplore:function(){
        console.log('landing triggered continueExplore');   ///c
        App.trigger('app:explore');
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
        $('#navs').fadeIn( 900 );

        console.log('landing hidden');  ///c
        this.disable();
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
            console.log('app.on scrolling....');    ///c
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
        console.log('featured artist more');    ///c
        $(e.target.parentElement).fadeOut().remove();
        this.load();
        $("html, body").animate({ scrollTop: $('.end').offset().top }, 400);
    },
    load: function() {
        console.log('featured artist load');    ///c
        var that = this;
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
                console.log(message);   ///c
            });

        var p = (this.collection.page) ? '/p' + this.collection.page : '';
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
        return this;
    }
});

App.Views.FeaturedArtist = Parse.View.extend({
    className: 'featuredArtist',
    attributes: {
        "style": "display: none;"
    },
    template: _.template($("#featuredArtistTemplate").html()),
    render: function(){
        var that = this;
        var attributes = this.model.toJSON();
        $(this.el).append(this.template(attributes));

        // get 4 tattoos from the artist and append them to the container   ///c
        App.query.tattoosByProfile(this.model, [], { limit: 4 })
            .then(function (tats) {
                _.each(tats, function(tat) {
                    var thumb = tat.get('fileThumbSmall').url();
                    var tattoo = $('<a class="tattooContainer open"><img src='+thumb+' class="tattooImg"></a>');
                    that.$('.portfolioContainer').append(tattoo);
                    $(tattoo).on('click', function(){
                        App.trigger('app:tattoo-profile-id', tat.id);
                    });
                }, that);
            },
            function (error) {
                console.log(error); ///c
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
        "click #facebookLogin":             "toggleFacebook",
        "submit form.accountForm":          "saveAccount",
        "keyup #editUsername":              "usernameVal",
        "submit form.profileForm":          "saveProfile",
        "keyup #editFB, #editInstagram, #editTwitter, #editWebsite":"linkVal",
        "change #profUpload":               "updateProf",
        "dblclick #profileSettings":        "interview",
        "click li":                         "scrollTo",
        "click #uploadButton":              "upload",
        'focus #settingsMapAddress':        'initializeLocationPicker',
        'click .saveLocation':              'saveLocation',
        'click .clearLocation':             'clearLocation'
    },
    toggleFacebook: function(){
        var that = this;
        this.$('#facebookLogin').attr("disabled", "disabled");
        if(!Parse.FacebookUtils.isLinked(this.user)) {
            Parse.FacebookUtils.link(this.user, 'user_photos,user_location,user_friends,email,user_about_me,user_website', {
                success: function(user) {
                    that.alertSaved("Facebook linked");
                    that.$('#facebookLogin').html('<i class="facebook"></i>Unlink Facebook').css({'background-color':'#cccccc'}).removeAttr("disabled");
                },
                error: function(user, error) {
                    $(".accountForm .error").html(error.message).show();
                    this.$('#facebookLogin').removeAttr("disabled");
                }
            });
        } else if (Parse.FacebookUtils.isLinked(this.user)) {
            Parse.FacebookUtils.unlink(this.user, {
                success: function(user) {
                    that.alertSaved("Facebook bailed");
                    that.$('#facebookLogin').html('<i class="facebook"></i>Link Facebook').css({'background-color':'#4f78b4'}).removeAttr("disabled");
                    console.log("User no longer associated with their Facebook account.");  ///c
                }
            });
        }
    },
    saveAccount: function(e){
        this.$('.saveAccount').attr("disabled", "disabled");
        e.preventDefault();
        var that = this;
        this.user.set("username", this.$("#editUsername").val().replace(/\W/g, '').toLowerCase());
        this.user.set("email", this.$("#editEmail").val());
        this.user.set("password", this.$("#editPassword").val());
        this.user.save(null,{
            success: function(user) {
                // flash the success class  ///c
                that.alertSaved("Account saved");
                $(".accountForm").each(function(){
                    $(".input-group").addClass("has-success").fadeIn("slow");
                    setTimeout(function() { $(".input-group").removeClass("has-success") }, 2400);
                });
                $("#editPassword").val("");
                this.$('.saveAccount').removeAttr("disabled");
            },
            error: function(user, error) {
                $(".accountForm .error").html(error.message).show();
                this.$('.saveAccount').removeAttr("disabled");
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
        var that = this;
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
                that.alertSaved();
                $(".profileForm").each(function(){
                    $(".input-group").addClass("has-success").fadeIn("slow");
                    setTimeout(function() { $(".input-group").removeClass("has-success") }, 2400);
                });
                this.$('.saveProfile').removeAttr("disabled");
            },
            error: function(user, error) {
                $(".profileForm .error").html(error.message).show();
                this.$('.saveProfile').removeAttr("disabled");
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
        var that = this;
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
                that.alertSaved();
                var file = profile.get("profThumb");
                $(".prof")[0].src = file.url();
                enableProfUpload();
            }, function(error) {
                console.log(error); ///c
                $(".error:eq( 3 )").html(error.message).show();
                enableProfUpload();
            });
        } else {
            enableProfUpload();
        }
        function enableProfUpload() {
            $("#profUpload").removeAttr("disabled");
            $("span:contains('Choose Profile Picture')").removeClass( "disabled" );
        }
    },
    interview: function(){
        Parse.history.navigate('interview', {trigger: true});
    },
    scrollTo: function(e){
        //get the section to scroll to from the data target attribute   ///c
        var section = $(e.currentTarget).data('target');
        //scroll to that section, less the nav bar height.  ///c
        $('html, body').animate({
            scrollTop: $(section).offset().top - 110
        }, 1200);
    },
    upload: function(){
        // navigate first so currentView is myprofile and App.router.hitRoutes is not stored
        Parse.history.navigate('myprofile', {trigger: true});
        App.trigger('app:upload');
    },
    clearLocation: function(){
        var that = this;
        this.locationPickerCreated = false;
        this.$('.saveLocation, .gm-style').fadeOut();
        this.$('.clearLocation').attr("disabled", "disabled");
        App.profile.unset("location");
        App.profile.set("address", "");
        App.profile.set("locationName", "");
        App.profile.save(null,{
            success: function(user) {
                $(".editLocation").addClass("has-success").fadeIn("slow");
                setTimeout(function() { $(".editLocation").removeClass("has-success") }, 2400);
                that.alertSaved();

                $("#locationSettings ~ .error").hide();
                this.$('#settingsMapAddress').val('');
                this.$('.clearLocation').removeAttr("disabled").fadeOut();
            },
            error: function(user, error) {
                this.$(".profileForm .error").html(error.message).show();
                this.$('.clearLocation').removeAttr("disabled");
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
                that.alertSaved();
                $(".editLocation").addClass("has-success").fadeIn("slow");
                setTimeout(function() { $(".editLocation").removeClass("has-success") }, 2400);
                $("#locationSettings ~ .error").hide();

                that.$('.saveLocation').fadeOut();
                that.$('.clearLocation').fadeIn();
                that.$('.saveLocation').removeAttr("disabled");
            },
            error: function(user, error) {
                this.$(".profileForm .error").html(error.message).show();
                this.$('.saveLocation').removeAttr("disabled");
            }
        });
    },
    alertSaved: function(message){
        $.growl({
            message: message || "Profile saved",
            url: '/myprofile'
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
                    that.$('.gm-style, .saveLocation').fadeIn();
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
            if(Parse.User.current() && Parse.User.current().attributes.role === 'artist') {
                var editTattoos = new App.Views.EditArtistPortfolio();
                $('.editPortfolioContainer').html(editTattoos.render().el);
            }
        },0);
        return this;
    }
});

App.Views.EditArtistPortfolio = Parse.View.extend({
    id: 'editPortfolio',
    template: _.template($("#editArtistPortfolioTemplate").html()),
    initialize: function(){
        _.bindAll(this, 'renderEditTattoos', 'renderProfileBooks', 'update');
    },
    events: {
        'click .editTattoos': 'renderEditTattoos'
    },
    renderEditTattoos: function(){
        this.$('.editTattoos').hide();
        $('.editTattoosContainer').html('');
        var tattoos = this.bookFilter ? App.myTattoos.byBooks([this.bookFilter]) : App.myTattoos.models
        _.each(tattoos, function(tattoo){
            var editArtistPortfolioTattoo = new App.Views.EditArtistPortfolioTattoo({model: tattoo});
            $('.editTattoosContainer').append(editArtistPortfolioTattoo.render().el);
        });
    },
    update: function(){
        console.log('updating edit portfolio counts and books'); ///c
        this.setPortfolioCount();

        var books = App.myTattoos.getArtistBooksByCount();
        var count = books.length;

        this.setBookCount(count);
        this.renderProfileBooks(books);
    },
    renderProfileBooks: function(books){
        var that = this;
        $('.profileBooks').html('');
        $('.editTattoos').html('Edit').fadeIn();
        if (books.length !== 0) {
            $('.profileBooks').append('<span class="flaticon-book104"></span>');
            _.each(books, function(book){
                $('.profileBooks').append('<button type="button" class="btn-tag artistBook">'+ book +'</button>');
            });
            $('.artistBook').tooltip({
                title: "Filter portfolio by",
                container: 'body',
                delay: { show: 200, hide: 200 },
                placement: 'auto'
            });
            $('.artistBook').on('click', function(e){ 
                if($(e.target).hasClass('active')){
                    that.bookFilter = undefined;
                    that.renderEditTattoos();
                    $(e.target).removeClass('active');
                } else {
                    $('.artistBook').removeClass('active');
                    that.bookFilter = e.target.textContent;
                    that.renderEditTattoos();
                    $(e.target).addClass('active');
                }
            });
        } else if (App.myTattoos.length === 0) {
            $('.editTattoos').html('').fadeOut();
        } else {
            $('.editTattoos').html('Add your first style or theme').fadeIn();
        }
    },
    setPortfolioCount: function(){
        this.$('div.portfolioCount h1').html(App.myTattoos.models.length || 0);
    },
    setBookCount: function(count){
        this.$('div.bookCount h1').html(count || 0);
    },
    render: function(){
        this.$el.html(this.template());

        var that = this;
        window.setTimeout(function(){
            that.update();
            App.myTattoos.on('change',that.update);
            App.myTattoos.on('remove',that.update);
        }, 500);
        return this;
    }
});

App.Views.EditArtistPortfolioTattoo = Parse.View.extend({
    id: 'editPortfolioTattoo',
    template: _.template($("#editArtistPortfolioTattooTemplate").html()),
    initialize: function(){
        _.bindAll(this,'delete');
    },
    events: {
        'click .delete': 'delete'
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
                $tag.addClass('shake');
                window.setTimeout(function(){$tag.removeClass('shake');}, 1000);
            }
        });
        input.tagsinput('input').typeahead(null, {
            name: 'books',
            displayKey: 'books',
            source: App.booktt.ttAdapter()
        }).attr('placeholder','Add+').on('typeahead:selected', $.proxy(function (obj, datum) {
            this.tagsinput('add', datum.books);
            this.tagsinput('input').typeahead('val', '');
        }, input)).on('focus', function () {
            that.$('.bootstrap-tagsinput').addClass('focused');
        }).on('blur', function () {
            that.$('.bootstrap-tagsinput').removeClass('focused');
            that.maxBookInput();
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
            if(that.$('.booksInput').tagsinput('items').length === 5) {
                that.$('.booksInput').tagsinput('input').attr('placeholder','');
            }
        }, 400);
    },
    saveBooks: function(){
        console.log('save books called');   ///c
        var that = this;
        var books = _.map(this.$('.booksInput').tagsinput('items').slice(0), function(book) { return book.toProperCase(); });
        this.model.set('artistBooks', books);
        this.model.save(null,{
            success: function(result) {
                console.log('tattoo saved');    ///c
                console.log(result);    ///c
                $.growl({
                    message: "Tattoo saved"
                });
            },
            error: function(error) {
                that.$('.bookMessage').html(error.message);
                console.log(error); ///c
            }
        });

        this.maxBookInput();
    },
    maxBookInput: function(){
        var that = this;
        if (that.$('.bootstrap-tagsinput').hasClass('bootstrap-tagsinput-max')) {
            that.$('.tt-input').attr('placeholder','').val('');
            that.$('.bookMessage').html('5 max, remove one first.');
            that.$('.otherBook').attr("disabled", "disabled");
            window.setTimeout(function(){
                that.$('.bookMessage').html('&nbsp;');
            },3000)
        } else {
            that.$('.tt-input').attr('placeholder','Add+').val('');
            that.$('.otherBook').removeAttr("disabled");
        }
    },
    delete: function(e){
        this.$('.delete').attr("disabled", "disabled");
        var that = this;
        this.model.deleteTattoo().then(function(tattoo){
            that.$el.fadeOut();
        }, function(error){
            console.log(error); ///c
            that.$('.delete').removeAttr("disabled");
            that.$('.bookMessage').html(error.message);
        });
    },
    render: function(){
        var that = this;
        var attributes = this.model.toJSON();
        this.$el.html(this.template(attributes));

        this.initializeEditBooks();
        return this;
    }
});

App.Views.EditInterview = Parse.View.extend({
    id: 'settings',
    template: _.template($("#artistInterviewTemplate").html()),
    initialize: function(){
        this.user = Parse.User.current();
        this.profile = App.profile;
    },
    events: {
    	"submit form.interviewForm": 	"saveInterview",
    	'submit form.featureForm': 'featureArtist'
    },
    saveInterview: function (e){
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
		this.profile.save(null,{
			success: function(profile) {
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
    featureArtist: function (e) {
    	e.preventDefault();
    	var that = this;
    	Parse.Cloud.run('featureArtist', { id: this.profile.id }, {
    		success: function (result) {
    			that.profile = result;
    			that.render();
    		},
    		error: function (error) {
    			$(".featureForm .error").html(error.message).show();
    		}
    	});
    },
	render: function(){
		this.$el.html(this.template({ model: this.profile.attributes }));
		return this;
	}
});

App.Views.Join = Parse.View.extend({
    id: 'join',
    template: _.template($("#joinTemplate").html()),
    events: {
        "click .selectArtist":      "selectArtist",
        "click .selectUser":        "selectUser",
        "keypress #inputUsername":  "initUsernameCheckTimer",
        "focus #inputEmail":        "showEmailForm",
        "submit form.signupForm":   "signUp",
        "click #facebookLogin":     "signUpWithFacebook"
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
        var that = this;
        var totalCount;
        this.username = this.$("#inputUsername").val().replace(/\W/g, '').toLowerCase();
        this.$("#inputUsername").val(this.username).removeClass('inputError').addClass('inputChecking');
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
            console.log(error); ///c
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
            console.log(error); ///c
            $(".signupForm .error").html(error.message).show();
            $(".signupForm button").removeAttr("disabled");
        });
        return false;
    },
    signUpWithFacebook: function(){
        var that = this;
        this.$("#facebookLogin").attr("disabled", "disabled");
        var user = new Parse.User();
        user.set('role', this.role);
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
                            } else {
                                var profile = new App.Models.ArtistProfile(); 
                            };
                            profile.set('user', user);
                            profile.set('username', that.username);
                            profile.set('name', response.name);
                            profile.set('desc', response.bio);
                            App.profile = profile;
                            return profile.save();
                        }).then(function(profile) {
                            var nav = new App.Views.Nav();
                            App.trigger('app:tour');
                            that.undelegateEvents();
                            delete that;
                        }, function(error) {
                            user.destroy().then(function(){
                                App.session.logout();
                                App.trigger('app:login');
                            });
                            $(".signupForm .error").html(error.message).show();
                            console.log(error); ///c
                        });
                    });
                } else {
                    var nav = new App.Views.Nav();
                    Parse.history.navigate('featured', {trigger: true});
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
    events: {
        "click [data-dismiss='fileinput'],[data-trigger='fileinput']":      "clear",
        "click .upload":                                                    "upload"
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
                this.tattoo = tattoo;

                App.myTattoos.add(tattoo);
                var tattoos = App.profile.relation("tattoos");
                tattoos.add(tattoo);
                return App.profile.save();
            }).then(function() {
                App.trigger('app:edit-tattoo', this.tattoo);
            }, function(error) {
                console.log(error); ///c
                $("#upload .error").html(error.message).show();
                $("#upload button").removeAttr("disabled");
            });
        }
    },
    onRender: function(){
    },
    cancel: function(e){
        App.trigger('app:modal-close');
    }
});

App.Views.ForgotPassword = Parse.View.extend({
    id: 'password',
    template: _.template($("#passwordResetTemplate").html()),
    events: {
      "submit form.passwordForm":   "resetPassword"
    },
    resetPassword: function(e){
        e.preventDefault();
        var info = $("#inputInfo").val();
        Parse.User.requestPasswordReset(info, {
          success: function() {
            this.$('p').html('Check your email for the password reset link!')
            setTimeout(function() { Parse.history.navigate('', {trigger: true}); }, 2400);
          },
          error: function(error) {
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
        //      view: _.template($('#userTour5Template').html())
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
        Parse.history.navigate("settings", {trigger: true});
        this.triggerCancel();
    },
    cancel: function(e){
        Parse.history.navigate("myprofile", {trigger: false});
    },
    onRender: function(){
    },
    cancel: function () {
        App.trigger('app:modal-close');
    }
});

App.Views.ArtistTour = Backbone.Modal.extend({
    template: _.template($('#tourTemplate').html()),
    id: 'tour',
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
        Parse.history.navigate("settings", {trigger: true});
    },
    onRender: function(){

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
        'click [href="#feedbackTab"]':  'feedbackTab',
        'click [href="#bugTab"]':       'bugTab'
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


///////// Routers   ///c
App.Router = Parse.Router.extend({
    routes: {
        "":                             "index",
        "landing":                      "landing",
        "home":                         "home",
        "explore":                      "explore",
        "search":                       "search",
        "featured":                     "featured",
        "featured/p:page":              "featured",
        "artists":                      "artists",
        "artists/:books":               "artists",
        "tattoos":                      "tattoos",
        "tattoos/:books":               "tattoos",
        "about":                        "about",
        "join":                         "join",
        "login":                        "login",
        "forgot":                       "forgot",
        "interview":                    "interview",
        "feedback":                     "feedback",
        "bug":                          "bug",

        "myprofile":                    "myProfile",
        "myprofile/tour":               "tour",
        "myprofile/settings":           "settings",
        "myprofile/upload":             "upload",
        "myprofile/:tab":               "myProfile",
        "myprofile/edit/:id":           "editTattoo",

        "tattoo/:id":                   "tattooProfile",

        "user/:uname":                  "userProfile",
        "user/:uname/:tab":             "userProfile",

        ":uname":                       "artistProfile",
        ":uname/:tab":                  "artistProfile"
    },
    initialize: function(){
        console.log('router init');        ///c 
        // for modal routers    ///c
        this.hitRoutes = [];
        this.on('all', function () { this.hitRoutes.unshift(Parse.history.getFragment()); }, this);
        this.on('all', function () { console.log(Parse.history.getFragment() + ' added to hitRoutes'); }, this); ///c

        App.controller.initialize();
        //google analtic tracking   ///c
        this.bind('route', this._pageView);
    },
    back: function () {
        console.log('router back called');        ///c 
        if (this.hitRoutes.length > 1) {
            window.history.back();
        } else {
            this.index();
        }
    },

    /*                                                                                                                                     ///c
        Options: Parses current url hash fragment and query string into a common options objects, to be used in view initialization.       ///c
        	Accepts:                                                                                                                       ///c
        		/Color+Black-And-Gray?showMap=true&location=London                                                                         ///c
        	Returns:                                                                                                                       ///c
    	    	{                                                                                                                          ///c
    				books: ['Color',Black And Gray'],                                                                                      ///c
    				showMap: true,                                                                                                         ///c
    				location: London                                                                                                       ///c
    			}                                                                                                                          ///c
    */                                                                                                                                     ///c
	options: function () {
		var fragment = Parse.history.getFragment();

		var pathIndex = fragment.indexOf('/');
		var qsIndex = fragment.indexOf('?');
		if (qsIndex === -1) qsIndex = fragment.length;
		if (pathIndex === -1) pathIndex = qsIndex;
		
		var path = fragment.substring(pathIndex + 1, qsIndex);
		var qs = fragment.substring(qsIndex + 1, fragment.length)

		var options = {};
		options.books = path ? path.split('-').join(' ').split('+') : [];
		if (qs.indexOf('&') !== -1) {
			_.each(qsIndex.split('&'), function (kvp) {
				_addOption(options, kvp);
			});
		} else {
			_addOption(options, qs);
		}
		return options;

		function _addOption(options, kvp) {
			var kv;
			if ((kvp.indexOf('=') !== -1) 
				&& ((kv = kvp.split('=')).length === 2)) {
				options[kv[0]] = kv[1];
			}
		}
	},
    index: function(){
        console.log('route index'); ///c
        App.controller.index();
    },
    landing: function(){
        console.log('route landing');   ///c
        App.controller.landing();
    },
    home: function(){
        console.log('route home');  ///c
        this.explore();
    },
    explore: function(){
        console.log('route explore');   ///c
        App.controller.explore();
    },
    search: function(){
        console.log('route search');    ///c
        App.controller.search();
    },
    featured: function(page) {
        console.log('route featured : ' + page);    ///c
        App.controller.featured(page);
    },
    artists: function(/*books*/){
        console.log('route artists');   ///c
        App.controller.artists(this.options());
    },
    tattoos: function(/*books*/){
        console.log('route tattoos');   ///c
        App.controller.tattoos(this.options());
    },
    about: function(){
        console.log('route about'); ///c
        App.controller.about();
    },
    join: function(){
        console.log('route join');  ///c
        App.controller.join();
    },
    login: function(){
        console.log('route login'); ///c
        App.controller.login();
    },
    forgot: function () {
        console.log('route forgot');    ///c
        App.controller.forgot();
    },
    interview: function(){
        console.log('route interview'); ///c
        App.controller.interview();
    },
    feedback: function(){
        console.log('route feedback');  ///c
        App.controller.feedback();
    },
    bug: function(){
        console.log('route bug');   ///c
        App.controller.bug();
    },
    myProfile: function(tab){
        console.log('route myProfile'); ///c
        App.controller.myProfile(tab);
    },
    tour: function(){
        console.log('route tour');  ///c
        App.controller.tour();
    },
    settings: function(){
        console.log('route settings');  ///c
        App.controller.settings();
    },
    editTattoo: function(id){
        console.log('show editTattoo'); ///c
        App.controller.editTattooById(id);
    },
    upload: function(){
        console.log('route upload');    ///c
        App.controller.upload();
    },
    tattooProfile: function(id){
        console.log('route tattooProfile'); ///c
        App.controller.tattooProfileById(id);
    },
    artistProfile: function(uname, tab){
        console.log('route artistProfile'); ///c
        App.controller.artistProfileByUname(uname, tab);
    },
    userProfile: function(uname, tab){
        console.log('route userProfile');   ///c
        App.controller.userProfileByUname(uname, tab);
    },
    //google analytic tracking - http://nomethoderror.com/blog/2013/11/19/track-backbone-dot-js-page-views-with-google-analytics/   ///c
    _pageView: function() {
      var path = Parse.history.getFragment();
      ga('send', 'pageview', {page: "/" + path});
    }
});


App.controller = (function () {
    var controller = {};

    controller.initialize = function (options) {
        console.log('controller init'); ///c
        App.viewManager.initialize();
        var that = this;
        App.on('app:index', function () { that.index(); });
        App.on('app:landing', function () { that.landing(); });
        App.on('app:explore', function () { that.explore(); });     
        App.on('app:search', function () { that.search(); });
        App.on('app:featured', function (page) { that.featured(page); });
        App.on('app:artists', function (options) { that.artists(options); });
        App.on('app:tattoos', function (options) { that.tattoos(options); });
        App.on('app:login', function () { that.login(); });
        App.on('app:forgot', function () { that.forgot(); });
        App.on('app:about', function () { that.about(); });
        App.on('app:join', function () { that.join(); });
        App.on('app:interview', function () { that.interview(); });
        App.on('app:feedback', function () { that.feedback(); });
        App.on('app:bug', function () { that.bug(); });
        App.on('app:myprofile', function (tab) { that.myProfile(tab); });
        App.on('app:tour', function () { that.tour(); });
        App.on('app:settings', function () { that.settings(); });
        App.on('app:upload', function () { that.upload(); });
        App.on('app:edit-tattoo-id', function (id) { that.editTattooById(id); });
        App.on('app:edit-tattoo', function (tattoo) { that.editTattoo(tattoo); });
        App.on('app:tattoo-profile-id', function (id) { that.tattooProfileById(id); });
        App.on('app:tattoo-profile', function (tattoo) { that.tattooProfile(tattoo); });
        App.on('app:user-profile-uname', function (uname, tab) { that.userProfileByUname(uname, tab); });
        App.on('app:user-profile', function (user, tab) { that.userProfile(user, tab); });
        App.on('app:artist-profile-uname', function (uname, tab) { that.artistProfileByUname(uname, tab); });
        App.on('app:artist-profile', function (artist, tab) { that.artistProfile(artist, tab); });
    }

    controller.destroy = function () {
        console.log('controller destory'); ///c
        App.off('app:index');
        App.off('app:landing');
        App.off('app:explore');
        App.off('app:search');
        App.off('app:featured');
        App.off('app:artists');
        App.off('app:tattoos');
        App.off('app:login');
        App.off('app:forgot');
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

    controller.index = function () {
        console.log('controller index');    ///c
        if (!Parse.User.current()){
            this.landing();
        } else {
            this.explore();
        }
    }

    controller.landing = function () {
        console.log('controller landing');  ///c
        var landing = new App.Views.Landing();
        $('#gutter').html(landing.render().el);
    }

    controller.explore = function () {
        console.log('controller explore');  ///c
        var explore = new App.Views.Explore();
        App.viewManager.show(explore);
        Parse.history.navigate('explore', { trigger: false });
    }

    controller.search = function (searchFor) {
        console.log('controller search');   ///c
        App.search = new App.Views.Search();
        App.viewManager.show(App.search);
        Parse.history.navigate('search', { trigger: false });
    }

    controller.featured = function (page) {
        console.log('controller featured : ' + page);   ///c
        var featuredArtists = new App.Collections.FeaturedArtists();
        featuredArtists.page = (page) ? page : 0;
        var featuredArtistPage = new App.Views.FeaturedArtistPage({ collection: featuredArtists });
        App.viewManager.show(featuredArtistPage);
        Parse.history.navigate('featured', { trigger: false });
    }

    controller.artists = function (options) {
        console.log('controller artists');  ///c
        var artists = new App.Views.ArtistsPage(options);
        App.viewManager.show(artists);
		if (Parse.history.fragment.indexOf('artists') !== 0) {
			Parse.history.navigate('artists', { trigger: false });	
		}
    }

    controller.tattoos = function (options) {
        console.log('controller tattoos');  ///c
        var tattoosPage = new App.Views.TattoosPage(options);
        App.viewManager.show(tattoosPage);
		if (Parse.history.fragment.indexOf('tattoos') !== 0) {
			Parse.history.navigate('tattoos', { trigger: false });	
		}
    }

    controller.login = function () {
        console.log('controller login');    ///c
        var login = new App.Views.Login();
        App.viewManager.show(login);
        Parse.history.navigate('login', { trigger: false });
    }

    controller.forgot = function () {
        console.log('controller forgot');   ///c
        var forgotPassword = new App.Views.ForgotPassword();
        App.viewManager.show(forgotPassword);
        Parse.history.navigate('forgot', { trigger: false });
    }

    controller.about = function () {
        console.log('controller about');    ///c
        var about = new App.Views.About();
        App.viewManager.show(about);
        if (!Parse.User.current()){
            var join = new App.Views.Join();
            $('#app').append(join.render().el);
        }
        Parse.history.navigate('about', { trigger: false });
    }

    controller.join = function () {
        console.log('controller join'); ///c
        var join = new App.Views.Join();
        App.viewManager.show(join);
        Parse.history.navigate('join', { trigger: false });
    }

    controller.interview = function () {
        console.log('controller interview');    ///c
        var interview = new App.Views.EditInterview();
        App.viewManager.show(interview);
        Parse.history.navigate('interview', { trigger: false });
    }

    controller.feedback = function () {
        console.log('controller feedback'); ///c
        var feedback = new App.Views.Feedback();
        App.viewManager.show(feedback);
        Parse.history.navigate('feedback', { trigger: false });
    }

    controller.bug = function () {
        console.log('controller bug');  ///c
        var bug = new App.Views.Feedback();
        App.viewManager.show(bug);
        bug.bugTab();
        Parse.history.navigate('bug', { trigger: false });
    }

    controller.myProfile = function (tab) {
        console.log('controller myprofile : ' + tab);   ///c
        var myProfile;
        if (Parse.User.current().attributes.role === 'user') {
            myProfile = new App.Views.UserProfile({ model: App.profile });
        } else {
            myProfile = new App.Views.ArtistProfile({ model: App.profile });
        }
        App.viewManager.show(myProfile);

        if (tab) {
            myProfile[tab+'Tab']();
        } else {
            Parse.history.navigate('myprofile', { trigger: false });
        }

    }

    controller.tour = function () {
        console.log('controller tour'); ///c
        this.myProfile();
        var tour;
        if (Parse.User.current().attributes.role === 'user') {
            tour = new App.Views.UserTour();
        } else {
            tour = new App.Views.ArtistTour();
        };
        App.viewManager.show(tour);
        Parse.history.navigate('myprofile/tour', { trigger: false });
    }

    controller.settings = function () {
        console.log('controller settings'); ///c
        this.myProfile();
        var settings = new App.Views.Settings();
        App.viewManager.show(settings);
        Parse.history.navigate('myprofile/settings', { trigger: false });
    }

    controller.upload = function () {
        console.log('controller upload');   ///c
        var upload = new App.Views.Upload();
        App.viewManager.show(upload);
        Parse.history.navigate('myprofile/upload', { trigger: false });
    }

    controller.editTattooById = function (id) {
        console.log('controller editTattooById : ' + id);   ///c
        App.query.tattooById(id)
            .then(function (tattoo) {
                controller.editTattoo(tattoo);
            },
            function (object, error) {
                console.log(error);
            });
    }

    controller.editTattoo = function (tattoo) {
        console.log('controller editTattoo : ' + tattoo.id);    ///c
        this.myProfile();
        var profile = new App.Views.EditTattoo({ model: tattoo });
        App.viewManager.show(profile);
        Parse.history.navigate('myprofile/edit/' + tattoo.id , { trigger: false });
    }

    controller.tattooProfileById = function (id) {
        console.log('controller tattooProfileById : ' + id);
        App.query.tattooById(id)
            .then(function (tattoo) {
                controller.tattooProfile(tattoo);
            },
            function (object, error) {
                console.log(error);
            });
    }

    controller.tattooProfile = function (tattoo) {
        console.log('controller tattooProfile : ' + tattoo.id); ///c
        var profile = new App.Views.TattooProfile({ model: tattoo });
        App.viewManager.show(profile);
        Parse.history.navigate('tattoo/' + tattoo.id , { trigger: false });
    }

    controller.userProfileByUname = function (uname, tab) {
        console.log('controller userProfileByUname : ' + uname + ' / ' + tab);  ///c
        App.query.usersProfile(uname)
            .then(function (user) {
                if (user) {
                    controller.userProfile(user, tab);
                } else {
                    App.trigger('app:index');
                    $('.intro').html("<h3>Couldn't find the user you were looking for...</h3>"); // to alert    ///c
                }
            },
            function (error) {
                console.log("Error: " + error.code + " " + error.message);  ///c
            });
    }

    controller.userProfile = function (user, tab) {
        console.log('controller userProfile : ' + user.get('username') + ' / ' + tab);  ///c
        var userProfile = new App.Views.UserProfile({model: user});
        App.viewManager.show(userProfile);
        if (tab) {
            userProfile[tab+'Tab']();
        } else {
            Parse.history.navigate('user/' + user.get('username'), { trigger: false });
        }        
    }

    controller.artistProfileByUname = function (uname, tab) {
        console.log('controller artistProfileByUname : ' + uname + ' / ' + tab);    ///c
        App.query.artistsProfile(uname)
            .then(function (artist) {
                if (artist) {
                    controller.artistProfile(artist, tab);
                } else {
                    App.trigger('app:user-profile-uname', uname);
                }
            }, 
            function (error) {
                console.log("Error: " + error.code + " " + error.message);
            });
    }

    controller.artistProfile = function (artist, tab) {
        console.log('controller artistProfile : ' + artist.get('username') + ' / ' + tab);  ///c
        var profile = new App.Views.ArtistProfile({ model: artist, tab: tab });
        App.viewManager.show(profile);
        if (tab) {
            profile[tab+'Tab']();
        } else {
            Parse.history.navigate(artist.get('username'), { trigger: false });
        }        
    }

    return controller;
})();

App.viewManager = (function ViewManager() {
    var currentView;
    var currentModal;

    function initialize() {
        console.log('view manager init');   ///c
        App.on('app:modal-close', closeModal);
    }

    function destroy() {
        App.off('app:modal-close');
    }

    function show(view) {
        console.log('view manager - show ');    ///c
        if (currentView && Backbone.Modal.prototype.isPrototypeOf(view)) {
            console.log('view manager - disabling view...');    ///c
            if (currentView.disable) { currentView.disable(); };
        } else if (currentView) {
            console.log('view manager - disposing view...');    ///c
            if (currentView.disable) { currentView.disable(); };
            currentView.remove();
            currentView = undefined;
        }

        if (currentModal) {
            console.log('view manager - disposing modal...');   ///c
            if (currentModal.disable) { currentModal.disable(); };
            currentModal.close();
            currentModal.remove();
            currentModal = undefined;
            $("body").css("overflow", "auto");
        }
        render(view);
    }

    function closeModal() {
        console.log('view manager - close modal');   ///c
        if (currentModal) {
            console.log('view manager - disposing modal...');   ///c
            if (currentModal.disable) { currentModal.disable(); };
            currentModal = undefined;
        }

        // checks if there is a view under the modal, routes accordingly    ///c
        if (currentView) {
            console.log('currentView is:');   ///c
            console.log(currentView);   ///c
            console.log('Routing to currentView: ' + App.router.hitRoutes[0]);  ///c
            Parse.history.navigate(App.router.hitRoutes[0], { trigger: false });
            currentView.initialize();
        } else {
            console.log('App.router.back() called');    ///c
            App.router.back();
        }
        App.transition.disableModal();
    }

    function render(view) {
        console.log('view manager - rendering...'); ///c
        if (Backbone.Modal.prototype.isPrototypeOf(view)) {
            return _renderModal(view);
        }
        return _renderView(view);
        
        function _renderModal(view, callback) {
            currentModal = view;
            $('#modalayheehoo').html(currentModal.render().el);
            App.transition.initModal();
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
        if ($(window).scrollTop().valueOf()) {
            console.log('Scrolling into view top scroll value: ' + $(window).scrollTop().valueOf() + 'from App.transition');    ///c
            $('body, html').animate({ scrollTop: 0 }, duration);    
        }
    }

    function initModal() {
        console.log('init modal called from App.transition');    ///c
        $("body").css("overflow", "hidden");
    }

    function disableModal() {
        console.log('disable modal called from App.transition');  ///c
        $("body").css("overflow", "auto");
    }

    return {
        scrollIntoView: scrollIntoView,
        initModal: initModal,
        disableModal: disableModal
    };
})();

App.query = (function () {
	var query = {};
	/* User profiles, return either [User|Artist]Profile dependant on user account */  ///c
	query.profile = function (user) {
		var user = user || App.session.user();
		var query = (user.attributes.role === 'user') ?
			new Parse.Query(App.Models.UserProfile) : 
			new Parse.Query(App.Models.ArtistProfile);
		query.equalTo('user', user);
		return query.first();
	}

	/* User profiles by username */    ///c
	query.usersProfile = function (uname) {
		var query = new Parse.Query(App.Models.UserProfile);
		query.equalTo("username", uname);
		return query.first();
	}

	/* Artist profiles by username */  ///c
	query.artistsProfile = function (uname) {
		var query = new Parse.Query(App.Models.ArtistProfile);
		query.equalTo("username", uname);
		return query.first();
	}

    /* Query users, by username and name */ ///c
    query.searchUsers = function (query) {
        var queryUsername = new Parse.Query(App.Models.UserProfile);
        queryUsername.matches("username", query, "i");

        var queryName = new Parse.Query(App.Models.UserProfile);
        queryName.matches("name", query, "i");

        var search = Parse.Query.or(queryUsername, queryName);
        return search.find();
    }

    /* Artists by username, name and shop */    ///c
    query.searchArtists = function (query) {
        var queryUsername = new Parse.Query(App.Models.ArtistProfile);
        queryUsername.matches("username", query, "i");
        var queryName = new Parse.Query(App.Models.ArtistProfile);
        queryName.matches("name", query, "i");
        var queryShop = new Parse.Query(App.Models.ArtistProfile);
        queryShop.matches("shop", query, "i");
        var search = Parse.Query.or(queryUsername, queryName, queryShop);
        return search.find();
    }

	/* Adds by user */ ///c
	query.adds = function (user) {
		var query = new Parse.Query(App.Models.Add);
		query.descending("createdAt");
		query.equalTo('user', user || App.session.user());
		query.include('tattoo');
		query.include('artistProfile');
		return query.find();
	}

	/* Tattoos, filter by books */ ///c
	query.tattoos = function (books, options) {
		var query = new Parse.Query('Tattoo');
		if (books && books.length > 0) {
			query.containsAll('books', books);
		}
		query.skip(options.skip || 0);
		query.limit(options.limit || 1000);
		query.include('artistProfile');
		query.descending(options.order || 'updatedAt');
		return query.find();
	}

	/* Tatttoos by profile, accepts the profile, book filters */   ///c
	query.tattoosByProfile = function (profile, books, options) {
		var query = profile.relation('tattoos').query();
	  	if (books && books.length > 0) {
			query.containsAll('books', books);
		}
        query.descending(options.order || 'updatedAt');
		query.skip(options.skip || 0);
		query.limit(options.limit || 1000);
		return query.find();
	}

	/* Tattoo by id */ ///c
	query.tattooById = function (id) {
		var query = new Parse.Query('Tattoo');
		return query.get(id);
	}

	/* Artists, filter either by location or date created */   ///c
	query.artists = function (location, books, options) {
		var query = new Parse.Query('ArtistProfile');
		
		if (location) {
			query.near("location", location);
		} else {
			query.descending('createdAt');
		}
		if (books && books.length > 0) {
			query.containsAll('books', books);
		}
		
        query.equalTo("complete", true);
		query.skip(options.skip || 0);
		query.limit(options.limit || 1000);
		return query.find();
	}

    /* Query artists count, expect to handle timeouts with results above 1000 */    ///c
    query.artistsCount = function (location, books) {
        var query = new Parse.Query('ArtistProfile');

        if (location) {
            query.near("location", location);
        } else {
            query.descending('createdAt');
        } 
        if (books && books.length > 0) {
            query.containsAll('books', books);
        }
        return query.count();
    }

	/* Query featured artists */   ///c
	query.featuredArtists = function (options) {
		var query = new Parse.Query('ArtistProfile');
		var today = new Date();
		query.lessThan("featureDate", today);
		query.descending("featureDate");
		query.skip(options.skip || 0);
		query.limit(options.limit || 1000);
		return query.find();
	}

	/* Query random featured artists */    ///c
	query.randomFeaturedArtists = function (options) {
		var query = new Parse.Query('ArtistProfile');
		query.exists('featureId');
		query.descending('featureId');
		return query.first().then( function (result) {
			query.skip(Math.floor(Math.random() * result.attributes.featureId));
			query.limit(options.limit || 1000);
			return query.find();
		});
	}

    /* Query all Global Books */    ///c
    query.allGlobalBooks = function () {
        var query = new Parse.Query('GlobalBook');
        query.limit(1000);
        return query.find();
    }

	return query;
})();

$(function() {
    App.start();
});