fs = require('fs');

function TinyDB(opts) {
  var self = this;

  if (!(this instanceof TinyDB)) {
    return this;
  }

  this._state = 'prepare';
  this._data = {};
  this.options = {
    'file': ''
  };
  
  if (typeof opts === 'string') {
    this.options.file = opts;
  } else if (typeof opts === 'object') {
    for (var idx in opts) {
      this.options[idx] = opts[idx];
    }
  }

  this._load();

  process.on('exit', function() {
    self._save(-1);
  });

  return this;
}

TinyDB.prototype._load = function() {
  var self = this;

  if (typeof this.options.file !== 'string'
      || !this.options.file) {
    throw new Error('options.file undefined or empty.');
  }

  fs.readFile(this.options.file, 'utf8', function(err, data) {
    if (err) {
      self._data = {};
    } else {
      self._data = JSON.parse(data.toString());
    }

    if (typeof self._data.data === 'undefined') {
      self._data.data = [];
    }
    self._state = 'ready';

    if (typeof self.onReady == 'function') {
      self.onReady();
    }
  });
}

TinyDB.prototype._save = function(delay, callback) {
  var self = this;

  if ('ready' !== this._state) {
    return callback && callback(new Error('database not ready.'));
  }

  if (typeof delay === 'number' && 0 > delay) {
    if (self._timeoutObj) {
      clearTimeout(self._timeoutObj);
      delete self._timeoutObj;
    }
    
    fs.writeFileSync(self.options.file, JSON.stringify(self._data), 'utf8');
    return callback && callback(null);
  } else {
    if (this._timeoutObj) {
      return callback && callback(null);
    }
  
    this._timeoutObj = setTimeout(function() {
      delete self._timeoutObj;
      fs.writeFile(self.options.file, JSON.stringify(self._data), 'utf8', function(err) {
        if (err) throw err;
        if (typeof delay === 'function') {
          return delay(null);
        } else {
          return callback && callback(null);
        }
      });
    }, typeof delay === 'number' ? delay : 10000);
  }
}

TinyDB.prototype.close = function(callback) {
  var self = this;

  if ('ready' !== this._state) {
    return callback && callback(new Error('database not ready.'));
  }

  this._state = 'closed';

  if (this._timeoutObj) {
    clearTimeout(this._timeoutObj);
  }

  fs.writeFile(this.options.file, JSON.stringify(this._data), 'utf8', function(err) {
    if (err) throw err;

    delete self._data;
    self._data = {};
    return callback && callback(null);
  });
}

TinyDB.prototype._guid = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

TinyDB.prototype.showOpts = function() {
  for (var idx in this.options) {
    console.error('"' + idx + '" : [' + this.options[idx] + ']');
  }
}

TinyDB.prototype.setInfo = function(key, value, callback) {
  if ('ready' !== this._state) {
    return callback && callback(new Error('database not ready.'));
  }

  if ('data' === key) {
    return callback && callback(new Error('permission denied on key "data".'));
  }

  this._data[key] = value;
  this._save();
  return callback && callback(null, key, value);
}

TinyDB.prototype.getInfo = function(key, callback) {
  if ('ready' !== this._state) {
    return callback && callback(new Error('database not ready.'));
  }

  if (this._data[key]) {
    return callback && callback(null, key, this._data[key]);
  } else {
    return callback && callback(new Error('key not exist.'));
  }
}

TinyDB.prototype.forEach = function(callback) {
  if ('ready' !== this._state) {
    return callback(new Error('database not ready.'));
  }

  for (var i = 0; i < this._data.data.length; i++) {
    if (this._data.data[i]._id) {
      callback && callback(null, this._data.data[i], i);
    }
  }
}

TinyDB.prototype.find = function(query, callback) {
  if ('ready' !== this._state) {
    return callback && callback(new Error('database not ready.'));
  }
  
  var arr = [];
  var flag = true;

  for (var i = 0; i < this._data.data.length; i++) {
    flag = true;
    for (var idx in query) {
      if (!this._data.data[i] || query[idx] !== this._data.data[i][idx]) {
        flag = false;
      }
    }
    if (true === flag) {
      arr.push(this._data.data[i]);
    }
  }

  if (arr.length) {
    return callback && callback(null, arr);
  } else {
    return callback && callback(new Error('not found'));
  }
}

TinyDB.prototype.findById = function(id, callback) {
  if ('ready' !== this._state) {
    return callback && callback(new Error('database not ready.'));
  }

  for (var i = 0; i < this._data.data.length; i++) {
    if (this._data.data[i]._id === id) {
      return callback && callback(null, this._data.data[i], i);
    }
  }

  return callback && callback(new Error('not found'));
}

TinyDB.prototype.findByIdAndRemove = function(id, callback) {
  var self = this;

  this.findById(id, function(err, item, idx) {
    if (err) {
      return callback && callback(err);
    } else {
      self._data.data.splice(idx, 1);
      self._save();

      return callback && callback(null, item, idx);
    }
  });
}

TinyDB.prototype.insertItem = function(item, idx, callback) {
  var func = typeof idx === 'function' ? idx : callback;
  var index = typeof idx === 'number' ? idx : 0;

  if ('ready' !== this._state) {
    return func && func(new Error('database not ready.'));
  }

  item._id = this._guid();
  this._data.data.splice(index, 0, item);
  this._save();
  return func && func(null, item, index > (this._data.data.length - 1) ? (this._data.data.length - 1) : index);
}

TinyDB.prototype.appendItem = function(item, callback) {
  if ('ready' !== this._state) {
    return callback && callback(new Error('database not ready.'));
  }

  item._id = this._guid();
  this._data.data.push(item);
  this._save();

  return callback && callback(null, item, this._data.data.length - 1);
}

module.exports = TinyDB;