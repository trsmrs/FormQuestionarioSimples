const Sequelize = require('sequelize')

const connection = new Sequelize('guiaperguntas', 'root','209065',{
    host: 'localhost',
    dialect: 'mysql'
})


module.exports = connection