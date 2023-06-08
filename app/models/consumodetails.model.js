module.exports = (sequelize, Sequelize) => {
  const ConsumoDetalle = sequelize.define("ConsumoDetalle", {
    cantidad: {
      type: Sequelize.INTEGER,
    },
  });
  return ConsumoDetalle;
};
