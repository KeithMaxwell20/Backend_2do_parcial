module.exports = (sequelize, Sequelize) => {
    const Producto = sequelize.define("Producto", {
        id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: {
            type: Sequelize.STRING,
        },
    });
    return Producto;
};
