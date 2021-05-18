// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"epB2":[function(require,module,exports) {
var element = {
  selections: document.getElementById('selections'),
  canvas: document.getElementById('canvas'),
  pen: document.getElementById('pen'),
  eraser: document.getElementById('eraser'),
  clear: document.getElementById('clear'),
  download: document.getElementById('download'),
  thinLine: document.getElementById('thinLine'),
  strongLine: document.getElementById('strongLine'),
  black: document.getElementById('black'),
  red: document.getElementById('red'),
  yellow: document.getElementById('yellow'),
  blue: document.getElementById('blue')
};
var actions = {
  ctx: element.canvas.getContext('2d'),
  drawLine: function drawLine(x1, y1, x2, y2) {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  },
  getDivHeight: function getDivHeight() {
    var str = window.getComputedStyle(element.selections).getPropertyValue('height');
    return parseInt(str.substring(0, str.length - 2));
  },
  myPicture: function myPicture(status) {
    var _this = this;

    var divHeight = this.getDivHeight();
    var painting = false;
    var last;
    var isTouchDevice = ('ontouchstart' in document.documentElement);

    if (isTouchDevice) {
      element.canvas.ontouchstart = function (e) {
        last = [e.touches[0].clientX, e.touches[0].clientY];
      };

      element.canvas.ontouchmove = function (e) {
        var x = e.touches[0].clientX;
        var y = e.touches[0].clientY;

        _this.drawLine(last[0], last[1], x, y);

        last = [x, y];
      };
    } else {
      element.canvas.onmousedown = function (e) {
        painting = true;
        last = [e.clientX, e.clientY];
      };

      element.canvas.onmouseup = function () {
        painting = false;
      };

      element.canvas.onmousemove = function (e) {
        if (painting) {
          if (status === 'painting') {
            _this.drawLine(last[0], last[1] - divHeight, e.clientX, e.clientY - divHeight);

            last = [e.clientX, e.clientY];
          } else if (status === 'erasing') {
            _this.ctx.clearRect(last[0] - 5, last[1] - 5 - divHeight, 10, 10);

            last = [e.clientX, e.clientY];
          }
        }
      };
    }
  },
  clearCanvas: function clearCanvas() {
    this.ctx.clearRect(0, 0, element.canvas.width, element.canvas.height);
    this.myPicture('painting');
  },
  downloadCanvas: function downloadCanvas() {
    var url = element.canvas.toDataURL();
    var a = document.createElement('a');
    a.download = 'myPainting.png';
    a.href = url;
    a.click();
  },
  addClass: function addClass(tag, className) {
    tag.classList.add(className);

    for (var key in element) {
      if (tag !== element[key]) {
        element[key].classList.remove(className);
      }
    }
  },
  listenToUsers: function listenToUsers() {
    var _this2 = this;

    element.pen.onclick = function () {
      _this2.myPicture('painting');

      _this2.addClass(element.pen, 'selected');
    };

    element.eraser.onclick = function () {
      _this2.myPicture('erasing');

      _this2.addClass(element.eraser, 'selected');
    };

    element.clear.onclick = function () {
      _this2.clearCanvas();

      _this2.addClass(element.clear, 'selected');
    };

    element.download.onclick = function () {
      _this2.downloadCanvas();

      _this2.addClass(element.download, 'selected');
    };

    element.thinLine.onclick = function () {
      _this2.ctx.lineWidth = 5;

      _this2.myPicture('painting');

      _this2.addClass(element.thinLine, 'selected');
    };

    element.strongLine.onclick = function () {
      _this2.ctx.lineWidth = 10;

      _this2.myPicture('painting');

      _this2.addClass(element.strongLine, 'selected');
    };

    element.black.onclick = function () {
      _this2.ctx.strokeStyle = 'black';

      _this2.myPicture('painting');

      _this2.addClass(element.black, 'selected');
    };

    element.red.onclick = function () {
      _this2.ctx.strokeStyle = "red";

      _this2.myPicture('painting');

      _this2.addClass(element.red, 'selected');
    };

    element.yellow.onclick = function () {
      _this2.ctx.strokeStyle = "yellow";

      _this2.myPicture('painting');

      _this2.addClass(element.yellow, 'selected');
    };

    element.blue.onclick = function () {
      _this2.ctx.strokeStyle = "blue";

      _this2.myPicture('painting');

      _this2.addClass(element.blue, 'selected');
    };
  },
  init: function init() {
    element.canvas.width = document.documentElement.clientWidth;
    element.canvas.height = document.documentElement.clientHeight - this.getDivHeight();
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 5;
    this.ctx.lineCap = 'round';
    this.myPicture('painting');
    this.listenToUsers();
  }
};
actions.init();
console.log(element.pen);
},{}]},{},["epB2"], null)
//# sourceMappingURL=main.2baab2eb.js.map