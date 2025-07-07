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

let inputValueEl, inputUnitEl, outputUnitEl, outputResultEl, swapUnitsBtn;
// 移除 langSelector, 因为它在此文件中未被初始化或使用
let isInitialized = false; // 标记是否已经初始化
let translations = {}; // 存储加载的语言包


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
export async function initMeterToCmConverter(fromUnit, toUnit, inputDefaultVal) {
    // 转换工具的 HTML 现在是静态的，所以我们只需要初始化元素
    initializeElements();

    // 默认设置为米到厘米，如果需要
    if (inputUnitEl) {
        if(fromUnit)
            inputUnitEl.value = fromUnit;
        else
            inputUnitEl.value = 'm';
    }

    if (outputUnitEl) {        
        if(toUnit)
            outputUnitEl.value = toUnit;
        else
            outputUnitEl.value = 'cm';
    }

    if (inputValueEl) {
        if(inputDefaultVal)
            inputValueEl.value = inputDefaultVal;        
    }
    
    convertLength();
}