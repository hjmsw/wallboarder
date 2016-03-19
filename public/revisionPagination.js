/**
 * Created by james on 12/03/2016.
 */


(function() {

    /**
     * Creates a new revisions pagination object
     * @param data
     * @constructor
     */
    function RevisionsPagination(data) {
        this.sets = this.splitData(data);
        this.page = 0;

        var self = this;

        //Get page number from query string if exists
        if (document.location.search !== "") {
            var queries = {};
            $.each(document.location.search.substr(1).split("&"),function(c,q){
                var i = q.split("=");
                queries[i[0].toString()] = i[1].toString();
            });
            self.page = parseInt(queries.page);
        }

        self.buildPage(self.page);
        self.buildPaginationNav();

        self.setEvents();
    }

    /**
     * Break up our revision data into sets
     * @param data
     * @returns {Array}
     */
    RevisionsPagination.prototype.splitData = function(data) {
        var set = [];
        var sets = [];
        var setCounter = 0;

        for(var i=0; i<data.length; i++) {

            set.push(data[i]);

            if((i + 1) % 20 == 0 || (i + 1) >= data.length) {
                setCounter++;
                sets.push(set);
                set = [];
            }
        }
        return sets;
    };

    /**
     * Build the pagination nav
     * @returns mrkp
     */
    RevisionsPagination.prototype.buildPaginationNav = function() {
        var self = this;

        //Build pagination buttons
        $("#pg-prev").after(function() {
            var mrkp = "";
            for (var i=0; i<self.sets.length; i++) {
                mrkp += "<li><a id='rev-set-" + i + "' href='#' class='rev-set " + (i==self.page ? "active" : "") + "' rev-set='" + (i) + "'>" + (i+1) + "</a></li>"
            }
            return mrkp;
        });
    };

    /**
     * Set events for our pagination
     */
    RevisionsPagination.prototype.setEvents = function() {
        var self = this;

        $(".rev-set").on("click", function() {
            $(".rev-set").each(function() {
                $(this).removeClass("active");
            });

            $(this).addClass("active");
            self.page = $(this).attr("rev-set");
            self.buildPage(self.page);
        });

        $(".pg-control").on("click", function() {
            if ($(this).find("a").attr("aria-label") === "Next") {
                self.page++;
                if (self.page <= self.sets.length-1) self.buildPage(self.page);
                else self.page = self.sets.length-1;
            }
            else if($(this).find("a").attr("aria-label") === "Previous") {
                self.page--;
                if (self.page >= 0) self.buildPage(self.page);
                else self.page = 0;
            }

            $(".rev-set").each(function() {
                $(this).removeClass("active");
            });
            $("#rev-set-"+ self.page).addClass("active");
        });
    };

    /**
     * Populate page
     * @param index
     */
    RevisionsPagination.prototype.buildPage = function(index) {
        var self = this;

        $("#revisionsList").find("ul").html(function() {
            var mrkp = "";
            self.sets[index].forEach(function(i) {
                var d = new Date(i.datetime);
                var rul = $("#revisionsList").find("ul");
                mrkp += "<li id='"+i.datetime+"'><a href='" + i.url + "?page=" + index + "'>" + d.toLocaleTimeString() + " - " + d.toLocaleDateString() + "</a></li>";
            });
            return mrkp;
        });

        $("#" + $("#currentRevision").val()).css({"font-weight": 800, "text-decoration": "underline"});
    };

    $(".wb").on("init-revision-pages", function(event, data) {
        var rp = new RevisionsPagination(data);
    });

})();
