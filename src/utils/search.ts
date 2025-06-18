export default {
  description: `
PURPOSE Search the Token Metrics v2 API for prices, grades, signals, indices, research content and advanced analytics.

────────── HOW TO BUILD A VALID QUERY ──────────

1.  Start with  endpoint:<endpointkey>  (REQUIRED)
2.  Add any number of field filters separated by spaces, using simple equality syntax (field:value).
3.  Multiple values for the same field = comma‑separate (e.g. symbol:BTC,ETH).
4.  Dates are YYYY‑MM‑DD.
5.  All parameters are optional unless explicitly marked (required) in the endpoint catalogue.
6.  When selecting a specific token, prefer using token_id for the most precise match, you can use endpoint:tokens to get the token_id of the tokens first.

**IMPORTANT**:
If the user is asking about a token, start with endpoint:tokens first to get the correct token_id before calling more tools to get data about it.

Example queries

    endpoint:price                   tokenid:3375 symbol:BTC
    endpoint:trader-grades           symbol:MATIC startDate:2024-11-01 endDate:2025-01-01
    endpoint:indices-performance     id:defi      startDate:2024-01-01  endDate:2024-12-31
    endpoint:correlation             symbol:BTC,ETH startDate:2024-06-01 endDate:2024-06-30
    

────────── ENDPOINT CATALOGUE (20 total) ────────── 

tokens – GET /v2/tokens - Get the list of coins and their associated TOKEN_ID supported by Token Metrics.
  params:
    token_id
    token_name
    symbol
    category
    exchange
    page
    limit

price – GET /v2/price - Get token prices based on the provided token IDs.
  params:
    token_id (required)

daily-ohlcv – GET /v2/daily-ohlcv - Get daily OHLCV (Open, High, Low, Close, Volume) data for tokens.
  params:
    token_id
    symbol
    token_name
    startDate
    endDate
    page
    limit

hourly-ohlcv – GET /v2/hourly-ohlcv - Get hourly OHLCV (Open, High, Low, Close, Volume) data for tokens.
  params:
    token_id
    symbol
    token_name
    startDate
    endDate
    page
    limit

trader-grades – GET /v2/trader-grades - Get the short term grades, including the 24h percent change for the TM Trader Grade.
  params:
    token_id
    symbol
    startDate
    endDate
    category
    exchange
    marketcap
    fdv
    volume
    traderGrade
    traderGradePercentChange
    page
    limit

investor-grades – GET /v2/investor-grades - Get the long term grades, including Technology and Fundamental metrics.
  params:
    token_id
    symbol
    startDate
    endDate
    category
    exchange
    marketcap
    fdv
    volume
    investorGrade
    page
    limit

trading-signals – GET /v2/trading-signals - Get the AI generated trading signals for long and short positions for all tokens.
  params:
    token_id
    symbol
    startDate
    endDate
    category
    exchange
    marketcap
    fdv
    volume
    signal
    page
    limit

hourly-trading-signals – GET /v2/hourly-trading-signals - Get the hourly AI generated trading signals for long and short positions for all tokens.
  params:
    token_id (required)
    page
    limit

market-metrics – GET /v2/market-metrics - Get the Market Analytics from Token Metrics. They provide insight into the full Crypto Market, including the Bullish/Bearish Market indicator.
  params:
    startDate
    endDate
    page
    limit

resistance-support – GET /v2/resistance-support - Get the historical levels of resistance and support for each token.
  params:
    token_id
    symbol
    page
    limit

scenario-analysis – GET /v2/scenario-analysis - Get the price prediction based on different Crypto Market scenario.
  params:
    token_id
    symbol
    page
    limit

correlation – GET /v2/correlation - Get the Top 10 and Bottom 10 correlation of tokens with the top 100 market cap tokens.
  params:
    token_id
    symbol
    category
    exchange
    page
    limit

quantmetrics – GET /v2/quantmetrics - Get the latest quantitative metrics for tokens. Note that Token Metrics pricing data starts on 2019-01-01 for most tokens. More historical data will be available soon.
  params:
    token_id
    symbol
    category
    exchange
    marketcap
    volume
    fdv
    page
    limit

sentiments – GET /v2/sentiments - Get the hourly sentiment score for Twitter, Reddit, and all the News, including quick summary of what happened.
  params:
    limit
    page

ai-reports – GET /v2/ai-reports - Retrieve AI-generated reports providing comprehensive analyses of cryptocurrency tokens, including deep dives, investment analyses, and code reviews.
  params:
    token_id
    symbol
    page
    limit

crypto-investors – GET /v2/crypto-investors - Get the latest list of crypto investors and their scores.
  params:
    page
    limit

top-market-cap-tokens – GET /v2/top-market-cap-tokens - Get the list of coins for top market cap.
  params:
    top_k

indices – GET /v2/indices - Get active and passive crypto indices with performance and market data.
  params:
    indicesType
    page
    limit

indices-holdings – GET /v2/indices-holdings - This endpoint returns the current holdings of the given Index, along with their respective weight in %.
  params:
    id (required)

indices-performance – GET /v2/indices-performance - The Indices Performance endpoint provides historical performance data for a given index, including cumulative return on investment (ROI) over time. This data is useful for analyzing index trends and evaluating investment performance.
  params:
    id (required)
    startDate
    endDate
    page
    limit

────────── COMMON PARAMETER REFERENCE ────────── All parameters are optional unless marked (required) in the catalogue; they share the conventions below.

   token_id — Token Metrics internal numeric identifier(s). Comma‑separated. Always the most precise way to target a token.
    
   token_name — Human‑readable asset name(s) such as “Bitcoin”, “Ethereum”. Comma‑separated.
    
   symbol — Ticker symbol(s) like BTC, ETH. Comma‑separated.
    
   category — Analytics category slug(s) (e.g. defi, yieldfarming)
    
   exchange — CEX/DEX slug(s) from the supported list (e.g. binance, gate). Comma‑separated.
    
   blockchain_address — Search via on‑chain address. Format <chain-name>:<contract-address>, e.g. binance-smart-chain:0x57185….
    
   startDate / endDate — Filter by date range (YYYY‑MM‑DD).
    
   marketcap, volume, fdv — Numeric lower‑bound thresholds in USD.
    
   traderGrade, investorGrade — Minimum grade values (0‑100) for Trader and Investor grades respectively.
    
   signal — Strategy signal: 1 (bullish), -1 (bearish), 0 (neutral/no signal).
    
   limit / top_k — Maximum rows returned (default 50, max 100).
    
   page — Results page number (default 1, 1‑indexed).
    
   indicesType - Filter to return indices by type: "active" for actively managed, "passive" for passively managed.
    
   id - Id of the index. Example 1

Additional information on Token Metrics API (maybe you can use it when user asks to create a trading strategy or any integration with Token Metrics API):
Base url is https://api.tokenmetrics.com/v2 and then the endpoint follows.

Example:
https://api.tokenmetrics.com/v2/tokens

What's the header? 
x-api-key: <Token_Metrics_API_Key>
accept: application/json

Example of a request:
curl -X GET "https://api.tokenmetrics.com/v2/tokens" -H "accept: application/json" -H "x-api-key: <Token_Metrics_API_Key>"
`,
  endpointsData: {
    tokens: { path: "/tokens", method: "GET" },
    price: { path: "/price", method: "GET" },
    "daily-ohlcv": { path: "/daily-ohlcv", method: "GET" },
    "hourly-ohlcv": { path: "/hourly-ohlcv", method: "GET" },
    "trader-grades": { path: "/trader-grades", method: "GET" },
    "investor-grades": { path: "/investor-grades", method: "GET" },
    "trading-signals": { path: "/trading-signals", method: "GET" },
    "hourly-trading-signals": {
      path: "/hourly-trading-signals",
      method: "GET",
    },
    "market-metrics": { path: "/market-metrics", method: "GET" },
    "resistance-support": { path: "/resistance-support", method: "GET" },
    "scenario-analysis": { path: "/scenario-analysis", method: "GET" },
    correlation: { path: "/correlation", method: "GET" },
    quantmetrics: { path: "/quantmetrics", method: "GET" },
    sentiments: { path: "/sentiments", method: "GET" },
    "ai-reports": { path: "/ai-reports", method: "GET" },
    "crypto-investors": { path: "/crypto-investors", method: "GET" },
    "top-market-cap-tokens": {
      path: "/top-market-cap-tokens",
      method: "GET",
    },
    indices: { path: "/indices", method: "GET" },
    "indices-holdings": { path: "/indices-holdings", method: "GET" },
    "indices-performance": { path: "/indices-performance", method: "GET" },
  },
};
