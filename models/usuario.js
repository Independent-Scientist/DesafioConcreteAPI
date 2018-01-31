const mongoose = require('mongoose')
const guid = require('guid')

/**
 * Telefone model
 */
const TelefoneSchema = mongoose.Schema({
  numero: String,
  ddd: String
})

/**
 * Usuario model
 */
const UsuarioSchema = mongoose.Schema({
  id: {type: String, default: guid.create(), alias: 'ID'},
  nome: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  senha: {
    type: String,
    required: true
  },
  data_criacao: { type: Date, default: new Date() },
  data_atualizacao: { type: Date, default: Date.now },
  ultimo_login: { type: Date, default: Date.now },
  token: String,
  telefones: [TelefoneSchema]
}, {
  versionKey: false
})

const Usuario = mongoose.model('Usuario', UsuarioSchema)

module.exports = Usuario
