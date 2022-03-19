<template>
  <div>
    <el-row>
      <el-col :span="24">
        <!-- 删除过程中，不允许其他操作 -->
        <el-button v-if="!showDeleteCheckbox" @click="dialogFormVisible = true; form = {}" type="primary" plain>新增</el-button>
        <el-button v-if="!showDeleteCheckbox" @click="showDeleteCheckbox = true" type="danger" plain>删除</el-button>

        <!-- 删除过程中，只出现确认删除按钮 -->
        <el-button
          v-if="showDeleteCheckbox"
          @click="deleteTableItem(chosenItem);showDeleteCheckbox = false;chosenItem = [];"
          type="danger"
          plain
        >
          确认删除
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
            v-if="showDeleteCheckbox"
            style="margin-right: 5px;"
            :checked="chosenItem.indexOf(scope.row.id) > -1"
            @change="toggleChosenItem(scope.row.id)"
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
          <el-button
            :disabled="showDeleteCheckbox"
            @click="form = {...scope.row};dialogFormVisible = true;"
            type="info"
            size="small"
          >
            编辑
          </el-button>
          <el-button :disabled="showDeleteCheckbox" @click="deleteTableItem(scope.row.id)" type="danger" size="small">删除</el-button>
          <el-button :disabled="showDeleteCheckbox" @click="moveTableItem(scope.row.id, 'up')" size="small">上移</el-button>
          <el-button :disabled="showDeleteCheckbox" @click="moveTableItem(scope.row.id, 'down')" size="small">下移</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Form -->
    <!-- el-dialog 是弹窗样式，title 绑定弹窗的标题内容，visible 绑定弹窗是否展示 -->
    <el-dialog title="新增" v-model="dialogFormVisible">
      <!-- model 绑定表单对象，rules 绑定表单规则，ref 用来校验规则 -->
      <el-form :model="form" :rules="formRules" ref="formDom">
        <!-- el-form-item 绑定表单样式，label 表单的名称，formLabelWidth 设置 label 的宽度, 设置 prop 来进行规则校验 -->
        <el-form-item label="日期" :label-width="formLabelWidth" prop="date">
          <!-- 里面装载表单元素，这里装了个选择日期的组件，v-model 绑定选择值，value-format设置绑定值的格式，type 设置选择的范围，这里 date 表示到天 -->
          <el-date-picker v-model="form.date" type="date" format="YYYY/MM/DD" value-format="YYYY-MM-DD" placeholder="选择日期">
          </el-date-picker>
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
  </div>
</template>

<script>
import { checkPhoneValidator } from '@/utils/validator'
import { ref, unref } from 'vue'
import data from '@/data/data'

export default {
  name: 'Service',
  setup () {
    const tableData = ref(data)

    // =============================================================
    // 删除一个数据
    const showDeleteCheckbox = ref(false) // 是否批量删除
    const deleteTableItem = (idArray) => { // 传入一个数组
      if (typeof idArray === 'object') { // 数组
        // console.log('数组')
        for (let i = 0; i < idArray.length; i++) {
          tableData.value.map((item, key) => {
            if (item.id === idArray[i]) {
              tableData.value.splice(key, 1)
            }
          })
        }
      } else { // 单个数字
        // console.log('数字')
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
          message: '请选择日期',
          trigger: 'change'
        }
      ],
      name: [
        {
          required: true,
          message: '请输入名字',
          trigger: 'change'
        },
        {
          min: 2,
          max: 10,
          message: '长度在 2 到 10 个字',
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
    // 更新列表的Item
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

    // 提交表单
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
      showDeleteCheckbox,
      chosenItem,
      dialogFormVisible,
      form,
      formDom,
      formRules,
      formLabelWidth,
      deleteTableItem,
      moveTableItem,
      toggleChosenItem,
      submitForm
    }
  }
}
</script>

<style scoped>

</style>
