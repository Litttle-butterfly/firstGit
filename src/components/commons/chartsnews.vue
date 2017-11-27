<template>
     <div class="flex-child">
        <h4>信息趋势</h4>
        <div id="bar"></div>
     </div>
</template>
<script>
export default {
data() {
    return {

    }
},
mounted(){
      var echarts = require('echarts');
      let mychart = echarts.init(document.getElementById('bar'))
      mychart.setOption({
          title: { text: '利用组件的写法' },
          tooltip: {},
          xAxis: {
              data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
          },
          yAxis: {},
          series: [{
              name: '销量',
              type: 'line',
              data: [5, 20, 36, 10, 10, 20]
          }]
        });
}
}
</script>
<style scoped>
h4{
  margin:0;
}
   .flex-parent{
      position: relative;
      display: flex;
      width: 100%;
      flex-flow:row wrap;
    }
    .flex-parent .flex-child{
      flex-grow: 1;
      width: 45%;
      margin: 15px;
      height: 250px;
      background-color: white;
      border:1px solid grey;
    }
    .gridly, .gridly > :not(.dragging) {
      -webkit-transition: all 0.4s ease-in-out;
      -moz-transition: all 0.4s ease-in-out;
      transition: all 0.4s ease-in-out; }
    .gridly .dragging {
      z-index: 800; }

    #bar{
      width:100%;
      height:95%;
    }
</style>