;(function(w, d) {
    var _viewElement = null;
    var _defaultRoute = null;
    var _rendered = false;

    var panaraJs = function() {
        this._routeMap = {};
    }

    // add the route information.
    panaraJs.prototype.addRoute = function(controller, route, template){
        this._routeMap[route] = new routeObj(controller, route, template);
    }

    // set the route information directly from routes.pjlist file.
    panaraJs.prototype.setRoutes = function(routes) {
        for (var m in routes){
            this._routeMap[routes[m].route] = new routeObj(routes[m].controller, routes[m].route, routes[m].template);
        }
    }

    panaraJs.prototype.Initialize = function() {
        // create the update view delegate.
        var updateViewDelegate = updateView.bind(this);

        // get the view element reference.
        _viewElement = d.querySelector('[PanaraApp]');
        if (!_viewElement) return;

        // set a default route.
        _defaultRoute = this._routeMap[Object.getOwnPropertyNames(this._routeMap)[0]];

        // wire up the hash change event with the update view delegate.
        window.onhashchange = updateViewDelegate;

        // call the update view delegate
        updateViewDelegate();

        console.log(this._routeMap);
    }

    // create an update view function.
    function updateView() {
        // get the route name from the url - hash.
        var pageHash = w.location.hash.replace('#', '');
        var routeName = null;
        var routeObj = null;

        routeName = pageHash.replace('/', '');
        
        _rendered = false;

        // fetch the route object using the route name.
        routeObj = this._routeMap[routeName];

        // route name is not found then use default route.
        if (!routeObj) {
            routeObj = _defaultRoute;
        }

        // render the view html associated with the route.
        loadTemplate(routeObj, _viewElement);
    }

    // wire up the update view function with hash changes.
    function loadTemplate(routeObject, viewElement){
        var xmlhttp;
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, chrome, opera, safari.
            xmlhttp = new XMLHttpRequest();
        } else {
            // code for IE4, IE5.
            xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
        }

        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                // load the view
                loadView(routeObject, viewElement, xmlhttp.responseText);
            }
        }

        xmlhttp.open('GET', routeObject.template, true);
        xmlhttp.send();
    }

    // fetch the view html.
    function loadView(routeObject, viewElement, viewHtml) {
        // create the model object.
        var model = {};
        
        // call the controller function of the route.
        routeObject.controller(model);

        // replace the view html tokens with the model properties.
        viewHtml = replaceTokens(viewHtml, model);

        // render the view.
        if (!_rendered) {
            viewElement.innerHTML = viewHtml;
            _rendered = true;
        }
    }


    // replace the tokens.
    function replaceTokens(viewHtml, model) {
        var modelProps = Object.getOwnPropertyNames(model);

        modelProps.forEach(function (element, index, array) {
            viewHtml = viewHtml.replace('{{' + element + '}}', model[element]);
        });

        return viewHtml;
    }

    var routeObj = function (c, r, t) {
        this.controller = c;
        this.route = r;
        this.template = t;
    }

    w['panaraJs'] = new panaraJs();

}) (window, document);