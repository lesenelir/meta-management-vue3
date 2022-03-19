<template>
  <el-row :gutter="20" style="margin-top: 200px;">
    <el-col :span="12" :offset="6">
      <el-card>
        <!--Form-->
        <!-- model 绑定表单对象，rules 绑定表单规则，ref 用来校验规则 -->
        <el-form :model="form" :rules="formRules" ref="formDom" label-width="100px" label-position="top" size="large">
          <!-- el-form-item 绑定表单样式，label 表单的名称，formLabelWidth 设置 label 的宽度, 设置 prop 来进行规则校验 -->
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" type="password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">登录</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import { ref, unref } from 'vue'
import { setGlobalData } from '@/utils/globalData'
import { useRouter } from 'vue-router'

export default {
  name: 'Login',
  setup () {
    const router = useRouter()
    // 用作表单绑定的内容
    const form = ref({})
    const formRules = ref({
      username: [{
        required: true,
        message: '请输入用户名',
        trigger: 'change'
      }, {
        min: 2,
        max: 10,
        message: '长度在 2 到 10 个字',
        trigger: 'blur'
      }],
      password: [{
        required: true,
        message: '请输入密码',
        trigger: 'change'
      }]
    })

    // 提交新增 / 修改表单
    const formDom = ref()
    const onSubmit = async () => {
      const formD = unref(formDom)
      if (!formD) return
      try {
        const valid = await formD.validate()
        if (valid) {
          // 校验成功
          setGlobalData('username', form.value.username)
          if (form.value.username === 'admin' && form.value.password === 'admin') {
            sessionStorage.setItem('token', 'lesenelir')
            console.log('登录成功')
          }
          router.push('/home')
        } else {
          // 校验失败
          return false
        }
      } catch (e) {
        console.log(e)
      }
    }

    return {
      form,
      formRules,
      formDom,
      onSubmit
    }
  }
}
</script>

<style scoped>

</style>
