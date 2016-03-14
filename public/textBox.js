
$(function() {

    /**
     * TextBox object
     * @param container
     * @param id
     * @constructor
     */
    function TextBox(container, id) {
        this.wb = $(".wb");
        this.container = container;
        this.id = id;
        this.drg = $(".draggable");
        this.plt = $("#plt");
    }

    /**
     * Set events for the textbox
     */
    TextBox.prototype.setEvents = function() {
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
            self.container.find(".box-inner").html(self.buildTextBox(boxDecoration.val(),boxContent));
            self.container.find("box-inner").css("font-size",fontSize);
        });

    };

    /**
     * Add textbox to the wallboard
     * @param      {Object}   elem  - The wallboard element to be added
     */
    TextBox.prototype.addTextBox = function(elem) {
        var self = this;

        self.id = Date.now();

        self.wb.append("<div id='"+self.id+"' class='draggable resizable editable wb_box'><div class='box-inner'>" + self.buildTextBox(self.plt.find(".boxDecoration").val(),elem.text()) + "</div></div>");
        self.container = $("#"+self.id);

        self.container.css({
            "color": elem.css("color"),
            "background-color": elem.css("background-color"),
            "width": elem.css("width"),
            "height": elem.css("height")
        });

        self.container.find(".box-content").css("background-color", elem.css("background-color"));
        self.container.find(".box-decoration").css("background-color", elem.css("background-color"));

        //Reset preview box
        elem.text("Text goes here...");
        elem.css({
            "background-color": "#EFEFEF",
            "color": "#000"
        });

        //reset color selectors
        $("#plt").find(".colorInner").each(function(){
            $(this).css("background-color", "#EFEFEF");
        });

        //reset insert form inputs
        $("#boxText").val("");
        $("#boxDecoration").val("");

        //Update wallboard, initialising this element
        self.wb.trigger("update_wb");

        self.setEvents();
    };

    /**
     * Construct the text and decoration inside the textbox elem
     * @param      {String}   text - The text to be added to the textbox
     * @param      {String}   decoration - The font-awesome class for the textbox decoration
     * @return     {String} The markup to be added to the textbox elem
     */
    TextBox.prototype.buildTextBox = function(decoration, text) {

        if (decoration === "") {
            return "<div class='box-content box-content-full-width'>"+text+"</div>";
        }
        else {
            return "<div class='box-decoration'><i class='fa " + decoration + "'></i></div>\
                <div class='box-content'>"+text+"</div>";
        }
    };

    //Events
    $(window).load(function() {
        $(".wb_box").each(function() {
            var tb = new TextBox($(this), $(this).attr("id"));
            tb.setEvents();
        });

        $(".wb").on("newTextBox", function(event, elem) {
            var tb = new TextBox(null, null);
            tb.addTextBox(elem);
        });
    });


});