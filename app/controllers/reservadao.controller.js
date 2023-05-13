const e = require("cors");
const db = require("../models");
const Reserva = db.Reserva;
const Mesa = db.Mesa;
const op = db.Sequelize.Op;

exports.create = async (req, res) => {
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
    return;
  } else if (!req.body.fecha) {
    res.status(400).send({
      message: "¡Debe enviar la fecha de reserva!",
    });
    return;
  } else if (!req.body.ClienteId) {
    res.status(400).send({
      message: "¡Debe enviar el id del cliente!",
    });
    return;
  } else if (!req.body.horaInicio) {
    res.status(400).send({
      message: "¡Debe enviar la hora de inicio!",
    });
    return;
  } else if (!req.body.horaFin) {
    res.status(400).send({
      message: "¡Debe enviar la hora de finalizacion!",
    });
    return;
  } else if (!req.body.cantidad) {
    res.status(400).send({
      message: "¡Debe enviar la cantidad de comensales!",
    });
    return;
  }

  // Validamos que la cantidad a reservar no supere la cantidad
  // de comensales disponibles para dicha mesa.
  // Validamos no se exceda la cantidad maxima de comensales en la mesa
  const mesa = await Mesa.findByPk(req.body.MesaId);
  if (mesa.comensales < req.body.cantidad) {
    res.status(400).send({
      message:
        "La cantidad solicitada excede la capacidad de la mesa (" +
        mesa.comensales +
        ")!",
    });
    return;
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
        Reserva.findByPk(data.id, {
          include: [
            {
              model: db.Restaurante,
            },
            {
              model: db.Cliente,
            },
            {
              model: db.Mesa,
            },
          ],
        }).then((data) => {
          res.send(data);
        });
        //        res.send(data);
      })
      .catch((err) => {
        if (err.name === "SequelizeUniqueConstraintError") {
          res.status(500).send({
            message:
              "La mesa con id=" +
              req.body.MesaId +
              " ya se encuentra reservada para la fecha " +
              req.body.fecha +
              " de " +
              req.body.horaInicio +
              " a " +
              req.body.horaFin +
              "horas\nNo se puede registrar la reserva.",
          });
        } else if (err.name === "SequelizeValidationError") {
          res.status(500).send({
            message: err.errors[0].message,
          });
        } else {
          res.status(500).send({
            message: err || "Error al registrar la reserva.",
          });
        }
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
  Reserva.findAll({
    include: [
      {
        model: db.Restaurante,
      },
      {
        model: db.Cliente,
      },
      {
        model: db.Mesa,
      },
    ],
  })
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
    include: [
      {
        model: db.Restaurante,
      },
      {
        model: db.Cliente,
      },
      {
        model: db.Mesa,
      },
    ],
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
// Todas las reservas por fecha
// Ex de formato: "2023-03-28 GMT-0400"
exports.findAllByFecha = (req, res) => {
  console.log("Fecha query: " + req.query.fecha);
  const fecha = new Date(Date.parse(req.query.fecha));
  console.log("Fecha es: " + fecha);
  Reserva.findAll({
    where: {
      fecha: fecha,
    },
    include: [
      {
        model: db.Restaurante,
      },
      {
        model: db.Cliente,
      },
      {
        model: db.Mesa,
      },
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Ha ocurrido un error al obtener las reservas con fecha=" + fecha,
      });
    });
};
// Todas las reservas por restaurante y fecha
// Ex de formato: "2023-03-28 GMT-0400"
exports.findAllByRestFecha = (req, res) => {
  const fecha = new Date(Date.parse(req.query.fecha));
  const RestauranteId = req.query.RestauranteId;
  Reserva.findAll({
    where: {
      RestauranteId: RestauranteId,
      fecha: fecha,
    },
    include: [
      {
        model: db.Restaurante,
      },
      {
        model: db.Cliente,
      },
      {
        model: db.Mesa,
      },
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Ha ocurrido un error al obtener las reservas del restaurante con id=" +
            RestauranteId +
            "en fecha = " +
            fecha,
      });
    });
};
// Todas las reservas por cliente
exports.findAllByCliente = (req, res) => {
  const ClienteId = req.params.ClienteId;
  Reserva.findAll({
    where: {
      ClienteId: ClienteId,
    },
    include: [
      {
        model: db.Restaurante,
      },
      {
        model: db.Cliente,
      },
      {
        model: db.Mesa,
      },
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Ha ocurrido un error al obtener las reservas con cliente id =" +
            ClienteId,
      });
    });
};
// Todas las reservas por restaurante && cliente && fecha
// Ordenamos por horario (Creciente) y mesa (Creciente)
exports.findAllByRestauranteClienteFecha = (req, res) => {
  const RestauranteId = req.query.RestauranteId;
  const ClienteId = req.query.ClienteId;
  const fecha = req.query.fecha;
  var whereStatement = {};
  whereStatement.RestauranteId = RestauranteId;
  whereStatement.fecha = fecha;
  if (ClienteId) {
    whereStatement.ClienteId = ClienteId;
  }
  Reserva.findAll({
    where: whereStatement,
    order: [
      ["rangoHora", "ASC"],
      ["MesaId", "ASC"],
    ],
    include: [
      {
        model: db.Restaurante,
      },
      {
        model: db.Cliente,
      },
      {
        model: db.Mesa,
      },
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          "Error al obtener las reservas registradas con ClienteId: " +
          ClienteId +
          ", RestauranteId: " +
          RestauranteId +
          "y Fecha: " +
          fecha,
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
    include: [
      {
        model: db.Restaurante,
      },
      {
        model: db.Cliente,
      },
      {
        model: db.Mesa,
      },
    ],
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
