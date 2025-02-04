import { LokaliseApi } from "@lokalise/node-api";
import fs from "fs";
import { Headers } from "node-fetch";

global.Headers = Headers;

const basePath = "src/translations";
const buttonBasePath = "src/sezzle-checkout-button/translations";
const locale = process.env.LOCALE || "en";

const translationFile = `${basePath}/${locale}.json`;
const buttonTranslationFile = `${buttonBasePath}/${locale}.json`;

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

function sendToLokalise(filepath) {
    console.log("Used translation file to upload: ", filepath);

    const file = fs.readFileSync(filepath);

    lokaliseApi
        .files()
        .upload(projectId, {
            data: file.toString("base64"),
            filename: `${filepath.indexOf('button') > -1 ? buttonBasePath : basePath}/${locale}.json`,
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
}

sendToLokalise(translationFile);
sendToLokalise(buttonTranslationFile);