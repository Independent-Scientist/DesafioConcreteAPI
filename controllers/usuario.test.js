/* global it, describe */
const usuarioController = require('./usuario')
const Usuario = require('../models/usuario')
const mongoose = require('mongoose')

mongoose.Promise = global.Promise

const expect = require('chai').expect

describe('Testando controllers usuario', () => {
  it('A função deve devolver um usuario que tem nome e email', () => {
    const usuario = new Usuario()
    usuario.nome = 'teste'
    usuario.email = 'email'
    const usuarioModificado = usuarioController.usuarioPretty(usuario)
    expect(usuarioModificado).to.have.any.keys('nome')
    expect(usuarioModificado).to.have.any.keys('email')
  })
})
