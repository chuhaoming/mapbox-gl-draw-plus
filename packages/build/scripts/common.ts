import { UserConfig } from 'vite';
import {
  absCwd,
  generateConfig as baseGenerateConfig,
  GenerateConfigOptions,
} from '../src';

/*
* @Description: generateConfig 中负责实现生成构建配置的主体方法；由于不方便引入其他公共方法模块，我们需要建立 utils 目录统一存放本模块用到的公共方法。
* @Author: chuhaoming
* @Date: 2024-03-07
* @LastEditTime: 2024-03-07
*/
export function generateConfig(
  customOptions?: GenerateConfigOptions,
  viteConfig?: UserConfig,
) {
  return baseGenerateConfig({
    dts: absCwd('../../tsconfig.src.json'),
    ...customOptions,
  }, viteConfig);
}
