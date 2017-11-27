<template>
    <div class="setContainer">
       <!--<div class="">
            <h5>信息设置</h5>
            <ul class="nav nav-tabs">
                <li>
                    <router-link :to="{name:'exporerobot'}">智能观点</router-link>
                </li>--> 
                <!-- <li>
                    <router-link :to="{name:'exploreinit'}">用户画像</router-link>
                </li> -->
               <!-- <li>
                    <router-link :to="{name:'hotexplore'}">热词探索</router-link>
                </li>
            </ul>
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
    display:flex;
    /* background-color:white; */

}

</style>
