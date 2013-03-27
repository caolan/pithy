var html = require('../lib/pithy');


exports['basic elements'] = function (test) {
    var str = html.div({id: 'test'}, [
        html.h1({}, ['hello']),
        html.p({}, ['blah blah blah'])
    ]);
    test.equal(str, '<div id="test">' +
        '<h1>hello</h1>' +
        '<p>blah blah blah</p>' +
    '</div>');
    test.done();
};

exports['escape content'] = function (test) {
    var str = html.div({id: 'test'}, [
        html.h1({}, ['<script>alert("muahaha");</script>']),
    ]);
    test.equal(str, '<div id="test">' +
        '<h1>&lt;script&gt;alert(&quot;muahaha&quot;);&lt;/script&gt;</h1>' +
    '</div>');
    test.done();
};

exports['escape attrs'] = function (test) {
    var str = html.div({id: 'test'}, [
        html.h1({class: 'foo" onclick="muahaha();"'}, ['hello']),
    ]);
    test.equal(str, '<div id="test">' +
        '<h1 class="foo&quot; onclick=&quot;muahaha();&quot;">hello</h1>' +
    '</div>');
    test.done();
};

exports['self-close tags'] = function (test) {
    var str = html.div({id: 'test'}, [
        html.img({src: 'foo.jpg'}, []),
        html.p({}, ['test']),
        html.br({}, [])
    ]);
    test.equal(str, '<div id="test">' +
        '<img src="foo.jpg"/><p>test</p><br/>' +
    '</div>');
    test.done();
};

exports['short-hand classes and ids'] = function (test) {
    test.equal(
        html.div('.foo', ['test']),
        '<div class="foo">test</div>'
    );
    test.equal(
        html.div('.foo.bar', ['test']),
        '<div class="foo bar">test</div>'
    );
    test.equal(
        html.div('#qux.foo.bar', ['test']),
        '<div id="qux" class="foo bar">test</div>'
    );
    test.equal(
        html.div('.foo#qux.bar', ['test']),
        '<div id="qux" class="foo bar">test</div>'
    );
    test.equal(
        html.div('.foo.bar#qux', ['test']),
        '<div id="qux" class="foo bar">test</div>'
    );
    test.equal(
        html.div('#foo', ['test']),
        '<div id="foo">test</div>'
    );
    test.done();
};

exports['missing contents argument'] = function (test) {
    test.equal(html.div({id: 'test'}), '<div id="test"></div>');
    test.equal(html.img({src: 'foo.jpg'}), '<img src="foo.jpg"/>');
    test.done();
};

exports['null attributes argument'] = function (test) {
    test.equal(html.div(null, 'test'), '<div>test</div>');
    test.done();
};

exports['error on contents for self-closing tag'] = function (test) {
    test.throws(function () {
        html.img({src: 'foo.jpg'}, ['bar']);
    });
    test.throws(function () {
        html.img({src: 'foo.jpg'}, [html.h1({}, 'bar')]);
    });
    test.doesNotThrow(function () {
        html.img({src: 'foo.jpg'}, []);
    });
    test.done();
};

exports['deep nested contents arrays'] = function (test) {
    var str = html.div(null, [
        [html.div('.foo'), html.div('.bar'), [html.div('.baz')]],
        html.p('.qux')
    ]);
    test.equal(str, '<div><div class="foo"></div><div class="bar"></div>' +
        '<div class="baz"></div><p class="qux"></p></div>');
    test.done();
};
