TinyDB = require('../tinydb');

function test(name, bTest, func) {
  if (false == bTest) {
    return;
  }

  console.log('\n========> ' + name);
  func();
}

//todos = new TinyDB({file: './test.db'});
todos = TinyDB('./test.db');

todos.onReady = function() {
  console.log('database is ready.');

  test('.forEach', true, function() {
    todos.forEach(function (item) {
      for (var key in item) {
        console.log(key + ' : ' + item[key]);
      }
    });
  });

  test('.showOpts', true, function() {
    todos.showOpts();
  });

  test('.setInfo/.getInfo', true, function() {
    todos.getInfo('testinfo', function(err, value) {
      console.log('getInfo [testinfo] return {err: ' + err + ', value: ' + value + '}');
    });
    todos.setInfo('testinfo', 'testinfo value', function(err, value) {
      console.log('setInfo [testinfo] return {err: ' + err + ', value: ' + value + '}');
    });
    todos.getInfo('testinfo', function(err, value) {
      console.log('getInfo [testinfo] return {err: ' + err + ', value: ' + value + '}');
    });
  });

  test('.findById', true, function() {
    todos.findById('53599ebd2935fa7c82178097', function(err, item) {
      if (err) { console.log(err); return; }

      console.log(item);
    });

    todos.findById('53599ebd2935a7c82x178097', function(err, item) {
      if (err) { console.log(err); return; }

      console.log(item);
    });
  });

  test('.insertItem', true, function() {
    todos.insertItem(
        {
          title: 'insert',
          status: 'new'
        },
        function(err) {
          if (err) {
            console.log('insert failed.');
          } else {
            console.log('insert success.');
          }
        });

    todos.insertItem(
        {
          title: 'insert 3',
          status: 'new'
        },
        3,
        function(err) {
          if (err) {
            console.log('insert failed.');
          } else {
            console.log('insert success.');
          }
        });

    todos.appendItem(
        {
          title: 'append',
          status: 'new'
        },
        function(err) {
          if (err) {
            console.log('append failed.');
          } else {
            console.log('append success.');
          }
        });
  });

  test('.find/.findById.findByIdAndRemove', true, function() {
    var rel;

    todos.find({status: 'new'}, function(err, items) {
      console.log('.find return:');
      if (err) { console.log(err); return; }
      rel = items;
      console.log(items);
    });


    todos.findById('53599ebd2935fa7c82178097', function(err, item) {
      console.log('.findById return:');
      if (err) { console.log(err); return; }
      console.log(item);
    });

    todos.findByIdAndRemove('53599ebd2935fa7c82178097', function(err, item) {
      console.log('.findByIdAndRemove return:');
      if (err) { console.log(err); return; }
      console.log(item);
    });

    if (rel) {
      todos.findById(rel[0]._id, function(err, item) {
        console.log('.findById return:');
        if (err) { console.log(err); return; }
        console.log(item);
      });

      todos.findByIdAndRemove(rel[0]._id, function(err, item) {
        console.log('.findByIdAndRemove return:');
        if (err) { console.log(err); return; }

        console.log(item);
      });
    }

    todos.find({status: 'new'}, function(err, items) {
      console.log('.find after item removed return:');
      if (err) { console.log(err); return; }
      rel = items;
      console.log(items);
    });
  });
}


