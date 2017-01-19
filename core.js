(function(app) {
  var parseEventName = function(eventName) {
    var result = {};
    if (!eventName) {
      return result;
    }

    var arr = eventName.split('.');
    result['type'] = arr[0];
    result['namespace'] = arr.slice(1).join('.');
    return result;
  };

  var isElementHidden = function(el) {
    return window.getComputedStyle(el, null).getPropertyValue('display') === 'none';
  };

  var guid = 1;
  var handlerMap = {};
  var dom = {
    el: null,

    //
    // Selector methods
    //

    find: function(selector) {
      if (!this.el || !selector) {
        return null;
      }

      this.el = this.el.querySelector(selector);
      return this;
    },

    parent: function() {
      if (!this.el || !this.el.parentNode) {
        return;
      }

      this.el = this.el.parentNode;
      return this;
    },

    sibling: function(className) {
      if (!this.el) {
        return;
      }

      var parent = this.parent();
      var childNodes = parent.childNodes;
      for (var i = 0, ii = childNodes.length; i < ii; i++) {
        var node = childNodes[i];
        if (this.hasClass(className, node)) {
          this.el = node;
          return this;
        }
      }

      this.el = null;
      return this;
    },

    empty: function() {
      if (!this.el) return;

      while (this.el.hasChildNodes()) {
        this.el.removeChild(el.firstChild);
      }

      return this;
    },

    append: function(html) {
      if (!this.el) {
        return;
      }

      this.el.insertAdjacentHTML('beforeend', html);
      return this;
    },

    show: function(opt_style) {
      if (!this.el || !isElementHidden(this.el)) {
        return;
      }

      this.el.style.display = opt_style || 'block';
      return this;
    },

    hide: function() {
      if (!this.el) {
        return;
      }

      this.el.style.display = 'none';
      return this;
    },

    toggle: function(opt_style) {
      if (!this.el) {
        return;
      }

      if (isElementHidden(this.el)) {
        this.show(opt_style);
      } else {
        this.hide();
      }

      return this;
    },

    //
    // Classes methods
    //

    hasClass: function(className, opt_el) {
      var el = opt_el || this.el;
      if (!el || !className) {
        return false;
      }

      if (el.classList) {
        return el.classList.contains(className);
      }

      return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
    },

    addClass: function(className) {
      if (!this.el || !className) {
        return;
      }

      if (this.el.classList) {
        this.el.classList.add(className);
      } else if (!this.hasClass(el, className)) {
        this.el.className += ' ' + className;
      }

      return this;
    },

    removeClass: function(className) {
      if (!this.el || !className) {
        return;
      }

      if (this.el.classList) {
        this.el.classList.remove(className);
        return;
      }

      this.el.className = this.el.className.replace(new RegExp('(?:^|\\s)' +
          className + '(?:\\s|$)'), ' ');

      return this;
    },

    //
    // Events
    //

    on: function(event, fn) {
      if (!this.el || !event || !fn) {
        return;
      }

      var eventObj = parseEventName(event);
      var type = eventObj['type'];
      var namespace = eventObj['namespace'];
      this.el.addEventListener(eventObj['type'], fn, false);

      var domEventId = this.el.dataset.domEventGuid;
      if (!domEventId) {
        domEventId = guid;
        this.el.dataset.domEventGuid = guid++;
      }
      if (!handlerMap[domEventId]) {
        handlerMap[domEventId] = {};
      }
      if (!handlerMap[domEventId][type]) {
        handlerMap[domEventId][type] = {};
      }
      if (!handlerMap[domEventId][type][namespace]) {
        handlerMap[domEventId][type][namespace] = [];
      }
      handlerMap[domEventId][type][namespace].push(fn);
    },

    off: function(event) {
      if (!this.el || !event) {
        return;
      }

      var this_ = this;
      var eventObj = parseEventName(event);
      var type = eventObj['type'];
      var namespace = eventObj['namespace'];
      var domEventId = this.el.dataset.domEventGuid;
      if (handlerMap[domEventId] &&
          handlerMap[domEventId][type] &&
          handlerMap[domEventId][type][namespace]) {
        handlerMap[domEventId][type][namespace].forEach(function(fn) {
          this_.el.removeEventListener(type, fn, false);
        });
        handlerMap[domEventId][type][namespace] = [];
      }
    },

    rebind: function(event, fn) {
      if (!this.el || !event || !fn) {
        return;
      }

      this.off(event);
      this.on(event, fn);
    },

    hover: function(on, off) {
      if (!this.el) {
        return;
      }

      this.el.onmouseover = on.bind(this.el);
      this.el.onmouseout = off.bind(this.el);
    }
  };

  app.dom = function(selector) {
    if (!selector) {
      console.error('Missing required param');
      dom.el = null;
      return;
    }

    if (typeof selector === 'string') {
      if (selector.indexOf('#') === 0) {
        var selectorArr = selector.split(' ');
        var id = selectorArr[0].substring(1);
        dom.el = document.getElementById(id);
        if (dom.el && selectorArr[1]) {
          dom.el = dom.el.querySelector(selectorArr[1]);
        }
      } else {
        dom.el = document.querySelector(selector);
      }
    } else if (selector.nodeType) {
      dom.el = selector;
    } else {
      dom.el = null;
    }

    return dom;
  };

})(app);
