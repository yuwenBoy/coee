
    /**
     * 将选中的数组转化成创建单或者发票所记录的数组
     * @param {Array} arr 选中的数组 
     */
const dataConvert = (arr) => {
    let newArr = []; 
    
    if (arr.length === 0) {
        return newArr;
    }

    for (let i = 0; i < arr.length; i++) {
        const ele = arr[i];
        for (const item of ele.value) {
            let data = {
                PassengerTicketId: item.id,
                OrderType: item.orderType,
                TicketId: item.theTicketId,
                OrderId: item.orderId,
                IssueId: item.issueId,
                Pmprice: item.price,
                Tax: item.tax,
                Reschedulfee: item.fee,
                PassengerName: item.name,
                Status: item.openStatus,
                InvoiceAmount: item.accountDue,
                Category: item.category,
                TicketNum: item.ticketNumber,
                Supplier: item.supplier
            }
            newArr.push(data);
        }
    }
    return newArr;
}




export default{
    dataConvert: dataConvert
}