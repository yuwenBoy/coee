<style scoped>
.layout {
  border: 1px solid #d7dde4;
  /* border: 5px solid #6cdf0e; */
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
 
}
.layout-header-bar {
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}
</style>
<template>
    <div class="layout">
        <Sider :style="{position: 'fixed', height: '100vh', left: 0, overflow: 'auto'}" >
            <Menu @on-select="changeMenu" :active-name="activeMenu" theme="dark" width="auto" :open-names="openMenu">
                <Submenu :name="item.treeCode" :key="item.treeCode" v-for="item in menuList">
                    <template slot="title">
                        <span :title="item.name" >{{item.name}}</span>
                    </template>
                    <MenuItem :name="im.url" :key="im.name" v-for="im in item.children.filter(function(cItem){return cItem.isMenu==true;})" >
                        <Icon :type="im.icon"></Icon>
                        <span :title="im.title">{{im.name}}</span>
                    </MenuItem>
                </Submenu>
            </Menu>
        </Sider>
        <Layout :style="{marginLeft: '200px'}">
            <Header :style="{background: '#fff', boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)'}">
                <div style="float:right;cursor:pointer">
                    <Icon type="person"></Icon>
                    <!-- {{customerInfo.name}} -->
                    {{userInfo.name}}
                </div>
            </Header>
            <Content :style="{padding: '16px', height: '100vh',overflow:'auto'}">
              <!-- <Content :style="{padding: '24px'}"> -->
              <router-view />
              <div style="padding:30px 0;"></div>
            </Content>
        </Layout>
    </div>
</template>
<script>
import Api from "../api/api.js";
export default {
  data() {
    return {
      customerInfo: {
        name: ""
      }
    };
  },
  methods: {
    changeMenu(active) {
      
      this.$router.push({
        name: active
      });
    }
  },
  computed: {
    menuList() {
      return this.$store.state.app.menuList;
    },
    pageRole() {
      return this.$store.state.app.pageRole;
    },
    openMenu() {
      return this.$store.state.app.opendMenu;
    },
    activeMenu() {
      return this.$store.state.app.activeMenu;
    },
    userInfo(){
      return this.$store.state.app.userInfo;
    }
  },
  created() {
    let _this = this;
    //_this.axios.all([Api.Customer.Info(), Api.Customer.ModuleTree()]).then(
    //_this.axios.spread(function(acct, perms) {
    //_this.customerInfo = acct.data.data;
    //console.log(perms);
    //})
    //);

    Api.Customer.Info()
      .then(function(response) {
        _this.customerInfo = response.data.data;
        _this.$store.commit('updateUserInfo', response.data.data)
        // console.info(_this.customerInfo);  
      })
      .catch(function(error) {
        console.log(error);
      });
  }
};
</script>
<style lang="less" >
.ivu-form .ivu-form-item-label{
  color: #000
}

span.ivu-radio+*{
  color: #000
}

.ivu-select-item,.ivu-table-cell{
  color: #000
}

.ivu-page-options-elevator input{
    height: 30px;
}
.info-title{
  text-align: right;
  margin-right: 10px;
}
.col-padding{
  padding-top: 5px
}
</style>
