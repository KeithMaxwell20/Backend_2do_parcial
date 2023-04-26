const db = require("../models");
const Cliente = db.Cliente;
const Op = db.Sequelize.Op;
// Registrar un cliente
exports.create = (req, res) => {
  // Validate request
  if (!req.body.nombre) {
    res.status(400).send({
      message: "¡Debe enviar el nombre del cliente!",
    });
    return;
  } else if (!req.body.apellido) {
    res.status(400).send({
      message: "¡Debe enviar el apellido del cliente!",
    });
    return;
  } else if (!req.body.cedula) {
    res.status(400).send({
      message: "¡Debe enviar la cedula del cliente!",
    });
    return;
  }
  //Crea el Cliente
  const cliente = {
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    cedula: req.body.cedula,
  };
  // Guardamos en la base de datos
  Cliente.create(cliente)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Ha ocurrido un error al registrar al cliente.",
      });
    });
};
// Cliente por Id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Cliente.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error al obtener el cliente con id=" + id,
      });
    });
};
// Cliente por cedula
exports.findOneByCedula = (req, res) => {
  const cedula = req.params.cedula;
  Cliente.findOne({ where: { cedula: cedula } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Error al obtener el cliente con cedula=" + cedula,
      });
    });
};
// Todos los clientes
exports.findAll = (req, res) => {
  Cliente.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error al listar todos los clientes.",
      });
    });
};
// Actualizar datos de un cliente
exports.update = (req, res) => {
  const id = req.params.id;
  Cliente.update(req.body, { where: { id: id } })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Cliente actualizado correctamente.",
        });
      } else {
        res.send({
          message: "No se pudo actualizar el cliente con id=" + id,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error al actualizar el cliente con id=" + id,
      });
    });
};
// Borrar cliente
exports.delete = (req, res) => {
  const id = req.params.id;
  Cliente.destroy({ where: { id: id } })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Cliente eliminado exitosamente!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error al eliminar el cliente con id=" + id,
      });
    });
};
