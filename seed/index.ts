import createAdmin from "./createAdmin";
import dotenv from "dotenv";
import initData from "./initData";

dotenv.config({ path: ".env" });

initData()
createAdmin()