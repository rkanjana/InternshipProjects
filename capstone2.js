// Calculator functionality
class Calculator {
    constructor() {
        this.currentInput = '0';
        this.previousInput = '';
        this.operation = null;
        this.shouldResetScreen = false;
        this.display = document.getElementById('display');
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Number buttons
        document.querySelectorAll('.number').forEach(button => {
            button.addEventListener('click', () => {
                this.inputDigit(button.textContent);
            });
        });

        // Operator buttons
        document.querySelectorAll('.operator').forEach(button => {
            button.addEventListener('click', () => {
                this.handleOperator(button.textContent);
            });
        });

        // Equals button
        document.getElementById('equals').addEventListener('click', () => {
            this.calculate();
        });

        // Decimal button
        document.getElementById('decimal').addEventListener('click', () => {
            this.inputDecimal();
        });

        // Clear button
        document.querySelector('.btn-danger').addEventListener('click', () => {
            this.clear();
        });

        // Backspace button
        document.querySelector('.btn-warning').addEventListener('click', () => {
            this.backspace();
        });

        // Keyboard support
        document.addEventListener('keydown', (event) => {
            this.handleKeyboard(event);
        });
    }

    updateDisplay() {
        this.display.textContent = this.currentInput;
    }

    inputDigit(digit) {
        if (this.shouldResetScreen) {
            this.currentInput = digit;
            this.shouldResetScreen = false;
        } else {
            this.currentInput = this.currentInput === '0' ? digit : this.currentInput + digit;
        }
        this.updateDisplay();
    }

    inputDecimal() {
        if (this.shouldResetScreen) {
            this.currentInput = '0.';
            this.shouldResetScreen = false;
        } else if (!this.currentInput.includes('.')) {
            this.currentInput += '.';
        }
        this.updateDisplay();
    }

    handleOperator(nextOperator) {
        const inputValue = parseFloat(this.currentInput);
        
        if (this.operation && !this.shouldResetScreen) {
            this.calculate();
        } else {
            this.previousInput = this.currentInput;
        }
        
        this.operation = nextOperator;
        this.shouldResetScreen = true;
    }

    calculate() {
        const prev = parseFloat(this.previousInput);
        const current = parseFloat(this.currentInput);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        let computation;
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                computation = current !== 0 ? prev / current : 'Error';
                break;
            default:
                return;
        }
        
        this.currentInput = computation.toString();
        this.operation = null;
        this.shouldResetScreen = true;
        this.updateDisplay();
    }

    clear() {
        this.currentInput = '0';
        this.previousInput = '';
        this.operation = null;
        this.shouldResetScreen = false;
        this.updateDisplay();
    }

    backspace() {
        if (this.currentInput.length === 1) {
            this.currentInput = '0';
        } else {
            this.currentInput = this.currentInput.slice(0, -1);
        }
        this.updateDisplay();
    }

    handleKeyboard(event) {
        // Numbers
        if (/^\d$/.test(event.key)) {
            event.preventDefault();
            this.inputDigit(event.key);
        }
        // Operators
        else if (['+', '-', '*', '/'].includes(event.key)) {
            event.preventDefault();
            const operatorMap = {
                '*': '×',
                '/': '÷'
            };
            this.handleOperator(operatorMap[event.key] || event.key);
        }
        // Equals and Enter
        else if (event.key === '=' || event.key === 'Enter') {
            event.preventDefault();
            this.calculate();
        }
        // Decimal
        else if (event.key === '.') {
            event.preventDefault();
            this.inputDecimal();
        }
        // Backspace
        else if (event.key === 'Backspace') {
            event.preventDefault();
            this.backspace();
        }
        // Clear
        else if (event.key === 'Escape') {
            event.preventDefault();
            this.clear();
        }
    }
}

// Initialize calculator when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});