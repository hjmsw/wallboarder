/**
 * Created by james on 15/02/2016.
 */
var wb_tables = [];

$(function() {
    var wb = $(".wb");
    var cancelBtn = $("#wb-table-cancel");
    var confirmBtn = $("#wb-table-confirm");
    var tableRows = $("#tableRows");
    var tableCols = $("#tableCols");
    var colNames = $("#colNames");
    var cte = $(".col-th-edit");


    var Table = {
        container: null,
        table: null,
        columnCount: null,
        rowCount: 2,
        containerId: null,
        containerClass: "wb_table draggable editable resizable-table ui-widget-content",
        params: null,


        init: function() {
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

                this.setEvents();
            }
        },

        setEvents: function() {
            var self = this;

            this.container.on({
                mouseenter: function () {
                    $(this).find(".newRow").show();
                    $(this).find(".tabledit-delete-button").show();
                },
                mouseleave: function () {
                    $(this).find(".newRow").hide();
                    $(this).find(".tabledit-delete-button").hide();
                }
            });

            this.container.find(".tabledit-confirm-button").on("click", function() {
                $(this).parents("tr").remove();
            });

            this.container.find(".newRow").on("click", function() {
                self.table.find("tbody").append(self.buildRow(self.columnCount,1,"td"));
                self.init();
            });

            cancelBtn.click(function () {
                console.log(self.container);
                //wb.trigger("clearTableForm", [true, self.container])
            });
            confirmBtn.click(function () {
                wb.trigger("clearTableForm", [false, self.container])
            });
        },

        buildRow: function(cc, rc, el) {
            markup="";
            for (var i=0; i<rc; i++) {
                markup += "<tr>";
                for (var ii=0; ii<cc; ii++) markup += "<"+el+">...</"+el+">";
                markup += "</tr>";
            }
            return markup;
        },

        buildEditableParam: function (cc) {
            var eCols = [];
            for (var i = 0; i < cc; i++) eCols.push([i, "col" + i]);
            return eCols;
        },

        buildHeaderNameForm: function (cc) {
            var rhtml = "";
            for (var i = 0; i < cc; i++) {
                rhtml += "<div class='form-group'><label for='colName_" + i + "'>Column " + i + " Name:</label><input type='text' id='colName_" + i + "' name='colName_" + i + "' class='form-control col-th-edit'></div>";
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
                this.tableId = Date.now();


                if (tableRows.val() > 0) this.rowCount = parseInt(tableRows.val());

                $(".wb").append(
                    "<div id='" + this.tableId + "' class='"+this.containerClass+"' style='width:30%;'>" +
                    "<button class='newRow btn btn-sm btn-default'><span class='glyphicon glyphicon-plus'></span></button>" +
                    "<table class='table table-striped'><tbody>" +
                    this.buildRow(this.columnCount, 1, "th") +
                    this.buildRow(this.columnCount, this.rowCount, "td") +
                    "</tbody></table></div>");


                this.container = $("#" + this.tableId);

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

                this.setEvents();

                colNames.append(this.buildHeaderNameForm(this.columnCount));

                wb.trigger("update_wb");


                //Update table column header text
                cte.on("keyup", function () {
                    console.log("keyup fired");
                    a = $(this).attr("id").split("_");
                    col_index = a[a.length - 1];

                    $(wb_t.find("th")[col_index]).text($(this).val());

                    //Don't show confirm button if column title fields empty
                    cols_populated = true;
                    cte.each(function () {
                        if ($(this).val() === "") cols_populated = false;
                    });
                    if (cols_populated) confirmBtn.removeClass("hidden");
                });


            }
        }
    };

    //Events
    $(window).load(function() {

        wb_tables.forEach(function (i) {
            console.log(i);
            var table = Object.create(Table);
            table.container = $(i.t_elem);
            table.params = i.params;
            table.init();
        });

        $(".wb").on("newWbTable", function() {
            var table = Object.create(Table);
            table.init();
        });
    });


});