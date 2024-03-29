import { LokaliseApi } from "@lokalise/node-api";
import chalk from "chalk";
import fs from "fs";
import https from "https";
import AdmZip from "adm-zip";
import { Headers } from "node-fetch";

global.Headers = Headers;
const basePath = "src/translations";
const tmpFileName = "translations.zip";

const pathToDownloadFile = `${basePath}/${tmpFileName}`;

const apiKey = process.env.API_KEY;
if (!apiKey) {
    throw new Error(chalk.red("Localise API Key is missing"));
}

const projectId = process.env.PROJECT_ID;
if (!projectId) {
    throw new Error(chalk.red("Localise project id is missing"));
}

const lokaliseApi = new LokaliseApi({ apiKey });

console.log("Start download translation files");
lokaliseApi
    .files()
    .download(projectId, {
        format: "json",
        bundle_structure: "%LANG_ISO%.json",
        placeholder_format: "icu",
        original_filenames: false,
        directory_prefix: "src/translations/",
        add_newline_eof: true,
        json_unescaped_slashes: true,
        indentation: "4sp",
        filter_filenames: ["src/translations/%LANG_ISO%.json"],
    })
    .then((response) =>
        // download zip file by URL which was returned from localise
        downloadFile(response.bundle_url, pathToDownloadFile)
    )
    .then((resultFilePath) => {
        const resultFile = new AdmZip(resultFilePath);

        try {
            // extract files to the directory
            resultFile.extractAllTo(basePath, true);
            console.log(
                "🎉 🎉 🎉 🎉  Translation files were downloaded successfully"
            );
        } catch (err) {
            console.error(err);
        } finally {
            // remove zip file
            fs.unlink(resultFilePath, (err) => {
                if (err) {
                    console.error(err);
                }
            });
        }
    })
    .then((_) => {
        formatFrenchTranslationFiles();
        formatSpanishTranslationFiles();
    })
    .catch((reason) => {
        console.error(reason);
    });

function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https
            .get(url, (response) => {
                response.pipe(file);
                file.on("finish", () => {
                    file.close();
                    resolve(dest);
                });
            })
            .on("error", (err) => {
                fs.unlink(dest);
                reject(err.message);
            });
    });
}

const replaceFRSpecificCharacters = (messages) =>
    // this regex replace the normal space around french punctuation marks like
    // ?!:;«» with the non-breaking space to make sure that the punctuation mark
    // and the preceding word won't be seperated by line change during typesetting
    Object.entries(messages).reduce(
        (acc, [key, val]) => ({
            ...acc,
            [key]: val
                .replace(/\s(?=[?!:;»])/g, "\u00a0")
                .replace(/«\s/g, "«\u00a0"),
        }),
        {}
    );

function formatSpanishTranslationFiles() {
    const filePath = `${basePath}/es.json`;
    const esTransParsed = JSON.parse(fs.readFileSync(filePath).toString());
    saveToFile(esTransParsed, filePath);
}

function formatFrenchTranslationFiles() {
    const filePath = `${basePath}/fr.json`;
    const frTransParsed = JSON.parse(fs.readFileSync(filePath).toString());
    const frTransFormatted = replaceFRSpecificCharacters(frTransParsed);
    saveToFile(frTransFormatted, filePath);
}

function saveToFile(TransFormatted, filePath) {
    try {
        fs.writeFileSync(
            filePath,
            JSON.stringify(TransFormatted, null, 2),
            "utf8"
        );
        console.log("Formatted translations successfully saved to disk");
    } catch (error) {
        console.log("An error has occurred ", error);
    }
}
