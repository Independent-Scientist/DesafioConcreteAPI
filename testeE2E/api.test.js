/* global before, it, describe, after */
const Usuario = require('../models/usuario')
const request = require('supertest')
const mongoose = require('mongoose')
const expect = require('chai').expect
const crypto = require('crypto')

const mongo = 'mongodb://mongo/teste-concrete-desafio'
const app = require('../app')

mongoose.Promise = global.Promise

const createInitialUsers = async () => {
  const total = await Usuario.count({})
  let senhaCript = crypto.createHash('md5').update('123456', 'utf-8').digest('hex')
  if (total === 0) {
    const usuario = new Usuario({
      nome: 'lzt',
      email: 'lzt@gmail.com',
      senha: senhaCript,
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub21lIjoiZXplIiwiaWF0IjoxNTE0NjQ5Njk5fQ.4C2taQRsqGq29rjJafW0j42PFM2Oho3HwDT-NbN7j9E',
      telefones: [{ numero: '999998888', ddd: '81' }, { numero: '999997777', ddd: '82' }]
    })
    await usuario.save()
  }
}

describe('Testes E2E usuário', () => {
  let token = ''
  let id = ''
  before('conectando o banco de teste, limpando os usuarios e criando um novo usuario', async () => {
    await mongoose.connect(mongo, {useMongoClient: true})
    await Usuario.remove({})
    await createInitialUsers()
    const usuario = await Usuario.findOne({ email: 'lzt@gmail.com' })
    token = usuario.token
    id = usuario.id
    return true
  })
  it('signin deve retornar o usuário', done => {
    request(app)
      .post('/signin')
      .send({senha: '123456', email: 'lzt@gmail.com'})
      .expect(202)
      .end((err, res) => {
        if (err) {
          console.log(err.stack)
        } else {
         // expect(res.body).to.have.status(202)
          expect(res.body).to.have.any.keys('nome')
          done()
        }
      })
  })
  it('signin não deve retornar usuário com o email errado', done => {
    request(app)
      .post('/signin')
      .send({senha: '123456', email: 'lzt@gmail.commmmmmm'})
      .expect(401)
      .end((err, res) => {
        if (err) {
          console.log(err.stack)
        } else {
          expect(res.body.mensagem).be.equals('Usuário e/ou senha inválidos')
          done()
        }
      })
  })
  it('signin não deve retornar usuário com o senha errada', done => {
    request(app)
      .post('/signin')
      .send({senha: '123456789456', email: 'lzt@gmail.com'})
      .expect(401)
      .end((err, res) => {
        if (err) {
          console.log(err.stack)
        } else {
          expect(res.body.mensagem).be.equals('Usuário e/ou senha inválidos')
          done()
        }
      })
  })
  it('signup deve registrar o usuário', done => {
    request(app)
      .post('/signup')
      .send({ nome: 'lzt', email: 'lzt@com', senha: 'ajo;h213h' })
      .expect(201)
      .end((err, res) => {
        if (err) {
          console.log(err.stack)
        } else {
          expect(res.body).to.have.any.keys('nome')
          done()
        }
      })
  })
  it('signup não deve registrar usuário com o mesmo email', done => {
    request(app)
      .post('/signup')
      .send({ nome: 'lzt', email: 'lzt@gmail.com', senha: '123456' })
      .expect(200)
      .end((err, res) => {
        if (err) {
          console.log(err.stack)
        } else {
          expect(res.body.mensagem).be.equals('E-mail já existente')
          done()
        }
      })
  })
  after('disconnecting', async() => {
    await mongoose.connection.close()
  })
})
