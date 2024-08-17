# Color of the Day

**Color of the Day** is a personal project that allows you to record and visualize your daily mood through colors. Each day, you can input your feelings across three dimensions: **Sense of Achievement**, **Sense of Stability**, and **Level of Fatigue**. These inputs are then mapped to the Red, Green, and Blue (RGB) color model, creating a unique color that represents your mood for that day.

## Table of Contents

- [Overview](#overview)
- [Demo](#demo)
- [How It Works](#how-it-works)
  - [Mood Factors](#mood-factors)
  - [RGB Mapping](#rgb-mapping)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Overview

The goal of this project is to provide a visual representation of your emotional journey over time. By translating your daily moods into colors, you can observe patterns and trends in how you feel throughout the days, weeks, and months.

## Demo
<img src="https://github.com/user-attachments/assets/75fd7abb-4af0-4653-a264-da5658becff0">

## How It Works

### Mood Factors

Each day, you will rate the following three mood factors with range sliders:

1. **Sense of Achievement**: How accomplished did you feel today?
2. **Sense of Stability**: How secure and steady did you feel today?
3. **Level of Fatigue**: How tired or drained did you feel today?

### RGB Mapping

The three mood factors are mapped to the RGB color model as follows:

- **Sense of Achievement** (Red): This factor is mapped to the Red (R) value of the RGB color. A higher sense of achievement results in a stronger red component.
- **Sense of Stability** (Green): This factor is mapped to the Green (G) value. A greater sense of stability results in a stronger green component.
- **Level of Fatigue** (Blue): This factor is mapped to the Blue (B) value. A higher level of fatigue leads to a stronger blue component.

The RGB values are calculated using a simple linear mapping from the mood factors' input to the RGB range (0-255).
