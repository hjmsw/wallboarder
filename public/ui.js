/**
 * Created by james on 22/02/2016.
 */

$(function() {
    var cancelBtn = $("#wb-table-cancel");
    var confirmBtn = $("#wb-table-confirm");

    /*
     * Reset insert table form - After table added / cancelled
     */
    function clearTableForm(delete_table, table) {
        console.log(table);
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

    //Events
    $(window).load(function() {
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

                    $(".wb").trigger("newWbTable");
                }
            }
        });

        $("#tableCols").change(function() {
            $(".wb").trigger("newWbTable");
        });

        $(".wb").on("clearTableForm", function(delete_table, table) {
            clearTableForm(delete_table, table);
        });
    });
});
