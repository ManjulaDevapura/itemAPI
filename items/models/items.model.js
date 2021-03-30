const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    name: String,
    unitPrice: Number,
    qty: Number
});

itemSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
itemSchema.set('toJSON', {
    virtuals: true
});

const Item = mongoose.model('Items', itemSchema);



itemSchema.findById = function (cb) {
    return this.model('Items').find({id: this.id}, cb);
};

exports.findByName = (name) => {
    return Item.find({name: name});
};


exports.findById = (id) => {
    return Item.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createItem = (itemData) => {
    const item = new Item(itemData);
    return item.save();
};

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Item.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, items) {
                if (err) {
                    reject(err);
                } else {
                    resolve(items);
                }
            })
    });
};

exports.patchItem = (id, itemData) => {
    return Item.findOneAndUpdate({
        _id: id
    }, itemData);
};

exports.patchItemQTY = async (id, qty) => {
    var item = await Item.findById(id).lean(); // MongDB to JS object
    if(!item){
        return res.status(404).send("The given Item id does not exist");
    }else{
        const remainQTY = item.qty - qty; 
        item.set({qty: remainQTY}); 
        item = await item.save();
        return item;
    }
};

exports.removeById = (itemId) => {
    return new Promise((resolve, reject) => {
        Item.deleteMany({_id: itemId}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};

