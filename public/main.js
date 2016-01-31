$(function() {

  $( ".draggable" ).draggable();

  $("#save").click(function() {
    wbJson = [];

    $(".wb").children().each(function(index) {
      i = $(this);

      elem = {
        id: "wb_" + index,
        tagName: i.prop("tagName"),
        innerText: i.text(),
        style: [
          ["height",i.height()+"px"],
          ["width",i.width()+"px"],
          ["color",i.css("color")],
          ["position",i.css("position")],
          ["left",i.css("left")],
          ["top",i.css("top")]
        ]
      };

      if (i.children("table").length == 1) {
        elem.tagName = "table"
        delete elem.innerText;

        rows = [];

        i.find("tr").each(function(index) {
            row = []
            $(this).children().each(function() {
              row.push([$(this).prop("tagName"),$(this).text()]);
            });
            rows.push(row);
        });

        elem.struct = {
          rows: rows
        }
      }

      console.log(elem.struct);

      wbJson.push(elem);

    }).promise().done(function() {
      //$.post( '/save', { wb: wbJson } );
    });
  });
});
