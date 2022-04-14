<template>
  <el-row style="margin-top: 200px;">
    <el-col :span="12" :offset="6">
      <el-card>
        <!--Form-->
        <!-- model 绑定表单对象，rules 绑定表单校验规则，ref 获取表单DOM元素 -->
        <el-form :model="form" :rules="formRules" ref="formDom" label-width="100px" label-position="top" size="large">
          <!-- el-form-item 设置 prop 来进行规则校验（必填），label 表单的名称，formLabelWidth 设置 label 的宽度 -->
          <el-form-item label="Username" prop="username">
            <el-input v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item label="Password" prop="password">
            <el-input v-model="form.password" type="password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">Login</el-button>
            <el-button>Cancel</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
  </el-row>

  <el-card class="box-card">
    <div style="color: red">username: admin</div>
    <div style="color: red">password: admin</div>
  </el-card>
</template>

<script>
import { ref, unref } from 'vue'
// import { setGlobalData } from '@/utils/globalData'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'Login',
  setup () {
    const router = useRouter()
    const store = useStore()
    // 用作表单绑定的对象
    const form = ref({})
    const formRules = ref({
      username: [{
        required: true,
        message: 'Please enter your username',
        trigger: 'change'
      }, {
        min: 2,
        max: 10,
        message: 'Length from 2 to 10 words',
        trigger: 'blur'
      }],
      password: [{
        required: true,
        message: 'Please enter your password',
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
          // setGlobalData('username', form.value.username)
          store.commit('setGlobalData', {
            key: 'username',
            value: form.value.username
          })
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

.box-card {
  position: relative;
  top: -480px;
  left: 1400px;
  width: 200px;
  height: 100px;
}

</style>
