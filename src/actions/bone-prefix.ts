import { showPrefixDialog } from '../dialogs/prefix-dialog';
import { updateInterface } from '../utils/interface';

/**
 * 注册添加骨骼前缀的动作
 */
export function addBonePrefixAction(): void {
    MenuBar.addAction(
        new Action('add_bone_prefix', {
            name: '添加骨骼前缀',
            icon: 'text_fields',
            click: function () {
                showPrefixDialog();
            }
        }), 'tools'
    );
}

/**
 * 递归添加前缀到骨骼及其子骨骼
 * @param bones 要处理的骨骼列表
 * @param prefix 要添加的前缀
 */
export function addPrefixToBones(bones: Group[], prefix: string): void {
    Undo.initEdit({ outliner: true });

    let totalModified = 0;

    bones.forEach(bone => {
        // 递归处理函数
        function processBone(node: OutlinerNode): void {
            if (node instanceof Group) {
                // 添加前缀（如果尚未添加）
                if (!node.name.startsWith(prefix)) {
                    node.name = prefix + "@" + node.name;
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

    Undo.finishEdit(`添加骨骼前缀: "${prefix}"`);

    // 显示操作结果
    if (totalModified > 0) {
        Blockbench.showQuickMessage(`成功添加前缀"${prefix}"到${totalModified}个骨骼`);
    } else {
        Blockbench.showQuickMessage('没有骨骼需要添加前缀（可能已存在相同前缀）');
    }

    // 更新界面
    updateInterface();
}
