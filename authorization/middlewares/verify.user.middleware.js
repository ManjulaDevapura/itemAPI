const UserModel = require('../../users/models/users.model');
const crypto = require('crypto');

exports.hasAuthValidFields = (req, res, next) => {
    let errors = [];

    if (req.body) {
        if (!req.body.userName) {
            errors.push('Missing user name');
        }
        if (!req.body.password) {
            errors.push('Missing password field');
        }

        if (errors.length) {
            return res.status(400).send({errors: errors.join(',')});
        } else {
            return next();
        }
    } else {
        return res.status(400).send({errors: 'Missing user name and password fields'});
    }
};

exports.isPasswordAndUserMatch = (req, res, next) => {
    UserModel.findByUserName(req.body.userName)
        .then((user)=>{
            if(!user[0]){
                res.status(404).send({});
            }else{
                let passwordFields = user[0].password.split('$');
                let salt = passwordFields[0];
                let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
                if (hash === passwordFields[1]) {
                    req.body = {
                        userId: user[0]._id,
                        userName: user[0].userName,
                        permissionLevel: user[0].permissionLevel,
                        provider: 'userName',
                        name: user[0].firstName + ' ' + user[0].lastName,
                    };
                    return next();
                } else {
                    return res.status(400).send({errors: ['Invalid user name or password']});
                }
            }
        });
};