(function() {

    /**
     * Tooltips
     * Show id name and tags below wallboard element for easy identification
     * @constructor
     */
    function Tooltips() {
        this.init();
        this.setEvents();
    }

    Tooltips.prototype.init = function() {
        $('[data-toggle="tooltip"]').tooltip();
    };

    Tooltips.prototype.setEvents = function() {
        var self = this;

        $(".wb").on("showTips", function() {
            self.showTips();
        });
    };

    Tooltips.prototype.showTips = function() {
        $(".wb").children().each(function() {
            $(this).tooltip("open");
        });
    };

    /**
     * CSS code editor
     * Set up editor and associated events
     * @constructor
     */
    function CSSEditor() {
        this.editor = null;
        this.jcss = null;

        this.init();
    }

    CSSEditor.prototype.init = function() {
        var self = this;

        $("#plt").css("width", "400px");
        $("#accordion").hide();
        $("#preview").show();
        $("#plt-hide").hide();

        $(".wb").off("click");

        $.get("/api/v1/wb/css/" + $("#url_slug").val(), function(data) {
            self.jcss = data;

            self.editor = ace.edit("cssEditor");
            self.editor.setTheme("ace/theme/chrome");
            self.editor.session.setMode("ace/mode/css");
            self.editor.insert(CSSJSON.toCSS(self.jcss).replace(/u002E/g,"."));

            self.setEvents();
        });
    };

    CSSEditor.prototype.setEvents = function() {
        var self = this;

        $("#preview").on("click", function() {
            self.applyCSSChanges();
        });

        self.editor.on("focus", function(){
            $(".wb").trigger("showTips");
        });

    };

    /**
     * Take plaintext css from editor, convert to json.
     * iterate through json object to apply styles to wallboard.
     */
    CSSEditor.prototype.applyCSSChanges = function() {
        var self = this;
        self.jcss = CSSJSON.toJSON(self.editor.getValue());

        $.each(self.jcss.children, function(k, v) {
            $(k).css(v.attributes);
        });
    };

    $(window).on("load", function() {

        $("#editcssBtn").on("click", function() {
            var tt = new Tooltips();
            var ce = new CSSEditor();
        });

        $(".wb").css({
            height: $(window).height()
        });

        $.get("/api/v1/wb/css/" + $("#url_slug").val(), function(data) {
            $("body").append("<style>" + CSSJSON.toCSS(data).replace(/u002E/g,".") + "</style>");

        });
    });
})();
