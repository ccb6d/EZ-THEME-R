const { defineConfig } = require("@vue/cli-service");
const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const JavaScriptObfuscator = require("javascript-obfuscator");

const isProd = process.env.NODE_ENV === "production";
const enableConfigJS = process.env.VUE_APP_CONFIGJS == "true";
const enableObfuscation = process.env.VUE_APP_OBFUSCATION == "true";

let extraScriptFileName = '';
const generateRandomFileName = (length = 8) => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let name = "";
  for (let i = 0; i < length; i++) {
    name += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  const randowNumber = Math.floor(Math.random() * 1000).toString().padStart(3, "0")
  return `${randowNumber}.${name}.js`;
};

if (isProd && enableConfigJS) {
  extraScriptFileName = generateRandomFileName();
}

module.exports = defineConfig({
  publicPath: "./",
  outputDir: "dist",
  assetsDir: "static",
  lintOnSave: false,
  productionSourceMap: false,
  
  configureWebpack: (config) => {
    config.experiments = { ...config.experiments, asyncWebAssembly: true, syncWebAssembly: true };
    config.resolve = { ...config.resolve, alias: { "@": path.resolve(__dirname, "src") } };
    
    config.plugins.push(
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: JSON.stringify(true),
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
      })
    );
    
    if (isProd && enableConfigJS) {
      config.plugins.push({
        apply: (compiler) => {
          compiler.hooks.afterEmit.tap("GenerateExtraConfigPlugin", () => {
            const configPath = path.resolve(__dirname, "src/config/index.js");
            const constantPath = path.resolve(__dirname, "src/config/constant.js");
            const distPath = path.resolve(compiler.options.output.path, extraScriptFileName);
            
            try {
              let configContent = fs.readFileSync(configPath, "utf-8");
              let constantContent = fs.readFileSync(constantPath, "utf-8");
              
              // 从 config/index.js 中提取导入的函数名
              const importMatch = configContent.match(/import\s+{([^}]+)}\s+from\s+["']@\/config\/constant["']/);
              if (importMatch) {
                const importedFunctions = importMatch[1].split(',').map(f => f.trim());
                
                // 为每个导入的函数创建定义
                let functionsCode = '';
                
                for (const funcName of importedFunctions) {
                  // 在 constantContent 中查找函数定义
                  const funcRegex = new RegExp(`export\\s+const\\s+${funcName}\\s*=\\s*([\\s\\S]*?)(?=\\n\\s*export\\s+const|\\n\\s*$|$)`, 'g');
                  const funcMatch = funcRegex.exec(constantContent);
                  
                  if (funcMatch) {
                    let funcBody = funcMatch[1].trim();
                    // 确保函数体以分号结尾
                    if (!funcBody.endsWith(';')) {
                      funcBody += ';';
                    }
                    
                    // 添加函数定义
                    functionsCode += `const ${funcName} = ${funcBody}\n`;
                  }
                }
                
                // 替换 import 语句为函数定义
                configContent = configContent.replace(/import\s+{[^}]+}\s+from\s+["']@\/config\/constant["'];?\s*\n?/, functionsCode);
              }
              
              // 原有的替换 export 语句的逻辑
              configContent = configContent.replace(/window\.EZ_CONFIG\s*=\s*config\s*;?/g, "");
              configContent = configContent.replace(/export\s+const\s+config\s*=/, "window.EZ_CONFIG =");
              
              const obfuscated = JavaScriptObfuscator.obfuscate(configContent, {
                compact: true,
                controlFlowFlattening: true,
                controlFlowFlatteningThreshold: 0.75,
                numbersToExpressions: true,
                simplify: true,
                stringArray: true,
                stringArrayEncoding: ["rc4"],
                stringArrayThreshold: 0.75,
                transformObjectKeys: true,
                unicodeEscapeSequence: true
              }).getObfuscatedCode();
              
              const fileContent = enableObfuscation ? obfuscated : configContent;
              
              // 写入 dist
              fs.writeFileSync(distPath, fileContent, "utf-8");
              
              console.log(`生成混淆独立 JS 文件: ${extraScriptFileName}`);
            } catch (err) {
              console.warn("生成独立 JS 文件失败:", err);
            }
          });
        },
      });
    }
    
    if (isProd) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            vendors: { name: "chunk-vendors", test: /[\\/]node_modules[\\/]/, priority: -10, chunks: "initial" },
            common: { name: "chunk-common", minChunks: 2, priority: -20, chunks: "initial", reuseExistingChunk: true },
          },
        },
        minimize: true,
        minimizer: [
          new TerserPlugin({
            terserOptions: { compress: { drop_console: true, drop_debugger: true }, mangle: true, format: { comments: false, ascii_only: true } },
            extractComments: false,
          }),
        ],
      };
    }
  },
  
  chainWebpack: (config) => {
    if (isProd) {
      const pluginName = "html-index";
      config.plugin(pluginName).tap((args) => {
        args[0].templateParameters = {
          ...args[0].templateParameters,
          injectCustomScript: `
            ${enableConfigJS ? `<script src="./${extraScriptFileName}"></script>` : ""}
          `,
        };
        return args;
      });
    }
  },
  
  css: {
    loaderOptions: {
      sass: {
        implementation: require("sass"),
        sassOptions: { outputStyle: "expanded", fiber: false, indentedSyntax: false, includePaths: ["node_modules"] },
        additionalData: `@use "@/assets/styles/base/variables.scss" as *;`,
      },
    },
  },
  
  pages: {
    index: { entry: "src/main.js", template: "public/index.html", filename: "index.html", title: process.env.VUE_APP_TITLE },
  },
  
  devServer: { client: { overlay: false } },
});
