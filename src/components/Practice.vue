<template>
  <span v-for="item in arr" :key="item.id">
    {{item}}
  </span>

  <button @click="deleteNum(1)">按钮</button>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Practice',
  setup () {
    const arr = ref([
      { id: 1, name: 'str1' },
      { id: 2, name: 'str2' },
      { id: 3, name: 'str3' }
    ])
    const deleteNum = (idArray) => {
      arr.value.map((val, key) => {
        if (val.id === idArray) {
          arr.value.splice(key, 1)
        }
      })
      console.log(arr)
    }

    return {
      arr,
      deleteNum
    }
  }
}
</script>

<style scoped>

</style>
