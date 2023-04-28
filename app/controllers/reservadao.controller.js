const e = require("cors");
const db = require("../models");
const Reserva = db.Reserva;
const op = db.Sequelize.Op;

exports.create = (req, res) => {
  // Valida request
  if (!req.body.restauranteId) {
    res.status(400).send({
      message: "¡Debe enviar el id del restaurante!",
    });
    return;
  } else if (!req.body.mesaId) {
    res.status(400).send({
      message: "¡Debe enviar el id de la mesa!",
    });
  } else if (!req.body.fecha) {
    res.status(400).send({
      message: "¡Debe enviar la fecha de reserva!",
    });
  } else if (!req.body.clienteId) {
    res.status(400).send({
      message: "¡Debe enviar el id del cliente!",
    });
  } else if (!req.body.horaInicio) {
    res.status(400).send({
      message: "¡Debe enviar la hora de inicio!",
    });
  } else if (!req.body.horaFin) {
    res.status(400).send({
      message: "¡Debe enviar la hora de finalizacion!",
    });
  } else if (!req.status(400).cantidad) {
    res.status(400).send({
      message: "¡Debe enviar la cantidad de comensales!",
    });
  }

  let fecha = Date.parse(req.body.fecha);
  let horaInicio = fecha;
  horaInicio.setHours(req.body.horaInicio, 0, 0);
  let horaFin = fecha;
  horaFin.setHours(req.body.horaFin, 0, 0);

  // Registramos la reserva
  const reserva = {
    restauranteId: req.body.restauranteId,
    mesaId: req.body.mesaId,
    // YYYY-MM-DDTHH:mm:ss.sssZ, '01 Jan 1970 00:00:00 GMT', etc
    fecha: req.body.fecha,
    rangoHora: [horaInicio, horaFin],
    clienteId: req.body.clienteId,
    cantidad: req.body.cantidad,
  };

  // Guardamos en la base de datos
  Reserva.create(reserva)
    .the((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Ha ocurrido un error al registrar una reserva.",
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Reserva.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error al obtener la reserva con id=" + id,
      });
    });
};
// Todas las reservas
exports.findAll = (req, res) => {
  Reserva.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Ha ocurrido un error al obtener las reservas.",
      });
    });
};
// Todas las reservas por restaurante id
exports.findAllByRestaurante = (req, res) => {
  const restauranteId = req.params.id;
  Reserva.findAll({
    where: {
      restauranteId: restauranteId,
    },
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Ha ocurrido un error al obtener las reservas con restaurante id=" +
            restauranteId,
      });
    });
};
// Todas las reservas por mesa
exports.findAllByMesa = (req, res) => {
  const mesaId = req.params.id;
  Reserva.findAll({
    where: {
      mesaId: mesaId,
    },
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Ha ocurrido un error al obtener las reservas con mesa id=" + mesaId,
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  Reserva.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Reserva eliminada exitosamente!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error al eliminar la reserva con id=" + id,
      });
    });
};
