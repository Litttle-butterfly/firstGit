<template>
    <div class="right_">
      <div class="">
        <div class=" with-header">
            <div class="header xftup">
              主题：
              <select @change="getlist" v-model="ids.wid">
                  <option value="">全部</option>
                  <option v-for="item in words" :key="item.id" :value="item.id">{{item.name}}</option>
              </select>
              状态：
              <select   @change="getlist" v-model="ids.train_status">
                <option value="">状态</option>
                <option value="1">已完成</option>
                <option value="-1">训练中</option>
              </select>
              <div class="xftipt">
                <el-input  placeholder="输入主题名字"  icon="search"  v-model="ids.name"    @keyup.enter.native="getlist"  :on-icon-click="getlist"> </el-input>
              </div>
         <!--     <input type="text" placeholder="输入主题名字" v-model="ids.name"></input>
             <span class="btn btn-sm" @click="getlist">搜索</span>-->

               <router-link class="btn btn-default" style="float:right" :to="{name:'detailrobot'}">创建智能观点</router-link></div>
               <table class="table table-striped table-hover table-responsive">
                   <thead>
                       <tr>
                           <th>观点名称</th><th>训练集</th><th>发现集</th><th>样本成熟度</th><th>状态</th><th>创建时间</th><th>操作</th>
                       </tr>
                   </thead>
                   <tbody>
                       <tr v-for="item in tableData3 "  :key="item.id" >
                           <td>{{item.name}}</td> <td>{{item.train_count}}</td><td>{{item.find_count}}</td>
                           <td>
                           <div class="progress">
                           <div class="progress-bar" :style='"width:"+item.train_percent'>
                              {{item.train_percent}}
                           </div>
                           </div>
                           </td>
                           <td>{{item.train_status==1?'已完成':'训练中'}}</td> <td>{{item.created|tolocal}}</td>
                           <td>

                             <router-link class="btn btn-default" :to="{ path:'/setup/robotlist', query: { id: item.id,name:item.name,fdct:item.find_count} }">编辑</router-link>
                             <router-link class="btn btn-default" v-if='item.train_status==1&&item.find_count!=0' :to="{ name:'robotana', query: { id: item.id,name:item.name,wid:item.wid} }">观点分析</router-link>
                             <a class="btn btn-default" href="javascript:void(0)" v-else disabled>观点分析</a>
                             <a class="btn btn-default" href="javascript:void(0)"  @click="del(item.id)">删除</a>
                           </td>
                       </tr>
                   </tbody>
               </table>
        </div>
      </div>
    </div>
</template>
<script>
import {getCookie} from '../../static/js/globle.js';
let np=require("NProgress");
let bootbox = require("bootbox");
 export default {
    data() {
      return {
        enter:function (url,d,_fn) {
          this.ajaxEnter(url,d,_fn)
        },
        openMsg: function(msg, type) {
          this.$message({
            message: msg,
            type: type
          });
        },
        ids:{
            wid:'',
            train_status:'',
            name:''
        },
        words:[],
        tableData3: []
      }
    },
    created(){
      getCookie('user')==""?(this.$router.replace({ name: '/app' })):''
      np.start();
      var t=this;
      t.enter('/client/explore/get_opinion_lists',{params:{}},function(d){
        t.tableData3 = d.data;
      })
      var url='/client/api/get_lists',t=this;
      this.enter(url,{params:{}},function(d){
        t.words=d.data.words;
      })
    },
    mounted(){
      $('.loading-container').addClass('loading-inactive');
      var html='<li><i class="fa fa-home"></i><a href="#/home">Home</a></li>';
      html+='<li>探索</li><li class="active">智能观点</li>';
      $('#Crumbs').html(html)
      np.done();
    },
    methods: {
      del(id) {
        // 删除接口
        var t=this;
        bootbox.confirm({
          message: "您确定要删除吗？",
          size: "small",
          buttons: {
            confirm: {
              label: "确定",
              className: "btn-info"
            },
            cancel: {
              label: "取消",
              className: "btn-default"
            }
          },
          callback: function(result) {
            if (result) {
              t.enter('/admin/opinion/update',{params:{id:id,status:'-2'}},function(d){
                if(d.code == '1'){
                  t.getlist()
                  t.openMsg("删除成功！","success");
                }else{
                  t.openMsg("删除失败！","error")
                }
              })
            }
          }
        });
      },
      getlist(id){
        var t=this;
          t.enter('/client/explore/get_opinion_lists',{params:this.ids},function(d){
            t.tableData3 = d.data;
          })
      },
  }
  }
</script>
<style scoped>
.progress{
    margin-bottom:0
}
table tr td{
  vertical-align: middle;
}
.fl-right{
  position: absolute;
  right: 10px;
}
table tr td:last-child{
  width: 210px;
}
</style>
