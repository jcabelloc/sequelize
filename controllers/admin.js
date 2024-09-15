const Producto = require('../models/producto');

exports.getCrearProducto = (req, res, next) => {
  res.render('admin/editar-producto', { 
    titulo: 'Crear Producto',
    path: '/admin/crear-producto',
    modoEdicion: false
  });
};

exports.postCrearProducto = (req, res, next) => {
  const nombre = req.body.nombre;
  const urlImagen = req.body.urlImagen;
  const precio = req.body.precio;
  const descripcion = req.body.descripcion;
  req.usuario
    .createProducto({
      nombre: nombre,
      precio: precio,
      urlImagen: urlImagen,
      descripcion: descripcion
    })
    .then(result => {
      // console.log(result);
      console.log('Producto Creado!!!');
      res.redirect('/');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getEditarProducto = (req, res, next) => {
  const modoEdicion = req.query.editar;
  if (!modoEdicion) {
    return res.redirect('/');
  }
  const idProducto = req.params.idProducto;
  req.usuario
    .getProductos({ where: { id: idProducto } })
    .then(productos => {
      const producto = productos[0];
      if (!producto) {
        return res.redirect('/');
      }
      res.render('admin/editar-producto', {
        titulo: 'Editar Producto',
        path: '/admin/edit-producto',
        modoEdicion: true,
        producto: producto
      });
    })
  .catch(err => console.log(err));
};

exports.postEditarProducto = (req, res, next) => {
  const idProducto = req.body.idProducto;
  const nombre = req.body.nombre;
  const precio = req.body.precio;
  const urlImagen = req.body.urlImagen;
  const descripcion = req.body.descripcion;
  Producto.findByPk(idProducto)
    .then(producto => {
      producto.nombre = nombre;
      producto.precio = precio;
      producto.descripcion = descripcion;
      producto.urlImagen = urlImagen;
      return producto.save();
    })
    .then(result => {
      console.log('PRODUCTO ACTUALIZADO!');
      res.redirect('/admin/productos');
    })
    .catch(err => console.log(err));
};

exports.getProductos = (req, res, next) => {
  req.usuario
    .getProductos()
    .then(productos => {
      res.render('admin/productos', {
        prods: productos,
        titulo: 'Admin Productos',
        path: '/admin/productos'
      });
    })
    .catch(err => console.log(err));
    };

exports.postEliminarProducto = (req, res, next) => {
  const idProducto = req.body.idProducto;
  Producto.findByPk(idProducto)
    .then(producto => {
      return producto.destroy();
    })
    .then(result => {
      console.log('PRODUCTO ELIMINADO');
      res.redirect('/admin/productos');
    })
    .catch(err => console.log(err));
};