const db = require("../models");
const { crearFactura } = require("../logic/crearFactura");
const Reserva = db.Reserva;
const Mesa = db.Mesa;
const ConsumoHeader = db.ConsumoHeader;
const Cliente = db.Cliente;
const Op = db.Sequelize.Op;

// Retorna la lista de mesas con tiempo libre disponible
// en los horarios enviados en listaHoras
//[
// { "horaInicio": int, "horaFin":  int},
// {"horaInicio": int, "horaFin": int}, ...
//]
exports.findMesasSinReservas = (req, res) => {
  // Validar request
  if (!req.body.RestauranteId) {
    res.status(400).send({
      message: "¡Debe enviar el id del restaurante!",
    });
  } else if (!req.body.fecha) {
    res.status(400).send({
      message: "¡Debe enviar la fecha a reservar!",
    });
    return;
  } else if (!req.body.listaHoras) {
    res.status(400).send({
      message: "¡Debe enviar la lista de horas a solicitar!",
    });
    return;
  }
  RestauranteId = req.body.RestauranteId;
  let fecha = new Date(Date.parse(req.body.fecha));
  let listaHoras = req.body.listaHoras;
  const list = procesarHoras(listaHoras, fecha);
  console.log("Fecha: " + fecha);
  console.log("ListaHoras: " + list);
  Reserva.findAll({
    where: {
      RestauranteId: RestauranteId,
      fecha: fecha,
      rangoHora: { [Op.in]: list },
    },
  })
    .then((data) => {
      let listaMesas = [];
      data.forEach((element) => {
        listaMesas.push(element.MesaId);
      });
      Mesa.findAll({
        where: {
          id: { [Op.notIn]: listaMesas },
        },
      })
        .then((mesas) => {
          res.send(mesas);
        })
        .catch((err) => {
          res.status(500).send({
            message: err || "Error al obtener la lista de mesas libres.",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: err || "Error al obtener la lista reservaciones.",
      });
    });
};

// ¿Cómo agregar/quitar un cliente de una mesa?
// La idea es que esta funcionalidad se encuentre separada de las reservas.
// El cliente llega al restaurante y menciona que tiene una reserva ya hecha, el
// trabajador del restaurante revisa eso y si verifica que es real, registra
// el cliente a la mesa. Una vez que la reserva se termina, manualmente
// trabajador debe liberar la mesa.

// Cerrar o abrir mesas.
// Actualizamos la mesa, so.
// Cuando cerramos la mesa, ya no se puede volver a agregar consumoDetalles a esa mesa,
// y todos los detalles de consumo agregados que existen han sido agregados a la cabecera
// anterior.(cerrado es tener la mesa liberada para un nuevo cliente)
// Cuando abrimos la mesa, se crea una nueva cabecera detalle al cual agregar cada nuevo
// detalle. (abierto es cuando registramos un cliente a la mesa)
// req: { idMesa: idMesa, idCliente: idCliente}
// Esta funcion es para abrir una mesa (registrar nuevo ConsumoHeader, verificar que no se encuentre
// actualmente abierta, etc.)
exports.crearConsumoHeader = (req, res) => {
  if (!req.body.idMesa) {
    res.status(400).send({
      message: "¡Debe enviar el id de la mesa!",
    });
  }
  if (!req.body.idCliente) {
    res.status(400).send({
      message: "¡Debe enviar el id del cliente!",
    });
  }

  Mesa.findByPk(req.body.idMesa)
    .then((mesa) => {
      console.log("Mesa encontrada es: " + mesa.id);
      Cliente.findByPk(req.body.idCliente)
        .then((cliente) => {
          console.log("Encontramos al cliente: " + cliente.id);
          ConsumoHeader.findOne({
            where: { MesaId: mesa.id },
            order: [["createdAt", "DESC"]],
          })
            .then((consumoHeader) => {
              console.log("ConsumoHeader es: " + consumoHeader);
              // Si es null, entonces no existe el consumoHeader (aun no ha sido creado)
              if (!consumoHeader || consumoHeader.estado === "cerrado") {
                // Si el estado es cerrado, significa que el que se puede agregar un nuevo headerConsumo.
                let fechaHora = new Date();
                const consumoHeader = {
                  // Guardamos el cliente para que ocupe la mesa
                  ClienteId: cliente.id,
                  // Guardamos la mesa a ocupar
                  MesaId: mesa.id,
                  // Marcamos la mesa como abierto
                  estado: "abierto",
                  // Creamos el ConsumoHeader para esta mesa.
                  total: 0,
                  fechaConsumo: fechaHora,
                  fechaCierre: null,
                };

                // Creamos el ConsumoHeader y retornamos
                ConsumoHeader.create(consumoHeader)
                  .then((data) => {
                    // Retornamos el objeto creado.
                    ConsumoHeader.findByPk(data.id, {
                      include: [
                        {
                          model: db.Mesa,
                        },
                        {
                          model: db.Cliente,
                        },
                      ],
                    }).then((consumoHeaderCreado) => {
                      res.send(consumoHeaderCreado);
                    });
                  })
                  .catch((err) => {
                    res.status(500).send({
                      message:
                        "No se pudo crear un nuevo ConsumoHeader!!" || err,
                    });
                  });
              } else if (consumoHeader.estado === "abierto") {
                res.status(500).send({
                  message:
                    "No se puede registrar un nuevo consumoHeader porque la mesa no se encuentra liberada (cerrada)",
                });
              }
            })
            .catch((err) => {
              res.status(500).send({
                message:
                  "Error al buscar el ultimo registrado consumoHeader! " + err,
              });
            });
        })
        .catch((err) => {
          res.status(500).send({
            message: "Error al buscar al cliente a ocupar la mesa! " + err,
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error al buscar la mesa a ocupar!",
      });
    });
};

// Verificamos si una mesa esta abierta o cerrada.
// Retorna "disponible" si se encuentra disponible,
// "ocupado" si se encuentra ocupado actualmente.
exports.verificarMesaLibre = (req, res) => {
  if (!req.params.id) {
    res.status(400).send({
      message: "¡Debe enviar el id de la mesa a verificar!",
    });
  }

  Mesa.findByPk(req.params.id)
    .then((mesa) => {
      ConsumoHeader.findOne({
        where: { MesaId: mesa.id },
        order: [["createdAt", "DESC"]],
      })
        .then((consumoHeader) => {
          if (!consumoHeader || consumoHeader.estado === "cerrado") {
            res.status(200).send({
              message: "disponible",
            });
          } else if (consumoHeader.estado === "abierto") {
            res.status(200).send({
              message: "ocupado",
            });
          }
        })
        .catch((err) => {
          res.status(500).send({
            message:
              "Error al verificar el estado de la mesa con id=" + req.params.id,
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error al buscar la mesa a verificar!",
      });
    });
};

// Cerramos una mesa que se encontraba ocupada
// Se genera un pdf tipo ticket, con los datos
// de la consumicion de la mesa, datos de
// cliente y actualizamos la fecha de
// cierre de la mesa.
// Se recibe el id de la mesa a cerrar.
exports.cerrarConsumoHeader = (req, res) => {
  if (!req.params.id) {
    res.status(400).send({
      message: "¡Debe enviar el id de la mesa a cerrar!",
    });
  }

  Mesa.findByPk(req.params.id, { include: [{ model: db.Restaurante }] })
    .then((mesa) => {
      ConsumoHeader.findOne({
        where: { MesaId: mesa.id },
        order: [["createdAt", "DESC"]],
        include: [{ model: db.Cliente }],
      })
        .then((consumoHeader) => {
          if (!consumoHeader || consumoHeader.estado === "cerrado") {
            res.status(500).send({
              message: "La mesa no se encuentra ocupada!",
            });
          } else if (consumoHeader.estado === "abierto") {
            //TO-DO: Generar el pdf a enviar.
            // Generamos la fecha de cierre.
            const fechaCierre = new Date();
            consumoHeader.fechaCierre = fechaCierre;

            // Traemos los detalles
            db.ConsumoDetalle.findAll({
              where: { ConsumoHeaderId: consumoHeader.id },
              include: [{ model: db.Producto }],
            })
              .then((lista) => {
                let total = 0;
                let datos = {
                  mesaId: mesa.id,
                  planta: mesa.planta,
                  nombresCliente: consumoHeader.Cliente.nombre,
                  apellidosCliente: consumoHeader.Cliente.apellido,
                  cedulaCliente: consumoHeader.Cliente.cedula,
                };
                let listaDetalles = [];
                lista.forEach((item) => {
                  let detalle = {
                    nombreProducto: item.Producto.nombre,
                    precioUnitario: item.Producto.precio_venta,
                    cantidad: item.cantidad,
                    precioTotal: item.Producto.precio_venta * item.cantidad,
                    fechaHora: item.createdAt.toLocaleString("es-PY", {
                      timeZone: "America/Asuncion",
                    }),
                  };
                  listaDetalles.push(detalle);
                });
                datos.total = consumoHeader.total;
                datos.encabezado = "Factura de Consumición";
                datos.nombreRestaurante = mesa.Restaurante.nombre;
                datos.fechaCierre = consumoHeader.fechaCierre.toLocaleString(
                  "es-PY",
                  { timeZone: "America/Asuncion" }
                );
                consumoHeader.estado = "cerrado";
                consumoHeader.save();
                const nombreArchivo =
                  "Consumicion-X" + consumoHeader.id + ".pdf";
                console.log(nombreArchivo);
                crearFactura(
                  datos,
                  listaDetalles,
                  "./tickets/" + nombreArchivo
                );
                setTimeout(function () {
                  res.sendFile(nombreArchivo, {
                    root: "./tickets/",
                  });
                }, 3000);
              })
              .catch((err) => {
                res.status(500).send({
                  message: "Error al listar los detalles de una mesa!" + err,
                });
              });
          }
        })
        .catch((err) => {
          res.status(500).send({
            message:
              "Error al cerrar la mesa con id=" + req.params.id + ": " + err,
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error al buscar la mesa a cerrar!" + err,
      });
    });
};

// Recibe una lista de horas. Ex: [{"horaInicio": 1, "horaFin": 2},
// {"horaInicio": 2, "horaFin": 3}, ...]
// Retorna una lista [[int horaInicio, int horaFin], [int horaInicio, horaFin], ...]
function procesarHoras(listaHoras, fecha) {
  let listRetorno = [];
  listaHoras.forEach((element) => {
    let inicio = new Date();
    let fin = new Date();
    inicio.setTime(fecha.getTime());
    fin.setTime(fecha.getTime());

    inicio.setHours(element.horaInicio, 0, 0);
    fin.setHours(element.horaFin, 0, 0);
    console.log(
      "Hora inicio,final: [ " +
        inicio.toString() +
        ",  " +
        fin.toString() +
        " ]"
    );
    listRetorno.push([inicio, fin]);
  });
  return listRetorno;
}
