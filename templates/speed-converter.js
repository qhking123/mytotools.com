// speed-converter.js

// K_ADDED_CODE

export function initSpeedConverter(fromUnit, toUnit, inputDefaultVal) {
    const speedInput = document.getElementById('speed-input');
    const fromSpeedUnitSelect = document.getElementById('from-speed-unit');
    const toSpeedUnitSelect = document.getElementById('to-speed-unit');
    const speedResultInput = document.getElementById('speed-result');
    const swapUnitsButton = document.getElementById('swap-speed-units');
    const speedFormulaDiv = document.getElementById('speed-formula');

    // 默认设置为米到厘米，如果需要
    if (fromSpeedUnitSelect) {
        if(fromUnit)
            fromSpeedUnitSelect.value = fromUnit;
        else
            fromSpeedUnitSelect.value = 'knot';
    }

    if (toSpeedUnitSelect) {        
        if(toUnit)
            toSpeedUnitSelect.value = toUnit;
        else
            toSpeedUnitSelect.value = 'mph';
    }

    if (speedInput) {
        if(inputDefaultVal)
            speedInput.value = inputDefaultVal;        
    }

    // Conversion factors to convert all units to Meters per Second (m/s) as a base
    // Then convert from m/s to target unit
    const conversionFactors = {
        'm/s': 1,
        'm/h': 1 / 3600,
        'm/min': 1 / 60,
        'km/h': 1000 / 3600, // 1 km/h = 0.277778 m/s
        'km/min': 1000 / 60, // 1 km/min = 16.6667 m/s
        'km/s': 1000,
        'cm/h': 0.01 / 3600,
        'cm/min': 0.01 / 60,
        'cm/s': 0.01,
        'mm/h': 0.001 / 3600,
        'mm/min': 0.001 / 60,
        'mm/s': 0.001,
        'mph': 1609.34 / 3600, // 1 mph = 0.44704 m/s
        'mpmin': 1609.34 / 60, // 1 mile/min = 26.8224 m/s
        'mps': 1609.34, // 1 mile/s = 1609.34 m/s
        'in/h': 0.0254 / 3600,
        'in/min': 0.0254 / 60,
        'in/s': 0.0254,
        'ft/h': 0.3048 / 3600,
        'ft/min': 0.3048 / 60,
        'ft/s': 0.3048,
        'yd/h': 0.9144 / 3600,
        'yd/min': 0.9144 / 60,
        'yd/s': 0.9144,
        'knot': 1852 / 3600, // 1 knot = 0.514444 m/s
        'c': 299792458, // Speed of Light in m/s
        'sound': 343, // Speed of Sound in air at 20°C in m/s (approx)
        'mach': 343 // 1 Mach is approx 343 m/s at sea level, 20°C
    };

    const unitSymbols = {
        'm/s': 'm/s (Meters per Second)',
        'm/h': 'm/h (Meters per Hour)',
        'm/min': 'm/min (Meters per Minute)',
        'km/h': 'km/h (Kilometers per Hour)',
        'km/min': 'km/min (Kilometers per Minute)',
        'km/s': 'km/s (Kilometers per Second)',
        'cm/h': 'cm/h (Centimeters per Hour)',
        'cm/min': 'cm/min (Centimeters per Minute)',
        'cm/s': 'cm/s (Centimeters per Second)',
        'mm/h': 'mm/h (Millimeters per Hour)',
        'mm/min': 'mm/min (Millimeters per Minute)',
        'mm/s': 'mm/s (Millimeters per Second)',
        'mph': 'mph (Miles per Hour)',
        'mpmin': 'mpmin (Miles per Minute)',
        'mps': 'mps (Miles per Second)',
        'in/h': 'in/h (Inches per Hour)',
        'in/min': 'in/min (Inches per Minute)',
        'in/s': 'in/s (Inches per Second)',
        'ft/h': 'ft/h (Feet per Hour)',
        'ft/min': 'ft/min (Feet per Minute)',
        'ft/s': 'ft/s (Feet per Second)',
        'yd/h': 'yd/h (Yards per Hour)',
        'yd/min': 'yd/min (Yards per Minute)',
        'yd/s': 'yd/s (Yards per Second)',
        'knot': 'kn (Knot)',
        'c': 'c (Speed of Light)',
        'sound': 'sound (Speed of Sound)',
        'mach': 'Mach (Mach)'
    };


    function convertSpeed() {
        const inputValue = parseFloat(speedInput.value);
        const fromUnit = fromSpeedUnitSelect.value;
        const toUnit = toSpeedUnitSelect.value;

        if (isNaN(inputValue)) {
            speedResultInput.value = '';
            speedFormulaDiv.innerHTML = '';
            return;
        }

        // Convert input value to the base unit (m/s)
        const valueInMps = inputValue * conversionFactors[fromUnit];

        // Convert from base unit (m/s) to the target unit
        let result = valueInMps / conversionFactors[toUnit];

        speedResultInput.value = result.toPrecision(8); // Display with good precision
        updateFormula(inputValue, fromUnit, result, toUnit);
    }

    function updateFormula(value, fromUnit, result, toUnit) {
        let formulaText = '';
        const fromSymbol = unitSymbols[fromUnit];
        const toSymbol = unitSymbols[toUnit];

        if (fromUnit === toUnit) {
            formulaText = `${value} ${fromSymbol} = ${result} ${toSymbol}\nNo conversion needed for the same unit.`;
        } else {
            // General formula: Value_From * (Factor_From / Factor_To) = Value_To
            const factorFrom = conversionFactors[fromUnit];
            const factorTo = conversionFactors[toUnit];

            formulaText = `Formula: ${value} ${fromSymbol} = X ${toSymbol}\n`;
            formulaText += `X = ${value} ${fromSymbol} * (${factorFrom} m/s / ${factorTo} m/s)\n`;
            formulaText += `X = ${value} * (${factorFrom / factorTo})\n`;
            formulaText += `X = ${result.toPrecision(8)} ${toSymbol}`;

            // Add specific details for commonly known conversions if applicable
            if (fromUnit === 'mph' && toUnit === 'km/h') {
                formulaText += `\n(1 mile = 1.60934 kilometers)`;
            } else if (fromUnit === 'km/h' && toUnit === 'mph') {
                formulaText += `\n(1 kilometer = 0.621371 miles)`;
            } else if (fromUnit === 'knot' && toUnit === 'km/h') {
                formulaText += `\n(1 knot = 1.852 km/h)`;
            } else if (fromUnit === 'knot' && toUnit === 'mph') {
                formulaText += `\n(1 knot = 1.15078 mph)`;
            }
        }
        speedFormulaDiv.textContent = formulaText;
    }

    function swapUnits() {
        const currentFrom = fromSpeedUnitSelect.value;
        const currentTo = toSpeedUnitSelect.value;

        fromSpeedUnitSelect.value = currentTo;
        toSpeedUnitSelect.value = currentFrom;
        convertSpeed(); // Perform conversion with swapped units
    }

    // Event Listeners
    speedInput.addEventListener('input', convertSpeed);
    fromSpeedUnitSelect.addEventListener('change', convertSpeed);
    toSpeedUnitSelect.addEventListener('change', convertSpeed);
    swapUnitsButton.addEventListener('click', swapUnits);

    // Initial conversion on page load
    convertSpeed();
}
// K_ADDED_CODE_END