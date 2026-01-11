# Color Theme Customization UI Description

This document describes the color theme customization interface for reference.

## High-Level Description

The left panel is a settings menu where various UI colors (Primary, Secondary, Accent, Background, etc.) can be defined using Oklch color values. The right panel acts as a live preview dashboard, showcasing how these chosen colors are applied across different UI components such as data charts, a calendar, an activity goal tracker, an account creation form, and a payments section. The overall aesthetic is clean and modern, utilizing rounded corners and a palette that includes purple, teal, orange, and red accents against a predominantly white and dark gray background.

## Top Bar

- On the far left, a dark purple logo "V2" is visible.
- To its right, there are navigation elements: "Personal", "Free", and "Soft Pop (Default)", each with a dropdown arrow, suggesting theme or profile selection.
- On the far right, there's a toggle icon (sun/moon) for switching between light/dark modes, followed by a "Save" button.

## Left Panel: Color Customization Settings

The panel is titled "Colors" at the top. It contains a scrollable list of color properties, each presented with:
- A label (e.g., "Primary", "Secondary", "Background").
- A small color swatch showing the current color.
- An input field displaying the color value in Oklch format.

### Specific Color Definitions

- **Primary:** Purple swatch, `oklch(0.5106 0.2301 276.9656)`
- **Primary Foreground:** White swatch, `oklch(1.0000 0 0)`
- **Secondary:** Teal swatch, `oklch(0.7038 0.1230 182.5025)`
- **Secondary Foreground:** White swatch, `oklch(1.0000 0 0)`
- **Accent:** Orange swatch, `oklch(0.7686 0.1647 70.0804)`
- **Accent Foreground:** Black swatch, `oklch(0 0 0)`
- **Background:** Off-white swatch, `oklch(0.9789 0.0082 121.6272)`
- **Foreground:** Black swatch, `oklch(0 0 0)`
- **Card:** White swatch, `oklch(1.0000 0 0)`
- **Card Foreground:** Black swatch, `oklch(0 0 0)`
- **Popover:** White swatch, `oklch(1.0000 0 0)`
- **Popover Foreground:** Black swatch, `oklch(0 0 0)`
- **Muted:** Light gray swatch, `oklch(0.9551 0 0)`
- **Muted Foreground:** Dark gray swatch, `oklch(0.3211 0 0)`
- **Destructive:** Red swatch, `oklch(0.6368 0.2078 25.3313)`
- **Destructive Foreground:** White swatch, `oklch(1.0000 0 0)`
- **Border:** Black swatch, `oklch(0 0 0)`
- **Input:** Gray swatch, `oklch(0.5555 0 0)`
- **Ring:** Light purple swatch, `oklch(0.7853 0.1041 274.7134)`
- "Chart 1" and "Chart 2" are partially visible at the bottom, indicating further chart-specific color options.

## Right Panel: Dashboard Preview

The panel is titled "Preview / Cards" at the top. It displays a grid of cards, each demonstrating a different UI component with the applied color theme.

### Card 1: Total Revenue
- Title: "Total Revenue"
- Value: "$15,231.89"
- Change: "+20.1% from last month"
- A line chart with purple data points and line shows an upward trend over time.

### Card 2: Calendar (June 2025)
- Title: "June 2025" with left and right navigation arrows.
- Days of the week are labeled: Su, Mo, Tu, We, Th, Fr, Sa.
- Dates are displayed in a grid. Specific dates are highlighted:
  - Dates 3, 4, 6, 7, 8, 9, 10, 11 have an orange background.
  - Dates 5, 12, 13 have a purple background.
  - Other dates (1, 2, 14-28, 29-5) have a white or muted background.

### Card 3: Move Goal
- Title: "Move Goal"
- Subtitle: "Set your daily activity goal."
- Current Goal: "350 CALORIES/DAY" displayed prominently, flanked by "-" and "+" buttons.
- A bar chart below shows daily activity levels with purple bars of varying heights.
- A teal "Set Goal" button is at the bottom.

### Card 4: Create an account
- Title: "Create an account"
- Subtitle: "Enter your email below to create your account"
- Two social login buttons: "GitHub" (with GitHub logo) and "Google" (with Google logo).
- A horizontal line with "OR CONTINUE WITH" in the center.
- An "Email" input field pre-filled with "m@example.com" and a small square button on the right.
- A "Password" input field (empty) with a small square button on the right.
- A purple "Create account" button at the bottom.

### Card 5: Exercise Minutes
- Title: "Exercise Minutes"
- Subtitle: "Your exercise minutes are ahead of where you normally are."
- A line chart shows exercise minutes over the week (Mon-Sun). A prominent purple line peaks on Wednesday, while a lighter purple line serves as a baseline.

### Card 6: Payments
- Title: "Payments"
- Subtitle: "Manage your payments."
- A teal "Add Payment" button is on the right.

