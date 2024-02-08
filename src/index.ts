import * as path from 'path';
import * as fs from 'fs/promises';
import * as xlsx from 'xlsx';

interface ExcelItem {
  directory_category?: string;
  content_post_title: string;
  content_children_count: number;
  directory_contact__phone: string;
  directory_contact__website: string;
  content_post_id: string;
  content_post_slug: string;
  directory_location__street: string;
  directory_location__city: string;
  directory_location__country: string;
  directory_location__address: string;
  directory_location__lat: number;
  directory_location__lng: number;
  directory_location__zip: string;
  directory_location__state: string;
  content_post_status: string;
}

interface TransformedData {
  [title: string]: {
    [category: string]: {
      content_children_count: number;
      directory_contact__phone: string;
      directory_contact__website: string;
      content_post_id: string;
      content_post_slug: string;
      directory_location__street: string;
      directory_location__city: string;
      directory_location__country: string;
      directory_location__address: string;
      directory_location__lat: number;
      directory_location__lng: number;
      directory_location__zip: string;
      directory_location__state: string;
      content_post_status: string;
    }[];
  };
}
const excel = xlsx.readFile(path.join(__dirname, '../iw-tech-test-retailer-data.xlsx'));

let excel_sheet = excel.SheetNames;
let excel_response = xlsx.utils.sheet_to_json<ExcelItem>(
  excel.Sheets[excel_sheet[0]]
);

const transformData = (inputData: ExcelItem[]): TransformedData => {
  const result: TransformedData = {};

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
