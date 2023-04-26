module.exports = (sequelize, Sequelize) => {
  const Cliente = sequelize.define("Cliente", {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    cedula: {
      type: Sequelize.BIGINT,
      unique: true,
      //allowNull: false,
    },
    nombre: {
      type: Sequelize.STRING,
    },
    apellido: {
      type: Sequelize.STRING,
    },
  });
  return Cliente;
};
