window.onload = function() {
    var that = null;
    var add = function() {
        this.busy = false;
        this.error = false;
        that = this;
    };

    add.prototype.listeners = function() {
        var element = document.getElementById("addForm");
        if (element.addEventListener) {
            element.addEventListener("submit", submitForm, false);
        } else if (element.attachEvent) {
            element.attachEvent("onsubmit", submitForm, false);
        }

        function urlRegExp(url) {
            var regex = /^(ht|f)tps?:\/\/\w+([\.\-\w]+)?\.([a-z]{2,4}|travel)(:\d{2,5})?(\/.*)?$/i;
            return regex.test(url);
        }

        function submitForm(eventObject) {
            if (eventObject.preventDefault) {
                eventObject.preventDefault();
            } else if (window.event) /* for ie */ {
                window.event.returnValue = false;
            }

            var inputs = element.getElementsByTagName('input');
            for (var index = 0; index < inputs.length; ++index) {
                if (that.hasClass(inputs[index], "error")) {
                    that.removeClass(inputs[index], "error");
                }
            }

            for (var index = 0; index < inputs.length; ++index) {
                var valueSearch = inputs[index].value;
                var validateSearch = that.trim(valueSearch);
                validateSearch === "" ? that.error = true : that.error = false;

                if (!that.error) {
                    if (validateSearch.match(">") || validateSearch.match("<") || validateSearch.match(";")) {
                        that.error = true;
                    }
                }

                if (!that.error && inputs[index].name === "link") {
                    !urlRegExp(that.trim(inputs[index].value)) ? that.error = true : that.error = false;
                }

                if (that.error) {
                    if (!that.hasClass(inputs[index], "error")) {
                        that.addClass(inputs[index], " error");
                        inputs[index].focus();
                    }

                    return true;
                }

                if (index === (inputs.length - 1)) {
                    if (!that.error && !that.busy) {
                        that.busy = true;
                        that.addItem();
                    }
                }
            }
        }

        var indexButton = document.getElementById("index");
        if (indexButton.addEventListener) {
            indexButton.addEventListener("click", this.index, false);
        } else if (indexButton.attachEvent) {
            indexButton.attachEvent("onclick", this.index, false);
        }
    };

    add.prototype.addItem = function() {
        document.getElementById("loading").style.display = "block";
        var params = "";
        var element = document.getElementById("addForm");
        var inputs = element.getElementsByTagName('input');
        var http = this.getHTTPObject();
        var url = "php/add.php";
        http.open("POST", url, true);
        http.onreadystatechange = function() {
            if (http.readyState === 4) {
                document.getElementById("loading").style.display = "none";
                var notification = document.getElementById("notification");
                var data = JSON.parse(http.responseText);
                if (!data.error) {
                    that.busy = false;
                    that.error = false;
                    for (var index = 0; index < inputs.length; ++index) {
                        inputs[index].value = "";
                        inputs[index].blur();
                    }
                    notification.style.display = "block";
                    notification.innerHTML = '<div class="alert alert-success">Añadido correctamente</div>';
                    setTimeout(function() {
                        notification.style.display = "none";
                    }, 3000);

                } else {
                    that.busy = false;
                    notification.style.display = "block";
                    notification.innerHTML = '<div class="alert alert-error">Ha ocurrido un error</div>';
                    setTimeout(function() {
                        notification.style.display = "none";
                    }, 3000);
                }
            }
        };

        for (var index = 0; index < inputs.length; ++index) {
            if (params === "") {
                params = params + inputs[index].name + "=" + encodeURI(that.trim(inputs[index].value));
            } else {
                params = params + "&" + inputs[index].name + "=" + encodeURI(that.trim(inputs[index].value));
            }

            if (index === (inputs.length - 1)) {
                console.log(params);
            }
        }

        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        http.send(params);
    };

    add.prototype.index = function() {
        document.getElementById("loading").style.display = "block";
        that.busy = true;
        var http = that.getHTTPObject();
        var url = "php/";
        http.open("GET", url, true);
        http.onreadystatechange = function() {
            if (http.readyState === 4) {
                document.getElementById("loading").style.display = "none";
                var notification = document.getElementById("notification");
                var data = JSON.parse(http.responseText);
                if (!data.error) {
                    that.busy = false;
                    that.error = false;
                    notification.style.display = "block";
                    notification.innerHTML = '<div class="alert alert-success">' + data.success + '</div>';
                } else {
                    that.busy = false;
                    notification.style.display = "block";
                    notification.innerHTML = '<div class="alert alert-error">' + data.success + '</div>';
                }
                setTimeout(function() {
                    notification.style.display = "none";
                }, 3000);
            }
        };

        http.send(null);
    };

    add.prototype.hasClass = function(ele, cls) {
        return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    };

    add.prototype.addClass = function(ele, cls) {
        if (!that.hasClass(ele, cls))
            ele.className += cls;
    };

    add.prototype.removeClass = function(ele, cls) {
        if (that.hasClass(ele, cls)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            ele.className = ele.className.replace(reg, '');
        }
    };

    add.prototype.trim = function(string) {
        return string.replace(/^\s+/g, '').replace(/\s+$/g, '');
    };

    add.prototype.getHTTPObject = function() {
        if (typeof XMLHttpRequest != 'undefined') {
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
    };

    items = new add();
    items.listeners();
};
