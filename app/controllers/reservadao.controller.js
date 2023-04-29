const e = require("cors");
const db = require("../models");
const Reserva = db.Reserva;
const op = db.Sequelize.Op;

exports.create = (req, res) => {
  // Valida request
  if (!req.body.RestauranteId) {
    res.status(400).send({
      message: "¡Debe enviar el id del restaurante!",
    });
    return;
  } else if (!req.body.MesaId) {
    res.status(400).send({
      message: "¡Debe enviar el id de la mesa!",
    });
  } else if (!req.body.fecha) {
    res.status(400).send({
      message: "¡Debe enviar la fecha de reserva!",
    });
  } else if (!req.body.ClienteId) {
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
  } else if (!req.body.cantidad) {
    res.status(400).send({
      message: "¡Debe enviar la cantidad de comensales!",
    });
  }

  let fecha = new Date(Date.parse(req.body.fecha));
  let horaInicio = new Date();
  horaInicio.setTime(fecha.getTime());
  horaInicio.setHours(req.body.horaInicio, 0, 0);
  let horaFin = new Date();
  horaFin.setTime(fecha.getTime());
  horaFin.setHours(req.body.horaFin, 0, 0);

  // Registramos la reserva
  const reserva = {
    RestauranteId: req.body.RestauranteId,
    MesaId: req.body.MesaId,
    // YYYY-MM-DDTHH:mm:ss.sssZ, '01 Jan 1970 00:00:00 GMT', etc
    fecha: req.body.fecha,
    rangoHora: [horaInicio, horaFin],
    ClienteId: req.body.ClienteId,
    cantidad: req.body.cantidad,
  };

  try {
    // Guardamos en la base de datos
    Reserva.create(reserva)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Ha ocurrido un error al registrar una reserva.",
        });
      });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Ha ocurrido un error al registrar una reserva.",
    });
  }
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
  const RestauranteId = req.params.id;
  Reserva.findAll({
    where: {
      RestauranteId: RestauranteId,
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
            RestauranteId,
      });
    });
};
// Todas las reservas por mesa
exports.findAllByMesa = (req, res) => {
  const MesaId = req.params.id;
  Reserva.findAll({
    where: {
      MesaId: MesaId,
    },
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Ha ocurrido un error al obtener las reservas con mesa id=" + MesaId,
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