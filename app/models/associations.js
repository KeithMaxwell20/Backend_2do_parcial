function extraSetup(db) {
  const Restaurante = db.Restaurante;
  const Mesa = db.Mesa;
  const Cliente = db.Cliente;
  const Reserva = db.Reserva;
  const Categoria = db.Categoria;
  const Producto = db.Producto;

  Restaurante.hasMany(Mesa);
  //  Mesa.belongsTo(Restaurante);
  Restaurante.hasMany(Reserva, { as: "restauranteId" });
  Reserva.belongsTo(Restaurante);
  Mesa.hasMany(Reserva, { as: "mesaId" });
  Reserva.belongsTo(Mesa);
  //  Restaurante.belongsTo(Mesa);
  Cliente.hasMany(Reserva, { as: "clienteId" });
  Reserva.belongsTo(Cliente);

  // Producto.belognsTo(Categoria)
  Producto.belongsTo(Categoria);
  Categoria.hasMany(Producto, { as: "categoriaid" });
  
}

module.exports = { extraSetup };
