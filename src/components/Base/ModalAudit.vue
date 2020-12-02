<!-- 
    开行程单/税务发票  
    // 二者公用一个 modal
-->
<template>
    <div id="myModal">
        <p slot="title">
            <span id="modal-title"><b>开行程单</b></span>
        </p>
        <hr>
        
        <table class="dataTable">
            <tr>
                <th>开票方式:</th>
                <td>
                    <RadioGroup v-model="invoice.IsAutoFiscal" >
                        <Radio label='false'>
                            <span>回填票号</span>
                        </Radio>
                        <Radio label='true' v-if="Model.invoiceType == 1">
                            <span>自动出票</span>
                        </Radio>
                    </RadioGroup>
                </td>
            </tr>
            <tr v-if="invoice.IsAutoFiscal == 'false'">
                <th>发票号:</th>
                <td>
                    <Input type="textarea" 
                        v-model="invoice.InvoiceNumber" 
                        placeholder="发票号规则65499912(8位)或65499982-99,空行程单规则0000000000(10位)或0000000000-01"
                    /> 
                </td>
            </tr>
            <tr v-if="Model.invoiceType == 2"> 
                <th>票据信息</th>
                <td>  
                    <table class="trickTable">
                        <tr>
                            <td>乘客</td>
                            <td>票号</td>
                            <td>行程单号</td>
                        </tr>
                        <tr v-for="item in Ticket " :key="item.ticketId">
                            <td>{{ item.name }}</td>
                            <td>{{ item.ticketId }}</td>
                            <td>    
                                <Input type="text" v-model="item.invoce" placeholder=""/>  
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <th>开票备注</th>
                <td>  
                    <Input type="textarea" v-model="invoice.Remark" placeholder="填写备注"/> 
                </td>
            </tr>
        </table>
        <div slot="footer" class="queryButtons">
            <Button type="info" @click="agree">开票</Button>
            <Button type="error" @click="refuse">拒绝</Button>
            <Button>取消</Button>
        </div>
                 
    </div>
</template>

<script>

import Api from '../../api/api.js'

function InvoiceAudit(invoice) {
    console.info(invoice.IsAutoFiscal);
    invoice.IsAutoFiscal = invoice.IsAutoFiscal == '1'? false : true; 
     console.info(invoice.IsAutoFiscal);
    Api.Invoice.AuditInvoice(invoice)
        .then(function(res){
           console.info(res);
        })
}

export default {
    data: ()=>({
        invoice: {
            Id: 0,   // Model 里面
            IsOk: false, // 接受和拒绝按钮
            Remark: '',  // 填写的备注
            InvoiceNumber: '', // 填写的票号
            IsAutoFiscal: false, // radio 标签
        }
    }),
    props:{
        Model: Object,
        Ticket: Array
    },
    methods:{
        ConvertTripNums(){
            
        },
        agree(){
            // 同意  
            this.invoice.IsOk = true;
            this.invoice.Id = this.Model.id;
            this.invoice.IsTravelItinerary =  this.Model.invoiceType === 2?true:false;
            InvoiceAudit(this.invoice);
        },
        refuse(){
            // 拒绝
            this.invoice.IsOk = false;
            this.invoice.Id = this.Model.id;
            this.invoice.IsTravelItinerary = this.Model.invoiceType === 2?true:false;
            InvoiceAudit(this.invoice);
        },
        invoiceRule(){
            
        }
    }
    
}
</script>

<style lang="less" scoped>
#modal-title{
    font-size:16px;
} 
#myModal{
    width: 60em;
} 
.dataTable{
    border: 1px solid #DDD;
    width: 60em;
}
.trickTable{
    margin:  1em;
    border: 1px solid #DDD;
    width: 50em;
}
table, th, td{
    border-collapse: collapse;
    border: 1px solid #DDD;
}
</style>
