'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Comments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      content_id: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      content: {
        type: Sequelize.STRING(1000),
        allowNull:false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    },{
      tableName:"comments",
      charser:'utf8mb4',
      collate:'utf8mb4_bin'
    }).then(()=>{
      queryInterface.addIndex('comments',{
        name:'content_id',
        fields:['content_id']
      })
    }).then(()=>{
      queryInterface.addIndex('comments',{
        name:'user_id',
        fields:['user_id']
      })
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Comments');
  }
};