const db = require("../models");
const Reserva = db.Reserva;
const Mesa = db.Mesa;
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
