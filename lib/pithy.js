/**
 * Universal module definition
 */

(function (root, factory) {

    if (typeof exports === 'object') {
        factory(exports); // Commonjs
    }
    else if (typeof define === 'function' && define.amd) {
        define(['exports'], factory); // AMD
    }
    else {
        root.pithy = {};
        factory(root.pithy); // Browser globals
    }

}(this, function (exports) {

    var elements = [
        'html','head','title','base','link','meta','style','script',
        'noscript','body','section','nav','article','aside','h1','h2',
        'h3','h4','h5','h6','hgroup','header','footer','address','main',
        'p','hr','pre','blockquote','ol','ul','li','dl','dt','dd',
        'figure','figcaption','div','a','em','strong','small','s','cite',
        'q','dfn','abbr','data','time','code','var','samp','kbd','sub',
        'sup','i','b','u','mark','ruby','rt','rp','bdi','bdo','span','br',
        'wbr','ins','del','img','iframe','embed','object','param','video',
        'audio','source','track','canvas','map','area','svg','math',
        'table','caption','colgroup','col','tbody','thead','tfoot','tr',
        'td','th','form','fieldset','legend','label','input','button',
        'select','datalist','optgroup','option','textarea','keygen',
        'output','progress','meter','details','summary','command','menu'
    ];

    var isEmpty = {
        'area': true, 'base': true, 'br': true, 'col': true, 'hr': true,
        'img': true, 'input': true, 'link': true, 'meta': true,
        'param': true, 'embed': true
    };

    var toString = Object.prototype.toString;

    exports.escape = function (s) {
        // don't escape SafeStrings, since they're already safe
        if (s instanceof SafeString) {
            return s;
        }
        s = ('' + s); /* Coerce to string */
        s = s.replace(/&/g, '&amp;');
        s = s.replace(/</g, '&lt;');
        s = s.replace(/>/g, '&gt;');
        s = s.replace(/"/g, '&quot;');
        s = s.replace(/'/g, '&#39;');
        return new SafeString(s);
    };

    function isString(x) {
        return toString.call(x) == '[object String]';
    }

    var isArray = Array.isArray || function (x) {
        return toString.call(x) === '[object Array]';
    };

    function attrPairs(obj) {
        var r = [];
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                r.push([k, obj[k]]);
            }
        }
        return r;
    };

    function stringifyAttr(k, v) {
        return exports.escape(k) + '="' + exports.escape(v) + '"';
    };

    function stringifyAttrs(attrs) {
        var pairs = attrPairs(attrs);
        var r = [];
        for (var i = 0, len = pairs.length; i < len; i++) {
            r.push(stringifyAttr(pairs[i][0], pairs[i][1]));
        }
        return r.join(' ');
    };

    function parseAttrs(str) {
        var classes = [];
        var ids = [];
        var buffer = null;
        function createBuffer(type) {
            buffer = {type: type, chars: ''};
        }
        function pushBuffer() {
            if (buffer.type === 'class') {
                classes.push(buffer.chars);
            }
            else if (buffer.type === 'id') {
                ids.push(buffer.chars);
            }
            buffer = null;
        }
        for (var i = 0, len = str.length; i < len; i++) {
            var ch = str[i];
            if (ch === '.') {
                if (buffer) {
                    pushBuffer();
                }
                createBuffer('class');
            }
            else if (ch === '#') {
                if (buffer) {
                    pushBuffer();
                }
                createBuffer('id');
            }
            else {
                if (!buffer) {
                    throw new Error(
                        'Malformed attribute string: "' + str + '"'
                    );
                }
                buffer.chars += ch;
            }
        }
        if (buffer) {
            pushBuffer();
        }
        var attrs = {};
        if (ids.length) {
            attrs.id = ids.join(' ');
        }
        if (classes.length) {
            attrs['class'] = classes.join(' ');
        }
        return attrs;
    };

    var SafeString = exports.SafeString = function SafeString(str) {
          this._value = str;
    };
    SafeString.prototype = new String();
    for (var k in String.prototype) {
        (function (k) {
            var func = String.prototype[k];
            SafeString.prototype[k] = function () {
                return func.apply(this._value, arguments);
            };
        }(k));
    }
    SafeString.prototype.toString = function () {
        return this._value;
    };
    SafeString.prototype.valueOf = SafeString.prototype.toString;


    function stringifyContents(contents) {
        var str = '';
        if (contents) {
            for (var i = 0, len = contents.length; i < len; i++) {
                var c = contents[i];
                str += isArray(c) ? stringifyContents(c): exports.escape(c);
            }
        }
        return str;
    };

    function createElementFn(tag, empty) {
        return function (attrs, contents) {
            attrs = attrs || {};
            if (isString(attrs)) {
                attrs = parseAttrs(attrs);
            }
            var attrstr = stringifyAttrs(attrs);
            var inner = stringifyContents(contents);
            if (empty) {
                if (inner) {
                    throw new Error('Contents provided for empty tag type');
                }
                return new SafeString(
                    '<' + tag + (attrstr ? ' ': '') + attrstr + '/>'
                );
            }
            else {
                return new SafeString(
                    '<' + tag + (attrstr ? ' ': '') + attrstr + '>' +
                        inner +
                    '</' + tag + '>'
                );
            }
        };
    }

    // Export tag functions
    for (var i = 0, len = elements.length; i < len; i++) {
        var tag = elements[i];
        exports[tag] = createElementFn(tag, isEmpty[tag]);
    }

}));
