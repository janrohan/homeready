// controllers/mortgage.controller.js

const mortgageService = require("../services/mortgage.service");
const Avatar = require("../models/Avatar");
const PropertyGoal = require("../models/PropertyGoal");

exports.calculateEligibility = (req, res) => {
    const avatar = new Avatar(req.body.avatar);
    const goal = new PropertyGoal(req.body.goal);

    const result = mortgageService.canTakeMortgage(avatar, goal);

    res.json(result);
};
