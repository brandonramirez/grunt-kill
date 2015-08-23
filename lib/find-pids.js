"use strict";

var collectPidFiles = require('./collect-pid-files');

module.exports = function findPids(grunt) {
  if (this.filesSrc != null && this.filesSrc.length > 0) {
    return collectPidFiles(this.filesSrc, grunt);
  }
  else if (this.options.pid != null) {
    return handlePidOption(this.options.pid, grunt);
  }
  else {
    return [];
  }
};

function handlePidOption(pidSpecified, grunt) {
  if (typeof pidSpecified === 'string') {
    return handlePidOptionAsString(pidSpecified, grunt);
  }
  else if (typeof pidSpecified === 'function') {
    return [ pidSpecified() ];
  }
  else if (!isNaN(pidSpecified)) {
    return [ pidSpecified ];
  }
}

function handlePidOptionAsString(pidSpecified, grunt) {
  var pid = parseInt(pidSpecified, 10);

  if (isNaN(pid)) {
    return collectPidFiles([ pidSpecified ], grunt);
  }
  else {
    return [ pid ];
  }
}
