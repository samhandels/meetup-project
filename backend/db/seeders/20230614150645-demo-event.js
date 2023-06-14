'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA
}

module.exports = {
  async up (queryInterface, Sequelize) {
   options.tableName = 'Events';
   await queryInterface.bulkInsert(options, [
    {
      groupId: 1,
      venueId: 2,
      name: 'Harlem Globetrotters vs the New York Nets',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      type: 'In person',
      capacity: 1500,
      price: 50.00,
      startDate: '2023-08-15 12:00:00',
      endDate: '2023-08-15 16:00:00'
    },
    {
      groupId: 2,
      venueId: null,
      name: 'Create a Tetris Game Group Session',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      type: 'Online',
      capacity: 15,
      price: 0,
      startDate: '2023-07-10 16:00:00',
      endDate: '2023-07-10 18:00:00'
    },
    {
      groupId: 3,
      venueId: 3,
      name: 'Las Vegas Skateboarding Championship',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      type: 'In person',
      capacity: 1000,
      price: 25.00,
      startDate: '2023-06-25 12:00:00',
      endDate: '2023-06-25 16:30:00'
    },
    {
      groupId: 4,
      venueId: null,
      name: 'Episode III - Revenge of the Sith',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      type: 'Online',
      capacity: 50,
      price: 5.00,
      startDate: '2023-10-31 22:00:00',
      endDate: '2023-11-01 01:00:00'
    },
    {
      groupId: 5,
      venueId: 3,
      name: 'August Hike in Malibu',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      type: 'In person',
      capacity: 30,
      price: 0,
      startDate: '2023-8-17 08:00:00',
      endDate: '2023-8-17 12:00:00'
    },
   ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Events';
    await queryInterface.bulkDelete(options)
  }
};
