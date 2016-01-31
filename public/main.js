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
        columns = [];

        i.find("tr").each(function(index) {
            row = []
            //each td or th
            $(this).children().each(function() {
              row.push([$(this).prop("tagName"),$(this).text()]);
            });
            if (index == 0) columns = row;
            rows.push(row);
        });

        elem.struct = {
          rows: rows
        }

        editable = []

        columns.forEach(function(e, i) {
          editable.push([parseInt(i), e[1]])
        });

        elem.tableEditData = {
          "editButton": false,
          "deleteButton": false,
          "hideIdentifier": false,
          "columns": {
              "identifier": editable[0],
              "editable": editable
          }
        }
      }

      console.log(JSON.stringify(elem));
      wbJson.push(elem);

    }).promise().done(function() {
      $.post( '/save', { wb: wbJson } );
    });
  });
});
