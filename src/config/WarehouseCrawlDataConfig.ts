const URL = 'https://www.cbre-propertysearch.jp/industrial/';

const LIST_PROVINCE = {
  DOM_PROVINCE: '#contents > div > div.propertyList > div > div.itemGroup >.item',
  DOM_WAREHOUSE: 'div.inner > div > div.body > div.head > h2 > a',
  DOM_LOCATION: 'div.inner > div > div.body > div.info > div > table > tbody > tr:nth-child(1) > td',
  DOM_TRAFFIC: 'div.inner > div > div.body > div.info > div > table > tbody > tr:nth-child(2) > td',
  DOM_SCALE: 'div.inner > div > div.body > div.info > div > table > tbody > tr:nth-child(3) > td',
  DOM_COMPLETION: 'div.inner > div > div.body > div.info > div > table > tbody > tr:nth-child(4) > td',
};

const LIST_STORE = {
  DOM_IMAGE: '#contents > div > div.columnSection.clearfix > div > div.imgSection > div > div.photo > div.inner > div > div',
  DOM_TABLE: '#contents > div > div.columnSection.clearfix > div > div.bodySection > table > tbody > tr',
};

export { URL, LIST_PROVINCE, LIST_STORE };
