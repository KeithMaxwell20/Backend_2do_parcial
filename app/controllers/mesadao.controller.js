const db = require("../models");
const Mesa = db.Mesa;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  // Validate request
  if (!req.body.nombre) {
    res.status(400).send({
      message: "¡Debe enviar el nombre de la mesa!",
    });
    return;
  } else if (!req.body.restauranteId) {
    res.status(400).send({
      message: "¡Debe enviar el id del restaurante en restauranteId!",
    });
    return;
  } else if (!req.body.posicionX || !req.body.posicionY) {
    res.status(400).send({
      message:
        "¡Debe enviar las coordenadas (posicionX, posicionY) de la mesa!",
    });
    return;
  } else if (!req.body.comensales) {
    res.status(400).send({
      message: "¡Debe enviar la cant. maxima de comensales!",
    });
    return;
  }
  // Crea la mesa
  const mesa = {
    nombre: req.body.nombre,
    restauranteId: req.body.restauranteId,
    posicionX: req.body.posicionX,
    posicionY: req.body.posicionY,
    planta: req.body.planta,
    comensales: req.body.comensales,
  };
  // Guardamos a la base de datos
  Mesa.create(mesa)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Ha ocurrido un error al crear una mesa.",
      });
    });
  console.log("AAAAAAAAAAAAAAAA: " + req.body.restauranteId);
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Mesa.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error al obtener la mesa con id=" + id,
      });
    });
};
// Todas las mesas, sin importar el restaurante
exports.findAll = (req, res) => {
  Mesa.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Ha ocurrido un error al obtener las mesas.",
      });
    });
};
// Todas las mesas de acuerdo al id del restaurante
exports.findAllByRestaurante = (req, res) => {
  const restauranteId = req.params.id;
  Mesa.findAll({
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
          "Ha ocurrido un error al obtener las mesas del restaurante con id=" +
            restauranteId,
      });
    });
};
// Todas las mesas de acuerdo al id del restaurante y al piso en el que se encuentren
exports.findAllByRestaurantePlanta = (req, res) => {
  const restauranteId = req.query.restId;
  const planta = req.query.planta;
  Mesa.findAll({
    where: {
      restauranteId: restauranteId,
      planta: planta,
    },
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Ha ocurrido un error al obtener las mesas de la planta=" +
            planta +
            " del restaurante con id=" +
            restauranteId,
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  Mesa.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Mesa actualizada correctamente.",
        });
      } else {
        res.send({
          message: "No se pudo actualizar el restaurante con id=" + id,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error al actualizar la mesa con id=" + id,
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  Mesa.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Mesa eliminada exitosamente!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error al eliminar la mesa con id=" + id,
      });
    });
};
