/**
 * 注册添加骨骼前缀的动作
 */
export function addIgnoreTexturesSaveMenu(): void {
    const action = new Action('', {
        name: '强制忽略本地保存贴图',
        icon: 'icon-saved',
        click: function () {
            onClick();
        }
    });
    MenuBar.addAction(action, 'tools');
}

function onClick() {
    Texture.all.forEach((texture) => {
        texture.saved = true;
    });
    Blockbench.showQuickMessage('已强制忽略本地保存贴图，但是会继续保存到bbmodel文件中');
}