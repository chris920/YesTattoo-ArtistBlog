
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
				{username: "davidbruehl", name: "David Bruehl", id:1},
				{username: "ironpaws", name: "Ben Martinez", id:2},
				{username: "cmarek", name: "Christian Marek", id:3}
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