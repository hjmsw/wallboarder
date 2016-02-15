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

    nr = $(".newRow");
    nr.on("newRow", initTableEdit);

    $(".wb_table").hover(function () {
        $(this).find(".newRow").show();
    }, function () {
        $(this).find(".newRow").hide();
    });

    $("#tableCols").change(function() {
        $(this).prop('disabled', true);
        if ($(this).val() > 0) {
            console.log("disabled until insert confirmed");
            cc = parseInt($(this).val());
            tId = Date.now();

            $(".wb").append(
                "<div id='"+tId+"' class='wb_table draggable resizable-table'><table class='table table-striped'><tbody>" +
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

            $("#"+tId).find("table").Tabledit(params);

            $("#colNames").append(function() {
                rhtml = "";
                for (var i = 0; i < cc; i++) {
                    rhtml += "<div class='form-group'><label for='colName_"+i+"'>Column "+i+" Name:</label><input type='text' id='colName_"+i+"' name='colName_"+i+"' class='form-control'></div>";
                }
                return rhtml;
            });

            $(".wb").trigger("update_wb");
            //initWbElems();
        }
    });

    nr.click(function () {
        cc = $(this).siblings("table").find("tr").first().children().length;
        $(this).siblings("table").find("tbody").append(bTRw(cc,"td"));
        $(this).trigger("newRow");
    });


});