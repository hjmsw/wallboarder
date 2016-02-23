
$(function () {

    /**
     * Setup draggable and resizable elements
     */
    function initWbElems() {

        /*-------Moving code to ui.js where applicable----------------------*/

        $(".editable").bind("dblclick", function() {
            var elem = $(this);

            var plt = $("#plt");

            if (plt.css("display") === "none") {
                plt.effect("fade", function() {
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
                        buildFontSizeSelect(elem) +
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



            $("#plt-edit-text").on("keyup", function() {
                elem.find(".box-content").text($(this).val());
            });

            var fontSize = "14px";
            $("#plt-font-size").on("change", function() {
                fontSize = $(this).val();
                elem.css("font-size",fontSize);
            });

            $("#wb-box-confirm").on("click", function() {
                elem.find(".box-inner").html(buildTextBox($(this).parents(".panel-body").find(".boxDecoration"),elem.find(".box-content").text()));
                elem.find("box-inner").css("font-size",fontSize);
            });

            setEditEvents();

            $("#plt").trigger("newColorPickers", [elem, ez.find(".colorPickers")]);

        });

        setEditEvents();

    }

    function buildFontSizeSelect(elem) {
        var ret = "<div class='form-group'><label for='plt-font-size'>Font Size:</label><select class='form-control' id='plt-font-size' name='plt-font-size'>";

        var fontSizeArr = ["12px","14px","18px","24px","30px","36px","48px","60px","72px","96px"];

        $.each(fontSizeArr, function(index, value) {
            if (elem.css("font-size") === value) ret+= "<option selected='selected'>"+value+"</option>";
            else ret+= "<option>"+value+"</option>";
        });
        ret += "</select></div>";

        return ret
    }

    function setEditEvents() {


        $(".boxDecoration").on("keyup", function() {
            $(this).siblings("i").attr("class", "boxDecorationPreview fa " + $(this).val());
        });
    }



    function buildTextBox(bd, text) {
        var bdv = bd.val();
        if (bdv === "") {
            return "<div class='box-content box-content-full-width'>"+text+"</div>";
        }
        else {
            return "<div class='box-decoration'><i class='fa " + bdv + "'></i></div>\
                <div class='box-content'>"+text+"</div>";
        }
    }

    var wb = $(".wb");

    $(window).load(function() {
        initWbElems();

        $(".accordion").accordion();

        wb.css({
            height: $(window).height()
        });

        var plt = $("#plt");

        plt.trigger("newColorPickers", [$("#preview-box"), $("#preview-box").siblings(".colorPickers")]);

        $("#accordion").css("height", $(window).height()-55);
    });





    //Drag and drop items into bin to remove from wallboard
    $("#binIcon").droppable({
        drop: function(event, ui) {
            $(ui.draggable).effect( "explode", 500, function() {
                $(this).remove();
            });
        }
    });

    $("#addTextBox").click(function() {
        var elem = $(this).parent().siblings(".p_box");

        var id = Date.now();

        wb.append("<div id='"+id+"' class='draggable resizable editable wb_box'><div class='box-inner'>" + buildTextBox($(this).parents(".panel-body").find(".boxDecoration"),"") + "</div></div>");
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

    });


    $("#boxText").keyup(function() {
       $("#preview-box").text($("#boxText").val());
    });


    wb.click(function(e) {
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

});
