Purpose
=======
TinyDB is a tiny json file based database for NodeJS.   
Normally, it's better to use it for your little project.

Features
========

- auto save data in memory to local fild after add/delete item;
- all APIs have a callback function for data handling;
- name API refering to Mongoose;
- no third-party dependencies.

Usage
=====
```javascript
var TinyDB = require('tinydb');
test_db = new TinyDB('./test.db');

test_db.onReady = function() {
  console.log('database is ready for operating');

  // set info to DB
  test_db.setInfo('title', 'Test DB', function(err, key, value) {
    if (err) {
      console.log(err);
      return;
    }
    
    console.log('[setInfo] ' + key + ' : ' + value);
  });
  
  // get info from DB
  test_db.getInfo('title', function(err, key, value) {
    if (err) {
      console.log(err);
      return;
    }
    
    console.log('[getInfo] ' + key + ' : ' + value);
  });
  
  // do other things below
  test_db.forEach(function (err, item) {
    if (err) {
      console.log(err);
      return;
    }

    for (var key in item) {
      console.log(key + ' : ' + item[key]);
    }
  });
}
```

APIs
====

.flush(callback)
------
Write the data in memory to your specified databse file immediately.

.find(query, callback)
---------
Find databse items. `query` is a object like `{_id: "xxxxx"}`.

.findById(id, callback)
-----------------------
Find database item by `id`, equal to `.find({_id: id}, callback)`;

.findByIdAndRemove(id, callback)
--------------------------------
Find database item by `id` and remove it from database.

.insertItem(item, idx, callback)
--------------------------------
Insert `item` to database. `idx` is optional, default to `0`.

.appendItem(item, callback)
---------------------------
Append `item` to database.

Thanks
===========
Source code of function `._guid()` is refering to [How to create a GUID / UUID in Javascript?](http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript).

Contact
=======
`mail` : [isaymeorg@gmail.com](mailto:isaymeorg@gmail.com)