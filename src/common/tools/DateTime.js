/**
 * 
 * @param {*} date 
 * @param {*} format  
 */
export const dateToStr = (date, format) => {
  if (date.length === 10) {
    return date;
  }

  if(date===null||date===""){
    return null;
  }

  let o = {
    "M+": date.getMonth() + 1, //month 
    "d+": date.getDate(), //day 
    "h+": date.getHours(), //hour 
    "m+": date.getMinutes(), //minute 
    "s+": date.getSeconds(), //second 
    "q+": Math.floor((date.getMonth() + 3) / 3), //quarter 
    "S": date.getMilliseconds() //millisecond 毫秒
  };
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (const k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }
  return format;
}

/**
 *  获得 默认的一个时间区间 返回格式为 [当前时间的前一个月,当前时间 ]
 *  格式为 yyyy-MM-dd
 * 
 */
export const defaultDateRange = () => {

  var date = new Date();//获取当前时间
  let nowDateStr= dateToStr(date,'yyyy-MM-dd');
  date.setDate(date.getDate()-60);//设置天数 -60 天
  let lastDateStr= dateToStr(date,'yyyy-MM-dd');


  // let year = nowDate.getFullYear();
  // let month = nowDate.getMonth() + 1;
  // let day = nowDate.getDate();

  // let newMonth = month ;
  // let newDay = day ;

  // if (day < 10) {
  //   newDay = '0' + day;
  // }
  // if (month < 10) {
  //   newMonth = '0' + month;
  // }

  // let nowDateStr = year + '-' + newMonth + '-' + newDay;
  // // 每月天数0是占位符
  // if (month == 1) {
  //   year = Nowdate.getFullYear() - 1;
  //   month = 11;
  // } else {
  //   month = month - 2;
  // }
  // //若是闰年，二月最后一天是29号 
  // if (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) {
  //   daysInMonth[2] = 29;
  // }
  // if (daysInMonth[month] < day) {
  //   day = daysInMonth[month];
  // }
  // if (day < 10) {
  //   day = '0' + day;
  // }
  // if (month < 10) {
  //   month = '0' + month;
  // }

  // let lastDateStr = year + '-' + month + '-' + day;

  return [lastDateStr, nowDateStr];
}
export const firstFlightDateRange = () => {

  
  var date = new Date();//获取当前时间
  date.setDate(date.getDate()-7);//当前时间前七天
  let firstDate= dateToStr(date,'yyyy-MM-dd');
  date.setDate(date.getDate()+37);//当前时间后一个月
  let lastDate= dateToStr(date,'yyyy-MM-dd');

  // let nowDate = new Date();

  // let year = nowDate.getFullYear();
  // let month = nowDate.getMonth() + 1;
  // let day = nowDate.getDate();
  // // 开始设置七天前的日期
  // let firstYear = year;
  // let firstMonth = month;
  // let firstDay = 0 ;
  // // 七天之前
  
  // if ((day - 7) > 0) {
  //   if ((day - 7)< 10) {
  //     firstDay = '0' + (day - 7); 
  //     console.log(firstDay);
  //   }
  // } else {
  //   // -7 小于0 需要向前推一个月，同时应考虑1月的情况
  //   if (month === 1) {
  //     firstYear = Nowdate.getFullYear() - 1;
  //     firstMonth = 12;
  //   } else {
  //     firstMonth = month - 1;
  //   }
  //   firstDay = daysInMonth[firstMonth] + (day - 7);
  // } 
  // if (firstMonth < 10) {
  //   firstMonth = '0' + firstMonth;
   
  // }
  // let firstDate = firstYear + '-' + firstMonth + '-' + firstDay;
  // console.info(firstDate);
  // // 前7天 END

  // // 后一个月 begin 
  // let lastDay = 0;
  // let lastMonth = 0;
  // let lastYear = year;
  
  // // 改月份并考虑年
  // if (month === 12) {
  //   lastYear = year + 1;
  //   lastMonth = 1;
  // } else {
  //   lastMonth = month + 1;
  // }
  // // 调整天数
  
  // if (day > daysInMonth[lastMonth]) {
  //   lastDay = daysInMonth[lastDay];
  // } else {
  //   lastDay = day;
  // }
  
  // if (lastDay < 10) {
  //   lastDay = '0' + lastDay;
  // }
  // if (lastMonth < 10) {
  //   lastMonth = '0' + lastMonth;
  // }

  // let lastDate = lastYear + '-' + lastMonth + '-' + lastDay;

  return [firstDate,lastDate]
} 