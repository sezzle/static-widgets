import { LokaliseApi } from "@lokalise/node-api";
import fs from "fs";
import { Headers } from "node-fetch";

global.Headers = Headers;

const basePath = "src/sezzle-checkout-button/translations";
const locale = process.env.LOCALE || "en";

const translationFile = `${basePath}/${locale}.json`;
console.log("Used translation file to upload: ", translationFile);

const apiKey = process.env.API_KEY;
if (!apiKey) {
    console.log("Localise API Key is missing");
    process.exit(1);
}

const projectId = process.env.PROJECT_ID;
if (!projectId) {
    console.log("Localise project id is missing");
    process.exit(1);
}

const lokaliseApi = new LokaliseApi({ apiKey });
const file = fs.readFileSync(translationFile);

lokaliseApi
    .files()
    .upload(projectId, {
        data: file.toString("base64"),
        filename: `${basePath}/${locale}.json`,
        lang_iso: locale,
        original_filenames: true,
        convert_placeholders: false,
    })
    .then((result) => {
        console.log("🎉 🎉 🎉 🎉  translations pushed to lokalise!!!");
        console.log(result);
    })
    .catch((err) => {
        console.error(err);
    });
