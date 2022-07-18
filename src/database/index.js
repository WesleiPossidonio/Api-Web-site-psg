import Sequelize from 'sequelize'

import Users from '../app/models/Users'

import configDataBase from '../config/database'

const models = [Users]

class Database {
  constructor() {
    this.init()
  }

  init() {
    this.connection = new Sequelize(configDataBase)
    models.map((model) => model.init(this.connection))
  }
}

export default new Database()
