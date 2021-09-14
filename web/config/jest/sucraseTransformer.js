const { process } = require("@sucrase/jest-plugin");

/**
 * Had to proxy the `process` function the way Jest is expecting it.
 * The following opened PR will fix it : https://github.com/alangpierce/sucrase/pull/640
 * @type {{process: (src: string, filename: string) => string}}
 */
module.exports = {
  process,
};
