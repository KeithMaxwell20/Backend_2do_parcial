const { QueryInterface } = require("sequelize");

function extraSetup(sequelize) {
  const { Restaurante, Mesa, Reserva, Cliente } = sequelize.models;

  Restaurante.hasMany(Mesa);
  Restaurante.hasMany(Reserva);
  Mesa.hasMany(Reserva);
  Cliente.hasMany(Reserva);

  QueryInterface.addConstraint("Reservas", {
    fields: ["mesaId", "fecha", "rangoHora"],
    type: "unique",
    name: "compositeUniqueConstraint",
  });
}

module.exports = { extraSetup };
