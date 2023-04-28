const { DATEONLY } = require("sequelize");

// id de cliente, cantidad solicitada
module.exports = (sequelize, Sequelize) => {
  const Reserva = sequelize.define("Reserva", {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    restauranteId: {
      type: Sequelize.BIGINT,
      references: {
        model: "Restaurantes",
        key: "id",
      },
    },
    mesaId: {
      type: Sequelize.BIGINT,
      references: {
        model: "Mesas",
        key: "id",
      },
    },
    fecha: {
      type: Sequelize.DATEONLY,
    },
    // '["2016-01-01 00:00:00+00:00", "2016-02-01 00:00:00+00:00")'
    rangoHora: {
      type: Sequelize.RANGE(DataTypes.DATE),
      validate: {
        checkHourRange(value) {
          let horaInicio = Date.parse(value[0]);
          let horaFin = Date.parse(value[1]);
          let auxTime = horaInicio.getTime() + 60 * 60 * 1000;
          // Verificando que hora inicio es una hora menor que horaFin
          // y hora inicio este de 12 a 22.
          if (
            auxTime != horaFin.getTime() &&
            horaInicio.getHour() < 12 &&
            horaInicio.getHour() > 22
          ) {
            throw new Error(
              "Solo se permiten los siguientes intervalos (horas):" +
                " 12 a 13, 13 a 14, 14 a 15, 19 a 20, 20 a 21, 21 a 22, 22 a 23"
            );
          }
        },
        checkDateHour(value) {
          let horaInicio = Date.parse(value[0]);
          let horaFin = Date.parse(value[1]);
          let fecha = this.fecha;
          if (
            fecha.getDate() != horaInicio.getDate() ||
            fecha.getDate() != horaFin.getDate()
          ) {
            throw new Error(
              "Las fechas de las horas recibidas, y las fechas de las "
            );
          }
        },
      },
      allowNull: false,
    },
    clienteId: {
      type: Sequelize.BIGINT,
      model: "Clientes",
      key: "id",
    },
    cantidad: {
      type: Sequelize.INTEGER,
    },
  });
  return Reserva;
};
