const detailPageWarehouseConfig = {
  DOM : '#contents > div > div.propertyList > div > div.itemGroup >.item',
  DOM_Warehouse : 'div.inner > div > div.body > div.head > h2 > a',
  DOM_Location : 'div.inner > div > div.body > div.info > div > table > tbody > tr:nth-child(1) > td',
  DOM_Traffic : 'div.inner > div > div.body > div.info > div > table > tbody > tr:nth-child(2) > td',
  DOM_Scale : 'div.inner > div > div.body > div.info > div > table > tbody > tr:nth-child(3) > td',
  DOM_Completion : 'div.inner > div > div.body > div.info > div > table > tbody > tr:nth-child(4) > td',
};

const crawlDetailPageWareTokyoConfig = {
  DOM: '#contents > div > div.columnSection.clearfix',
  DOM_Property_Name: 'div > div.bodySection > table > tbody > tr:nth-child(1) > td',
  DOM_Location: 'div > div.bodySection > table > tbody > tr:nth-child(2) > td',
  DOM_Traffic: 'div > div.bodySection > table > tbody > tr:nth-child(3) > td',
  DOM_Use_District: 'div > div.bodySection > table > tbody > tr:nth-child(4) > td',
  DOM_Building_Coverage_Ratio_Floor_Area_Ratio: 'div > div.bodySection > table > tbody > tr:nth-child(5) > td',
  DOM_Date_Of_Completion: 'div > div.bodySection > table > tbody > tr:nth-child(6) > td',
  DOM_Scale: 'div > div.bodySection > table > tbody > tr:nth-child(7) > td',
  DOM_Construction: 'div > div.bodySection > table > tbody > tr:nth-child(8) > td',
  DOM_Total_Floor_Area: 'div > div.bodySection > table > tbody > tr:nth-child(9) > td',
  DOM_Elevator: 'div > div.bodySection > table > tbody > tr:nth-child(10) > td',
  DOM_Ceiling_Height_Remarks: 'div > div.bodySection > table > tbody > tr:nth-child(11) > td',
  DOM_Floor_Load: 'div > div.bodySection > table > tbody > tr:nth-child(12) > td',
  DOM_1st_Floor_Type: 'div > div.bodySection > table > tbody > tr:nth-child(13) > td',
  DOM_Floor_Type_Remarks: 'div > div.bodySection > table > tbody > tr:nth-child(14) > td',
  DOM_Refrigerating_And_Freezing_Equipment: 'div > div.bodySection > table > tbody > tr:nth-child(15) > td',
  DOM_Building_Remarks: 'div > div.bodySection > table > tbody > tr:nth-child(16) > td',
  DOM_Icon: 'div > div.bodySection > ul.icons > li:nth-child(1)',
  DOM_Icon2: 'div > div.bodySection > ul.icons > li:nth-child(2)',
  DOM_Icon3: 'div > div.bodySection > ul.icons > li:nth-child(3)',
  DOM_Icon4: 'div > div.bodySection > ul.icons > li:nth-child(4)',
  DOM_Icon5: 'div > div.bodySection > ul.icons > li:nth-child(5)',
  DOM_Icon6: 'div > div.bodySection > ul.icons > li:nth-child(6)',
  DOM_Icon7: 'div > div.bodySection > ul.icons > li:nth-child(7)',

};

export { detailPageWarehouseConfig, crawlDetailPageWareTokyoConfig };