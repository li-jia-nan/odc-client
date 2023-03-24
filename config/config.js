import getVersion from './version';
import defineConfig from './defineConfig';
import theme from './theme';
import routes from './routes';
// import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin' 

const version = getVersion();
console.log('git last commit: ', version);
const umiEnv = process.env.UMI_ENV;
/**
 * 关闭浏览器的版本提示，避免出现第三方cdn加载（阿里专有云安全需求）
 */
const disableBrowserUpdate = process.env.DISABLE_BROWSER_UPDATE;

console.log(disableBrowserUpdate);

let publicPath = '/';

const define = defineConfig();

const config = {
  // singular: true,
  mock: false,
  // dynamicImport: {
  //   loading: "@/component/Loading"
  // },
  // dynamicImportSyntax: {},
  publicPath,
  // tracert: {
  //   spmAPos: 'a3112',
  //   bizType: 'lu',
  //   type: 'manual',
  //   ifInjectManualScript: false,
  //   ifRouterNeedPv: true
  // },
  targets: {
    chrome: 76,
    firefox: 60,
    edge: 79,
  },
  // esbuild: {},
  metas: [
    {
      name: 'version',
      content: version,
    },
  ],
  // nodeModulesTransform: {
  //   type: 'none',
  //   exclude: [],
  // },
  antd: {
    import: true,
  },

  theme: theme,
  proxy: {
    // 本地开发或者对内 Site 应用的开发环境的代理配置
    '/api/v1/webSocket/obclient': {
      target: 'http://100.69.100.202:9509',
      ws: true,
    },
    '/api/': {
      // target: 'http://11.124.185.132',
      // target: 'http://100.81.152.104:8989',
      // target: 'http://100.81.152.113:9000',
      // target: 'http://100.81.152.113:8989',
      target: 'http://11.124.9.83:7001/proxy/96',
    },
  },

  locale: {
    default: 'en-US',
    antd: true,
  },
  title: false,
  favicons: [publicPath + 'img/favicon.png'],
  // ctoken: false,

  externals: {
    electron: 'commonjs electron',
  },
  svgr: false,
  svgo: false,
  chainWebpack(config) {
    config.performance.hints('warning');
    config.module.rules.delete('svg');
    config.module.rule('asset').oneOf('fallback').exclude.add(/.svg/);
    // config.plugin('monaco').use(MonacoWebpackPlugin)
    config.module
      .rule('svg')
      .test(/\.svg(\?v=\d+\.\d+\.\d+)?$/)
      .use([
        {
          loader: 'babel-loader',
        },
        {
          loader: '@svgr/webpack',
          options: {
            babel: false,
            icon: true,
          },
        },
      ])
      .loader(require.resolve('@svgr/webpack'));
  },

  history: {
    type: 'hash',
  },

  outputPath: './dist/renderer',

  define,

  // qiankun: {
  //   slave: {},
  // },

  // 路由配置
  routes: routes,
  // ? undefined
  // : routes
};
if (disableBrowserUpdate) {
  delete config.browserUpdate;
}
config.headScripts = [
  `window.currentEnv=window.currentEnv || '${process.env.CURRENT_ENV || ''}'`,
  `window.publicPath=window.publicPath || '${publicPath}'`,
];
config.headScripts.push(`window.ODCApiHost= window.ODCApiHost || ''`);
export default config;
