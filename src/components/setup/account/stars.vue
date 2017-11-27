<template>
     <div class="right_">
        <div class="xftup">
            媒体平台：
            <select  v-model="heads.media_type" @change="doAjax1()">{{heads.media_type}}
                <option value="">全部</option>
                <option v-for="item in comm" :key="item.id" :value="item.id">{{item.name}}</option>
            </select>
              关注时间:
            <select v-model="heads.date_range"  @change="doAjax1()">{{heads.date_range}}
                <option value="">全部</option>
                <option value="6days">一周内</option>
                <option value="1month">一月内</option>
                <option value="3month">三月内</option>
                <option value="6month">半年内</option>
                <option value="1year">一年内</option>
                <option value="-1year">一年外</option>
            </select>
        </div>
        <div class="table-responsive">
            <table class="table table-hover table-striped">
                 <thead>
                    <tr>
                        <td>媒体名称</td><td>关注时间</td><td>取消关注</td>
                    </tr>
                </thead>
                <tbody>
                    <tr  v-for="item in tableData3" :key="item.id">
                        <td>{{item.website_name}}</td><td>{{item.created | tolocal}}</td>
                        <td><input class="btn btn-sm btn-default" type="button" value="取消关注" @click="qg(item.id)"></td>
                    </tr>
                 </tbody>
                 <tfoot v-show = "this.pagetotal>0">
                     <tr>
                         <td colspan="3">
                            <el-pagination
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :current-page="currentPage"
                                :page-sizes="[10, 20, 50]"
                                :page-size="heads.limit"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="pagetotal">
                            </el-pagination>
                         </td>
                    </tr>
                 </tfoot>
            </table>
        </div>
     </div>
</template>
<script>
import { getCookie } from "../../../static/js/globle.js";
let np = require("NProgress");
export default {
  data() {
    return {
      heads: {
        media_type: "",
        date_range: "",
        offset: "",
        limit: "10",
        token: getCookie("user")
      },
      comm: [],
      tableData3: [],
      pagetotal: "",
    //   currentPage: "1"
    };
  },
  mounted() {
    var html = '<li><i class="fa fa-home"></i><a href="#/home">Home</a></li>';
    html += '<li>设置</li><li class="active">媒体关注</li>';
    $("#Crumbs").html(html);
    np.done();
  },
  created() {
    np.start();
    this.getlist();
    this.doAjax1();
  },
  directives: {
    focus: {
      // 指令的定义
      inserted: function(el, binding, vnode, oldVnode) {
        // console.log(el);
        // console.log(binding);
        // console.log(vnode);
        // console.log(oldVnode);
        el.focus();
      }
    },
  },
  methods: {
    handleSizeChange(val) {
      this.heads.limit = val;
      this.doAjax1();
    },
    handleCurrentChange(val) {
      this.$nextTick(function() {
        this.currentPage = val;
        this.heads.offset = this.heads.limit * (val - 1);
        this.doAjax1();
      });
    },
    getlist() {
    this.$ajax.post('/client/api/get_lists',{})
      .then(res=>{
        //  console.log(res.data);
        this.comm = res.data.data.media_type;
      })
      .catch(err=>{
          console.log(err)
      })

    },
    doAjax1() {

       this.$ajax.post('/admin/media',{params:this.heads})
           .then(res=>{
                if (res.data.code == 1) {
                    this.tableData3 = res.data.data.data;
                    this.pagetotal = res.data.data.count;
                } else {
                    this.tableData3 = [];
                    this.pagetotal = 0;
                }
           })
           .catch(err=>{
               console.log(err)
           })
    },
    qg(id) {
            this.$ajax.post('/client/api/media_uncollect',{id: id} )
           .then(res=>{
                if (res.data.code == 1) {
                    this.doAjax1();
                    this.$message({
                    message: "已为您取消关注！",
                    type: "success"
                    });
                } else {
                }
           })
           .catch(err=>{
               console.log(err)
           })



    }
  }
};
</script>
<style scoped>
table tr td:last-child{
  width: 130px;
}
</style>
