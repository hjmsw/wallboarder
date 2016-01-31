$(function() {

  $( ".draggable" ).draggable();

  $("#save").click(function() {
    wbJson = [];

    $(".wb").children().each(function() {
      i = $(this);

      elem = {
        firstElementChild: i.prop("tagName"),
        height: i.height(),
        width: i.width(),
        innerText: i.text()
      }

      wbJson.push(elem);
    }).promise().done(function() {
      $.post( '/save', { wb: wbJson } );
    });
  });
});
