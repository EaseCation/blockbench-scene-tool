// 添加BlockBench Plugin类型声明，避免与DOM的Plugin类型冲突
declare namespace BBPlugin {
    interface PluginOptions {
        name: string;
        author: string;
        description: string;
        version: string;
        variant: string;
        onload: () => void;
        [key: string]: any;
    }
    
    interface PluginAPI {
        register: (id: string, options: PluginOptions) => any;
    }
}

declare const Plugin: BBPlugin.PluginAPI;

import { addAnimationPrefixAction } from './actions/animation-export';
import { addBonePrefixAction } from './actions/bone-prefix';

/**
 * 注册插件
 */
export function registerPlugin(): void {
    Plugin.register('scene-tool', {
        name: 'Scene Tool',
        author: 'EaseCation',
        description: '使用BlockBench制作场景动画的工具',
        version: '1.0.0',
        variant: 'both',
        onload() {
            // 注册所有动作
            addBonePrefixAction();
            addAnimationPrefixAction();
        }
    });
}
