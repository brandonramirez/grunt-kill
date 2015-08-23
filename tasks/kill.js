var findPids = require('../lib/find-pids');

module.exports = function (grunt) {
  "use strict";

  grunt.registerMultiTask("kill", "Terminate a process.", function () {
    var pids = findPids(this, grunt);

    if (pids != null) {
      var succeeded = 0;
      var nxProcesses = 0;
      var permissionErrors = 0;

      pids.forEach(function (pid) {
        grunt.log.debug('Killing process ' + pid);

        try {
          process.kill(pid, 'SIGTERM');
          succeeded++;
        }
        catch (e) {
          if (e.code === 'ESRCH') {
            nxProcesses++;
          }
          else if (e.code === 'EPERM') {
            permissionErrors++;
          }
        }

        grunt.log.debug('Killed process ' + pid);
      });

      if (succeeded === 0 && (nxProcesses + permissionErrors) > 0) {
        grunt.fail.warn('Unable to kill any processes.');
      }
      else if (permissionErrors > 0) {
        grunt.fail.warn('Insufficient permission to terminate ' + permissionErrors + ' of the specified processes.');
      }
      else {
        grunt.log.ok('Terminated ' + succeeded + ' processes, ' + nxProcesses + ' skipped.');
      }
    }
  });
};
