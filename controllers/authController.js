const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
    const {name, email, password, username} = req.body;
    try {
        let isExistEmail = await User.findOne({email});
        if(isExistEmail) return res.send("User email already exist!");

        let isExistUsername = await User.findOne({username});
        if(isExistUsername) return res.send("Username already exist");

        let user = new User({name,email,password,username});
        await user.save();

        req.session.user = user;
        res.redirect('/dashboard');
    } catch(error) {
        res.status(500).send("Server Error");
    }
};

exports.login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({ email });
        console.log(user);
        if(!user) return res.send("Invalid Credentials");

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.send("Invalid Credentials");

        req.session.user = user;
        res.redirect("/dashboard");
    } catch (error) {
        res.status(500).send("Server Error");
    }
};

exports.logout = (req, res) => {
    req.session.destroy( () => {
        res.redirect('/');
    })
};