
var wb_tables = [];


$(function () {

    initTableEdit = function () {
        wb_tables.forEach(function (i) {
            $(i.t_elem).find("table").Tabledit(i.params);
        });
    };
    initWbElems = function() {
        $(".draggable").draggable({
            grid: [10, 10],
            scroll: false
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
    };

    $(window).load(function() {
        initTableEdit();
        initWbElems();

        $(".accordion").accordion();

        $(".wb").css({
            height: $(window).height(),
        });


    });

    nr = $(".newRow");
    nr.on("newRow", initTableEdit);

    $("#binIcon").droppable({
        drop: function(event, ui) {
            $("#"+ui.draggable.attr("id")).effect( "explode", 500, function() {
                $(this).remove();
            });
        }
    });


    $(".wb_table").hover(function () {
        $(this).find(".newRow").show();
    }, function () {
        $(this).find(".newRow").hide();
    });

    //Build Table Row
    bTR = function(cc, el) {
        row = "<tr>";
        for (var i = 0; i < cc; i++) row += "<"+el+">Text</"+el+">";
        row += "</tr>";
        return row;
    };

    $("#tableCols").change(function() {
        $(this).prop('disabled', true);
        if ($(this).val() > 0) {
            console.log("disabled until insert confirmed");
            cc = parseInt($(this).val());
            tId = Date.now();

            $(".wb").append(
                "<div id='"+tId+"' class='wb_table draggable resizable-table'><table class='table table-striped'><tbody>" +
                bTR(cc, "th") +
                bTR(cc, "td") +
                bTR(cc, "td") +
                "</tbody></table></div>");

            editable = function(cc) {
                eCols = [];
                for (var i = 0; i < cc; i++) eCols.push([i, "col"+i]);
                return eCols;
            };

            params =  {
                editButton: false,
                deleteButton: false,
                hideIdentifier: false,
                toolbar: true,
                "columns": {
                    "identifier": [0, "col0"],
                    "editable": editable(cc)
                }
            };

            $("#"+tId).find("table").Tabledit(params);

            $("#colNames").append(function() {
                rhtml = "";
                for (var i = 0; i < cc; i++) {
                    rhtml += "<div class='form-group'><label for='colName_"+i+"'>Column "+i+" Name:</label><input type='text' id='colName_"+i+"' name='colName_"+i+"' class='form-control'></div>";
                }
                return rhtml;
            });

            initWbElems();
        }
    });

    nr.click(function () {
        cc = $(this).siblings("table").find("tr").first().children().length;
        $(this).siblings("table").find("tbody").append(bTRw(cc,"td"));
        $(this).trigger("newRow");
    });

    $("#addTextBox").click(function() {
        elem = $(this).siblings(".p_box");

        id = Date.now();

        $(".wb").append("<div id='"+id+"'>"+elem.text()+"</div>");
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

        initWbElems();

    });

    $(".draggable").dblclick(function(e) {
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
            } else {
                el += "<h3 class='panel-title'>Edit Text Box</h3></div><div class='panel-body'>" +
                    "<div class='form-group'><input type='text' class='form-control' value='" +
                    elem.text() + "'/></div></div><div class='colorPickers'></div>";
            }

            el +=  "</div>";

            return el;
        });

        ez.trigger("newColorPickers", [elem, ez.find(".colorPickers")]);

    });
    $(".wb").click(function(e) {
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

    $(".save").click(function () {
        wb = {
            title: "Test Wallboard",
            _id: "wallboard1",
            elems: []
        };


        $(".wb").children().each(function (index) {
            i = $(this);

            elem = {
                id: "wb_" + index,
                tagName: i.prop("tagName"),
                innerText: i.text()
            };

            if (i.children("table").length == 1) {
                elem.tagName = "table";
                delete elem.innerText;

                rows = [];
                columns = [];

                i.find("tr").each(function (index) {
                    row = []
                    //each td or th
                    $(this).children().each(function () {
                        row.push([$(this).prop("tagName"), $(this).text()]);
                    });
                    if (index == 0) columns = row;
                    rows.push(row);
                });

                elem.struct = {
                    rows: rows
                };

                editable = [];

                columns.forEach(function (e, i) {
                    editable.push([parseInt(i), e[1]])
                });

                elem.tableEditColumns = {
                    "identifier": editable[0],
                    "editable": editable
                }
                elem.style = [
                    ["height", i.css("height")],
                    ["width", i.css("width")],
                    ["position", "absolute"],
                    ["left", i.css("left")],
                    ["top", i.css("top")]
                ]
            }
            else if (elem.tagName == 'H1') {
                elem.style = [
                    ["width", "100%"],
                    ["position", "fixed"]
                ]
            }
            else {
                elem.style = [
                    ["height", i.css("height")],
                    ["width", i.css("width")],
                    ["color", i.css("color")],
                    ["position", "absolute"],
                    ["left", i.css("left")],
                    ["top", i.css("top")],
                    ["background", i.css("background")]
                ]
            }


            wb.elems.push(elem);

        }).promise().done(function () {
            $.post('/save', {wb: wb});
        });
    });
});

//<div class="row">
//    <div class="col-md-2"><i class="fa fa-gbp" style="
//font-weight: bold;
//"></i></div>
//<div class="col-md-10">Drag me around 1</div>
//</div>
