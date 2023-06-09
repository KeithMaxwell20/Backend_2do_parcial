module.exports = (sequelize, Sequelize) => {
  const Restaurante = sequelize.define("Restaurante", {
    nombre: {
      type: Sequelize.STRING,
    },
    direccion: {
      type: Sequelize.STRING,
    },
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  });
  return Restaurante;
};
