const _ = require('lodash');
const glob = require('glob');

// Generate Custom error message
exports.getCustomErrorMessage = (error = {}, message = 'Something went wrong.') => {
  const result = {};

  result.status = false;
  result.message = message;
  result.data = null;
  result.error = error;

  return result;
};

// Generate Custom success message
exports.getCustomSuccessMessage = (data = {}, message = 'Request completed successfully.') => {
  const result = {};

  result.status = true;
  result.message = message;
  result.data = data;
  result.error = null;

  return result;
};

// Get files by glob patterns

exports.getGlobbedPaths = (globPatterns, excludes) => {
  // URL paths regex
  const urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

  // The output array
  let output = [];

  // If glob pattern is array then we use each pattern in a recursive way, otherwise we use glob
  if (_.isArray(globPatterns)) {
    globPatterns.foeEach((globPattern) => {
      output = _.union(output, getGlobbedPaths(globPattern, excludes));
    });
  } else if (_.isString(globPatterns)) {
    if (urlRegex.test(globPatterns)) {
      output.push(globPatterns);
    } else {
      let files = glob.sync(globPatterns);
      if (excludes) {
        files = files.map((file) => {
          if (_.isArray(excludes)) {
            for (let i in excludes) {
              file = file.replace(excludes[i], '');
            }
          } else {
            file = file.replace(excludes, '');
          }
          return file;
        });
      }
      output = _.union(output, files);
    }
  }
  return output;
};
