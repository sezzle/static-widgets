import { LokaliseApi } from "@lokalise/node-api";
import fs from "fs";
import { Headers } from "node-fetch";

global.Headers = Headers;

const filePaths = {
    widget: "src/translations",
    button: "src/sezzle-checkout-button/translations",
    banner: "src/sezzle-home-banner/translations",
};
const locale = process.env.LOCALE || "en";

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

function sendToLokalise(fileType) {
    const filepath = `${filePaths[fileType] || filePaths[widget]}/${locale}.json`;
    console.log("Used translation file to upload: ", filepath);

    const file = fs.readFileSync(filepath);

    lokaliseApi
        .files()
        .upload(projectId, {
            data: file.toString("base64"),
            filename: filepath,
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

sendToLokalise('widget');
sendToLokalise('button');
sendToLokalise('banner');