module.exports = (sequelize, Sequelize) => {
  const Categoria = sequelize.define("Category", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: Sequelize.STRING,
    },
  });
  return Categoria;
};
