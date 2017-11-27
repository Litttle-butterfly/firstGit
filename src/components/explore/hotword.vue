<template>
  <div style="width:100%;">
    <div class="xftcrumb widget-body">
      <label>全部结果<span>&gt;</span></label>
      <label>{{choose.chwid}}<span>&gt;</span></label>
      <div style="display:inline-block" v-for="it in choose.chlist" :key="it.id">
        <div class="menu-drop" >{{it.na}}<span @click="ab(1,it.tg,it.val,it.na)">&times;</span></div>
        <!-- <span>&gt;</span> -->
      </div>
      <label class="menu-drop" v-if="choose.chlist.length!=0" style="margin-bottom: 5px;" @click="ab(2)">清除筛选条件</label>
    </div>
    <div class="right_" style="margin:0 auto;">
        <div class="widget-body fathbox">
        <table class="table table-hover">
            <tbody>
                <tr>
                    <td class="text-align-center">主题</td>
                    <td>
                     <!--   <label v-for="item in words">
                            <input type="radio" :key="item.id" :value="{id:item.id,name:item.name}" name="wid" v-model="formcheck.wdetail" /> {{item.name}} </label> -->

                      <a v-for="it in qlist.words" :key="it.id" @click="changeWid(it.id,$event)" style="margin-right:5px;" :class="it.id ==formcheck.wid?'btn btn-sm btn-sky':'btn btn-sm'" >{{it.name}}</a>

                    </td>
                </tr>
                <tr>
                    <td class="text-align-center">对比时间段</td>
                    <td>
                           <el-col :span="10">
                        期间一：
                       <el-date-picker
                            v-model="value7" @change="dateChange1"
                            format="yyyy/MM/dd" type="daterange" align="right" placeholder="选择日期范围"
                            :picker-options="pickerOptions2">
                            </el-date-picker>
                           </el-col>
                           <el-col :span="10">
                        期间二：
                        <el-date-picker
                            v-model="data2" @change="dateChange2"
                            format="yyyy/MM/dd" type="daterange" align="right"
                            placeholder="选择日期范围"
                            :picker-options="pickerOptions3">
                        </el-date-picker>
                           </el-col>
                    </td>
                </tr>
                <tr>
                    <td class="text-align-center">媒体平台</td>
                    <td>
                      <label> <input type="checkbox"  v-model='checked' @click="checkedAll($event)" value=""/>全部</label>
                        <label v-for="item in qlist.media_type" :key="item.id" >

                            <input type="checkbox" :key="item.id" :value="item.id" name="media_type" v-model="formcheck.media_type" /><span>{{item.name}}</span></label>
                    </td>
                </tr>
                <tr class="qlisttoggle">
                    <td class="text-align-center">维度</td>
                    <td>
                        <input type="radio" value="" name="dimension" v-model="formcheck.dimension" /><span>不限</span>
                        <label v-for="item in qlist.dimension" :key="item.id" >
                            <input type="radio" :key="item.id" :value="item.id" name="dimension" v-model="formcheck.dimension" /><span>{{item.name}}</span></label>
                    </td>
                </tr>
                <tr class="qlisttoggle">
                    <td class="text-align-center">属性</td>
                    <td>
                        <input type="radio" value="" name="side" v-model="formcheck.side" /><span>不限</span>
                        <label v-for="item in qlist.side"  :key="item.id"><input type="radio" :key="item.id" :value="item.id" name="side" v-model="formcheck.side" /><span>{{item.name}}</span></label>
                    </td>
                </tr>
                <tr class="qlisttoggle">
                    <td class="text-align-center">关键词筛选</td>
                    <td>
                        <el-col :span="10">
                            <el-input placeholder="请输入搜索关键词" v-model="formcheck.search_txt"></el-input>
                        </el-col>
                        <el-col :span="10">
                            <el-input placeholder="请输入作者关键词" v-model="formcheck.author"></el-input>
                        </el-col>
                    </td>
                </tr>
                <tr class="qlisttoggle">
                    <td class="text-align-center">媒体属性</td>
                    <td>
                        <input type="radio" value="" name="property_type" v-model="formcheck.property_type" /><span>不限</span>
                        <label v-for="item in qlist.property_type" :key="item.id">
                            <input type="radio" :key="item.id" :value="item.id" name="property_type" v-model="formcheck.property_type" /><span>{{item.name}}</span></label>
                    </td>
                </tr>

            </tbody>
            <tfoot>
              <!-- <tr><td colspan="2"><i :class="this.tbmore==false?'ifa ifa-table-more-g ifacenter':'ifa ifa-table-less-g ifacenter'"></i></td></tr> -->
              <tr><td colspan="2" style="padding:10px 0;">
                <div class="mydiv">
                <span  class=" myspan"  @click="tablemore">{{ tbmore==false?'更多选项(属性、关键词、媒体属性)': '收起' }}
                  <i :class="this.tbmore==false?'xftifa ifa-table-more-g':'xftifa ifa-table-less-g'"></i></span>
                </div>
              </td></tr>
            </tfoot>
        </table>
        </div>
        <!--   v-loading.fullscreen.lock="fullscreenLoading"  -->
        <input class="btn btn-sky" type="button" @click="searchform" style="width:100%" value="查询">
        <div class="father" style = "min-height:400px" v-loading="myload">

           <div class="table-responsive" style="width:50%" v-for="(item,index1) in rangetable"  :key="item.id">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <td colspan="3">
                                <h5>期间{{index1==0?"一":"二"}}
                                    <span>{{index1==0?date_range1:date_range2}}</span>
                                </h5>
                            </td>
                        </tr>
                        <tr>
                            <td class="text-center">序号</td>
                            <td class="text-center">热词 </td>
                            <td>指数 </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(i,index) in item" @mouseover="mover(i,$event)" @mouseout="mout(i,$event)"  :key="i.id">
                            <td class="text-center">{{index+1}}</td>
                            <td class="text-center myarrow">{{i.key}}
                            <span :class='i.sort? i.sort>0?"ifa ifa-arrow-up-g":"ifa ifa-arrow-down-r":""'></span> {{i.sort}}


                            </td>
                            <td style="position:relative;">
                                {{i.count}}
                                <i @click="itemdel(i)" class="ifa ifa-del-g xftdel" title=" 点我删除 "></i>
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
// ↑<i class='ifa ifa-arrow-up-g'></i>
// require {'NProgress'} from 'NProgress';
let np=require("NProgress");
import { getCookie } from "../../static/js/globle.js";
export default {
  data() {
    return {
      checked:'',
      myload:false,
      tbmore: false,
      fullscreenLoading: false,
      isActive: false,
      date_range1: "",
      date_range2: "",
      // checkedCities1: ['上海', '北京'],
      // cities: cityOptions,
      rangetable2: [],
      rangetable1: [],
      rangetable: [],
      formcheck: {
        // wdetail: '',
        wid: "",
        filter_name: "",
        dimension: "",
        media_type: [],
        region_id: [],
        side: "",
        search_type: [],
        property_type: "",
        daterange: "",
        author: [],
        search_txt: [],
        token: ""
      },
      qlist:[],
      // 期间一
      pickerOptions2: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ],
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      value6: "",

      // 期间二
      pickerOptions3: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      data2: "",
      value7: "",
      choose:{
        chwid:'',
        chlist:[]
      }
    };
  },
  created() {
    var t = this;
    np.start();
    $.ajax({
      type: "post",
      url: this.dataurl + "/client/api/get_lists",
      data: {
        token: getCookie("user")
      },
      dataType: "json",
      success: function(res) {
        t.qlist = res.data;
        t.formcheck.filter_name = t.qlist.words[0].name;
        t.formcheck.wid = t.qlist.words[0].id;
        t.choose.chwid = t.qlist.words[0].name;
        res.data.media_type.map(function(item,index){t.formcheck.media_type.push(item.id)})
        t.choose.chlist.push({na:'全部媒体',tg:'media_type',val:''})
      },
      error: function(res) {
        t.$message.error(res.msg);
      }
    });
  },
  mounted() {
    var html = '<li><i class="fa fa-home"></i><a href="#/home">Home</a></li>';
    html += '<li>探索</li><li class="active">热词探索</li>';
    $("#Crumbs").html(html);
    $(".qlisttoggle").hide();
    (this.value7 = [
      new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate() - 13),
      new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate() -7)
    ]),(this.data2 = [
         new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate() - 6),
         new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate())
       ]);
    np.done();
    var t =this;
    var k=setInterval(function(){
      t.qlist.length!=0?function(){
        clearInterval(k);
        t.searchform();
      }():''
    },1)
  },
  watch:{
    qlist:function(){
      var t=this;
      this.$nextTick(function(){
        $('table :input').on('click',function(){
          t.choose.chlist=[];var k=0;
          $('table :input').map(function(){
            var it=this;
            this.type=="radio"?function(){
              it.checked?it.value=="-1"?"":it.value!=""?t.choose.chlist.push({na:it.nextSibling.innerText,tg:it.name,val:it.value}):'':''
            }():this.type=="select-one"?this.selectedOptions[0].value!=""?t.choose.chlist.push({na:this.selectedOptions[0].text,tg:"region_type",val:this.selectedOptions[0].value}):'':this.type=="checkbox"?function(){
              if(k>0){
                return;
              }
              if($('input[name=media_type]:checked').length==t.qlist.media_type.length){
                t.choose.chlist.push({na:'全部媒体',tg:'media_type',val:it.value})
                k++;
              }else {
                it.checked?it.value!=""?t.choose.chlist.push({na:it.nextSibling.innerText,tg:it.name,val:it.value}):'':''
              }
            }():''
          })
        })
        $('#region').on('change',function(){
          t.choose.chlist=[];var k=0;
          $('table :input').map(function(){
            var it=this;
            this.type=="radio"?function(){
              it.checked?it.value=="-1"?"":it.value!=""?t.choose.chlist.push({na:it.nextSibling.innerText,tg:it.name,val:it.value}):'':''
            }():this.type=="select-one"?this.selectedOptions[0].value!=""?t.choose.chlist.push({na:this.selectedOptions[0].text,tg:"region_type",val:this.selectedOptions[0].value}):'':this.type=="checkbox"?function(){
              if(k>0){
                return;
              }
              if($('input[name=media_type]:checked').length==t.qlist.media_type.length){
                t.choose.chlist.push({na:'全部媒体',tg:'media_type',val:it.value})
                k++;
              }else {
                it.checked?it.value!=""?t.choose.chlist.push({na:it.nextSibling.innerText,tg:it.name,val:it.value}):'':''
              }
            }():''
          })
        })
      })
    },
    "formcheck.media_type": {
      handler: function(val, oldVal) {
        if (this.formcheck.media_type.length === this.qlist.media_type.length) {
          this.checked = true;
        } else {
          this.checked = false;
        }
      },
      deep: true
    }
  },
  methods: {
     checkedAll(e) {
      var _this = this;
      if (this.checked == false) {// 如果要实现全部不选
        //实现反选
        _this.formcheck.media_type = [];
      } else { //实现全选
        _this.formcheck.media_type = [];
        _this.qlist.media_type.forEach(function(item) {
          _this.formcheck.media_type.push(item.id);
        });
      }
      //  console.log(_this.artsort.batch);
    },
    ab(v,a,b,c){
      if(v==1){
        a=="media_type"?(c=="全部媒体"?this.formcheck.media_type=[]:this.formcheck[a].splice(this.formcheck[a].indexOf(parseInt(b)),1)):this.formcheck[a]=""
        // a!="media_type"?this.formcheck[a]="":this.formcheck[a].splice(this.formcheck[a].indexOf(parseInt(b)),1);
        this.choose.chlist=this.choose.chlist.filter(function(t){return t.na!=c})
      }else if(v==2){
        this.formcheck.dimension=""
        this.formcheck.region_type=""
        this.formcheck.side=""
        this.formcheck.property_type=""
        this.formcheck.media_type=[];
        this.choose.chlist=[];
      }
    },
    tablemore() {
      if (this.tbmore == false) {
        this.s();
        this.tbmore = true;
      } else {
        this.h();
        this.tbmore = false;
      }
    },
    s() {
      $(".fathbox")
        .stop()
        .animate({ height: "390px" });
      $(".myspan")
        .stop()
        .animate({ width: "124px" });
      $(".qlisttoggle")
        .stop()
        .show();
    },
    h() {
      $(".fathbox")
        .stop()
        .animate({ height: "222px" });
      $(".myspan")
        .stop()
        .animate({ width: "400px" });
      $(".qlisttoggle")
        .stop()
        .hide();
    },
    openFullScreen() {
      this.fullscreenLoading = true;
      setTimeout(() => {
        this.fullscreenLoading = false;
      }, 2000);
    },
    openFullScreen2() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      setTimeout(() => {
        loading.close();
      }, 2000);
    },
    changeWid(i, ev) {
      $(ev.target.parentNode)
        .find("a")
        .removeClass("btn-sky");
      $(ev.target).addClass("btn-sky");

      this.formcheck.filter_name = ev.target.innerText;
      this.formcheck.wid = i;
      this.choose.chwid=ev.target.text
    },
    itemdel(item) {
      // /client/explore/delete_hotwords
      var t = this;
      $.ajax({
        type: "post",
        url: this.dataurl + "/client/explore/delete_hotwords",
        data: {
          word: item.key,
          token: getCookie("user")
        },
        dataType: "json",
        success: function(res) {
          if (res.code == 1) {
            t.searchform();
            t.$message({
              type: "success",
              message: "删除成功！"
            });
          } else {
            t.$message.error("删除失败！");
          }

          // console.log(res);
        }
      });
    },
    mover(item, ev) {
      let mytr = ev.target.parentNode;
      // console.log($(mytr))
      $(mytr)
        .find("i")
        .show();
    },
    mout(item, ev) {
      let mytr = ev.target.parentNode;

      $(mytr)
        .find("i")
        .hide();
    },
    dateChange1(val) {
      // console.log(val);
      this.date_range1 = val;
    },
    dateChange2(val) {
      // console.log(val);
      this.date_range2 = val;
    },
    searchform() {
      this.rangetable =[];
      var myparam = this.formcheck,fuckmedia_type;
      if(this.formcheck.media_type.length == this.qlist.media_type.length){

      // myparam.media_type=[];
      fuckmedia_type = [];

      }else {
        fuckmedia_type=this.formcheck.media_type;
      }
      if (this.date_range1 && this.date_range2) {
        this.formcheck.daterange = this.date_range1 + "|" + this.date_range2;
        myparam.daterange =  this.date_range1 + "|" + this.date_range2;
      }
      this.formcheck.token = getCookie("user");
      myparam.token = getCookie("user");
      if (this.formcheck.wid && this.formcheck.daterange) {
        this.myload=true;
        var t = this;
        $.ajax({
          type: "post",
          url: this.dataurl + "/client/explore/hotwords",
          data: {//妈的智障
            wid: t.formcheck.wid,
            filter_name: t.formcheck.filter_name,
            dimension: t.formcheck.dimension,
            media_type: fuckmedia_type,
            region_id: t.formcheck.region_id,
            side: t.formcheck.side,
            search_type: t.formcheck.search_type,
            property_type: t.formcheck.property_type,
            daterange: t.formcheck.daterange,
            author: t.formcheck.author,
            search_txt: t.formcheck.search_txt,
            token:  getCookie("user")
          },
          dataType: "json",
          success: function(res) {
            //  NProgress.done();
            t.myload=false;
            //  t.fullscreenLoading = false;
            debugger
            t.rangetable = res.data;
            if (t.rangetable[0] == false && t.rangetable[1] == false) {
              t.$message.error("暂无数据");
            }
          },
          error: function() {
            t.$message.error("系统繁忙，请稍后。");
            // t.fullscreenLoading = false;
             t.myload=false;
          }
        });
      } else {
        this.$message({
          type: "warning",
          message: "请选择主题和时间段！"
        });
      }
    },
    saveme1(index) {
      this.number1 = index;
    },
    saveid() {
      // console.log("??");
    }
  }
};
</script>
<style scoped>
.ifa.ifa-arrow-up-g,
.ifa-arrow-down-r {
  margin-left: 10px;
  width: 10px;
}
.active {
  background: white;
  color: red;
  border: 1px solid red;
}

.unactive {
  background: white;
  color: black;
  border: none;
}

.xx span.x1 {
  padding: 5px 10px;
  width: 100px;
}

.x2 {
  display: inline-block;
}

.x2 li {
  float: left;
}

.father {
  background-color: white;
  overflow: hidden;
}

ul#box_th > li {
  float: left;
}

.table-responsive {
  float: left;
}

.xftdel {
  display: none;
  position: absolute;
  right: 20px;
  cursor: pointer;
}
#steps-fivepercent-slider .ui-slider-tip {
    visibility: visible;
    opacity: 1;
    top: -30px;
}
</style>
