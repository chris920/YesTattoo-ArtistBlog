// // Prototype menu functions for testing
// $(document).ready(function(){
// 	var hideAll = function() {
//     $("html, body").animate({ scrollTop: 0 }, 200);
// 		$("#artistsPage").hide();
// 		$("#tattoosPage").hide();
// 		$("#artistProfile").hide();
// 		$("#aboutPage").hide();
// 		$("#homePage").hide();
// 		$("#authorsPage").hide();
// 		$("#userProfile").hide();
// 		$("#shopProfile").hide();
// 		$("#artistsPage").hide();
// 		$("#join").hide();
// 		$("#upload").hide();
// 		$("#settings").hide();
//     setTimeout(hideMore(), 600);
// 	};
// 	hideAll();
// 	$("#homePage").show();

// 	$('*[href$="#homePage"]').click(function(e){
// 		e.preventDefault();
// 		hideAll();
// 		$("#homePage").show();
// 	});
// 	$("#artistsbutton").click(function(e){
// 		e.preventDefault();
// 		hideAll();
// 		$("#artistsPage").show();

// 	});
// 	$("#tattoosbutton").click(function(e){
// 		e.preventDefault();
// 		hideAll();
// 		$("#tattoosPage").show();
// 	});
// 	$("#profilebutton").click(function(e){
// 		hideAll();
// 		$("#artistProfile").show();
// 	});
// 	$('*[href$="#artistProfile"]').click(function(e){
// 		e.preventDefault();
// 		hideAll();
// 		$("#artistProfile").show();
// 	});
// 	$('*[href$="#userProfile"]').click(function(e){
// 		e.preventDefault();
// 		hideAll();
// 		$("#userProfile").show();
// 	});
// 	$('*[href$="#join"]').click(function(e){
// 		e.preventDefault();
// 		hideAll();
// 		$("#join").show();
// 	});
// 	$('*[href$="#aboutPage"]').click(function(e){
// 		e.preventDefault();
// 		hideAll();
// 		$("#aboutPage").show();
// 	});
// 	$('*[href$="#authorsPage"]').click(function(e){
// 		e.preventDefault();
// 		hideAll();
// 		$("#authorsPage").show();
// 	});
// 	$('*[href$="#shopProfile"]').click(function(e){
// 		e.preventDefault();
// 		hideAll();
// 		$("#shopProfile").show();
// 	});
//   $('*[href$="#settings"]').click(function(e){
//     e.preventDefault();
//     hideAll();
//     $("#settings").show();
//   });
// });

// Prototype load more. 
var hideMore = function() {
   // hide showable content, for page changes
  $('#homePage .featuredArtist:gt(2)').hide();
  $('#portfolioTab .tattooImg:gt(11)').hide();
  $('#artistsPage .artistThumb:gt(7)').hide();

  // show the more arrows when changing pages
      if($('#homePage .featuredArtist:eq(7)').not(':visible')) {
        $('#homePage .load-fader, #homePage .load').show();
      }
      if($('#portfolioTab .tattooImg:eq(19)').not(':visible')) {
        $('#artistProfile .load-fader, #artistProfile .load').show();
      }
      if($('#artistsPage .artistThumb:eq(23)').not(':visible')) {
        $('#artistsPage .load-fader, #artistsPage .load').show();
      }
}
hideMore();

$(window).scroll(function () {
    if ($(document).height() <= $(window).scrollTop() + $(window).height()) {
      $('.featuredArtist:hidden:first').fadeIn("slow");
      if($('.featuredArtist:eq(7)').is(':visible')) {
        $('#homePage .load-fader, #homePage .load').hide();
      }
    }
});
$(window).scroll(function () {
    if ($(document).height() <= $(window).scrollTop() + $(window).height()) {
      $('#portfolioTab .tattooImg:hidden:first').fadeIn("slow");
      $('#portfolioTab .tattooImg:hidden:first').fadeIn("slow");
      $('#portfolioTab .tattooImg:hidden:first').fadeIn("slow");
      $('#portfolioTab .tattooImg:hidden:first').fadeIn("slow");
      if($('#portfolioTab .tattooImg:eq(19)').is(':visible')) {
        $('#artistProfile .load-fader, #artistProfile .load').hide();
      }
    }
});
$(window).scroll(function () {
    if ($(document).height() <= $(window).scrollTop() + $(window).height()) {
      for (var i = 0; i < 8; i++){
        $('#artistsPage .artistThumb:hidden:first').fadeIn("slow");
      }
      if($('#artistsPage .artistThumb:eq(23)').is(':visible')) {
        $('#artistsPage .load-fader, #artistsPage .load').hide();
      }
    }
});

////// Prototype Registration ~ Invite artist
$( '.showArtistRegistration' ).click(function( e ) {
  e.preventDefault();
  $('div.artistRegistration').css('display','block');
  $( this ).hide();

});



// // Google map
// var map;
// var mapStyles = [{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-100},{"lightness":20}]},{"featureType":"road","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-100},{"lightness":40}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-10},{"lightness":30}]},{"featureType": "water","elementType": "geometry.fill","stylers": [{ "color": "#d9d9d9" }]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"visibility":"simplified"},{"saturation":-60},{"lightness":10}]},{"featureType":"landscape.natural","elementType":"all","stylers":[{"visibility":"simplified"},{"saturation":-60},{"lightness":5}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]}];

// google.maps.event.addDomListener(window, 'load', init);
// function init() {
//     var mapLocation = new google.maps.LatLng(27.941897,-82.465071);
//     var mapOptions = {
//         zoom: 12,
//         center: mapLocation,
//         styles: mapStyles,
//         scrollwheel: false,
//         panControl: false,
//         mapTypeControl: false
//     };
//     var mapElement = document.getElementById('map');
//     map = new google.maps.Map(mapElement, mapOptions);

//     var mapMarker = new google.maps.Marker({
//         animation: google.maps.Animation.DROP,
//         position: mapLocation,
//         map: map,
//         icon: ' img/mapmarker.png'
//     });
// }

// // for responsive, resizes maps to the center, 
// var centerMap = function() {
//   var center = map.getCenter();
//   google.maps.event.trigger(map, "resize");
//   map.setCenter(center); 
// }
// google.maps.event.addDomListener(window, "resize", centerMap);


// // jquery location picker
// $(document).ready(function() {
//   $('#settingsMap').locationpicker({
//     location: {latitude: 37.8028601, longitude: -122.4130541},
//     radius: 0,
//     zoom: 12,
//     enableAutocomplete: true,
//     enableReverseGeocode: true,
//     styles: mapStyles,
//     inputBinding: {
//       locationNameInput: $('#settingsMapAddress')
//     },
//     onlocationnotfound: function(locationName) {
//       alert("Couldn't find "+locationName+", Try another address?");
//     }
//   });
// });


//////// Artists search Typeahead
// constructs the suggestion engine

var artistSearcher = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  limit: 12,
  local: [
    {
        "id": 0,
        "username": "Dixon",
        "name": "Angie Beck",
        "guid": "59128252-ff4c-480b-a3e6-5699b2208505",
        "isActive": false,
        "picture": "http://placehold.it/64x64",
        "shop": "VORATAK",
        "email": "angiebeck@voratak.com",
        "phone": "+1 (863) 468-2854",
        "address": "818 Harwood Place, Boykin, Kentucky, 3530",
        "about": "Ullamco ullamco voluptate fugiat deserunt dolor cupidatat elit nisi. Sunt do excepteur aliqua irure excepteur. Ullamco ad ipsum officia aute ullamco irure fugiat proident aliqua Lorem proident quis. Mollit enim nulla sunt quis ipsum labore est sit cupidatat veniam anim quis elit. Lorem mollit laboris ut deserunt.\r\nQuis amet Lorem ex est enim exercitation. Pariatur enim adipisicing ullamco mollit proident Lorem incididunt non incididunt. Ipsum laboris magna sunt laboris do Lorem dolor quis dolore dolore exercitation. Adipisicing adipisicing pariatur id quis duis aliquip consectetur culpa irure aute elit do. Reprehenderit consequat anim Lorem minim anim magna commodo. Esse aliqua dolor ullamco velit ullamco nisi aliqua dolor cupidatat consequat velit officia. Incididunt incididunt aliqua ullamco eu adipisicing voluptate anim ipsum et id sit veniam.\r\n",
        "registered": "2014-04-12T18:02:28 +07:00",
        "latitude": -65.353772,
        "longitude": -148.195422,
        "tags": [
            "consectetur",
            "aute",
            "dolor",
            "ut",
            "dolor",
            "ipsum",
            "cupidatat"
        ]
    },
    {
        "id": 1,
        "username": "Cline",
        "name": "Ray Jacobs",
        "guid": "6afd55e0-dc4d-4e49-8386-46047e3751e1",
        "isActive": true,
        "picture": "http://placehold.it/64x64",
        "shop": "LIMAGE",
        "email": "rayjacobs@limage.com",
        "phone": "+1 (863) 581-2713",
        "address": "619 Ralph Avenue, Robinson, Tennessee, 447",
        "about": "Nulla laboris reprehenderit voluptate in aliquip consequat commodo consectetur excepteur occaecat esse voluptate in aliqua. Ea incididunt laboris est eiusmod ea adipisicing occaecat sint consectetur nisi sint ex aliqua nulla. Dolore consectetur ad in nostrud laboris non sint enim.\r\nElit aliquip sit laborum Lorem voluptate amet ipsum non ad nisi duis amet esse. Minim ut officia eiusmod duis id aliqua est voluptate labore reprehenderit nisi. Do nulla fugiat cillum do cupidatat minim culpa. Est aliqua nostrud officia ex cupidatat nostrud ea. Laborum nulla amet amet voluptate ex fugiat aliquip elit in in.\r\n",
        "registered": "2014-03-27T18:44:30 +07:00",
        "latitude": -51.745301,
        "longitude": 46.378487,
        "tags": [
            "et",
            "ipsum",
            "laboris",
            "qui",
            "do",
            "magna",
            "commodo"
        ]
    },
    {
        "id": 2,
        "username": "Summers",
        "name": "Rebecca Holt",
        "guid": "1bdfe9f4-b355-43da-a0c7-e9b7f643db11",
        "isActive": false,
        "picture": "http://placehold.it/64x64",
        "shop": "INRT",
        "email": "rebeccaholt@inrt.com",
        "phone": "+1 (882) 413-2894",
        "address": "541 Albany Avenue, Riegelwood, Iowa, 4034",
        "about": "Esse tempor duis labore veniam ullamco dolore adipisicing. Irure ex deserunt reprehenderit consectetur incididunt et. Consequat occaecat aliquip deserunt incididunt occaecat nostrud anim. Irure excepteur deserunt nostrud in ipsum velit adipisicing eu. Nulla ullamco quis id et minim ad. Commodo sunt amet cillum excepteur adipisicing ea eiusmod tempor aute sunt aliquip quis. Exercitation eu fugiat commodo cupidatat.\r\nEt ad aliquip aliquip enim consequat tempor deserunt. Aliquip veniam aliquip officia aliquip magna tempor tempor anim. Adipisicing in anim consectetur ea quis. Enim laborum ullamco culpa nulla proident amet aliquip do. Enim sit Lorem laboris anim fugiat ut nisi nulla. Cupidatat elit quis aliquip nisi tempor consequat veniam.\r\n",
        "registered": "2014-04-23T02:41:34 +07:00",
        "latitude": 85.015136,
        "longitude": -123.419213,
        "tags": [
            "consectetur",
            "velit",
            "consequat",
            "consequat",
            "in",
            "occaecat",
            "aliqua"
        ]
    },
    {
        "id": 3,
        "username": "Oneill",
        "name": "Caldwell Sullivan",
        "guid": "56830d91-43af-4583-b5ba-daf087ec932b",
        "isActive": true,
        "picture": "http://placehold.it/64x64",
        "shop": "OVATION",
        "email": "caldwellsullivan@ovation.com",
        "phone": "+1 (897) 437-3286",
        "address": "261 Verona Place, Corinne, Virginia, 1749",
        "about": "Anim ex sunt eiusmod quis sint velit nostrud minim consectetur do veniam ullamco mollit. Sunt nisi ad nulla do amet ad ad ipsum cillum id. Amet in et officia adipisicing exercitation eu aliquip labore anim. Excepteur pariatur irure proident magna nostrud et aute. Minim esse officia quis officia labore est ea do dolore duis. Eiusmod cillum est deserunt culpa consectetur do amet culpa voluptate. Id ipsum aliqua labore excepteur quis exercitation Lorem ad pariatur culpa magna.\r\nDo non officia consequat cupidatat id culpa. Velit nulla cupidatat dolore eiusmod aute consequat non nulla eu ea aliquip quis. Fugiat magna Lorem fugiat fugiat culpa eiusmod sit nulla. Aliqua nisi ea irure esse eu occaecat enim. Ad tempor cillum ad adipisicing magna Lorem culpa. Ea veniam consectetur labore velit ipsum cupidatat.\r\n",
        "registered": "2014-01-13T03:32:06 +08:00",
        "latitude": -62.817427,
        "longitude": -84.613656,
        "tags": [
            "ipsum",
            "sunt",
            "labore",
            "magna",
            "culpa",
            "officia",
            "esse"
        ]
    },
    {
        "id": 4,
        "username": "Robinson",
        "name": "Butler Olsen",
        "guid": "7141f621-5823-40ef-b383-269b3239f586",
        "isActive": true,
        "picture": "http://placehold.it/64x64",
        "shop": "ZILODYNE",
        "email": "butlerolsen@zilodyne.com",
        "phone": "+1 (868) 510-3755",
        "address": "659 Livingston Street, Ferney, Arkansas, 3525",
        "about": "Deserunt adipisicing duis non incididunt non deserunt mollit magna in dolor commodo Lorem velit dolore. Mollit ullamco ea do cupidatat labore ut. Et fugiat quis aute consectetur mollit esse anim velit nostrud ipsum irure. Mollit occaecat eu irure in dolor excepteur aute anim anim exercitation. Reprehenderit dolore eu pariatur enim enim adipisicing irure amet officia occaecat. Ad commodo amet aute commodo. Voluptate anim aliquip nulla est ex sint laboris excepteur consequat incididunt enim dolor aliquip occaecat.\r\nProident elit esse pariatur aliqua. Enim pariatur ullamco sint ex minim commodo veniam anim duis veniam in duis nostrud nisi. Aliqua dolor reprehenderit velit labore est in sint aute laborum aliqua consequat tempor cillum consequat. Cillum Lorem proident et magna ex dolore dolore reprehenderit quis officia tempor exercitation velit. Lorem enim id incididunt nulla exercitation cupidatat dolore eu laboris ad non reprehenderit exercitation ipsum. Nisi laborum ut laboris adipisicing. Amet sit in veniam nisi consequat.\r\n",
        "registered": "2014-01-08T19:53:05 +08:00",
        "latitude": -33.666882,
        "longitude": 69.391857,
        "tags": [
            "nisi",
            "et",
            "do",
            "ipsum",
            "ullamco",
            "ut",
            "quis"
        ]
    },
    {
        "id": 5,
        "username": "Emerson",
        "name": "Sarah Richmond",
        "guid": "da8ba09a-f687-4084-9e54-d2319c1925b2",
        "isActive": false,
        "picture": "http://placehold.it/64x64",
        "shop": "PETICULAR",
        "email": "sarahrichmond@peticular.com",
        "phone": "+1 (964) 456-3836",
        "address": "857 Tompkins Place, Woodburn, Vermont, 2065",
        "about": "Sit deserunt laboris ut consectetur aute ea consectetur officia pariatur deserunt consequat et. Proident excepteur id minim laborum amet anim. Ad voluptate sint elit ullamco. Non ad ex aute irure. Do amet elit id veniam occaecat esse pariatur. Consequat sunt laboris dolore est ad ex culpa mollit aliqua adipisicing est. Eiusmod est in exercitation laborum reprehenderit anim aliqua cupidatat proident aliquip aute elit ex deserunt.\r\nConsequat cillum amet cillum mollit est cillum. Eu sit in eu exercitation laboris non. Ipsum nostrud aliquip adipisicing in et irure fugiat pariatur laboris eiusmod veniam ea veniam. Sit in sunt laboris consectetur voluptate.\r\n",
        "registered": "2014-02-24T11:02:31 +08:00",
        "latitude": -55.550022,
        "longitude": -137.927658,
        "tags": [
            "labore",
            "pariatur",
            "non",
            "in",
            "eiusmod",
            "non",
            "cupidatat"
        ]
    },
    {
        "id": 6,
        "username": "Espinoza",
        "name": "Antonia Nunez",
        "guid": "6d9cf47a-3fb9-4604-b460-d56c24263fe8",
        "isActive": true,
        "picture": "http://placehold.it/64x64",
        "shop": "EZENT",
        "email": "antonianunez@ezent.com",
        "phone": "+1 (844) 583-3145",
        "address": "900 Suydam Street, Marion, Washington, 7853",
        "about": "Duis proident labore qui enim laborum officia commodo veniam dolore non. Dolore Lorem occaecat velit ipsum nisi id cupidatat laborum ipsum. Exercitation esse ipsum aliqua consequat sit. Nostrud proident sit minim ullamco enim sunt adipisicing cillum ex. Sint incididunt anim ad qui dolor do nulla pariatur magna enim mollit proident duis elit. Qui sint ad nulla pariatur nisi id cillum ex cupidatat sunt magna.\r\nMollit nostrud magna do do officia amet ad enim ad elit fugiat commodo. Elit aute velit aute eu. Duis consectetur do deserunt tempor occaecat voluptate ullamco aliquip do ex. Sint deserunt est mollit ex laboris. Anim ex deserunt aliqua cillum aliqua Lorem laboris consequat. Excepteur ipsum consectetur irure aliquip nulla anim.\r\n",
        "registered": "2014-05-05T16:12:17 +07:00",
        "latitude": -56.115788,
        "longitude": 114.646057,
        "tags": [
            "laborum",
            "nulla",
            "anim",
            "cillum",
            "non",
            "Lorem",
            "incididunt"
        ]
    },
    {
        "id": 7,
        "username": "Johnston",
        "name": "Josefa Mcdowell",
        "guid": "e130973b-d1ad-4b07-90ab-18063410c6ee",
        "isActive": false,
        "picture": "http://placehold.it/64x64",
        "shop": "NAVIR",
        "email": "josefamcdowell@navir.com",
        "phone": "+1 (991) 451-2072",
        "address": "895 Knight Court, Carrizo, New Jersey, 6255",
        "about": "Nostrud occaecat aliquip adipisicing amet ad Lorem. Aute quis cillum cillum proident amet. Magna occaecat ullamco voluptate dolore qui enim pariatur Lorem cillum adipisicing elit dolor elit. Ullamco est aute pariatur minim non tempor non ipsum ut.\r\nNisi id velit ipsum ipsum Lorem dolor ad dolor do incididunt Lorem. Et veniam adipisicing commodo ex et deserunt occaecat sunt elit enim exercitation ea consectetur commodo. Esse aliqua reprehenderit ea occaecat do laboris reprehenderit. Irure irure aliquip adipisicing cillum velit consectetur et sit anim irure.\r\n",
        "registered": "2014-04-16T07:28:20 +07:00",
        "latitude": -63.362432,
        "longitude": -92.630504,
        "tags": [
            "nulla",
            "aliqua",
            "esse",
            "et",
            "aliquip",
            "proident",
            "sit"
        ]
    },
    {
        "id": 8,
        "username": "Guerra",
        "name": "Clemons Flynn",
        "guid": "bc9a3ebf-10b3-4670-a11b-b8a0fbdc7958",
        "isActive": true,
        "picture": "http://placehold.it/64x64",
        "shop": "NORSUL",
        "email": "clemonsflynn@norsul.com",
        "phone": "+1 (937) 437-2988",
        "address": "916 Jefferson Avenue, Yukon, South Dakota, 803",
        "about": "Laboris in Lorem ea laboris minim et eiusmod excepteur ea aliquip veniam. Commodo do aute adipisicing qui adipisicing veniam. Duis aliquip aute sint eu magna aliquip id cupidatat aliquip Lorem est aliquip occaecat est. Reprehenderit ullamco exercitation aliquip ipsum qui ex dolore laborum adipisicing sunt ex. Dolore labore ullamco laborum enim aute magna est sit anim proident magna minim. Laborum est ullamco nostrud ad do magna. Nostrud et excepteur duis est consequat commodo veniam exercitation ipsum ipsum esse cupidatat est eu.\r\nIrure laboris mollit adipisicing dolor dolore nostrud. Adipisicing anim fugiat cupidatat non ut non velit fugiat ut cupidatat eiusmod. Incididunt duis ad in minim.\r\n",
        "registered": "2014-02-08T11:31:57 +08:00",
        "latitude": -56.543556,
        "longitude": -25.294774,
        "tags": [
            "labore",
            "pariatur",
            "fugiat",
            "Lorem",
            "commodo",
            "occaecat",
            "cillum"
        ]
    },
    {
        "id": 9,
        "username": "Berg",
        "name": "Glenna Marsh",
        "guid": "4d07d14c-5c07-45b4-8238-ff1be7cf4ac1",
        "isActive": false,
        "picture": "http://placehold.it/64x64",
        "shop": "BICOL",
        "email": "glennamarsh@bicol.com",
        "phone": "+1 (854) 564-3582",
        "address": "243 Stone Avenue, Clarence, Idaho, 4925",
        "about": "Ipsum veniam anim sunt aute ad duis sunt eiusmod velit enim veniam occaecat commodo enim. Consequat ad tempor voluptate dolore aute excepteur duis. Cillum minim anim elit Lorem qui sunt occaecat deserunt cillum. Culpa commodo id incididunt aute anim Lorem labore minim. Non aute cupidatat dolor ex nisi consectetur amet ex. Ex do sint sint id labore do in minim reprehenderit officia id eiusmod. Consectetur veniam elit minim anim officia irure sit aliquip eu enim amet laborum pariatur.\r\nMollit qui deserunt nulla ea laborum ut magna veniam aliqua amet incididunt ullamco ex veniam. Aliquip nisi aliqua amet labore eiusmod ut nostrud in id. Anim deserunt nostrud id minim non et officia ipsum do. Aute consequat commodo laboris laboris qui irure nisi ea sint. Incididunt adipisicing nostrud sit in fugiat.\r\n",
        "registered": "2014-01-17T05:43:46 +08:00",
        "latitude": 0.776676,
        "longitude": -122.19715,
        "tags": [
            "ullamco",
            "veniam",
            "occaecat",
            "occaecat",
            "aliqua",
            "dolore",
            "elit"
        ]
    },
    {
        "id": 10,
        "username": "Phelps",
        "name": "Anderson Burns",
        "guid": "d93d1acf-7d52-4b4e-be2e-44935c5a75e9",
        "isActive": false,
        "picture": "http://placehold.it/64x64",
        "shop": "SUNCLIPSE",
        "email": "andersonburns@sunclipse.com",
        "phone": "+1 (853) 515-2571",
        "address": "162 Bennet Court, Sardis, New York, 9406",
        "about": "Laborum officia adipisicing pariatur consectetur nulla qui laboris officia dolore deserunt aute cupidatat. Fugiat commodo consectetur Lorem enim incididunt ea do in dolore qui ad quis incididunt cupidatat. Veniam proident eu eiusmod minim mollit.\r\nLabore eu proident Lorem sunt aliqua. Pariatur labore ullamco exercitation anim nulla voluptate laborum sunt aliqua dolor aliqua duis laboris magna. Exercitation commodo amet eiusmod proident. Proident ipsum velit reprehenderit est.\r\n",
        "registered": "2014-04-11T09:30:02 +07:00",
        "latitude": -4.680056,
        "longitude": 30.014187,
        "tags": [
            "reprehenderit",
            "sit",
            "in",
            "pariatur",
            "id",
            "labore",
            "ad"
        ]
    },
    {
        "id": 11,
        "username": "Whitehead",
        "name": "Elsie Shelton",
        "guid": "72dd5628-2ee1-4620-8eeb-4ca1c9785101",
        "isActive": true,
        "picture": "http://placehold.it/64x64",
        "shop": "QUONK",
        "email": "elsieshelton@quonk.com",
        "phone": "+1 (913) 562-2100",
        "address": "410 Irwin Street, Grenelefe, Georgia, 3724",
        "about": "Cillum sit enim est et nostrud nulla consectetur mollit mollit occaecat sint exercitation aute. Et Lorem irure duis culpa irure id occaecat ipsum dolor. Non non esse do occaecat adipisicing consequat nulla cupidatat in elit officia cillum est esse. Sit occaecat labore fugiat eiusmod in reprehenderit. Labore irure sint dolore ullamco culpa sunt et enim aute veniam consequat incididunt. Consectetur nisi aute aliqua adipisicing labore mollit. Amet sit ex voluptate occaecat eiusmod velit amet dolor eu ex nulla.\r\nAliquip reprehenderit qui culpa voluptate adipisicing ullamco elit cupidatat enim in sit aliquip cillum laboris. Tempor amet eu enim et ipsum irure. Labore aliquip consectetur ex aliqua magna pariatur Lorem nulla anim.\r\n",
        "registered": "2014-04-21T09:56:54 +07:00",
        "latitude": 70.942618,
        "longitude": -14.263264,
        "tags": [
            "magna",
            "ex",
            "nisi",
            "ad",
            "amet",
            "qui",
            "pariatur"
        ]
    },
    {
        "id": 12,
        "username": "Cannon",
        "name": "Parker Macdonald",
        "guid": "197fc1a3-ba26-47d1-b419-63da8f551816",
        "isActive": true,
        "picture": "http://placehold.it/64x64",
        "shop": "CINCYR",
        "email": "parkermacdonald@cincyr.com",
        "phone": "+1 (984) 426-2441",
        "address": "197 Gunther Place, Twilight, New Hampshire, 9235",
        "about": "Et fugiat aliqua pariatur laboris irure enim quis culpa minim commodo. Aute nostrud Lorem id quis nisi cillum ad minim tempor eu. Ullamco nisi nulla est exercitation et esse cupidatat ad est velit sunt elit. Pariatur laboris anim ea dolor laboris sunt magna Lorem cillum.\r\nConsectetur dolore cupidatat id elit. Lorem ullamco proident commodo duis aliquip fugiat proident voluptate incididunt amet ut adipisicing. In culpa ad dolore est esse ea dolore aliquip Lorem qui irure aute. Deserunt voluptate voluptate labore qui ut in cillum ad incididunt amet sunt. Adipisicing velit enim aliquip labore quis Lorem laborum sit eu excepteur veniam laborum. Incididunt eu nulla aliquip incididunt incididunt Lorem aute do.\r\n",
        "registered": "2014-04-11T10:41:43 +07:00",
        "latitude": -66.962742,
        "longitude": 70.189689,
        "tags": [
            "amet",
            "fugiat",
            "anim",
            "deserunt",
            "nisi",
            "aliqua",
            "incididunt"
        ]
    },
    {
        "id": 13,
        "username": "Crosby",
        "name": "Lora Lane",
        "guid": "de974b50-db5f-4c40-ad4d-ef954724962a",
        "isActive": true,
        "picture": "http://placehold.it/64x64",
        "shop": "HOPELI",
        "email": "loralane@hopeli.com",
        "phone": "+1 (872) 427-3665",
        "address": "848 Hicks Street, Driftwood, Maryland, 6742",
        "about": "Duis laborum voluptate proident id veniam sunt ipsum dolore cupidatat tempor duis enim eu. Esse fugiat consequat Lorem dolor Lorem quis. Ea quis incididunt excepteur laborum culpa eu et commodo do nostrud. Elit in cupidatat est incididunt sunt sit est in deserunt.\r\nConsectetur do eiusmod cillum eu officia cillum qui voluptate. Ullamco ullamco id mollit in anim ut incididunt cillum nulla laboris ut veniam dolore. Dolor aliquip aliquip elit dolor duis id.\r\n",
        "registered": "2014-02-05T21:16:35 +08:00",
        "latitude": 47.441513,
        "longitude": -29.94494,
        "tags": [
            "labore",
            "sint",
            "ullamco",
            "ullamco",
            "in",
            "duis",
            "commodo"
        ]
    },
    {
        "id": 14,
        "username": "English",
        "name": "Brandi Gallagher",
        "guid": "200e0cd9-822c-48d9-a099-0721eaf64be5",
        "isActive": true,
        "picture": "http://placehold.it/64x64",
        "shop": "VITRICOMP",
        "email": "brandigallagher@vitricomp.com",
        "phone": "+1 (950) 591-2995",
        "address": "827 Just Court, Convent, Maine, 9004",
        "about": "Proident minim quis do duis consequat aliquip qui nostrud deserunt commodo mollit. Consectetur eu sit mollit voluptate adipisicing magna anim Lorem eiusmod ipsum ea cupidatat dolor esse. Deserunt do dolore cupidatat ad commodo sunt exercitation esse ullamco occaecat amet. Cillum aute incididunt ea consectetur et mollit magna excepteur est. Deserunt eiusmod deserunt nostrud enim aute tempor duis est consectetur commodo.\r\nReprehenderit veniam enim ex amet ut. Ea ullamco irure veniam anim ad ea. Deserunt ipsum aute sint consectetur. Do eu cupidatat ea velit ullamco ipsum ipsum minim eiusmod et veniam. Veniam quis aliquip incididunt est sunt officia culpa qui tempor proident aute. Tempor Lorem cupidatat adipisicing pariatur.\r\n",
        "registered": "2014-04-10T07:58:48 +07:00",
        "latitude": -37.536513,
        "longitude": -175.855184,
        "tags": [
            "eiusmod",
            "ad",
            "elit",
            "magna",
            "proident",
            "aute",
            "est"
        ]
    },
    {
        "id": 15,
        "username": "Clarke",
        "name": "Callie Odonnell",
        "guid": "b4a5c9ec-e239-4d28-bfd8-a2a73f52ef5b",
        "isActive": false,
        "picture": "http://placehold.it/64x64",
        "shop": "INTRADISK",
        "email": "callieodonnell@intradisk.com",
        "phone": "+1 (875) 573-2281",
        "address": "806 Kaufman Place, Greenfields, Louisiana, 3029",
        "about": "Culpa consectetur mollit ut commodo anim irure exercitation et sunt cupidatat sint culpa magna id. Ex ut voluptate in ut magna fugiat magna minim velit exercitation eiusmod non. Est elit ex esse duis duis veniam consectetur labore proident dolore do irure anim. Quis fugiat sit consequat sint reprehenderit. Veniam nulla nisi nisi labore nulla dolore proident adipisicing ipsum. Ut sit ipsum duis qui ex deserunt est consectetur irure sunt ut. Aliqua ut deserunt occaecat id officia esse.\r\nEiusmod nulla officia et id cillum. Nulla Lorem ea qui duis aliquip qui ut aliquip dolore sint consequat. Aliqua deserunt proident consectetur laborum ut velit Lorem nisi amet voluptate ullamco. Non ad sunt ut dolor sint anim voluptate ullamco sunt irure qui consectetur. Ipsum do ex voluptate eiusmod nostrud labore dolore tempor.\r\n",
        "registered": "2014-04-05T04:59:35 +07:00",
        "latitude": 28.363563,
        "longitude": 115.932063,
        "tags": [
            "veniam",
            "quis",
            "incididunt",
            "esse",
            "excepteur",
            "ad",
            "dolore"
        ]
    },
    {
        "id": 16,
        "username": "Moran",
        "name": "Adeline Lewis",
        "guid": "3bf5ac4e-3b0f-4b34-8524-41cd2b43065f",
        "isActive": false,
        "picture": "http://placehold.it/64x64",
        "shop": "TERRAGO",
        "email": "adelinelewis@terrago.com",
        "phone": "+1 (924) 474-2558",
        "address": "811 Schenectady Avenue, Boomer, Wyoming, 8654",
        "about": "Eu voluptate labore et ut qui esse non Lorem laboris magna qui. Id consequat aliqua adipisicing cupidatat voluptate commodo fugiat proident mollit ipsum et sunt ex. Ullamco in amet quis consectetur in officia non ea elit incididunt ipsum sunt cillum. Deserunt esse pariatur mollit dolore id consequat duis non commodo ex. Lorem veniam dolor quis deserunt eiusmod ullamco consequat.\r\nEu aliqua esse consequat exercitation proident eiusmod. Laboris eu labore ut dolor culpa ea. Ipsum laborum aliqua proident duis culpa anim.\r\n",
        "registered": "2014-02-16T02:12:25 +08:00",
        "latitude": -66.032873,
        "longitude": -140.96357,
        "tags": [
            "esse",
            "nulla",
            "minim",
            "cillum",
            "dolor",
            "sunt",
            "officia"
        ]
    },
    {
        "id": 17,
        "username": "Pacheco",
        "name": "Wendi Ellison",
        "guid": "90ff3042-903a-47f2-b66c-a0f2b742ab5d",
        "isActive": false,
        "picture": "http://placehold.it/64x64",
        "shop": "COMVEYOR",
        "email": "wendiellison@comveyor.com",
        "phone": "+1 (952) 418-2210",
        "address": "461 Columbus Place, Norris, South Carolina, 5914",
        "about": "Magna ullamco enim et ullamco nostrud est est mollit veniam enim dolor. Deserunt non dolor laborum officia quis Lorem mollit aliquip nulla eiusmod qui laboris voluptate. Est occaecat eiusmod sit labore sit non reprehenderit laborum nostrud. Dolore sint ut ex consequat cupidatat do eu qui commodo sint sunt culpa nostrud excepteur.\r\nVoluptate irure voluptate pariatur irure et. Pariatur laborum non qui veniam culpa sint est ipsum laborum pariatur nulla sint dolore. Culpa tempor culpa et laborum ea aliquip quis cillum tempor sit cillum.\r\n",
        "registered": "2014-03-18T21:08:01 +07:00",
        "latitude": -63.696821,
        "longitude": -118.892708,
        "tags": [
            "mollit",
            "ullamco",
            "consequat",
            "esse",
            "voluptate",
            "laboris",
            "occaecat"
        ]
    },
    {
        "id": 18,
        "username": "Hudson",
        "name": "Liliana Shepard",
        "guid": "c9951c97-f9f3-495e-84fe-1106ffce2636",
        "isActive": false,
        "picture": "http://placehold.it/64x64",
        "shop": "ZENTHALL",
        "email": "lilianashepard@zenthall.com",
        "phone": "+1 (993) 467-3771",
        "address": "742 Williams Place, Boonville, North Dakota, 4975",
        "about": "Ut ad consequat dolore qui voluptate laboris. Cillum culpa adipisicing do nisi commodo cillum reprehenderit ipsum deserunt reprehenderit proident. Fugiat ad esse elit adipisicing minim dolore adipisicing nostrud id mollit eu fugiat consequat consectetur. Eiusmod fugiat in id consequat pariatur. Nisi deserunt mollit quis labore consectetur amet ea. Nisi occaecat dolor magna id sint minim officia do non ullamco aute amet veniam et. Ut esse aliqua sunt sit eiusmod nisi eu duis adipisicing ullamco exercitation deserunt adipisicing.\r\nNisi fugiat aliquip minim laboris dolor veniam in tempor eu voluptate velit. Ex ex cupidatat sit sit laborum fugiat ad. Minim consectetur nostrud sunt et ullamco ex. Cillum duis mollit dolore amet ea. Pariatur sit dolor anim in exercitation esse adipisicing ullamco nulla enim dolor dolor.\r\n",
        "registered": "2014-02-17T22:39:20 +08:00",
        "latitude": -75.296968,
        "longitude": 50.135262,
        "tags": [
            "amet",
            "fugiat",
            "consectetur",
            "culpa",
            "culpa",
            "est",
            "culpa"
        ]
    },
    {
        "id": 19,
        "username": "Parks",
        "name": "Meredith Hardin",
        "guid": "d080060b-3db0-46d4-9f65-3bbb742a2b1f",
        "isActive": false,
        "picture": "http://placehold.it/64x64",
        "shop": "BIOLIVE",
        "email": "meredithhardin@biolive.com",
        "phone": "+1 (865) 470-3679",
        "address": "468 Harbor Court, Wacissa, Nebraska, 7057",
        "about": "Proident est consequat mollit Lorem minim. Aliqua in cupidatat commodo sit non Lorem eu laborum non velit pariatur non est commodo. Dolore deserunt magna nisi dolore labore fugiat proident. Veniam esse nisi fugiat laboris. Excepteur mollit veniam laboris aliqua anim anim labore in. Proident nulla esse laborum ut consectetur veniam. Qui qui officia cillum labore mollit nisi enim sunt ea ut.\r\nFugiat eu cillum in nisi duis anim exercitation incididunt irure qui nostrud excepteur magna et. Non fugiat eu deserunt et esse consequat exercitation voluptate veniam mollit. Laboris veniam excepteur labore dolor velit dolor ex nulla in qui nulla exercitation occaecat. Laboris incididunt ea elit Lorem pariatur culpa commodo ut culpa. Nostrud consequat irure irure excepteur irure proident ut.\r\n",
        "registered": "2014-05-19T14:10:33 +07:00",
        "latitude": 9.413083,
        "longitude": -70.427206,
        "tags": [
            "reprehenderit",
            "sint",
            "veniam",
            "proident",
            "ad",
            "ad",
            "ad"
        ]
    },
    {
        "id": 20,
        "username": "Mcclain",
        "name": "Donna Callahan",
        "guid": "db318fc1-eb13-4bcf-830b-6ba7b58a03c9",
        "isActive": false,
        "picture": "http://placehold.it/64x64",
        "shop": "PERMADYNE",
        "email": "donnacallahan@permadyne.com",
        "phone": "+1 (981) 584-3552",
        "address": "738 Bridge Street, Whitewater, North Carolina, 4929",
        "about": "Aute reprehenderit sit aliquip laborum culpa ad qui. Ut dolor cillum laborum culpa aliqua ipsum anim pariatur enim. Excepteur ea fugiat consectetur aliqua proident eu sunt mollit veniam velit. Culpa Lorem ad anim incididunt mollit ipsum ex consectetur sunt ullamco duis dolore aliquip. Lorem ex cillum enim officia cillum fugiat sint. Eu in aliqua enim duis est occaecat ipsum. Consectetur magna enim consectetur elit Lorem in labore nisi cupidatat ullamco incididunt et anim.\r\nPariatur commodo exercitation veniam id mollit officia labore ut mollit aute enim. Incididunt nisi qui nostrud laborum excepteur dolor aliqua quis deserunt proident labore. Et officia aute minim ad do velit id est duis ad deserunt labore. Proident ex do voluptate amet officia occaecat esse non et ea aute eiusmod.\r\n",
        "registered": "2014-01-10T07:20:44 +08:00",
        "latitude": 43.459346,
        "longitude": -54.614504,
        "tags": [
            "esse",
            "labore",
            "reprehenderit",
            "consequat",
            "sunt",
            "ad",
            "aliqua"
        ]
    },
    {
        "id": 21,
        "username": "Bridges",
        "name": "Mcpherson Hyde",
        "guid": "89da8529-b49d-4b25-b81f-f45848be7963",
        "isActive": false,
        "picture": "http://placehold.it/64x64",
        "shop": "YOGASM",
        "email": "mcphersonhyde@yogasm.com",
        "phone": "+1 (877) 524-3497",
        "address": "682 Townsend Street, Summerset, Massachusetts, 519",
        "about": "In anim labore ea aliquip ex aliquip. Occaecat incididunt mollit et non ea do labore. Aute culpa nulla amet velit laborum aute laboris laborum ullamco dolor anim.\r\nEu reprehenderit proident sit nisi. Anim consectetur minim irure do veniam laborum consectetur irure ipsum fugiat reprehenderit occaecat incididunt Lorem. Et voluptate adipisicing cupidatat cillum commodo Lorem id veniam. Mollit anim dolor dolore qui dolore officia adipisicing mollit officia velit nisi. Nostrud mollit sint commodo labore voluptate laboris aute cillum occaecat incididunt est. Exercitation laboris velit nostrud nisi occaecat sit incididunt nisi velit quis in. Incididunt nulla amet nostrud incididunt voluptate aliqua.\r\n",
        "registered": "2014-04-07T08:31:50 +07:00",
        "latitude": 53.946416,
        "longitude": -154.632278,
        "tags": [
            "quis",
            "incididunt",
            "esse",
            "nisi",
            "labore",
            "sit",
            "proident"
        ]
    },
    {
        "id": 22,
        "username": "Villarreal",
        "name": "Russo Avery",
        "guid": "3e2c5860-0821-43ac-ab94-b4c20886e1b1",
        "isActive": false,
        "picture": "http://placehold.it/64x64",
        "shop": "FITCORE",
        "email": "russoavery@fitcore.com",
        "phone": "+1 (949) 488-3701",
        "address": "727 Whitney Avenue, Oasis, Minnesota, 252",
        "about": "Mollit qui velit cupidatat fugiat duis sunt incididunt nostrud nisi voluptate quis pariatur. Pariatur dolor veniam ipsum ut aute ullamco velit sint commodo exercitation laboris. Incididunt minim enim commodo pariatur consectetur mollit esse. Ex exercitation adipisicing aliqua duis dolore anim. Nostrud consequat occaecat labore nostrud velit excepteur commodo quis elit consectetur commodo cupidatat in.\r\nAliqua do do excepteur officia irure minim amet aliqua aliquip commodo sint sint duis. Nisi eiusmod officia ipsum adipisicing ad ea pariatur ex incididunt dolor pariatur ut. Nostrud aliquip Lorem est sint sunt mollit enim sint tempor. Consequat ea laboris aliquip officia ad labore pariatur aliqua pariatur minim esse ullamco. Proident qui consequat ex id. Lorem eiusmod sit exercitation aliquip ea ex in cupidatat. Veniam anim ea nulla mollit in ex dolore magna.\r\n",
        "registered": "2014-02-15T08:09:21 +08:00",
        "latitude": -15.018056,
        "longitude": 173.22212,
        "tags": [
            "aliqua",
            "dolor",
            "veniam",
            "pariatur",
            "magna",
            "velit",
            "ullamco"
        ]
    },
    {
        "id": 23,
        "username": "Duran",
        "name": "Linda Barrera",
        "guid": "491d6680-32c1-4d50-863b-2dd7d942ec39",
        "isActive": false,
        "picture": "http://placehold.it/64x64",
        "shop": "EARTHPLEX",
        "email": "lindabarrera@earthplex.com",
        "phone": "+1 (977) 491-3835",
        "address": "349 Montague Street, Steinhatchee, Connecticut, 9282",
        "about": "Officia duis id Lorem dolore cillum duis nulla proident proident. Eu aliqua irure non voluptate qui duis laborum proident. Tempor anim proident dolor exercitation et aliquip nulla deserunt in cupidatat labore. Esse cillum minim est laboris. Consectetur enim sunt ad ipsum dolore voluptate duis enim aliqua ut dolor.\r\nEu ad quis in eu anim non ad dolor labore esse. Nisi ea officia voluptate cupidatat pariatur cillum excepteur culpa ullamco labore. Reprehenderit sunt culpa ipsum culpa exercitation ad reprehenderit. Nulla tempor quis ex labore ex ut. Ut veniam voluptate excepteur laboris nostrud veniam mollit fugiat irure velit.\r\n",
        "registered": "2014-03-29T11:18:04 +07:00",
        "latitude": -30.650992,
        "longitude": 179.771834,
        "tags": [
            "est",
            "anim",
            "mollit",
            "qui",
            "aliquip",
            "occaecat",
            "nostrud"
        ]
    },
    {
        "id": 24,
        "username": "Sosa",
        "name": "Colon Baxter",
        "guid": "55d8332e-cede-48c3-8b89-b23ffe89ee9b",
        "isActive": true,
        "picture": "http://placehold.it/64x64",
        "shop": "PORTALIS",
        "email": "colonbaxter@portalis.com",
        "phone": "+1 (924) 487-2486",
        "address": "304 Coventry Road, Camas, Kansas, 6910",
        "about": "Ullamco occaecat enim ea reprehenderit officia est. Nulla culpa ex nostrud minim consectetur ipsum ipsum aute deserunt quis culpa nisi. Consectetur nisi sint quis ipsum laborum velit eu est aute. Veniam non laboris aute occaecat et deserunt occaecat incididunt occaecat ut aliquip eiusmod tempor sit. Lorem est aliquip commodo id pariatur irure ea aliqua cillum esse id est commodo.\r\nQui cillum esse ut amet anim laborum exercitation consequat pariatur dolor tempor. Aute occaecat in non aute officia cillum. Cillum non mollit esse culpa voluptate esse veniam nulla ex magna excepteur cupidatat eu. Aliquip ex anim enim eu. Labore sit veniam sit commodo sint ut. Ea sint qui eu occaecat mollit id dolore ea.\r\n",
        "registered": "2014-01-01T09:19:44 +08:00",
        "latitude": 9.079815,
        "longitude": -175.100487,
        "tags": [
            "laboris",
            "eiusmod",
            "proident",
            "ad",
            "mollit",
            "qui",
            "enim"
        ]
    },
    {
        "id": 25,
        "username": "Pennington",
        "name": "June Morales",
        "guid": "924dd898-961e-41d5-8d1f-4e95f4b659b8",
        "isActive": true,
        "picture": "http://placehold.it/64x64",
        "shop": "ZILIDIUM",
        "email": "junemorales@zilidium.com",
        "phone": "+1 (820) 415-3135",
        "address": "870 Jefferson Street, Felt, Delaware, 7075",
        "about": "Reprehenderit tempor sit laborum esse culpa nisi quis cupidatat. Adipisicing occaecat id minim nisi sit ut dolore cillum aliquip exercitation. Dolor excepteur incididunt qui ipsum laboris ea labore laboris sunt.\r\nOccaecat enim ex ut adipisicing duis aliquip fugiat ullamco fugiat est magna in labore sunt. Aliqua reprehenderit sit dolore esse velit. Elit minim ipsum in exercitation labore pariatur enim irure exercitation culpa. Incididunt duis elit ullamco adipisicing sit. Fugiat amet deserunt et ad cupidatat anim excepteur incididunt aute eiusmod exercitation reprehenderit dolor ex. Aute sunt aliquip nostrud ad cupidatat labore adipisicing commodo proident ut ex voluptate commodo.\r\n",
        "registered": "2014-01-29T05:33:54 +08:00",
        "latitude": 36.817334,
        "longitude": 147.944164,
        "tags": [
            "veniam",
            "incididunt",
            "nisi",
            "reprehenderit",
            "nisi",
            "ad",
            "eu"
        ]
    }]  //dummy data
  // prefetch: {
  //   // url points to a json file that contains an array of artist names, see
  //   // https://github.com/twitter/typeahead.js/blob/gh-pages/data/countries.json
  //   url: '',
  //   // Note: Bloodhound suggestion engine expects JavaScript objects so this converts all of
  //   // those strings
  //   filter: function(list) {
  //     return $.map(list, function(artist) { return { name: artist }; });
  //   }
  // }
});
 
// kicks off the loading/processing of `local` and `prefetch`
artistSearcher.initialize();
 
// passing in `null` for the `options` arguments will result in the default
// options being used
$('#artistSearch .typeahead').typeahead(null, {
  name: 'artists',
  displayKey: 'name',
  // `ttAdapter` wraps the suggestion engine in an adapter that
  // is compatible with the typeahead jQuery plugin
  source: artistSearcher.ttAdapter()
  ,
  templates: {
    // empty: [
    //   '<div class="empty-message">',
    //   'No artist under that name, Invite them?',
    //   '</div>'
    // ].join('\n'),
    suggestion: _.template('<p><%= name %>&nbsp;&nbsp;<strong>/&nbsp;<%= username %></strong></p>')
  }
});

var collections = ['Realistic','Old Skool','Black & White','Abstract','Gray Wash',
'Celtic','Bio-mechanical','Color', 'Tribal','Surrealist','Cartoon','White Ink', 'Polynesian', 'Asian', 'Animal', 'Flower', 'Skull', 'Japanese', 'Sexy', 'Fantasy', 'Bold','Graphic','Refined','Old West'
];  //dummy data

var collectionSearcher = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('collection'),
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  limit: 12,
  local:  $.map(collections, function(i) { return { collection: i }; })  //dummy data
  // prefetch: {
  //   // url points to a json file that contains an array of artist names, see
  //   // https://github.com/twitter/typeahead.js/blob/gh-pages/data/countries.json
  //   url: '',
  //   // Note: Bloodhound suggestion engine expects JavaScript objects so this converts all of
  //   // those strings
  //   filter: function(list) {
  //     return $.map(list, function(artist) { return { name: artist }; });
  //   }
  // }
});
 
// kicks off the loading/processing of `local` and `prefetch`
collectionSearcher.initialize();
 
// passing in `null` for the `options` arguments will result in the default
// options being used
$('#collectionSearch .typeahead').typeahead(null, {
  name: 'collections',
  displayKey: 'collection',
  // `ttAdapter` wraps the suggestion engine in an adapter that
  // is compatible with the typeahead jQuery plugin
  source: collectionSearcher.ttAdapter()
});


//artists location search
$('.changeLocation > .trigger').popover({
    html : true,
    title: function() {
      return $(this).parent().find('.head').html();
    },
    content: function() {
      return $(this).parent().find('.content').html();
    },
    container: 'body',
    placement: 'bottom'
});
//tag filter tooltip
$('.tagFilters > .btn-tag').tooltip({
    title: "Filter by collection",
    container: 'body',
    delay: { show: 1000, hide: 200 },
    placement: 'auto'
});



  