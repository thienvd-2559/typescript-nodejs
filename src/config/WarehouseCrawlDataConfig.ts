const URL_PROVINCES = 'https://www.cbre-propertysearch.jp/industrial';

const LIST_PROVINCES = {
  dom_province: '#contents > div > div.propertyList > div > div.itemGroup >.item',
  dom_warehouse: 'div.inner > div > div.body > div.head > h2 > a',
  dom_item_city: '#contents > div > div.propertyList > div > div.itemGroup > div',
  dom_city: 'div > div > div.body > div.head > h2 > a',
  dom_other_information: 'div > div > div.body > div.info > div > table > tbody > tr',
};

const LIST_STORES = {
  dom_image: '#contents > div > div.columnSection.clearfix > div > div.imgSection > div > div.photo > div.inner > div > div',
  dom_table: '#contents > div > div.columnSection.clearfix > div > div.bodySection > table > tbody > tr',
};

export { URL_PROVINCES, LIST_PROVINCES, LIST_STORES };
