const db = require('../utils/database');

const Carrito = require('./carrito');


module.exports = class Producto {
    constructor(id, nombre, urlImagen, descripcion, precio) {
        this.id = id;
        this.nombre = nombre;
        this.urlImagen = urlImagen;
        this.descripcion = descripcion;
        this.precio = precio;
      }

    save() {
      return db.execute(
        'INSERT INTO productos (nombre, precio, urlImagen, descripcion) VALUES (?, ?, ?, ?)',
        [this.nombre, this.precio, this.urlImagen, this.descripcion]
      );
    }

    static deleteById(id) {
      
    }
    
    static fetchAll() {
      return db.execute('SELECT * FROM productos');
    }

    static findById(id) {
      return db.execute('SELECT * FROM productos WHERE productos.id = ?', [id]);
    }

}