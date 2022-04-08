# meta-management-vue3

Meta management admin project based on Vue3 and Element Plus



### Introduction

A simple personal backend management admin project on Vue3.0 and Element Plus

The project is based on [ES2015+](https://es6.ruanyifeng.com/), [vue](https://cn.vuejs.org/index.html), [vue-router](https://router.vuejs.org/zh-cn/),[vuex](https://github.com/vuejs/vuex), [vue-cli](https://github.com/vuejs/vue-cli), [axios](https://github.com/axios/axios) and [element-plus](https://github.com/element-plus/element-plus), all data is in the data.js.



**[live demo](https://lesenelir.wiki/meta-management-vue3/#/)**

username:    admin

password:         admim

![](https://raw.githubusercontent.com/lesenelir/meta-management-vue3/master/readmePic/readmePic01.png)



#### Features

- Implemented user login module with route authentication by route navigation guards.
- Using Element Plus to draw Manu bar, List bar, Form bar.
- Customize the data in js to render the data on the list page and to add, delete, move, etc.
- Axios request data to render data for list & form pages and to add, delete, move, etc.
- Setting up axios request interceptor & response interceptor combined with Element Plus for dynamic loading effects.



### Getting started

```shell
# clone the project
git clone https://github.com/lesenelir/meta-management-vue3.git

# enter the project directory
cd meta-management-vue3

# install dependency
npm install

# develop
npm run server
```



### Bug

- Element-plus dynamic binding icon error：Uncaught (in promise) RangeError: Maximum call stack size exceeded
