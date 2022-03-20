<template>
  <div class="common-layout">
    <el-container style="border: 1px solid #eee">
      <!--侧边栏-->
      <el-aside style="background-color: #545c64;width: auto">
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
                  {{ subMenu.text }}
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
            <!--根据isMenuCollapse动态组件生成icon-->
            <el-icon>
              <component :is="isMenuCollapse ? 'arrow-right' : 'arrow-left' "></component>
            </el-icon>
          </el-button>

          <el-dropdown>
            <el-icon style="margin-right: 5px">
              <avatar/>
            </el-icon>
            <span>Welcome back lesenelir</span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item width="100">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-header>

        <el-main>
          <!--简单布局-->
          <el-row>
            <el-col :span="24">
              <!-- 删除过程中，不允许其他操作 -->
              <el-button v-if="!showDeleteCheckbox" @click="dialogFormVisible = true; form = {}" type="primary" plain>新增</el-button>
              <el-button v-if="!showDeleteCheckbox" @click="showDeleteCheckbox = true" type="danger" plain>删除
              </el-button>

              <!-- 删除过程中，只出现确认删除按钮 -->
              <el-button
                v-if="showDeleteCheckbox"
                @click="deleteTableItem(chosenItem);showDeleteCheckbox = false;chosenItem = [];"
                type="danger"
                plain
              >确认删除
              </el-button>
              <el-button v-if="showDeleteCheckbox" @click="showDeleteCheckbox = false" plain>取消</el-button>
            </el-col>
          </el-row>
          <!--主体内容-->
          <el-table stripe :data="tableData" style="border: 1px solid #ebebeb;border-radius: 3px;margin-top: 10px;">
            <el-table-column prop="id" label="id" width="100">
              <template v-slot:default="scope">
                <!-- el-checkbox 多选框，checked 绑定是否选中，click 绑定点击事件 -->
                <el-checkbox
                  v-if="showDeleteCheckbox" :checked="chosenItem.indexOf(scope.row.id) > -1"
                  @change="toggleChosenItem(scope.row.id)" style="margin-right: 5px;"
                >
                </el-checkbox>
                <span>{{ scope.row.id }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="date" label="日期" width="200"></el-table-column>
            <el-table-column prop="name" label="姓名" width="200"></el-table-column>
            <el-table-column prop="phone" label="电话" width="200"></el-table-column>
            <el-table-column prop="address" label="地址"></el-table-column>
            <el-table-column fixed="right" label="操作" width="300">
              <template v-slot:default="scope">
                <!-- 删除过程中，禁用其他操作 -->
                <el-button :disabled="showDeleteCheckbox"
                           @click="form = {...scope.row};dialogFormVisible = true;"
                           type="info" size="small"
                >
                  编辑
                </el-button>
                <el-button :disabled="showDeleteCheckbox" @click="deleteTableItem(scope.row.id)" type="danger"
                           size="small">
                  删除
                </el-button>
                <el-button :disabled="showDeleteCheckbox" @click="moveTableItem(scope.row.id, 'up')" size="small">
                  上移
                </el-button>
                <el-button :disabled="showDeleteCheckbox" @click="moveTableItem(scope.row.id, 'down')" size="small">
                  下移
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>

      </el-container>

      <!-- Form -->
      <!-- el-dialog 是弹窗样式，title 绑定弹窗的标题内容，visible 绑定弹窗是否展示 -->
      <el-dialog title="新增" v-model="dialogFormVisible">
        <!-- model 绑定表单对象，rules 绑定表单规则，ref 用来校验规则 -->
        <el-form :model="form" :rules="formRules" ref="formDom">

          <!-- el-form-item 绑定表单样式，label 表单的名称，formLabelWidth 设置 label 的宽度, 设置 prop 来进行规则校验 -->
          <el-form-item label="日期" :label-width="formLabelWidth" prop="date">
            <!-- 里面装载表单元素，这里装了个选择日期的组件，v-model 绑定选择值，value-format设置绑定值的格式，type 设置选择的范围，这里 date 表示到天 -->
            <el-date-picker v-model="form.date" type="date" format="YYYY/MM/DD" value-format="YYYY-MM-DD"
                            placeholder="选择日期"></el-date-picker>
          </el-form-item>

          <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>

          <el-form-item label="电话" :label-width="formLabelWidth" prop="phone">
            <el-input v-model="form.phone" type="tel"></el-input>
          </el-form-item>

          <el-form-item label="地址" :label-width="formLabelWidth" prop="address">
            <el-input v-model="form.address"></el-input>
          </el-form-item>
        </el-form>

        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitForm">确 定</el-button>
          </span>
        </template>
      </el-dialog>

    </el-container>
  </div>
</template>

<script>
import { checkPhoneValidator } from './validator'
import { ref, unref } from 'vue'

export default {
  name: 'SinglePage',
  setup () {
    // 准备数据源
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
          return {
            ...y,
            index: `${i}-${j}`
          }
        }),
        // 父菜单就把 index 加上好了
        index: `${i}`
      }
    })

    const tableItem = {
      date: '2022-03-16',
      name: 'lesenelir',
      phone: '13888888888',
      address: '暨南大学南海楼'
    }
    // 此处先以 tableItem 为数据源，拷贝生成 20 个数据，然后再根据索引 index 添加上 id
    const tableData = ref(Array.from({ length: 20 }).fill(tableItem).map((x, i) => {
      return { id: i + 1, ...x }
    }))
    console.log(tableData)

    // =============================================================
    // 完成侧边栏折叠
    const isMenuCollapse = ref(false)

    // =============================================================
    // 删除一个数据
    const showDeleteCheckbox = ref(false) // 是否批量删除
    const deleteTableItem = (idArray) => { // 传入一个数组
      if (typeof idArray === 'object') { // 数组
        console.log('数组')
        for (let i = 0; i < idArray.length; i++) {
          console.log(idArray[i])
          tableData.value.map((item, key) => {
            if (item.id === idArray[i]) {
              tableData.value.splice(key, 1)
            }
          })
        }
      } else { // 单个数字
        console.log('数字')
        tableData.value.map((item, key) => {
          if (item.id === idArray) {
            tableData.value.splice(key, 1)
          }
        })
      }
    }

    // =============================================================
    // 移动一个数据
    const moveTableItem = (id, direction) => {
      const len = tableData.value.length
      const index = tableData.value.findIndex(item => item.id === id)
      switch (direction) {
        case 'up':
          if (index > 0) { // 第一个不上移动
            const item = tableData.value.splice(index, 1)[0]
            tableData.value.splice(index - 1, 0, item)
          }
          break
        case 'down':
          if (index < len - 1) { // 最后一个不下移
            const item = tableData.value.splice(index, 1)[0]
            tableData.value.splice(index + 1, 0, item)
          }
          break
      }
    }

    // =============================================================
    // 切换选中状态
    const chosenItem = ref([])
    const toggleChosenItem = (id) => {
      const index = chosenItem.value.findIndex(item => item.id === id)
      if (index > -1) {
        // 有该选项则删除
        chosenItem.value.splice(index, 1)
      } else {
        // 没有该选项则添加
        chosenItem.value.push(id)
      }
      console.log(chosenItem)
    }

    // =============================================================
    // 提交新增 / 修改表单
    const dialogFormVisible = ref(false) // 弹窗是否出现
    const form = ref({})// 用作表单绑定的内容
    const formDom = ref()
    const formLabelWidth = '120px'
    const formRules = ref({
      date: [
        {
          type: 'string',
          required: true,
          message: 'Please select a date',
          trigger: 'change'
        }
      ],
      name: [
        {
          required: true,
          message: 'Please enter a name',
          trigger: 'change'
        },
        {
          min: 2,
          max: 10,
          message: 'Length from 2 to 10 words',
          trigger: 'blur'
        }
      ],
      phone: [
        {
          required: true,
          validator: checkPhoneValidator,
          trigger: 'blur'
        }
      ]
    })
    // 新增 / 修改一个数据
    const updateTableItem = (item = {}) => {
      if (item.id !== undefined) {
        // 更新值
        const itemIndex = tableData.value.findIndex(x => x.id === item.id)
        if (itemIndex > -1) {
          // vue 数组更新
          tableData.value.splice(itemIndex, 1, { ...item })
        }
      } else {
        // 添加到列表，并且自增id
        tableData.value.push({ ...item, id: tableData.value.length + 1 })
      }
    }

    // 提交新增 / 修改表单
    // const submitForm = () => {
    //   formDom.value.validate((valid) => {
    //     if (valid) {
    //       dialogFormVisible.value = false
    //       updateTableItem(form)
    //       console.log('submit')
    //     } else {
    //       return false
    //     }
    //   })
    // }
    const submitForm = async () => {
      const formD = unref(formDom)
      if (!formD) return
      try {
        const valid = await formD.validate()
        if (valid) {
          dialogFormVisible.value = false
          updateTableItem(form.value)
        }
      } catch (e) {
      }
    }

    return {
      tableData,
      menus,
      isMenuCollapse,
      chosenItem,
      showDeleteCheckbox,
      dialogFormVisible,
      formLabelWidth,
      formRules,
      form,
      formDom,
      deleteTableItem,
      moveTableItem,
      toggleChosenItem,
      submitForm
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

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 300px;
  height: 100%;
  min-height: 100%;
}
</style>
