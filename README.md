# EUR → USDC Widget

A Scriptable widget for iOS that displays real-time EUR to USDC conversion rates across multiple blockchain networks.

## Features

- **Multi-chain support**: Shows conversion rates for Mainnet, Gnosis, Polygon, Arbitrum, and Linea
- **Real-time prices**: Fetches current prices from [Llama.fi](https://coins.llama.fi) API
- **Chain icons**: Displays blockchain icons with automatic fallback
- **Customizable amount**: Easily configure the EUR amount to convert (default: €100)
- **Dark theme**: Beautiful dark gradient background optimized for iOS widgets
- **Update timestamp**: Shows when the widget was last updated

## Installation

1. Install [Scriptable](https://apps.apple.com/app/scriptable/id1405459188) from the App Store
2. Open Scriptable and tap the **+** button to create a new script
3. Copy the contents of `eur-usdc-widget.js` into the script editor
4. Name your script (e.g., "EUR → USDC Widget")
5. Save the script

## Adding to Home Screen

1. Long press on your home screen to enter edit mode
2. Tap the **+** button in the top-left corner
3. Search for "Scriptable" and select it
4. Choose a widget size (Small, Medium, or Large)
5. Tap "Add Widget"
6. Long press the widget and select "Edit Widget"
7. Choose your script from the list

## Configuration

Edit the `EUROS_TO_SHOW` constant at the top of the script to change the EUR amount:

```javascript
const EUROS_TO_SHOW = 100; // change if you like
```

## Supported Chains

- **Mainnet** (Ethereum)
- **Gnosis** (xDai)
- **Polygon**
- **Arbitrum**
- **Linea**

Each chain displays how much USDC you would receive for the configured EUR amount based on current market prices.

## How It Works

1. Fetches current prices for EURe and USDC tokens from Llama.fi API
2. Calculates the conversion rate: `(EUR amount × EURe price) / USDC price`
3. Displays the result for each supported blockchain network
4. Shows chain icons (cached locally for performance)
5. Displays update timestamp

## Requirements

- iOS 14.0 or later
- Scriptable app installed
- Internet connection for price data

## License

This project is open source and available for use.

