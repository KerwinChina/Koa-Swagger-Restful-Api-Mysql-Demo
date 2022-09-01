import Sequelize from 'sequelize'
import sequelize from '../lib/sequelize'

const Follower = sequelize.define(
  'follower',
  {
    id: {
      type: Sequelize.INTEGER(10),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: Sequelize.STRING(128),
      field: 'user_id',
    },
    follower_id: {
      type: Sequelize.STRING(128),
    },
    status: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
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

Follower.sync({ force: false })
//select my flower
//select * from follower where user_id = '1'

//select flower me
//select * from follower where  follower_id = '1'

//select flower me and me flower
//select a.* from (
// select a.user_id from follower as a inner join follower as b
// on a.follower_id = '1' and b.follower_id = '1'
//) a group by a.user_id;

//judge user if flower
//select 1 from follower where user_id = '1' and follower_id = '2'
//union all
//select 2 from follower where user_id = '2' and follower_id = '1'
class FollowerModel {
  /**
   * find me  follower
   * @param name  user_id
   * @returns {Promise.<*>}
   */
  static async findMeFollowerByUserId(user_id) {
    const userInfo = await Follower.findAll({
      where: {
        user_id: user_id,
      },
    })
    return userInfo
  }
  static async findMeFollower(user_id, follower_id) {
    const userInfo = await Follower.findOne({
      where: {
        user_id: user_id,
        follower_id: follower_id,
      },
    })
    return userInfo
  }
  static async findFollower(id) {
    const userInfo = await Follower.findOne({
      where: {
        id: id,
      },
    })
    return userInfo
  }
  static async UpdateFollower(id, follower_id) {
    const ret = await Follower.update(
      { follower_id: follower_id },
      {
        where: {
          id: id,
        },
      }
    )
    return ret
  }
  /**
   * find flower me
   * @param id  userid
   * @returns {Promise.<*>}
   */
  static async findFollowerMeByUserId(follower_id) {
    const userInfo = await User.findOne({
      where: {
        follower_id: follower_id,
      },
    })
    return userInfo
  }
  static async destroyFlower(id) {
    await Follower.destroy({
      where: {
        id: id,
      },
    })
    return true
  }
  /**
   * create flower
   * @param user
   * @returns {Promise.<boolean>}
   */
  static async createFlower(user) {
    await Follower.create({
      user_id: user.user_id,
      status: 0,
      follower_id: user.follower_id,
    })
    return true
  }
}

module.exports = FollowerModel
