一．银行盈利分析（简化）

1、	银行盈利来源
银行收入：
	资金需求方通过在银行贷款，银行获取利息。
	代销信托，保险，基金等代销费用
	手续费
银行支出：
	用户存款利息成本
	人员工资和办公费用
	基础设施建设
	坏账
2、	模型基本假设

1)	银行坏账率为8% 
2)	银行活期存款利率0.35%；银行定期存款三个月利率1.1%；银行定期存款半年1.3%；银行定期存款一年1.5%；银行定期存款两年2.1%；银行定期存款超过三年2.75% 
3)	国内支行总数为68个（一个省份约2个），支行银行人数约25人，人员工资和办公费用一年约450万，总计30600万
4)	基础设施建设与维护总计一年约13600万（一个支行200万）。
5)	贷款利率，一年以内4.35，一年至五年4.75，五年以上4.9 。20%为一年以内贷款，20%为一年至五年贷款，35%为五年以上贷款，15%位流动资金。
6)	异地存取款手续费异地存取款按金额的1%收取
7)	银行代售基金佣金费用4%；代售保险佣金费用8% 
8)	其他未提及的因素暂时忽略不计，银行相关利率一年变动一次,人民币计量单位为万元
9)	计量时间单位为一年，中间的存取利息默认相互抵消


3、	银行盈利模型


4、	SQL语句

4.1建库建表语句
drop database Bank
create database Bank
go
use Bank
--成本
create table Cost(
	--成本ID
	costID int identity not null,
	--基础设施建设总计
	Totalinfrastructure money not null,
	--坏账率
	badAccountRate float not null,
	--总工资
	totalSalary money not null,
	--活期利率
	variableRate float not null,
	--三个月定期利率
	threeMonthRate float not null,
	--半年定期利率
	sixMonthRate float not null,
	--一年定期利率
	oneYearRate float not null,
	--两年定期利率
	twoYearRate float not null,
	--超过三年定期利率
	threeYearRate float not null,
	--年份
	years int not null,
	--建立主键
	CONSTRAINT PK_Cost primary key(costID ASC)
); 

--收入
if(object_id('Income') is not null) drop table Cost
create table Income(
	--收入ID
	incomeID int identity not null,
	--贷款一年利率
	oneYearRate float not null,
	--贷款一年到五年利率
	oneYearToFiveYearRate float not null,
	--贷款超过五年利率
	overFiveYearRate float not null,
	--异地存取利率
	otherPlaceRate float not null,
	--基金佣金率
	fundRate float not null,
	--保险佣金率
	insuranceRate float not null,
	--主键
	CONSTRAINT PK_Income primary key(incomeID ASC),
);

--客户
if(OBJECT_ID('FK_CustomerTradeRecord_incomeID') is not null)
alter table CustomerTradeRecord drop CONSTRAINT FK_CustomerTradeRecord_incomeID
if(OBJECT_ID('FK_Cost_costID') is not null)
alter table CustomerTradeRecord drop CONSTRAINT FK_Cost_costID
if(object_id('CustomerTradeRecord') is not null) 
drop table CustomerTradeRecord
create table CustomerTradeRecord(
	--主键
	CustomerTradeRecordID int identity not null,
	--外键
	incomeID int not null CONSTRAINT FK_CustomerTradeRecord_incomeID REFERENCES Income(incomeID),
	--外键
	costID int not null CONSTRAINT FK_Cost_costID REFERENCES Cost(costID),
	--活期存款
	variableDeposit money not null default 0,
	--三个月定期存款
	threeMonthDeposit money not null default 0,
	--六个月定期存款
	sixMonthDeposit money not null default 0,
	--一年定期存款
	oneYearDeposit money not null default 0,
	--两年定期存款
	twoYearDeposit money not null default 0,
	--超过三年定期存款
	threeYearDeposit money not null default 0,
	--异地存款
	otherPlaceDeposit money not null default 0,
	--异地取款
	otherPlaceWithdrawal money not null default 0,
	--购买基金数量
	fund money not null default 0,
	--购买保险数量
	insurance money not null default 0,
	--交易时间
	tradeDate datetime not null default GETDATE(),
	--主键
	CONSTRAINT PK_CustomerTradeRecord primary key(CustomerTradeRecordID ASC),
);
go
CREATE NONCLUSTERED INDEX CustomerTradeRecord_CustomerTradeRecordID_index ON CustomerTradeRecord(CustomerTradeRecordID DESC)
4.2数据模拟语句
4.2.1成本表模拟2015,2016,2017三年的数据
INSERT INTO Cost(totalInfrastructure,badAccountRate,totalSalary,variableRate,threeMonthRate,sixMonthRate,oneYearRate,twoYearRate,threeYearRate,years) VALUES(13600,0.08,30600,0.0035,0.011,0.013,0.015,0.021,0.0275,2015);
INSERT INTO Cost(totalInfrastructure,badAccountRate,totalSalary,variableRate,threeMonthRate,sixMonthRate,oneYearRate,twoYearRate,threeYearRate,years) VALUES(14000,0.07,31000,0.0030,0.019,0.011,0.011,0.019,0.0245,2016);
INSERT INTO Cost(totalInfrastructure,badAccountRate,totalSalary,variableRate,threeMonthRate,sixMonthRate,oneYearRate,twoYearRate,threeYearRate,years) VALUES(14600,0.09,31600,0.0032,0.010,0.012,0.012,0.020,0.0255,2017);
4.2.2收入表模拟数据
INSERT INTO Income(oneYearRate,oneYearToFiveYearRate,overFiveYearRate,otherPlaceRate,fundRate,insuranceRate) VALUES(0.0435,0.0475,0.049,0.01,0.04,0.08)
INSERT INTO Income(oneYearRate,oneYearToFiveYearRate,overFiveYearRate,otherPlaceRate,fundRate,insuranceRate) VALUES(0.0455,0.0495,0.051,0.01,0.04,0.08)
INSERT INTO Income(oneYearRate,oneYearToFiveYearRate,overFiveYearRate,otherPlaceRate,fundRate,insuranceRate) VALUES(0.0425,0.0455,0.048,0.01,0.04,0.08)
4.2.3用户交易表数据生成JavaScript脚本
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
4.2.4盈利能力分析过程
--平均固定成本
with averageFixedCost as(
	select b.CustomerTradeRecordID,a.Totalinfrastructure/(select count(*) from CustomerTradeRecord) as 'averageInfrastructure',
	a.totalSalary/(select count(*) from CustomerTradeRecord) as 'averageSalary'
	from Cost as a join  CustomerTradeRecord as b on a.costID = b.costID 
	group by b.CustomerTradeRecordID,a.Totalinfrastructure,a.totalSalary	
),
--平均变动成本
averageVariableCost as(
	select a.CustomerTradeRecordID,(a.variableDeposit+a.threeMonthDeposit+a.sixMonthDeposit+
		a.oneYearDeposit+a.twoYearDeposit+a.threeYearDeposit)*b.badAccountRate+
		a.variableDeposit*b.variableRate+a.threeMonthDeposit*b.threeMonthRate+
		a.sixMonthDeposit*b.sixMonthRate+a.oneYearDeposit*b.oneYearRate+
		a.twoYearDeposit*b.twoYearRate+a.threeYearDeposit*b.threeYearRate as 'AveragebadAccound' 
		from CustomerTradeRecord as a join Cost as b on a.costID = b.costID
),
--每个客户收入
totalIncome as (
select a.CustomerTradeRecordID,(a.variableDeposit+a.threeMonthDeposit+a.sixMonthDeposit+
		a.oneYearDeposit+a.twoYearDeposit+a.threeYearDeposit)*0.2*b.oneYearRate+
		(a.variableDeposit+a.threeMonthDeposit+a.sixMonthDeposit+
		a.oneYearDeposit+a.twoYearDeposit+a.threeYearDeposit)*0.2*b.oneYearToFiveYearRate+
		(a.variableDeposit+a.threeMonthDeposit+a.sixMonthDeposit+
		a.oneYearDeposit+a.twoYearDeposit+a.threeYearDeposit)*0.35*b.OverFiveYearRate+
		a.otherPlaceDeposit*otherPlaceRate+
		a.otherPlaceWithdrawal*otherPlaceRate+
		a.fund*b.fundRate+
		a.insurance*b.insuranceRate
		 as 'toalIncome' from CustomerTradeRecord as a
		join Income as b on a.incomeID  = b.incomeID 
)

--每个客户利润
select a.CustomerTradeRecordID,(a.AveragebadAccound+b.averageInfrastructure+b.averageSalary) as 'averageTotalCost',
c.toalIncome as 'averageTotalIncome',
c.toalIncome-(a.AveragebadAccound+b.averageInfrastructure+b.averageSalary) as 'totalBenefit'
from averageVariableCost as a 
join averageFixedCost as b on a.CustomerTradeRecordID = b.CustomerTradeRecordID 
join totalIncome as c on a.CustomerTradeRecordID = c.CustomerTradeRecordID 


5、	总结
通过模拟数据以及一系列的计算，得出银行的42.02的客户是盈利的，57.98的客户是亏损的。银行10.8%的客户为银行提供了80%的利润。