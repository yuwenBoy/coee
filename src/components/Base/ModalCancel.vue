<!-- 作废发票/行程单的模态框  -->
<template>
    <div id="myModal">
        <p slot="title">
            <span id="modal-title"><b>{{ InvoiceTitle }}</b></span>
        </p>
        <br>
        <hr>
        <br>
        
        <dl>
            <dt class="">作废方式:</dt>
            <dd>
                <RadioGroup v-model="cancelModel.Mode" >
                    <Radio label="1">
                        <span>作废</span>
                    </Radio>
                    <Radio label="3" v-if="Invoice.invoiceType === 2">
                        <span>转换税务发票</span>
                    </Radio>
                </RadioGroup>
            </dd>
             <br>
            <dt>作废原因:</dt>
            <dd>
                <Input type="textarea" v-model="cancelModel.Remark" placeholder="请输入备注信息"/> 
            </dd>
        </dl>
        <br>
       
        <p v-if="Invoice.invoiceType === 2">温馨提示：请将已认领行程单归还与财务开票人员</p>
        
        <p v-if="Invoice.invoiceType === 1">温馨提示：请将已认领发票归还与财务开票人员</p>                    
    </div>
</template>

<script>

export default {
    props:{
        Invoice:Object,
        cancelModel:Object
    },
    computed:{
        InvoiceTitle(){
            return this.Invoice.invoiceType === 2?'行程单作废/换开' : '发票作废';
        }
    }
    
}
</script>


<style lang="less" scoped>
#modal-title{
    font-size:16px;
} 
#myModal{
    width: 400px;
} 
</style>
