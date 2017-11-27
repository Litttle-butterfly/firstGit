<template>
        <div class="setContainer">
          <!--   <div class="setLeft">
                <div>
                    <h5>信息设置</h5>
                    <ul class=" nav-tabsxft">
                        <li class="themeSet">
                         <router-link :to="{name:'themeSet'}">主题设置</router-link>
                        </li>
                        <li class="dimensionSet">
                        <router-link :to="{name:'dimensionSet'}">维度定义</router-link>

                        </li>
                        <li class="robotSet">
                        <router-link :to="{name:'robotSet'}">智能观点</router-link>
                        </li>
                    </ul>
                </div>
                <div>
                    <h5>账户管理</h5>
                    <ul>
                        <li>
                         <router-link :to="{name:'account'}">账户管理</router-link></li></li>
                        <li>
                            <router-link :to="{name:'childaccount'}">子账户管理</router-link></li>
                        <li>
                           <router-link :to="{name:'message'}">消息通知</router-link></li>
                        <li>
                          <router-link :to="{name:'collection'}">我的收藏</router-link></li>
                        <li>
                        <router-link :to="{name:'stars'}">关注媒体</router-link></li>
                         <li>
                        <router-link :to="{name:'comeout'}">我的导出</router-link></li>
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
    },
    methods:{



    }
}
</script>
<style scoped>
.setContainer{
    display:flex;
    background-color:transparent;
     flex-direction:row;
}

</style>
