
$(function () {

    function initWbElems() {
        $(".draggable").draggable({
            grid: [10, 10],
            scroll: false,
            stack: "div"
        });


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
    }

    wb = $(".wb");

    $(window).load(function() {
        initWbElems();

        $(".accordion").accordion();

        wb.css({
            height: $(window).height()
        });

        $("#plt").trigger("newColorPickers", [$("#preview-box"), $("#preview-box").siblings(".colorPickers")]);
    });

    wb.on("update_wb", initWbElems);

    drg = $(".draggable");

    drg.on("dragstart", function() {
        $("#binIcon").effect("fade", 500, function() {
            $(this).show();
        });
    });
    drg.on("dragstop", function(event, ui) {
        $("#binIcon").effect("fade", 500, function() {
            $(this).hide();
        });

        //Make sure side panel (palette) has highest z-index on dragstop
        z_index = 0;
        $(".draggable").each(function() {
           if ($(this).css("z-index") >= z_index) z_index = $(this).css("z-index");
        });
        $("#plt").css("z-index", z_index+1);
    });

    $("#binIcon").droppable({
        drop: function(event, ui) {
            $(ui.draggable).effect( "explode", 500, function() {
                $(this).remove();
            });
        }
    });

    $("#addTextBox").click(function() {

        elem = $(this).parent().siblings(".p_box");

        id = Date.now();

        wb.append("<div id='"+id+"'>"+elem.text()+"</div>");
        n_elem = $("#"+id);

        n_elem.css({
            color: elem.css("color"),
            background: elem.css("background"),
            width: elem.css("width"),
            height: elem.css("height"),
            padding: "10px"
        });

        n_elem.addClass("draggable resizable");

        elem.text("Text goes here...");
        elem.css({
            background: "#EFEFEF",
            color: "#000"
        });

        $("#plt").find(".colorInner").each(function(){
           $(this).css("background-color", "#EFEFEF");
        });

        $(".wb").trigger("update_wb");

    });

    $(".editable").dblclick(function () {
        elem = $(this);

        plt = $("#plt");

        if (plt.css("display") === "none") {
            plt.effect("fade", function() {
                $(this).show();
            });
        }

        $("#accordion").hide();

        ez = $("#editZone");

        ez.html(function() {

            el = "<div class='panel panel-default'><div class='panel-heading'>";

            if (elem.hasClass('wb_table')) {
                el += "<h3 class='panel-title'>Edit Table</h3></div>";
            } else if(elem.hasClass('wb_box')) {
                el += "<h3 class='panel-title'>Edit Text Box</h3></div><div class='panel-body'>" +
                    "<div class='form-group'><input type='text' class='form-control edit-text' value='" +
                    elem.text() + "'/></div><div class='colorPickers'></div></div>";
            } else {
                el += "<h3 class='panel-title'>Edit Title</h3></div><div class='panel-body'>" +
                    "<div class='form-group'><input type='text' class='form-control edit-text' value='" +
                    elem.text() + "'/></div><div class='colorPickers'></div></div>";
            }

            el +=  "</div>";

            return el;
        });

        $(".edit-text").on("keyup", function() {
            elem.find(".box-content").text($(this).val());
        });

        $("#plt").trigger("newColorPickers", [elem, ez.find(".colorPickers")]);

    });

    $("#boxText").keyup(function() {
       $("#preview-box").text($("#boxText").val());
    });
    $("#boxDecoration").keyup(function() {
        $("#boxDecorationPreview").attr("class", "fa " + $("#boxDecoration").val());
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
