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

  var guid = 1;
  var handlerMap = {};
  var dom = {
    el: null,
    find: function(selector) {
      if (!this.el || !selector) {
        return null;
      }

      return this.el.querySelector(selector);
    },

    hasClass: function(className) {
      if (!this.el || !className) {
        return false;
      }

      if (this.el.classList) {
        return this.el.classList.contains(className);
      }

      return !!this.el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
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
    },

    empty: function() {
      if (!this.el) return;

      while (this.el.hasChildNodes()) {
        this.el.removeChild(el.firstChild);
      }
    },

    append: function(html) {
      if (!this.el) {
        return;
      }

      this.el.insertAdjacentHTML('beforeend', html);
    },

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
      if (!this.el || event) {
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
      console.log('Missing required param');
      dom.el = null;
      return;
    }

    if (typeof selector === 'string') {
      if (selector.indexOf('#')) {
        var selectorArr = selector.split(' ');
        var id = selectorArr[0];
        dom.el = document.getElementById(id);
        if (el && selectorArr[1]) {
          dom.el.querySelector(selectorArr[1]);
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
