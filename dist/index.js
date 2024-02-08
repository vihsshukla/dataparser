"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const fs = __importStar(require("fs/promises"));
const xlsx = __importStar(require("xlsx"));
const excel = xlsx.readFile(path.join(__dirname, '../iw-tech-test-retailer-data.xlsx'));
let excel_sheet = excel.SheetNames;
let excel_response = xlsx.utils.sheet_to_json(excel.Sheets[excel_sheet[0]]);
const transformData = (inputData) => {
    const result = {};
    inputData.forEach(item => {
        const categories = (item.directory_category || '').split(';').filter(Boolean);
        const title = item.content_post_title;
        categories.forEach(category => {
            if (!result[title]) {
                result[title] = {};
            }
            if (!result[title][category]) {
                result[title][category] = [];
            }
            result[title][category].push({
                content_children_count: item.content_children_count,
                directory_contact__phone: item.directory_contact__phone,
                directory_contact__website: item.directory_contact__website,
                content_post_id: item.content_post_id,
                content_post_slug: item.content_post_slug,
                directory_location__street: item.directory_location__street,
                directory_location__city: item.directory_location__city,
                directory_location__country: item.directory_location__country,
                directory_location__address: item.directory_location__address,
                directory_location__lat: item.directory_location__lat,
                directory_location__lng: item.directory_location__lng,
                directory_location__zip: item.directory_location__zip,
                directory_location__state: item.directory_location__state,
                content_post_status: item.content_post_status,
            });
        });
    });
    return result;
};
const transformedData = transformData(excel_response);
const outputPath = path.join(__dirname, '../transformedData.json');
fs.writeFile(outputPath, JSON.stringify(transformedData, null, 2))
    .then(() => console.log(`Transformed data written to ${outputPath}`))
    .catch(error => console.error(`Error writing file: ${error.message}`));
