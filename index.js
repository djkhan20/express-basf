const {ProductsVal} = require ('./SPs/ProductsVal');
var cors = require('cors');
const express = require('express'),
      bodyParser = require('body-parser'),
      jwt = require('jsonwebtoken'),
      app = express();
const mongoose = require('mongoose');
const Product = require('./Schemas/products');

const uri = "mongodb+srv://admin:basfapi@basf-cluster.yr64b.mongodb.net/basf?retryWrites=true&w=majority";

/*MONGO ATLAS CONECTION*/
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log("Conectado a Atlas")
  })
    .catch(err => console.log(err))
      
app.set('llave', 'miclaveultrasecreta123');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.listen(3001,()=>{
    console.log('Servidor iniciado en el puerto 3001') 
});

app.post('/Usuarios/Login', (req, res) => {
    if(req.body.user === "admin" && req.body.Password === "password") {
        const payload = {
            check:  true
        };
        const token = jwt.sign(payload, app.get('llave'), {
            expiresIn: 1440
        });
        res.json({
            mensaje: 'Autenticación correcta',
            token: token
        });
    } else {
        /* res.json({ mensaje: "Usuario o contraseña incorrectos"}) */
        res.sendStatus(401);
    }
});

const rutasProtegidas = express.Router(); 

rutasProtegidas.use((req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
      jwt.verify(token, app.get('llave'), (err, decoded) => {      
        if (err) {
          return res.json({ mensaje: 'Token inválida' });    
        } else {
          req.decoded = decoded;    
          next();
        }
      });
    } else {
      res.send({ 
          mensaje: 'Token no proveída.' 
      });
    }
 });

 app.get('/Permisos', rutasProtegidas, (req, res) => {
     
  let rbacRules = {
    dashboard: [],
            users: ['add:users/add', 'upload:users/upload', 'download:users/download'],
            catalog: [
                {products: ['add:catalog/products', 'upload:catalog/products', 'download:catalog/products']},
                {currency: ['download:catalog/currency']}
            ]
}
    res.json(rbacRules);
});

app.post('/products/upload', (req,res) => {
    ProductsVal(req.body);

  const ProductObj = new Product({
    products: req.body
  })
  ProductObj.save()
    .then(() => {
      res.send({
        message: "Productos agregados"
      })
       . catch((err) => {
         res.send({
           error:err
         })
       })
    })
});