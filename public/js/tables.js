/**
 * Created by james on 15/02/2016.
 */
var wb_tables = [];


(function() {
    /**
     *
     * @param container
     * @param params
     * @constructor
     */
    function Table(container, params) {
        this.container = container;
        this.params = params;
        this.table = null;
        this.columnCount = null;
        this.rowCount = 2;
        this.containerId = null;
        this.containerClass = "wb_table draggable editable resizable-table ui-widget-content";
        this.wb = $(".wb");
        this.cancelBtn = $("#wb-table-cancel");
        this.confirmBtn = $("#wb-table-confirm");
        this.tableRows = $("#tableRows");
        this.tableCols = $("#tableCols");
        this.colNames = $("#colNames");

        this.init(true);
    }

    /**
     *
     * @param setEvents
     */
    Table.prototype.init = function(setEvents) {
        if (this.container === undefined) {
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
    };

    /**
     *
     */
    Table.prototype.setRowEvents = function() {
        this.container.find(".tabledit-confirm-button").on("click", function() {
            $(this).parents("tr").remove();
        });
    };

    /**
     *
     */
    Table.prototype.setEvents = function() {
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

        self.cancelBtn.click(function (event) {
            event.preventDefault();
            self.wb.trigger("clearTableForm", [true])
        });
        self.confirmBtn.click(function (event) {
            event.preventDefault();
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
            if (cols_populated) self.confirmBtn.removeClass("hidden");
        });

        this.container.dblclick(function() {
            self.wb.trigger("startEdit", [$(this)]);
        });
    };

    /**
     *
     * @param cc
     * @param rc
     * @param el
     * @returns {string}
     */
    Table.prototype.buildRow = function(cc, rc, el) {
        markup="";
        for (var i=0; i<rc; i++) {
            markup += "<tr>";
            for (var ii=0; ii<cc; ii++) markup += "<"+el+"></"+el+">";
            markup += "</tr>";
        }
        return markup;
    };

    /**
     *
     * @param cc
     * @returns {Array}
     */
    Table.prototype.buildEditableParam = function(cc) {
        var eCols = [];
        for (var i = 0; i < cc; i++) eCols.push([i, "col" + i]);
        return eCols;
    };

    /**
     *
     * @param cc
     * @param cid
     * @returns {string}
     */
    Table.prototype.buildHeaderNameForm = function(cc, cid) {
        var rhtml = "";
        for (var i = 0; i < cc; i++) {
            rhtml += "<div class='form-group'><input id='deleteTable' type='hidden' value='"+cid+"'/><label for='colName_" + i + "'>Column " + i + " Name:</label><input type='text' id='colName_" + i + "' name='colName_" + i + "' class='form-control col-th-edit'></div>";
        }
        return rhtml;
    };

    /**
     *
     */
    Table.prototype.buildTable = function() {
        this.cancelBtn.removeClass("hidden");

        $(".selectable").selectable("disable");
        this.tableCols.prop("disabled", true);
        this.tableRows.prop("disabled", true);

        if (this.tableCols.val() > 0) {
            this.columnCount = parseInt(this.tableCols.val());
            this.containerId = Date.now();


            if (this.tableRows.val() > 0) this.rowCount = parseInt(this.tableRows.val());

            $(".wb").append(
                "<div id='" + this.containerId + "' class='" + this.containerClass + "' style='width:30%;'>" +
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

            this.colNames.append(this.buildHeaderNameForm(this.columnCount, this.containerId));

            this.setEvents();

            this.wb.trigger("update_wb");
        }

    };


    $(function() {
        wb_tables.forEach(function (i) {
            var table = new Table($(i.t_elem), i.params);
        });

        $(".wb").on("newWbTable", function() {
            var table = new Table();
        });
    });

})();





