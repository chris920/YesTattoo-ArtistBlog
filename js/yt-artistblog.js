
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
	    shop:"",
	    website:"",
	    ig:"",
	    address:"",
	    city:"",
	    state:"",
	    country:"",
	    fb:"",
	    email:"",
	    a3:"",
	    a2:"",
	    a1:"",
	    q3:"",
	    q2:"",
	    q1:"",
	    desc:"",
        type: 'artist',
        contacted: false
      };
	}
});


App.Models.FeaturedArtist = Backbone.Model.extend({});


///////// Views
App.Views.ArtistProfile = Backbone.View.extend({
	model: App.Models.Artist,
	id: 'artistProfile',
	template: _.template($("#artistTemplate").html()),
	initialize: function(){
		// this.model.on('change', this.render, this);
		// this.model.on('destroy', this.remove, this);
	},
	render: function(){
		var attributes = this.model.toJSON();
		this.$el.html(this.template(attributes));

		// var html = this.template();
		// $(this.el).append(html);
		return this;
	},
	remove: function(){
		this.$el.remove();
	}
});
App.Views.Intro = Backbone.View.extend({
	id: 'homePage',
	template: _.template($("#introTemplate").html()),
	render: function(){
		var html = this.template();
		$(this.el).append(html);
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
	render: function(){
		var html = this.template();
		$(this.el).append(html);
		return this;
	}
});
App.Views.FeaturedArtist = Backbone.View.extend({
	// events: {
	// 	"click": "viewProfile"
	// },
	// viewProfile: function(){

	// }
});


///////// Collections
App.Collections.Artists = Backbone.Collection.extend({
	model: App.Models.Artist
});

App.Views.ArtistProfiles = Backbone.View.extend({});

App.Views.FeaturedArtists = Backbone.Collection.extend({});


///////// Routers
App.Router = new (Backbone.Router.extend({
	routes: {
		"": 	  			"index",
		"about":   			"about",
		"register":         "register",
		":uname":   		"showArtist"
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
			    "fb":"https://www.facebook.com/joseperezjrtattoos",
			    "email":"jose@darkwatertattoos.com",
			    "a3":"",
			    "a2":"I tend to stick to realism and I like to choose the piece I'm tattoing",
			    "a1":"I've been tattoing for 8 years. I started in Mexico in a small town. I saw a prison tattoo magazine and me and my friends thought it would be cool to copy it. I moved back to Chicago and I was unemployed. I would do tattoo parties, but that's not a good thing . Then I helped a friend open up a shop and worked for him. Eventually, I opened my own shop. It was tough, I sold a lot of things, borrowed money, maxed out my credit . I was broke, I went to a tattoo convention with my girl at the time with only $12 in my pocket eating only taco bell. Then someone set up an appointment with me and made money from that... I got a lot of followers from word of mouth and now conventions are usually booked out.",
			    "q3":"",
			    "q2":"What do you love to tattoo?",
			    "q1":"How did you get into tattooing?"
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
			    "fb":"https://www.facebook.com/drew.romero.315",
			    "email":"ghosthousetattoo@live.com",
			    "a3":"",
			    "a2":"grim reapers all day everyday",
			    "a1":"i drew tattoo designs for friends whilst i was an art student and was offered an apprenticeship after a local tattooist saw them",
			    "q3":"",
			    "q2":"What do you love to tattoo?",
			    "q1":"How did you get into tattooing?"
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
			    "fb":"https://www.facebook.com/pages/YesTattoo/587599791252654",
			    "email":"davidbruehl@gmail.com",
			    "a3":"Growing up in Oklahoma, I was hindered by my state's illegality of tattooing. I finally ended up getting tattooed by a guy who had set up an underground shop. The tattoo was a sacred heart. I drew something to give him an idea of what I wanted, expecting him to draw something original, but he just copied what I had drawn verbatim. It came out nice, considering...",
			    "a2":"Painting, of course, and I'm starting to get into some craft stuff and assemblage. I've really been feeling the need to build things lately!",
			    "a1":"I focus on a bold, graphic, refined approach to tattooing influenced by folk traditions. My favorite subject matter are birds and other animals, and Americana imagery, especially the old west. (Copied from website bio) I do illustrative work heading towards folk aesthetics. I tailor my approach specifically to each tattoo, though, with my clients' desires and longevity first in mind.",
			    "q3":"",
			    "q2":"What inspires your art?",
			    "q1":"How would you describe your style?"
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
			    "fb":"https://www.facebook.com/bridgettattoo",
			    "email":"bridgettattoo4@hotmail.com",
			    "a3":"The first tattoo I did was a traditional swallow on a guys ankle.",
			    "a2":"I really want to tattoo movie/TV stuff, really badly! Iv only ever done one and that's a house of 1000 corpses sleeve I'm working on now.",
			    "a1":"For my art I'm inspired by horror, zombies, vampires, death. I love skulls, there's nearly always one in my drawings. My tattoos are more governed by what people want.",
			    "q3":"",
			    "q2":"What have you always wanted to tattoo?",
			    "q1":"What inspires your art?"
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
			    "state":"CA",
			    "country":"USA",
			    "fb":"https://www.facebook.com/christianmarektattoo",
			    "email":"christianmarektattoo1@gmail.com",
			    "a3":"",
			    "a2":"Thats a hard question i always want to tattoo something new i see things or think of things all day that i would love to tattoo on someone.some of these might be great ideas some might not hahaha but im always trying to push myself to the next level . i am actually about to start a full back piece on a serious collector who has amazing work on him.we are doing a collage of Bernini statues and i have always wanted to do this tattoo, and im super stoked to be able to do this tattoo along side of some other amazing artists i look up to like Carlos Rojas for example",
			    "a1":"i like all forms of art from beating on a bucket with a drum stick to spray can art on a wall anytime u can create something from nothing that u can lose yourself in is inspiring to me . but i think oil painting has got to be my favorite medium outside of tattooing,even though i dont get to paint as often as i would like im thirsty for more knowledge in oil painting techniques as well as always learning more tattooing techniques sometimes life gets in the way and you lose sight of the things that matter the most . for me art keeps me grounded and keeps my spirits high, there is no better feeling to me then when a client is in love with there art that you create for them",
			    "q3":"",
			    "q2":"What have you always wanted to tattoo?",
			    "q1":"What other artistic mediums are you interested in and why?"
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
			    "fb":"https://www.facebook.com/ben.martinez.3998263",
			    "email":"bendotmartinez@gmail.com",
			    "a3":"I am really wanting to tattoo a chihuahua version of the Virgin Mary!!! Any takers? Haha.",
			    "a2":"My inspiration and drive to be better all revolves around my co workers and everyone I work sound wanting to be better at what we do. Every single day we work we are learning and bettering ourselves. It's amazing.",
			    "a1":"My style is an illustrated version of my little reality I would say",
			    "q3":"",
			    "q2":"What inspires your art?",
			    "q1":"How would you describe your style?"
			  },
			  {
			    "id":7,
			    "username":"algarcia",
			    "name":"Al Garcia",
			    "shop":"Reserve Tattoo Co.",
			    "website":"http://www.flickr.com/photos/tattooal",
			    "ig":"tattooalgarcia",
			    "address":"7342 Mentor Ave.",
			    "city":"Mentor",
			    "state":"Ohio",
			    "country":"USA",
			    "fb":"https://www.facebook.com/ReserveTattooCo",
			    "email":"tattooal@gmail.com",
			    "a3":"",
			    "a2":"Another artistic medium that I'm interested in is photography. I got back into that about three years ago, And was doing a lot of landscape HDR photography. My barber asked me if I would shoot his wedding and I told him it wasn't really what I did but I would attempt it anyways. I told him only if you let me do it for free. After that first one the calls started coming in. In the three years that I've been doing wedding photography it has blown up a lot quicker than what I was anticipating. I've already had people calling me from out-of-state willing to fly me in for their wedding photography. It's become almost like having a second full-time job, And becoming more difficult to balance my time between the two.",
			    "a1":"Well when I first started tattooing I had more of a cartoony /new school style, but other artist didn't see it fitting into that category. Nowadays I push myself to do a bit of everything. Traditional, new school , script, black and gray, color realism , portraits... I think it's great when artist have there own \"style\" that they are know for, but for me, I've dedicated the last 14 years to mastering the art of tattooing and all styles that come with it. I've never felt comfortable with turning away clients because it's not \"style\" that I do. I've tried my best to stay well rounded with all styles. I still feel like I'm nowhere near mastering any particular style, But that keeps me motivated to go into work the next day and try harder and learn more. I'm blessed to be able to do what I love for living, I'm very humbled to know that people like what I do.",
			    "q3":"",
			    "q2":"What other artistic mediums are you interested in and why?",
			    "q1":"How would you describe your style?"
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
			    "fb":"https://www.facebook.com/DevineTattooDesigns",
			    "email":"nickdevine666@gmail.com",
			    "a3":"",
			    "a2":"It's funny, before I was a tattoer I was a personal trainer 2 years ago... I would do some drawings for billboards. Then I ended up drawing a design for this girl. From there I got into training with Skin Candy and eventually opened a new shop, Helter Skelter. It's been open for a year.",
			    "a1":"I would describe it as neotraditional... You might have noticed , I like to do skulls. I prefer to draw from scratch and draw my own version of the tattoo. If I can I like to draw the piece freehand.",
			    "q3":"",
			    "q2":"How did you get into tattooing?",
			    "q1":"How would you describe your style?"
			  }
			]
		);
		
	},
	index: function(){
		var intro = new App.Views.Intro();
		$('.app').html(intro.render().el);
		hideMore(); //prototype load more
	},
	showArtist: function(uname){
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
	}
	,
	register: function(){
		var register = new App.Views.Register();
		$('.app').html(register.render().el);
	}
}));

$(function(){ App.start() });