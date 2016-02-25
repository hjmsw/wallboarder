/**
 * Created by james on 24/02/2016.
 */

$(function() {

    var TextBox = {
        wb: $(".wb"),
        container: null,
        id: null,
        drg: $(".draggable"),
        plt: $("#plt"),

        init: function() {
            this.setEvents();
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
                }
            });

            this.container.dblclick(function() {
                self.wb.trigger("startEdit", [$(this)]);
            });

            this.container.on("rebuildTextBox", function(event, boxDecoration, boxContent, fontSize) {
                self.container.find(".box-inner").html(self.buildTextBox(boxDecoration,boxContent));
                self.container.find("box-inner").css("font-size",fontSize);
            });

        },

        addTextBox: function(elem) {
            var self = this;

            self.id = Date.now();

            self.wb.append("<div id='"+self.id+"' class='draggable resizable editable wb_box'><div class='box-inner'>" + self.buildTextBox(self.plt.find(".boxDecoration"),elem.text()) + "</div></div>");
            self.container = $("#"+self.id);

            self.container.css({
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

            self.init();
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
        }

    };

    //Events
    $(window).load(function() {
        $(".wb_box").each(function() {
            var tb = Object.create(TextBox);
            tb.container = $(this);
            tb.id = $(this).attr("id");
            tb.init();
        });

        $(".wb").on("newTextBox", function(event, elem) {
            var tb = Object.create(TextBox);
            tb.addTextBox(elem);
        });
    });


});