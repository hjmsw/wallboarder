var wb_tables = [];


$(function() {

  initTableEdit = function() {
    wb_tables.forEach(function(i) {
      $(i.t_elem).find("table").Tabledit(i.params);
    });
  };

  nr = $(".newRow");

  //Initialise Tabledit tables
  $(window).load(initTableEdit);
  nr.on("newRow", initTableEdit);

  $( ".draggable" ).draggable();

  $(".wb_table").hover(function() {
    $(this).find(".newRow").show();
  }, function() {
    $(this).find(".newRow").hide();
  });

  nr.click(function() {

    $(this).siblings("table").find("tbody").append("<tr><td></td><td></td></tr>");
    $(this).trigger("newRow");
  });

  $("#save").click(function() {
    wb = {
      title: "Test Wallboard",
      _id: "wallboard1",
      elems: []
    };


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

        elem.tableEditColumns = {
          "identifier": editable[0],
          "editable": editable
        }
      }

      wb.elems.push(elem);

    }).promise().done(function() {
      $.post( '/save', { wb: wb } );
    });
  });
});
