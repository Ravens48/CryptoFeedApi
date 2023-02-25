const axios = require("axios");
const User = require("../models/user.model");

exports.getAllCrypto = async (req, res) => {
  try {
    let response
    console.log("req params", req.params)
    let currency = req.params.fiat ?? "usd"
    let perPage = req.params.per_pages ?? 50
    response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${perPage}&page=1&sparkline=false`
    )
    res.status(200).send(response.data);
    return response.data
  } catch (error) {
    // console.log("ERROR: ", error)
    res.status(500).send({ message: "error" });
  }
};

exports.getCyrptosFav = async (req, res) => {
  let cryptosFav = []
  console.log("ID", req.params.id)
  User.findOne({ _id: req.params.id })
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err })
        return
      } else if (!user) {
        res.status(400).send({ message: "User not found" })
        return
      } else {
        console.log(user)
        cryptosFav = user.cryptosFav
      }
    })
  try {
    console.log(req.params.fiat)
    let currency = req.params.fiat ?? "usd"
    let perPage = req.params.per_pages ?? 50
    let cryptos = await axios.get(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${perPage}&page=1&sparkline=false`
    )
    console.log("CRYPTOFAVS", cryptosFav)
    // console.log(cryptos.data)
    let favs = cryptos.data.filter(element => cryptosFav.includes(element.symbol))
    res.status(200).send(favs)
  } catch (error) {
    // console.log("ERROR: ", error)
    res.status(500).send({ message: "error fecthing favorites" });
  }

}
