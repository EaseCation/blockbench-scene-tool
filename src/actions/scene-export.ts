/**
 * 注册添加骨骼前缀的动作
 */
export function addSceneExportAction(): void {
    const action = new Action('export_scene', {
        name: '场景导出（用于ECCamera）',
        icon: 'text_fields',
        click: function () {
            onClick();
        }
    });
    MenuBar.addAction(action, 'tools');
}

interface AnimationUndoCopy {
    uuid: string
    name: string
    loop: boolean
    override: boolean
    anim_time_update: any
    blend_weight: any
    length: number
    snapping: boolean
    selected: boolean
    animators: {
        [key: string]: GeneralAnimator
    }
}

interface SceneExport {
    length: number
    actors: {
        [key: string]: {
            client_aimation?: string,
            keyframes?: _Keyframe[]
        }
    }
    camera?: {
        keyframes: _Keyframe[]
    }
}

function onClick() {
    const json: SceneExport = {
        length: 0,
        actors: {},
        camera: undefined
    }

    // 寻找actor实体
    const animationActor: _Animation | undefined = AnimationItem.all.find((item) => item.name === 'actors');
    if (animationActor) {
        const complatedAnimation = animationActor.getUndoCopy({}, true) as AnimationUndoCopy;

        Object.values(complatedAnimation.animators).forEach((animator) => {
            if (animator.name.indexOf('@') !== -1) {
                // 截取@前的部分
                const key = animator.name.split('@')[0];
                const actorData = {
                    keyframes: animator.keyframes
                }
                json.actors[key] = actorData;
            } else {
                const key = animator.name;
                const actorData = {
                    keyframes: animator.keyframes
                }
                json.actors[key] = actorData;
            }
        });
    } else {
        Blockbench.showQuickMessage('没有找到人物实体动画，请确保「动画名称」为「actors」');
    }

    const clientAnimationJson: {
        format_version: "1.10"
        animations: {
            [key: string]: any
        }
    } = {
        "format_version": "1.10",
        "animations": {}
    }

    // 寻找actor客户端动画
    const clientAnimations: _Animation[] = AnimationItem.all.filter((item) => item.name.startsWith("animation."));
    for (const animation of clientAnimations) {
        const complatedAnimation = animation.getUndoCopy({}, true) as AnimationUndoCopy;
        const animationName = complatedAnimation.name;
        const animatorNames = Object.values(complatedAnimation.animators).map((animator) => animator.name);
        // 检查内部是否每一个都包含@
        const hasPrefix = animatorNames.every((name) => name.indexOf('@') !== -1);
        if (!hasPrefix) {
            Blockbench.showQuickMessage(`人物客户端动画 ${animationName} 内部存在不包含@的目标，这会导致无法正确播放，请检查`);
        }
        // 分割得到@前的部分，然后group为key以及对应数量，得到最大数量的那个
        const actorName = animatorNames.map((name) => name.split('@')[0]);
        const actorCount: { [key: string]: number } = {};
        actorName.forEach((name) => {
            if (actorCount[name]) {
                actorCount[name]++;
            } else {
                actorCount[name] = 1;
            }
        });
        const maxActorName = Object.keys(actorCount).reduce((a, b) => actorCount[a] > actorCount[b] ? a : b);
        if (json.actors[maxActorName]) {
            json.actors[maxActorName].client_aimation = animationName;
        } else {
            json.actors[maxActorName] = {
                client_aimation: animationName
            }
        }

        // 编译基岩版动画
        const compliedData = animation.compileBedrockAnimation();
        if (!compliedData) {
            Blockbench.showQuickMessage('无法编译动画数据');
            continue;
        }
        // 遍历去除前缀（通过@分割）
        for (const key in compliedData.bones) {
            if (key.indexOf("@") !== -1) {
                const newKey = key.split("@")[1];
                compliedData.bones[newKey] = compliedData.bones[key];
                delete compliedData.bones[key];
            }
        }

        clientAnimationJson.animations[animationName] = compliedData;
    }
    
    // 寻找相机动画
    const animationCamera: _Animation | undefined = AnimationItem.all.find((item) => item.name === 'camera');
    if (animationCamera) {
        const complatedAnimation = animationCamera.getUndoCopy({}, true) as AnimationUndoCopy;
        const animatorCamera = Object.values(complatedAnimation.animators).find((a) => a.name === 'camera');
        if (animatorCamera) {
            json.length = complatedAnimation.length;
            json.camera = {
                keyframes: animatorCamera.keyframes
            }
        } else {
            Blockbench.showQuickMessage('没有找到相机动画，请确保「动画名称」和「相机名称」均为「camera」');
        }
    } else {
        Blockbench.showQuickMessage('没有找到相机动画，请确保「动画名称」和「相机名称」均为「camera」');
    }

    // 导出场景数据
    Blockbench.export({
        type: 'ECCamera Scene',
        extensions: ['json'],
        name: (Project?.name || 'scene') + '.scene.json',
        content: JSON.stringify(json, null, 2),
        savetype: 'text'
    }, (path) => {
        if (path) {
            Blockbench.showQuickMessage(`成功导出场景到 ${path}`);
        }
    });

    // 导出客户端动画
    if (Object.keys(clientAnimationJson.animations).length > 0) {
        Blockbench.export({
            type: 'ECCamera Client Animation',
            extensions: ['json'],
            name: (Project?.name || 'animation') + '.animation.json',
            content: JSON.stringify(clientAnimationJson, null, 2),
            savetype: 'text'
        }, (path) => {
            if (path) {
                Blockbench.showQuickMessage(`成功导出客户端动画到 ${path}`);
            }
        });
    }

}