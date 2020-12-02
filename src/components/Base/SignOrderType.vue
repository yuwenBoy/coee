<style lang="less" scoped>
    .raduis{
       border-radius:12px; 
       margin-right:6px;
       padding:5px;
       
    }
</style>

<template>
    <div>
        <span :style="signTypeStyle" class="raduis">{{ data.isPrintStr }} </span>{{ data.orderTypeStr }}
    </div>
</template>
<script>
export default {
    props:{
        data:{
          type: Object
        }
    },
    computed:{
        signTypeStyle(){
            let signType = parseInt(this.data.isPrint);
            
            let styleObject = {
                border: '0px solid red',
                color: '#ffffff',
                padding: '3px',
                paddingLeft: '5px'
            };
            switch (signType) {
                case 1:
                    // 出
                    styleObject.backgroundColor='#d00';
                    return styleObject;
                case 0:
                    // 未
                    styleObject.backgroundColor='#ccc';
                    return styleObject;          
                default:
                    break;
            }
        }
    }
}
</script>
