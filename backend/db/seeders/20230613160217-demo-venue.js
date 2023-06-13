'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Venues';
    await queryInterface.bulkInsert(options, [
     {
       groupId: 1,
       address: '4100 FairFax Drive',
       city: 'Los Angeles',
       state: 'CA',
       lat: 34.0802,
       lng: 118.3511
     },
     {
      groupId: 2,
      address: '62 Malcolm X Blvd',
      city: 'New York',
      state: 'NY',
      lat: 40.8116,
      lng: 73.9465
     },
     {
      groupId: 3,
      address: '1925 Las Virgenes Road',
      city: 'Malibu',
      state: 'CA',
      lat: 34.0259,
      lng: 118.7798
     },
     {
      groupId: 4,
      address: '3521 N Durango Dr',
      city: 'Las Vegas',
      state: 'NV',
      lat: 36.1716,
      lng: 115.1391
     },
     {
      groupId: 5,
      address: 'Longwood Ave',
      city: 'Boston',
      state: 'MA',
      lat: 42.3601,
      lng: 71.0589
     },
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Venues';
    await queryInterface.bulkDelete(options)
  }
};
