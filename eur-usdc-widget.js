// EURe Price Widget – icon rows + €100 → chain-specific USDC

// ===== Config
const EUROS_TO_SHOW = 100; // change if you like

// EURe token addresses (Llama id format: chain:address)
const eureTokens = {
  "Mainnet": "ethereum:0x3231cb76718cdef2155fc47b5286d82e6eda273f",
  "Gnosis":  "gnosis:0xcb444e90d8198415266c6a2724b7900fb12fc56e",
  "Polygon": "polygon:0x18ec0a6e18e5bc3784fdd3a3634b31245ab704f6",
  "Arbitrum":"arbitrum:0x0c06ccf38114ddfc35e07427b9424adcca9f44f8",
  "Linea":   "linea:0x3ff47c5bf409c86533fe1f4907524d304062428d"
};

// Chain-specific **USDC** addresses (lowercased for safety)
const usdcTokens = {
  "Mainnet": "ethereum:0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  "Arbitrum":"arbitrum:0xaf88d065e77c8cc2239327c5edb3a432268e5831",
  "Polygon": "polygon:0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
  "Linea":   "linea:0x176211869ca2b568f2a7d4ee941e073a821ee1ff",
  "Gnosis":  "gnosis:0xddafbb505ad214d7b80b1f830fccc89b60fb7a83"
};

// Chain icons
const icons = {
  "Mainnet": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",
  "Gnosis":  "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/xdai/info/logo.png",
  "Polygon": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png",
  "Arbitrum":"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/info/logo.png",
  "Linea":   "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/linea/info/logo.png"
};

// -------- helpers
async function fetchPrices() {
  const ids = [...Object.values(eureTokens), ...Object.values(usdcTokens)].join(',');
  const url = `https://coins.llama.fi/prices/current/${ids}`;
  const req = new Request(url);
  const res = await req.loadJSON();
  return res.coins || {};
}

async function getIcon(name) {
  const fm = FileManager.local();
  const dir = fm.joinPath(fm.documentsDirectory(), "eure-icons");
  if (!fm.fileExists(dir)) fm.createDirectory(dir);
  const p = fm.joinPath(dir, `${name}.png`);
  try {
    if (!fm.fileExists(p)) {
      const r = new Request(icons[name]);
      const img = await r.loadImage();
      fm.writeImage(p, img);
    }
    return fm.readImage(p);
  } catch {
    return makeFallbackIcon(name[0] || "?");
  }
}

function makeFallbackIcon(letter) {
  const size = 48;
  const dc = new DrawContext();
  dc.size = new Size(size, size);
  dc.opaque = false;
  dc.setFillColor(new Color("#2A2A2A"));
  dc.fillEllipse(new Rect(0, 0, size, size));
  dc.setFont(Font.boldSystemFont(22));
  dc.setTextAlignedCenter();
  dc.setTextColor(new Color("#EDEDED"));
  dc.drawTextInRect(letter.toUpperCase(), new Rect(0, 10, size, size));
  return dc.getImage();
}

function header(widget, compact) {
  const t = widget.addText(`€${EUROS_TO_SHOW} → USDC`);
  t.font = Font.semiboldSystemFont(compact ? 12 : 14);
  t.textColor = new Color("#EDEDED");
  t.centerAlignText();
  widget.addSpacer(compact ? 4 : 6);
}

async function addRow(widget, chainName, eureUsd, usdcUsd, compact) {
  const row = widget.addStack();
  row.centerAlignContent();

  const img = await getIcon(chainName);
  const imgView = row.addImage(img);
  const s = compact ? 16 : 18;
  imgView.imageSize = new Size(s, s);
  imgView.cornerRadius = s / 2;

  row.addSpacer(10);

  // €100 -> USDC on this chain
  let textStr = "—";
  if (typeof eureUsd === "number" && typeof usdcUsd === "number" && usdcUsd > 0) {
    const amount = (EUROS_TO_SHOW * eureUsd) / usdcUsd;
    textStr = amount.toFixed(2); // number only, header says USDC
  }

  row.addSpacer();
  let mono; try { mono = new Font("Menlo-Regular", compact ? 12 : 14); } catch { mono = Font.systemFont(compact ? 12 : 14); }
  const txt = row.addText(textStr);
  txt.font = mono;
  txt.textColor = new Color(textStr === "—" ? "#666666" : "#C7C7CC");

  widget.addSpacer(compact ? 3 : 5);
}

// -------- widget
async function createWidget() {
  const widget = new ListWidget();

  const g = new LinearGradient();
  g.colors = [new Color("#0B0B0F"), new Color("#141414")];
  g.locations = [0, 1];
  widget.backgroundGradient = g;
  widget.setPadding(10, 12, 10, 12);

  const family = config.widgetFamily;
  const compact = !family || family === "small";
  header(widget, compact);

  try {
    const prices = await fetchPrices();

    for (const chainName of Object.keys(eureTokens)) {
      const eureId = eureTokens[chainName];
      const usdcId = usdcTokens[chainName];
      const eureUsd = prices[eureId] && typeof prices[eureId].price === "number" ? prices[eureId].price : null;
      const usdcUsd = prices[usdcId] && typeof prices[usdcId].price === "number" ? prices[usdcId].price : null;
      await addRow(widget, chainName, eureUsd, usdcUsd, compact);
    }

    widget.addSpacer(compact ? 2 : 4);
    const t = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const u = widget.addText(`Updated ${t}`);
    u.font = Font.systemFont(9);
    u.textColor = new Color("#7A7A7A");
    u.centerAlignText();

  } catch (e) {
    const err = widget.addText(`Error: ${e.message}`);
    err.font = Font.systemFont(12);
    err.textColor = Color.red();
  }
  return widget;
}

// -------- run
if (config.runsInWidget) {
  const w = await createWidget();
  Script.setWidget(w);
} else {
  const w = await createWidget();
  await w.presentSmall();
}
Script.complete();


