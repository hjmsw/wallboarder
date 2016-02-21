/**
 * Created by james on 15/02/2016.
 */
var wb_tables = [];

$(function() {
    var cancelBtn = $("#wb-table-cancel");
    var confirmBtn = $("#wb-table-confirm");
    var tableRows = $("#tableRows");

    /*
     * Initialise tabledit on elements in wb_tables global var
     */
    function initTableEdit() {
        //Avoid duplication of tabledit toolbar, we'll create a new one on re-init
        $(".tabledit-toolbar").each(function() {
            $(this).parents("td").remove();
        });

        wb_tables.forEach(function (i) {
           $(i.t_elem).find("table").Tabledit(i.params);
           setTableEvents($(i.t_elem));
        });
    }

    /*
     * Bind events to wb_table elements
     */
    function setTableEvents(elem) {
        elem.on({
            mouseenter: function () {
                $(this).find(".newRow").show();
                $(this).find(".tabledit-delete-button").show();
            },
            mouseleave: function () {
                $(this).find(".newRow").hide();
                $(this).find(".tabledit-delete-button").hide();
            }
        });

        elem.find(".tabledit-confirm-button").on("click", function() {
            $(this).parents("tr").remove();
        });

    }

    /*
     * Build Table Row/s
     */
    function bTR(cc, rc, el) {
        markup="";
        for (var i=0; i<rc; i++) {
            markup += "<tr>";
            for (var ii=0; ii<cc; ii++) markup += "<"+el+">...</"+el+">";
            markup += "</tr>";
        }
        return markup;
    }

    /*
     * Reset insert table form - After table added / cancelled
     */
    function clearTableForm(delete_table, table) {
        $("#colNames").html("");

        var tc = $("#tableCols");
        var tr = $("#tableRows");
        tc.val("");
        tr.val("");

        $(".selectable").selectable("enable");
        tc.prop('disabled', false);

        cancelBtn.addClass("hidden");
        confirmBtn.addClass("hidden");

        if (delete_table) table.remove();
    }

    function insertTable(elem) {
        cancelBtn.removeClass("hidden");

        $(".selectable").selectable("disable");
        elem.prop("disabled", true);
        tableRows.prop("disabled", true);

        if (elem.val() > 0) {
            var cc = parseInt(elem.val());
            var tId = Date.now();

            var rc = 2;
            if (tableRows.val() > 0) rc = parseInt($("#tableRows").val());

            $(".wb").append(
                "<div id='" + tId + "' class='wb_table draggable editable resizable-table' style='width:30%;'><table class='table table-striped'><tbody>" +
                bTR(cc, 1, "th") +
                bTR(cc, rc, "td") +
                "</tbody></table></div>");

            var editable = function (cc) {
                eCols = [];
                for (var i = 0; i < cc; i++) eCols.push([i, "col" + i]);
                return eCols;
            };

            var params = {
                editButton: false,
                deleteButton: true,
                hideIdentifier: false,
                toolbar: true,
                "columns": {
                    "identifier": [0, "col0"],
                    "editable": editable(cc)
                }
            };

            var wb_t = $("#" + tId).find("table");
            wb_t.Tabledit(params);


            setTableEvents($("#" + tId));


            $("#colNames").append(function () {
                var rhtml = "";
                for (var i = 0; i < cc; i++) {
                    rhtml += "<div class='form-group'><label for='colName_" + i + "'>Column " + i + " Name:</label><input type='text' id='colName_" + i + "' name='colName_" + i + "' class='form-control col-th-edit'></div>";
                }
                return rhtml;
            });

            $(".wb").trigger("update_wb");

            var cte = $(".col-th-edit");

            cte.on("keyup", function () {
                a = elem.attr("id").split("_");
                col_index = a[a.length - 1];

                $(wb_t.find("th")[col_index]).text(elem.val());

                //Don't show confirm button if column title fields empty
                cols_populated = true;
                cte.each(function () {
                    if (elem.val() === "") cols_populated = false;
                });
                if (cols_populated) confirmBtn.removeClass("hidden");
            });


            cancelBtn.click(function () {
                clearTableForm(true, wb_t)
            });
            confirmBtn.click(function () {
                clearTableForm(false, wb_t)
            });


        }
    }

    //Events
    $(window).load(function() {
        initTableEdit();

        //Setup our visual cols / rows selector
        $(".selectable").selectable({
            cancel: ".secondary",
            stop: function(event, ui) {
                if(!$(this).hasClass("ui-selectable-disabled")){
                    var cols = 0;
                    var rows = 0;

                    $(".selectable").find("li").each(function() {
                        if ($(this).hasClass("ui-selected")) {
                            switch ($(this).attr("data-row")) {
                                case "a":
                                    rows = 1;
                                    cols++;
                                    break;
                                case "b":
                                    rows = 2;
                                    break;
                                case "c":
                                    rows=3;
                                    break;
                            }
                        }
                    });
                    clearTableForm(false, null);
                    var tc = $("#tableCols");
                    var tr = $("#tableRows");

                    tc.val(cols);
                    tr.val(rows);
                    insertTable(tc);
                }
            }
        });
    });



    $("#tableCols").change(function() {
        insertTable($(this));
    });

    var nr = $(".newRow");

    nr.on("newRow", initTableEdit);

    nr.click(function () {
        //Calculate column count for table - 1 for tabledit toolbar
        var cc = $(this).siblings("table").find("tr").first().children().length -1;
        $(this).siblings("table").find("tbody").append(bTR(cc,1,"td"));
        $(this).trigger("newRow");
    });

});