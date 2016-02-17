/**
 * Created by james on 15/02/2016.
 */
var wb_tables = [];

$(function() {

    function initTableEdit() {
        wb_tables.forEach(function (i) {
            $(i.t_elem).find("table").Tabledit(i.params);
        });
    }

    //Build Table Row
    function bTR(cc, el) {
        row = "<tr>";
        for (var i = 0; i < cc; i++) row += "<"+el+">Text</"+el+">";
        row += "</tr>";
        return row;
    }

    //Events
    $(window).load(initTableEdit);

    $(".wb_table").hover(function () {
        $(this).find(".newRow").show();
    }, function () {
        $(this).find(".newRow").hide();
    });

    $("#tableCols").change(function() {
        cancelBtn = $("#wb-table-cancel");
        confirmBtn = $("#wb-table-confirm");

        cancelBtn.removeClass("hidden");

        $(this).prop('disabled', true);
        if ($(this).val() > 0) {
            cc = parseInt($(this).val());
            tId = Date.now();

            $(".wb").append(
                "<div id='"+tId+"' class='wb_table draggable editable resizable-table' style='width:30%;'><table class='table table-striped'><tbody>" +
                bTR(cc, "th") +
                bTR(cc, "td") +
                bTR(cc, "td") +
                "</tbody></table></div>");

            editable = function(cc) {
                eCols = [];
                for (var i = 0; i < cc; i++) eCols.push([i, "col"+i]);
                return eCols;
            };

            params =  {
                editButton: false,
                deleteButton: false,
                hideIdentifier: false,
                toolbar: true,
                "columns": {
                    "identifier": [0, "col0"],
                    "editable": editable(cc)
                }
            };

            wb_t = $("#"+tId).find("table");
            wb_t.Tabledit(params);

            $("#colNames").append(function() {
                rhtml = "";
                for (var i = 0; i < cc; i++) {
                    rhtml += "<div class='form-group'><label for='colName_"+i+"'>Column "+i+" Name:</label><input type='text' id='colName_"+i+"' name='colName_"+i+"' class='form-control col-th-edit'></div>";
                }
                return rhtml;
            });

            $(".wb").trigger("update_wb");

            cte = $(".col-th-edit");

            cte.on("keyup", function() {
                a = $(this).attr("id").split("_");
                col_index = a[a.length-1];

                $(wb_t.find("th")[col_index]).text($(this).val());

                cols_populated = true;
                cte.each(function() {
                    if ($(this).val() === "") cols_populated = false;
                });
                if (cols_populated) confirmBtn.removeClass("hidden");
            });


            cancelBtn.click(function() {
                clearTableForm(true)
            });
            confirmBtn.click(function() {
                clearTableForm(false)
            });

            function clearTableForm(delete_table) {
                $("#colNames").html("");

                tc = $("#tableCols");
                tc.val("");
                tc.prop('disabled', false);

                cancelBtn.addClass("hidden");
                confirmBtn.addClass("hidden");

                if (delete_table) wb_t.remove();
            }
        }
    });

    nr = $(".newRow");

    nr.on("newRow", initTableEdit);

    nr.click(function () {
        cc = $(this).siblings("table").find("tr").first().children().length;
        $(this).siblings("table").find("tbody").append(bTRw(cc,"td"));
        $(this).trigger("newRow");
    });


});