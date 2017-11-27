<template>
    <div class="childbox">
      <div class="view-box" v-show="wshow">
        <div class="well with-header">
          <div class="header bordered-sky text-align-right">
              <router-link class="btn btn-default" :to="{name:'addw'}">新增预警</router-link>
          </div>
          <table class="table table-hover table-striped">
            <thead>
              <tr>
                <td>预警名称</td><td>主题</td><td>创建时间</td><td>状态</td><td>操作</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="it in wdetail">
                <td>{{it.name}}</td><td v-html="it.wid">{{it.wid}}</td><td>{{it.created|tolocal}}</td><td>{{it.status==0?'开启':'关闭'}}</td>
                <td><router-link class="btn btn-default btn-xs " :to="{name:'addw',query:{id:it.id}}"><i class="fa fa-edit"></i>编辑</router-link>
                  <a class="btn btn-default btn-xs "  @click="stopw(it.id,it.status)"><i v-if="it.status==0" class="fa fa-check-square-o"></i><i v-else class="fa fa-square-o"></i>{{it.status==0?"关闭":"开启"}}</a>
                  <a class="btn btn-default btn-xs black" @click="delw(it.id)"><i class="fa fa-trash-o"></i>删除</a></td>
              </tr>
            </tbody>
          </table>
          <div class="pagenation" v-show="this.pageCount>0">
              <el-pagination
                   style="float:right"
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="currentPage"
                   :page-sizes="[5,10, 20, 50, 100]"
                   :page-size="pageSize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="pageCount">
               </el-pagination>
           </div>
        </div>
      </div>
    </div>
</template>
<script>
import {getCookie} from '../../static/js/globle.js';
import {delCookie} from '../../static/js/globle.js';
var bootbox=require('bootbox')
let np=require("NProgress");
export default {
    data() {
        return {
          enter:function (url,d,_fn) {
            this.ajaxEnter(url,d,_fn)
          },
          wshow:true,
          wdetail:[],
          pageCount:'',
          currentPage:1,
          sh:{
            offset:0,
            limit:'10'
          }
        }
    },
    created(){
        getCookie('user')==""?(this.$router.replace({ name: '/app' })):''
        np.start()
        var url='/client/warning/setting/',t=this;
        this.enter(url,{params:t.sh},function(d){
          t.wdetail=d.data.data;
          t.pageCount=d.data.total;
        })
    },filters: {
      formatDate(time) {
        var date = new Date(parseInt(time+'000'));
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    mounted(){
      var html='<li><i class="fa fa-home"></i><a href="#/home">Home</a></li>';
      html+='<li>预警</li><li class="active">预警设置</li>';
      $('#Crumbs').html(html)
      $(document).scrollTop(0)
      np.done()
    },
    methods:{
      handleSizeChange(val){
        this.sh.limit =val;
        this.artlistChange()
      },
      handleCurrentChange(val){
        this.currentPage = val;
        this.sh.offset= this.pageSize * (val-1);
        this.artlistChange();
      },
      artlistChange(){
        var url='/client/warning/setting/',t=this;
        this.enter(url,{params:t.sh},function(d){
          t.wdetail=d.data.data;
          t.pageCount=d.data.total;
        })
      },
      stopw(idx,sts){
        var url='/client/warning/update_status/',t=this,
        d={params:{id:idx,status:sts==0?-1:0}};
        this.enter(url,d,function(d){
          if(d.code==1){
            var url='/client/warning/setting/';
            t.enter(url,{params:{}},function(d){
              d.code==1?t.wdetail=d.data.data:''
            })
          }else {
            t.$message.error(d.msg)
          }
        })
      },
      delw(idx){
        var t=this;
        bootbox.confirm({
            message: "您确定要删除吗？",
            size:'small',
            buttons: {
                confirm: {
                    label: '确定',
                    className: 'btn-info'
                },
                cancel: {
                    label: '取消',
                    className: 'btn-default'
                }
            },
            callback: function (result) {
                if(result){
                    var url='/client/warning/update_status/',
                        data={params:{id:idx,status:'-2'}};
                    t.enter(url,data,function(d) {
                      var url='/client/warning/setting/';
                      t.enter(url,{params:{}},function(d){
                        t.wdetail=d.data.data;
                        t.pageCount=d.data.total;
                      })
                    })
                }
            }
        });
      }
    }

}
</script>
<style scoped>
.view-box{
  width: 100%;
}
.view-w{
  width: 100%;
  height: 100%;
}
h4{
  padding:3px 6px;
  background-color: #cdcdcd;
}
.ptitle a{
  display: inline-block;
  cursor: pointer;
  float: right;
  border-radius: 5px;
  border: 1px solid #cf00fc;
}
.bs-tabs{
  width: 200px;
  float: left;
}
.line-view{
  width: 100%;
  height: 200px;
}
.wrank{
  width: 44%;
  height: 200px;
  float: left;
}
.wpie{
  width: 44%;
  height: 200px;
  float: right;
}
.wdetail{
  width: 100%;
  height: auto;
}
.wdetail table{
  width: 100%;
  text-align: center;
  border-collapse: collapse;
}
.wdetail table td{
  border: 1px solid #ccc;
}
.pagenation{
  padding-top: 5px;
  height: 30px;
}
table tr td:last-child{
  width: 200px;
}
</style>
