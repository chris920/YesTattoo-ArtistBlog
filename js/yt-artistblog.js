
var App = new (Backbone.View.extend({
	Models: {},
	Views: {},
	Collections: {},
	events: {
		//simplifies html to use routers where needed
		"click [href^='/']": function(e){
			e.preventDefault();
			Backbone.history.navigate(e.target.pathname, {trigger: true});
			console.log('bb nav triggered'); //event test
			$("html, body").animate({ scrollTop: 0 }, 200);
		},
		//above target.pathname does not work for buttons.... Need to move to the view
		"click [href='/about']": function(e){
			e.preventDefault();
			Backbone.history.navigate('/about', {trigger: true});
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
		Backbone.history.start({pushState: true, root: '/'});

	}
}))({el: document.body});


///////// Models
App.Models.Artist = Backbone.Model.extend({
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


App.Models.FeaturedArtist = Backbone.Model.extend({

});


///////// Views
App.Views.ArtistProfile = Backbone.View.extend({
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

App.Views.Intro = Backbone.View.extend({
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

App.Views.FeaturedArtist = Backbone.View.extend({
	className: 'featuredArtist',
	template: _.template($("#featuredArtistTemplate").html()),
    events: {
      'click button, .artistProf, h4': 'viewProfile'
    },
	viewProfile: function(){
		//navigate to the specific model's username
		Backbone.history.navigate(this.model.attributes.username, {trigger: true});
		$("html, body").animate({ scrollTop: 0 }, 200);
	},
	render: function(){
		var attributes = this.model.toJSON();
		$(this.el).append(this.template(attributes));
		return this;
	}
});

App.Views.About = Backbone.View.extend({
	id: 'aboutPage',
	template: _.template($("#aboutTemplate").html()),
	render: function(){
		var html = this.template();
		$(this.el).append(html);
		return this;
	}
});

App.Views.Register = Backbone.View.extend({
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
App.Collections.Artists = Backbone.Collection.extend({
	model: App.Models.Artist
});

App.Collections.FeaturedArtists = Backbone.Collection.extend({

});




///////// Routers
App.Router = new (Backbone.Router.extend({
	routes: {
		"":						"home",
		"about":   				"about",
		"register":        	    "register",
		":uname":   			"showProfile"
	},
	initialize: function(){
		//temp demo data, populates collection of artists
		App.Collections.artists = new App.Collections.Artists(
			[
			  {
			    "id":1,
			    "username":"joseperezjrtattoos",
			    "name":"Jose Perez Jr.",
			    "shop":"Dark Water Tattoos",
			    "website":"https://www.jpjtattoos.com",
			    "ig":"joseperezjrtattoos",
			    "address":"S. Harlem Ave.",
			    "city":"Bridgeview",
			    "state":"Illinois",
			    "country":"USA",
			    "lat":41.7364188,
			    "lng":-87.7992315000000,
			    "fb":"https://www.facebook.com/joseperezjrtattoos",
			    "email":"jose@darkwatertattoos.com",
			    "a3":"",
			    "a2":"I tend to stick to realism and I like to choose the piece I'm tattoing",
			    "a1":"I've been tattoing for 8 years. I started in Mexico in a small town. I saw a prison tattoo magazine and me and my friends thought it would be cool to copy it. I moved back to Chicago and I was unemployed. I would do tattoo parties, but that's not a good thing . Then I helped a friend open up a shop and worked for him. Eventually, I opened my own shop. It was tough, I sold a lot of things, borrowed money, maxed out my credit . I was broke, I went to a tattoo convention with my girl at the time with only $12 in my pocket eating only taco bell. Then someone set up an appointment with me and made money from that... I got a lot of followers from word of mouth and now conventions are usually booked out.",
			    "q3":"",
			    "q2":"What do you love to tattoo?",
			    "q1":"How did you get into tattooing?",
			    "desc":"Established in 2009\nDark Water Tattoos opened realizing that a void in the tattoo industry needed to be filled. A family owned and operated business with respected art was a necessity, and a lack of personal service and tolerance for all people was missing in the industry. Dark Water Tattos wanted to create a sacred and special place where all would feel comfortable to receive their sacred mark."
			  },
			  {
			    "id":2,
			    "username":"drewromero",
			    "name":"Drew Romero",
			    "shop":"Ghost House Collective",
			    "website":"https://www.drewromero.blogspot.com",
			    "ig":"drew_romero",
			    "address":" 59 Green Lane",
			    "city":"Derby",
			    "state":"De1 1rs",
			    "country":"UK",
			    "lat":52.9203936,
			    "lng":-1.4779768999999305,
			    "fb":"https://www.facebook.com/drew.romero.315",
			    "email":"ghosthousetattoo@live.com",
			    "a3":"",
			    "a2":"grim reapers all day everyday",
			    "a1":"i drew tattoo designs for friends whilst i was an art student and was offered an apprenticeship after a local tattooist saw them",
			    "q3":"",
			    "q2":"What do you love to tattoo?",
			    "q1":"How did you get into tattooing?",
			    "desc":""
			  },
			  {
			    "id":3,
			    "username":"davidbruehl",
			    "name":"David Bruehl",
			    "shop":"RedLetter1",
			    "website":"https://www.brhltattoos.com",
			    "ig":"davidbruehl",
			    "address":"217 S Cedar Ave",
			    "city":"Tampa",
			    "state":"Florida",
			    "country":"USA",
			    "lat":27.941897,
			    "lng":-82.46507099999997,
			    "fb":"https://www.facebook.com/pages/YesTattoo/587599791252654",
			    "email":"davidbruehl@gmail.com",
			    "a3":"Growing up in Oklahoma, I was hindered by my state's illegality of tattooing. I finally ended up getting tattooed by a guy who had set up an underground shop. The tattoo was a sacred heart. I drew something to give him an idea of what I wanted, expecting him to draw something original, but he just copied what I had drawn verbatim. It came out nice, considering...",
			    "a2":"Painting, of course, and I'm starting to get into some craft stuff and assemblage. I've really been feeling the need to build things lately!",
			    "a1":"I focus on a bold, graphic, refined approach to tattooing influenced by folk traditions. My favorite subject matter are birds and other animals, and Americana imagery, especially the old west. (Copied from website bio) I do illustrative work heading towards folk aesthetics. I tailor my approach specifically to each tattoo, though, with my clients' desires and longevity first in mind.",
			    "q3":"",
			    "q2":"What inspires your art?",
			    "q1":"How would you describe your style?",
			    "desc":"I work at Redletter1 Tattoo Workspace in historic Hyde Park in Tampa, FL.<br><br>\n              I’m happy to take on clients for new projects, tattoo or otherwise.\n              Please contact me anytime by calling or texting 813-205-1879 or through this site (http://www.brhltattoo.com/) and we can set up an appointment.\n              I focus on a bold, graphic, refined approach to tattooing influenced by folk traditions. My favorite subject matter are women, flowers, birds and other animals, and Americana imagery, especially the old west.<br><br>\n              Thank you so much for looking at my work, I hope you enjoy it."
			  },
			  {
			    "id":4,
			    "username":"booganut",
			    "name":"Bridget Tunstall",
			    "shop":"Leviathan Tattoo Gallery",
			    "website":"https://www.facebook.com/bridgettattoo",
			    "ig":"bridget_tunstall",
			    "address":"356 Bridge rd",
			    "city":"Richmond",
			    "state":"Victoria",
			    "country":"Australia",
			    "lat":-37.81911729999999,
			    "lng":145.00319620000005,
			    "fb":"https://www.facebook.com/bridgettattoo",
			    "email":"bridgettattoo4@hotmail.com",
			    "a3":"The first tattoo I did was a traditional swallow on a guys ankle.",
			    "a2":"I really want to tattoo movie/TV stuff, really badly! Iv only ever done one and that's a house of 1000 corpses sleeve I'm working on now.",
			    "a1":"For my art I'm inspired by horror, zombies, vampires, death. I love skulls, there's nearly always one in my drawings. My tattoos are more governed by what people want.",
			    "q3":"",
			    "q2":"What have you always wanted to tattoo?",
			    "q1":"What inspires your art?",
			    "desc":"Tattooist and Prismacolor Pencil Artist working out of Leviathan Tattoo Gallery 356 Bridge rd Richmond"
			  },
			  {
			    "id":5,
			    "username":"cmarek",
			    "name":"Christian Marek",
			    "shop":"Sacred Art Tattoo",
			    "website":"http://renaissance-studios.com/",
			    "ig":"christianmarektattoo",
			    "address":"131 Avenida Victoria",
			    "city":"San Clemente",
			    "state":"California",
			    "country":"USA",
			    "lat":33.4255106,
			    "lng":-117.61263229999997,
			    "fb":"https://www.facebook.com/christianmarektattoo",
			    "email":"christianmarektattoo1@gmail.com",
			    "a3":"",
			    "a2":"Thats a hard question i always want to tattoo something new i see things or think of things all day that i would love to tattoo on someone.some of these might be great ideas some might not hahaha but im always trying to push myself to the next level . i am actually about to start a full back piece on a serious collector who has amazing work on him.we are doing a collage of Bernini statues and i have always wanted to do this tattoo, and im super stoked to be able to do this tattoo along side of some other amazing artists i look up to like Carlos Rojas for example",
			    "a1":"i like all forms of art from beating on a bucket with a drum stick to spray can art on a wall anytime u can create something from nothing that u can lose yourself in is inspiring to me . but i think oil painting has got to be my favorite medium outside of tattooing,even though i dont get to paint as often as i would like im thirsty for more knowledge in oil painting techniques as well as always learning more tattooing techniques sometimes life gets in the way and you lose sight of the things that matter the most . for me art keeps me grounded and keeps my spirits high, there is no better feeling to me then when a client is in love with there art that you create for them",
			    "q3":"",
			    "q2":"What have you always wanted to tattoo?",
			    "q1":"What other artistic mediums are you interested in and why?",
			    "desc":"Christian Marek, award winning tattoo artist. I've been tattooing for 15 years. Located in San Clemente, CA at Renaissance Tattoo Studios. Ink-Eeze Proteam Artist. Husband to Tessa Marek. To book an appointment please email:\nchristianmarektattoo1@gmail.com"
			  },
			  {
			    "id":6,
			    "username":"ironpaws",
			    "name":"Ben Martinez",
			    "shop":"GoodTimes Tattoo",
			    "website":"https://www.facebook.com/GoodTimesTattooSLC",
			    "ig":"ironpaws",
			    "address":"511 W 200 S #135",
			    "city":"Salt Lake City",
			    "state":"Utah",
			    "country":"USA",
			    "lat":40.7648199,
			    "lng":-111.90628720000001,
			    "fb":"https://www.facebook.com/ben.martinez.3998263",
			    "email":"bendotmartinez@gmail.com",
			    "a3":"I am really wanting to tattoo a chihuahua version of the Virgin Mary!!! Any takers? Haha.",
			    "a2":"My inspiration and drive to be better all revolves around my co workers and everyone I work sound wanting to be better at what we do. Every single day we work we are learning and bettering ourselves. It's amazing.",
			    "a1":"My style is an illustrated version of my little reality I would say",
			    "q3":"",
			    "q2":"What inspires your art?",
			    "q1":"How would you describe your style?",
			    "desc":"Live the Life that you Love"
			  },
			  {
			    "id":7,
			    "username":"tattooalgarcia",
			    "name":"Al Garcia",
			    "shop":"Reserve Tattoo Co.",
			    "website":"http://tattooal.blogspot.com/",
			    "ig":"tattooalgarcia",
			    "address":"7342 Mentor Ave.",
			    "city":"Mentor",
			    "state":"Ohio",
			    "country":"USA",
			    "lat":41.6517607,
			    "lng":-81.3792441,
			    "fb":"https://www.facebook.com/ReserveTattooCo",
			    "email":"tattooal@gmail.com",
			    "a3":"",
			    "a2":"Another artistic medium that I'm interested in is photography. I got back into that about three years ago, And was doing a lot of landscape HDR photography. My barber asked me if I would shoot his wedding and I told him it wasn't really what I did but I would attempt it anyways. I told him only if you let me do it for free. After that first one the calls started coming in. In the three years that I've been doing wedding photography it has blown up a lot quicker than what I was anticipating. I've already had people calling me from out-of-state willing to fly me in for their wedding photography. It's become almost like having a second full-time job, And becoming more difficult to balance my time between the two.",
			    "a1":"Well when I first started tattooing I had more of a cartoony /new school style, but other artist didn't see it fitting into that category. Nowadays I push myself to do a bit of everything. Traditional, new school , script, black and gray, color realism , portraits... I think it's great when artist have there own \"style\" that they are know for, but for me, I've dedicated the last 14 years to mastering the art of tattooing and all styles that come with it. I've never felt comfortable with turning away clients because it's not \"style\" that I do. I've tried my best to stay well rounded with all styles. I still feel like I'm nowhere near mastering any particular style, But that keeps me motivated to go into work the next day and try harder and learn more. I'm blessed to be able to do what I love for living, I'm very humbled to know that people like what I do.",
			    "q3":"",
			    "q2":"What other artistic mediums are you interested in and why?",
			    "q1":"How would you describe your style?",
			    "desc":"Reserve Tattoo Co. is complete custom and private tattoo only studio comprised of artists that work by appointment only. Check us out at reservetattoo.com"
			  },
			  {
			    "id":8,
			    "username":"nickdevine",
			    "name":"Nick Devine",
			    "shop":"Helter Skelter Tattoo Studio",
			    "website":"http://helterskeltertattoos.tumblr.com/",
			    "ig":"nickdevine",
			    "address":" 3 College St",
			    "city":"St. Helens",
			    "state":"WA10 1TF",
			    "country":"UK",
			    "lat":53.4547536,
			    "lng":-2.7384769000000233,
			    "fb":"https://www.facebook.com/DevineTattooDesigns",
			    "email":"nickdevine666@gmail.com",
			    "a3":"",
			    "a2":"It's funny, before I was a tattoer I was a personal trainer 2 years ago... I would do some drawings for billboards. Then I ended up drawing a design for this girl. From there I got into training with Skin Candy and eventually opened a new shop, Helter Skelter. It's been open for a year.",
			    "a1":"I would describe it as neotraditional... You might have noticed , I like to do skulls. I prefer to draw from scratch and draw my own version of the tattoo. If I can I like to draw the piece freehand.",
			    "q3":"",
			    "q2":"How did you get into tattooing?",
			    "q1":"How would you describe your style?",
			    "desc":"Artist and Tattoo Artist"
			  }
			]
		);
		
		//temp create a featured artist collection
		App.Collections.featuredArtists = new App.Collections.FeaturedArtists({});

	},
	home: function(){
		var intro = new App.Views.Intro();
		$('.app').html(intro.render().el);

		//temp render 3 featured artists
		var featuredArtist = new App.Views.FeaturedArtist({model: App.Collections.artists.models[0]});
		$('#featuredArtists').append(featuredArtist.render().el);
		var featuredArtist = new App.Views.FeaturedArtist({model: App.Collections.artists.models[1]});
		$('#featuredArtists').append(featuredArtist.render().el);
		var featuredArtist = new App.Views.FeaturedArtist({model: App.Collections.artists.models[2]});
		$('#featuredArtists').append(featuredArtist.render().el);

	},
	showProfile: function(uname){
		//selects particular profile to render
		var artist = App.Collections.artists.findWhere({username: uname});
		
		// If artist name is not found,
		//do nothing
		if (artist === undefined){
		console.log('Nothing found at '+uname)
		} else {
		//otherwise, create a new instance of the artist profile
		var artistProfile = new App.Views.ArtistProfile({model: artist});

		//render the artist profile
		$('.app').html(artistProfile.render().el);

		hideMore(); //prototype load more

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

$(function(){ 
	App.start();

	Parse.$ = jQuery;

	// Initialize Parse with DEMO Parse application javascript keys
	Parse.initialize("joOsSXgFk7vRHT5N6DHOg6dogxBhk73FF88qNZly",
	               "rAUugyr5fxT1InmnL7IPwhOBG8mXvF1eQRwyMObt");
});