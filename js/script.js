/* 
 * Version 4.3
 * Created by serdnah2
 * @Andres542
 * http://www.cornersopensource.com
 * skype: andres54211
 * If you need the search search in an folder, please change de var automatically for true, default is false
 */

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

        function submitForm(eventObject) {
            if (eventObject.preventDefault) {
                eventObject.preventDefault();
            } else if (window.event) {
                window.event.returnValue = false;
            }

            var valueSearch = document.forms.searchForm.search.value;
            var validateSearch = that.trim(valueSearch);
            if (!that.busy && validateSearch !== "" && that.latesSearch !== validateSearch) {
                that.busy = true;
                that.find();
            }
        }

        var arrowPrevious = this.get("arrowPrevious");
        arrowPrevious.addEventListener("click", function() {
            var isDisabled = that.hasClass(this, "disabled");
            if (!isDisabled && that.move) {
                that.move = false;
                window.scrollTo(0, 0);
                that.get("section" + that.currentPaginator).style.display = "none";
                that.currentPaginator--;
                that.get("section" + that.currentPaginator).style.display = "inline-block";
                that.get("currentPages").innerHTML = "P&aacute;gina " + that.currentPaginator + " de: " + that.totalPages;
                if (that.currentPaginator === 1) {
                    that.addClass(this, " disabled");
                }
                if (that.currentPaginator < that.totalPages) {
                    that.removeClass(that.get("arrowNext"), "disabled");
                }
                that.move = true;
            }
        });

        var arrowNext = this.get("arrowNext");
        arrowNext.addEventListener("click", function() {
            var isDisabled = that.hasClass(this, "disabled");
            if (!isDisabled && that.move) {
                that.move = false;
                window.scrollTo(0, 0);
                that.get("section" + that.currentPaginator).style.display = "none";
                that.currentPaginator++;
                that.get("section" + that.currentPaginator).style.display = "inline-block";
                that.get("currentPages").innerHTML = "P&aacute;gina " + that.currentPaginator + " de: " + that.totalPages;
                if (that.totalPages == that.currentPaginator) {
                    that.addClass(this, " disabled");
                }
                if (that.currentPaginator > 1) {
                    that.removeClass(that.get("arrowPrevious"), "disabled");
                }
                that.move = true;

            }
        });
    };

    jsearch.prototype.find = function() {
        this.get("loading").style.display = "block";
        if (this.ismobile) {
            document.forms.searchForm.search.blur();
        }
        this.itemsFound = [];
        this.removeClass(this.get("paginator"), "initWeb");
        this.removeClass(this.get("found"), "initWeb");
        this.addClass(this.get("logo"), "closeLogo");

        setTimeout(function() {
            var matchString = that.trim(document.forms.searchForm.search.value);
            that.latesSearch = matchString;
            if (that.items.length > 0) {
                for (var k in that.items) {
                    if (that.items[k].title.toLowerCase().match(matchString.toLowerCase()) ||
                            that.items[k].description.toLowerCase().match(matchString.toLowerCase()) ||
                            that.items[k].claves.toLowerCase().match(matchString.toLowerCase())) {
                        that.itemsFound.push(that.items[k]);
                    }

                    if (k == (that.items.length - 1)) {
                        that.get("loading").style.display = "none";
                        that.appendElements(that.itemsFound);
                    }
                }
            } else {
                that.busy = false;
                that.get("loading").style.display = "none";
                that.get("found").innerHTML = '<div class="alert alert-info">No se han encontrado resultados. Por favor inserte una nueva palabra</div>';
                that.addClass(that.get("found"), "initWeb");
            }
        }, 1000);
    };

    jsearch.prototype.appendElements = function() {
        this.resetPaginator();
        this.get("found").innerHTML = "";
        var totalData = this.itemsFound.length;
        var show = 10;
        var amountToSee = (totalData / show);
        amountToSee = amountToSee.toString();
        amountToSee = amountToSee.split(".");
        if (amountToSee[1]) {
            if (amountToSee[0] == 0) {
                this.addClass(this.get("arrowNext"), " disabled");
            } else {
                this.addClass(this.get("paginator"), "initWeb");
            }
            amountToSee = amountToSee[0];
            amountToSee++;
            this.totalPages = amountToSee;

        } else {
            if (amountToSee[0] == 0) {
                this.get("found").innerHTML = '<div class="alert alert-info">No se han encontrado resultados. Por favor inserte una nueva palabra</div>';
                this.addClass(this.get("found"), "initWeb");
            } else {
                if (amountToSee[0] == 1) {
                    this.removeClass(this.get("arrowNext"), "disabled");
                }
                this.totalPages = amountToSee;
            }

        }

        var current = 0;
        for (var s = 1; s <= amountToSee; s++) {
            var divFound = this.get("found");
            divFound.innerHTML = divFound.innerHTML + '<div id="section' + s + '" class="itemResult"></div>';
            for (var i = (current * show); i <= ((show * s) - 1); i++) {
                if (that.itemsFound[i]) {
                    var divSection = this.get("section" + s);
                    divSection.innerHTML = divSection.innerHTML + '<div class="itemResultado"><a href=' + that.itemsFound[i].link + '>' + that.itemsFound[i].title + '</a><div class="linkGreen">' + that.itemsFound[i].link + '</div><div>' + that.itemsFound[i].description + '</div><br/></div>';
                    if (i == ((show * s) - 1)) {
                        current++;
                    }
                }

            }
            if (amountToSee == s) {
                this.get("currentPages").innerHTML = "P&aacute;gina " + that.currentPaginator + " de: " + that.totalPages;
                that.addClass(this.get("found"), "initWeb");
                that.addClass(this.get("paginator"), "initWeb");
                setTimeout(function() {
                    that.move = true;
                }, 1000);
            }

        }
    };

    jsearch.prototype.resetPaginator = function() {
        this.totalPages = 0;
        this.currentPaginator = 1;
        this.get("currentPages").innerHTML = "P&aacute;gina " + this.currentPaginator;
        this.removeClass(this.get("arrowNext"), "disabled");
        var isDisabled = this.hasClass(that.get("arrowPrevious"), "disabled");
        if (!isDisabled) {
            that.addClass(this.get("arrowPrevious"), " disabled");
        }
        this.busy = false;
    };

    jsearch.prototype.addItem = function(title, link, description, claves) {
        this.items.push({"title": title, "link": link, "description": description, "claves": claves});
    };

    jsearch.prototype.hasClass = function(ele, cls) {
        return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    };

    jsearch.prototype.addClass = function(ele, cls) {
        if (!this.hasClass(ele, cls))
            ele.className += cls;
    };

    jsearch.prototype.removeClass = function(ele, cls) {
        if (this.hasClass(ele, cls)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            ele.className = ele.className.replace(reg, '');
        }
    };

    jsearch.prototype.trim = function(string) {
        return string.replace(/^\s+/g, '').replace(/\s+$/g, '');
    };

    jsearch.prototype.get = function(obj) {
        return document.getElementById(obj);
    };

    jsearch.prototype.detectBrowser = function() {
        var ismobile = (/iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile|msie/i.test(navigator.userAgent.toLowerCase( )));
        return ismobile;
    };

    search = new jsearch();
    search.init();
};