const path = require('path')

module.exports = {
  // 开启调试
  configureWebpack: {
    devtool: 'source-map',
    // 配置路劲别名，使用@代替src
    resolve: {
      alias: {
        '@': path.resolve('./src')
      }
    }
  },
  // 开启热部署（热更新）
  devServer: {
    open: true, // 自动打开浏览器
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: `http://localhost:8090`,
        changeOrigin: true,
        pathRewrite: {
          ["^" + process.env.VUE_APP_BASE_API]: ""
        }
      },
    }
  },
  transpileDependencies: true,
  lintOnSave: false,

  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "@/style/variable.scss";`
      }
    }
  },
  chainWebpack: config => {
    // svg图标加载
    config.module
      .rule('svg')
      .exclude.add(path.resolve(__dirname, 'src/assets/icons/svg')
      )
      .end()

    config.module
      .rule('icons')// 定义一个名叫 icons 的规则
      .test(/\.svg$/)// 设置 icons 的匹配正则
      .include.add(path.resolve(__dirname, 'src/assets/icons/svg'))// 设置当前规则的作用目录，只在当前目录下才执行当前规则
      .end()
      .use('svg-sprite')// 指定一个名叫 svg-sprite 的 loader 配置
      .loader('svg-sprite-loader')// 该配置使用 svg-sprite-loader 作为处理 loader
      .options({// 该 svg-sprite-loader 的配置
        symbolId: 'icon-[name]'
      })
      .end()
  }
}


// 1、如果需要使用import语句写法需要这样
// 2、还需要在package.json中加入type:'module'
// import path from 'path';
// import { defineConfig } from '@vue/cli-service';

// export default defineConfig({
//   transpileDependencies: true,
//   lintOnSave: false,
//   configureWebpack: {
//     resolve: {
//       alias: {
//         '@': path.resolve('src')
//       }
//     }
//   }
// });
