
exports.up = function(knex) {
    return knex.schema.createTable('cars', function (table) {
        table.increments();
        table.string('vin', 128).notNullable();
        table.string('make', 64).notNullable();
        table.string('model', 64).notNullable();
        table.float('mileage').notNullable();
        table.string('transmissionType', 64);
        table.string('titleStatus', 64);
        table.timestamps(true, true);
      });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('cars');
};
