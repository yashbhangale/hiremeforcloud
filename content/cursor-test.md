---
title: "Cursor Test"
date: 2023-07-01
draft: false
---

# Custom Cursor Test Page

This page is designed to test the custom cursor functionality.

{{< cursor-test >}}

## Instructions

1. Move your mouse around this page
2. The custom cursor should follow your mouse movements
3. Hover over buttons and links to see the hover effect
4. Click to see the click effect

If you don't see the custom cursor, check the browser console for errors.

<script src="/js/cursor-test.js"></script>

## Troubleshooting

If you don't see the cyan futuristic cursor but you do see a red dot cursor, it means:

1. The test cursor is working (JavaScript is running)
2. But the main custom cursor has an issue

Common issues:
- CSS not being applied correctly
- JavaScript errors in the custom cursor code
- Z-index issues (other elements on top of the cursor)
- Opacity issues (cursor is transparent) 