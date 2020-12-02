<template>
    <div>
        <Row style="margin-top: 4em;">
            <Col :md="20" :lg="12" class="bgError" id="is404">
                <!-- 里面放了个背景图 -->
            </Col>
            <Col :md="20" :lg="12">
                <div class="errorBlock">
                  
                    <h4>抱歉，您访问的页面不存在</h4>
                    <h4>请回到ERP首页重新进入</h4>
                    <span>回到ERP首页---->点击发票管理</span>
                    
                </div>
            </Col>
        </Row>
    </div>
</template>
<style scoped>
    .bgError{
        margin: 0em auto;
        outline: 0px solid red;
        height: 40em;

        background-repeat: no-repeat;
        background-position: 50% 50%;
        background-size: contain;
    }
    #is404{
        background-image: url('../../assets/404.svg');
    }
    .errorBlock{
        outline: 0px solid greenyellow;
       
        padding-top: 1.5em; 
        margin-top:0em;
        font-size: 40px;   
    }
    
</style>