<template>
  <el-container style="border: 1px solid #eee; min-height: 100%">
    <!--侧边栏-->
    <el-aside style="width: auto">
      <Menu :isMenuCollapse="isMenuCollapse"></Menu>
    </el-aside>

    <!--头部容器-->
    <el-container>
      <el-header>
        <el-button @click="isMenuCollapse = !isMenuCollapse" style="font-size: 24px;padding: 5px 8px;">
          <!--根据isMenuCollapse动态组件生成icon-->
          <el-icon>
            <component :is="isMenuCollapse ? 'arrow-right' : 'arrow-left' "></component>
          </el-icon>
        </el-button>

        <el-dropdown>
          <el-icon style="margin-right: 5px">
            <avatar/>
          </el-icon>
          <span>Welcome back {{username}}</span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item width="100" @click="logout()">Sign Out</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>

      <!--子路由界面-->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getGlobalData, clearGlobalData } from '@/utils/globalData'
import Menu from '@/components/Menu/Menu'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Home',
  components: {
    Menu
  },
  setup () {
    const router = useRouter()
    const isMenuCollapse = ref(false) // 是否收起左侧菜单

    // =================================
    // 退出
    const username = ref(getGlobalData('username') || 'admin')
    const logout = () => {
      clearGlobalData('username')
      // 删除 token
      sessionStorage.removeItem('token')
      // router.push({ name: 'Login' })
      router.push('/')
    }

    return {
      isMenuCollapse,
      logout,
      username
    }
  }
}
</script>

<style scoped>
body {
  margin: 0;
}

.el-header {
  line-height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: right;
  font-size: 12px;
  background-color: #DCDCDC;
}

.el-aside {
  background-color: #778899;
  width: auto;
  min-height: 1000px;
}
</style>
