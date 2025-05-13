/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/actions/animation-export.ts":
/*!*****************************************!*\
  !*** ./src/actions/animation-export.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   addAnimationPrefixAction: () => (/* binding */ addAnimationPrefixAction)\n/* harmony export */ });\n/**\n * 注册添加骨骼前缀的动作\n */\nfunction addAnimationPrefixAction() {\n    const action = new Action('export_animation_without_prefix', {\n        name: '动画导出（过滤前缀)',\n        icon: 'text_fields',\n        click: function () {\n            onClick();\n        }\n    });\n    MenuBar.addAction(action, 'tools');\n}\nfunction onClick() {\n    // 检查是否有选中的动画\n    if (!AnimationItem.selected) {\n        Blockbench.showQuickMessage('请先选择一个动画');\n        return;\n    }\n    // 编译基岩版动画\n    const animationData = AnimationItem.selected.compileBedrockAnimation();\n    if (!animationData) {\n        Blockbench.showQuickMessage('无法编译动画数据');\n        return;\n    }\n    // 获取动画名称作为文件名\n    const animationName = AnimationItem.selected.name || 'animation';\n    const fileName = `${animationName}.json`;\n    // 遍历去除前缀（通过@分割）\n    for (const key in animationData.bones) {\n        if (key.indexOf(\"@\") !== -1) {\n            const newKey = key.split(\"@\")[1];\n            animationData.bones[newKey] = animationData.bones[key];\n            delete animationData.bones[key];\n        }\n    }\n    const json = {\n        \"format_version\": \"1.10\",\n        \"animations\": {\n            [animationName]: animationData\n        }\n    };\n    // 导出动画数据\n    Blockbench.export({\n        type: 'Bedrock Animation',\n        extensions: ['json'],\n        name: fileName,\n        content: JSON.stringify(json, null, 2),\n        savetype: 'text'\n    }, (path) => {\n        if (path) {\n            Blockbench.showQuickMessage(`成功导出动画到 ${path}`);\n        }\n    });\n}\n\n\n//# sourceURL=webpack://movie-tool/./src/actions/animation-export.ts?");

/***/ }),

/***/ "./src/actions/bone-prefix.ts":
/*!************************************!*\
  !*** ./src/actions/bone-prefix.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   addBonePrefixAction: () => (/* binding */ addBonePrefixAction),\n/* harmony export */   addPrefixToBones: () => (/* binding */ addPrefixToBones),\n/* harmony export */   detectBonePrefix: () => (/* binding */ detectBonePrefix)\n/* harmony export */ });\n/* harmony import */ var _dialogs_prefix_dialog__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dialogs/prefix-dialog */ \"./src/dialogs/prefix-dialog.ts\");\n/* harmony import */ var _utils_interface__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/interface */ \"./src/utils/interface.ts\");\n\n\n/**\n * 注册添加骨骼前缀的动作\n */\nfunction addBonePrefixAction() {\n    MenuBar.addAction(new Action('add_bone_prefix', {\n        name: '添加/修改骨骼前缀',\n        icon: 'text_fields',\n        click: function () {\n            (0,_dialogs_prefix_dialog__WEBPACK_IMPORTED_MODULE_0__.showPrefixDialog)();\n        }\n    }), 'tools');\n}\n/**\n * 检测骨骼的前缀\n * @param bones 要检测的骨骼列表\n * @returns 检测到的公共前缀，如果没有则返回空字符串\n */\nfunction detectBonePrefix(bones) {\n    if (!bones || bones.length === 0)\n        return '';\n    let commonPrefix = '';\n    let isFirst = true;\n    bones.forEach(bone => {\n        const parts = bone.name.split('@');\n        if (parts.length > 1) {\n            // 有前缀\n            const prefix = parts[0];\n            if (isFirst) {\n                commonPrefix = prefix;\n                isFirst = false;\n            }\n            else if (commonPrefix !== prefix) {\n                // 如果发现不同的前缀，清空commonPrefix\n                commonPrefix = '';\n            }\n        }\n        else if (isFirst) {\n            // 第一个骨骼没有前缀\n            isFirst = false;\n        }\n        else {\n            // 有的骨骼没有前缀，与其他可能有前缀的骨骼不一致\n            commonPrefix = '';\n        }\n    });\n    return commonPrefix;\n}\n/**\n * 递归添加或修改前缀到骨骼及其子骨骼\n * @param bones 要处理的骨骼列表\n * @param prefix 要添加的前缀\n */\nfunction addPrefixToBones(bones, prefix) {\n    Undo.initEdit({ outliner: true });\n    let totalModified = 0;\n    let totalUpdated = 0;\n    bones.forEach(bone => {\n        // 递归处理函数\n        function processBone(node) {\n            if (node instanceof Group) {\n                const nameParts = node.name.split('@');\n                if (nameParts.length > 1) {\n                    // 已有前缀，需要更新\n                    if (nameParts[0] !== prefix) {\n                        node.name = prefix + '@' + nameParts.slice(1).join('@');\n                        totalUpdated++;\n                    }\n                }\n                else {\n                    // 没有前缀，添加新前缀\n                    node.name = prefix + '@' + node.name;\n                    totalModified++;\n                }\n                // 递归处理子骨骼\n                if (node.children) {\n                    node.children.forEach(child => {\n                        processBone(child);\n                    });\n                }\n            }\n        }\n        processBone(bone);\n    });\n    Undo.finishEdit(`添加/修改骨骼前缀: \"${prefix}\"`);\n    // 显示操作结果\n    if (totalModified > 0 || totalUpdated > 0) {\n        let message = `成功处理${totalModified + totalUpdated}个骨骼`;\n        if (totalModified > 0)\n            message += `，新增前缀${totalModified}个`;\n        if (totalUpdated > 0)\n            message += `，更新前缀${totalUpdated}个`;\n        Blockbench.showQuickMessage(message);\n    }\n    else {\n        Blockbench.showQuickMessage('没有骨骼需要添加或修改前缀');\n    }\n    // 更新界面\n    (0,_utils_interface__WEBPACK_IMPORTED_MODULE_1__.updateInterface)();\n}\n\n\n//# sourceURL=webpack://movie-tool/./src/actions/bone-prefix.ts?");

/***/ }),

/***/ "./src/actions/scene-export.ts":
/*!*************************************!*\
  !*** ./src/actions/scene-export.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   addSceneExportAction: () => (/* binding */ addSceneExportAction)\n/* harmony export */ });\n/**\n * 注册添加骨骼前缀的动作\n */\nfunction addSceneExportAction() {\n    const action = new Action('export_scene', {\n        name: '场景导出（用于ECCamera）',\n        icon: 'text_fields',\n        click: function () {\n            onClick();\n        }\n    });\n    MenuBar.addAction(action, 'tools');\n}\nfunction onClick() {\n    const json = {\n        length: 0,\n        actors: {},\n        camera: undefined\n    };\n    // 寻找actor实体\n    const animationActor = AnimationItem.all.find((item) => item.name === 'actors');\n    if (animationActor) {\n        const complatedAnimation = animationActor.getUndoCopy({}, true);\n        Object.values(complatedAnimation.animators).forEach((animator) => {\n            if (animator.name.indexOf('@') !== -1) {\n                // 截取@前的部分\n                const key = animator.name.split('@')[0];\n                const actorData = {\n                    keyframes: animator.keyframes\n                };\n                json.actors[key] = actorData;\n            }\n            else {\n                const key = animator.name;\n                const actorData = {\n                    keyframes: animator.keyframes\n                };\n                json.actors[key] = actorData;\n            }\n        });\n    }\n    else {\n        Blockbench.showQuickMessage('没有找到人物实体动画，请确保「动画名称」为「actors」');\n    }\n    const clientAnimationJson = {\n        \"format_version\": \"1.10\",\n        \"animations\": {}\n    };\n    // 寻找actor客户端动画\n    const clientAnimations = AnimationItem.all.filter((item) => item.name.startsWith(\"animation.\"));\n    for (const animation of clientAnimations) {\n        const complatedAnimation = animation.getUndoCopy({}, true);\n        const animationName = complatedAnimation.name;\n        const animatorNames = Object.values(complatedAnimation.animators).map((animator) => animator.name);\n        // 检查内部是否每一个都包含@\n        const hasPrefix = animatorNames.every((name) => name.indexOf('@') !== -1);\n        if (!hasPrefix) {\n            Blockbench.showQuickMessage(`人物客户端动画 ${animationName} 内部存在不包含@的目标，这会导致无法正确播放，请检查`);\n        }\n        // 分割得到@前的部分，然后group为key以及对应数量，得到最大数量的那个\n        const actorName = animatorNames.map((name) => name.split('@')[0]);\n        const actorCount = {};\n        actorName.forEach((name) => {\n            if (actorCount[name]) {\n                actorCount[name]++;\n            }\n            else {\n                actorCount[name] = 1;\n            }\n        });\n        const maxActorName = Object.keys(actorCount).reduce((a, b) => actorCount[a] > actorCount[b] ? a : b);\n        if (json.actors[maxActorName]) {\n            json.actors[maxActorName].client_aimation = animationName;\n        }\n        else {\n            json.actors[maxActorName] = {\n                client_aimation: animationName\n            };\n        }\n        // 编译基岩版动画\n        const compliedData = animation.compileBedrockAnimation();\n        if (!compliedData) {\n            Blockbench.showQuickMessage('无法编译动画数据');\n            continue;\n        }\n        // 遍历去除前缀（通过@分割）\n        for (const key in compliedData.bones) {\n            if (key.indexOf(\"@\") !== -1) {\n                const newKey = key.split(\"@\")[1];\n                compliedData.bones[newKey] = compliedData.bones[key];\n                delete compliedData.bones[key];\n            }\n        }\n        clientAnimationJson.animations[animationName] = compliedData;\n    }\n    // 寻找相机动画\n    const animationCamera = AnimationItem.all.find((item) => item.name === 'camera');\n    if (animationCamera) {\n        const complatedAnimation = animationCamera.getUndoCopy({}, true);\n        const animatorCamera = Object.values(complatedAnimation.animators).find((a) => a.name === 'camera');\n        if (animatorCamera) {\n            json.length = complatedAnimation.length;\n            json.camera = {\n                keyframes: animatorCamera.keyframes\n            };\n        }\n        else {\n            Blockbench.showQuickMessage('没有找到相机动画，请确保「动画名称」和「相机名称」均为「camera」');\n        }\n    }\n    else {\n        Blockbench.showQuickMessage('没有找到相机动画，请确保「动画名称」和「相机名称」均为「camera」');\n    }\n    // 导出场景数据\n    Blockbench.export({\n        type: 'ECCamera Scene',\n        extensions: ['json'],\n        name: ((Project === null || Project === void 0 ? void 0 : Project.name) || 'scene') + '.scene.json',\n        content: JSON.stringify(json, null, 2),\n        savetype: 'text'\n    }, (path) => {\n        if (path) {\n            Blockbench.showQuickMessage(`成功导出场景到 ${path}`);\n        }\n    });\n    // 导出客户端动画\n    if (Object.keys(clientAnimationJson.animations).length > 0) {\n        Blockbench.export({\n            type: 'ECCamera Client Animation',\n            extensions: ['json'],\n            name: ((Project === null || Project === void 0 ? void 0 : Project.name) || 'animation') + '.animation.json',\n            content: JSON.stringify(clientAnimationJson, null, 2),\n            savetype: 'text'\n        }, (path) => {\n            if (path) {\n                Blockbench.showQuickMessage(`成功导出客户端动画到 ${path}`);\n            }\n        });\n    }\n}\n\n\n//# sourceURL=webpack://movie-tool/./src/actions/scene-export.ts?");

/***/ }),

/***/ "./src/dialogs/prefix-dialog.ts":
/*!**************************************!*\
  !*** ./src/dialogs/prefix-dialog.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   showPrefixDialog: () => (/* binding */ showPrefixDialog)\n/* harmony export */ });\n/* harmony import */ var _actions_bone_prefix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../actions/bone-prefix */ \"./src/actions/bone-prefix.ts\");\n\n/**\n * 显示前缀输入对话框\n */\nfunction showPrefixDialog() {\n    // 检查是否有选中的骨骼\n    const selected_bones = Group.multi_selected;\n    if (selected_bones.length === 0) {\n        Blockbench.showQuickMessage('错误：请先选择至少一个骨骼！');\n        return;\n    }\n    // 检测已有的前缀\n    const existingPrefix = (0,_actions_bone_prefix__WEBPACK_IMPORTED_MODULE_0__.detectBonePrefix)(selected_bones);\n    const hasPrefix = existingPrefix !== '';\n    // 打开输入对话框\n    const dialog = new Dialog({\n        id: 'bone_prefix_dialog',\n        title: hasPrefix ? '修改骨骼前缀' : '添加骨骼前缀',\n        width: 400,\n        form: {\n            prefix: {\n                label: '前缀',\n                type: 'text',\n                value: existingPrefix\n            }\n        },\n        buttons: [\n            'confirm',\n            'cancel'\n        ],\n        onConfirm: function (formData) {\n            if (!formData.prefix || formData.prefix.trim() === '') {\n                Blockbench.showQuickMessage('错误：请输入有效的前缀！');\n                return;\n            }\n            // 为选中的骨骼添加或修改前缀\n            (0,_actions_bone_prefix__WEBPACK_IMPORTED_MODULE_0__.addPrefixToBones)(selected_bones, formData.prefix.trim());\n            dialog.hide();\n        }\n    });\n    dialog.show();\n}\n\n\n//# sourceURL=webpack://movie-tool/./src/dialogs/prefix-dialog.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _plugin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./plugin */ \"./src/plugin.ts\");\n\n// 立即执行函数包装\n(function () {\n    // 注册插件\n    (0,_plugin__WEBPACK_IMPORTED_MODULE_0__.registerPlugin)();\n})();\n\n\n//# sourceURL=webpack://movie-tool/./src/index.ts?");

/***/ }),

/***/ "./src/plugin.ts":
/*!***********************!*\
  !*** ./src/plugin.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   registerPlugin: () => (/* binding */ registerPlugin)\n/* harmony export */ });\n/* harmony import */ var _actions_animation_export__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./actions/animation-export */ \"./src/actions/animation-export.ts\");\n/* harmony import */ var _actions_bone_prefix__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./actions/bone-prefix */ \"./src/actions/bone-prefix.ts\");\n/* harmony import */ var _actions_scene_export__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./actions/scene-export */ \"./src/actions/scene-export.ts\");\n\n\n\n/**\n * 注册插件\n */\nfunction registerPlugin() {\n    Plugin.register('scene-tool', {\n        name: 'Scene Tool',\n        author: 'EaseCation',\n        description: '使用BlockBench制作场景动画的工具',\n        version: '1.0.0',\n        variant: 'both',\n        onload() {\n            // 注册所有动作\n            (0,_actions_bone_prefix__WEBPACK_IMPORTED_MODULE_1__.addBonePrefixAction)();\n            (0,_actions_animation_export__WEBPACK_IMPORTED_MODULE_0__.addAnimationPrefixAction)();\n            (0,_actions_scene_export__WEBPACK_IMPORTED_MODULE_2__.addSceneExportAction)();\n        }\n    });\n}\n\n\n//# sourceURL=webpack://movie-tool/./src/plugin.ts?");

/***/ }),

/***/ "./src/utils/interface.ts":
/*!********************************!*\
  !*** ./src/utils/interface.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   updateInterface: () => (/* binding */ updateInterface)\n/* harmony export */ });\n/**\n * 更新界面显示\n */\nfunction updateInterface() {\n    // 更新大纲视图\n    //Outliner.update();\n    // 更新3D视图\n    Canvas.updateAll();\n}\n\n\n//# sourceURL=webpack://movie-tool/./src/utils/interface.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;