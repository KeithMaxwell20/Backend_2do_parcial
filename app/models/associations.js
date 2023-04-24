function extraSetup(sequelize) {
  const { Restaurante, Mesa } = sequelize.models;

  Restaurante.hasMany(Mesa);
}

module.exports = { extraSetup };
