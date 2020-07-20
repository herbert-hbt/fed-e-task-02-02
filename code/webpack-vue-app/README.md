# 步骤

## 先由报错入手

- 安装 webpack yarn add webpack webpack-cli -D
- 在 package.json 中添加 script 字段 build 指令

  ```
  "scripts": {
      "build": "webpack --config webpack.prod.js"
  }
  ```

- 在 webpack.config.js 中添加测试代码`console.log('work')`
- 运行 yarn build 测试（入口配置报错）
- 编写 webpack.common.js

```
  entry: "./src/main.js",//相对路径不可省略
  output: {
    filename: "[contenthash:8]-[name].js",
    path: path.resolve(__dirname, "dist"),//path 必须设置为绝对路劲
  },
```

- 安装 yarn webpack-merge -D
- 编写 webpack.prod.js

```
const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common");

module.exports = merge(commonConfig, {
  mode: "production",
});

```

- 运行 yarn build 测试（less 文件报错）
- 安装 yarn add less less-loader css-loader style-loader -D
- 在 common 中配置 less 相关

```
 module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
          {
            loader: "less-loader",
          },
        ],
      },
    ],
  },

```

- 运行 yarn build 测试（vue 文件报错）
- yarn add vue-loader vue-template-compiler -D
- 在 common 中配置 vue 相关

  - rules 中

  ```
    {
      test: /\.vue$/,
      loader: 'vue-loader'
    }
  ```

  - plugins 中

  ```
    new VueLoaderPlugin()
  ```

- 运行 yarn build 测试（vue 仍然报错，先是 vue 中的 css）
  - vue-loader 只会将 vue 文件拆解为对应的 css、js 模块，js、css 等模块还需要对应的模块去解析
- 在 common 中配置 css 相关（style-loader 与 css-loader 已经安装）

```
{
    test: /\.css$/,
    use: [
        {
            loader: "style-loader",
        },
        {
            loader: "css-loader",
        },
    ],
},
```

- yarn add file-loader url-loader -D
- 在 common 中配置 图片相关
- 运行 yarn build 测试（不再报错）

## 再由优化入手
