/**
 * Created by james on 22/02/2016.
 */

wbChange = false;

(function() {

    Ui = function() {
        this.cancelButton = $("#wb-table-cancel");
        this.confirmButton = $("#wb-table-confirm");
        this.tableCols = $("#tableCols");
        this.tableRows = $("#tableRows");
        this.drg = $(".draggable");
        this.wb = $(".wb");
        this.plt = $("#plt");

        this.init();
    };

    Ui.prototype.init = function(reInit) {
        if (typeof reInit === "undefined") reInit = false;

        this.initSelectables();
        this.initDraggables();
        this.initResizables();
        this.initDroppables();
        this.setEvents(reInit);
        this.setSidebarEvents();
        this.fixZindex();
    };

    Ui.prototype.initAccordion = function() {
        $(".accordion").accordion();
        $("#accordion").css("height", $(window).height()-55);
    };

    Ui.prototype.initDraggables = function() {
        var self = this;

        $(".draggable").draggable({
            grid: [10, 10],
            scroll: false,
            stack: "div",
            stop: function( event, ui ) {
                wbChange = true;
                self.wb.trigger("edit");
            }
        });
    };

    Ui.prototype.initResizables = function() {
        var self = this;

        $(".resizable").resizable({
            autoHide: true,
            grid: [10, 10],
            handles: "n, ne, e, se, s, sw, w, nw",
            stop: function( event, ui ) {
                wbChange = true;
                self.wb.trigger("edit");
            }
        });

        $(".resizable-table").resizable({
            autoHide: true,
            grid: [10, 10],
            handles: "e, w",
            stop: function( event, ui ) {
                wbChange = true;
                self.wb.trigger("edit");
            }
        });
    };

    Ui.prototype.initSelectables = function() {
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
    };

    Ui.prototype.initDroppables = function() {
        //Drag and drop items into bin to remove from wallboard
        $("#binIcon").droppable({
            drop: function(event, ui) {
                $(ui.draggable).effect( "explode", 500, function() {
                    $(this).remove();
                });
            }
        });
    };

    Ui.prototype.setEvents = function(reInit) {
        var self = this;

        //Some events only needed to be initiated once
        if (!reInit) {
            //first init

            this.wb.on("read-only", function() {
                $("#shield").css({
                    "height": $(window).height(),
                    "width": $(window).width(),
                    "z-index": self.plt.css("z-index") + 1
                });
            });

            this.wb.on("new-status-message", function(event, message) {
                var sm = $("#statusMessage");


                sm.find("p").text(message);

                sm.effect("fade", function() {
                    sm.css("display", "block");
                });

            });

            this.wb.on("fixZindex", function() {
                self.fixZindex();
            });

            this.wb.click(function(e) {
                //Only reset plt if wb parent was clicked
                if ($(e.toElement).hasClass('wb')) {
                    $("#editZone").html("");
                    $("#accordion").show();
                }
            });

            var mt = $("#miniToolbar");
            $(".header").hover(function(event, ui) {
                if($(event.toElement).hasClass("header")) mt.effect("fade", function() { mt.show() });
            }, function(event, ui) {
                if ($(event.toElement).hasClass("wb")) mt.effect("fade", function() { mt.hide() });
            });

            $("#plt-show").click(function() {
                $("#plt").effect("fade", function() {
                    $(this).show();
                })
            });

            $("#plt-hide").click(function() {
                $("#plt").effect("fade", function() {
                    $(this).hide();
                })
            });

            $("#addTextBox").on("click", function() {
                self.wb.trigger("newTextBox", [$(this).parent().siblings(".p_box")]);
            });

            $("#boxText").keyup(function() {
                $("#preview-box").text($("#boxText").val());
            });

            $(".header").dblclick(function() {
                self.wb.trigger("startEdit", [$(this)]);
            });
        } else {
            wbChange = true;
            self.wb.trigger("edit");
        }

        $("#tableCols").change(function() {
            $(".wb").trigger("newWbTable");
        });

        this.wb.off("clearTableForm").on("clearTableForm", function(event, delete_table) {
            self.clearTableForm(delete_table);
        });

        //Custom event - triggered when wallboard update required
        this.wb.off("update_wb").on("update_wb", function() {
            self.init(true);
        });

        this.wb.off("startEdit").on("startEdit", function(event, elem) {
            self.buildEditSidebar(elem);
        });
    };

    Ui.prototype.setSidebarEvents = function(elem) {
        var self = this;

        if (typeof elem !== "undefined") {
            $("#plt-edit-text").on("keyup", function() {
                if (elem.hasClass("wb_box")) elem.find(".box-content").text($(this).val());
                else if (elem.hasClass("header")) elem.text($(this).val());
            });

            var fontSize = "14px";
            $("#plt-font-size").on("change", function() {
                fontSize = $(this).val();
                elem.css("font-size",fontSize);
            });

            $("#wb-box-confirm").on("click", function() {
                $(elem).trigger("rebuildTextBox", [$(this).parents(".panel-body").find(".boxDecoration"),elem.find(".box-content").text(), fontSize]);
            });
        }

        $(".boxDecoration").on("keyup", function() {
            $(this).siblings("i").attr("class", "boxDecorationPreview fa " + $(this).val());
        });
    };

    Ui.prototype.buildEditSidebar = function(elem) {
        var self = this;

        wbChange = true;
        self.wb.trigger("edit");

        if (this.plt.css("display") === "none") {
            this.plt.effect("fade", function() {
                $(this).show();
            });
        }

        $("#accordion").hide();

        var ez = $("#editZone");

        var decorationClass = elem.find(".fa").attr("class");

        ez.html(function() {

            var el = "<div class='panel panel-default'><div class='panel-heading'>";

            if (elem.hasClass('wb_table')) {
                el += "<h3 class='panel-title'>Edit Table</h3></div><div class='panel-body'>\
                           <div class='form-group'><label>Header Colours:</label><div class='colorPickers'></div></div></div>";

            } else if(elem.hasClass('wb_box')) {
                if (typeof decorationClass === "undefined") decorationClass = "";

                el += "<h3 class='panel-title'>Edit Text Box</h3></div><div class='panel-body'>\
                        <div class='form-group'><input type='text' class='form-control' id='plt-edit-text' value='" +
                    elem.find(".box-content").text() + "'/></div>\
                        <div class='form-group'>\
                        <label>Content Colours:</label>\
                        <div id='colorPickersContent' class='colorPickers'></div>\
                        </div>\
                        <div class='form-group'>\
                        <label>Decoration Colours:</label>\
                        <div id='colorPickersDecoration' class='colorPickers'></div>\
                        </div>\
                        <div class='form-group'><label for='boxDecoration'>Decoration:</label>\
                        <input type='text' class='form-control boxDecoration' placeholder='fa-icon-name' name='boxDecoration' value='"+decorationClass+"'/>\
                        <i class='boxDecorationPreview "+decorationClass+"'></i></div>" +
                    self.buildFontSizeSelect(elem) +
                    "<div class='form-group'><input type='button' id='wb-box-confirm' name='wb-box-confirm' value='Confirm' class='btn btn-default form-control'/></div>\
                    <div class='form-group'><input type='button' id='wb-box-cancel' name='wb-box-cancel' value='Cancel' class='btn btn-default form-control'/></div>\
                    </div>";
            } else {
                el += "<h3 class='panel-title'>Edit Title</h3></div><div class='panel-body'>" +
                    "<div class='form-group'><input id='plt-edit-text' type='text' class='form-control edit-text'/></div><div class='colorPickers'></div></div>";


            }

            el +=  "</div>";

            return el;
        });

        if (elem.is("h1")) {
            $("#plt-edit-text").val(elem.text());
        } else if (elem.hasClass("wb_box")) {
            $("#plt-edit-text").val(elem.text());
        }

        this.setSidebarEvents(elem);

        if (elem.hasClass('wb_box')) {
            if(elem.find(".box-decoration").length > 0) {
                this.plt.trigger("newColorPickers", [elem.find(".box-decoration"), ez.find("#colorPickersDecoration")]);
            } else {
                ez.find("#colorPickersDecoration").parent(".form-group").remove();
            }
            this.plt.trigger("newColorPickers", [elem.find(".box-content"), ez.find("#colorPickersContent")]);
        } else {
            this.plt.trigger("newColorPickers", [elem, ez.find(".colorPickers")]);
        }
    };

    Ui.prototype.buildFontSizeSelect = function(elem) {
        var ret = "<div class='form-group'><label for='plt-font-size'>Font Size:</label><select class='form-control' id='plt-font-size' name='plt-font-size'>";

        var fontSizeArr = ["12px","14px","18px","24px","30px","36px","48px","60px","72px","96px"];

        $.each(fontSizeArr, function(index, value) {
            if (elem.css("font-size") === value) ret+= "<option selected='selected'>"+value+"</option>";
            else ret+= "<option>"+value+"</option>";
        });
        ret += "</select></div>";

        return ret;
    };

    /**
     * Reset insert table form - After table added / cancelled
     * @param delete_table
     */
    Ui.prototype.clearTableForm = function(delete_table) {
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
    };


    Ui.prototype.fixZindex = function() {
        //Make sure side panel (palette) has highest z-index when called
        var z_index = 0;
        $(".draggable").each(function() {
            if ($(this).css("z-index") >= z_index) z_index = $(this).css("z-index");
        });
        $("#plt").css("z-index", z_index+1);
    };


    $(function() {

        var ui = new Ui();

        $(".wb").css({
            height: $(window).height()
        });

        $("#plt").trigger("newColorPickers", [$("#preview-box"), $("#plt").find(".colorPickers")]);
    });
})();
