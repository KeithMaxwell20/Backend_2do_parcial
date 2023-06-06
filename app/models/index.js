const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const { extraSetup } = require("./associations.js");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  port: dbConfig.PORT,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Ventas = require("./venta.model.js")(sequelize, Sequelize);
db.Restaurante = require("./restaurante.model.js")(sequelize, Sequelize);
db.Mesa = require("./mesa.model.js")(sequelize, Sequelize);
db.Cliente = require("./cliente.model.js")(sequelize, Sequelize);
db.Reserva = require("./reserva.model.js")(sequelize, Sequelize);
db.Producto = require("./producto.model.js")(sequelize, Sequelize);

sync();
// Agregando las asociaciones
extraSetup(db);

// Agregando constraint de unicidad para las reservas.
db.sequelize.queryInterface
  .addConstraint("Reservas", {
    fields: ["MesaId", "fecha", "rangoHora"],
    type: "unique",
    name: "composite_unique_mesaId_fecha_rangoHora",
  })
  .catch((err) => {
    console.log(err),
      console.log(
        'The constraint "composite_unique_mesaId_fecha_rangoHora" already exists!!'
      );
  });

// Agregando constraint de unicidad para las posiciones de las mesas (combinacion
// de posicion+piso+restaurante no se puede repetir).
db.sequelize.queryInterface
  .addConstraint("Mesas", {
    fields: ["RestauranteId", "posicionX", "posicionY", "planta"],
    type: "unique",
    name: "composite_unique_RestauranteId_posicionXY_planta",
  })
  .catch((err) => {
    console.log(err),
      console.log(
        'The constraint "composite_unique_RestauranteId_posicionXY_planta" already exists!!'
      );
  });

function sync() {
  db.sequelize
    .sync({ force: false, alter: true })
    .then(function () {
      console.log("database has been synced");
    })
    .catch(function () {
      console.log("unable to sync database");
    });
}

module.exports = db;
