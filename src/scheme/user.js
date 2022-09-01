import Sequelize from 'sequelize'
import sequelize from '../lib/sequelize'

const User = sequelize.define(
  'user',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV1,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING(50),
      field: 'name',
    },
    address: {
      type: Sequelize.STRING(128),
    },
    description: {
      type: Sequelize.STRING(255),
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    freezeTableName: false,
  }
)

User.sync({ force: false })

class UserModel {
  /**
   * find user info
   * @param name  name
   * @returns {Promise.<*>}
   */
  static async findUserByName(name) {
    const userInfo = await User.findOne({
      where: {
        name: name,
      },
    })
    return userInfo
  }
  /**
   * destroy user
   * @param id userid
   * @returns {Promise.<boolean>}
   */
  static async destroyUser(id) {
    await User.destroy({
      where: {
        id: id,
      },
    })
    return true
  }
  /**
   * find user info
   * @param id  userid
   * @returns {Promise.<*>}
   */
  static async findUserById(id) {
    const userInfo = await User.findOne({
      where: {
        id: id,
      },
    })
    return userInfo
  }
  /**
   * update user
   * @param id  name
   * @param status  update user
   * @returns {Promise.<boolean>}
   */
  static async updateUserData(name, address, description) {
    await User.update(
      {
        address: address,
        description: description,
      },
      {
        where: {
          name: name,
        },
        fields: ['address', 'description'],
      }
    ).then((res) => {
      //console.log(res)
    })
    return true
  }
  /**
   * create user
   * @param user
   * @returns {Promise.<boolean>}
   */
  static async createUser(user) {
    //new Date()
    await User.create({
      name: user.name,
      address: user.address,
      description: user.description,
    })
    return true
  }
}

module.exports.UserModel = UserModel
module.exports.user = User
