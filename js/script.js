window.onload = function() {
    window.scrollTo(0, 0);
    var that = null;
    var jsearch = function() {
        this.automatically = false; //search into folder files
        this.items = [];
        this.itemsFound = [];
        this.totalPages = 0;
        this.currentPaginator = 0;
        this.busy = false;
        this.latesSearch = null;
        this.blockScreen = true;
        this.move = false;
        this.ismobile = this.detectBrowser();
        that = this;
    };

    jsearch.prototype.init = function() {
        document.body.addEventListener("touchmove", function(e) {
            if (that.blockScreen) {
                e.preventDefault();
            }
        }, false);

        if (!this.ismobile) {
            document.documentElement.style.overflow = "scroll";
        }

        function getHTTPObject() {
            if (typeof XMLHttpRequest !== 'undefined') {
                return new XMLHttpRequest();
            }
            try {
                return new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try {
                    return new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) {
                }
            }
            return false;
        }
        var url = null;
        if (this.automatically) {
            url = "js/databasefolder.js?v=" + (new Date()).getTime();
        } else {
            url = "js/database.js?v=" + (new Date()).getTime();
        }

        this.get("loading").style.display = "block";
        var http = getHTTPObject();
        http.open("GET", url, true);
        http.onreadystatechange = function() {
            if (http.readyState === 4) {
                that.items = JSON.parse(http.responseText);
                that.show();
            }
        };
        http.send(null);
    };

    jsearch.prototype.show = function() {
        this.get("loading").style.display = "none";
        this.get('wrapper').style.display = "block";
        this.get('found').style.display = "block";
        this.get('paginator').style.display = "block";
        setTimeout(function() {
            that.addClass(that.get("wrapper"), "initWeb");
            that.listeners();
            setTimeout(function() {
                that.blockScreen = false;
                withSlopeFinite(that.get('found'));
            }, 1000);
        }, 500);
    };

    jsearch.prototype.listeners = function() {
        var element = that.get("searchForm");
        if (element.addEventListener) {
            element.addEventListener("submit", submitForm, false);
        } else if (element.attachEvent) {
            element.attachEvent("onsubmit", submitForm, false);
        }

        function submit
