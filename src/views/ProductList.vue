<template>
  <div>
    <el-row>
      <el-col :span="24">
        <!-- 删除过程中，不允许其他操作 -->
        <el-button v-if="!showDeleteCheckbox" @click="updateTableItem(id=0)" type="primary" plain>Add</el-button>
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
      <el-table-column prop="date" label="Date" width="200"></el-table-column>
      <el-table-column prop="name" label="Name" width="200"></el-table-column>
      <el-table-column prop="phone" label="Phone" width="200"></el-table-column>
      <el-table-column prop="address" label="Address"></el-table-column>
      <el-table-column fixed="right" label="Operation" width="300">
        <template v-slot:default="scope">
          <el-button :disabled="showDeleteCheckbox" @click="updateTableItem(id=scope.row.id)" type="info" size="small">
            Edit
          </el-button>
          <el-button :disabled="showDeleteCheckbox" @click="deleteTableItem([scope.row.id])" type="danger" size="small">
            Delete
          </el-button>
          <el-button :disabled="showDeleteCheckbox" @click="moveTableItem(scope.row.id, 'up')" size="small">
            Up
          </el-button>
          <el-button :disabled="showDeleteCheckbox" @click="moveTableItem(scope.row.id, 'down')" size="small">
            Down
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import data from '@/data/data'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'ProductList',
  setup () {
    const router = useRouter()
    const tableData = ref(data)
    // console.log(tableData.value[0].id)

    // =============================================================
    // 新增 / 修改一个数据
    const dialogFormVisible = ref(false) // 弹窗是否出现
    const updateTableItem = (id = 0) => {
      // 跳转编辑页面，新增则传id为0, 否则为编辑
      if (id !== 0) {
        router.push({ name: 'ProductEdit', params: { id } })
      } else {
        router.push({ name: 'ProductAdd' })
      }
    }

    // =============================================================
    // 删除一个数据
    const showDeleteCheckbox = ref(false) // 是否批量删除
    const deleteTableItem = (idArray) => { // 传入一个数组
      if (typeof idArray === 'object') { // 数组
        console.log('数组')
        for (let i = 0; i < idArray.length; i++) {
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
            const item = tableData.value.splice(index, 1)[0] // 找到删除元素数组的第一个元素
            tableData.value.splice(index - 1, 0, item) // 上一个位置新增该元素
          }
          break
        case 'down':
          if (index < len - 1) { // 最后一个不下移
            const item = tableData.value.splice(index, 1)[0] // 找到删除元素数组的第一个元素
            tableData.value.splice(index + 1, 0, item) // 下一个位置新增该元素
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

    return {
      tableData,
      dialogFormVisible,
      showDeleteCheckbox,
      chosenItem,
      updateTableItem,
      moveTableItem,
      deleteTableItem,
      toggleChosenItem
    }
  }
}
</script>

<style scoped>

</style>
