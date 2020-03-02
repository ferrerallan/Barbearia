'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

      return queryInterface.createTable('frutas', { id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
      } ,
    name:{
      type:Sequelize.STRING
    } });
    
  },

  down: (queryInterface, Sequelize) => {

      return queryInterface.dropTable('frutas');
    
  }
};
