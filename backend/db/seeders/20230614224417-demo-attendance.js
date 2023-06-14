'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Attendances';
    await queryInterface.bulkInsert(options, [
      {
        eventId: 1,
        userId: 2,
        status: 'pending'
      },
      {
        eventId: 2,
        userId: 2,
        status: 'pending'
      },
      {
        eventId: 3,
        userId: 3,
        status: 'pending'
      },
      {
        eventId: 4,
        userId: 4,
        status: 'pending'
      },
      {
        eventId: 5,
        userId: 1,
        status: 'pending'
      },
      {
        eventId: 5,
        userId: 2,
        status: 'waitlist'
      },
      {
        eventId: 3,
        userId: 2,
        status: 'waitlist'
      },
      {
        eventId: 4,
        userId: 2,
        status: 'waitlist'
      },
      {
        eventId: 3,
        userId: 1,
        status: 'waitlist'
      },
      {
        eventId: 4,
        userId: 1,
        status: 'waitlist'
      },
      {
        eventId: 2,
        userId: 1,
        status: 'attending'
      },
      {
        eventId: 1,
        userId: 1,
        status: 'attending'
      },
      {
        eventId: 1,
        userId: 3,
        status: 'attending'
      },
      {
        eventId: 2,
        userId: 3,
        status: 'attending'
      },
      {
        eventId: 4,
        userId: 3,
        status: 'attending'
      },
      {
        eventId: 5,
        userId: 3,
        status: 'attending'
      },
      {
        eventId: 3,
        userId: 4,
        status: 'attending'
      },
      {
        eventId: 3,
        userId: 5,
        status: 'attending'
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Attendances';
    await queryInterface.bulkDelete(options);
  }
};
