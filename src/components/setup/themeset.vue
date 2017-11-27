<template>
    <div class="right_">
           <div id="themeSet" class="tab-pane active">
                    <div class="text-right xftup">
                        <el-input  placeholder="请输入主题名称"  icon="search"  v-model="head.name"     @keyup.enter.native="creatajax" :on-icon-click="creatajax"> </el-input>
                        <!--<input type="text" placeholder="请输入主题名称" v-model="head.name"> <button @click="creatajax">搜索</button>  -->
                        <span >
                          <router-link class="btn btn-default" :to="{name:'newtheme'}">新增主题</router-link>
                         </span>
                    </div>
                    <div class="set_table">
                        <div class="table-responsive">
                            <table class="table table-hover  table-striped" >
                                <thead>
                                    <tr>
                                        <th>主题名称</th><th>创建时间</th><th>状态</th><th>更新时间</th><th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in tableData3 "  :key="item.updated" >
                                        <td>{{item.name}}</td> <td>{{item.created | tolocal}}</td>
                                        <td>{{item.status==-1?'停用':item.status==-2?"已删除":'启用'}}</td>
                                        <td>{{item.updated| tolocal}}</td>
                                        <td>
                                            <router-link class="btn btn-default btn-sm" :to="{ path:'/setup/themeset/newtheme', query: { id: item.id} }"><i class="fa fa-edit"></i>修改</router-link>
                                        <!--   <input class="btn btn-default btn-sm" type="button" :value= "item.status==0?'停用':'启用'"  @click="handleStatus(item.id,item.status)"> -->
                                            <button  class="btn btn-default btn-sm "  v-show="item.status==0" @click="handleStatus(item.id,item.status)"><i class="fa fa-check-square-o"></i>停用</button>
                                            <button  class="btn btn-default btn-sm "  v-show="item.status!=0" @click="handleStatus(item.id,item.status)"><i  class="fa fa-square-o"></i>启用</button>

                                            <button class="btn btn-default btn-sm "  @click="handleDelete(item.id)"><i class="fa fa-trash-o"></i>删除</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

            </div>
    </div>
</template>
<script>
let bootbox = require("bootbox");
import { getCookie } from "../../static/js/globle.js";
let np = require("NProgress");
export default {
  data() {
    return {
      enter: function(url, d, _fn) {
        this.ajaxEnter(url, d, _fn);
      },
      isStatus: false,
      head: {
        name: ""
      },
      tableData3: []
    };
  },
  methods: {
    handleDelete(ids) {
      debugger
      var t = this;
      var url = "/admin/words/get_opinion_total",
        d = {
          params: {
            token: getCookie("user"),
            id: ids
          }
        };
      t.enter(url, d, function(res) {
        if (res.code == -1) {
          // t.$message({
          //   type: "warning",
          //   message: "提示：观点已存在！"
          // });
          bootbox.confirm({
            message: "观点已存在！您确定删除吗？",
            size: "small",
            buttons: {
              confirm: {
                label: "确定",
                className: "btn-sky"
              },
              cancel: {
                label: "取消",
                className: "btn-default"
              }
            },
            callback: function(result) {
              var _this = t;
              if (result) {
                $.ajax({
                  type: "post",
                  url: _this.dataurl + "/admin/words/update",
                  data: {
                    token: getCookie("user"),
                    id: ids,
                    status: "-2"
                  },
                  dataType: "json",
                  success: function(res) {
                    if (res.code == "1") {
                      _this.creatajax();
                       _this.$message({
                        type: "success",
                        message: "删除成功！"
                      });
                    } else if (res.code == "-3") {
                      _this.$message({
                        type: "warning",
                        message: "提示：请至少保留一条主题！"
                      });
                    }
                  },
                  error: function() {
                    // alert("INTERNET ERROR!!")
                  }
                });
              }
            }
          });


        } else {
          bootbox.confirm({
            message: "您确定删除吗？",
            size: "small",
            buttons: {
              confirm: {
                label: "确定",
                className: "btn-sky"
              },
              cancel: {
                label: "取消",
                className: "btn-default"
              }
            },
            callback: function(result) {
              var _this = t;
              if (result) {
                $.ajax({
                  type: "post",
                  url: _this.dataurl + "/admin/words/update",
                  data: {
                    token: getCookie("user"),
                    id: ids,
                    status: "-2"
                  },
                  dataType: "json",
                  success: function(res) {
                    if (res.code == "1") {
                      _this.creatajax();
                       _this.$message({
                        type: "success",
                        message: "删除成功！"
                      });
                    } else if (res.code == "-3") {
                      _this.$message({
                        type: "warning",
                        message: "提示：请至少保留一条主题！"
                      });
                    }
                  },
                  error: function() {
                    // alert("INTERNET ERROR!!")
                  }
                });
              }
            }
          });
        }})
      // let hasId = false;
      // var t = this;

      // bootbox.confirm({
      //   message: "您确定删除吗？",
      //   size: "small",
      //   buttons: {
      //     confirm: {
      //       label: "确定",
      //       className: "btn-sky"
      //     },
      //     cancel: {
      //       label: "取消",
      //       className: "btn-default"
      //     }
      //   },
      //   callback: function(result) {
      //     // if (result) {
      //     var url = "/admin/words/get_opinion_total",
      //       d = {
      //         params: {
      //           token: getCookie("user"),
      //           id: ids
      //         }
      //       };
      //     t.enter(url, d, function(res) {
      //       if (res.code == -1) {
      //         hasId = true;
      //         t.$message({
      //           type: "warning",
      //           message: "提示：观点已存在！"
      //         });
      //       } else {
      //         hasId = false;
      //         if (result && hasId == false) {
      //           var _this = t;
      //           $.ajax({
      //             type: "post",
      //             url: t.dataurl + "/admin/words/update",
      //             data: {
      //               token: getCookie("user"),
      //               id: ids,
      //               status: "-2"
      //             },
      //             dataType: "json",
      //             success: function(res) {
      //               if (res.code == "1") {
      //                 _this.creatajax();
      //               } else if (res.code == "-3") {
      //                 _this.$message({
      //                   type: "warning",
      //                   message: "请至少保留一条主题"
      //                 });
      //               }
      //             },
      //             error: function() {
      //               // alert("INTERNET ERROR!!")
      //             }
      //           });
      //         } else {
      //         }
      //       }
      //     });
      //     // }
      //   }
      // });
    },
    handleEdit(id) {
      console.log(id);

      this.$router.push("newtheme", query);
    },
    handleStatus(ids, status) {
      if (status == "-1") {
        var t = this;
        $.ajax({
          type: "post",
          url: this.dataurl + "/admin/words/update",
          data: {
            token: getCookie("user"),
            id: ids,
            status: "0"
          },
          dataType: "json",
          success: function(res) {
            if (res.code == "1") {
              t.creatajax();
            } else if (res.code == "-3") {
              t.$message({
                type: "warning",
                message: "请至少保留一条主题"
              });
            }
          }
        });
      } else if (status == "0") {
        var t = this;
        $.ajax({
          type: "post",
          url: this.dataurl + "/admin/words/update",
          data: {
            token: getCookie("user"),
            id: ids,
            status: "-1"
          },
          dataType: "json",
          success: function(res) {
            if (res.code == "1") {
              t.creatajax();
            } else if (res.code == "-3") {
              t.$message({
                type: "warning",
                message: "请至少保留一条主题"
              });
            }
          }
        });
      }
    },
    creatajax() {
      var t = this;
      $.ajax({
        type: "post",
        url: this.dataurl + "/admin/words/index",
        data: {
          token: getCookie("user"),
          name: t.head.name
        },
        dataType: "json",
        success: function(res) {
          // 按时间排序
          t.tableData3 = res.data.data;
        },
        error: function() {
          // alert("INTERNET ERROR!!")
        }
      });
    }
  },
  created() {
    np.start();
    this.creatajax();
    //    debugger
    //    alert(this.tolocal(1293072805))
  },
  mounted() {
    var html = '<li><i class="fa fa-home"></i><a href="#/home">Home</a></li>';
    html += '<li>设置</li> <li class="active"> 主题设置</li>';
    $("#Crumbs").html(html);
    $(".loading-container").addClass("loading-inactive");
    np.done();
  }
};
</script>
<style scoped>
table {
  border-collapse: collapse;
}
.table tbody tr td {
  vertical-align: middle !important;
}
.el-input {
  width: 200px;
}
table tr td:last-child{
  width: 210px;
}
</style>
