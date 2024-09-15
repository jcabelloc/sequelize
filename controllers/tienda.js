const Producto = require('../models/producto');

exports.getProductos = (req, res, next) => {
  Producto.findAll()
  .then(productos => {
    res.render('tienda/lista-productos', {
      prods: productos,
      titulo: 'Todos los Productos',
      path: '/productos'
    });
  })
  .catch(err => {
    console.log(err);
  });
};

exports.getProducto = (req, res, next) => {
  const idProducto = req.params.idProducto;
  Producto.findAll({ where: { id: idProducto } })
  .then(productos => {
    res.render('tienda/detalle-producto', {
      producto: productos[0],
      titulo: productos[0].nombre,
      path: '/productos'
    });
  })
  .catch(err => console.log(err));
  /*
  Producto.findByPk(idProducto)
  .then(producto => {
    res.render('tienda/detalle-producto', {
      producto: producto,
      titulo: producto.nombre,
      path: '/productos'
    });
  })
  .catch(err => console.log(err));
  */
};


exports.getIndex = (req, res, next) => {
  Producto.findAll()
  .then(productos => {
    res.render('tienda/index', {
      prods: productos,
      titulo: 'Tienda',
      path: '/'
    });
  })
  .catch(err => {
    console.log(err);
  });
};

exports.getCarrito = (req, res, next) => {
  req.usuario
    .getCarrito()
    .then(carrito => {
      return carrito
        .getProductos()
        .then(productos => {
          res.render('tienda/carrito', {
            path: '/carrito',
            titulo: 'Mi Carrito',
            productos: productos
          });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
};

exports.postCarrito = (req, res, next) => {
  const idProducto = req.body.idProducto;
  let micarrito;
  let nuevaCantidad = 1;
  req.usuario
    .getCarrito()
    .then(carrito => {
      micarrito = carrito;
      return carrito.getProductos({ where: { id: idProducto } });
    })
    .then(productos => {
      let producto;
      if (productos.length > 0) {
        producto = productos[0];
      }

      if (producto) {
        nuevaCantidad = producto.carritoItem.cantidad + 1;
        return producto;
      }
      return Producto.findByPk(idProducto);
    })
    .then(producto => {
      return micarrito.addProducto(producto, {
        through: { cantidad: nuevaCantidad }
      });
    })
    .then(() => {
      res.redirect('/carrito');
    })
    .catch(err => console.log(err));
};

exports.postEliminarProductoCarrito = (req, res, next) => {
  const idProducto = req.body.idProducto;
  req.usuario
    .getCarrito()
    .then(carrito => {
      return carrito.getProductos({ where: { id: idProducto } });
    })
    .then(productos => {
      const producto = productos[0];
      return producto.carritoItem.destroy();
    })
    .then(result => {
      res.redirect('/carrito');
    })
    .catch(err => console.log(err));
};

exports.getPedidos = (req, res, next) => {
  res.render('tienda/pedidos', {
    path: '/pedidos',
    titulo: 'Mis Pedidos'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('tienda/checkout', {
    path: '/checkout',
    titulo: 'Checkout'
  });
};

