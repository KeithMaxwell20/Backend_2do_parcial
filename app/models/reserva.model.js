const Mesa = require("./mesa.model.js");
module.exports = (sequelize, Sequelize) => {
  const Reserva = sequelize.define("Reserva", {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    fecha: {
      type: Sequelize.DATEONLY,
    },
    // '["2016-01-01 00:00:00+00:00", "2016-02-01 00:00:00+00:00")'
    rangoHora: {
      type: Sequelize.RANGE(Sequelize.DATE),
      validate: {
        checkHourRange(value) {
          let horaInicio = new Date(Date.parse(value[0]));
          let horaFin = new Date(Date.parse(value[1]));
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
          let horaInicio = new Date(Date.parse(value[0]));
          let horaFin = new Date(Date.parse(value[1]));
          let fecha = new Date(this.fecha);
          if (
            fecha.getDate() != horaInicio.getDate() ||
            fecha.getDate() != horaFin.getDate()
          ) {
            throw new Error(
              "Las fechas de las horas recibidas, y las fechas no coinciden"
            );
          }
        },
      },
      allowNull: false,
    },
    cantidad: {
      type: Sequelize.INTEGER,
      //validate: {
      // Validamos no se exceda la cantidad maxima de comensales en la mesa
      //  checkCantidad(value) {
      //    const mesa = Mesa.findByPk(this.mesaId);
      //    if (mesa.comensales < value) {
      //      throw new Error(
      //        "La cantidad solicitada excede la capacidad de la mesa (" +
      //          mesa.comensales +
      //          ")!"
      //      );
      //    }
      //  },
      //},
    },
  });
  return Reserva;
};
