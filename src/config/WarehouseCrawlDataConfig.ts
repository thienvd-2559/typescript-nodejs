const URL = 'https://www.cbre-propertysearch.jp/industrial/';

const LIST_PROVINCE = {
  DOM_PROVINCE : '#contents > div > div.propertyList > div > div.itemGroup >.item',
  DOM_WAREHOUSE : 'div.inner > div > div.body > div.head > h2 > a',
  DOM_LOCATION : 'div.inner > div > div.body > div.info > div > table > tbody > tr:nth-child(1) > td',
  DOM_TRAFFIC : 'div.inner > div > div.body > div.info > div > table > tbody > tr:nth-child(2) > td',
  DOM_SCALE : 'div.inner > div > div.body > div.info > div > table > tbody > tr:nth-child(3) > td',
  DOM_COMPLETION : 'div.inner > div > div.body > div.info > div > table > tbody > tr:nth-child(4) > td',
};

const LIST_STORE = {
  DOM_STORE: '#contents > div > div.columnSection.clearfix',
  DOM_IMAGE_1: 'div > div.imgSection > div > div.photo > div.inner > div > div:nth-child(1) > img',
  DOM_IMAGE_2: 'div > div.imgSection > div > div.photo > div.inner > div > div:nth-child(2) > img',
  DOM_NAME: 'div > div.bodySection > table > tbody > tr:nth-child(1) > td',
  DOM_LOCATION: 'div > div.bodySection > table > tbody > tr:nth-child(2) > td',
  DOM_TRAFFIC: 'div > div.bodySection > table > tbody > tr:nth-child(3) > td',
  DOM_DISTRICT: 'div > div.bodySection > table > tbody > tr:nth-child(4) > td',
  DOM_COVERAGE_RATIO: 'div > div.bodySection > table > tbody > tr:nth-child(5) > td',
  DOM_DATE: 'div > div.bodySection > table > tbody > tr:nth-child(6) > td',
  DOM_SCALE: 'div > div.bodySection > table > tbody > tr:nth-child(7) > td',
  DOM_CONSTRUCTION: 'div > div.bodySection > table > tbody > tr:nth-child(8) > td',
  DOM_TOTAL: 'div > div.bodySection > table > tbody > tr:nth-child(9) > td',
  DOM_ELEVATOR: 'div > div.bodySection > table > tbody > tr:nth-child(10) > td',
  DOM_CEILING_HEIGHT: 'div > div.bodySection > table > tbody > tr:nth-child(11) > td',
  DOM_FLOOR_LOAD: 'div > div.bodySection > table > tbody > tr:nth-child(12) > td',
  DOM_FLOOR: 'div > div.bodySection > table > tbody > tr:nth-child(13) > td',
  DOM_FLOOR_TYPES: 'div > div.bodySection > table > tbody > tr:nth-child(14) > td',
  DOM_EQUIPMENT: 'div > div.bodySection > table > tbody > tr:nth-child(15) > td',
  DOM_BUILDING: 'div > div.bodySection > table > tbody > tr:nth-child(16) > td',
  DOM_ICON: 'div > div.bodySection > ul.icons > li:nth-child(1)',
  DOM_ICON2: 'div > div.bodySection > ul.icons > li:nth-child(2)',
  DOM_ICON3: 'div > div.bodySection > ul.icons > li:nth-child(3)',
  DOM_ICON4: 'div > div.bodySection > ul.icons > li:nth-child(4)',
  DOM_ICON5: 'div > div.bodySection > ul.icons > li:nth-child(5)',
  DOM_ICON6: 'div > div.bodySection > ul.icons > li:nth-child(6)',
  DOM_ICON7: 'div > div.bodySection > ul.icons > li:nth-child(7)',
};

export { URL, LIST_PROVINCE, LIST_STORE };