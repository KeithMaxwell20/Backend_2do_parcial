const db = require("../models");
const Categoria = db.Categoria;
const Op = db.Sequelize.Op;
// Registrar un categoria
exports.create = (req, res) => {
    // Validate request
    if (!req.body.nombre) {
        res.status(400).send({
            message: "¡Debe enviar el nombre del categoria!",
        });
        return;
    }
    //Crea el Categoria
    const categoria = {
        nombre: req.body.nombre
    };
    // Guardamos en la base de datos
    Categoria.create(categoria)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Ha ocurrido un error al registrar al categoria.",
            });
        });
};
// Categoria por Id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Categoria.findByPk(id)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error al obtener el categoria con id=" + id,
            });
        });
};

// Todos los categorias
exports.findAll = (req, res) => {

    Categoria.findAll()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Error al listar todos los categorias.",
            });
        });
};
// Actualizar datos de un categoria
exports.update = (req, res) => {
    const id = req.params.id;
    Categoria.update(req.body, { where: { id: id } })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "Categoria actualizado correctamente.",
                });
            } else {
                res.send({
                    message: "No se pudo actualizar el categoria con id=" + id,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error al actualizar el categoria con id=" + id,
            });
        });
};
// Borrar categoria
exports.delete = (req, res) => {
    const id = req.params.id;
    Categoria.destroy({ where: { id: id } })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "Categoria eliminado exitosamente!",
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error al eliminar el cliente con id=" + id,
            });
        });
};
