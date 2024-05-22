import  express  from "express"
import {verifyVC } from "./verify.js";
import bodyParser from "body-parser";

const port = 3000;
const app = express()


app.use(bodyParser.json());


// Route to handle POST requests
app.post('/getVerificationStatus', (req, res) => {
    const credential = req.body;
    const result = verifyVC(credential)
    result.then(data => {
        res.send(data);
      });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
