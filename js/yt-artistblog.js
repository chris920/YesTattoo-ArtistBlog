
var App = new (Backbone.View.extend({
	Models: {},
	Views: {},
	Collections: {},
	events: {
		//simplifies html to use routers where needed
		"click [href^='/']": function(e){
			e.preventDefault();
			Backbone.history.navigate(e.target.pathname, {trigger: true});
			$("html, body").animate({ scrollTop: 0 }, 200);
		}
	},
	start: function(){
		Backbone.history.start({pushState: true, root: '/'});
	}
}))({el: '.app'});


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
	render: function(){
		var html = this.template();
		$(this.el).append(html);
		return this;
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
App.Views.About = Backbone.View.extend({});
App.Views.FeaturedArtist = Backbone.View.extend({});


///////// Collections
App.Views.FeaturedArtists = Backbone.Collection.extend({});


///////// Routers
App.AppRouter = new (Backbone.Router.extend({
	routes: {
		"": 	  			"index",
		"uname":   			"showArtist"
	},
	initialize: function(){

	},
	index: function(){
		var intro = new App.Views.Intro();
		$('.app').html(intro.render().el);
		hideMore(); //prototype load more
	},
	showArtist: function(){
		var artistProfile = new App.Views.ArtistProfile();
		$('.app').html(artistProfile.render().el);
		hideMore(); //prototype load more
	}
}));

$(function(){ App.start() });