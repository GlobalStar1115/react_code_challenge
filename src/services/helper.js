const removeSpecialChar = (value) => {
  if (!value) {
    return 0
  }
  const valueStr = value.toString()
  return valueStr.replace(/[$,%]/g, '')
}

export const formatValue = (value, type, decimals = 2, currencySign = '$') => {
  const valueFixed = parseFloat(removeSpecialChar(value) || 0).toFixed(decimals)
  switch (type) {
    case 'currency':
      return currencySign + valueFixed.toLocaleString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
    case 'percent':
      return valueFixed.toString() + '%'
    case 'number':
      return valueFixed.toLocaleString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
    case 'removeZeroDecimal':
      return parseFloat(valueFixed).toLocaleString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
    default:
      return valueFixed
  }
}

export const formatCurrency = (value, currencySign, currencyRate, decimals = 2) => (
  formatValue(value * currencyRate, 'currency', decimals, currencySign)
)

export const parseMoneyAsFloat = (value, currency_sign) => {
  if (!value) {
    return 0
  }
  const valueStr = value.toString()
  return parseFloat(valueStr.replace(new RegExp(`[$,%${currency_sign}]`, 'g'), ''))
}

export const checkSpecialCharater = (str) => {
  const regexp = /[`ģń~!@#$%^*()_|=?;:",<>{}[]\\\/]/gi
  return str.match(regexp)
}

export const getSpecialKeywords = (keywords) => {
  let result = []
  keywords.map(keyword => {
    const textFormat = keyword.keywordText.trim()
    if (checkSpecialCharater(textFormat)) {
      result = [ ...result, keyword ]
    }

    if (textFormat.length > 80) {
      result = [ ...result, keyword ]
    }

    const words = textFormat.split(' ')
    if (keyword.matchType === 'negativeExact' && words.length > 10) {
      result = [ ...result, keyword ]
    }

    if (keyword.matchType === 'negativePhrase' && words.length > 4) {
      result = [ ...result, keyword ]
    }

    return ''
  })
  return result
}

export const capitalizeFirstLetter = (string) => {
  if (!string || string === '') {
    return ''
  }
  const [firstLetter, ...restLetters] = string.toLowerCase()
  return firstLetter.toUpperCase() + restLetters.join('')
}

// get the trend line's start and end point of the chart
export const getTrendLinePoint = (x, slope, intercept) => {
  return {x: x, y: ((slope * x) + intercept)}
}

export const calculateTrendLines = (data) => {
  if (!data || data.length === 0) {
    return [0, 0]
  }
  let xSum = 0
  let ySum = 0
  let xySum = 0
  let xSquare = 0
  const dpsLength = data.length
  for(let i = 0; i < dpsLength; i++) {
    xySum += (i * data[i].value)
  }
  const a = xySum * dpsLength

  for(let i = 0; i < dpsLength; i++){
    xSum += i
    ySum += data[i].value
  }
  const b = xSum * ySum

  for(let i = 0; i < dpsLength; i++) {
    xSquare += Math.pow(i, 2)
  }
  const c = dpsLength * xSquare

  const d = Math.pow(xSum, 2)
  const slope = (a-b)/(c-d)
  const e = slope * xSum
  const yIntercept = (ySum - e) / dpsLength

  const startPoint = getTrendLinePoint(0, slope, yIntercept)
  const endPoint = getTrendLinePoint(dpsLength - 1, slope, yIntercept)
  return [startPoint, endPoint]
}

// add space between ()
export const addSpaceBetweenWord = (str, chr) => {
  return str.replaceAll(chr, ` ${chr}`)
}

// Default smart pilot settings.
// FIXME: Remove the following settings no longer used:
// - auto_type
export const apSettings = {
  // Ad group selection.
  adgroup_id: { default: 0, type: 'int' },
  day_used_auto_pilot: { default: 30 },
  pt_day_used_auto_pilot: { default: 90 },
  // Keyword basic settings.
  basic_isactive: { default: false },
  target_acos: { default: 30 },
  minimum_bid: { default: 0.02 },
  max_bid_price: { default: 2 },
  minimum_click: { default: 10 },
  minimum_impression: { default: 1000 },
  // Keyword advanced settings.
  // Zero sale targets
  zero_adv_byclick_isactive: { default: false },
  zero_adv_byclick_threshold: { default: 8 },
  adv_byclick_frequency_type: { default: 'daily' },
  adv_byclick_freq_weekly: { default: [], type: 'json_array' },
  adv_byclick_freq_month_day: { default: '' },
  adv_byclick_lookback_period: { default: 7 },
  adv_byclick_automated_rule: { default: '' },
  adv_byclick_automated_rule_value: { default: '' },

  copy_zero_adv_byclick_isactive: { default: false },
  copy_zero_adv_byclick_threshold: { default: 8 },
  copy_adv_byclick_frequency_type: { default: 'daily' },
  copy_adv_byclick_freq_weekly: { default: [], type: 'json_array' },
  copy_adv_byclick_freq_month_day: { default: '' },
  copy_adv_byclick_lookback_period: { default: 7 },
  copy_adv_byclick_automated_rule: { default: '' },
  copy_adv_byclick_automated_rule_value: { default: '' },
  // Low CTR targets
  low_adv_byctr_isactive: { default: false },
  increase_adv_byimpression_min: { default: 1000 },
  increase_adv_ctr_byimpression_threshold: { default: 0.15 },
  adv_byimpression_frequency_type: { default: 'daily' },
  adv_byimpression_freq_weekly: { default: [], type: 'json_array' },
  adv_byimpression_freq_month_day: { default: '' },
  adv_byimpression_lookback_period: { default: 7 },
  adv_byimpression_automated_rule: { default: '' },
  adv_byimpression_automated_rule_value: { default: '' },

  copy_low_adv_byctr_isactive: { default: false },
  copy_increase_adv_byimpression_min: { default: 1000 },
  copy_increase_adv_ctr_byimpression_threshold: { default: 0.15 },
  copy_adv_byimpression_frequency_type: { default: 'daily' },
  copy_adv_byimpression_freq_weekly: { default: [], type: 'json_array' },
  copy_adv_byimpression_freq_month_day: { default: '' },
  copy_adv_byimpression_lookback_period: { default: 7 },
  copy_adv_byimpression_automated_rule: { default: '' },
  copy_adv_byimpression_automated_rule_value: { default: '' },
  // Low Converting targets
  low_adv_converting_isactive: { default: false },
  increase_adv_conversion_threshold: { default: 5 },
  adv_lowconverting_frequency_type: { default: 'daily' },
  adv_lowconverting_freq_weekly: { default: [], type: 'json_array' },
  adv_lowconverting_freq_month_day: { default: '' },
  adv_lowconverting_lookback_period: { default: 7 },
  adv_lowconverting_automated_rule: { default: '' },
  adv_lowconverting_automated_rule_value: { default: '' },

  copy_low_adv_converting_isactive: { default: false },
  copy_increase_adv_conversion_threshold: { default: 5 },
  copy_adv_lowconverting_frequency_type: { default: 'daily'} ,
  copy_adv_lowconverting_freq_weekly: { default: [], type: 'json_array' },
  copy_adv_lowconverting_freq_month_day: { default: '' },
  copy_adv_lowconverting_lookback_period: { default: 7 },
  copy_adv_lowconverting_automated_rule: { default: '' },
  copy_adv_lowconverting_automated_rule_value: { default: '' },
  // Very high ACoS targets
  unprofitable_adv_isactive: { default: false },
  increase_adv_byacos_threshold: { default: 100 },
  increase_adv_percentbid_click_threshold: { default: 8 },
  adv_unprofitable_frequency_type: { default: 'daily' },
  adv_unprofitable_freq_weekly: { default: [], type: 'json_array' },
  adv_unprofitable_freq_month_day: { default: '' },
  adv_unprofitable_lookback_period: { default: 7 },
  adv_unprofitable_automated_rule: { default: '' },
  adv_unprofitable_automated_rule_value: { default: '' },

  copy_unprofitable_adv_isactive: { default: false },
  copy_increase_adv_byacos_threshold: { default: 100 },
  copy_increase_adv_percentbid_click_threshold: { default: 8 },
  copy_adv_unprofitable_frequency_type: { default: 'daily' },
  copy_adv_unprofitable_freq_weekly: { default: [], type: 'json_array' },
  copy_adv_unprofitable_freq_month_day: { default: '' },
  copy_adv_unprofitable_lookback_period: { default: 7 },
  copy_adv_unprofitable_automated_rule: { default: '' },
  copy_adv_unprofitable_automated_rule_value: { default: '' },
  // Unprofitable targets
  unprofitable_adv_targets_isactive: { default: false },
  increase_adv_percentacos_threshold: { default: 50 },
  increase_adv_percentbid_byacos_threshold: { default: 80 },
  increase_adv_percentbid_byacos_click_threshold: { default: 8 },
  adv_unprofitable_targets_frequency_type: { default: 'daily' },
  adv_unprofitable_targets_freq_weekly: { default: [], type: 'json_array' },
  adv_unprofitable_targets_freq_month_day: { default: '' },
  adv_unprofitable_targets_lookback_period: { default: 7 },
  adv_unprofitable_targets_automated_rule: { default: '' },
  adv_unprofitable_targets_automated_rule_value: { default: '' },

  copy_unprofitable_adv_targets_isactive: { default: false },
  copy_increase_adv_percentacos_threshold: { default: 50 },
  copy_increase_adv_percentbid_byacos_threshold: { default: 80 },
  copy_increase_adv_percentbid_byacos_click_threshold: { default: 8 },
  copy_adv_unprofitable_targets_frequency_type: { default: 'daily' },
  copy_adv_unprofitable_targets_freq_weekly: { default: [], type: 'json_array' },
  copy_adv_unprofitable_targets_freq_month_day: { default: '' },
  copy_adv_unprofitable_targets_lookback_period: { default: 7 },
  copy_adv_unprofitable_targets_automated_rule: { default: '' },
  copy_adv_unprofitable_targets_automated_rule_value: { default: '' },
  // Ignore keywords
  ignore_keywords: { default: [], type: 'json_array' },
  // Negative Target Automation.
  nta_isactive: { default: false },
  add_asin_negatives_isactive: { default: true },
  negative_campaignlevel_isactive: { default: false },
  negative_adgrouplevel_isactive: { default: false },
  negative_byclick_isactive: { default: false },
  negative_byclick_threshold: { default: 10 },
  negative_byimpression_isactive: { default: false },
  negative_byimpression_threshold: { default: 1000 },
  negative_byctr_isactive: { default: false },
  negative_byctr_threshold: { default: 0.1 },
  nta_frequency_type: { default: 'daily' },
  nta_freq_weekly: { default: [], type: 'json_array' },
  nta_freq_month_day: { default: '' },
  nt_lookback: { default: 30 },

  copy_nta_isactive: { default: false },
  copy_add_asin_negatives_isactive: { default: true },
  copy_negative_campaignlevel_isactive: { default: false },
  copy_negative_adgrouplevel_isactive: { default: false },
  copy_negative_byclick_isactive: { default: false },
  copy_negative_byclick_threshold: { default: 10 },
  copy_negative_byimpression_isactive: { default: false },
  copy_negative_byimpression_threshold: { default: 1000 },
  copy_negative_byctr_isactive: { default: false },
  copy_negative_byctr_threshold: { default: 0.1 },
  copy_nta_frequency_type: { default: 'daily' },
  copy_nta_freq_weekly: { default: [], type: 'json_array' },
  copy_nta_freq_month_day: { default: '' },
  copy_nt_lookback: { default: 30 },
  // Negative Product Targeting.
  npt_byclick_isactive: { default: false },
  npt_byclick_threshold: { default: 3 },
  npt_frequency_type: { default: 'daily' },
  npt_freq_weekly: { default: [], type: 'json_array' },
  npt_freq_month_day: { default: '' },
  npt_lookback: { default: 30 },

  copy_npt_byclick_isactive: { default: false },
  copy_npt_byclick_threshold: { default: 3 },
  copy_npt_frequency_type: { default: 'daily' },
  copy_npt_freq_weekly: { default: [], type: 'json_array' },
  copy_npt_freq_month_day: { default: '' },
  copy_npt_lookback: { default: 30 },
  // Dayparting/Seasonality.
  daily_off_isactive: { default: false },
  weekly_off_dates: { default: [], type: 'json_array' },
  daily_off_start_hour: { default: 0 },
  daily_off_end_hour: { default: 23 },
  season_off_isactive: { default: false },
  season_off_start_date: { default: new Date(), type: 'date' },
  season_off_end_date: { default: new Date(), type: 'date' },
  season_budget_isactive: { default: false },
  season_budget_start_date: { default: new Date(), type: 'date' },
  season_budget_end_date: { default: new Date(), type: 'date' },
  increase_constantbudget_season_isactive: { default: false },
  increase_constantbudget_season_amount: { default: 0.02 },
  increase_constantbudget_season_maxmoney: { default: 10 },
  increase_percentbudget_season_isactive: { default: false },
  increase_percentbudget_season_amount: { default: 10 },
  increase_percentbudget_season_maxmoney: { default: 10 },
  // Split testing.
  // FIXME: Some database records are corrupted to have
  // `split_test_isactive` as true and `split_test_day`,
  // `split_test_start_day` as NULL.
  split_test_isactive: { default: false },
  split_test_day: { default: 14 },
  split_test_send_email: { default: false },
  split_test_start_day: { default: null, type: 'date' },
  // Keyword/Targeting Expansion.
  zero_impression_sing: { default: '%' },
  increase_percentbid_byimpression_isactive: { default: false },
  increase_percentbid_byimpression_threshold: { default: 100 },
  increase_percentbid_byimpression_amount: { default: 10 },
  increase_percentbid_byimpression_maxmoney: { default: 3 },
  // Search Term Expansion.
  st_isactive: { default: false },
  st_keywords_acos: { default: 30 },
  st_keywords_campaign_selected: { default: [], type: 'concat' },
  st_minimum_orders: { default: 3 },
  st_new_keyword_only: { default: true },
  st_ctr_isactive: { default: false },
  st_ctr_above: { default: 0 },
  st_conversion_isactive: { default: false },
  st_conversion_above: { default: 0 },
  st_adgroups_apply: { default: [], type: 'json_array' },
  st_negate_parent: { default: false },
  // Product Targeting.
  pt_isactive: { default: false },
  pt_acos: { default: 30 },
  pt_campaign_selected: { default: [], type: 'concat' },
  pt_minimum_orders: { default: 3 },
  pt_new_asins_only: { default: true },
  pt_adgroups_apply: { default: [], type: 'json_array' },
  pt_negate_parent: { default: false },
}

export const getDefaultAPSettings = (adgroupId) => {
  const settings = {}
  Object.keys(apSettings).forEach((key) => {
    settings[key] = apSettings[key].default
  })
  // If there is no AP record saved for a given ad group,
  // set `adgroup_id` setting so that a correct ad group
  // is selected in the selector.
  if (adgroupId) {
    settings.adgroup_id = adgroupId
  }
  return settings
}

// Parse JSON string of array.
const parseJsonArray = (value) => {
  try {
    return JSON.parse(value || '[]')
  } catch (e) {
    return []
  }
}

// Parse a string value of concatenated array elements into array.
const parseConcatenatedArray = (value) => {
  if (Array.isArray(value)) {
    return value
  }
  return !value ? [] : value.split(',')
}

// Parse smart pilot settings retrieved from backend.
export const parseAPSettings = (ap) => {
  Object.keys(ap).forEach((key) => {
    if (!apSettings[key]) {
      return
    }
    if (apSettings[key].type === 'json_array') {
      // Parse array-type settings.
      // `filter` method here removes NULL values.
      ap[key] = parseJsonArray(ap[key]).filter(s => s)
    } else if (apSettings[key].type === 'concat') {
      ap[key] = parseConcatenatedArray(ap[key])
    } else if (apSettings[key].type === 'date') {
      // Parse date strings to date objects.
      ap[key] = ap[key] ? new Date(ap[key]) : ap[key]
    } else if (apSettings[key].type === 'int') {
      ap[key] = parseInt(ap[key] || apSettings[key].default, 10)
    } else {
      // Set default values.
      if (typeof ap[key] === 'undefined'
        || ap[key] === null
        || ap[key] === '') {
        ap[key] = apSettings[key].default
      }
    }
  })

  return ap
}

// Parse campaigns and set their ad types appropriately.
export const parseCampaignsToApply = (campaignsToApply) => {
  const campaigns = []
  campaignsToApply.forEach((campaign) => {
    let type = ''
    if (campaign.type === 'sponsoredProducts') {
      type = 'sp'
    } else if (campaign.type === 'sponsoredDisplays') {
      type = 'sd'
    } else if (campaign.type === 'headlineSearch') {
      type = 'sbv'
    } else {
      type = 'sb'
    }

    campaigns.push({
      ...campaign,
      type,
    })
  })
  return campaigns
}

// Categorize adgroups into keyword targetings and product targetings.
export const categorizeAdgroups = (adgroups, targetings) => {
  const targetingIds = targetings.map(targeting => targeting.adgroup_id)
  const keywordAdgroups = []
  const productAdgroups = []
  adgroups.forEach((adgroup) => {
    if (targetingIds.indexOf(adgroup.id) === -1) {
      keywordAdgroups.push(Object.assign({}, adgroup))
    } else {
      productAdgroups.push(Object.assign({}, adgroup))
    }
  })
  return { keywordAdgroups, productAdgroups }
}

// Copy text to clipboard.
export const copyToClipboard = (text) => {
  const textField = document.createElement('textarea')
  textField.innerHTML = text
  document.body.appendChild(textField)
  textField.select()
  document.execCommand('copy')
  textField.remove()
}

// Return a sorter function to sort rows in tables.
// Accept a list of field names whose data type is string.
export const tableSorter = stringFields => (items, [sortBy, sortOrder]) => {
  const sortedItems = [...items]

  sortedItems.sort((a, b) => {
    let comparison
    if (stringFields.indexOf(sortBy) !== -1) {
      comparison = a[sortBy].toLowerCase().localeCompare(b[sortBy].toLowerCase())
    } else {
      comparison = parseFloat(a[sortBy] || 0) - parseFloat(b[sortBy] || 0)
    }
    return sortOrder === 'asc' ? comparison : -comparison
  })

  return sortedItems
}

export const getNormalizedCampaignType = (type) => {
  switch (type) {
    case 'sponsoredProducts':
      return 'Sponsored Products'
    case 'sponsoredDisplays':
      return 'Sponsored Displays'
    case 'headlineSearch':
      return 'Sponsored Brands Video'
    default:
      return 'Sponsored Brands'
  }
}
