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

- 打包前删除上一次打包结果

  - yarn add clean-webpack-plugin -D
  - 配置

  ```
  const { CleanWebpackPlugin } = require('clean-webpack-plugin');
  const webpackConfig = {
    plugins: [
        new CleanWebpackPlugin(),
    ],
  };

  ```

  - yarn build//测试成功

- 处理 html

  - yarn add html-webpack-plugin -D
  - 配置

  ```
  const HtmlWebpackPlugin = require('html-webpack-plugin');
   new HtmlWebpackPlugin({//默认开启了压缩
      title: "webpack-vue-app",
      filename: "index.html",
      template: "public/index.html",
      hash: true,
    }),

  ```

  - yarn build 报错（BASE_URL is not defined）
  - 配置

  ```
  const webpack = require("webpack");
  new webpack.DefinePlugin({
    BASE_URL: JSON.stringify(""),
  }),
  ```

  - yarn build 成功

- 处理 public 文件夹
  - yarn add copy-webpack-plugin -D
  - 配置
  ```
  const CopyWebpackPlugin = require("copy-webpack-plugin");
  new CopyWebpackPlugin({
    patterns: [
      {
        from: "./public/*",//to可以不指定，不指定是，会默认复制到配置的打包目录
        flatten: true,//不按照目录结构复制，此时并不会与html-webpack-plugin冲突，应该是后者钩子在后
      },
    ],
  }),
  ```
- 处理 js 文件(webpack 对 js 的默认处理只有模块化，其余特性，如 es6+，浏览器兼容性等特性都没处理)

  - 添加对高级属性的支持

    - yarn add babel-loader @babel/core @babel/preset-env -D
    - 配置 babel.config.js 文件(不存在时添加)

    ```
    {
      "presets": ["@babel/preset-env"]
    }

    ```

    - 在 common 中配置

    ```
    {
      test: /\.js$/,
      use: {
        loader: "babel-loader",
      },
    },
    ```

    - yarn build 成功

  - 集成 eslint

    - yarn add eslint eslint-loader -D - yarn eslint --init
      ✔ How would you like to use ESLint? · style
      ✔ What type of modules does your project use? · none
      ✔ Which framework does your project use? · vue
      ✔ Does your project use TypeScript? · No / Yes
      ✔ Where does your code run? · browser
      ✔ How would you like to define a style for your project? · guide
      ✔ Which style guide do you want to follow? · standard
      ✔ What format do you want your config file to be in? · JavaScript
    - 配置 common
      ```
      {
        test: /\.js$/,
        enforce: "pre",
        use: {
          loader: "eslint-loader",
        }
      },
      ```
    - 配置.vscode/settings.json 文件

    ```
    {
      "prettier.requireConfig": true,//读取配置
      "editor.formatOnSave": true//保存时格式化
    }

    ```

    - 配置.prettierrc.js//格式化的规则

    ```
    module.exports = {
      semi: false, // 行位是否使用分号，默认为true
      trailingComma: 'none', // 是否使用尾逗号，有三个可选值"<none|es5|all>"
      singleQuote: true, // 字符串是否使用单引号，默认为false，使用双引号
      printWidth: 160, // 一行的字符数，如果超过会进行换行，默认为80
      tabWidth: 2, // 一个tab代表几个空格数
      useTabs: false, // 启用tab缩进
      bracketSpacing: true // 对象大括号直接是否有空格，默认为true，效果：{ foo: bar }
    }
    ```

  - 集成 ts//TODO

- 处理 css
  - 抽离文件
    - yarn add mini-css-extract-plugin -D
    - 配置
    ```
    const MiniCssExtractPlugin = require('mini-css-extract-plugin');
    module.exports = {
      plugins: [new MiniCssExtractPlugin()],
      module: {
        rules: [
          {
            test: /\.css$/i,
            use: [{
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: process.env.NODE_ENV === 'development',//开启热更新
                reloadAll: true
              }
            }],
          },
        ],
      },
    };
    ```
    - yarn build 成功
  - 压缩抽离的文件
    - yarn add optimize-css-assets-webpack-plugin terser-webpack-plugin -D
    - 配置
    ```
    const TerserJSPlugin = require('terser-webpack-plugin')
    const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
    module.exports = {
      optimization: {
        minimize: true,
        minimizer: [
          new TerserJSPlugin({
            extractComments: false//如果不设置，会产生.LICENSE.txt文件
          }),
          new OptimizeCSSAssetsPlugin({})
        ]
      },
      plugins: [new MiniCssExtractPlugin()],
    }
    ```
  - 自动添加浏览器样式前缀
    - yarn add postcss-loader autoprefixer -D//postcss-loader 需要在 css-loader 之前使用
    - 配置
    ```
    const AutoPreFixer = require("autoprefixer");
    {
      loader: "postcss-loader",
      options: {
        plugins: (loader) => [AutoPreFixer()],
      },
    },
    ```
    - yarn build 成功
  - stylelint//TODO
- 处理字体、视频
  - 和处理图片一致
  - 配置
    - `/\.(woff2?|eot|ttf|otf)(\?.*)?$/i`
    - `/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/`
- 处理 svg：//TODO
  - 使用 file-loader 或者结合 vue、react 等使用其他形式
- 设置 source-map
  - devtool: process.env.NODE_ENV === 'development' ? 'cheap-module-eval-source-map' : 'none',//或者在对应的文件分别设置
- 设置开发

  - yarn add webpack-dev-server -D
  - 设置

    ```
    const merge = require('webpack-merge')
    const commonConfig = require('./webpack.common.js')
    const webpack = require('webpack')

    module.exports = merge(commonConfig, {
      mode: 'development',
      devtool: 'cheap-module-eval-source-map',
      devServer: {
        host: '0.0.0.0',
        port: 4500,
        progress: true,
        hot: true//HMR先关在代码中逻辑配置
      },
      plugins: [new webpack.HotModuleReplacementPlugin()]
    })
    ```

  - 配置脚本
    `"serve": "webpack-dev-server --config webpack.dev.js",`
  - yarn serve(图片出错)
    - 修正图片的 loader 配置
    ```
    {
      test: /\.(png|jpg|jpeg|gif)$/i,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 192,
            esModule: false,
            fallback: {
              loader: require.resolve('file-loader')
            }
          }
        }
      ]
    }
    ```
  - 象征性添加 HMR 的功能//注意 hotOnly

- 设置生产
  - 将 optimization、devtool 等 选项移至开发环境

## 其他可做

- 浏览器兼容性（polyfill）
- css 的 scope 实现（css in js）
- 集成 ts
- svg 与 vue、react 的组件化集成
- 引入路径优化（@/..）
- 打包缓存
- 环境配置
- 路由配置
- 开发工具集成（plop）
- 打包输出优化
- ...
