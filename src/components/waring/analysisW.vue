<template>
    <div class="childbox">
      <div class="row">
          <div class="col-xs-12 col-md-12">
              <div class="well with-header">
                  <div class="header bordered-sky">
                    <div class="ptitle">
                      <label class="myh4"><i class="ifa ifa-qushi-b"></i>预警走势图</label>
                      <a class="btn btn-default btn-xs" @click="getResult(29)">30天内</a>
                      <a class="btn btn-default btn-xs cur" @click="getResult(6)">7天内</a>
                      <a class="btn btn-default btn-xs" @click="getResult(1)">今天</a>
                    </div>
                  </div>
                  <div id="wline" class="line-view"></div>
              </div>
          </div>
      </div>
      <div class="row">
          <div class="col-xs-6 col-md-6">
              <div class="well with-header">
                  <div class="header bordered-sky">
                    <div class="ptitle">
                      <label class="myh4"><i class="ifa ifa-datatotal"></i>预警排行</label>
                    </div>
                  </div>
                  <div id='ranklist' class="line-view"></div>
              </div>
          </div>
          <div class="col-xs-6 col-md-6">
              <div class="well with-header">
                  <div class="header bordered-sky">
                    <div class="ptitle">
                      <label class="myh4"><i class="ifa ifa-voice-b"></i>预警级别分布</label>
                    </div>
                  </div>
                  <div id='fenbuw' class="line-view"></div>
              </div>
          </div>
      </div>
      <div class="row">
          <div class="col-xs-12 col-md-12">
              <div class="well with-header">
                  <div class="header bordered-sky">
                    <div class="ptitle">
                      <label>预警详细信息</label>
                    </div>
                  </div>
                  <table class="table table-hover table-striped table-bordered table-condensed">
                    <thead>
                      <tr>
                        <td>日期</td><td>常规预警</td><td>重要预警</td><td>非常重要预警</td><td>总计</td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="it in wdetail " :key="it.date">
                        <td>{{it.date}}</td><td>{{it.simple}}</td><td>{{it.imp}}</td><td>{{it.veryimp}}</td><td>{{it.total}}</td>
                      </tr>
                    </tbody>
                  </table>
              </div>
          </div>
      </div>
    </div>
</template>
<script>
import {getCookie} from '../../static/js/globle.js';
import {delCookie} from '../../static/js/globle.js';
let np=require("NProgress");
export default {
    data() {
        return {
          enter:function (url,d,_fn) {
            this.ajaxEnter(url,d,_fn)
          },
          wdetail:[]
        }
    },created(){
      getCookie('user')==""?(this.$router.replace({ name: '/app' })):''
      np.start()
    },
    mounted(){
      let t=this;
      var html='<li><i class="fa fa-home"></i><a href="#/home">Home</a></li>';
      html+='<li>预警</li><li class="active">预警分析</li>';
      $('#Crumbs').html(html)

      $('.ptitle a').on('click',function(){
        $('.ptitle a').removeClass('cur'),
        $(this).addClass('cur');
      })
      var url='/client/warning/get_gddata/';
      var d={params:{
        date_range:6,
        gd_type:'level_total'
      }};
      t.enter(url,d,function(d){
        t.setlineandbar(d)
      })
      d={params:{
        date_range:6,
        gd_type:'level_pancake'
      }};
      t.enter(url,d,function(d){
        t.setpie(d)
      })
      d={params:{
        date_range:6,
        gd_type:'media_total'
      }};
      t.enter(url,d,function(d){
        $('.loading-container').addClass('loading-inactive');
        t.setrank(d)
      })
      np.done()
    },
    methods:{
      getResult(dr){
        var t=this;
        var url='/client/warning/get_gddata/';
        var d={params:{
          date_range:dr,
          gd_type:'level_total'
        }};
        t.enter(url,d,function(d){
          t.setlineandbar(d)
        })
        d={params:{
          date_range:dr,
          gd_type:'media_total'
        }};
        t.enter(url,d,function(d){
          t.setrank(d)
        })
        d={params:{
          date_range:dr,
          gd_type:'level_pancake'
        }};
        t.enter(url,d,function(d){
          t.setpie(d)
        })
      },
      setlineandbar(d){
        var t=this;
        var option={
          seriesTypes:['line','line','line'],
          title:'',
          legend:['常规预警','重要预警','非常重要预警'],
          //dataZoom:[{type: 'slider',show: true,xAxisIndex: [0],start: 1,end: 15}],
          axisDirec:'x',
          imgname:'预警走势图',
          axis:d.data.title,
          seriesData:[{name:'常规预警',value:d.data.total['常规预警']},
          {name:'重要预警',value:d.data.total['重要预警']},
          {name:'非常重要预警',value:d.data.total['非常重要预警']}]
        };
        $('#wline').echartsSetDataForLineBar(option);
          var tit=d.data.title,val1=d.data.total['常规预警'],val2=d.data.total['重要预警'],val3=d.data.total['非常重要预警'];
          var arr=[];
          tit.map(function(item,i){
            var total=val1[i]+val2[i]+val3[i];
            arr.push({date:item,simple:val1[i],imp:val2[i],veryimp:val3[i],total:total});
          })
          // 按时间排序
          t.wdetail=arr.sort(function(a,b){return b.date - a.date});
      },
      setpie(d){
        var option={
          title:'',
          seriesRadius:'55%',
          legend:['常规预警','重要预警','非常重要预警'],
          imgname:'预警级别分布图',
          seriesname:'预警级别分布',
          seriesData:[]
        };
        d=d.data;
        d.title.map(function(it,idx){
          option.seriesData.push({name:it,value:d.total[idx]})
        })
        $('#fenbuw').echartsSetDataForPie(option);
      },
      setrank(d){
        d = d.data.sort(function(a, b) {
          return a.total - b.total;
        });
        var a = [],
          b = [];
        d.map(function(it) {
          a.push(it.title);
          b.push(it.total);
        });
        var option={
          seriesTypes:['bar'],
          title:'',
          legend:'排行',
          axisDirec:'y',
          imgname:'预警排行图',
          grid:{
            top:20,
            bottom:20,
          },
          axis:a,
          seriesData:[{name:'预警声量统计',value:b}]
        };
        $('#ranklist').echartsSetDataForLineBar(option);
      }
    },
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
  margin-bottom: 0;
}
.ptitle a{
  margin: 0 2px;
  float: right;
}
.ptitle a.cur{
  border: 1px solid #199ed8;
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
  height: 250px;
  float: left;
}
.wpie{
  width: 44%;
  height: 250px;
  float: right;
}
.wdetail{
  clear: both;
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
</style>
