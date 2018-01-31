const crypto = require('crypto')
const jwt = require('jsonwebtoken')
global.jwtSecret = 'DesafioConcreteAPI'

/**
 * usuarioPretty - Formatacao de dados do usuario para print.
 * @param {*} usuarioOld 
 */
const usuarioPretty = (usuarioOld) => {
  const usuario = {
    id: usuarioOld.id,
    nome: usuarioOld.nome,
    email: usuarioOld.email,
    senha: usuarioOld.senha,
    data_criacao: usuarioOld.data_criacao,
    data_atualizacao: usuarioOld.data_atualizacao,
    ultimo_login: usuarioOld.ultimo_login,
    telefones: usuarioOld.telefones,
    token: usuarioOld.token
  }
  return usuario
}

/**
 * inserirUsuario - funcao de SignUp
 * Senha criptografada com md5
 * @param {*} param0 
 * @param {*} req 
 * @param {*} res 
 */
const inserirUsuario = async ({ Usuario }, req, res) => {

  // Criando novo usuario com o input
  const usuario = new Usuario(req.body)
  
  // Checando se email ja existe. 
  const existeEmail = await Usuario.findOne({ email: usuario.email })
  if (existeEmail === null) {
    try {

      // Hasheando a senha.
      let hash = crypto.createHash('md5').update(usuario.senha, 'utf-8').digest('hex')
      usuario.senha = hash

      // Parametros da Token
      const payload = {
        auth:  usuario.nome,
        agent: req.headers['user-agent'],
        exp:   Math.floor(new Date().getTime()/1000) + 30*60 // Note: in seconds!
      }

      // signin com jwt
      jwt.sign(payload, jwtSecret, (err, token) => {
        if (err) {
          console.log(err.stack)
        }
        usuario.token = token
      })  
      
      // Salvando novo usuario
      await usuario.save()
      res.status(201).send(
        usuarioPretty(usuario)
      )

    } catch (e) {
      res.status(400).send({
        mensagem: e.erros
      })
    }
  } else {
    res.status(200).send({
      mensagem: 'E-mail já existente'
    })
  }
}

/**
 * logarUsuario - Metodo de login.
 * @param {*} param0 
 * @param {*} req 
 * @param {*} res 
 */
const logarUsuario = async ({ Usuario }, req, res) => {

  // Busca um usuario com o email referido.
  const usuario = await Usuario.findOne({ email: req.body.email })
  if (usuario !== null) {

    try {

      // Hash na senha fornecida para comparacao.
      let hash = crypto.createHash('md5').update(req.body.senha, 'utf-8').digest('hex')
      if (usuario.senha === hash) {

        // Atualiza ultimo login.
        usuario.ultimo_login = new Date()

        // Parametros da Token
        const payload = {
          auth: usuario.nome,
          agent: req.headers['user-agent'],
          exp: Math.floor(new Date().getTime() / 1000) + 30 * 60 // Note: in seconds!
        }

        // signin com jwt
        jwt.sign(payload, jwtSecret, (err, token) => {
          if (err) {
            console.log(err.stack)
          }
          usuario.token = token
        })

        // Salvando novos dados do usuario
        await usuario.save()

        res.status(202).send(
          usuarioPretty(usuario)
        )

      } else {
        res.status(401).send({
          mensagem: 'Usuário e/ou senha inválidos'
        })
      }
    } catch (e) {
      res.status(400).send({
        mensagem: e.erros
      })
    }
  } else {
    res.status(401).send({
      mensagem: 'Usuário e/ou senha inválidos'
    })
  }
}

const buscarUsuario = async ({ Usuario }, req, res) => {
  // Caso o Token do JWT seja valido!
  if (req.user) {
      // buscando o usuario.
      const usuario = await Usuario.findOne({ id: req.params.user_id });
      if (usuario) {
        // retorna o usuario pesquisado.
        res.status(200).send(
          usuarioPretty(usuario)
        )
      } else {
      res.status(403).send({
        mensagem: 'Não autorizado!'
      })
      }
  }else{
      res.status(403).send({
        mensagem: 'Não autorizado!'
      })
  }
}

module.exports = {
  inserirUsuario, logarUsuario, buscarUsuario, usuarioPretty
}
