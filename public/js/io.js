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
            css: {
                attributes: {},
                children: {}
            },
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

                wb.css.children["#" + "wb_" + index] = {
                    attributes: {
                        "height": i.css("height"),
                        "width": i.css("width"),
                        "position": "absolute",
                        "left": i.css("left"),
                        "top": i.css("top"),
                        "font-size": i.css("font-size"),
                        "color": i.css("color"),
                        "background-color": i.css("background-color"),
                        "z-index": i.css("z-index")
                    },
                    children: {}
                };

                if(i.find(".box-decoration").length == 1) {
                    c = i.find("i").attr("class").split(" ");
                    elem.decoration = c[c.length-1];

                    wb.css.children["#wb_" + index + " u002Ebox-decoration"] = {
                        attributes: {
                            "color": i.find(".box-decoration").css("color"),
                            "background-color": i.find(".box-decoration").css("background-color"),
                            "width": (i.find(".box-decoration").outerWidth() / i.find(".box-decoration").parent().outerWidth() * 100) + "%"
                        },
                        children: {}
                    }
                }

                var width = function() {
                    var bc = i.find(".box-content");

                    if (bc.hasClass("box-content-full-width"))
                        return (bc.outerWidth() / bc.parent().outerWidth() * 100) + "%";
                    else
                        return null;
                }();

                wb.css.children["#wb_" + index + " u002Ebox-content"] = {
                    attributes: {
                        "color": i.find(".box-content").css("color"),
                        "background-color": i.find(".box-content").css("background-color"),
                        "width": width
                    },
                    children: {}
                }

            } else if (i.hasClass("wb_image_box")) {
                elem.src = i.find("img").attr("src");
                elem.tagName = "img";

                wb.css.children["#wb_" + index] = {
                    attributes: {
                        "height": i.find("img").css("height"),
                        "width": i.find("img").css("width"),
                        "position": "absolute",
                        "left": i.css("left"),
                        "top": i.css("top")
                    },
                    children: {}
                };



            } else if (i.hasClass("wb_table")) {
                elem.tagName = "table";

                rows = [];
                columns = [];

                i.find("tr").each(function (index) {
                    var row = [];
                    //each td or th
                    $(this).children().each(function () {
                        //Rather horrible if - We just want to make sure we don't save the tabledit toolbar
                        if (($(this).is("th") && !$(this).hasClass("tabledit-toolbar-column")) ||
                            $(this).hasClass("tabledit-view-mode") &&
                            $(this).children(".tabledit-toolbar").length === 0 ) {
                            //A change in JSON structure has caused TH and TD to be inserted into TH and TD tags
                            row.push($(this).text().replace(/TH\,|TD\,/, ""));
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

                wb.css.children["#wb_" + index] = {
                    attributes: {
                        "height": i.css("height"),
                        "width": i.css("width"),
                        "position": "absolute",
                        "left": i.css("left"),
                        "top": i.css("top"),
                        "z-index": i.css("z-index")
                    },
                    children: {}

                };

                wb.css.children["#wb_" + index + " th"] = {
                    attributes: {
                        "background-color": i.find("th").css("background-color"),
                        "color": i.find("th").css("color")
                    },
                    children: {}
                };

            } else {
                if (elem.tagName == 'H1') {
                    elem.innerText = i.text();

                    wb.css.children["#wb_" + index] = {
                        attributes: {
                            "width": "100%",
                            "position": "fixed",
                            "background-color": i.css("background-color"),
                            "color": i.css("color")
                        },
                        children: {}
                    }
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