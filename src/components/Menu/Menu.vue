<template>
  <!-- default-active 用来设置菜单的选中样式（根据当前路由来选中） -->
  <el-menu
    :collapse="isMenuCollapse"
    :default-openeds="['0', '1']"
    :default-active="activeIndex"
    class="el-menu-vertical-demo"
    background-color="#778899"
    text-color="#fff"
    active-text-color="#8FBC8F"
  >
    <!-- 遍历生成父菜单选项 -->
    <template v-for="menu in menus">
      <!-- 有子菜单时，用el-sub-menu-->
      <el-sub-menu v-if="menu.subMenus && menu.subMenus.length" :index="menu.index" :key="menu.index">
        <!-- 父级菜单 -->
        <template #title>
          <el-icon>
            <!--Todo Bug-->
            <!-- <component :is="menu.icon"></component> -->
          </el-icon>
          <span>{{ menu.text }}</span>
        </template>
        <!-- 遍历子菜单，用el-menu-item -->
        <el-menu-item-group>
          <router-link tag="div" v-for="subMenu in menu.subMenus" :key="subMenu.index" :to="{name: subMenu.routerName}">
            <el-menu-item :index="subMenu.index">{{ subMenu.text }}</el-menu-item>
          </router-link>
        </el-menu-item-group>
      </el-sub-menu>
      <!-- 只有单个父菜单，用el-menu-item-->
      <router-link v-else tag="div" :index="menu.index" :key="menu.index" :to="{name: menu.routerName}">
        <el-menu-item>
          <template #title>
            <el-icon>
              <component :is="menu.icon"></component>
            </el-icon>
            <span>{{ menu.text }}</span>
          </template>
        </el-menu-item>
      </router-link>
    </template>
  </el-menu>

</template>

<script>
import { ref } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'

export default {
  name: 'Menu',
  props: {
    isMenuCollapse: Boolean
  },
  setup () {
    const menus = ref([{
      text: '服务管理', // 父菜单名字
      icon: 'setting', // 父菜单图标
      subMenus: [{ text: '服务信息', routerName: 'Service' }] // 子菜单列表
    }, {
      text: '产品管理',
      icon: 'menu',
      subMenus: [{ text: '产品信息', routerName: 'ProductList' }, { text: '新增', routerName: 'ProductAdd' }]
    }, {
      text: '日志信息',
      icon: 'message',
      routerName: '' // 日志信息这里为空，则不会进行跳转
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
    }))

    // 菜单选中下标
    const activeIndex = ref('')

    // 由路由状态来设置el-menu的default-active属性
    onBeforeRouteUpdate((to) => {
      let tempIndex
      menus.value.forEach(x => {
        if (x.routerName === to.name) {
          tempIndex = x.index
        } else {
          const subMenuItem = x.subMenus.find(y => y.routerName === to.name)
          if (subMenuItem) {
            tempIndex = subMenuItem.index
          }
        }
      })
      // 将activeIndex 设置为对应菜单的index
      if (tempIndex) {
        activeIndex.value = tempIndex
      }
    })

    return {
      menus,
      activeIndex
    }
  }
}
</script>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 300px;
}

a {
  text-decoration: none;
}

</style>
