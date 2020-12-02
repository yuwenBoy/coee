import store from '@/store/index.js';

const rolePage = function(params) {
   // console.info(store.state.app.pageRole);
    return store.state.app.pageRole.find( x => x.funcCode == params);
}
/**
 * 
    权限对照
    浏览 : 1
    添加（开票） : 4
    查询 : 5
    认领 (认领发票): 63 
    作废 (废票转换): 214
    审核 : 10
    
 * 
 */
export default rolePage;