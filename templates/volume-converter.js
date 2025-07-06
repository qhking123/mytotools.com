// volume-converter.js

export function initVolumeConverter(fromUnit, toUnit, inputDefaultVal) {
    const volumeInput = document.getElementById('volume-input');
    const volumeUnitFrom = document.getElementById('volume-unit-from');
    const volumeUnitTo = document.getElementById('volume-unit-to');
    const volumeOutput = document.getElementById('volume-output');
    const volumeResultValue = document.getElementById('volume-result-value');
    const swapVolumeUnitsButton = document.getElementById('swap-volume-units');

    // 默认设置为米到厘米，如果需要
    if (volumeUnitFrom) {
        if(fromUnit)
            volumeUnitFrom.value = fromUnit;
        else
            volumeUnitFrom.value = 'liter';
    }

    if (volumeUnitTo) {        
        if(toUnit)
            volumeUnitTo.value = toUnit;
        else
            volumeUnitTo.value = 'gallon-us';
    }

    if (volumeInput) {
        if(inputDefaultVal)
            volumeInput.value = inputDefaultVal;        
    }

    // Conversion rates to Cubic Meter (m³)
    // All units are converted to m³ first, then from m³ to the target unit.
    const volumeConversionRates = {
        'cubic-meter': 1,             // m³
        'cubic-kilometer': 1e9,       // km³ to m³
        'cubic-centimeter': 1e-6,     // cm³ to m³
        'cubic-millimeter': 1e-9,     // mm³ to m³
        'liter': 0.001,               // L to m³
        'milliliter': 1e-6,           // mL to m³
        'gallon-us': 0.00378541,      // US Liquid Gallon to m³
        'quart-us': 0.000946353,      // US Liquid Quart to m³
        'pint-us': 0.000473176,       // US Liquid Pint to m³
        'cup-us': 0.000236588,        // US Legal Cup to m³
        'fluid-ounce-us': 2.95735e-5, // US Fluid Ounce to m³
        'tablespoon-us': 1.47868e-5,  // US Tablespoon to m³
        'teaspoon-us': 4.92892e-6,    // US Teaspoon to m³
        'cubic-mile': 4.16818e9,      // mi³ to m³
        'cubic-yard': 0.764555,       // yd³ to m³
        'cubic-foot': 0.0283168,      // ft³ to m³
        'cubic-inch': 1.63871e-5,     // in³ to m³
        'cubic-decimeter': 0.001,     // dm³ to m³ (same as liter)
        'gallon-uk': 0.00454609,      // UK Imperial Gallon to m³
        'quart-uk': 0.00113652,       // UK Imperial Quart to m³
        'pint-uk': 0.000568261,       // UK Imperial Pint to m³
        'cup-uk': 0.000284131,        // UK Imperial Cup to m³
        'fluid-ounce-uk': 2.84131e-5, // UK Fluid Ounce to m³
        'tablespoon-uk': 1.77582e-5,  // UK Tablespoon to m³
        'teaspoon-uk': 5.91939e-6,    // UK Teaspoon to m³
        'cup-metric': 0.00025,        // Metric Cup to m³
        'tablespoon-metric': 1.5e-5,  // Metric Tablespoon to m³
        'teaspoon-metric': 5e-6       // Metric Teaspoon to m³
    };

    const unitSymbols = {
        'cubic-meter': 'm³',
        'cubic-kilometer': 'km³',
        'cubic-centimeter': 'cm³',
        'cubic-millimeter': 'mm³',
        'liter': 'L',
        'milliliter': 'mL',
        'gallon-us': 'gal (US)',
        'quart-us': 'qt (US)',
        'pint-us': 'pt (US)',
        'cup-us': 'cup (US)',
        'fluid-ounce-us': 'fl oz (US)',
        'tablespoon-us': 'tbsp (US)',
        'teaspoon-us': 'tsp (US)',
        'cubic-mile': 'mi³',
        'cubic-yard': 'yd³',
        'cubic-foot': 'ft³',
        'cubic-inch': 'in³',
        'cubic-decimeter': 'dm³',
        'gallon-uk': 'gal (UK)',
        'quart-uk': 'qt (UK)',
        'pint-uk': 'pt (UK)',
        'cup-uk': 'cup (UK)',
        'fluid-ounce-uk': 'fl oz (UK)',
        'tablespoon-uk': 'tbsp (UK)',
        'teaspoon-uk': 'tsp (UK)',
        'cup-metric': 'cup (Metric)',
        'tablespoon-metric': 'tbsp (Metric)',
        'teaspoon-metric': 'tsp (Metric)'
    };

    function convertVolume() {
        const value = parseFloat(volumeInput.value);
        const fromUnit = volumeUnitFrom.value;
        const toUnit = volumeUnitTo.value;

        if (isNaN(value)) {
            volumeOutput.value = '';
            volumeResultValue.textContent = '';
            return;
        }

        // Convert to cubic meters first
        const valueInCubicMeters = value * volumeConversionRates[fromUnit];

        // Convert from cubic meters to target unit
        const result = valueInCubicMeters / volumeConversionRates[toUnit];

        // Display the result
        volumeOutput.value = result.toFixed(6); // Format to 6 decimal places
        
        // Update the result box with symbol and name
        const fromUnitText = volumeUnitFrom.options[volumeUnitFrom.selectedIndex].textContent;
        const toUnitText = volumeUnitTo.options[volumeUnitTo.selectedIndex].textContent;

        // Get only the unit name from the full text (e.g., "m³ (Cubic Meter)" -> "Cubic Meter")
        const fromUnitName = fromUnitText.substring(fromUnitText.indexOf('(') + 1, fromUnitText.indexOf(')'));
        const toUnitName = toUnitText.substring(toUnitText.indexOf('(') + 1, toUnitText.indexOf(')'));

        volumeResultValue.textContent = 
            `${value} ${unitSymbols[fromUnit]} ${fromUnitName} = ${result.toFixed(6)} ${unitSymbols[toUnit]} ${toUnitName}`;
    }

    function swapUnits() {
        const fromValue = volumeUnitFrom.value;
        const toValue = volumeUnitTo.value;

        volumeUnitFrom.value = toValue;
        volumeUnitTo.value = fromValue;

        convertVolume(); // Perform conversion after swapping
    }

    // Add event listeners
    volumeInput.addEventListener('input', convertVolume);
    volumeUnitFrom.addEventListener('change', convertVolume);
    volumeUnitTo.addEventListener('change', convertVolume);
    swapVolumeUnitsButton.addEventListener('click', swapUnits);

    // Initial conversion on page load
    convertVolume();
}