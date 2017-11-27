<template>
  <div>
    <div class="xftcrumb widget-body">
      <label>全部结果<span>&gt;</span></label>
      <label>{{choose.chwid}}<span>&gt;</span></label>
      <div style="display:inline-block" v-for="it in choose.chlist">
        <div class="menu-drop" >{{it.na}}<span @click="ab(1,it.tg,it.val,it.na)">&times;</span></div>
        <!-- <span>&gt;</span> -->
      </div>
      <label class="menu-drop" v-if="choose.chlist.length!=0" style="margin-bottom:5px;" @click="ab(2)">清除筛选条件</label>
    </div>
    <div class="widget-body fathbox" >
      <table class="table table-striped table-hover">
          <tbody>
              <tr>
                  <td class="text-align-center">主题</td>
                  <td class="buttons-preview">
                                          <a v-for="it in qlist.words" @click="changeWid(it.id,$event)"
                       :class="it.id ==sh.wid?'btn btn-sm btn-sky':'btn btn-sm'">{{it.name}}</a>  </td>
              </tr>
              <tr>
                  <td class="text-align-center">监测时间</td>
                  <td>
                    <label><input type="radio" name="stime" :value="1" v-model="sh.stime" /><span>今天</span></label>
                    <label><input type="radio" name="stime" :value="2" v-model="sh.stime" /><span>3天</span></label>
                    <label><input type="radio" name="stime" :value="6" v-model="sh.stime" /><span>7天</span></label>
                    <label><input type="radio" name="stime" :value="29" v-model="sh.stime" /><span>30天</span></label>
                    <label><input type="radio" :value="-1" v-model="sh.stime" /><span>自定义</span></label>
                    <div class="custom" v-show="sh.stime==-1">
                      <el-date-picker
                        v-model="mtime"
                        type="daterange"
                        format="yyyy/MM/dd"
                        @change="changeDate"
                        align="right"
                        placeholder="选择日期范围"
                        :picker-options="pickerOptions2">
                      </el-date-picker>
                    </div>
                  </td>
              </tr>
              <tr>
                  <td class="text-align-center">媒体平台</td>
                  <td>
                      <label> <input type="checkbox"  v-model='checked' @click="checkedAll($event)" value=""/>全部</label>
                    <label v-for="it in qlist.media_type"><input type="checkbox" :value="it.id" name="media_type" v-model="sh.media_type"  /><span>{{it.name}}</span></label>
                  </td>
              </tr>
              <tr class="qlisttoggle">
                  <td class="text-align-center">维度</td>
                  <td>
                    <!-- <label><input type="radio" value="" name="dimension" v-model="sh.dimension"  /><span>不限</span></label> -->
                    <label v-for="it in qlist.dimension"><input type="checkbox" :value="it.id" name="dimension" v-model="sh.dimension"  /><span>{{it.name}}</span></label>
                  </td>
              </tr>
              <tr class="qlisttoggle">
                  <td class="text-align-center">地域</td>
                  <td>
                    <select id="region" v-model="sh.region_type">
                      <option value="">全国</option>
                      <option v-for="itt in qlist.region_type" :value="itt.id" >{{itt.name}}</option>
                    </select>
                  </td>
              </tr>
              <tr class="qlisttoggle">
                  <td class="text-align-center">属性</td>
                  <td>
                    <label><input type="radio" value="" name="side" v-model="sh.side"  /><span>不限</span></label>
                    <label v-for="it in qlist.side"><input type="radio" :value="it.id" name="side" v-model="sh.side"  /><span>{{it.name}}</span></label>
                  </td>
              </tr>
              <tr class="qlisttoggle">
                  <td class="text-align-center">媒体属性</td>
                  <td>
                    <label><input type="radio" value="" name="mediaPro" v-model="sh.property_type"  />不限</label>
                    <label v-for="it in qlist.property_type"><input type="radio" :value="it.id" name="mediaPro"  v-model="sh.property_type" /><span>{{it.name}}</span></label>
                  </td>
              </tr>
          </tbody>
          <tfoot>
            <!-- <tr><td colspan="2"><i :class="this.tbmore==false?'ifa ifa-table-more-g ifacenter':'ifa ifa-table-less-g ifacenter'"></i></td></tr> -->
            <tr><td colspan="2" style="padding:10px 0;">
              <div class="mydiv">
              <span  class=" myspan"  @click="tablemore">{{ tbmore==false?'更多选项(地域、属性、媒体属性)': '收起' }}
                <i :class="this.tbmore==false?'xftifa ifa-table-more-g':'xftifa ifa-table-less-g'"></i></span>
              </div>
            </td></tr>
          </tfoot>
      </table>
    </div>
    <div class="widget-body">
      <div class="childbox">
        <p class="text-right">
          <a class="btn xftbluebtn" @click="getResult">开始分析</a>
        </p>
        <div>
          <div class="row">
              <div class="col-xs-12 col-md-12">
                  <div class="well with-header">
                      <div class="header bordered-sky">
                            <div class="ptitle xftdei "><i class="ifa ifa-qushi-b"></i><label class="myh4">趋势图</label><span></span>

                          <label class="pstitle"></label>
                        </div>
                      </div>
                      <div id="line1" class="chart-view" v-loading="loading1"></div>
                  </div>
              </div>
          </div>
          <div class="row">
              <div class="col-xs-12 col-md-12">
                  <div class="well with-header">
                      <div class="header bordered-sky">
                            <div class="ptitle xftdei "><i class="ifa ifa-emo-o"></i><label class="myh4">情感分析</label><span></span>
                          <label class="pstitle"></label>
                        </div>
                      </div>
                      <div id="bar1" class="chart-view" v-loading="loading2"></div>
                  </div>
              </div>
          </div>
          <div class="row">
              <div class="col-xs-12 col-md-12">
                  <div class="well with-header">
                      <div class="header bordered-sky">
                            <div class="ptitle xftdei "><i class="ifa ifa-media-b"></i><label class="myh4">媒体分布</label><span></span>
                          <!-- <label class="pstitle"></label> -->
                        </div>
                      </div>
                      <div class="row">
                        <div v-for="(it,idx) in mediapie" :class="mediapie.length==1?'col-sm-12':mediapie.length==2?'col-sm-6':'col-sm-4'">
                          <div :id="'pie'+idx" class="chart-view-no" v-loading="loading4"></div>
                          <p class="text-align-center">{{it}}</p>
                        </div>
                      </div>
                  </div>
              </div>
          </div>
          <div class="row">
              <div class="col-xs-12 col-md-12">
                  <div class="well with-header">
                      <div class="header bordered-sky">
                        <div class="ptitle xftdei ">
                          <i class="ifa ifa-emo"></i><label class="myh4">情绪维度详细数据</label><span></span>
                        </div>
                      </div>
                      <div id="table1" class="chart-view" v-loading="loading3"></div>
                  </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {getCookie} from '../../static/js/globle.js';
import {delCookie} from '../../static/js/globle.js';
import {Redate} from '../../static/js/globle.js';
let np=require("NProgress");
//维度
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
        isdiv:false,
        loading1:false,
        loading2:false,
        loading3:false,
        loading4:false,
        tbmore:false,
        ct:{
          words:('input[name=words]:checked')
        },
        qlist:[],
        mtime: [new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate() - 6),
          new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate())
        ],
        sh:{
          gd_type:'',
          param:'',
          wid:'',
          stime:'-1',
          etime:'',
          dimension:[],
          date_range:Redate(new Date(), -7) + "-" + new Date().Format('yyyy/MM/dd'),
          media_type:[],
          region_type:'',
          side:'',
          property_type:'',
        },
        mediapie:[],
        pickerOptions2:{
          disabledDate(time){
              return time.getTime() > Date.now()
          },
        },
        choose:{
          chwid:'',
          chlist:[]
        }
      }
    },
    created(){
      getCookie('user')==""?(this.$router.replace({ name: '/app' })):''
      np.start();
      this.sh.etime=new Date(this.mtime[0]).Format('yyyy/MM/dd')+'-'+new Date(this.mtime[1]).Format('yyyy/MM/dd')
      var url='/client/api/get_lists',t=this;
      this.enter(url,{params:{}},function(d){
        t.qlist=d.data;
        t.sh.wid=d.data.words[0].id;
        d.data.media_type.map(function(item,index){t.sh.media_type.push(item.id)})
        // t.sh.media_type=[d.data.media_type[0].id];//,d.data.media_type[1].id,d.data.media_type[2].id
        // t.sh.dimension.push(it.id)=[d.data.dimension[0].id,d.data.dimension[1].id]
        d.data.dimension.map(function(it){t.sh.dimension.push(it.id)})
        t.choose.chwid = t.qlist.words[0].name;
        t.choose.chlist.push({na:'全部媒体',tg:'media_type',val:''})
        // t.qlist.media_type.map(function(it){t.choose.chlist.push({val:it.id,na:it.name,tg:'media_type'})})
      })
    },
    mounted(){
      var t=this;
      var k=setInterval(function(){
        t.qlist.length!=0?function(){
          clearInterval(k);
          if(t.qlist.dimension!=0){
            t.getResult();
          }else {
            t.openMsg('维度不能为空，请到设置中添加维度',"warning")
          }
        }():''
      },50)
      var html='<li><i class="fa fa-home"></i><a href="#/home">Home</a></li>';
      html+='<li>分析</li><li id class="active">维度分析</li>';
      $('#Crumbs').html(html)
      $('.qlisttoggle').hide();
      np.done();
    },
    watch:{
      "sh.media_type": {
        handler: function(val, oldVal) {
          if (this.sh.media_type.length === this.qlist.media_type.length) {
            this.checked = true;
          } else {
            this.checked = false;
          }
        },
        deep: true
      }  ,
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
    },
    methods:{
       checkedAll(e) {
        var _this = this;

        if (this.checked == false) {// 如果要实现全部不选
          //实现反选
          _this.sh.media_type = [];
        } else { //实现全选

          _this.sh.media_type = [];
          _this.qlist.media_type.forEach(function(item) {
            _this.sh.media_type.push(item.id);
          });
        }
        //  console.log(_this.artsort.batch);
      },
      ab(v,a,b,c){
        if(v==1){
          a=="media_type"?(c=="全部媒体"?this.sh.media_type=[]:this.sh[a].splice(this.sh[a].indexOf(parseInt(b)),1)):
          a!="stime"?this.sh[a]="":(this.sh[a]="-1",this.sh.etime=new Date(this.sh.stime[0]).Format('yyyy/MM/dd')+'-'+new Date(this.sh.stime[1]).Format('yyyy/MM/dd'));
          this.choose.chlist=this.choose.chlist.filter(function(t){return t.na!=c})
        }else if(v==2){
          this.sh.stime="-1"
          this.sh.dimension=""
          this.sh.region_type=""
          this.sh.side=""
          this.sh.property_type=""
          this.sh.media_type=[this.qlist.media_type[0].id]
          this.choose.chlist=[{val:this.qlist.media_type[0].id,na:this.qlist.media_type[0].name,tg:'media_type'}]
        }
      },
      changeWid(i, ev) {
        $(ev.target.parentNode).find("a").removeClass("btn-sky");
        $(ev.target).addClass("btn-sky");
        this.sh.wid = i;
        this.choose.chwid=ev.target.text
      },
      tablemore(){
          if(this.tbmore == false){
            this.s()
            this.tbmore = true
          }else{
            this.h();
            this.tbmore = false
          }
      },
    s() {
      $(".fathbox").stop().animate({ height: "360px" });
      $(".qlisttoggle").stop().show();
            $(".myspan")
        .stop()
        .animate({ width: "124px" });
    },
    h() {
      $(".fathbox").stop().animate({ height: "202px" });
      $(".qlisttoggle").stop().hide();
            $(".myspan")
        .stop()
        .animate({ width: "400px" });
    },
    changeDate(val){
      this.sh.etime=val;
    },
    getResult(){
      var arr=[]
      this.mediapie=[];
      $('input[name="dimension"]:checked').map(function(it){
        arr.push(this.nextSibling.innerText)
      })
      this.mediapie=arr;
      $('.pstitle').html('维度：'+arr.join('、'));
      this.isdiv=true;
      this.sh.stime!=-1?this.sh.date_range=this.sh.stime:this.sh.date_range=this.sh.etime;
      this.searchform();
      this.searchform1();
      this.searchform2();
    },
    searchform(){
      var vt=this;
      this.loading1=true;
      var url='/client/analysis';
      this.sh.gd_type='dimension_trend',this.sh.param='dimension';
      var data={params:{
        gd_type:this.sh.gd_type,
        param:this.sh.param,
        wid:this.sh.wid,
        stime:this.sh.stime,
        etime:this.sh.etime,
        date_range:this.sh.date_range,
        dimension:this.sh.dimension,
        media_type:this.sh.media_type.length==this.qlist.media_type.length?"":this.sh.media_type,
        region_type:this.sh.region_type,
        side:this.sh.side,
        property_type:this.sh.property_type,
      }};
      vt.enter(url,data,function(d){
        vt.drowLineOrBarView(d.data,'#line1',"line")
        vt.loading1 = false;
      })
    },
    searchform1(){
      var vt=this;
      this.loading2=true;
      this.loading3=true;
      var url='/client/analysis';
      this.sh.gd_type='dimension_side',this.sh.param='side';
      var data={params:{
        gd_type:this.sh.gd_type,
        param:this.sh.param,
        wid:this.sh.wid,
        stime:this.sh.stime,
        etime:this.sh.etime,
        date_range:this.sh.date_range,
        dimension:this.sh.dimension,
        media_type:this.sh.media_type.length==this.qlist.media_type.length?"":this.sh.media_type,
        region_type:this.sh.region_type,
        side:this.sh.side,
        property_type:this.sh.property_type,
      }};
      vt.enter(url,data,function(d){
        vt.drowBarView(d.data,'#bar1','x')
        vt.drowtableView(d.data,"#table1")
        vt.loading2 = false;
        vt.loading3 = false;
      })
    },
    searchform2(){
      var vt=this;
      this.loading4=true;
      var url='/client/analysis';
      this.sh.gd_type='dimension_region',this.sh.param='media_type';
      var data={params:{
        gd_type:this.sh.gd_type,
        param:this.sh.param,
        wid:this.sh.wid,
        stime:this.sh.stime,
        etime:this.sh.etime,
        date_range:this.sh.date_range,
        dimension:this.sh.dimension,
        media_type:this.sh.media_type.length==this.qlist.media_type.length?"":this.sh.media_type,
        region_type:this.sh.region_type,
        side:this.sh.side,
        property_type:this.sh.property_type,
      }};
      vt.enter(url,data,function(d){
        var k=0;
        for(var it in d.data){
          $("#pie"+k).replaceWith('<div id="'+"pie"+k+'" class="chart-view-no" data-v-1f546146></div>')
          vt.drowRingPieView(d.data[it],"#pie"+k,it)
          k++;
        }
        this.loading4=false;
      })
    },
    drowLineOrBarView (d,ele,ty) {
      var option={
        seriesTypes:[],
        title:'',
        legend:[],
        axisDirec:'x',
        imgname:this.choose.chwid+'趋势图',
        axis:d.title,
        seriesData:[]
      };
        var obj=d.total;
        for(var na in d.total){
          option.legend.push(na);
          option.seriesTypes.push(ty);
          option.seriesData.push({name:na,value:obj[na]})
        }
        $(ele).echartsSetDataForLineBar(option);
    },
    drowBarView (d,ele,direc) {
      var option={
        seriesTypes:[],
        title:'',
        legend:d.title,
        axisDirec:direc,
        axis:[],
        imgname:this.choose.chwid+'情感分析图',
        stack:'sum',
        seriesData:[]
      };
      for(var na in d.total){
        option.axis.push(na);
      }
      var ld=option.legend;
      for(var i=0;i<ld.length;i++){
        option.seriesTypes.push('bar');
        option.seriesData.push({name:ld[i],value:[]});
        for(var na in d.total){
          option.seriesData[i].value.push(d.total[na][i]);
        }
      }
      $(ele).echartsSetDataForLineBar(option);
    },
    drowRingPieView:function (d,ele,title) {
        var option={
          title:title,
          seriesRadius:["50%","70%"],
          legend:d.title,
          seriesname:'媒体分布',
          imgname:title+'媒体分布',
          seriesname:title+'媒体分布',
          seriesData:[]
        };
        d.title.map(function(it,idx){
          option.seriesData.push({name:it,value:d.total[idx]})
        })
        $(ele).echartsSetDataForPie(option);
    },
    drowtableView (dt,ele) {
      var a=[];
      for(var it in dt.total){
        a.push(it)
      }
      var html='<table class="table table-hover table-striped table-condensed table-fan">';
      html+='<thead><tr><td>主题/维度</td>'+a.map(function(it){return '<td>'+it+'</td>'})+'</tr></thead>';
      html+='<tbody>'
      dt.title.map(function(it,idx){
        html+='<tr><td>'+it+'</td>'
        for(var it in dt.total){
          var is=dt.total[it];
          html+='<td>'+is[idx]+'</td>'
        }
        html+='</tr>'
      })
      html+='</tbody></table>';
      html=html.replace(/,/g,"");
      $(ele).html(html);
    },
  }
}
</script>
<style scoped>
input[type=checkbox],input[type=radio] {
	opacity: 1;
	position: relative;
	left: 0;
	z-index: 12;
	width: 15px;
	height: 15px;
	cursor: pointer;
}
.chart-view{
  width: 100%;
  height: 250px;
  min-width: 900px;
}
.chart-view-no{
  width: 100%;
  height: 280px;
}
.chart-helf-view{
  width: 50%;
  height: 150px;
  float: left;
}
table{
  width: 100%;
  border-collapse: collapse;
}
</style>
