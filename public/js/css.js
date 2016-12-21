(function() {

    /**
     * Tooltips
     * Show id name and tags below wallboard element for easy identification
     * @constructor
     */
    function Tooltips() {
        this.showTips();
    }

    Tooltips.prototype.showTips = function() {
        $('[data-toggle="tooltip"]').tooltip();

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
        this.setEvents();
    }

    CSSEditor.prototype.init = function() {
        var self = this;

        $("#plt").css("width", "350px");
        $("#accordion").hide();
        $("#preview").show();
        $("#plt-hide").hide();

        $.get("/api/v1/wb/css/" + $("#url_slug").val(), function(data) {
            self.jcss = data;

            self.editor = ace.edit("cssEditor");
            self.editor.setTheme("ace/theme/chrome");
            self.editor.session.setMode("ace/mode/css");
            self.editor.insert(CSSJSON.toCSS(self.jcss).replace(/u002E/g,"."));

        });
    };

    CSSEditor.prototype.setEvents = function() {
        var self = this;

        $("#preview").on("click", function() {
            self.applyCSSChanges();
        })
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

    $(window).load(function() {

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
