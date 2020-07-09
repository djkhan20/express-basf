const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  products: {  }
});

module.exports = mongoose.model('Product', productSchema);