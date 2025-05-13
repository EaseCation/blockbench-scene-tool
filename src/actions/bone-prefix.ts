import { showPrefixDialog } from '../dialogs/prefix-dialog';
import { updateInterface } from '../utils/interface';

/**
 * 注册添加骨骼前缀的动作
 */
export function addBonePrefixAction(): void {
    const action = new Action('add_bone_prefix', {
        name: '添加/修改骨骼前缀',
        icon: 'text_fields',
        click: function () {
            showPrefixDialog();
        }
    });
    MenuBar.addAction(action, 'tools');
    Group.prototype.menu?.addAction(action);
}

/**
 * 检测骨骼的前缀
 * @param bones 要检测的骨骼列表
 * @returns 检测到的公共前缀，如果没有则返回空字符串
 */
export function detectBonePrefix(bones: Group[]): string {
    if (!bones || bones.length === 0) return '';
    
    let commonPrefix = '';
    let isFirst = true;
    
    bones.forEach(bone => {
        const parts = bone.name.split('@');
        if (parts.length > 1) {
            // 有前缀
            const prefix = parts[0];
            
            if (isFirst) {
                commonPrefix = prefix;
                isFirst = false;
            } else if (commonPrefix !== prefix) {
                // 如果发现不同的前缀，清空commonPrefix
                commonPrefix = '';
            }
        } else if (isFirst) {
            // 第一个骨骼没有前缀
            isFirst = false;
        } else {
            // 有的骨骼没有前缀，与其他可能有前缀的骨骼不一致
            commonPrefix = '';
        }
    });
    
    return commonPrefix;
}

/**
 * 递归添加或修改前缀到骨骼及其子骨骼
 * @param bones 要处理的骨骼列表
 * @param prefix 要添加的前缀
 */
export function addPrefixToBones(bones: Group[], prefix: string): void {
    Undo.initEdit({ outliner: true });

    let totalModified = 0;
    let totalUpdated = 0;

    bones.forEach(bone => {
        // 递归处理函数
        function processBone(node: OutlinerNode): void {
            if (node instanceof Group) {
                const nameParts = node.name.split('@');
                
                if (nameParts.length > 1) {
                    // 已有前缀，需要更新
                    if (nameParts[0] !== prefix) {
                        node.name = prefix + '@' + nameParts.slice(1).join('@');
                        totalUpdated++;
                    }
                } else {
                    // 没有前缀，添加新前缀
                    node.name = prefix + '@' + node.name;
                    totalModified++;
                }

                // 递归处理子骨骼
                if (node.children) {
                    node.children.forEach(child => {
                        processBone(child);
                    });
                }
            }
        }

        processBone(bone);
    });

    Undo.finishEdit(`添加/修改骨骼前缀: "${prefix}"`);

    // 显示操作结果
    if (totalModified > 0 || totalUpdated > 0) {
        let message = `成功处理${totalModified + totalUpdated}个骨骼`;
        if (totalModified > 0) message += `，新增前缀${totalModified}个`;
        if (totalUpdated > 0) message += `，更新前缀${totalUpdated}个`;
        Blockbench.showQuickMessage(message);
    } else {
        Blockbench.showQuickMessage('没有骨骼需要添加或修改前缀');
    }

    // 更新界面
    updateInterface();
}
