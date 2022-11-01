export const EXTENSION_ID = 'cclbjbpflgdponoegbmgkcicpjjdikci'
export const MAX_KEYWORD_SELECTED = 1000
export const defaultCampaignTableColumns = [
  'campaign', 'target_acos', 'daily_budget', 'impressions',
  'clicks', 'ctr', 'cost', 'cpc', 'orders',
  'revenue', 'acos',
]
export const defaultProductTableColumns = ['product', 'cog', 'margin', 'cpa', 'click-order', 'max-cpc', 'avg-7', 'avg-30', 'avg-60', 'active']
export const defaultPortfolioTableColumns = ['portfolio', 'daily_budget', 'impression', 'clicks', 'ctr', 'spend', 'cpc','orders','sales','acos', 'roas']
export const allCampaignTableColumns = [
  'campaign', 'state', 'target_acos', 'daily_budget', 'impressions',
  'clicks', 'ctr', 'cost', 'cpc', 'orders',
  'revenue', 'acos', 'roas', 'conversion', 'ntb_orders', 'ntb_orders_percent',
  'ntb_sales', 'ntb_sales_percent',
]
export const allProductTableColumns = ['product', 'cog', 'margin', 'cpa', 'click-order', 'max-cpc', 'avg-7', 'avg-30', 'avg-60', 'active', 'sales', 'organic-sales', 'organic-sales-ratio', 'ad-spend-margin-impact', 'clicks', 'ctr', 'spend', 'orders', 'acos']
export const allPortfolioTableColumns = ['portfolio', 'daily_budget', 'start_date', 'end_date', 'impression', 'clicks', 'ctr', 'spend', 'cpc','orders','sales','acos', 'roas', 'ntb-orders', 'ntb-orders-percent', 'ntb-sales', 'ntb-sales-percent']
export const currencyList = [
  {
    text: 'USD',
    sign: '$',
    flag: 'flag-us',
    code: 'us',
  },
  {
    text: 'JPY',
    sign: '¥',
    flag: 'flag-jp',
    code: 'jp',
  },
  {
    text: 'GBP',
    sign: '£',
    flag: 'flag-gb',
    code: 'gb',
  },
  {
    text: 'EUR',
    sign: '€',
    flag: 'flag-de',
    code: 'de',
  },
  {
    text: 'INR',
    sign: '₹',
    flag: 'flag-in',
    code: 'in',
  },
  {
    text: 'MXN',
    sign: '$',
    flag: 'flag-mx',
    code: 'mx',
  },
  {
    text: 'CAD',
    sign: '$',
    flag: 'flag-ca',
    code: 'ca',
  },
  {
    text: 'EUR',
    sign: '€',
    flag: 'flag-fr',
    code: 'fr',
  },
  {
    text: 'EUR',
    sign: '€',
    flag: 'flag-es',
    code: 'es',
  },
  {
    text: 'EUR',
    sign: '€',
    flag: 'flag-it',
    code: 'it',
  },
  {
    text: 'AED',
    sign: 'د.إ',
    flag: 'flag-ae',
    code: 'ae',
  },
  {
    text: 'AUD',
    sign: '$',
    flag: 'flag-au',
    code: 'au',
  },
]