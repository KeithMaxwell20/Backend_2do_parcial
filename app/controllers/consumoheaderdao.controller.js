const db = require("../models");
const ConsumoHeader = db.ConsumoHeader;
const Mesa = db.Mesa;
const Cliente = db.Cliente;
const Op = db.Sequelize.Op;

// Id de mesa como "id"
exports.getConsumoHeader = (req, res) => {
  // Validate request
  if (!req.params.id) {
    res.status(400).send({
      message: "¡Debe enviar la dirección!",
    });
  }

  Mesa.findByPk(req.params.id)
    .then((mesa) => {
      ConsumoHeader.findOne({
        where: { MesaId: mesa.id },
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: db.Mesa,
          },
          {
            model: db.Cliente,
          },
        ],
      })
        .then((consumoHeader) => {
          res.send(consumoHeader);
        })
        .catch((err) => {
          message: "Error al buscar el consumoHeader!";
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: "No se encuentra la mesa con el id recibido!",
      });
    });
};

exports.cambiarCliente = (req, res) => {
  // Validar request
  if (!req.body.clienteId) {
    res.status(400).send({
      message: "¡Debe enviar el nuevo id de cliente (clienteId)!",
    });
  }
  if (!req.body.consumoHeaderId) {
    res.status(400).send({
      message: "¡Debe enviar el id del consumoHeader (consumoHeaderId)!",
    });
  }

  Cliente.findByPk(req.body.clienteId)
    .then((cliente) => {
      console.log("Cliente con id: " + cliente.id);
      ConsumoHeader.findByPk(req.body.consumoHeaderId, {
        include: [
          {
            model: db.Mesa,
          },
          {
            model: db.Cliente,
          },
        ],
      })
        .then((consumoHeader) => {
          console.log("consumoHeader con id: " + consumoHeader.id);
          consumoHeader.ClienteId = cliente.id;
          consumoHeader.save();
          res.send(consumoHeader);
        })
        .catch((err) => {
          message: "¡Error al procesar el consumoHeader!";
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: "¡Error al procesar el cliente!",
      });
    });
};
