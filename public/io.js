/**
 * Created by james on 15/02/2016.
 */

$(function() {
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

            if (i.children("table").length != 1) {
                if (elem.tagName == 'H1') {
                    elem.style = [
                        ["width", "100%"],
                        ["position", "fixed"],
                        ["background", i.css("background")],
                        ["color", i.css("color")]
                    ]
                } else {
                    if(i.find(".box-decoration").length == 1) {
                        c = i.find("i").attr("class").split(" ");
                        elem.decoration = c[c.length-1];
                    }
                    elem.style = [
                        ["height", i.css("height")],
                        ["width", i.css("width")],
                        ["color", i.css("color")],
                        ["position", "absolute"],
                        ["left", i.css("left")],
                        ["top", i.css("top")],
                        ["background", i.css("background")],
                        ["font-size", i.css("font-size")],
                        ["z-index", i.css("z-index")]
                    ]
                }
            } else {
                elem.tagName = "table";
                delete elem.innerText;

                rows = [];
                columns = [];

                i.find("tr").each(function (index) {
                    row = [];
                    //each td or th
                    $(this).children().each(function () {
                        if (($(this).is("th") && !$(this).hasClass("tabledit-toolbar-column")) || $(this).hasClass("tabledit-view-mode")) {
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
            }


            wb.elems.push(elem);

        }).promise().done(function () {
            $.post('/save', {wb: wb});
        });
    });
});