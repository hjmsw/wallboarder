/**
 * Created by james on 22/02/2016.
 */

wbChange = false;

(function() {

    function Ui() {
        this.cancelButton = $("#wb-table-cancel");
        this.confirmButton = $("#wb-table-confirm");
        this.tableCols = $("#tableCols");
        this.tableRows = $("#tableRows");
        this.wb = $(".wb");
        this.plt = $("#plt");
        this.ez = $("#editZone");
        this.autoLayout = (function(alv) {
            if (alv === "undefined") return false;
            if (alv === "false") return false;
            if (alv === "true") return true;
        })($("#autoLayout").val());

        this.init();
    }

    Ui.prototype.init = function(reInit) {
        if (typeof reInit === "undefined") reInit = false;

        if (!this.autoLayout) {
            this.initSelectables();
            this.initDraggables();
            this.initResizables();
            this.initDroppables();
            this.setEvents(reInit);
            this.setSidebarEvents();
            this.fixZindex();
        } else {
            this.initAutoLayout();
        }

    };

    Ui.prototype.initAutoLayout = function() {
        this.wb.addClass("autoLayout");
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

            this.wb.on("new-wb-event", function(event, data) {
                var eb = $("#eventBox");

                eb.find("h1").text(data.message);

                if (data.icon) {
                    eb.find("i").attr("class", "fa " + data.icon);
                } else {
                    eb.find("i").attr("class", "fa fa-exclamation");
                }

                eb.effect("fade", function() {
                    eb.css("display", "block");

                });

                setTimeout(function(){
                    eb.effect("fade", function() {
                        eb.css("display", "none");

                    });
                }, (data.delay ? data.delay : 20000));
            });

            this.wb.on("fixZindex", function() {
                self.fixZindex();
            });

            this.wb.click(function(e) {
                //Only reset plt if wb parent was clicked
                if ($(e.toElement).hasClass('wb')) {
                    //$("#editZone").html("");
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

            $("#addTextBox").on("click", function(event) {
                event.preventDefault();
                self.wb.trigger("newTextBox", [$(this).parent().siblings(".p_box")]);
            });

            $("#boxText").keyup(function() {
                $("#preview-box").text($("#boxText").val());
            });

            $(".header").dblclick(function() {
                self.wb.trigger("startEdit", [$(this)]);
            });

            $(".header").on("doubletap", function() {
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
            self.initEditSidebar(elem);
        });
    };

    Ui.prototype.setSidebarEvents = function(elem) {
        var self = this;

        if (typeof elem !== "undefined") {
            $("#plt-edit-text").on("keyup", function() {
                if (elem.hasClass("wb_box")) elem.find(".box-content").text($(this).val());
                else if (elem.hasClass("header")) elem.text($(this).val());
            });

            var fontSize = elem.css("font-size");
            $("#plt-font-size").on("change", function() {
                fontSize = $(this).val();
                elem.css("font-size",fontSize);
            });

            $("#wb-box-confirm").on("click", function(event) {
                event.preventDefault();
                $(elem).trigger("rebuildTextBox", [$(this).parents(".panel-body").find(".boxDecoration"),elem.find(".box-decoration"),elem.find(".box-content"), fontSize]);
                self.ez.hide();
                $("#accordion").show();
            });

            $(".dummyConfirmCancel").on("click", function(event) {
                event.preventDefault();
                self.ez.hide();
                $("#accordion").show();
            })
        }

        $(".boxDecoration").on("keyup", function() {
            $(this).siblings("i").attr("class", "boxDecorationPreview fa " + $(this).val());
        });
    };

    Ui.prototype.initEditSidebar = function(elem) {
        var self = this;

        wbChange = true;
        self.wb.trigger("edit");

        if (this.plt.css("display") === "none") {
            this.plt.effect("fade", function() {
                $(this).show();
            });
        }

        $("#accordion").hide();

        var decorationClass = elem.find(".fa").attr("class");

        $("#editZone").show();

        self.ez.find(".panel").each(function() {
            $(this).hide();
        });

        self.ez.find(".colorPickers").each(function() {
           $(this).html("");
        });
        $("#editFontSize").html("");

        var colorPickers = [];
        var ep;

        if (elem.hasClass("wb_table")) {
            ep = $('#editTablePanel');

            colorPickers.push({
                picker: $("#editColorPickersTableHeader"),
                target: elem.find("th")
            });

        } else if(elem.hasClass("wb_box")) {
            ep = $('#editTextPanel');

            if (typeof decorationClass === "undefined") decorationClass = "";
            $("#editBoxDecoration").val(decorationClass);
            $(".boxDecorationPreview").addClass(decorationClass);
            
            $("#plt-edit-text").val(elem.text());

            if (elem.find(".box-decoration").length > 0) {
                colorPickers.push({
                    picker: $("#editColorPickersDecoration"),
                    target: elem.find(".box-decoration")
                });
                self.ez.find("#editColorPickersDecoration").parent(".form-group").show();
            } else {
                self.ez.find("#editColorPickersDecoration").parent(".form-group").hide();
            }

            colorPickers.push({
                picker: $("#editColorPickersContent"),
                target: elem.find(".box-content")
            });

            $("#editFontSize").html(self.buildFontSizeSelect(elem));

        } else if (elem.hasClass("header")) {
            ep = $("#editTitlePanel");
            $("#plt-edit-title").val(elem.text());

            colorPickers.push({
                picker: $("#editColorPickersTitle"),
                target: elem
            });
        }

        //Show edit panel for elem
        ep.show();

        //setup colour pickers
        colorPickers.forEach(function(i) {
            i.picker.addClass("enabled");
            self.plt.trigger("newColorPickers", [i.target, i.picker]);
        });

        self.setSidebarEvents(elem);
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


    $(window).load(function() {

        var ui = new Ui();

        $(".wb").css({
            height: $(window).height()
        });

        $("#plt").trigger("newColorPickers", [$("#preview-box"), $("#insertTextBox").find(".colorPickers")]);
    });
})();
