const ItemModel = require('../models/items.model');

exports.insert = (req, res) => {
    ItemModel.createItem(req.body)
        .then((result) => {
            res.status(201).send({id: result._id});
        });
};

exports.list = (req, res) => {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    ItemModel.list(limit, page)
        .then((result) => {
            res.status(200).send(result);
        })
};

exports.getById = (req, res) => {
    ItemModel.findById(req.params.itemId)
        .then((result) => {
            res.status(200).send(result);
        });
};

exports.patchById = (req, res) => {
    ItemModel.patchItem(req.params.itemId, req.body)
        .then((result) => {
            res.status(204).send({});
        });
};

exports.patchByQTY = (req, res) => {
    ItemModel.patchItemQTY(req.params.itemId, req.body.qty)
        .then((result) => {
            res.status(204).send({});
        });
};

exports.removeById = (req, res) => {
    ItemModel.removeById(req.params.itemId)
        .then((result)=>{
            res.status(204).send({});
        });
};