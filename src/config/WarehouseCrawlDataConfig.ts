const DETAIL_PAGE_WARE_HOUSE_CONFIG = {
  DOM : '#contents > div > div.propertyList > div > div.itemGroup >.item',
  DOM_WAREHOUSE : 'div.inner > div > div.body > div.head > h2 > a',
  DOM_LOCATION : 'div.inner > div > div.body > div.info > div > table > tbody > tr:nth-child(1) > td',
  DOM_TRAFFIC : 'div.inner > div > div.body > div.info > div > table > tbody > tr:nth-child(2) > td',
  DOM_SCALE : 'div.inner > div > div.body > div.info > div > table > tbody > tr:nth-child(3) > td',
  DOM_COMPLETION : 'div.inner > div > div.body > div.info > div > table > tbody > tr:nth-child(4) > td',
};

const CRAWL_DETAIL_PAGE_WARE_TOKYO_CONFIG = {
  DOM: '#contents > div > div.columnSection.clearfix',
  DOM_PROPERTY_NAME: 'div > div.bodySection > table > tbody > tr:nth-child(1) > td',
  DOM_LOCATION: 'div > div.bodySection > table > tbody > tr:nth-child(2) > td',
  DOM_TRAFFIC: 'div > div.bodySection > table > tbody > tr:nth-child(3) > td',
  DOM_USE_DISTRICT: 'div > div.bodySection > table > tbody > tr:nth-child(4) > td',
  DOM_BUILDING_COVERAGE_RATIO_FLOOR_AREA_RATIO: 'div > div.bodySection > table > tbody > tr:nth-child(5) > td',
  DOM_DATE_OF_COMPLETION: 'div > div.bodySection > table > tbody > tr:nth-child(6) > td',
  DOM_SCALE: 'div > div.bodySection > table > tbody > tr:nth-child(7) > td',
  DOM_CONSTRUCTION: 'div > div.bodySection > table > tbody > tr:nth-child(8) > td',
  DOM_TOTAL_FLOOR_AREA: 'div > div.bodySection > table > tbody > tr:nth-child(9) > td',
  DOM_ELEVATOR: 'div > div.bodySection > table > tbody > tr:nth-child(10) > td',
  DOM_CEILING_HEIGHT_REMARKS: 'div > div.bodySection > table > tbody > tr:nth-child(11) > td',
  DOM_FLOOR_LOAD: 'div > div.bodySection > table > tbody > tr:nth-child(12) > td',
  DOM_1ST_FLOOR_TYPE: 'div > div.bodySection > table > tbody > tr:nth-child(13) > td',
  DOM_FLOOR_TYPE_REMARKS: 'div > div.bodySection > table > tbody > tr:nth-child(14) > td',
  DOM_REFRIGERATING_AND_FREEZING_EQUIPMENT: 'div > div.bodySection > table > tbody > tr:nth-child(15) > td',
  DOM_BUILDING_REMARKS: 'div > div.bodySection > table > tbody > tr:nth-child(16) > td',
  DOM_ICON: 'div > div.bodySection > ul.icons > li:nth-child(1)',
  DOM_ICON2: 'div > div.bodySection > ul.icons > li:nth-child(2)',
  DOM_ICON3: 'div > div.bodySection > ul.icons > li:nth-child(3)',
  DOM_ICON4: 'div > div.bodySection > ul.icons > li:nth-child(4)',
  DOM_ICON5: 'div > div.bodySection > ul.icons > li:nth-child(5)',
  DOM_ICON6: 'div > div.bodySection > ul.icons > li:nth-child(6)',
  DOM_ICON7: 'div > div.bodySection > ul.icons > li:nth-child(7)',

};

export { DETAIL_PAGE_WARE_HOUSE_CONFIG, CRAWL_DETAIL_PAGE_WARE_TOKYO_CONFIG };