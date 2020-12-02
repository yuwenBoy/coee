<!-- 认领的模态框  -->
<template>
    <div id="myModal">
        <p slot="title">
            <span id="modal-title"><b>发票单认领</b></span>
        </p>
        <hr>
        <dl>
            <dt class="">认领人:</dt>
            <dd>
                <Input type="text" v-model="Model.Claimer" placeholder="请输入备注信息"/> 
            </dd>
            <dt>备注:</dt>
            <dd>
                <Input type="textarea" v-model="Model.Remark" placeholder="请输入备注信息"/> 
            </dd>
        </dl>        
    </div>
</template>
 
<script>
export default {
    props:{
        Model:Object
    }
}
</script>

<style lang="less" scoped>
    #modal-title{
        font-size:16px;
    } 
    #myModal{
        width: 31em;
    } 
</style>
