<template>
    <div  class="setContainer">
      <!--<div class="setLeft">
         <div>
             <h3>报告管理</h3>
             <ul class="nav nav-tabs">
                 <li>
                   <router-link :to="{name:'autoR'}">自动报告</router-link>
                 </li>
                 <li>
                   <router-link :to="{name:'article'}">定制报告</router-link>
                 </li>
                 <li>
                   <router-link :to="{name:'reportset'}">报告设置</router-link>
                 </li>
             </ul>
         </div>
     </div>-->
       <router-view></router-view>
    </div>
</template>
<script>
export default { 
    data() {
        return {

        }
    }
}
</script>
<style scoped>
.setContainer{
  display: flex;
}
.setLeft{
  width: 100px;
  flex-grow: 0;
  float:left;
  text-align: center;
  flex-flow: row nowrap;

}
.setLeft ul li{
  border-bottom: 1px solid #fff;
}
.setleft h3{
  border-bottom: 1px solid #000;
}
</style>
