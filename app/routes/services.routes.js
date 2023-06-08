module.exports = (app) => {
  const services = require("../controllers/servicesdao.controller.js");
  router = require("express").Router();
  router.put("/disponibles", services.findMesasSinReservas);
  router.post("/abrir-mesa", services.crearConsumoHeader);
  router.get("/verificar-estado/:id", services.verificarMesaLibre);
  router.put("/cerrar-mesa/:id", services.cerrarConsumoHeader);

  app.use("/api/services", router);
};
