// converter_tool.js

// 单位与米（m）的换算关系
const unitConversions = {
    'mm': 0.001,
    'cm': 0.01,
    'm': 1,
    'km': 1000,
    'in': 0.0254, // 1 inch = 0.0254 meters
    'ft': 0.3048,  // 1 foot = 0.3048 meters
    'yd': 0.9144,  // 1 yard = 0.9144 meters
    'mi': 1609.34  // 1 mile = 1609.34 meters
};


import { setLanguage, currentLanguage, loadTranslations as commonLoadTranslations } from '/common.js'; // 导入 common.js 的函数

let inputValueEl, inputUnitEl, outputUnitEl, outputResultEl, swapUnitsBtn;
// 移除 langSelector, 因为它在此文件中未被初始化或使用
let isInitialized = false; // 标记是否已经初始化
let translations = {}; // 存储加载的语言包

// 异步加载语言文件并应用翻译
/*
async function loadAndApplyTranslations(lang) {
    try {
        const response = await fetch(`./lang/${lang}.json`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        translations = await response.json();
        currentLanguage = lang; // 确保 currentLanguage 同步
        applyTranslations(); // 加载成功后立即应用翻译

        // 如果工具已经初始化，重新执行一次转换以更新错误信息等
        if (isInitialized) {
            convertLength();
        }
        return true;
    } catch (error) {
        console.error(`Failed to load translations for ${lang}:`, error);
        return false;
    }
}*/

// 应用翻译到页面元素
/* 
function applyTranslations() {
    // 翻译常规文本内容
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.dataset.i18n;
        if (translations[key]) {
            element.textContent = translations[key];
        }
    });

    // 翻译 placeholder 属性
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.dataset.i18nPlaceholder;
        if (translations[key]) {
            element.placeholder = translations[key];
        }
    });

    // 特殊处理单位下拉菜单的选项
    const units = ['mm', 'cm', 'm', 'km', 'in', 'ft', 'yd', 'mi'];
    units.forEach(unit => {
        const optionEls = document.querySelectorAll(`#inputUnit option[value="${unit}"], #outputUnit option[value="${unit}"]`);
        optionEls.forEach(optionEl => {
            const key = `unit_${unit}`;
            if (translations[key]) {
                optionEl.textContent = translations[key];
            }
        });
    });

    // 更新页面标题和 meta 描述（如果它们有 data-i18n 属性并且已经被加载）
    const titleElement = document.querySelector('title');
    if (titleElement && titleElement.dataset.i18n && translations[titleElement.dataset.i18n]) {
        titleElement.textContent = translations[titleElement.dataset.i18n];
    }
    const metaDescriptionElement = document.querySelector('meta[name="description"]');
    if (metaDescriptionElement && metaDescriptionElement.dataset.i18n && translations[metaDescriptionElement.dataset.i18n]) {
        metaDescriptionElement.setAttribute('content', translations[metaDescriptionElement.dataset.i18n]);
    }
}
*/



// 初始化元素和事件监听器
function initializeElements() {
    if (isInitialized) {
        return;
    }

    inputValueEl = document.getElementById('inputValue');
    inputUnitEl = document.getElementById('inputUnit');
    outputUnitEl = document.getElementById('outputUnit');
    swapUnitsBtn = document.getElementById('swapUnitsBtn');
    outputResultEl = document.getElementById('outputResult');

    if (inputValueEl && inputUnitEl && outputUnitEl && outputResultEl && swapUnitsBtn) {
        inputValueEl.addEventListener('input', convertLength);
        inputUnitEl.addEventListener('change', convertLength);
        outputUnitEl.addEventListener('change', convertLength);
        swapUnitsBtn.addEventListener('click', swapUnits);

        isInitialized = true; // 标记为已初始化
        convertLength(); // 执行一次初始转换
    } else {
        console.warn("Converter elements not found. Ensure the HTML is loaded before initializing.");
    }
}

//单位换算
function convertLength() {
    if (!inputValueEl || !outputResultEl) {
        return;
    }

    const inputValue = parseFloat(inputValueEl.value);
    const inputUnit = inputUnitEl.value;
    const outputUnit = outputUnitEl.value;

    if (isNaN(inputValue)) {
        outputResultEl.textContent = translations['error_invalid_number'] || '请输入一个有效数字';
        return;
    }

    const valueInMeters = inputValue * unitConversions[inputUnit];
    const convertedValue = valueInMeters / unitConversions[outputUnit];

    if (convertedValue < 0.0001 && convertedValue !== 0) {
        outputResultEl.textContent = convertedValue.toExponential(4) + ' ' + outputUnit;
    } else if (convertedValue >= 1000000 || convertedValue < 0.001) {
         outputResultEl.textContent = convertedValue.toPrecision(6) + ' ' + outputUnit;
    }
    else {
        outputResultEl.textContent = convertedValue.toFixed(4).replace(/\.?0+$/, '') + ' ' + outputUnit;
    }
}

//交换单位
function swapUnits() {
    if (!inputUnitEl || !outputUnitEl) {
        return;
    }
    const currentInputUnit = inputUnitEl.value;
    const currentOutputUnit = outputUnitEl.value;

    inputUnitEl.value = currentOutputUnit;
    outputUnitEl.value = currentInputUnit;

    convertLength();
}


// 将初始化逻辑封装在一个可导出的函数中
export async function initMeterToCmConverter(input, output) {
    // 转换工具的 HTML 现在是静态的，所以我们只需要初始化元素
    initializeElements();

    // 默认设置为米到厘米，如果需要
    if (inputUnitEl && outputUnitEl) {
        if(input)
            inputUnitEl.value = input;
        else
            inputUnitEl.value = 'm';
        if(output)
            outputUnitEl.value = output;
        else
            outputUnitEl.value = 'cm';
        convertLength();
    }
}