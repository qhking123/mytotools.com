// area-converter.js

export function initAreaConverter(fromUnit, toUnit, inputDefaultVal) {
    const fromAreaValue = document.getElementById('fromAreaValue');
    const fromAreaUnit = document.getElementById('fromAreaUnit');
    const toAreaValue = document.getElementById('toAreaValue');
    const toAreaUnit = document.getElementById('toAreaUnit');
    const swapAreaUnitsButton = document.getElementById('swapAreaUnits');
    const conversionFormula = document.getElementById('conversionFormula');

    // 默认设置为米到厘米，如果需要
    if (fromAreaUnit) {
        if(fromUnit)
            fromAreaUnit.value = fromUnit;
        else
            fromAreaUnit.value = 'sq_meter';
    }

    if (toAreaUnit) {        
        if(toUnit)
            toAreaUnit.value = toUnit;
        else
            toAreaUnit.value = 'sq_foot';
    }

    if (fromAreaValue) {
        if(inputDefaultVal)
            fromAreaValue.value = inputDefaultVal;        
    }

    // Conversion factors to square meters (m²)
    const conversionFactors = {
        sq_meter: 1,
        sq_kilometer: 1e6, // 1 km² = 1,000,000 m²
        sq_centimeter: 1e-4, // 1 cm² = 0.0001 m²
        sq_millimeter: 1e-6, // 1 mm² = 0.000001 m²
        sq_micrometer: 1e-12, // 1 µm² = 1e-12 m²
        hectare: 1e4, // 1 hectare = 10,000 m²
        acre: 4046.8564224, // 1 acre = 4046.8564224 m²
        sq_mile: 2.589988110336e6, // 1 mi² = 2,589,988.110336 m²
        sq_yard: 0.83612736, // 1 yd² = 0.83612736 m²
        sq_foot: 0.09290304, // 1 ft² = 0.09290304 m²
        sq_inch: 0.00064516, // 1 in² = 0.00064516 m²
        sq_decameter: 100, // 1 dam² = 100 m² (also known as Are)
        sq_hectometer: 10000, // 1 hm² = 10000 m² (same as hectare)
        sq_decimeter: 0.01, // 1 dm² = 0.01 m²
        sq_nanometer: 1e-18 // 1 nm² = 1e-18 m²
    };

    // Unit symbols for formula display
    const unitSymbols = {
        sq_meter: 'm²',
        sq_kilometer: 'km²',
        sq_centimeter: 'cm²',
        sq_millimeter: 'mm²',
        sq_micrometer: 'µm²',
        hectare: 'ha',
        acre: 'ac',
        sq_mile: 'mi²',
        sq_yard: 'yd²',
        sq_foot: 'ft²',
        sq_inch: 'in²',
        sq_decameter: 'dam²',
        sq_hectometer: 'hm²',
        sq_decimeter: 'dm²',
        sq_nanometer: 'nm²'
    };

    const convertArea = () => {
        const fromValue = parseFloat(fromAreaValue.value);
        const fromUnit = fromAreaUnit.value;
        const toUnit = toAreaUnit.value;

        if (isNaN(fromValue)) {
            toAreaValue.value = '';
            conversionFormula.textContent = 'Please enter a valid number.'; // Hardcoded string
            return;
        }

        const valueInSqMeters = fromValue * conversionFactors[fromUnit];
        const result = valueInSqMeters / conversionFactors[toUnit];
        toAreaValue.value = result.toFixed(10); // Display with reasonable precision

        updateFormula(fromValue, fromUnit, result, toUnit);
    };

    const updateFormula = (fromVal, fromUnitKey, toVal, toUnitKey) => {
        // Get the displayed text from the selected options, which common.js would have translated
        const fromUnitText = fromAreaUnit.options[fromAreaUnit.selectedIndex].textContent;
        const toUnitText = toAreaUnit.options[toAreaUnit.selectedIndex].textContent;

        const fromSymbol = unitSymbols[fromUnitKey];
        const toSymbol = unitSymbols[toUnitKey];

        if (fromUnitKey === toUnitKey) {
            conversionFormula.textContent = 'The units are the same. No conversion needed.'; // Hardcoded string
            return;
        }

        const factor1 = conversionFactors[fromUnitKey];
        const factor2 = conversionFactors[toUnitKey];

        // Construct the formula string using unit symbols and the full translated names from the select options
        const formulaString = `${fromVal} ${fromSymbol} (${fromUnitText}) = ${fromVal} × (${factor1} m² / 1 ${fromUnitText}) ÷ (${factor2} m² / 1 ${toUnitText}) = ${toVal.toFixed(10)} ${toSymbol} (${toUnitText})`;
        
        conversionFormula.textContent = formulaString;
    };

    const swapUnits = () => {
        const currentFromUnit = fromAreaUnit.value;
        const currentToUnit = toAreaUnit.value;

        fromAreaUnit.value = currentToUnit;
        toAreaUnit.value = currentFromUnit;

        convertArea(); // Perform conversion with swapped units
    };

    // Attach event listeners
    fromAreaValue.addEventListener('input', convertArea);
    fromAreaUnit.addEventListener('change', convertArea);
    toAreaUnit.addEventListener('change', convertArea);
    swapAreaUnitsButton.addEventListener('click', swapUnits);

    // Initial conversion on load
    convertArea();
}