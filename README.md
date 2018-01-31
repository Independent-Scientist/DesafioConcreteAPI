# DesafioConcreteApi
- Dependencias
 - npm
 - yarn

- Instalando dependencias:
$ yarn install

- Iniciando Webserver
$ npm start

- Tests unitarios
$ npm test

# Deploy via docker
- Arquivos de Docker, DockerCompose prontos para deploy local.
- baixando a imagem.
 $ docker pull singletron/desafio_concrete:production
- rodando o container
 $ docker-compose -f production-compose.yaml up

 # Endereco remoto
 API disponivel em EC2 http://18.219.51.163:8081/