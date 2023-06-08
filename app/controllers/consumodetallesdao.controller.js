const db = require("../models");
const consumodetailsModel = require("../models/consumodetails.model");
const ConsumoDetalle = db.ConsumoDetalle;
const Mesa = db.Mesa;
const Producto = db.Producto;
const ConsumoHeader = db.ConsumoHeader;
const Op = db.Sequelize.Op;

// Para agregar compras a la mesa
// Se recibe el idMesa, idProducto, cantidad.
exports.create = (req, res) => {
  // Validate request
  if (!req.body.idMesa) {
    res.status(400).send({
      message: "¡Debe enviar el id de la mesa!",
    });
  }
  if (!req.body.idProducto) {
    res.status(400).send({
      message: "¡Debe enviar el id del producto!",
    });
  }
  if (!req.body.cantidad) {
    res.status(400).send({
      message: "¡Debe enviar la cantidad de producto!",
    });
  }

  Mesa.findByPk(req.body.idMesa)
    .then((mesa) => {
      Producto.findByPk(req.body.idProducto)
        .then((producto) => {
          ConsumoHeader.findOne({
            where: { MesaId: mesa.id },
            order: [["createdAt", "DESC"]],
          })
            .then((consumoHeader) => {
              console.log("ConsumoHeader con id: " + consumoHeader.id);
              console.log("ConsumoHeader.total es: " + consumoHeader.total);
              let total = consumoHeader.total;
              if (!consumoHeader || consumoHeader.estado === "cerrado") {
                res.status(500).send({
                  message:
                    "La consumicion no se puede agregar. La mesa no se encuentra ocupada actualmente!",
                });
              } else if (consumoHeader.estado === "abierto") {
                const consumoDetalles = {
                  ConsumoHeaderId: consumoHeader.id,
                  ProductoId: producto.id,
                  cantidad: req.body.cantidad,
                };

                // Guardamos el detalle de compra
                ConsumoDetalle.create(consumoDetalles)
                  .then((consumo) => {
                    console.log(
                      "Prodcuto.precio_venta: " + producto.precio_venta
                    );
                    // Guardamos el nuevo total de esta factura ConsumoHeader
                    total += producto.precio_venta * 3;
                    consumoHeader.total = total;
                    consumoHeader.save();
                    //ConsumoHeader.update(
                    //  { total: total },
                    //  {
                    //    where: { id: consumoHeader.id },
                    //  }
                    //).then((actual) => {
                    //  res.send({
                    //    message: "Agregado detalle correctamente!",
                    //  });
                    //});
                    console.log("NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN");
                    res.send({
                      message: "Agregado correctamente!",
                    });
                  })
                  .catch((err) => {
                    res.status(500).send({
                      message:
                        "Error al guardar los detalles de consumo!" + err,
                    });
                  });
              }
            })
            .catch((err) => {
              res.status(500).send({
                message: "Error al buscar el consumoHeader de la mesa!" + err,
              });
            });
        })
        .catch((err) => {
          res.status(500).send({
            message: "Error al buscar el producto con el id recibido!",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error al buscar la mesa con el id recibido!",
      });
    });
};

// Recibe el id del ConsumoHeader para listar los detalles
// relacionados a ese header
exports.findAll = (req, res) => {
  if (!req.params.id) {
    res.status(400).send({
      message: "Error al recuperar la mesa con el id recibido!",
    });
  }

  ConsumoDetalle.findAll({
    where: {
      ConsumoHeaderId: req.params.id,
    },
  })
    .then((consumoDetalles) => {
      res.status(200).send(consumoDetalles);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          "Error al listar los detalles del ConsumoHeaderId: " + req.params.id,
      });
    });
};
