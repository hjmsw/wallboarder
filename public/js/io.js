/**
 * Created by james on 15/02/2016.
 */

(function() {
    var manualReload = false;

    function save() {
        var wb = {
            title: $("body").find("h1").text(),
            url_slug: $("#url_slug").val(),
            autoLayout: false,
            elems: []
        };


        $(".wb").children().each(function (index) {
            i = $(this);

            elem = {
                id: "wb_" + index,
                tagName: i.prop("tagName")
            };

            if (i.hasClass("wb_box")) {
                elem.innerText = i.find(".box-content").text();

                if(i.find(".box-decoration").length == 1) {
                    c = i.find("i").attr("class").split(" ");
                    elem.decoration = c[c.length-1];
                    elem.decorationStyle = [
                        ["color", i.find(".box-decoration").css("color")],
                        ["background-color", i.find(".box-decoration").css("background-color")],
                        ["width", (i.find(".box-decoration").outerWidth() / i.find(".box-decoration").parent().outerWidth() * 100) + "%"]
                    ];
                }

                elem.contentStyle = [
                    ["color", i.find(".box-content").css("color")],
                    ["background-color", i.find(".box-content").css("background-color")],
                    ["width", (i.find(".box-content").outerWidth() / i.find(".box-content").parent().outerWidth() * 100) + "%"]
                ];

                elem.style = [
                    ["height", i.css("height")],
                    ["width", i.css("width")],
                    ["position", "absolute"],
                    ["left", i.css("left")],
                    ["top", i.css("top")],
                    ["font-size", i.css("font-size")],
                    ["color", i.css("color")],
                    ["background-color", i.css("background-color")],
                    ["z-index", i.css("z-index")]
                ];

            } else if (i.hasClass("wb_table")) {
                elem.tagName = "table";

                rows = [];
                columns = [];

                i.find("tr").each(function (index) {
                    row = [];
                    //each td or th
                    $(this).children().each(function () {
                        //Rather horrible if - We just want to make sure we don't save the tabledit toolbar
                        if (($(this).is("th") && !$(this).hasClass("tabledit-toolbar-column")) || $(this).hasClass("tabledit-view-mode") && $(this).children(".tabledit-toolbar").length === 0 ) {
                            row.push([$(this).prop("tagName"), $(this).text()]);
                        }
                    });
                    if (0 == index) columns = row;
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
                };

                elem.headStyle = [
                    ["background", i.find("th").css("background")],
                    ["color", i.find("th").css("color")]
                ];

                elem.style = [
                    ["height", i.css("height")],
                    ["width", i.css("width")],
                    ["position", "absolute"],
                    ["left", i.css("left")],
                    ["top", i.css("top")],
                    ["z-index", i.css("z-index")]
                ];
            } else {
                if (elem.tagName == 'H1') {
                    elem.innerText = i.text();
                    elem.style = [
                        ["width", "100%"],
                        ["position", "fixed"],
                        ["background", i.css("background")],
                        ["color", i.css("color")]
                    ]
                }
            }


            wb.elems.push(elem);

        }).promise().done(function () {
            $.post('/save', {wb: wb});
            $(".wb").trigger("saved");
            if (manualReload) location.assign("/");
        });
    }

    $("#save, #mini-save").on("click", function () {
        save();
    });

    $("#revision").on("click", function(event) {
        event.preventDefault();
        manualReload = true;
        save();
    });

    $(function() {
        if ($("#revisionsList").length === 1) {

            $.get("/api/v1/revisions/" + $("#url_slug").val(), function(data) {
                $(".wb").trigger("init-revision-pages", [data]);
            });
        }
    });

})();