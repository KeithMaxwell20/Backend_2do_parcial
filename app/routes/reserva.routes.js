module.exports = (app) => {
  const reserva = require("../controllers/reservadao.controller.js");
  router = require("express").Router();
  router.post("/", reserva.create);
  router.get("/:id", reserva.findOne);
  router.get("/", reserva.findAll);
  router.get("/restaurante/:id", reserva.findAllByRestaurante);
  router.get("/mesa/:id", reserva.findAllByMesa);
  router.delete("/:id", reserva.delete);
  app.use("/api/reserva", router);
};
