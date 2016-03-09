/**
 * Created by james on 15/02/2016.
 */
var wb_tables = [];

$(function() {
    var cancelBtn = $("#wb-table-cancel");
    var confirmBtn = $("#wb-table-confirm");
    var tableRows = $("#tableRows");
    var tableCols = $("#tableCols");
    var colNames = $("#colNames");


    var Table = {
        container: null,
        table: null,
        columnCount: null,
        rowCount: 2,
        containerId: null,
        containerClass: "wb_table draggable editable resizable-table ui-widget-content",
        params: null,
        cte: $(".col-th-edit"),
        wb: $(".wb"),


        init: function(setEvents) {
            if (this.container === null) {
                this.buildTable();
            } else {
                //Avoid duplication of tabledit toolbar, we'll create a new one on re-init
                this.container.find(".tabledit-toolbar").each(function() {
                    $(this).parents("td").remove();
                });

                if (this.table === null) this.table = this.container.find("table");
                if (this.columnCount === null) this.columnCount = this.table.find("tr").first().children().length;

                this.table.Tabledit(this.params);

                if (setEvents) this.setEvents();
                else this.setRowEvents();
            }
        },

        setRowEvents: function() {
            this.container.find(".tabledit-confirm-button").on("click", function() {
                $(this).parents("tr").remove();
            });
        },

        setEvents: function() {
            var self = this;

            this.container.on({
                "dragstart":  function() {
                    $("#binIcon").effect("fade", 500, function () {
                        $(this).show();
                    })
                },
                "dragstop": function() {
                    $("#binIcon").effect("fade", 500, function() {
                        $(this).hide();
                    });
                    self.wb.trigger("fixZindex");
                },
                "click": function() {
                    self.wb.trigger("fixZindex");
                    wbChange = true;
                    self.wb.trigger("edit");
                }
            });

            this.container.on({
                mouseenter: function () {
                    $(this).find(".tabledit-delete-button, .tabledit-confirm-button, .newRow").css("visibility","visible");
                    $(this).find("td, th").addClass("wb_table_td_hover");
                },
                mouseleave: function () {
                    $(this).find(".tabledit-delete-button, .tabledit-confirm-button, .newRow").css("visibility","hidden");
                    $(this).find("td, th").removeClass("wb_table_td_hover");
                }
            });

            this.container.find(".tabledit-confirm-button").on("click", function() {
                $(this).parents("tr").remove();
            });

            this.container.find(".newRow").on("click", function() {
                self.table.find("tbody").append(self.buildRow(self.columnCount,1,"td"));
                self.init(false);
            });

            cancelBtn.click(function () {
                self.wb.trigger("clearTableForm", [true])
            });
            confirmBtn.click(function () {
                self.wb.trigger("clearTableForm", [false]);
            });

            //Update table column header text
            $(".col-th-edit").on("keyup", function () {
                var a = $(this).attr("id").split("_");
                var col_index = a[a.length - 1];

                $(self.container.find("th")[col_index]).text($(this).val());

                //Don't show confirm button if column title fields empty
                var cols_populated = true;
                $(".col-th-edit").each(function () {
                    if ($(this).val() === "") cols_populated = false;
                });
                if (cols_populated) confirmBtn.removeClass("hidden");
            });

            this.container.dblclick(function() {
                self.wb.trigger("startEdit", [$(this)]);
            });
        },

        buildRow: function(cc, rc, el) {
            markup="";
            for (var i=0; i<rc; i++) {
                markup += "<tr>";
                for (var ii=0; ii<cc; ii++) markup += "<"+el+"></"+el+">";
                markup += "</tr>";
            }
            return markup;
        },

        buildEditableParam: function (cc) {
            var eCols = [];
            for (var i = 0; i < cc; i++) eCols.push([i, "col" + i]);
            return eCols;
        },

        buildHeaderNameForm: function (cc, cid) {
            var rhtml = "";
            for (var i = 0; i < cc; i++) {
                rhtml += "<div class='form-group'><input id='deleteTable' type='hidden' value='"+cid+"'/><label for='colName_" + i + "'>Column " + i + " Name:</label><input type='text' id='colName_" + i + "' name='colName_" + i + "' class='form-control col-th-edit'></div>";
            }
            return rhtml;
        },

        buildTable: function() {
            cancelBtn.removeClass("hidden");

            $(".selectable").selectable("disable");
            tableCols.prop("disabled", true);
            tableRows.prop("disabled", true);

            if (tableCols.val() > 0) {
                this.columnCount = parseInt(tableCols.val());
                this.containerId = Date.now();


                if (tableRows.val() > 0) this.rowCount = parseInt(tableRows.val());

                $(".wb").append(
                    "<div id='" + this.containerId + "' class='"+this.containerClass+"' style='width:30%;'>" +
                    "<button class='newRow btn btn-sm btn-default'><span class='glyphicon glyphicon-plus'></span></button>" +
                    "<table class='table table-striped'><tbody>" +
                    this.buildRow(this.columnCount, 1, "th") +
                    this.buildRow(this.columnCount, this.rowCount, "td") +
                    "</tbody></table></div>");


                this.container = $("#" + this.containerId);

                this.params = {
                    editButton: false,
                    deleteButton: true,
                    hideIdentifier: false,
                    toolbar: true,
                    "columns": {
                        "identifier": [0, "col0"],
                        "editable": this.buildEditableParam(this.columnCount)
                    }
                };

                wb_tables.push({
                    t_elem: this.container,
                    params: this.params
                });

                this.table = this.container.find("table");
                this.table.Tabledit(this.params);

                colNames.append(this.buildHeaderNameForm(this.columnCount, this.containerId));

                this.setEvents();

                this.wb.trigger("update_wb");
            }
        }
    };

    //Events
    $(window).load(function() {

        wb_tables.forEach(function (i) {
            var table = Object.create(Table);
            table.container = $(i.t_elem);
            table.params = i.params;
            table.init(true);
        });

        $(".wb").on("newWbTable", function() {
            var table = Object.create(Table);
            table.init(true);
        });
    });


});