<template>
  <div class="widget flex-child">
    <div class="widget-body">
      <div class="row">
        <div class="col-lg-8 col-sm-8 col-xs-8 col-lg-offset-2 col-sm-offset-2 col-xs-offset-2">
          <div><h4>创建智能观点<span>您一共可以创建10个智能观点，目前可以创建{{themecount}}个！</span></h4>
          <hr/>
          </div>
          <form class="add_category">
              <div class="form-group">
                  <label for="theme_choose">主题选择：</label>
                  <select class="form-control" id="theme_choose"  v-model="nextid" @change="getchoose($event)">
                      <option value="">请选择</option>
                      <option v-for="item in tabledata" :value="item.id">{{item.name}}</option>
                  </select>
              </div>
              <div class="form-group">
                  <label for="view_name">观点名称：</label>
                  <input type="text" class="form-control" id="view_name" v-model="mmd.opname" @blur="blurnext"> </input>
              </div>
              <!-- <div class="form-group">
                  <label for="search_list">搜索条件：</label><span>温馨提示：多个搜索条件请以中文逗号"，"隔开</span>
                  <input type="text" class="form-control" id="search_list" v-model="words" > </input>
              </div> -->
              <a class="btn btn-sky" @click='gorobot'>下一步</a>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {getCookie} from '../../static/js/globle.js';
export default {
    data() {
        return {
          enter:function (url,d,_fn) {
            this.ajaxEnter(url,d,_fn)
          },
            tabledata:[],
            mmd:[{
                opname:'',
            }],
            nextid:'',
            tiaojian:'',
            anywords:[],
            themecount:'',
            words:''
        }
    },
    created(){
      getCookie('user')==""?(this.$router.replace({ name: '/app' })):''
        var t=this;
        this.enter("/admin/words",{params:{}},function(d){
          t.tabledata = d.data.data;
        })
        this.getcount()
    },
    mounted(){
      $('.loading-container').addClass('loading-inactive');
      var html='<li><i class="fa fa-home"></i><a href="#/home">Home</a></li>';
      html+='<li>探索</li><li><a href="#/InitRobot">智能观点</a></li><li class="active">新增智能观点</li>';
      $('#Crumbs').html(html)
    },
    methods:{
        blurnext(){
          var t=this;
          t.enter("/client/api/word_analysis",{params:{words:this.mmd.opname,ntop:2}},function(d){
            var hts='';
            t.anywords= d.data;
            t.anywords.map(function(it){
                hts+=(it.word+'，')
            })
            t.words=hts;
          })
        },
        getchoose(e){
          this.mmd.opname=this.nextid==""?"":$('#theme_choose').find("option:selected").text()
        },
        gorobot(){
            var t=this;
            t.enter("/admin/opinion/save",{params:{name:this.mmd.opname,wid:this.nextid,condition:this.words}},function(d){
              var nid = d.data;
              if(d.data){
                  t.$router.push({path: '/setup/robotlist', query:{id:nid,name:t.mmd.opname}})
              }else{
                  alert(d.msg)
              }
            })

        },
        getcount(){
           var t=this;
          t.enter("/admin/opinion/get_total",{params:{}},function(d){
            console.log(d)
            t.themecount = 10 - d.data;
          })
        }
    }
}
</script>
<style scoped >
.flex-child{
  flex-grow: 1;
}
</style>
