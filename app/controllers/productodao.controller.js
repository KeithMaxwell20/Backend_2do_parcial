const db = require("../models");
const Producto = db.Producto;
const Op = db.Sequelize.Op;
// Registrar un cliente
exports.create = (req, res) => {
    // Validate request
    if (!req.body.nombre) {
        res.status(400).send({
            message: "¡Debe enviar el nombre del producto!",
        });
        return;
    }
    //Crea el Producto
    const producto = {
        nombre: req.body.nombre
    };
    // Guardamos en la base de datos
    Producto.create(producto)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Ha ocurrido un error al registrar al producto.",
            });
        });
};
// Producto por Id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Producto.findByPk(id)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error al obtener el producto con id=" + id,
            });
        });
};

// Todos los productos
exports.findAll = (req, res) => {
    Producto.findAll()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Error al listar todos los productos.",
            });
        });
};
// Actualizar datos de un producto
exports.update = (req, res) => {
    const id = req.params.id;
    Producto.update(req.body, { where: { id: id } })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "Producto actualizado correctamente.",
                });
            } else {
                res.send({
                    message: "No se pudo actualizar el producto con id=" + id,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error al actualizar el producto con id=" + id,
            });
        });
};
// Borrar producto
exports.delete = (req, res) => {
    const id = req.params.id;
    Producto.destroy({ where: { id: id } })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "Producto eliminado exitosamente!",
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error al eliminar el cliente con id=" + id,
            });
        });
};
