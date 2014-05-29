// app.js

$(function() {

  Parse.$ = jQuery;

  // Initialize Parse
  Parse.initialize("joOsSXgFk7vRHT5N6DHOg6dogxBhk73FF88qNZly",
                   "rAUugyr5fxT1InmnL7IPwhOBG8mXvF1eQRwyMObt");


  window.ContactManager = {
    Models: {},
    Collections: {},
    Views: {},

    start: function() {

      var contacts = new ContactManager.Collections.Contacts(),
            router = new ContactManager.Router();

      router.on('route:home', function() {
        router.navigate('contacts', {
          trigger: true,
          replace: true
        });
      });

      router.on('route:showContacts', function() {

        var contactsView = new ContactManager.Views.Contacts({
          collection: contacts
        });

        $('.main-container').html(contactsView.render().$el);
      });

      router.on('route:newContact', function() {
        var newContactForm = new ContactManager.Views.ContactForm({
          model: new ContactManager.Models.Contact()
        });

        newContactForm.on('form:submitted', function(attrs) {
          attrs.id = contacts.isEmpty() ? 1 : (_.max(contacts.pluck('id')) + 1);
          contacts.add(attrs);
          router.navigate('contacts', true);
        });

        $('.main-container').html(newContactForm.render().$el);
      });


      router.on('route:editContact', function(id) {
        var contact = contacts.get(id),
            editContactForm;

        if (contact) {
          editContactForm = new ContactManager.Views.ContactForm({
              model: contact
          });

          editContactForm.on('form:submitted', function(attrs) {
            contact.set(attrs);
            router.navigate('contacts', true);
          });

          $('.main-container').html(editContactForm.render().$el);
        } else {
          router.navigate('contacts', true);
        }
      });
    }
  };



  // models/artist.js
  ContactManager.Models.Contact = Parse.Object.extend("contacts",{
    defaults: function (){
      return { 
        name: null,
        tel: null,
        email: null
        // shop: null,
        // loc: null
      };
    },

    initialize: function() {
      this.set('avatar', _.random(1, 15) + '.jpg');
    }
  });


  // collections/artists.js
  ContactManager.Collections.Contacts = Parse.Collection.extend({
    model: ContactManager.Models.Contact
  });

  // views/artist.js
  ContactManager.Views.Contact = Parse.View.extend({
    tagName: 'li',
    className: 'media col-md-6 col-lg-4',
    template: _.template($('#tpl-contact').html()),

    events: {
      'click .delete-contact': 'onClickDelete'
    },

    initialize: function() {
      this.listenTo(this.model, 'remove', this.remove);
    },

    render: function() {
      var html = this.template(this.model.toJSON());
      this.$el.append(html);
      return this;
    },

    onClickDelete: function(e) {
      e.preventDefault();
      this.model.collection.remove(this.model);
    }
  });

  // views/artists.js
  ContactManager.Views.Contacts = Parse.View.extend({
    template: _.template($('#tpl-contacts').html()),

  renderOne: function(contact) {
    var itemView = new ContactManager.Views.Contact({model: contact});
    this.$('.contacts-container').append(itemView.render().$el);
  },

  render: function() {

    var html = this.template();
    this.$el.html(html);

    this.collection.each(this.renderOne, this);

    return this;
    }
  });

  // views/contactForm.js

  ContactManager.Views.ContactForm = Parse.View.extend({
    template: _.template($('#tpl-new-contact').html()),

    events: {
      'submit .contract-form': 'onFormSubmit'
    },

    render: function() {
      var html = this.template(_.extend(this.model.toJSON(), {
        isNew: this.model.isNew()
      }));
      this.$el.append(html);
      return this;
    },

    onFormSubmit: function(e) {
      e.preventDefault();

      this.trigger('form:submitted', {
        name: this.$('.contact-name-input').val(),
        tel: this.$('.contact-tel-input').val(),
        email: this.$('.contact-email-input').val(),


        // user:    Parse.User.current(),
        // ACL:     new Parse.ACL(Parse.User.current())


      });


        this.model.save();


    }
  });


  //views/intro.js ~ The main view for the app
  var AppView = Parse.View.extend({
    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("#authorapp"),

    initialize: function() {
      this.render();
    },

    render: function() {
      if (Parse.User.current()) {
        new ContactManager.start();
      } else {
        new LogInView();
      }
    }
  });


  // views/login.js

  var LogInView = Parse.View.extend({
      events: {
        "submit form.login-form": "logIn",
        "submit form.signup-form": "signUp"
      },

      el: ".content",
      
      initialize: function() {
        _.bindAll(this, "logIn", "signUp");
        this.render();
      },

      logIn: function(e) {
        var self = this;
        var username = this.$("#login-username").val();
        var password = this.$("#login-password").val();
        
        Parse.User.logIn(username, password, {
          success: function(user) {
            new ManageTodosView();
            self.undelegateEvents();
            delete self;
          },

          error: function(user, error) {
            self.$(".login-form .error").html("Invalid username or password. Please try again.").show();
            this.$(".login-form button").removeAttr("disabled");
          }
        });

        this.$(".login-form button").attr("disabled", "disabled");

        return false;
      },

      signUp: function(e) {
        var self = this;
        var username = this.$("#signup-username").val();
        var password = this.$("#signup-password").val();
        var email = this.$("#signup-email").val();
        
        Parse.User.signUp(username, password, { ACL: new Parse.ACL(), email: email }, {
          success: function(user) {
            new ManageTodosView();
            self.undelegateEvents();
            delete self;
          },

          error: function(user, error) {
            self.$(".signup-form .error").html(error.message).show();
            this.$(".signup-form button").removeAttr("disabled");
          }
        });

        this.$(".signup-form button").attr("disabled", "disabled");

        return false;
      },

      render: function() {
        this.$el.html(_.template($("#login-template").html()));
        this.delegateEvents();
      }
  });





  // js/router.js
  ContactManager.Router = Parse.Router.extend({
    routes: {
      '': 'home',
      'contacts': 'showContacts',
      'contacts/new': 'newContact',
      'contacts/edit/:id': 'editContact'
    }
  });


  new ContactManager.Router;
  new AppView;
  Parse.history.start();
});


