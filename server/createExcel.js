const Excel = require('exceljs');

module.exports = function createExcel(args){
    return async(args) => {

        try {
            console.log("----------createXlsx호출----------")
            console.log("-----------createXlsx_arg---------")
            console.log("args.fuelPrice" + args.fuelPrice);
            console.log(args)
            console.log("------------------------")
            //Read a file
            var workbook = new Excel.Workbook();
            //file info----------------------------------
            // 생성자
            workbook.creator = args.USER_NAME;
            // 최종 수정자
            workbook.lastModifiedBy = args.USER_NAME;
            // 생성일(현재 일자로 처리)
            workbook.created = new Date();
            // 수정일(현재 일자로 처리)
            workbook.modified = new Date();
    
            //-------------------------------------------
            //workbook.xlsx.readFile("template.xlsx").then(function () {
            workbook.xlsx.readFile("template_new.xlsx").then(function () {
                workbook.eachSheet((sheet, id) => {
                    sheet.name = args.date;
                })
    
                //Get sheet by Name
                var worksheet=workbook.getWorksheet(args.date);
                
                //set HEADER Data
                worksheet.getRow(3).getCell(2).value = args.date;       //외근일시
                worksheet.getRow(3).getCell(5).value = args.TEAM;       //팀명
                worksheet.getRow(3).getCell(8).value = args.USER_NAME;  //외근자
                worksheet.getRow(4).getCell(2).value = args.companion;  //동행자
                
                //set BODY Data
                for(var i = 6, j = 0; i < (3 * args.directions.length) + 6; i=i+3, j++){
                    worksheet.getRow(i).getCell(2).value = args.directions[j].ALIAS;
                    if(j == 0){
                        worksheet.getRow(i).getCell(4).value = args.directions[j].ALIAS + "에서 출발";
                        worksheet.getRow(i).getCell(9).value = 0;
                    }else if(j == args.directions.length - 1){
                        worksheet.getRow(i).getCell(4).value = args.directions[j].ALIAS + " 도착";
                        if(args.transportation == "자차")
                            if(args.stopOverDistanceArr)
                                worksheet.getRow(i).getCell(9).value = args.stopOverDistanceArr[j-1];
                            else{
                                worksheet.getRow(i).getCell(9).value = args.totalDistance;
                            }    
                    }else{
                        worksheet.getRow(i).getCell(4).value = args.directions[j].ALIAS + " 도착";
                        worksheet.getRow(i+2).getCell(4).value = args.directions[j].ALIAS + "에서 출발";
                        if(args.transportation == "자차")
                            worksheet.getRow(i).getCell(9).value = args.stopOverDistanceArr[j-1];
                    }
                }
                var footerRow;
                //set Footer Data
                if(args.transportation == "자차"){
                    footerRow = worksheet.getRow(32);
                    footerRow.getCell(2).value = args.totalDistance;        //이동거리(total)
                    footerRow.getCell(3).value = args.fuelType;             //유종
                    footerRow.getCell(4).value = parseInt(args.fuelPrice.replace(',',''));  //유가(당일)
                    footerRow.getCell(6).value = parseInt(args.etcCost);    //기타(톨비, 주차비 등)
                    footerRow.getCell(8).value = parseInt(args.mealCost);   //식대
                    footerRow.getCell(9).value = { formula : 'SUM(E32:H32)'};//자차 총계
                }else if(args.transportation == "법인차량"){
                    footerRow = worksheet.getRow(38);
                    
                    //footerRow.getCell(2).value = args?.cardNumber;   //카드번호(주유비)
                    footerRow.getCell(3).value = parseInt(args.corpFuelCost);    //금액(주유비)
                    //footerRow.getCell(4).value = args.corpFuelCost;  //카드번호(기타(톨비,주차비))
                    footerRow.getCell(6).value = parseInt(args.etcCost);         //금액(기타(톨비,주차비))
                    footerRow.getCell(8).value = parseInt(args.mealCost);        //식대
                    footerRow.getCell(9).value = { formula : 'SUM(C38,F38,H38)'};//법인차량 총계

                }else if(args.transportation == "대중교통"){
                    footerRow = worksheet.getRow(35);

                    if(args.publictransportationType == "기차"){
                        footerRow.getCell(2).value = args?.cardnum;
                        footerRow.getCell(3).value = parseInt(args.publicTransCost);
                    }else if(args.publictransportationType == "버스"){
                        footerRow.getCell(6).value = args?.cardnum;
                        footerRow.getCell(7).value = parseInt(args.publicTransCost);
                    }else if(args.publictransportationType == "택시"){
                        footerRow.getCell(4).value = args?.cardnum;
                        footerRow.getCell(5).value = parseInt(args.publicTransCost);
                    }
                    footerRow.getCell(8).value = args.mealCost;
                    footerRow.getCell(9).value = { formula : 'SUM(C35,E35,G35,H35)'};   //대중교통 총계
                }
    
                //로우 적용
                worksheet.getRow(3).commit();
                worksheet.getRow(4).commit();
                //lastRow.commit();

                //이미지 첨부
                if(args.transportation == "자차"){   
                    // add image to workbook by filename
                    const routeImg = workbook.addImage({
                        filename: './public/resources/naverMap//' + args.fileName_naverMap,
                        extension: 'jpg',
                    });
                    const oilPriceImg = workbook.addImage({
                        filename: './public/resources/opinet//' + args.fileName_opinet,
                        extension: 'jpg',
                    });
                    //경로 이미지
                    worksheet.addImage(routeImg, 'K3:T22');
                 
                    //유가 이미지
                    worksheet.addImage(oilPriceImg, 'K23:V27');
                }
    
                //Save the workbook
                var fileName_excel = args.date.replaceAll('-','') + "_외근업무일지_" + args.USER_NAME + "_" + Math.floor(Math.random()*1000) + ".xlsx";
                var USER_ID = args.USER_ID;
                
                //다운로드 파일명 전역에 추가
                tmp[`${USER_ID}`]['fileName_excel'] = fileName_excel;
                return workbook.xlsx.writeFile("./public/resources/excelTemp/" + fileName_excel);
            });  

        } catch (error) {
            console.log("createExcel Error");
            console.error(error);
            return "error";
        }
    }
}();