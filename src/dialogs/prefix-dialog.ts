import { addPrefixToBones, detectBonePrefix } from '../actions/bone-prefix';

/**
 * 显示前缀输入对话框
 */
export function showPrefixDialog(): void {
    // 检查是否有选中的骨骼
    const selected_bones: Group[] = Group.multi_selected;
    if (selected_bones.length === 0) {
        Blockbench.showQuickMessage('错误：请先选择至少一个骨骼！');
        return;
    }

    // 检测已有的前缀
    const existingPrefix = detectBonePrefix(selected_bones);
    const hasPrefix = existingPrefix !== '';
    
    // 打开输入对话框
    const dialog = new Dialog({
        id: 'bone_prefix_dialog',
        title: hasPrefix ? '修改骨骼前缀' : '添加骨骼前缀',
        width: 400,
        form: {
            prefix: { 
                label: '前缀', 
                type: 'text',
                value: existingPrefix
            }
        },
        buttons: [
            'confirm',
            'cancel'
        ],
        onConfirm: function (formData) {
            if (!formData.prefix || formData.prefix.trim() === '') {
                Blockbench.showQuickMessage('错误：请输入有效的前缀！');
                return;
            }

            // 为选中的骨骼添加或修改前缀
            addPrefixToBones(selected_bones, formData.prefix.trim());
            dialog.hide();
        }
    });
    dialog.show();
}
