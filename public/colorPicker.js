/**
 * Created by james on 14/02/2016.
 *
 */


$(function () {

    //Init all color pickers
    function init(e, elem) {
        $(".colorPicker").each(function () {
            $(this).tinycolorpicker();

            $(this).bind("change", function () {
                if ($(this).hasClass("colorPickerBG")) {
                    $(this).parent().siblings(".box").css("background", $(this).data("plugin_tinycolorpicker").colorHex);
                    if (typeof elem !== "undefined") elem.css("background", $(this).data("plugin_tinycolorpicker").colorHex);

                } else if ($(this).hasClass("colorPickerTX")) {
                    $(this).parent().siblings(".box").css("color", $(this).data("plugin_tinycolorpicker").colorHex);
                    if (typeof elem !== "undefined") elem.css("color", $(this).data("plugin_tinycolorpicker").colorHex);

                }
            });
        });
    };

    // Events
    $(window).load(init);

    $("#plt").on("newColorPickers", function(event, elem, parent) {

        parent.append(generateMarkup("colorPickerBG", "Bg", $(elem).css("background-color")) +
            generateMarkup("colorPickerTX", "Aa", $(elem).css("color")));

        init(null, $(elem));

        function generateMarkup(c_class, c_text, c_color) {
            return  "<div class='colorPicker "+c_class+"'> \
                      <a class='color'> \
                          <div class='colorInner' style='background-color:"+c_color+";'></div> \
                      </a> \
                      <p>"+c_text+"</p> \
                      <div class='track'></div> \
                      <div class='hex-entry form-group'> \
                        <label>HEX:</label> \
                        <input type='text' class='form-control hexEntry'/> \
                      </div> \
                      <ul class='dropdown'> \
                          <li></li> \
                      </ul> \
                      <input type='hidden' class='colorInput'> \
                    </div>";
        }

    });

    $(".colorInner").click(function() {
        //$("#binIcon").hide();
    });
});