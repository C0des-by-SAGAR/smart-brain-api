const fetch = require('node-fetch');

const handleApiCall = (req, res) => {
  const raw = JSON.stringify({
    "user_app_id": {
      "user_id": "clarifai",   // default public user
      "app_id": "main"         // default app
    },
    "inputs": [
      {
        "data": {
          "image": {
            "url": req.body.input
          }
        }
      }
    ]
  });

  fetch("https://api.clarifai.com/v2/models/face-detection/versions/6dc7e46bc9124c5c8824be4822abe105/outputs", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Authorization": "Key " + process.env.CLARIFAI_API_KEY,
      "Content-Type": "application/json"
    },
    body: raw
  })
    .then(response => response.json())
    .then(data => {
      if (data.status.code !== 10000) {
        console.error("Clarifai API error:", data);
        return res.status(400).json("Unable to work with API");
      }
      res.json(data);
    })
    .catch(err => {
      console.error("Clarifai API error:", err);
      res.status(400).json("Unable to work with API");
    });
};

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json('unable to get entries'));
};

module.exports = {
  handleImage,
  handleApiCall
};
