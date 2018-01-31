const jwt = require('jsonwebtoken')
const models = {}

const fs = require('fs')
const path = require('path')

// Sincroniza modelos com o banco
fs
  .readdirSync(__dirname)
  .filter((filename) => filename !== 'index.js')
  .forEach((filename) => {
    if (filename.slice(-3) !== '.js') return

    var filepath = path.join(__dirname, filename)

    var imported = (require(filepath).default) ? require(filepath).default : require(filepath)
    if (typeof imported.modelName !== 'undefined') {
      models[imported.modelName] = imported
    }
  })

module.exports = {
  models,
  jwt,
}
