module.exports = (sequelize, Sequelize) => {
    const Categoria = sequelize.define("Categoria", {
        id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre:{
            type: Sequelize.STRING,
        },
    });
    return Categoria;
};








