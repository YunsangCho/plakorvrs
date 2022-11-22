const Excel = require('exceljs');

module.exports = function createExcel(date, result){
    return async(date : string, result : any) => {

        try {
            console.log("----------createXlsx호출----------")
            console.log("-----------createXlsx_arg---------")
            console.log("date :" + date);
            console.log("------------------------")
            //Read a file
            var workbook = new Excel.Workbook();
            //file info----------------------------------
            // 생성자
            workbook.creator = "plakor";
            // 최종 수정자
            workbook.lastModifiedBy = "plakor";
            // 생성일(현재 일자로 처리)
            workbook.created = new Date();
            // 수정일(현재 일자로 처리)
            workbook.modified = new Date();
    
            //-------------------------------------------
            workbook.xlsx.readFile("../template.xlsx").then(function () {
                workbook.eachSheet((sheet : any, id : any) => {
                    sheet.name = date;
                })
    
                //Get sheet by Name
                var worksheet=workbook.getWorksheet(date);
                
                worksheet.getRow(1).getCell(1).value = date + " 차량출입일지";

                //set Data
                result.map((e : any, idx : number)=>{
                    worksheet.getRow(idx + 4).getCell(1).value = e.차량번호;
                    worksheet.getRow(idx + 4).getCell(2).value = e.입차일시;
                    worksheet.getRow(idx + 4).getCell(3).value = e.출차일시;
                    //worksheet.getRow(idx + 4).getCell(4).value = e.등록구분;
                    worksheet.getRow(idx + 4).getCell(4).value = e.성명;  
                    worksheet.getRow(idx + 4).getCell(5).value = e.연락처;  
                    worksheet.getRow(idx + 4).getCell(6).value = e.방문자소속;
                    worksheet.getRow(idx + 4).getCell(7).value = e.방문자성함;
                    worksheet.getRow(idx + 4).getCell(8).value = e.방문자연락처;
                    worksheet.getRow(idx + 4).getCell(9).value = e.방문사유;
                    worksheet.getRow(idx + 4).commit();
                })
                
                //Save the workbook
                var fileName = date + " 차량출입일지.xlsx";
                return workbook.xlsx.writeFile(`./${fileName}`);
            });  

        } catch (error) {
            console.log("createExcel Error");
            console.error(error);
            return "error";
        }
    }
}();