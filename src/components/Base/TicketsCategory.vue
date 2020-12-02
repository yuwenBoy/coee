<style lang="less" scoped>
    .raduis{
       border-radius:10px; 
       margin-right:6px;
    }
</style>

<template>
    <div>
        <span :style="categoryWordStyle" class="raduis"> {{ categoryWord }}</span><a target="_blank" :href="data.categoryUrl">{{data.issueId}}</a>
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
    computed:{
        categoryWord(){
            let category = parseInt(this.data.category);
            switch (category) {
                case 1:
                    return '出';
                case 2:
                    return '退';
                case 4:
                    return '改';
                case 8:
                    return '特';
                case 32:
                    return '调';
                case 64:
                    return '废';
                case 512:
                    return 'A';
                case 1024:
                    return '押';
                case 2048:
                    return '罚';
                default:
                    break;
            }

        },
        categoryWordStyle(){
            let category = parseInt(this.data.category);
            
            let styleObject = {
                border: '0px solid red',
                color: '#ffffff',
                padding: '3px'
            };
            switch (category) {
                case 1:
                    // 出
                    styleObject.backgroundColor='#86C166';
                    return styleObject;
                case 2:
                    // 退
                    styleObject.backgroundColor='#58B2DC';
                    return styleObject;
                case 4:
                    // 改
                    styleObject.backgroundColor='#005CAF';
                    return styleObject;
                case 8:
                    // 特
                    styleObject.backgroundColor='#B481BB';
                    return styleObject;
                case 32:
                    // 调
                    styleObject.backgroundColor='#C1328E';
                    return styleObject;
                case 64:
                    // 废
                    styleObject.backgroundColor='#434343';
                    return styleObject;
                case 512:
                    // A
                    styleObject.backgroundColor='#6A4C9C';
                    return styleObject;
                case 1024:
                    // 押
                    styleObject.backgroundColor='#8D742A';
                    return styleObject;
                case 2048:
                    // 罚
                    styleObject.backgroundColor='#F75C2F';
                    return styleObject;
                default:
                    break;
            }
        }
    }
}
</script>
