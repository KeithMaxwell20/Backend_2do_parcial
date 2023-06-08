module.exports = (app) => {
  const consumodetalles = require("../controllers/consumodetallesdao.controller.js");
  router = require("express").Router();
  // Requiere mesa
  router.post("/", consumodetalles.create);
  // El id es de consumoHeader
  router.get("/:id", consumodetalles.findAll);

  app.use("/api/detalles", router);
};
