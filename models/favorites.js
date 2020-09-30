const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoriteSchema = new Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        require: true
    },
    dishes: 
        [{   
            type: mongoose.SchemaTypes.ObjectId, 
            ref: 'Dish', 
            require: true, 
            unique: true 
        }],
},{
    timestamps: true
})

var Favorites = mongoose.model('Favorites', favoriteSchema);

module.exports = Favorites;