/**
 * Created by james on 12/03/2016.
 */


$(function() {

    var RevisionsPagination = {
        sets: [],
        set: [],
        setCounter: 0,
        page: 0,
        data: [],

        init: function() {
            var self = this;

            for(var i=0; i<self.data.length; i++) {

                self.set.push(self.data[i]);

                if((i + 1) % 10 == 0 || (i + 1) >= self.data.length) {
                    self.setCounter++;
                    self.sets.push(self.set);
                    self.set = [];
                }
            }

            $("#pg-prev").after(function() {
                var mrkp = "";
                for (var i=0; i<self.sets.length; i++) {
                    mrkp += "<li><a id='rev-set-" + i + "' href='#' class='rev-set " + (i==0 ? "active" : "") + "' rev-set='" + (i) + "'>" + (i+1) + "</a></li>"
                }
                return mrkp;
            });

            $("#" + $("#currentRevision").val()).css({"font-weight": 800, "text-decoration": "underline"});

            self.buildPage(self.page);
            self.setEvents();
        },

        setEvents: function() {
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
        },

        buildPage: function(index) {
            var self = this;

            $("#revisionsList").find("ul").html(function() {
                var mrkp = "";
                self.sets[index].forEach(function(i) {
                    var d = new Date(i.datetime);
                    var rul = $("#revisionsList").find("ul");
                    mrkp += "<li id='"+i.datetime+"'><a href='" + i.url + "'>" + d.toLocaleTimeString() + " - " + d.toLocaleDateString() + "</a></li>";
                });
                return mrkp;
            });
        }
    };


    $(".wb").on("init-revision-pages", function(event, data) {
        var rp = Object.create(RevisionsPagination);

        rp.data = data;
        rp.init();
    });

});
