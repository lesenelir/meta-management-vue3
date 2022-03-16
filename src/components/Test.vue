<template>
  <div class="common-layout">
    <el-container style="border: 1px solid #eee">
      <!--侧边栏-->
      <el-aside width="300px">
        <el-menu
          :collapse="isMenuCollapse"
          :default-openeds="['0', '1']"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <!-- 遍历生成父菜单选项 -->
          <template v-for="menu in menus">
            <!-- 有子菜单时，用el-sub-menu-->
            <el-sub-menu v-if="menu.subMenus && menu.subMenus.length" :index="menu.index" :key="menu.index">
              <!-- 父级菜单 -->
              <template #title>
                <el-icon>
                  <component :is="menu.icon"></component>
                </el-icon>
                <span>{{ menu.text }}</span>
              </template>
              <!-- 遍历子菜单，用el-menu-item -->
              <el-menu-item-group>
                <el-menu-item v-for="subMenu in menu.subMenus" :key="subMenu.index" :index="subMenu.index">
                  {{subMenu.text}}
                </el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
            <!-- 没子菜单时，用el-menu-item-->
            <el-menu-item v-else :index="menu.index" :key="menu.index">
              <template #title>
                <el-icon>
                  <component :is="menu.icon"></component>
                </el-icon>
                <span>{{ menu.text }}</span>
              </template>
            </el-menu-item>
          </template>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header>
          <el-button @click="isMenuCollapse = !isMenuCollapse" style="font-size: 24px;padding: 5px 8px;">
<!--            <i :class="isMenuCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'" />-->
            <el-icon><fold /></el-icon>
          </el-button>

          <el-dropdown>
            <el-icon style="margin-right: 5px"><avatar /></el-icon>
            <span>lesenelir</span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item width="100">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

        </el-header>

        <el-main>
          Main
        </el-main>
      </el-container>

    </el-container>
  </div>
</template>

<script>
// import { Setting } from '@element-plus/icons-vue'

import { ref } from 'vue'

export default {
  name: 'Test',
  setup () {
    const menus = [
      {
        text: '服务管理', // 父菜单名字
        icon: 'setting', // 父菜单图标
        subMenus: [{ text: '服务信息' }, { text: '新增' }] // 子菜单列表
      },
      {
        text: '产品管理',
        icon: 'menu',
        subMenus: [{ text: '产品信息' }]
      },
      {
        text: '日志信息',
        icon: 'message'
      }
    ].map((x, i) => {
      return {
        ...x,
        // 子菜单就拼接${父菜单index}-${子菜单index}
        subMenus: (x.subMenus || []).map((y, j) => {
          return { ...y, index: `${i}-${j}` }
        }),
        // 父菜单就把 index 加上好了
        index: `${i}`
      }
    })

    const item = {
      date: '2016-05-02',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles'
    }
    const tableData = ref(Array.from({ length: 20 }).fill(item))
    return {
      item,
      tableData,
      menus
    }
  }
}
</script>

<style scoped>
.el-header {
  color: #333;
  line-height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: right;
  font-size: 12px;
  background-color: #ededed;
}
</style>
