const url = 'https://www.cbre-propertysearch.jp/industrial/';

const list_province = {
  dom_province: '#contents > div > div.propertylist > div > div.itemgroup >.item',
  dom_warehouse: 'div.inner > div > div.body > div.head > h2 > a',
  dom_location: 'div.inner > div > div.body > div.info > div > table > tbody > tr:nth-child(1) > td',
  dom_traffic: 'div.inner > div > div.body > div.info > div > table > tbody > tr:nth-child(2) > td',
  dom_scale: 'div.inner > div > div.body > div.info > div > table > tbody > tr:nth-child(3) > td',
  dom_completion: 'div.inner > div > div.body > div.info > div > table > tbody > tr:nth-child(4) > td',
};

const list_store = {
  dom_image: '#contents > div > div.columnsection.clearfix > div > div.imgsection > div > div.photo > div.inner > div > div',
  dom_table: '#contents > div > div.columnsection.clearfix > div > div.bodysection > table > tbody > tr',
};

export { url, list_province, list_store };
