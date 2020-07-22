# 简答题

## Webpack 的构建流程主要有哪些环节？如果可以请尽可能详尽的描述 Webpack 打包的整个过程。

答

- 构建流程：
  - 添加依赖 yarn add webpack webpack-cli -D
  - 配置配置文件
    1. 设置打包入口
    2. 设置打包出口
    3. 设置模式
    4. 处理 html 文件
    5. 处理 js 文件
    6. 处理 css 文件
    7. 处理图片字体等
    8. 其他静态资源
    9. 开发配置
    10. 设置 source-map
    11. 设置 HMR
    12. 为代码注入变量
    13. 设置 optimization 优化项
    14. 设置代码分割、动态导入
    15. 配置 eslint
    16. 其他补充
  - package.json 中集成指令
  - 运行构建
- 打包过程：
  1. 以入口文件为切入点
  2. 根据模块触发的条件形成依赖关系
  3. 递归依赖树，使用不同的 loader 对依赖进行处理，返回结果
  4. 结果通过不同的 plugin 优化输出成文件

## Loader 和 Plugin 有哪些不同？请描述一下开发 Loader 和 Plugin 的思路。

答：

- 不同点
  1. 职责不同
     - loader 是对非 js 模块的加载。
     - plugin 是在模块加载之后对资源的其他处理。
  2. 触发时机不同
     - loader 在模块加载时触发
     - plugin 则是挂载到钩子上，在生命周期的不同阶段触发
  3. 代码形式不同
     - loader 是一个管道函数的形式，对资源进行处理
     - plugin 则是一个函数或者包含 apply 方法的对象，一般定义为类，并通过 new 生成实例使用
- 开发思路
  1. loader
     - 以 commonjs 规范导出一个管道函数
       - 参数：模块资源
       - 返回值：可执行的 js 代码段
  2. plugin
     - 一般定义为类，通过 new 实例使用
     - 类实现 apply 方法
     - 在 apply 方法中，通过向编译器上挂载钩子函数实现功能

# 编程题

## 使用 Webpack 实现 Vue 项目打包任务

答：代码见 code/webpack-vue-app
