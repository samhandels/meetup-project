'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
   options.tableName = 'EventImages';
   await queryInterface.bulkInsert(options, [
    {
      eventId: 1,
      url: 'https://images.unsplash.com/photo-1577200049059-6e78e11c2ec4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
      preview: true
    },
    {
      eventId: 2,
      url: 'https://images.unsplash.com/photo-1555864400-cc47dd93d427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=778&q=80',
      preview: true
    },
    {
      eventId: 3,
      url: 'https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
      preview: true
    },
    {
      eventId: 4,
      url: 'https://images.unsplash.com/photo-1533613220915-609f661a6fe1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=928&q=80',
      preview: true
    },
    {
      eventId: 5,
      url: 'https://images.unsplash.com/photo-1499898595565-f424ed1d075c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1771&q=80',
      preview: true
    }
   ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'EventImages';
    await queryInterface.bulkDelete(options)
  }
};
