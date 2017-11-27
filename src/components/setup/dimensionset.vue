<template>
    <div class="right_">
                <div id="weiduSet" class="tab-pane">
                    <div class="text-right xftup">
                       <el-input  placeholder="请输入维度名称" icon="search"  v-model="head.name"   @keyup.enter.native="page"   :on-icon-click="page"> </el-input>
                        <!--<input type="text" v-model="head.name" placeholder="请输入维度名称"><button @click="page">搜索</button>-->
                            <span >
                          <router-link class="btn btn-default "  :to="{name:'newdimension'}">新增维度</router-link>

                         </span>
                    </div>
                    <div class="table-responsive">
                     <table class="table table-hover  table-striped">
                        <thead>
                            <tr>
                                <th>维度名称</th><th>维度策略</th><th>状态</th><th>创建时间</th><th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in tableData3 "  :key="item.id" >
                                <td>{{item.name}}</td> <td>{{item.condition}}</td> <td>{{item.status==-1?'停用':item.status==0?'启用':'已删除'}}</td> <td>{{item.created | tolocal}}</td>
                                <td>
                                  <router-link class="btn btn-default btn-sm" :to="{ path:'/setup/newdimension', query: { id: item.id} }"><i class="fa fa-edit"></i>编辑</router-link>

                             <!--  <input class="btn btn-default" type="button" :value= "item.status==-1?'启用':'停用'"  @click="handleStatus(item.id,item.status)">
                                    <input class="btn btn-default" type="button" value="删除"  @click="handleDelete(item.id,item.status)">-->

                                    <button  class="btn btn-default btn-sm "  v-show="item.status==0" @click="handleStatus(item.id,item.status)"><i class="fa fa-check-square-o"></i>停用</button>
                                    <button  class="btn btn-default btn-sm "  v-show="item.status!=0" @click="handleStatus(item.id,item.status)"><i  class="fa fa-square-o"></i>启用</button>
                                     <button class="btn btn-default btn-sm "  @click="handleDelete(item.id,item.status)"><i class="fa fa-trash-o"></i>删除</button>

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
let np=require("NProgress");
export default {
  data() {
    return {
      head: {
        name: ""
      },
      tableData3: []
    };
  },
  created() {
    np.start()
    var t = this;
    $.ajax({
      type: "post",
      url: this.dataurl + "/admin/dimension",
      data: {
        token: getCookie("user"),
        name: this.head.name
      },
      dataType: "json",
      success: function(res) {
        t.tableData3 = res.data.data;
      }
    });
    //    this.$ajax.get('/admin/dimension',{params:{name:this.head.name}})
    // .then(res=>{
    //     console.log(res.data);
    //     this.tableData3=res.data.data;
    // })
    // .catch(err=>{
    //     console.log(err)
    // })
  },
  mounted() {
    var html = '<li><i class="fa fa-home"></i><a href="#/home">Home</a></li>';
    html += '<li>设置</li> <li class="active"> 维度设置</li>';
    $("#Crumbs").html(html);
    np.done()
  },
  methods: {
    page() {
      this.creatajax();
    },
    creatajax() {
      var t = this;
      $.ajax({
        type: "post",
        url: this.dataurl + "/admin/dimension",
        data: {
          name: this.head.name,
          token: getCookie("user")
        },
        dataType: "json",
        success: function(res) {
          t.tableData3 = res.data.data;
        }
      });
      // this.$ajax.get('/admin/dimension',{params:{name:this.head.name,token:getCookie("user")}})
      // .then(res=>{
      //     console.log(res);
      //     this.tableData3 = res.data.data
      // })
      // .catch(err=>{
      //     console.log(err)
      // })
    },
    statuschange(ids, statusnum) {
      var t = this;
      $.ajax({
        type: "post",
        url: this.dataurl + "/admin/dimension/update",
        data: {
          id: ids,
          token: getCookie("user"),
          status: statusnum
        },
        dataType: "json",
        success: function(res) {
          if(res.code =='1'){
            t.$message({
            message: '操作成功！',
            type: 'success'
            });
               t.creatajax();
          }else{
            t.$message.error( '操作失败！');
          }

        }
      });
    },
    handleDelete(id, st) {
         var $t = this;
            bootbox.confirm({
                message: "您确定要删除吗？",
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
                if (result) {
                $t.statuschange(id, "-2");
                }
                }
            });
      // let isSure = confirm("确定删除吗？");
      // if (isSure) {
      //   this.statuschange(id, "-2");
      // }

    },
    handleStatus(id, st) {
      console.log(id);
      if (st == "-1") {
        this.statuschange(id, "0");
        // this.$ajax.get('/admin/dimension/update',{params:{id:id,status:"0"}})
        // .then(res=>{
        //     console.log(res.data);
        //     this.creatajax()
        // })
        // .catch(err=>{
        //     console.log(err)
        // })
      } else if (st == "0") {
        this.statuschange(id, "-1");
        // this.$ajax.get('/admin/dimension/update',{params:{id:id,status:"-1"}})
        // .then(res=>{
        //     console.log(res.data);
        //     this.creatajax()

        // })
        // .catch(err=>{
        //     console.log(err)
        // })
      }
    }
  }
};
</script>
<style scoped>
.el-input {
  width: 200px;
}
table tr td:last-child{
  width: 210px;
  vertical-align: middle;
}
</style>
