function extraSetup(db) {
  const Restaurante = db.Restaurante;
  const Mesa = db.Mesa;
  const Cliente = db.Cliente;
  const Reserva = db.Reserva;
  const Categoria = db.Categoria;
  const Producto = db.Producto;
  const ConsumoHeader = db.ConsumoHeader;
  const ConsumoDetalle = db.ConsumoDetalle;

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
  Categoria.hasMany(Producto, { as: "categoriaId" });

  Mesa.hasMany(ConsumoHeader, { as: "consumoHeaderId" });
  ConsumoHeader.belongsTo(Mesa);

  //  ConsumoHeader.hasOne(ConsumoHeader, { as: "clienteId"});
  ConsumoHeader.belongsTo(Cliente);

  ConsumoHeader.hasMany(ConsumoDetalle, { as: "consumoDetalleId" });
  ConsumoDetalle.belongsTo(ConsumoHeader);

  //  ConsumoDetalle.hasOne(Producto);
  Producto.hasMany(ConsumoDetalle);
  //Producto.belongsTo(ConsumoDetalle);
}

module.exports = { extraSetup };
