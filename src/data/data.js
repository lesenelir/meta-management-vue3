const tableItem = {
  date: '2022-03-16',
  name: 'lesenelir',
  phone: '13005208888',
  address: 'Jinan University, Guangzhou City'
}
// 以 tableItem 为数据源，拷贝生成 20 个数据，再根据索引 index 添加 id
const data = Array.from({ length: 20 }).fill(tableItem).map((x, i) => { return { id: i + 1, ...x } })

export default data
