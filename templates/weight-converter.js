// weight-converter.js

export function initWeightConverter(input, output, inputDefaultVal) {
    const sourceInput = document.getElementById('sourceWeightInput');
    const sourceUnitSelect = document.getElementById('sourceWeightUnit');
    const targetInput = document.getElementById('targetWeightInput');
    const targetUnitSelect = document.getElementById('targetWeightUnit');
    const swapUnitsBtn = document.getElementById('swapUnitsBtn');
    const resultValueSpan = document.getElementById('resultValue');
    const resultUnitSpan = document.getElementById('resultUnit');

    // 默认设置为米到厘米，如果需要
    if (sourceUnitSelect && targetUnitSelect) {
        if(input)
            sourceUnitSelect.value = input;
        else
            sourceUnitSelect.value = 'kg';
        if(output)
            targetUnitSelect.value = output;
        else
            targetUnitSelect.value = 'lbs';
    }

    if (sourceInput) {
        if(inputDefaultVal)
            sourceInput.value = inputDefaultVal;        
    }

    // Conversion rates relative to Kilograms (kg)
    const conversionRatesToKg = {
        'ug': 1e-9,    // 1 microgram = 1e-9 kg
        'mg': 1e-6,    // 1 milligram = 1e-6 kg
        'g': 0.001,    // 1 gram = 0.001 kg
        'kg': 1,       // 1 kilogram = 1 kg
        'mt': 1000,    // 1 metric ton = 1000 kg
        'oz': 0.0283495, // 1 ounce = 0.0283495 kg
        'lbs': 0.453592, // 1 pound = 0.453592 kg
        'st': 6.35029,  // 1 stone = 6.35029 kg
        'ton': 907.185  // 1 short ton (US) = 907.185 kg
    };

    const convertWeight = () => {
        const sourceValue = parseFloat(sourceInput.value);
        const sourceUnit = sourceUnitSelect.value;
        const targetUnit = targetUnitSelect.value;

        if (isNaN(sourceValue)) {
            targetInput.value = '';
            resultValueSpan.textContent = '';
            resultUnitSpan.textContent = '';
            return;
        }

        // Convert source value to kilograms
        const valueInKg = sourceValue * conversionRatesToKg[sourceUnit];

        // Convert kilograms to target unit
        let targetValue = valueInKg / conversionRatesToKg[targetUnit];

        // Format the output to a reasonable number of decimal places
        // Adjust precision based on magnitude
        if (targetValue === 0) {
            targetValue = 0; // Avoid -0
        } else if (Math.abs(targetValue) < 0.001) {
            targetValue = targetValue.toPrecision(3);
        } else if (Math.abs(targetValue) < 1) {
            targetValue = targetValue.toFixed(6);
        } else if (Math.abs(targetValue) < 100) {
            targetValue = targetValue.toFixed(4);
        } else {
            targetValue = targetValue.toFixed(2);
        }

        targetInput.value = targetValue;
        resultValueSpan.textContent = sourceValue + ' ' + sourceUnitSelect.options[sourceUnitSelect.selectedIndex].textContent + ' = ' + targetValue;
        resultUnitSpan.textContent = targetUnitSelect.options[targetUnitSelect.selectedIndex].textContent;
    };

    const swapUnits = () => {
        const currentSourceUnit = sourceUnitSelect.value;
        const currentTargetUnit = targetUnitSelect.value;

        sourceUnitSelect.value = currentTargetUnit;
        targetUnitSelect.value = currentSourceUnit;
        
        convertWeight(); // Re-run conversion after swapping
    };

    // Event listeners
    sourceInput.addEventListener('input', convertWeight);
    sourceUnitSelect.addEventListener('change', convertWeight);
    targetUnitSelect.addEventListener('change', convertWeight);
    swapUnitsBtn.addEventListener('click', swapUnits);

    // Initial conversion
    convertWeight();

    // Listen for language change events to re-apply unit names from translations
    document.addEventListener('languageChanged', () => {
        convertWeight();
    });
}