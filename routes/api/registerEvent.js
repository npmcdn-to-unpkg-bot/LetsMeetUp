import express from 'express';
let router = express.Router();

import event from './../../models/event';

router.post('/', (req, res) => {
  let name = req.body.name;
  let purpose = req.body.purpose;
  let dateArray = req.body.dateArray;

  event.save(name, purpose, dateArray, (error, eventObj) => {
    if (error) {
      console.log(error);
      return res.status(500).send(error);
    }

    res.json({'eventId': eventObj._id});
  });
});

module.exports = router;
