const fs = require('fs');
const { promisify } = require('util');

const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);

exports.createDirectory = async (dirPath) => {
  return mkdirAsync(process.cwd() + dirPath, { recursive: true });
};

exports.createFile = async (filePath, fileContent) => {
  return writeFileAsync(process.cwd() + filePath, fileContent);
};
