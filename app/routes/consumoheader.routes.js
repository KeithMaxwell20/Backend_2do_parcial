module.exports = (app) => {
  const consumoHeader = require("../controllers/consumoheaderdao.controller.js");
  router = require("express").Router();
  //Recibe el id de la mesa para retornar el mismo
  router.get("/:id", consumoHeader.getConsumoHeader);
  // Cambia de cliente de un consumoHeader ({idMesa, consumoHeaderId})
  router.put("/cambiar-cliente", consumoHeader.cambiarCliente);

  app.use("/api/consumoHeader", router);
};
