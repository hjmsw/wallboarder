
(function() {

    /**
     * TextBox object
     * @param container
     * @param id
     * @constructor
     */
    function ImageBox(imageLink, container, id) {
        this.wb = $(".wb");
        this.id = id;
        this.drg = $(".draggable");
        this.plt = $("#plt");
        this.imageLink = imageLink;
        this.container = container;
    }

    /**
     * Set events for the textbox
     */
    ImageBox.prototype.setEvents = function() {
        var self = this;

        self.container

            .on({
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
                // "click": function() {
                //     self.wb.trigger("fixZindex");
                // },
                // "doubletap": function() {
                //     self.wb.trigger("startEdit", [$(this)]);
                // },
                "resize": function() {
                    $(this).find("img").css({"height": $(this).height(), "width": $(this).width()});
                }
            })

            .dblclick(function() {
                self.wb.trigger("startEdit", [$(this)]);
            });


    };

    /**
     * Add image box to the wallboard
     */
    ImageBox.prototype.addImageBox = function() {
        var self = this;

        self.id = Date.now();

        self.wb.append("<div id='"+self.id+"' class='draggable resizable editable wb_image_box'><img src='"+self.imageLink+"'></div>");
        self.container = $("#"+self.id);

        //Update wallboard, initialising this element
        self.wb.trigger("update_wb");

        self.setEvents();
    };

    //Events
    $(function() {
        $(".wb_image_box").each(function() {
            var ib = new ImageBox($(this), $(this), $(this).attr("id"));
            ib.setEvents();
        });

        $(".wb").on("newImageBox", function(event, imageLink) {
            var ib = new ImageBox(imageLink, null, null);
            ib.addImageBox();
        });
    });

})();