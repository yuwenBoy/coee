
<template>
    <div>
        <Breadcrumb>
            <BreadcrumbItem>快递管理</BreadcrumbItem>
            <BreadcrumbItem>常用地址簿</BreadcrumbItem>
        </Breadcrumb>
        <div style="padding:9px 0;"></div>
        <Row>
            <Card :bordered="false">
                <Form ref="formInline" inline>
                    <FormItem prop="user">
                        <Input type="text" v-model="params.Search" placeholder="请输入公司/电话/姓名查询"></Input>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" @click="search">搜索</Button>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" @click="show(0)">新增地址</Button>
                    </FormItem>
                    <!-- <FormItem>
                        <Button type="primary" @click="setDefault">设置默认寄件地址</Button>
                    </FormItem> -->
                </Form>
                <br>
                <hr />
                <br>
                <Table :data="listData" :columns="listColumns" stripe :height="tableHeight" ref="table" :loading="tableLoading" :highlight-row="true" @on-current-change="currentChange"></Table>
                <div style="margin: 10px;overflow: hidden">
                    <div style="float: right;">
                        <Page :total="params.PageInfo.Total" @on-change="getList" @on-page-size-change="getList" :current.sync="params.PageInfo.PageIndex" show-elevator :page-size="params.PageInfo.PageSize" :page-size-opts=[1,10,20,50] show-total show-sizer ref="tablePage"></Page>
                    </div>
                </div>
            </Card>
        </Row>
        <Modal
            v-model="ShowAddress"
            :title="Title"
            :loading="loading"
            :closable="false"
            :mask-closable="false">
            
            <div slot="footer">
                <Button type="text" size="large" @click="modalCancel">取消</Button>
                <Button type="primary" size="large" @click="modalOk">保存</Button>
            </div>
                <Form  ref="formValidate" :model="AddressValidate" :rules="ruleValidate" :label-width="100">
                    <FormItem label="客户信息" prop="Customer">
                        <Select v-show="AddressValidate.Id===0" ref="addressCustomer" filterable remote :remote-method="getCustomer" :loading="selectLoading" @on-change="changeCustomer" clearable @on-clear="clearCustomer">
                            <Option v-for="(option, index) in customerList" :value="option.id" :key="index" >{{ option.name }}</Option>
                        </Select>
                        <span v-show="AddressValidate.Id>0">{{AddressValidate.Customer.name}}</span>
                    </FormItem>
                    <FormItem label="收件人" prop="Receiver">
                        <Input v-model="AddressValidate.Receiver" placeholder="请填写收件人姓名"></Input>
                    </FormItem>
                    <FormItem label="收件人电话" prop="ReceiverPhone">
                        <Input v-model="AddressValidate.ReceiverPhone" placeholder="请填写收件人电话/手机 例:010-xxxxxxxx或188xxxxxxxx"></Input>
                    </FormItem>
                    <FormItem label="省市区" prop="AreaModel">
                        <Cascader v-model="areaModel" :data="AreaData" :load-data="loadArea" @on-change="handleChange" placeholder="请选择省市区"></Cascader>
                    </FormItem>
                    <FormItem label="详细地址" prop="Address">
                        <Input v-model="AddressValidate.Address" placeholder="请填写收件人详细地址"></Input>
                    </FormItem>
                    <FormItem label="默认地址" prop="IsDefault">
                        <i-switch v-model="AddressValidate.IsDefault" size="large">
                            <span slot="open">On</span>
                            <span slot="close">Off</span>
                        </i-switch>
                    </FormItem>
                </Form>
            
        </Modal>
    </div>
</template>
<script>
import api from "../../api/api.js";
import CommonApi from "@/api/common.js";
import { provData } from "@/common/tools/City";
export default {
  data() {
    const validatePhone = (rule, value, callback) => {
      if (value === "") {
        callback(
          new Error("请填写收件人电话/手机 例:010-xxxxxxxx或188xxxxxxxx")
        );
      } else {
        const re = /^((0\d{2,3}-\d{7,8})|(1[345789]\d{9}))$$/g;
        if (!re.exec(value)) {
          callback(
            new Error("请填写正确电话/手机 例:010-xxxxxxxx或188xxxxxxxx")
          );
        } else {
          callback();
        }
      }
    };
    const validateCustomer = (rule, value, callback) => {
      if (JSON.stringify(value) == "{}") {
        callback(new Error("请选择客户"));
      } else {
        callback();
      }
    };
    return {
      tableHeight: 400,
      params: {
        PageInfo: {}
      },
      listData: [],
      listColumns: [
        // {
        //   title: " ",
        //   align: "left",
        //   key: "checkBox",
        //   width: 50,
        //   render: (h, params) => {
        //     let _this = this;
        //     return h("div", [
        //       h("Checkbox", {
        //         props: {
        //           value: params.row.checkBox
        //         },
        //         on: {
        //           "on-change": e => {
        //             _this.listData.forEach(items => {
        //               //先取消所有对象的勾选，checkBox设置为false
        //               _this.$set(items, "checkBox", false);
        //             });
        //             _this.listData[params.index].checkBox = e; //再将勾选的对象的checkBox设置为true
        //             debugger
        //           }
        //         }
        //       })
        //     ]);
        //   }
        // },
        // {
        //   title: " ",
        //   align: "left",
        //   key: "checkBox",
        //   width: 50,
        //   render: (h, params) => {
        //     let _this = this;
        //     return h("div", [
        //       h("Radio", {
        //         props: {
        //           value: params.row.id
        //         },
        //         on: {
        //           //   "on-change": e => {
        //           //     _this.listData.forEach(items => {
        //           //       //先取消所有对象的勾选，checkBox设置为false
        //           //       _this.$set(items, "checkBox", false);
        //           //     });
        //           //     _this.listData[params.index].checkBox = e; //再将勾选的对象的checkBox设置为true
        //           //     debugger;
        //           //   }
        //         }
        //       })
        //     ]);
        //   }
        // },
        {
          title: "公司",
          key: "customerInfo",
          render: (h, params) => {
            return h("div", params.row.customerInfo.name);
          }
        },
        {
          title: "收件人",
          key: "receiver"
        },
        {
          title: "收件人电话",
          key: "receiverPhone"
        },
        {
          title: "详细地址",
          key: "address"
        },
        {
          title: "默认地址",
          key: "isDefault",
          width: 100,
          align: "center",
          render: (h, params) => {
            return h("div", params.row.isDefault ? "是" : "否");
          }
        },
        {
          title: "操作",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.show(params.row.id);
                    }
                  }
                },
                "修改"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.remove(params.row.id);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      ShowAddress: false,
      loading: true,
      Title: "",
      AddressValidate: {
        Receiver: "",
        ReceiverPhone: "",
        AreaModel: [],
        Address: "",
        Customer: {},
        IsDefault: false,
        Id: 0
      },
      ruleValidate: {
        Receiver: [
          { required: true, message: "请填写收件人姓名", trigger: "blur" },
          {
            type: "string",
            max: 10,
            message: "收件人姓名长度不能超过10位",
            trigger: "blur"
          }
        ],
        ReceiverPhone: [
          { required: true, validator: validatePhone, trigger: "blur" }
        ],
        AreaModel: [
          {
            required: true,
            type: "array",
            min: 1,
            message: "请选择省市区",
            trigger: "change"
          },
          { type: "array", max: 3, message: "请选择省市区", trigger: "change" }
        ],
        Address: [
          { required: true, message: "请填写收件人详细地址", trigger: "blur" },
          {
            type: "string",
            max: 50,
            message: "详细地址不能超过50位",
            trigger: "blur"
          }
        ],
        Customer: [
          { required: true, validator: validateCustomer, trigger: "change" }
        ]
      },
      AreaData: [],
      customerList: [],
      selectLoading: false,
      areaModel: [],
      tableLoading: true,
      currentRow: 0
    };
  },
  methods: {
    search() {
      this.params.PageInfo.PageIndex = 1;
      this.getList();
    },
    getList() {
      let _this = this;
      _this.tableLoading = true;
      this.params.PageInfo.PageSize = this.$refs.tablePage.currentPageSize;
      api.ExpressAddress.List(this.params).then(res => {
        if (res.data.success) {
          _this.listData = res.data.data.listData;
          _this.params.PageInfo.Total = res.data.data.totalRecorder;
          _this.listData.forEach(items => {
            items.checkBox = false;
          });
        } else {
          _this.listData = [];
        }
        _this.tableLoading = false;
      });
    },
    Address(str) {
      if (str == "add") {
        this.Title = "新增地址";
      } else {
        this.Title = "修改地址";
      }
      this.ShowAddress = true;
    },
    loadArea(item, callback) {
      var str = item.value + "";
      item.loading = true;
      api.Express.RqArea(item.value).then(function(res) {
        if (res.data.Data != null) {
          res.data.Data.forEach(function(ele, index) {
            if (str.charAt(3) !== "0" || str.charAt(2) !== "0")
              item.children.push({ value: ele.Code, label: ele.FullName });
            else
              item.children.push({
                value: ele.Code,
                label: ele.FullName,
                children: [],
                loading: false
              });
          });
          item.loading = false;
        } else {
          item.loading = false;
          delete item.children;
          delete item.loading;
        }
        callback();
      });
    },
    handleChange(value, selectedData) {
      this.AddressValidate.AreaModel = selectedData.map(i => {
        return { label: i.label, value: i.value };
      });
      //this.text = selectedData;
    },
    province() {
      let _this = this;
      _this.AreaData = [];
      provData.forEach(function(ele, index) {
          _this.AreaData.push({
            value: ele.Code,
            label: ele.FullName,
            children: [],
            loading: false
          });
        });
    },
    modalOk() {
      this.$refs["formValidate"].validate(valid => {
        if (valid) {
          api.ExpressAddress.Save(this.AddressValidate).then(res => {
            if (res.data.success) {
              if (res.data.data > 0) {
                this.$Message.success("保存成功!");
                this.ShowAddress = false;
                this.getList();
              } else if (res.data.data === 0) {
                this.$Message.error("保存失败!");
              } else {
                this.$Message.error("该客户已经存在默认地址!");
              }
            } else {
              this.$Message.error("保存失败!");
            }
          });
        }
      });
    },
    modalCancel() {
      this.ShowAddress = false;
      //清空form规则检查
      this.$refs["formValidate"].resetFields();
    },
    getCustomer(queryText) {
      let _this = this;
      if (queryText === "" || queryText.length === 1) {
        _this.customerList = [];
        return;
      }
      CommonApi.Common.getCustomerList(queryText).then(res => {
        if (res.data.success) {
          if (res.data.data.length > 0) {
            _this.customerList = res.data.data;
          }
        }
      });
    },
    changeCustomer(option) {
      let _this = this;
      let customer = this.customerList.map(i => {
        if (i.id === option) {
          _this.AddressValidate.Customer = { id: i.id, name: i.name };
        }
      });
    },
    clearCustomer() {
      this.AddressValidate.Customer = {};
      this.customerList = [];
    },
    show(id) {
      let _this = this;
      _this.$refs.addressCustomer.values=[];
      api.ExpressAddress.GetById(id).then(res => {
        let addressInfo = res.data.data;
        if (addressInfo != null) {
          _this.AddressValidate.Id = addressInfo.id;
          _this.AddressValidate.Receiver = addressInfo.receiver;
          _this.AddressValidate.ReceiverPhone = addressInfo.receiverPhone;
          _this.AddressValidate.AreaModel = [];
          if (addressInfo.provCode !== null)
            _this.AddressValidate.AreaModel.push({
              label: addressInfo.prov,
              value: addressInfo.provCode
            });
          if (addressInfo.cityCode !== null)
            _this.AddressValidate.AreaModel.push({
              label: addressInfo.city,
              value: addressInfo.cityCode
            });
          if (addressInfo.countryCode !== null)
            _this.AddressValidate.AreaModel.push({
              label: addressInfo.country,
              value: addressInfo.countryCode
            });

          _this.AddressValidate.Address = addressInfo.address;
          _this.AddressValidate.Customer = addressInfo.customerInfo;
          _this.AddressValidate.IsDefault = addressInfo.isDefault;
          _this.areaModel=[];
          if (addressInfo.provCode !== null)
            _this.areaModel.push(parseInt(addressInfo.provCode));
          if (addressInfo.cityCode !== null)
            _this.areaModel.push(parseInt(addressInfo.cityCode));
          if (addressInfo.countryCode !== null)
            _this.areaModel.push(parseInt(addressInfo.countryCode));
          _this.Address("update");
        } else {
          _this.AddressValidate.Id = 0;
          _this.AddressValidate.Receiver = "";
          _this.AddressValidate.ReceiverPhone = "";
          _this.AddressValidate.AreaModel = [];
          _this.AddressValidate.Address = "";
          _this.AddressValidate.Customer = {};
          _this.AddressValidate.IsDefault = false;
          _this.AddressValidate.AreaModel = [];
          _this.areaModel=[];
          _this.customerList=[];
          _this.Address("add");
        }
      });
    },
    remove(id) {
      let _this = this;
      this.$Modal.confirm({
        title: "删除提醒",
        content: "确定删除吗？",
        loading: true,
        onOk: function() {
          api.ExpressAddress.Delete(id).then(res => {
            if (res.data.success) {
              _this.getList();
              this.$Modal.remove();
            } else {
              this.buttonLoading = false;
            }
          });
        }
      });
    },
    currentChange(currentRow, oldCurrentRow) {
      this.currentRow = currentRow.id;
    },
    setDefault() {
      let _this = this;
      this.$Modal.confirm({
        title: "设置默认地址提醒",
        content: "确定设置为默认地址吗？",
        loading: true,
        onOk: function() {
          api.ExpressAddress.SetDefault(_this.currentRow).then(res => {
            if (res.data.success) {
              _this.getList();
              this.$Modal.remove();
            } else {
              this.buttonLoading = false;
            }
          });
        }
      });
    }
  },
  mounted() {
    // 设置表格高度
    this.tableHeight =
      window.innerHeight - this.$refs.table.$el.offsetTop - 190;
    this.search();
    this.province();
  }
};
</script>