import {
  defineConfig,
  presetUno,
  presetIcons,
  UserConfig,
} from 'unocss';
import transformerDirectives from '@unocss/transformer-directives';

export default <UserConfig>defineConfig({
  presets: [
    presetUno(),
    presetIcons({ }),
  ],
  transformers: [
    transformerDirectives(),
  ],
});
