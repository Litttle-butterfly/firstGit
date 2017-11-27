<template>
    <div class="right_">
            <div class="xftup">
                报告类别：
                <select v-model="heads.type"  @change="creatajax()">
                    <option value="">全部</option>
                    <option value="1">日报</option>
                    <option value="2">周报</option>
                </select>
                报告时间：
                <select v-model="heads.date_range"  @change="creatajax()">
                    <option value="">全部</option>
                    <option value="6days">一周内</option>
                    <option value="1month">一月内</option>
                    <option value="3month">三月内</option>
                    <option value="6month">半年内</option>
                    <option value="1year">一年内</option>
                    <option value="-1year">一年外</option>
                </select>
                <router-link class="btn btn-default btn-right" :to="{name:'newR2'}">创建报告</router-link>
            </div>
               <div class="table-responsive">
                    <table class="table table-hover table-striped">
                        <thead>
                            <tr>
                                <th>报告名称</th><th>报告类别</th><th>创建时间</th><th>状态</th><th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in tableData3 "  :key="item.id" >
                                <td v-html="item.name">{{item.name}}</td> <td>{{item.type==1?"日报":'周报'}}</td> <td>{{item.created | tolocal}}</td> <td>{{item.status==-1?'停用':'启用'}}</td>
                                <td>
                                  <router-link class="btn btn-default  btn-sm" :to="{ path:'/report/newR2', query: { id: item.id} }"><i class="fa fa-edit"></i>编辑</router-link>


                                     <button  class="btn btn-default btn-sm "  v-show="item.status==0" @click="handleStatus(item.id,item.status)"><i class="fa fa-check-square-o"></i>停用</button>
                                    <button  class="btn btn-default btn-sm "  v-show="item.status!=0" @click="handleStatus(item.id,item.status)"><i  class="fa fa-square-o"></i>启用</button>
                                     <button class="btn btn-default btn-sm "  @click="handleDelete(item.id,item.status)"><i class="fa fa-trash-o"></i>删除</button>

                                 <!--   <input class="btn btn-default btn-sm" type="button" :value= "item.status==-1?'启用':'停用'"  @click="handleStatus(item.id,item.status)">
                                    <input class="btn btn-default btn-sm" type="button" value="删除"  @click="handleDelete(item.id)">-->
                                </td>
                            </tr>
                        </tbody>
                        <!-- <tfoot v-show = "this.pagetotal>0">
                            <tr>
                                <td colspan="5">

                                </td>
                            </tr>
                        </tfoot> -->
                    </table>
                    <div class="pagenation" v-show="this.pagetotal>0">
                      <el-pagination
                          @size-change="handleSizeChange"
                          @current-change="handleCurrentChange"
                          :current-page="currentPage"
                          :page-sizes="[10, 20, 50]"
                          :page-size="heads.limit"
                          layout="total, sizes, prev, pager, next, jumper"
                          :total="pagetotal">
                      </el-pagination>
                     </div>
                </div>

    </div>
</template>
<script>
let bootbox = require("bootbox");
import {getCookie} from '../../static/js/globle.js';
let np=require("NProgress");
export default {

    data() {
        return {

            pagetotal:'',
            pageCount:'',
            pageSize:'10',
            heads:{
                type:'',
                date_range:'',
                offset:'0',
                limit:'10',
                token: getCookie("user")
            },
            isStatus:false,
            head:{
                name:''
            },
        tableData3: []
      }

    },
    watch:{
      },
    methods:{
        handleSizeChange(val){
            this.heads.limit = val;
            this.creatajax()
        },
        handleCurrentChange(val){
             this.$nextTick(function () {
            this.currentPage = val;
            this.heads.offset = this.heads.limit * (val - 1)
            this.creatajax()
             })
        },
        changePageSize(){
            this.heads.offset=0;
            // this.artlistChange();
            this.creatajax()
        },
        creatajax(){
            var  t = this;
            $.ajax({
                type:'post',
                url:this.dataurl+'/client/report/get_report_setting_lists',
                data:this.heads,
                dataType:'json',
                success:function (res) {
                    // console.log(res)
                    if(res.code == 1){
                    t.pagetotal = res.data.total;
                    t.tableData3=res.data.data;
                    }else{
                         t.tableData3=[]
                         t.pagetotal =0
                    }

                },
                error:function(){
                    // alert("INTERNET ERROR!!")
                }
            })
            // this.$ajax.get('/client/report/get_report_setting_lists',{params:this.heads})
            // .then(res=>{
            //     console.log(res.data);
            //     this.tableData3=res.data.data

            // })
            // .catch(err=>{
            //     console.log(err)
            // })
        },
        handleDelete(ids){
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

                    $.ajax({
                        type:'post',
                        url:$t.dataurl+'/client/report/update_report_setting_status',
                        data:{
                            id:ids,status:"-2",
                            token: getCookie("user")
                        },
                        dataType:'json',
                        success:function (res) {
                            // console.log(res)
                            if(res.code==1){
                                $t.$message({
                                    type:'success',
                                    message:'删除成功!'
                                })
                                $t.creatajax()
                            }else{
                                $t.message.error("删除失败！")
                            }

                        },
                    error:function(){
                        // alert("INTERNET ERROR")
                    }
                })
                }
                }
            });


        },
      handleStatus(ids,st) {
        var  t = this;
        if(st == '0'){
            $.ajax({
                type:'post',
                url:this.dataurl+'/client/report/update_report_setting_status',
                data:{
                    id:ids,status:"-1",
                    token: getCookie("user")
                },
                dataType:'json',
                success:function (res) {
                    // console.log(res)
                    t.creatajax()
                },
                error:function(){
                    // alert("INTERNET ERROR")
                }
            })
        }else if(st == '-1'){

             $.ajax({
                type:'post',
                url:this.dataurl+'/client/report/update_report_setting_status',
                data:{
                    id:ids,status:"0",
                    token: getCookie("user")
                },
                dataType:'json',
                success:function (res) {
                    // console.log(res)
                    t.creatajax()
                },
                error:function(){
                    // alert("INTERNET ERROR")
                }
            })
        }


      } ,
    },
    created(){
      np.start()
      this.changePageSize()
      this.creatajax()
    },
    mounted(){
      $('.loading-container').addClass('loading-inactive');
        var html='<li><i class="fa fa-home"></i><a href="#/home">Home</a></li>';
      html+='<li>报告</li> <li class="active"> 设置</li>';
      $('#Crumbs').html(html)
      np.done()
    }
}
</script>
<style scoped>
.btn-right{
  position: absolute;
  right: 20px;
}
table tr td:last-child{
  width: 210px;
}
</style>
