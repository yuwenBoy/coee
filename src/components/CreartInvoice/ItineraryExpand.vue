<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
</style>
<template>
    <div>
            <i-col span="4">
                <span class="expand-key">收款单位: </span>
                <span class="expand-value">{{ item.collectCompany }}</span>
            </i-col>
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
    
</style>