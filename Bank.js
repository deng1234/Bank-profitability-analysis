// -----基本假设------
// 总存款1万以下的用户为5%
// 总存款在1万到10万的用户为10%
// 总存款在10万到100万的用户为38%
// 总存款在100万到1000万的用户为27%
// 总存款在1000万以上的用户为20%
// 1000万以上的用户活期存款率为60%,三月定期0,六月定期0,一年定期10%,两年定期12%,三年3%,基金8%,保险7%,异地存款15%,异地取款10%。
// 100万到1000万用户活期存款率50%,三月定期0,六月定期5%,一年定期20%,两年定期10%,三年5%,基金4%,保险6%,异地存款10%,异地取款15%。
// 10万到100万用户活期存款率85%,三月定期5%,六月定期0,一年定期10%,两年定期0,三年定期0,基金0,保险0,异地存款5%,异地取款20%。
// 1万到10万用户活期存款率100%,异地存款20%,异地取款20%
// 1万一下的用户活期存款率100%,异地存款0,异地取款0
var result;
var st;
var incomeID;
var costID;
var variableDeposit;
var threeMonthDeposit;
var sixMonthDeposit;
var oneYearDeposit;
var twoYearDeposit;
var threeYearDeposit;
var otherPlaceDeposit;
var otherPlaceWithdrawal;
var fund;
var insurance;
var randomNum;
var totalMoney;
for(var i=1; i<=10000; i++) {
    str = "INSERT INTO CustomerTradeRecord(incomeID,costID,variableDeposit,threeMonthDeposit,sixMonthDeposit,oneYearDeposit,twoYearDeposit,threeYearDeposit,otherPlaceDeposit,otherPlaceWithdrawal,fund,insurance)";
    incomeID = parseInt(Math.random()*10%3+1);
    costID = parseInt(Math.random()*10%3+1);
    randomNum = _Range(1,100);
    if(randomNum <= 5) {
        // 一万元以下的用户
        totalMoney = parseFloat(Math.random().toFixed(6));
        variableDeposit = totalMoney;
        threeMonthDeposit = 0;
        sixMonthDeposit = 0;
        oneYearDeposit = 0;
        twoYearDeposit = 0;
        threeYearDeposit = 0;
        otherPlaceDeposit = 0;
        otherPlaceWithdrawal = 0;
        fund = 0;
        insurance = 0;
    }else if(randomNum <= 15) {
        // 十万元以下的用户
        totalMoney = parseFloat((Math.random().toFixed(6)))+_Range(1,10);
        variableDeposit = totalMoney;
        threeMonthDeposit = 0;
        sixMonthDeposit = 0;
        oneYearDeposit = 0;
        twoYearDeposit = 0;
        threeYearDeposit = 0;
        otherPlaceDeposit = 0;
        otherPlaceWithdrawal = 0;
        fund = totalMoney * 0.2;
        insurance = totalMoney * 0.2;
    }else if(randomNum <= 53) {
        // 100万以下的用户
        totalMoney = parseFloat(Math.random().toFixed(6))+_Range(10,100);
        variableDeposit = totalMoney * 0.85;
        threeMonthDeposit = totalMoney * 0.05;
        sixMonthDeposit = 0;
        oneYearDeposit = totalMoney * 0.1;
        twoYearDeposit = 0;
        threeYearDeposit = 0;
        otherPlaceDeposit = totalMoney * 0.15;
        otherPlaceWithdrawal = totalMoney * 0.2;
        fund = 0;
        insurance = totalMoney * 0;
    }else if(randomNum <= 80) {
        // 1000万以下的用户
        totalMoney = parseFloat(Math.random().toFixed(6))+_Range(100,1000);
        variableDeposit = totalMoney * 0.5;
        threeMonthDeposit = 0;
        sixMonthDeposit = totalMoney * 0.05;
        oneYearDeposit = totalMoney * 0.2;
        twoYearDeposit = totalMoney * 0.12;
        threeYearDeposit = totalMoney * 0.03;
        otherPlaceDeposit = totalMoney * 0.1;
        otherPlaceWithdrawal = totalMoney * 0.15;
        fund = totalMoney * 0.4;
        insurance = totalMoney * 0.6;
    }else if(randomNum <= 100) {
        // 10000万以上的用户
        totalMoney = parseFloat(Math.random().toFixed(6))+_Range(1000,100000);
        variableDeposit = totalMoney * 0.6;
        threeMonthDeposit = 0;
        sixMonthDeposit = totalMoney * 0.05;
        oneYearDeposit = totalMoney * 0.1;
        twoYearDeposit = totalMoney * 0.10;
        threeYearDeposit = totalMoney * 0.05;
        otherPlaceDeposit = totalMoney * 0.15;
        otherPlaceWithdrawal = totalMoney * 0.10;
        fund = totalMoney * 0.8;
        insurance = totalMoney * 0.7;
    }
    str += " VALUES("+incomeID+","+costID+","+variableDeposit+","+threeMonthDeposit+","+sixMonthDeposit+","+oneYearDeposit+","+twoYearDeposit+","+threeYearDeposit+","+otherPlaceDeposit+","+otherPlaceWithdrawal+","+fund+","+insurance+")\n";

    result += str;
}
function _Range(Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    var num = Min + Math.floor(Rand * Range);
    return num;
}
console.log(result);