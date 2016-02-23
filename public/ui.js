/**
 * Created by james on 22/02/2016.
 */

$(function() {

    var Ui = {
        cancelButton: $("#wb-table-cancel"),
        confirmButton: $("#wb-table-confirm"),
        tableCols: $("#tableCols"),
        tableRows: $("#tableRows"),
        drg: $(".draggable"),
        wb: $(".wb"),


        init: function() {
            this.initSelectables();
            this.initDraggables();
            this.initResizables();
            this.setEvents();
        },

        initDraggables: function() {
            $(".draggable").draggable({
                grid: [10, 10],
                scroll: false,
                stack: "div"
            });
        },

        initResizables: function() {
            $(".resizable").resizable({
                autoHide: true,
                grid: [10, 10],
                handles: "n, ne, e, se, s, sw, w, nw"
            });

            $(".resizable-table").resizable({
                autoHide: true,
                grid: [10, 10],
                handles: "e, w"
            });
        },

        initSelectables: function() {
            var self = this;

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
                        self.clearTableForm(false, null);

                        self.tableCols.val(cols);
                        self.tableRows.val(rows);

                        $(".wb").trigger("newWbTable");
                    }
                }
            });
        },

        setEvents: function() {
            var self = this;
            $("#tableCols").change(function() {
                $(".wb").trigger("newWbTable");
            });

            $(".wb").on("clearTableForm", function(event, delete_table) {
                self.clearTableForm(delete_table);
            });

            this.drg.on({
                "dragstart":  function() {
                    $("#binIcon").effect("fade", 500, function () {
                        $(this).show();
                    })
                },
                "dragstop": function() {
                    $("#binIcon").effect("fade", 500, function() {
                        $(this).hide();
                    });
                    self.fixZindex();
                },
                "click": function() {
                    self.fixZindex();
                }
            });

            //Custom event - triggered when wallboard update required
            this.wb.on("update_wb", function() {
                self.init()
            });
        },

        /*
         * Reset insert table form - After table added / cancelled
         */
        clearTableForm: function(delete_table) {
            if (delete_table) {
                $("#" + $("#deleteTable").val()).remove();
            }

            $("#colNames").html("");

            var tc = $("#tableCols");
            var tr = $("#tableRows");
            tc.val("");
            tr.val("");

            $(".selectable").selectable("enable");
            tc.prop('disabled', false);

            this.cancelButton.addClass("hidden");
            this.confirmButton.addClass("hidden");
        },

        fixZindex: function() {
            //Make sure side panel (palette) has highest z-index when called
            var z_index = 0;
            $(".draggable").each(function() {
                if ($(this).css("z-index") >= z_index) z_index = $(this).css("z-index");
            });
            $("#plt").css("z-index", z_index+1);
        }
    };

    $(window).load(function() {
        var ui = Object.create(Ui);
        ui.init();
    });
});
