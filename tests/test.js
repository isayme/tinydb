TinyDB = require('../tinydb');

function test(name, bTest, func) {
  if (false == bTest) {
    return;
  }

  console.log('========> ' + name);
  func();
}

//todos = new TinyDB({file: './test.db'});
todos = new TinyDB('./test.db');

todos.onReady = function() {
  console.log('database is ready.');

  test('.forEach', false, function() {
    todos.forEach(function (item) {
      for (var key in item) {
        console.log(key + ' : ' + item[key]);
      }
    });
  });

  test('.showOpts', true, function() {
    todos.showOpts();
  });

  test('.findById', false, function() {
    todos.findById('53599ebd2935fa7c82178097', function(err, item) {
      if (err) { console.log(err); return; }

      console.log(item);
    });

    todos.findById('53599ebd2935a7c82x178097', function(err, item) {
      if (err) { console.log(err); return; }

      console.log(item);
    });
  });

  test('.findByIdAndRemove', false, function() {
    todos.findByIdAndRemove('53599ebd2935fa7c82178097', function(err, item) {
      if (err) { console.log(err); return; }
      console.log(item);
    });

    todos.findByIdAndRemove('53599ebd2935a7c82x178097', function(err, item) {
      if (err) { console.log(err); return; }

      console.log(item);
    });
  });

  test('.setInfo/.getInfo', false, function() {
    todos.getInfo('description', function(err, value) {
      console.log(arguments);
    });
    todos.getInfo('testinfo', function(err, value) {
      console.log(arguments);
    });
    todos.setInfo('testinfo', 'testinfo value', function(err, value) {
      console.log(arguments);
    });
    todos.getInfo('testinfo', function(err, value) {
      console.log(arguments);
    });
  });

  test('.close', false, function() {
    todos.findByIdAndRemove('53599ebd2935fa7c82178097', function(err, item) {
      if (err) { console.log(err); return; }
      console.log(item);
      todos.close();
    });
  });

  test('.insertItem', true, function() {
    todos.insertItem(
        {
          title: 'insert',
          status: 'new'
        },
        function() {
          //console.log(todos._data.data);
        });

    todos.insertItem(
        {
          title: 'insert 3',
          status: 'new'
        },
        3,
        function() {
          //console.log(todos._data.data);
        });

    todos.appendItem(
        {
          title: 'append',
          status: 'new'
        },
        function() {
          //console.log(todos._data.data);
        });
  });
}


