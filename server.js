var FSM = require('./fsm'),
  http = require('http');

var transitions = [
  [undefined, function(m) {
    // m === undefined, which is a special case
    var half = Math.random() > 0.5 ? 'a' : 'b';
    return half + '-introduction';
  }],
  [/(a|b)-introduction/, function(m) {
    return m[1] + '-demographics';
  }],
  [/(a|b)-demographics/, function(m) {
    return m[1] + '-0-question';
  }],
  [/(a|b)-20-answer/, 'conclusion'],
  [/(a|b)-(\d+)-question/, function(m) {
    return m[1] + '-' + m[2] + '-answer';
  }],
  [/(a|b)-(\d+)-answer/, function(m) {
    var index = (parseInt(m[2], 10) + 1);
    return m[1] + '-' + index + '-question';
  }]
];

var fsm = new FSM(transitions);

http.createServer(function(req, res) {
  if (req.url === '/') {
    var cookie = req.headers.cookie;
    var current_state = cookie && cookie.match(/state=([^;]+)/)[1];
    next_state = fsm.feed(current_state);

    res.writeHead(200, {'Set-Cookie': 'state=' + next_state});
    res.end("Currently at state: " + next_state);
  }
}).listen(8282, '127.0.0.1');
