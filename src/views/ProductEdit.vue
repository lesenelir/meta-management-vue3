<template>
  <div>
    <el-card >
      <template #header>
        <div class="clearfix">
          <span>{{form.id ? '编辑' : '新建'}}</span>
        </div>
      </template>
      <!--Form -->
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
        <el-form-item>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { checkPhoneValidator } from '@/utils/validator'
import data from '@/data/data'
import { ref, unref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'ProductEdit',
  setup () {
    const router = useRouter()
    const tableData = data

    // =================================
    // 处理表单
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

    // 获取路由信息 填充
    const updateFormItem = () => {
      const id = router.currentRoute.value.params.id
      // const formItem = tableData.find((obj) => {
      //   if (Number(obj.id) === Number(id)) {
      //     console.log('okkkkk')
      //   }
      // })
      let formItem
      for (let i = 0; i < tableData.length; i++) {
        // console.log(Number(tableData[i].id) === Number(id))
        if (Number(tableData[i].id) === Number(id)) {
          formItem = tableData[i]
        }
      }
      if (formItem) {
        form.value = { ...formItem }
      } else {
        form.value = {}
      }
    }
    updateFormItem()

    // 新增 / 修改一个数据
    const updateTableItem = (item = {}) => {
      if (item.id !== undefined) {
        // 更新值
        const itemIndex = tableData.findIndex(x => x.id === item.id)
        if (itemIndex > -1) {
          // vue 数组更新
          tableData.splice(itemIndex, 1, { ...item })
        }
      } else {
        // 添加到列表，并且自增id
        tableData.push({ ...item, id: tableData.length + 1 })
      }
    }

    const submitForm = async () => {
      const formD = unref(formDom)
      if (!formD) return
      try {
        const valid = await formD.validate()
        if (valid) {
          // 校验通过 更新数据
          updateTableItem(form.value)
          // 返回列表
          router.push({ name: 'ProductList' })
        }
      } catch (e) {
      }
    }

    return {
      tableData,
      form,
      formDom,
      formLabelWidth,
      formRules,
      submitForm,
      updateFormItem
    }
  }
}
</script>

<style scoped>

</style>
