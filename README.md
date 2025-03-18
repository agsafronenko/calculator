# Scientific Calculator

![Calculator Screenshot](public/screenshot.png)

## Overview

A comprehensive scientific calculator that offers advanced mathematical functions. This calculator was built without using JavaScript's `eval()` function, implementing custom parsing and calculation logic instead.

## Features

- **Basic Operations**: Addition, subtraction, multiplication, division
- **Scientific Functions**: 
  - Trigonometric functions (sin, cos, tan, cot, sec, csc)
  - Logarithms (log10, logx, loge)
  - Constants (π, e, random)
  - Power functions (x², x^y)
  - Roots (square root, nth root)
  - Factorial (n!)
  - Absolute value (|x|)
  - Modulo operations
  - Percentage calculations
  - Inverse (1/x)
- **Memory Functions**: Store and recall up to 3 values
- **Expression History**: View your calculation history
- **Parentheses Support**: Handle complex expressions with parentheses
- **Sign Toggle**: Change number signs easily
- **Color Themes**: Customize calculator appearance with different color schemes
- **Responsive Design**: Works on both desktop and mobile devices
- **Copy Functionality**: Copy results to clipboard

## Tech Stack

- **React**: Component-based UI architecture
- **JavaScript**: Custom calculation logic without `eval()`
- **jQuery**: DOM manipulation and animations
- **Bootstrap**: Responsive grid system and layout
- **CSS/SASS**: Styling and theming capabilities
- **Font Awesome**: Icons for better UI

## Installation

1. Clone the repository
   ```
   git clone https://agsafronenko.github.io/calculator/
   ```

2. Navigate to the project directory
   ```
   cd calculator
   ```

3. Install dependencies
   ```
   npm install
   ```

4. Start the development server
   ```
   npm start
   ```

## Implementation Details

### Custom Calculation Engine

Instead of relying on JavaScript's `eval()` function, this calculator implements a custom calculation engine that:

- Parses mathematical expressions
- Respects operator precedence
- Handles parentheses and nested operations
- Calculates advanced mathematical functions
- Manages state for complex operations

### State Management

The calculator uses React's state management to track:
- Current display value
- Full expression history
- Memory slot values
- Parentheses balancing
- Decimal point usage
- Consecutive operator detection

### Responsive Design

The calculator features a responsive design that works well on:
- Desktop browsers
- Tablets
- Mobile phones (with a special landscape mode message)
