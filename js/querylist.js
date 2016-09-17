$('#search').on("click", function() {
  var des = document.getElementById('destination');
  var origin = document.getElementById('origin') 
  var posting = $.post(
    url,
    {
      origin: origin,
      destination: destination
    }
  );

  posting.done(function() {
    $('#querylist').removeClass('hide');
    $('#querylist').fadeIn("fast");
  });
});
