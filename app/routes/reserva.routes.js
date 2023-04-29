module.exports = (app) => {
  const reserva = require("../controllers/reservadao.controller.js");
  router = require("express").Router();
  // /api/reserva/fecha?fecha='2023-03-28 GMT-0400'"
  router.get("/fecha/", reserva.findAllByFecha);
  // /api/reserva/restaurante/1
  router.get("/restaurante/:id", reserva.findAllByRestaurante);
  // /api/reserva/mesa/1
  router.get("/mesa/:id", reserva.findAllByMesa);
  // /api/reserva/rest-fecha?RestauranteId=1&fecha='2023-03-28 GMT-0400'
  router.get("/rest-fecha/", reserva.findAllByRestFecha);
  // /api/reserva/cliente/1
  router.get("/cliente/:ClienteId", reserva.findAllByCliente);
  // /api/reserva/rest-cliente-fecha?RestauranteId=1&ClienteId=1&fecha='2023-03-23 GMT-0400'
  router.get("/rest-cliente-fecha", reserva.findAllByRestauranteClienteFecha);
  router.delete("/:id", reserva.delete);
  router.post("/", reserva.create);
  router.get("/:id", reserva.findOne);
  router.get("/", reserva.findAll);
  app.use("/api/reserva", router);
};
