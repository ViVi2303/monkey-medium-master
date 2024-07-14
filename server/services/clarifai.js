import env from "../config/env.js";
import { ClarifaiStub, grpc } from "clarifai-nodejs-grpc";

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();

metadata.set("authorization", `Key ${env.CLARIFAI_API_KEY}`);

const clarifai = (inputs, callback) => {
  let data;

  if (Array.isArray(inputs)) {
    data = inputs.map((base64) => ({ data: { image: { base64 } } }));
  } else {
    data = [{ data: { image: { base64: inputs } } }];
  }

  stub.PostModelOutputs(
    { model_id: env.CLARIFAI_MODEL_ID, inputs: data },
    metadata,
    (err, response) => {
      if (err) {
        console.log("Error: " + err);
        return callback(err);
      }

      if (response.status.code !== 10000) {
        console.log(
          "Received failed status: " +
            response.status.description +
            "\n" +
            response.status.details
        );
        return callback(new Error("Clarifai failed"));
      }

      let results = [];

      for (const output of response.outputs) {
        let resultForImage = [];
        for (const c of output.data.concepts) {
          resultForImage.push({ [c.name]: c.value });
        }
        results.push(resultForImage);
      }
      callback(null, results);
    }
  );
};

export default clarifai;
