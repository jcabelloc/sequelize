const path = require('path');

const express = require('express');

const raizDir = require('./utils/path');

const bodyParser = require('body-parser')

const errorController = require('./controllers/error');
const sequelize = require('./utils/database');
const Producto = require('./models/producto');
const Usuario = require('./models/usuario');


const adminRoutes = require('./routes/admin');
const tiendaRoutes = require('./routes/tienda');

const app = express();


app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(raizDir, 'public')));


app.use('/admin', adminRoutes);
app.use(tiendaRoutes);

app.use(errorController.get404);

Producto.belongsTo(Usuario, { constraints: true, onDelete: 'CASCADE' });
Usuario.hasMany(Producto);

sequelize
  .sync({ force: true })
  .then(result => {
    //console.log(result);
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
