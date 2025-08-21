const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

// Initialize Clarifai gRPC stub
const stub = ClarifaiStub.grpc();

// Setup metadata with your PAT
const metadata = new grpc.Metadata();
metadata.set("authorization", "Key " + process.env.CLARIFAI_PAT);

// Handles Clarifai API Call
const handleApiCall = (req, res) => {
  const { input } = req.body;

  stub.PostModelOutputs(
    {
      user_app_id: {
        user_id: "clarifai",  // As per your example
        app_id: "main"
      },
      model_id: "face-detection",
      version_id: "6dc7e46bc9124c5c8824be4822abe105", // optional but recommended
      inputs: [
        {
          data: {
            image: {
              url: input,
              allow_duplicate_url: true
            }
          }
        }
      ]
    },
    metadata,
    (err, response) => {
      if (err) {
        console.error("Clarifai gRPC error:", err);
        return res.status(500).json("API call failed: " + err);
      }

      if (response.status.code !== 10000) {
        console.error("Clarifai API failure:", response.status);
        return res.status(500).json("Clarifai API error: " + response.status.description);
      }

      // Success
      res.json(response);
    }
  );
};

// Handles Image Count in DB
const handleImage = (req, res, db) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then(entries => {
      res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json("unable to get entries"));
};

module.exports = {
  handleImage,
  handleApiCall
};
