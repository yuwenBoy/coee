<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
</style>
<template>
    <div>
        <Row>
            <Col span="6">
                <span class="expand-key">收款单位: </span>
                <span class="expand-value">{{ item.collectCompany }} </span>
            </Col>
            <Col span="6">
                <span class="expand-key">乘客姓名: </span>
                <span class="expand-value">{{ item.name }}</span>
            </Col>
        </Row>
    </div>
</template>
<script>
    export default {
        props: {
            item: Object
        }
    };
</script>
<style lang="less" scoped>
.expand-key{
    color:#666;
    font-size: 14px;
}
.expand-value{
  
}
</style>
