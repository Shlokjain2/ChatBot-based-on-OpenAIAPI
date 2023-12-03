import { Configuration, OpenAIApi } from "openai";
import { Express } from "express";
import { Cors } from "cors";
import bodyParser from "body-parser";


const app = express();
const port = 8080;
app.use(bodyParser.json());
app.use(cors());

const configuration