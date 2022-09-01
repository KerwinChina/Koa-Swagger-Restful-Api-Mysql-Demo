import Sequelize from 'sequelize'
import { DB as DBConfig, System as SystemConfig } from '../config/config'

export default new Sequelize(
  DBConfig.database,
  DBConfig.username,
  DBConfig.password,
  {
    host: DBConfig.host,
    port: DBConfig.port,
    dialect: SystemConfig.db_type,
    pool: {
      max: 50,
      min: 0,
      idle: 10000,
    },
  }
)
