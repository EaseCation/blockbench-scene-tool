/**
 * 注册添加骨骼前缀的动作
 */
export function addAnimationPrefixAction(): void {
    const action = new Action('export_animation_without_prefix', {
        name: '动画导出（过滤前缀)',
        icon: 'save',
        click: function () {
            onClick();
        }
    });
    MenuBar.addAction(action, 'tools');
}

function onClick() {
    // 检查是否有选中的动画
    if (!AnimationItem.selected) {
        Blockbench.showQuickMessage('请先选择一个动画');
        return;
    }
    
    // 编译基岩版动画
    const animationData = AnimationItem.selected.compileBedrockAnimation();
    if (!animationData) {
        Blockbench.showQuickMessage('无法编译动画数据');
        return;
    }
    
    // 获取动画名称作为文件名
    const animationName = AnimationItem.selected.name || 'animation';
    const fileName = `${animationName}.json`;

    // 遍历去除前缀（通过@分割）
    for (const key in animationData.bones) {
        if (key.indexOf("@") !== -1) {
            const newKey = key.split("@")[1];
            animationData.bones[newKey] = animationData.bones[key];
            delete animationData.bones[key];
        }
    }

    const json = {
        "format_version": "1.10",
        "animations": {
            [animationName]: animationData
        }
    }
    
    // 导出动画数据
    Blockbench.export({
        type: 'Bedrock Animation',
        extensions: ['json'],
        name: fileName,
        content: JSON.stringify(json, null, 2),
        savetype: 'text'
    }, (path) => {
        if (path) {
            Blockbench.showQuickMessage(`成功导出动画到 ${path}`);
        }
    });
}