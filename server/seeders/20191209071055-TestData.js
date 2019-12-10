'use strict';
const md5 = require('md5')
module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
   return queryInterface.bulkInsert('Users', [
     {
        username: 'Kimoo',
        password:md5(123456)
      },{
        username: 'Aiden',
        password:md5(123456)
      }
    ], {}).then(()=>{
      return queryInterface.bulkInsert('Contents',[
        {
          user_id:1,
          title:'世界第一',
          content:'Aiden is ',
          comment_count: 2,
          like_count:4
        },
        {
          user_id:2,
          title:'梅西金球奖',
          content:'Messi is ',
          comment_count: 5,
          like_count:6
        },{
          user_id:1,
          title:'小皇帝',
          content:'James is ',
          comment_count: 2,
          like_count:4
        },
        {
          user_id:1,
          title:'世界',
          content:'Aiden ',
          comment_count: 4,
          like_count:6
        },
        {
          user_id:1,
          title:'第一',
          content:' is ',
          comment_count: 7,
          like_count:4
        }
      ])
    }).then(()=>{
      return queryInterface.bulkInsert('Comments',[
          {
            content_id:1,
            user_id:1,
            content:'真棒！'
          },
          {
            content_id:1,
            user_id:2,
            content:'好吗？'
          },
          {
            content_id:2,
            user_id:1,
            content:'好的'
          }
      ])
    }).then(()=>{
      return queryInterface.bulkInsert('Likes',[
          {
            content_id:1,
            user_id:2
          },
          {
            content_id:2,
            user_id:1
          }
   
      ])
    });
  },


  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
   return queryInterface.bulkDelete('Users', null, {});
  }
};
