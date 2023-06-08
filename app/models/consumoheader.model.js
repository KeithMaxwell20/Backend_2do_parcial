// id de la mesa, id del cliente, estado (abierto, cerrado<cerrado es cuando el cliente
// ya pagó su consumo y la mesa se libera para un nuevo cliente>), total, fecha y hora de
// creación de este consumo, fecha y hora de cierre del consumo de esa mesa
module.exports = (sequelize, Sequelize) => {
  const ConsumoHeader = sequelize.define("ConsumoHeader", {
    estado: {
      type: Sequelize.STRING,
    },
    total: {
      type: Sequelize.INTEGER,
    },
    fechaConsumo: {
      type: Sequelize.DATE,
    },
    fechaCierre: {
      type: Sequelize.DATE,
    },
  });
  return ConsumoHeader;
};
