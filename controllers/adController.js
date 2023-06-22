const asyncHandler = require("express-async-handler");

const Ad = require("../models/adModel");




const setAd = asyncHandler(async (req, res) => {
    if (!req.body.text || !req.body.description || !req.body.price) {
        res.status(400);
        throw new Error("Please add a required fields")
    }

    const ad = await Ad.create({
        text: req.body.text,
        description: req.body.description,
        price: req.body.price,
        user: req.user.id
    })
    res.status(200).json(ad)
})


const getAds = asyncHandler(async (req, res) => {
    const ads = await Ad.find({ user: req.user.id});
    res.status(200).json(ads);
})

const updateAd = asyncHandler(async(req, res) => {
    const ad = await Ad.findById(req.params.id);

    if(!ad) {
        res.status(400);
        throw new Error("Ad not found");
    }

    // check for user

    if(!req.user) {
        res.status(401)
        throw new Error("User not found")
    }


    if(ad.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error("User not authorized");
    }


    const updateAd = await Ad.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    })
    res.status(200).json(updateAd)
})




const deleteAd = asyncHandler(async(req, res) => {
    const ad = await Ad.findById(req.params.id);

    if(!ad) {
        res.status(400);
        throw new Error("Ad not found");
    }

    // check for user

    if(!req.user) {
        res.status(401)
        throw new Error("User not found")
    }


    if(ad.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error("User not authorized");
    }

    await ad.deleteOne();

    res.status(200).json({ id: req.params.id})
})


module.exports = {
  setAd,
  getAds,
  updateAd,
  deleteAd
}

