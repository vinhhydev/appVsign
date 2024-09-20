import convertXML from 'xml-js';

export const getJSONByAPI = (value: any) => {
  const convert = convertXML.xml2js(value);
  const result = JSON.parse(convert.elements[0].elements[0].text);
  return result;
};

export default getJSONByAPI;
