<style lang="less" scoped>
    .raduis{
       border-radius:10px; 
       margin-right:6px;
    }
</style>

<template>
    <div>

       <a href="javascript:void()" @click="Jumping(data)"> {{data.id}} </a> <span :style="categoryWordStyle" class="raduis">{{ categoryWord }}</span>
    </div>
</template>
<script>
export default {
    props:{
        data:{
            type: Object
        }
    },
    filters:{
        
    },
    methods:{
        Jumping(data){
            debugger
            if(data.invoiceType==2){
                this.$router.push({
                    name: "InvoiceInfo",
                    params: { Id: data.id }
                });
            }else{
                this.$router.push({
                    name: "TaxInfo",
                    params: { Id: data.id }
                });
            }
        }
    },
    computed:{
        categoryWord(){
            let category = parseInt(this.data.expressType);
            switch (category) {
                case 4:
                    return '追';
                default:
                    break;
            }

        },
        categoryWordStyle(){
            let category = parseInt(this.data.expressType);
            
            let styleObject = {
                border: '0px solid red',
                color: '#ffffff',
                padding: '3px'
            };
            switch (category) {
                case 4:
                    // 出
                    styleObject.backgroundColor='#FF0000';
                    return styleObject;
                default:
                    break;
            }
        }
    }
}
</script>
