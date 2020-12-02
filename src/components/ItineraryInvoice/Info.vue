<template>
    <div>
         <!-- 基本信息 -->
            <Card :bordered="false" style="margin:0.2em" id="infos">
                <p slot="title">基本信息</p>
                <row>
                    <Col :xs="20" :sm="16" :md="12" :lg="8"  class="info-cell">
                        <b v-if="data.invoiceType==1">发票编号:</b><b v-if="data.invoiceType==2">行程单号:</b> <span class="info-word">{{ data.id }}</span>
                    </Col>
                    
                    <Col :xs="20" :sm="16" :md="12" :lg="8" class="info-cell">
                        <b>客户名称:</b><span class="info-word">{{ customerName }}</span>
                    </Col>
                    
                    <Col :xs="20" :sm="16" :md="12" :lg="8" class="info-cell">
                        <b style="padding-left:13px;">创建人:</b>
                        <span class="info-word">{{ creatorName }}</span>
                    </Col>
                </row>
                <!-- row 1 -->
                <row>
                    <Col :xs="20" :sm="16" :md="12" :lg="8" class="info-cell">
                        <b>创建时间:</b><span class="info-word">{{ creationTime }}</span>
                    </Col>
                    
                    
                    <Col :xs="20" :sm="16" :md="12" :lg="8" class="info-cell">
                        <b>开票状态:</b> <span class="info-word">{{ data.statusStr }}</span>
                    </Col>
                    
                    <Col :xs="20" :sm="16" :md="12" :lg="8" class="info-cell">
                        <b>开票时间:</b> <span class="info-word">{{ invoiceTime }}</span>
                    </Col>
                </row>   
                <!-- row 2 -->
                <row>
                    <Col v-if="data.invoiceType==1" :xs="20" :sm="16" :md="12" :lg="8" class="info-cell">
                        <b>发票号:</b> <span class="info-word">{{ data.invoiceNumber }}</span>
                    </Col>
                    <Col :xs="20" :sm="16" :md="12" :lg="8" class="info-cell">
                        <b>企业客户:</b>
                        <span class="info-word">{{ data.enCustomer }}</span>
                    </Col>
                     <Col :xs="20" :sm="16" :md="12" :lg="8" class="info-cell">
                        <b>销售:</b>
                        <span class="info-word">{{ (data.sales || {}).name }}</span>
                    </Col>
                </row>  
                
            </Card>
            
    </div>
</template>

<script>

import { dateToStr } from '@/common/tools/DateTime.js'
export default {
    props:['data'],
    computed:{
        creatorName(){
            if (!this.data.creator) {
                return '';
            }
            return this.data.creator.name;
        },
        customerName(){
            if (!this.data.customer) {
                return '';
            }
            return this.data.customer.name;
        },
        // 日期
        creationTime(){
            if (!this.data.creationTime) {
                return '';
            }
            let date = new Date(this.data.creationTime);
            return dateToStr(date,'yyyy-MM-dd  hh:mm');
        },
        invoiceTime(){
            if (!this.data.invoiceTime) {
                return '';
            }
            let date = new Date(this.data.invoiceTime);
            return dateToStr(date,'yyyy-MM-dd  hh:mm');
        }
        
        
    }
    
}
</script>


<style lang="less" scoped>
.info-word{
    color: #111;
}
.info-cell{
 
 padding-top: 9px;
 
}

.info-cell span{
    // outline: 1px solid blue;
    // float: right
    padding-left:0.6em; 
}

</style>

