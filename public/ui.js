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
        plt: $("#plt"),


        init: function() {
            this.initSelectables();
            this.initDraggables();
            this.initResizables();
            this.initDroppables();
            this.setEvents();
        },

        initAccordion: function() {
            $(".accordion").accordion();
            $("#accordion").css("height", $(window).height()-55);
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

        initDroppables: function() {
            //Drag and drop items into bin to remove from wallboard
            $("#binIcon").droppable({
                drop: function(event, ui) {
                    $(ui.draggable).effect( "explode", 500, function() {
                        $(this).remove();
                    });
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

            $(".editable").on("dblclick", function() {
                console.log("dblclick fired");
                self.buildEditSidebar($(this));
            });

            $("#boxText").keyup(function() {
                $("#preview-box").text($("#boxText").val());
            });


            this.wb.click(function(e) {
                //Only reset plt if wb parent was clicked
                if ($(e.toElement).hasClass('wb')) {
                    $("#editZone").html("");
                    $("#accordion").show();
                }
            });

            $(".plt-hide").click(function() {
                $("#plt").effect("fade", function() {
                    $(this).hide();
                })
            });

            $("#addTextBox").off("click").on("click", function() {
                self.addTextBox($(this).parent().siblings(".p_box"));
            });
        },

        setSidebarEvents: function(elem) {
            var self = this;

            $("#plt-edit-text").on("keyup", function() {
                elem.find(".box-content").text($(this).val());
            });

            var fontSize = "14px";
            $("#plt-font-size").on("change", function() {
                fontSize = $(this).val();
                elem.css("font-size",fontSize);
            });

            $("#wb-box-confirm").on("click", function() {
                elem.find(".box-inner").html(self.buildTextBox($(this).parents(".panel-body").find(".boxDecoration"),elem.find(".box-content").text()));
                elem.find("box-inner").css("font-size",fontSize);
            });

            $(".boxDecoration").on("keyup", function() {
                $(this).siblings("i").attr("class", "boxDecorationPreview fa " + $(this).val());
            });
        },

        addTextBox: function(elem) {
            var self = this;

            var id = Date.now();

            this.wb.append("<div id='"+id+"' class='draggable resizable editable wb_box'><div class='box-inner'>" + self.buildTextBox($(this).parents(".panel-body").find(".boxDecoration"),"") + "</div></div>");
            var n_elem = $("#"+id);

            n_elem.find(".box-content").text(elem.text());

            n_elem.css({
                color: elem.css("color"),
                background: elem.css("background"),
                width: elem.css("width"),
                height: elem.css("height"),
                padding: "10px"
            });

            //Reset preview box
            elem.text("Text goes here...");
            elem.css({
                background: "#EFEFEF",
                color: "#000"
            });

            //reset color selectors
            $("#plt").find(".colorInner").each(function(){
                $(this).css("background-color", "#EFEFEF");
            });

            //Update wallboard, initialising this element
            $(".wb").trigger("update_wb");
        },

        buildEditSidebar: function(elem) {
            var self = this;

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
                    el += "<h3 class='panel-title'>Edit Table</h3></div>";
                } else if(elem.hasClass('wb_box')) {
                    el += "<h3 class='panel-title'>Edit Text Box</h3></div><div class='panel-body'>\
                        <div class='form-group'><input type='text' class='form-control' id='plt-edit-text' value='" +
                        elem.find(".box-content").text() + "'/></div><div class='colorPickers'></div>\
                        <div class='form-group'><label for='boxDecoration'>Decoration:</label>\
                        <input type='text' class='form-control boxDecoration' placeholder='fa-icon-name' name='boxDecoration' value='"+decorationClass+"'/>\
                        <i class='boxDecorationPreview "+decorationClass+"'></i></div>" +
                        self.buildFontSizeSelect(elem) +
                        "<div class='form-group'><input type='button' id='wb-box-confirm' name='wb-box-confirm' value='Confirm' class='btn btn-default form-control'/></div>\
                        <div class='form-group'><input type='button' id='wb-box-cancel' name='wb-box-cancel' value='Cancel' class='btn btn-default form-control'/></div>\
                        </div>";
                } else {
                    el += "<h3 class='panel-title'>Edit Title</h3></div><div class='panel-body'>" +
                        "<div class='form-group'><input type='text' class='form-control edit-text' value='" +
                        elem.text() + "'/></div><div class='colorPickers'></div></div>";
                }

                el +=  "</div>";

                return el;
            });


            this.setSidebarEvents(elem);


            this.plt.trigger("newColorPickers", [elem, ez.find(".colorPickers")]);

        },

        buildTextBox: function(bd, text) {
            var bdv = bd.val();
            if (bdv === "") {
                return "<div class='box-content box-content-full-width'>"+text+"</div>";
            }
            else {
                return "<div class='box-decoration'><i class='fa " + bdv + "'></i></div>\
                    <div class='box-content'>"+text+"</div>";
            }
        },

        buildFontSizeSelect: function(elem) {
            var ret = "<div class='form-group'><label for='plt-font-size'>Font Size:</label><select class='form-control' id='plt-font-size' name='plt-font-size'>";

            var fontSizeArr = ["12px","14px","18px","24px","30px","36px","48px","60px","72px","96px"];

            $.each(fontSizeArr, function(index, value) {
                if (elem.css("font-size") === value) ret+= "<option selected='selected'>"+value+"</option>";
                else ret+= "<option>"+value+"</option>";
            });
            ret += "</select></div>";

            return ret
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

        $(".wb").css({
            height: $(window).height()
        });

        $("#plt").trigger("newColorPickers", [$("#preview-box"), $("#preview-box").siblings(".colorPickers")]);
    });
});
