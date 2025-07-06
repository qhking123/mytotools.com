export function initTemperatureConverter(fromUnit, toUnit, inputDefaultVal) {
    const inputValue = document.getElementById('inputValue');
    const fromUnitSelect = document.getElementById('fromUnit');
    const toUnitSelect = document.getElementById('toUnit');
    const resultDiv = document.getElementById('result');
    const swapUnitsBtn = document.getElementById('swapUnitsBtn');

    const TRIPLE_POINT_WATER_K = 273.16; // Defined as 0.01 °C and 273.16 K

    // 默认设置为米到厘米，如果需要
    if (fromUnitSelect) {
        if(fromUnit)
            fromUnitSelect.value = fromUnit;
        else
            fromUnitSelect.value = 'celsius';
    }

    if (toUnitSelect) {        
        if(toUnit)
            toUnitSelect.value = toUnit;
        else
            toUnitSelect.value = 'fahrenheit';
    }

    if (inputValue) {
        if(inputDefaultVal)
            inputValue.value = inputDefaultVal;        
    }

    // Conversion function: converts value FROM any unit TO Kelvin
    function convertToKelvin(value, unit) {
        switch (unit) {
            case 'celsius':
                return value + 273.15;
            case 'fahrenheit':
                return (value - 32) * 5 / 9 + 273.15;
            case 'kelvin':
                return value;
            case 'rankine':
                return value * 5 / 9;
            case 'reaumur':
                return value * 5 / 4 + 273.15;
            case 'triplePointWater':
                return value + TRIPLE_POINT_WATER_K;
            default:
                return NaN;
        }
    }

    // Conversion function: converts value FROM Kelvin TO desired unit
    function convertFromKelvin(kelvinValue, unit) {
        switch (unit) {
            case 'celsius':
                return kelvinValue - 273.15;
            case 'fahrenheit':
                return (kelvinValue - 273.15) * 9 / 5 + 32;
            case 'kelvin':
                return kelvinValue;
            case 'rankine':
                return kelvinValue * 9 / 5;
            case 'reaumur':
                return (kelvinValue - 273.15) * 4 / 5;
            case 'triplePointWater':
                return kelvinValue - TRIPLE_POINT_WATER_K;
            default:
                return NaN;
        }
    }

    function performConversion() {
        const value = parseFloat(inputValue.value);
        if (isNaN(value)) {
            resultDiv.textContent = 'Invalid Input';
            return;
        }

        const fromUnit = fromUnitSelect.value;
        const toUnit = toUnitSelect.value;

        const kelvinValue = convertToKelvin(value, fromUnit);
        const convertedValue = convertFromKelvin(kelvinValue, toUnit);

        resultDiv.textContent = convertedValue.toFixed(4); // Display with 4 decimal places
    }

    function swapUnits() {
        const tempFromUnit = fromUnitSelect.value;
        fromUnitSelect.value = toUnitSelect.value;
        toUnitSelect.value = tempFromUnit;
        performConversion(); // Re-run conversion after swapping
    }

    // Event Listeners
    inputValue.addEventListener('input', performConversion);
    fromUnitSelect.addEventListener('change', performConversion);
    toUnitSelect.addEventListener('change', performConversion);
    swapUnitsBtn.addEventListener('click', swapUnits);

    // Initial conversion on page load
    performConversion();
}