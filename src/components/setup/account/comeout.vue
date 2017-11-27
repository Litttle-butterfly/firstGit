<template>
     <div class="right_">
        <div class="xftup">
            导出进度：
            <select  v-model="head.status" @change="getlist">
          <!--  0:未开时1:正在导出2:导出成功-1:导出失败-->
                <option value="">全部</option>
                <option value="2">已完成</option>
                 <option value="0">未开时</option>
                 <option value="1">正在导出</option>
                 <option value="-1">导出失败</option>
            </select>
              导出时间:
            <select v-model="head.date_range"  @change="getlist">
                <option value="">全部</option>
                <option value="6days">一周内</option>
                <option value="1month">一月内</option>
                <option value="3month">三月内</option>
                <option value="6month">半年内</option>
                <option value="1year">一年内</option>
                <option value="-1year">一年外</option>
            </select>
            <div class="xftipt">
              <el-input  placeholder="搜索文件名"  icon="search"  v-model="head.search_txt"      @keyup.enter.native="getlist"  :on-icon-click="getlist"> </el-input>
            </div>
          <!--  <input type="text" placeholder="搜索文件名" v-model="head.search_txt"/>
              <input class="btn btn-default btn-sm" type="button" value="搜索" @click="getlist">-->
        </div>
        <div class="table-responsive">
        <table class="table table-hover table-striped">
            <thead>
                <tr>
                    <td>文件名称</td><td>导出类型</td><td>导出进度</td><td>导出状态</td><td>导出时间</td><td>操作</td>
                </tr>
            </thead>
            <tbody>
            <tr  v-for="item in tableData3" :key="item.id">
                <td>{{item.name}}</td>
                  <td>{{item.file_type}}</td>
                <td>
                    <div class="progress">
                    <div class="progress-bar" :style='"width:"+item.export_count/item.total*100+"%"'>
                          {{(item.export_count/item.total*100).toFixed(0)>100?'100':(item.export_count/item.total*100).toFixed(0)}}%
                    </div>
                    </div>
                </td>
                <td>{{item.status==0?'未开始':item.status==1?'正在导出':item.status==-1?'导出失败':item.status==2?'已完成':'出错啦~'}}</td>
                <td>{{item.created | tolocal}}</td>
                <td>

                    <a v-show="item.status != 2" class="btn btn-sm btn-default disabled">下载</a>
                    <a href="javascript:;" v-show="item.status == 2"
                    class="btn btn-default btn-sm" title="下载" @click="down(item.file_path)">下载</a>

                    <input class="btn btn-sm btn-default" type="button" value="删除" @click="del(item.id)">
                </td>
            </tr>
            </tbody>
            <tfoot v-show = "this.pagetotal>0">
                <tr>
                    <td colspan="6">
                        <div >
                            <el-pagination
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :current-page="currentPage"
                                :page-sizes="[10, 20, 50]"
                                :page-size="head.limit"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="pagetotal">
                            </el-pagination>
                        </div>
                    </td>
                </tr>
            </tfoot>
        </table>

        </div>



     </div>
</template>
<script>
let bootbox = require("bootbox");
import {getCookie} from '../../../static/js/globle.js';
let np=require("NProgress");
export default {
    data() {
        return {
                  enter: function(url, d, _fn) {
        this.ajaxEnter(url, d, _fn);
      },
            tableData3:[],
            pagetotal:'',
            head:{
                status:'',
                limit:'10',
                offset:'',
                date_range:'',
                search_txt:'',
                token: getCookie("user")
            },
            currentPage:'1'
        }
    },
    computed:{
        percentage:function(){
            // return
        }
    },
    created(){
        np.start()
        this.getlist();
    },
    mounted(){
      var html='<li><i class="fa fa-home"></i><a href="#/home">Home</a></li>';
      html+='<li>设置</li><li class="active">导出</li>';
      $('#Crumbs').html(html)
      np.done()
    },
    watch:{
    //     pagetotal:function(){
    //     var t=this;
    //     this.$nextTick(function(){
    //       $('.tcdPageCode').createPage({
    //         pageCount:Math.ceil(t.pagetotal/t.head.limit),//总共多少页
    //         current:1,//当前页
    //         backFn:function(p){
    //           t.head.offset=(p-1)*t.head.limit;
    //             t.getlist()
    //         }
    //       })
    //     })
    //   }
    },
    methods:{
        handleSizeChange(val){
            this.head.limit = val;
            console.log(`每页 ${val} 条`);
            this.getlist()
        },
        handleCurrentChange(val){
             this.$nextTick(function () {
            this.currentPage = val;
            this.head.offset = this.head.limit * (val - 1)
            console.log( '当前'+val)
            console.log(this.head)
            this.getlist()
             })
        },
        getlist(){
            var t = this;
            $.ajax({
                type:'post',
                url:this.dataurl+'/admin/export',
                data:this.head,
                dataType:'json',
                success:function (res) {
           // console.log(res)
                    if(res.code=='-1'){
                        t.tableData3 = []
                        t.pagetotal = 0
                    }else{
                    t.tableData3 = res.data.data;
                    t.pagetotal = res.data.count;
                    console.log(t.tableData3)
                    }
                }
            })
        },
        del(ids){

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
                    var url = "/admin/export/update_export",
                    d = {
                        params: {
                                id:ids,
                                status:'-2',
                                token: getCookie("user")
                        }
                    };
                    $t.enter(url, d, function(d) {
                    d.code == 1
                        ? ($t.$message({message:"删除成功！",type: "success"}),
                        $t.getlist())
                        : $t.$message.error("删除失败!");
                    });
                }
                }
            });



        },
        down(url){
            debugger
            var $t = this;
            bootbox.confirm({
                message: "是否下载",
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
                    var a = document.createElement('a');
                    var myurl = $t.dataurl+ url;
                    var filename = 'download.zip';
                    a.href = myurl;
                    a.download = filename;
                    a.click();
                    window.URL.revokeObjectURL(url);
                }
                }
            });

        }
    }
}
</script>
<style scoped>
.progress{
    margin-bottom:0
}
.progress-bar {
    background-color: #1D8CE0;
}
table tr td:last-child{
  width: 130px;
}
</style>
