<template>
    <div class="right_ xftrgba">
      <div class="well with-header">
          <div class="header bordered-sky">创建报告</div>
          <table class="table table-striped table-bordered table-hover">
            <tbody>
              <tr><td class="text-align-center">模板名称<span class="color-input">*</span></td><td><input type="text" v-model="formcheck.name" class="form-control" @blur="repeatornot" id="rname" placeholder="请输入15字以内模板名称（必填）"></td></tr>
              <tr><td class="text-align-center">报告类型<span class="color-input">*</span></td><td>
                  <label><input type="radio" @click="repeatornot" v-model="formcheck.type" value="1" />日报</label>
                  <label><input type="radio" @click="repeatornot" v-model="formcheck.type" value="2" />周报</label>
              </td></tr>
              <tr><td class="text-align-center">模板风格<span class="color-input">*</span></td><td>
                  <label><input type="radio" v-model="formcheck.tpl_id" value="1" />简洁版</label>
                  <label><input type="radio" v-model="formcheck.tpl_id" value="2" />企业版</label>
                  <label><input type="radio" v-model="formcheck.tpl_id" value="3" />行业版</label>
                  <label><input type="radio" v-model="formcheck.tpl_id" value="4" />党政版</label>
              </td></tr>
              <tr><td class="text-align-center">选择主题<span class="color-input">*</span></td><td><label v-for="item in formdata.words"> <input type="checkbox":value="item.id" name="wid" v-model="formcheck.wid" /> <span>{{item.name}} </span></label></td></tr>
              <tr><td class="text-align-center">文章权重<span class="color-input">*</span></td><td>权重 > <input type="number" min="1" max="12" placeholder="1-12" style="width:60px" @blur="numornot" v-model="formcheck.weight"></td></tr>
              <tr>
                <td class="text-align-center" colspan="2">
                  <el-tooltip :disabled="show2" content="点击展开高级选项" placement="top" effect="light" >
                      <el-button @click="show2 = !show2">{{show2 ? '关闭' : '展开'}} 高级选项</el-button>
                  </el-tooltip>
                </td>
              </tr>
            </tbody>
          </table>
          <form class="form-horizontal">
            <transition name="el-zoom-in-top">
                <div class="table-responsive transition-box" v-show="show2">
                    <table class="table table-hover table-striped table-bordered">
                        <tbody>
                            <tr>
                                <td class="text-align-center"> 来源： </td>
                                <td>
                                    <input type="checkbox" value="" name="media_type" v-model="allmedia_type" @click="checkedAll1($event)" />不限
                                    <label v-for="item in formdata.media_type">
                                        <input type="checkbox" :key="item.id" :value="item.id" name="media_type" v-model="formcheck.media_type" /> {{item.name}} </label>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-align-center"> 媒体属性： </td>
                                <td>
                                    <input type="checkbox" value="" name="property_type" v-model="allproperty_type" @click="checkedAll2($event)" />不限
                                    <label v-for="item in formdata.property_type" >
                                        <input type="checkbox" :key="item.id" :value="item.id" name="property_type" v-model="formcheck.property_type" /> {{item.name}} </label>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-align-center"> 维度：</td>
                                <td>
                                    <input type="radio" value="" name="dimension" v-model="formcheck.dimension" />不限
                                    <label v-for="item in formdata.dimension" >
                                        <input type="radio" :key="item.id" :value="item.id" name="dimension" v-model="formcheck.dimension" /> {{item.name}} </label>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-align-center"> 合并文章： </td>
                                <td>
                                    <label v-for="item in filter">
                                        <input type="radio" :key="item.id" :value="item.id" name="filter" v-model="formcheck.filter" /> {{item.name}} </label>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-align-center">属性：</td>
                                <td>
                                    <input type="radio" value="" name="side" v-model="formcheck.side" />不限
                                    <label v-for="item in formdata.side" >
                                        <input type="radio" :key="item.id" :value="item.id" name="side" v-model="formcheck.side" /> {{item.name}} </label>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-align-center"> 地域： </td>
                                <td>
                                    <label><input type="checkbox" name="region" v-model="allregion_type" @click="checkedAll3($event)" />全国</label>
                                    <label v-for="item in formdata.region_type" >
                                        <input type="checkbox" :key="item.id" :value="item.id" name="region" v-model="formcheck.region_type" /> {{item.name}} </label>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-align-center"> 行业： </td>
                                <td>
                                    <select v-model="formcheck.industry_type">
                                        <option value="">请选择</option>
                                        <option v-for="item in formdata.industry_type" :value="item.id">{{item.name}}</option>
                                    </select>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </transition>
          </form>
      </div>
      <div class="well with-header">
          <div class="header bordered-sky">发送设置</div>
          <table class="table table-striped table-bordered table-hover">
            <tbody>
              <tr v-show="formcheck.type==2"><td class="text-align-center">发送日期</td><td>
                <select v-model="formcheck.send_day">
                    <option v-for="item in weeks" :value="item.value" >{{item.name}}</option>
                </select>
              </td></tr>
              <tr><td class="text-align-center">发送时间</td><td>
                <select v-model="formcheck.send_time">
                    <option v-for="item in times" :value="item.value" >{{item.name}}</option>
                </select>
              </td></tr>
              <tr>
                <td class="text-align-center">收件人</td>
                <td>
                  <input type="checkbox" value="" name="receive" v-model="allreceive" @click="checkedAll4($event)" />全部
                  <label v-for="item in people" >
                  <input type="checkbox" :key="item.id" :value="item.email" name="receive" v-model="formcheck.receive" /> {{item.name}} </label>
                  <div style="display:inline-block">
                    <input
                    type="email" name = 'email' v-validate="'email'"
                      class="input-new-tag"
                      v-if="inputVisible"
                      v-model="inputValue"
                      ref="saveTagInput"
                      size="mini"
                      @keyup.13="handleInputConfirm"
                      @blur="handleInputConfirm">
                  </input>
                  <button v-else class="btn btn-xft btn-sm btn-sky" size="small" @click="showInput">+ 新增收件人</button>
                     <span class="red" v-show="errors.has('email')">{{ errors.first('email') }}</span>
                 </div>
                </td>
              </tr>
              <tr><td class="text-align-center">报告状态</td><td>
                <label>
                    <input type="radio" name="status" v-model="formcheck.status" value="0" /> 开启
                </label>
                <label>
                    <input type="radio" name="status" v-model="formcheck.status" value="-1" /> 停用
                </label>
              </td></tr>
            </tbody>
          </table>
      </div>
      <form class="form-horizontal">
          <input class="btn btn-default btn-sky" type="button" @click="buff" style="width:100%" value="提交">
      </form>
    </div>
</template>
<script>
// {{formcheck.send_time}}
// </div>
// <div class="col-sm-8">
//     <label  v-for="item in weeks" :for="item.id" >
//     <input type="checkbox" :key="item.id" :value="item.value" name="chooseday" v-model="formcheck.send_day"/>
//     {{item.name}} </label>
import { getCookie } from "../../static/js/globle.js";
export default {
  data() {
    return {
        inputValue:'',
      inputVisible: false,
      openMsg: function(msg, type) {
        this.$message({
          message: msg,
          type: type
        });
      },
      show2: false,
      allreceive: "",
      allmedia_type: "",
      allregion_type: "",
      allproperty_type: "",
      istype: false,
      weeks: [
        {
          id: "1",
          value: "1",
          name: "星期一"
        },
        {
          id: "2",
          value: "2",
          name: "星期二"
        },
        {
          id: "3",
          value: "3",
          name: "星期三"
        },
        {
          id: "4",
          value: "4",
          name: "星期四"
        },
        {
          id: "5",
          value: "5",
          name: "星期五"
        },
        {
          id: "6",
          value: "6",
          name: "星期六"
        },
        {
          id: "0",
          value: "0",
          name: "星期日"
        }
      ],
      times: [
        {
          id: "1",
          value: "8",
          name: "上午08:00"
        },
        {
          id: "2",
          value: "9",
          name: "上午09:00"
        },
        {
          id: "3",
          value: "10",
          name: "上午10:00"
        },
        {
          id: "4",
          value: "11",
          name: "上午11:00"
        },
        {
          id: "5",
          value: "12",
          name: "中午12:00"
        },
        {
          id: "6",
          value: "13",
          name: "下午13:00"
        },
        {
          id: "7",
          value: "14",
          name: "下午14:00"
        },
        {
          id: "8",
          value: "15",
          name: "下午15:00"
        },
        {
          id: "9",
          value: "16",
          name: "下午16:00"
        },
        {
          id: "10",
          value: "17",
          name: "下午17:00"
        },
        {
          id: "11",
          value: "18",
          name: "下午18:00"
        }
      ],
      nameflag: false,
      sta: false,
      tableData3: [
        {
          last_snatch_time: "",
          name: "",
          key_word: "",
          status: "",
          condition: ""
        }
      ],
      formcheck: {
        weight: "7",
        name: "",
        type: "1",
        tpl_id: "1",
        wid: [],
        side: "",
        region_type: [],
        dimension: "",
        media_type: [],
        property_type: [],
        filter: "0",
        receive: [],
        industry_type: "",
        send_day: "1",
        send_time: "8",
        token: getCookie("user"),
        status: "0"
      },
      formdata: {
        words: [],
        side: "",
        industry: [],
        dimension: "",
        media_type: [],
        property_type: [],
        region_type: []
      },
      people: [],

      filter: [
        {
          id: "1",
          name: "内容相近",
          value: "1"
        },
        {
          id: "2",
          name: "完全相同",
          value: "2"
        },
        {
          id: "0",
          name: "无",
          value: "0"
        }
      ]
    };
  },
  watch: {
    "formcheck.media_type": {
      handler: function(val, oldVal) {
        if (
          this.formcheck.media_type.length === this.formdata.media_type.length
        ) {
          this.allmedia_type = true;
        } else {
          this.allmedia_type = false;
        }
      },
      deep: true
    },
    "formcheck.property_type": {
      handler: function(val, oldVal) {
        if (
          this.formcheck.property_type.length ===
          this.formdata.property_type.length
        ) {
          this.allproperty_type = true;
        } else {
          this.allproperty_type = false;
        }
      },
      deep: true
    },
    "formcheck.region_type": {
      handler: function(val, oldVal) {
        if (
          this.formcheck.region_type.length === this.formdata.region_type.length
        ) {
          this.allregion_type = true;
        } else {
          this.allregion_type = false;
        }
      },
      deep: true
    },
    "formcheck.receive": {
      handler: function(val, oldVal) {
        if (this.formcheck.receive.length === this.people.length) {
          this.allreceive = true;
        } else {
          this.allreceive = false;
        }
      },
      deep: true
    }
  },
  methods: {
    handleInputConfirm() {
      let inputValue = $.trim(this.inputValue);
      if (inputValue && this.errors.items.length == 0) {
          this.people.push({
              name:inputValue,
              email:inputValue
          })

        this.inputVisible = false;
        this.inputValue = "";
      }

    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.focus();
      });
    },
    checkedAll1(e) {
      var _this = this;

      if (this.allmedia_type == false) {
        //实现反选
        _this.formcheck.media_type = [];
      } else {
        //实现全选
        _this.formcheck.media_type = [];
        _this.formdata.media_type.forEach(function(item) {
          _this.formcheck.media_type.push(item.id);
        });
      }

      //  console.log(_this.artsort.batch);
    },
    checkedAll2() {
      var _this = this;
      if (this.allproperty_type == false) {
        //实现反选
        _this.formcheck.property_type = [];
      } else {
        //实现全选
        _this.formcheck.property_type = [];
        _this.formdata.property_type.forEach(function(item) {
          _this.formcheck.property_type.push(item.id);
        });
      }
    },
    checkedAll3() {
      var _this = this;
      if (this.allregion_type == false) {
        //实现反选
        _this.formcheck.region_type = [];
      } else {
        //实现全选
        _this.formcheck.region_type = [];
        _this.formdata.region_type.forEach(function(item) {
          _this.formcheck.region_type.push(item.id);
        });
      }
    },
    checkedAll4() {
      var _this = this;
      if (this.allreceive == false) {
        //实现反选
        _this.formcheck.receive = [];
      } else {
        //实现全选
        _this.formcheck.receive = [];
        _this.people.forEach(function(item) {
          _this.formcheck.receive.push(item.email);
        });
      }
    },
    repeatornot() {
      if (this.$route.query.id) {
        if ($.trim(this.formcheck.name) != "") {
          var t = this;
          $.ajax({
            type: "post",
            url: this.dataurl + "/client/report/check_name",
            data: {
              name: $.trim(this.formcheck.name),
              id: this.$route.query.id,
              type: this.formcheck.type,
              token: getCookie("user")
            },
            dataType: "json",
            success: function(res) {
              console.log(res);

              if (res.code == "1") {
                t.nameflag = false;
              } else {
                t.$message({
                  type: "warning",
                  message: "提示：" + res.msg
                });
                t.nameflag == true;
              }
            },
            error: function() {
              t.$message.error("操作繁忙，请稍后...");
            }
          });
        }
      } else {
        if ($.trim(this.formcheck.name) != "") {
          var t = this;
          $.ajax({
            type: "post",
            url: this.dataurl + "/client/report/check_name",
            data: {
              name: $.trim(this.formcheck.name),
              type: this.formcheck.type,
              token: getCookie("user")
            },
            dataType: "json",
            success: function(res) {
              if (res.code == "1") {
                t.nameflag = false;
              } else {
                t.$message({
                  type: "warning",
                  message: "提示：" + res.msg
                });
                t.nameflag == true;
              }
            },
            error: function() {}
          });
        }
      }
    },
    buff() {
      var t = this;
      if (
        this.nameflag == false &&
        this.formcheck.wid.length != 0 &&
        $.trim(this.formcheck.name) != ""
      ) {
        if (this.$route.query.id) {
          this.formcheck.token = getCookie("user");
          this.formcheck.id = this.$route.query.id;
          $.ajax({
            type: "post",
            url: t.dataurl + "/client/report/update_report_setting",
            data: t.formcheck,
            dataType: "json",
            success: function(res) {
              console.log(res);
              if (res.code == 1) {
                t.openMsg("修改成功！", "success");
                t.$router.push("/report/reportset");
              } else {
                t.$message.error("修改失败");
              }
            },
            error: function() {
              // alert("INTERNET ERROR!!!")
            }
          });
        } else {
          $.ajax({
            type: "post",
            url: this.dataurl + "/client/report/save",
            data: this.formcheck,
            dataType: "json",
            success: function(res) {
              // console.log(res)
              if (res.code == 1) {
                t.$router.push("/report/reportset");
              } else {
                t.$message.error(res.msg);
              }
            },
            error: function() {
              // alert("INTERNET ERROR!!!")
            }
          });
        }
      } else {
        if ($.trim(this.formcheck.name) == "") {
          this.openMsg("提示：报告名称不能为空！", "warning");
        } else if (this.formcheck.wid.length == 0) {
          this.openMsg("提示：主题不能为空", "warning");
        } else if (this.nameflag == true) {
          this.openMsg("提示：报告名称已存在", "warning");
        }
      }
    }
  },
  created() {
    var t = this;
    $.ajax({
      type: "post",
      url: this.dataurl + "/client/api/get_lists",
      data: {
        token: getCookie("user")
      },
      dataType: "json",
      success: function(res) {
        t.formdata = res.data;
      }
    });

    $.ajax({
      type: "post",
      url: this.dataurl + "/admin/user",
      data: {
        token: getCookie("user")
      },
      dataType: "json",
      success: function(res) {
        // console.log(res)
        t.people = res.data;
      },
      error: function() {
        // alert("INTERNET ERROR!!!")
      }
    });

    if (this.$route.query.id) {
      this.sta = true;
      $.ajax({
        type: "post",
        url: this.dataurl + "/client/report/get_report_setting_info",
        data: {
          id: this.$route.query.id,
          token: getCookie("user")
        },
        dataType: "json",
        success: function(res) {
          console.log(res);
          t.formcheck.weight = res.data.condition.weight;
          t.formcheck.name = res.data.name;
          t.formcheck.type = res.data.type;
          t.formcheck.tpl_id = res.data.tpl_id;
          t.formcheck.status = res.data.status;
          // console.log(res.data.condition.wid)

          if (typeof res.data.condition.wid == "string") {
            let arr = [];
            arr.push(res.data.condition.wid);
            t.formcheck.wid = arr;
          } else {
            t.formcheck.wid = res.data.condition.wid;
          }

          t.formcheck.side = res.data.condition.side;
          if (typeof res.data.condition.region_type == "string") {
            let arr = [];
            arr.push(res.data.condition.region_type);
            t.formcheck.region_type = arr;
          } else {
            t.formcheck.region_type = res.data.condition.region_type;
          }

          t.formcheck.dimension = res.data.condition.dimension;
          if (typeof res.data.condition.media_type == "string") {
            let arr = [];
            arr.push(res.data.condition.media_type);
            t.formcheck.media_type = arr;
          } else {
            t.formcheck.media_type = res.data.condition.media_type;
          }

          // t.formcheck.property_type= res.data.condition.property_type;
          if (typeof res.data.condition.property_type == "string") {
            let arr = [];
            arr.push(res.data.condition.property_type);
            t.formcheck.property_type = arr;
          } else {
            t.formcheck.property_type = res.data.condition.property_type;
          }

          t.formcheck.filter = res.data.condition.filter;



          if (typeof res.data.receive == "string") {
            let arr = [];
            arr.push(res.data.receive.split("|"));
            t.formcheck.receive = arr[0];
        // ----xft-----------合并去重勿动----
            var myarr=[]
            t.people.map(function(item){
                myarr.push(item.email)
            })
            // console.log(myarr)

            for (var i=0; i < t.formcheck.receive.length; i++) {
              if(myarr.indexOf(t.formcheck.receive[i])==-1){
                      t.people.push( {
                        name:t.formcheck.receive[i],
                        email:t.formcheck.receive[i]
                        } );
              }
            }
          // ------------xft---------

          } else {
            t.formcheck.receive = res.data.receive;
          }
          //   debugger
          t.formcheck.industry_type = res.data.condition.industry_type;
          t.formcheck.send_day = res.data.send_day;
          t.formcheck.send_time = res.data.send_time;
        },
        error: function() {
          // alert("INTERNET ERROR!!!")
        }
      });
    } else {
      // this.checkedAll()
    }
  },
  mounted() {
    $(".loading-container").addClass("loading-inactive");
    var html = '<li><i class="fa fa-home"></i><a href="#/home">Home</a></li>';
    html += '<li>报告</li> <li class="active"> 创建报告</li>';
    $("#Crumbs").html(html);
  }
};
</script>
<style scoped>
.text-align-center {
  width: 150px;
}
.table-responsive{
  padding: 0;
}
.el-button {
  color: #20a0ff;
  border: none;
  font-weight: 200;
  padding: 0;
}
.color-input {
  color: #ff0000;
}
</style>
