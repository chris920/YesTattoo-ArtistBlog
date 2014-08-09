
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



  