module.exports = (app) => {
  const services = require("../controllers/servicesdao.controller.js");
  var timeout = require("connect-timeout"); //express v4

  router = require("express").Router();
  router.put("/disponibles", services.findMesasSinReservas);
  router.post("/abrir-mesa", services.crearConsumoHeader);
  router.get("/verificar-estado/:id", services.verificarMesaLibre);
  router.put("/cerrar-mesa/:id", services.cerrarConsumoHeader);

  app.use(timeout(120000));
  app.use("/api/services", router);
};
