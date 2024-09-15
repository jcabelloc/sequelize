const Producto = require('../models/producto');
const Carrito = require('../models/carrito');


exports.getProductos = (req, res, next) => {
  Producto.fetchAll().then(
    ([filas, dataCampos]) => {
      res.render('tienda/lista-productos', {
        prods: filas,
        titulo: 'Todos los Productos',
        path: '/productos'
      });
    })
    .catch(err => console.log(err));
};

exports.getProducto = (req, res, next) => {
  const idProducto = req.params.idProducto;
  Producto.findById(idProducto)
  .then(([producto]) => {
    res.render('tienda/detalle-producto', {
      producto: producto[0],
      titulo: producto.nombre,
      path: '/productos'
    });
  })
  .catch(err => console.log(err));
};


exports.getIndex = (req, res, next) => {
  Producto.fetchAll().then(
    ([filas, dataCampos]) => {
      res.render('tienda/index', {
        prods: filas,
        titulo: 'Tienda',
        path: '/'
      });
    })
    .catch(err => console.log(err));
};

exports.getCarrito = (req, res, next) => {
  Carrito.getCarrito(carrito => {
    Producto.fetchAll(productos => {
      const productosCarrito = [];
      for (producto of productos) {
        const productoEnCarrito = carrito.productos.find(
          prod => prod.id === producto.id
        );
        if (productoEnCarrito) {
          productosCarrito.push({ dataProducto: producto, cantidad: productoEnCarrito.cantidad });
        }
      }
      res.render('tienda/carrito', {
        path: '/carrito',
        titulo: 'Mi Carrito',
        productos: productosCarrito
      });
    });
  });
};

exports.postCarrito = (req, res, next) => {
  const idProducto = req.body.idProducto;
  Producto.findById(idProducto, producto => {
    Carrito.agregarProducto(idProducto, producto.precio);
    res.redirect('/carrito');
  });
};

exports.postEliminarProductoCarrito = (req, res, next) => {
  const idProducto = req.body.idProducto;
  Producto.findById(idProducto, producto => {
    Carrito.eliminarProducto(idProducto, producto.precio);
    res.redirect('/carrito');
  });
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

