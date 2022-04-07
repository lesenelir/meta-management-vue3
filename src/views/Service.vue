<template>
  <div>
    <el-row>
      <el-col :span="24">
        <!-- 删除过程中，不允许其他操作 -->
        <el-button v-if="!showDeleteCheckbox" @click="dialogFormVisible = true; form = {}" type="primary" plain>Add</el-button>
        <el-button v-if="!showDeleteCheckbox" @click="showDeleteCheckbox = true" type="danger" plain>Delete</el-button>

        <!-- 删除过程中，只出现确认删除按钮 -->
        <el-button
          v-if="showDeleteCheckbox"
          @click="deleteTableItem(chosenItem);showDeleteCheckbox = false;chosenItem = [];"
          type="danger"
          plain
        >
          Confirm deletion
        </el-button>
        <el-button v-if="showDeleteCheckbox" @click="showDeleteCheckbox = false" plain>Cancel</el-button>
      </el-col>
    </el-row>
    <!--主体内容-->
    <el-table v-loading="loading" element-loading-text="Loading..."
              stripe :data="tableData" style="border: 1px solid #ebebeb;border-radius: 3px;margin-top: 10px;">
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
      <el-table-column prop="date" label="Date" width="200"></el-table-column>
      <el-table-column prop="name" label="Name" width="200"></el-table-column>
      <el-table-column prop="phone" label="Phone" width="200"></el-table-column>
      <el-table-column prop="address" label="Address"></el-table-column>
      <el-table-column fixed="right" label="Operation" width="300">
        <template v-slot:default="scope">
          <!-- 删除过程中，禁用其他操作 -->
          <el-button
            :disabled="showDeleteCheckbox"
            @click="form = {...scope.row};dialogFormVisible = true;"
            type="info"
            size="small"
          >
            Edit
          </el-button>
          <el-button :disabled="showDeleteCheckbox" @click="deleteTableItem(scope.row.id)" type="danger" size="small">Delete</el-button>
          <el-button :disabled="showDeleteCheckbox" @click="moveTableItem(scope.row.id, 'up')" size="small">Up</el-button>
          <el-button :disabled="showDeleteCheckbox" @click="moveTableItem(scope.row.id, 'down')" size="small">Down</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Form -->
    <!-- el-dialog 是弹窗样式，title 绑定弹窗的标题内容，visible 绑定弹窗是否展示 -->
    <el-dialog title="Create" v-model="dialogFormVisible">
      <!-- model 绑定表单对象，rules 绑定表单规则，ref 用来校验规则 -->
      <el-form :model="form" :rules="formRules" ref="formDom">
        <!-- el-form-item 绑定表单样式，label 表单的名称，formLabelWidth 设置 label 的宽度, 设置 prop 来进行规则校验 -->
        <el-form-item label="Date" :label-width="formLabelWidth" prop="date">
          <!-- 里面装载表单元素，这里装了个选择日期的组件，v-model 绑定选择值，value-format设置绑定值的格式，type 设置选择的范围，这里 date 表示到天 -->
          <el-date-picker v-model="form.date" type="date" format="YYYY/MM/DD" value-format="YYYY-MM-DD" placeholder="Select date">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="Name" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="Phone" :label-width="formLabelWidth" prop="phone">
          <el-input v-model="form.phone" type="tel"></el-input>
        </el-form-item>

        <el-form-item label="Address" :label-width="formLabelWidth" prop="address">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">Cancel</el-button>
          <el-button type="primary" @click="submitForm">Confirm</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { checkPhoneValidator } from '@/utils/validator'
import { onMounted, ref, unref, watch } from 'vue'
// import data from '@/data/data'
import { getData } from '@/request/api'
import { useStore } from 'vuex'

export default {
  name: 'Service',
  setup () {
    // loading操作
    const store = useStore()
    const loading = ref(store.state.loading)
    // 监测store内loading的变化
    watch(() => store.state.loading, () => {
      loading.value = store.state.loading
    })

    // const tableData = ref(data)
    const tableData = ref('')
    onMounted(() => {
      getData().then(res => {
        tableData.value = Array.from({ length: 20 }).fill(res.data).map((x, i) => { return { id: i + 1, ...x } })
        // console.log(tableData.value[tableData.value.length - 1].id)
      })
    })

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
        //  tableData.value.push({ ...item, id: tableData.value.length + 1 })
        if (tableData.value.length !== 0) { // 不等于0时，往后添加
          tableData.value.push({ ...item, id: tableData.value[tableData.value.length - 1].id + 1 })
        } else { // 长度为0时，自动添加的项id为1
          tableData.value.push({ ...item, id: 1 })
        }
      }
    }

    // 提交表单 ｜ 校验表单
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
      loading,
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
