

const respond = (res, OK, code, data, error) => {
  res.send({OK, code, data, error});
}

module.exports = respond;