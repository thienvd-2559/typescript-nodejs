const warehouseCrawlDataConfig = {
    DOM : '#contents > div.topArea > div.section.areas > div > div >.group'
}

const detailPageWarehouseConfig = {
    DOM : '#contents > div > div.propertyList > div > div.itemGroup >.item',
    DOM_倉庫名 : 'div.inner > div > div.body > div.head > h2 > a',
    DOM_所在地 : 'div.inner > div > div.body > div.info > div > table > tbody > tr:nth-child(1) > td',
    DOM_交通 : 'div.inner > div > div.body > div.info > div > table > tbody > tr:nth-child(2) > td',
    DOM_規模 : 'div.inner > div > div.body > div.info > div > table > tbody > tr:nth-child(3) > td',
    DOM_竣工 : 'div.inner > div > div.body > div.info > div > table > tbody > tr:nth-child(4) > td',
}

export { warehouseCrawlDataConfig, detailPageWarehouseConfig }