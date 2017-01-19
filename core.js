(function(app) {
  var el;
  var apis = {
    find: function(selector) {
      if (!el || !selector) {
        return null;
      }

      return el.querySelector(selector);
    },

    hasClass: function(className) {
      if (!el || !className) {
        return false;
      }

      if (el.classList) {
        return el.classList.contains(className);
      }

      return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
    },

    addClass: function(className) {
      if (!el || !className) {
        return;
      }

      if (el.classList) {
        el.classList.add(className);
      } else if (!this.hasClass(el, className)) {
        el.className += ' ' + className;
      }
    },

    removeClass: function(className) {
      if (!el || !className) {
        return;
      }

      if (el.classList) {
        el.classList.remove(className);
        return;
      }

      el.className = el.className.replace(new RegExp('(?:^|\\s)' +
          className + '(?:\\s|$)'), ' ');
    },

    empty: function() {
      if (!el) return;

      while (el.hasChildNodes()) {
        el.removeChild(el.firstChild);
      }
    },

    append: function(html) {
      if (!el) {
        return;
      }

      el.insertAdjacentHTML('beforeend', html);
    },

    on: function(event, fn) {
      if (!el) {
        return;
      }


    },

    off: function(event) {

    },

    hover: function(on, off) {
      if (!el) {
        return;
      }

      el.onmouseover = on.bind(el);
      el.onmouseout = off.bind(el);
    }

  };

  app.dom = function(selector) {
    if (!selector) {
      console.log('Missing required param');
      el = null;
      return;
    }

    if (typeof selector === 'string') {
      if (selector.indexOf('#')) {
        var selectorArr = selector.split(' ');
        var id = selectorArr[0];
        el = document.getElementById(id);
        if (el && selectorArr[1]) {
          el.querySelector(selectorArr[1]);
        }
      } else {
        el = document.querySelector(selector);
      }
    } else if (selector.nodeType) {
      el = selector;
    } else {
      el = null;
    }

    return apis;
  };

})(app);
