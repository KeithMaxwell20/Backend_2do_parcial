module.exports = (sequelize, Sequelize) => {
  const Mesa = sequelize.define("Mesa", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: Sequelize.STRING,
    },
    posicionX: {
      type: Sequelize.INTEGER,
    },
    posicionY: {
      type: Sequelize.INTEGER,
    },
    // Numero de piso. Por defecto 1
    planta: {
      type: Sequelize.INTEGER,
      defaultValue: 1,
    },
    comensales: {
      type: Sequelize.INTEGER,
    },
  });
  return Mesa;
};
