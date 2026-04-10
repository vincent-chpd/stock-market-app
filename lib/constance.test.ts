import { describe, it, expect } from 'vitest'
import {
  NAV_ITEMS,
  INVESTMENT_GOALS,
  RISK_TOLERANCE_OPTIONS,
  PREFERRED_INDUSTRIES,
  ALERT_TYPE_OPTIONS,
  CONDITION_OPTIONS,
  MARKET_OVERVIEW_WIDGET_CONFIG,
  HEATMAP_WIDGET_CONFIG,
  TOP_STORIES_WIDGET_CONFIG,
  MARKET_DATA_WIDGET_CONFIG,
  SYMBOL_INFO_WIDGET_CONFIG,
  CANDLE_CHART_WIDGET_CONFIG,
  BASELINE_WIDGET_CONFIG,
  TECHNICAL_ANALYSIS_WIDGET_CONFIG,
  COMPANY_PROFILE_WIDGET_CONFIG,
  COMPANY_FINANCIALS_WIDGET_CONFIG,
  POPULAR_STOCK_SYMBOLS,
  NO_MARKET_NEWS,
  WATCHLIST_TABLE_HEADER,
} from './constance'

describe('NAV_ITEMS', () => {
  it('contains three navigation items', () => {
    expect(NAV_ITEMS).toHaveLength(3)
  })

  it('has the correct href and label for each item', () => {
    expect(NAV_ITEMS[0]).toEqual({ href: '/', label: 'Dashboard' })
    expect(NAV_ITEMS[1]).toEqual({ href: '/search', label: 'Search' })
    expect(NAV_ITEMS[2]).toEqual({ href: '/watchlist', label: 'Watchlist' })
  })
})

describe('INVESTMENT_GOALS', () => {
  it('contains four investment goal options', () => {
    expect(INVESTMENT_GOALS).toHaveLength(4)
  })

  it('each entry has matching value and label', () => {
    for (const item of INVESTMENT_GOALS) {
      expect(item.value).toBe(item.label)
    }
  })

  it('includes Growth, Income, Balanced, Conservative', () => {
    const values = INVESTMENT_GOALS.map((i) => i.value)
    expect(values).toContain('Growth')
    expect(values).toContain('Income')
    expect(values).toContain('Balanced')
    expect(values).toContain('Conservative')
  })
})

describe('RISK_TOLERANCE_OPTIONS', () => {
  it('contains three risk tolerance levels', () => {
    expect(RISK_TOLERANCE_OPTIONS).toHaveLength(3)
  })

  it('has Low, Medium, High options', () => {
    const values = RISK_TOLERANCE_OPTIONS.map((o) => o.value)
    expect(values).toEqual(['Low', 'Medium', 'High'])
  })

  it('each entry has matching value and label', () => {
    for (const item of RISK_TOLERANCE_OPTIONS) {
      expect(item.value).toBe(item.label)
    }
  })
})

describe('PREFERRED_INDUSTRIES', () => {
  it('contains five industry options', () => {
    expect(PREFERRED_INDUSTRIES).toHaveLength(5)
  })

  it('includes Technology, Healthcare, Finance, Energy, Consumer Goods', () => {
    const values = PREFERRED_INDUSTRIES.map((i) => i.value)
    expect(values).toContain('Technology')
    expect(values).toContain('Healthcare')
    expect(values).toContain('Finance')
    expect(values).toContain('Energy')
    expect(values).toContain('Consumer Goods')
  })

  it('each entry has matching value and label', () => {
    for (const item of PREFERRED_INDUSTRIES) {
      expect(item.value).toBe(item.label)
    }
  })
})

describe('ALERT_TYPE_OPTIONS', () => {
  it('contains two alert type options', () => {
    expect(ALERT_TYPE_OPTIONS).toHaveLength(2)
  })

  it('has upper and lower options', () => {
    expect(ALERT_TYPE_OPTIONS[0]).toEqual({ value: 'upper', label: 'Upper' })
    expect(ALERT_TYPE_OPTIONS[1]).toEqual({ value: 'lower', label: 'Lower' })
  })
})

describe('CONDITION_OPTIONS', () => {
  it('contains two condition options', () => {
    expect(CONDITION_OPTIONS).toHaveLength(2)
  })

  it('has greater and less options with correct labels', () => {
    expect(CONDITION_OPTIONS[0]).toEqual({ value: 'greater', label: 'Greater than (>)' })
    expect(CONDITION_OPTIONS[1]).toEqual({ value: 'less', label: 'Less than (<)' })
  })
})

describe('MARKET_OVERVIEW_WIDGET_CONFIG', () => {
  it('uses dark color theme', () => {
    expect(MARKET_OVERVIEW_WIDGET_CONFIG.colorTheme).toBe('dark')
  })

  it('has three tabs: Financial, Technology, Services', () => {
    expect(MARKET_OVERVIEW_WIDGET_CONFIG.tabs).toHaveLength(3)
    const titles = MARKET_OVERVIEW_WIDGET_CONFIG.tabs.map((t) => t.title)
    expect(titles).toEqual(['Financial', 'Technology', 'Services'])
  })

  it('is transparent and shows floating tooltip', () => {
    expect(MARKET_OVERVIEW_WIDGET_CONFIG.isTransparent).toBe(true)
    expect(MARKET_OVERVIEW_WIDGET_CONFIG.showFloatingTooltip).toBe(true)
  })

  it('has a height of 600 and full width', () => {
    expect(MARKET_OVERVIEW_WIDGET_CONFIG.height).toBe(600)
    expect(MARKET_OVERVIEW_WIDGET_CONFIG.width).toBe('100%')
  })

  it('Financial tab has 6 symbols', () => {
    const financialTab = MARKET_OVERVIEW_WIDGET_CONFIG.tabs.find((t) => t.title === 'Financial')
    expect(financialTab?.symbols).toHaveLength(6)
  })

  it('Technology tab includes NASDAQ:AAPL as Apple', () => {
    const techTab = MARKET_OVERVIEW_WIDGET_CONFIG.tabs.find((t) => t.title === 'Technology')
    const apple = techTab?.symbols.find((s) => s.s === 'NASDAQ:AAPL')
    expect(apple).toEqual({ s: 'NASDAQ:AAPL', d: 'Apple' })
  })
})

describe('HEATMAP_WIDGET_CONFIG', () => {
  it('uses SPX500 as data source', () => {
    expect(HEATMAP_WIDGET_CONFIG.dataSource).toBe('SPX500')
  })

  it('groups by sector', () => {
    expect(HEATMAP_WIDGET_CONFIG.grouping).toBe('sector')
  })

  it('is transparent with dark theme', () => {
    expect(HEATMAP_WIDGET_CONFIG.isTransparent).toBe(true)
    expect(HEATMAP_WIDGET_CONFIG.colorTheme).toBe('dark')
  })

  it('is zoom-enabled with symbol tooltip', () => {
    expect(HEATMAP_WIDGET_CONFIG.isZoomEnabled).toBe(true)
    expect(HEATMAP_WIDGET_CONFIG.hasSymbolTooltip).toBe(true)
  })

  it('has no top bar and no dataset toggle', () => {
    expect(HEATMAP_WIDGET_CONFIG.hasTopBar).toBe(false)
    expect(HEATMAP_WIDGET_CONFIG.isDataSetEnabled).toBe(false)
  })

  it('has empty exchanges array', () => {
    expect(HEATMAP_WIDGET_CONFIG.exchanges).toEqual([])
  })
})

describe('TOP_STORIES_WIDGET_CONFIG', () => {
  it('uses market feed mode for stocks', () => {
    expect(TOP_STORIES_WIDGET_CONFIG.feedMode).toBe('market')
    expect(TOP_STORIES_WIDGET_CONFIG.market).toBe('stock')
  })

  it('uses regular display mode with dark theme', () => {
    expect(TOP_STORIES_WIDGET_CONFIG.displayMode).toBe('regular')
    expect(TOP_STORIES_WIDGET_CONFIG.colorTheme).toBe('dark')
  })

  it('is transparent with en locale', () => {
    expect(TOP_STORIES_WIDGET_CONFIG.isTransparent).toBe(true)
    expect(TOP_STORIES_WIDGET_CONFIG.locale).toBe('en')
  })
})

describe('MARKET_DATA_WIDGET_CONFIG', () => {
  it('has title Stocks', () => {
    expect(MARKET_DATA_WIDGET_CONFIG.title).toBe('Stocks')
  })

  it('uses dark theme', () => {
    expect(MARKET_DATA_WIDGET_CONFIG.colorTheme).toBe('dark')
  })

  it('is not transparent', () => {
    expect(MARKET_DATA_WIDGET_CONFIG.isTransparent).toBe(false)
  })

  it('has three symbolsGroups: Financial, Technology, Services', () => {
    expect(MARKET_DATA_WIDGET_CONFIG.symbolsGroups).toHaveLength(3)
    const names = MARKET_DATA_WIDGET_CONFIG.symbolsGroups.map((g) => g.name)
    expect(names).toEqual(['Financial', 'Technology', 'Services'])
  })

  it('Financial group has 6 symbols', () => {
    const financial = MARKET_DATA_WIDGET_CONFIG.symbolsGroups.find((g) => g.name === 'Financial')
    expect(financial?.symbols).toHaveLength(6)
  })

  it('Technology group contains NASDAQ:MSFT as Microsoft', () => {
    const tech = MARKET_DATA_WIDGET_CONFIG.symbolsGroups.find((g) => g.name === 'Technology')
    const msft = tech?.symbols.find((s) => s.name === 'NASDAQ:MSFT')
    expect(msft).toEqual({ name: 'NASDAQ:MSFT', displayName: 'Microsoft' })
  })

  it('has height of 600 and full width', () => {
    expect(MARKET_DATA_WIDGET_CONFIG.height).toBe(600)
    expect(MARKET_DATA_WIDGET_CONFIG.width).toBe('100%')
  })
})

describe('SYMBOL_INFO_WIDGET_CONFIG', () => {
  it('uppercases the symbol', () => {
    const config = SYMBOL_INFO_WIDGET_CONFIG('aapl')
    expect(config.symbol).toBe('AAPL')
  })

  it('returns dark theme and transparent true', () => {
    const config = SYMBOL_INFO_WIDGET_CONFIG('TSLA')
    expect(config.colorTheme).toBe('dark')
    expect(config.isTransparent).toBe(true)
  })

  it('has height of 170 and full width', () => {
    const config = SYMBOL_INFO_WIDGET_CONFIG('MSFT')
    expect(config.height).toBe(170)
    expect(config.width).toBe('100%')
  })

  it('handles already-uppercase symbol without change', () => {
    const config = SYMBOL_INFO_WIDGET_CONFIG('GOOGL')
    expect(config.symbol).toBe('GOOGL')
  })

  it('handles mixed-case symbol', () => {
    const config = SYMBOL_INFO_WIDGET_CONFIG('NvDa')
    expect(config.symbol).toBe('NVDA')
  })
})

describe('CANDLE_CHART_WIDGET_CONFIG', () => {
  it('uppercases the symbol', () => {
    const config = CANDLE_CHART_WIDGET_CONFIG('nvda')
    expect(config.symbol).toBe('NVDA')
  })

  it('uses style 1 (candlestick)', () => {
    const config = CANDLE_CHART_WIDGET_CONFIG('AAPL')
    expect(config.style).toBe(1)
  })

  it('has daily interval', () => {
    const config = CANDLE_CHART_WIDGET_CONFIG('AAPL')
    expect(config.interval).toBe('D')
  })

  it('disallows symbol change', () => {
    const config = CANDLE_CHART_WIDGET_CONFIG('AAPL')
    expect(config.allow_symbol_change).toBe(false)
  })

  it('has dark theme and UTC timezone', () => {
    const config = CANDLE_CHART_WIDGET_CONFIG('AAPL')
    expect(config.theme).toBe('dark')
    expect(config.timezone).toBe('Etc/UTC')
  })

  it('has height 600 and full width', () => {
    const config = CANDLE_CHART_WIDGET_CONFIG('AAPL')
    expect(config.height).toBe(600)
    expect(config.width).toBe('100%')
  })

  it('has empty arrays for watchlist, compareSymbols, studies', () => {
    const config = CANDLE_CHART_WIDGET_CONFIG('AAPL')
    expect(config.watchlist).toEqual([])
    expect(config.compareSymbols).toEqual([])
    expect(config.studies).toEqual([])
  })
})

describe('BASELINE_WIDGET_CONFIG', () => {
  it('uppercases the symbol', () => {
    const config = BASELINE_WIDGET_CONFIG('meta')
    expect(config.symbol).toBe('META')
  })

  it('uses style 10 (baseline)', () => {
    const config = BASELINE_WIDGET_CONFIG('META')
    expect(config.style).toBe(10)
  })

  it('has details disabled unlike CANDLE_CHART', () => {
    const config = BASELINE_WIDGET_CONFIG('META')
    expect(config.details).toBe(false)
  })

  it('hides side toolbar and does not save image', () => {
    const config = BASELINE_WIDGET_CONFIG('META')
    expect(config.hide_side_toolbar).toBe(true)
    expect(config.save_image).toBe(false)
  })

  it('has dark background color #141414', () => {
    const config = BASELINE_WIDGET_CONFIG('META')
    expect(config.backgroundColor).toBe('#141414')
  })
})

describe('TECHNICAL_ANALYSIS_WIDGET_CONFIG', () => {
  it('uppercases the symbol', () => {
    const config = TECHNICAL_ANALYSIS_WIDGET_CONFIG('amzn')
    expect(config.symbol).toBe('AMZN')
  })

  it('uses 1h interval', () => {
    const config = TECHNICAL_ANALYSIS_WIDGET_CONFIG('AMZN')
    expect(config.interval).toBe('1h')
  })

  it('has height of 400', () => {
    const config = TECHNICAL_ANALYSIS_WIDGET_CONFIG('AMZN')
    expect(config.height).toBe(400)
  })

  it('has dark color theme', () => {
    const config = TECHNICAL_ANALYSIS_WIDGET_CONFIG('AMZN')
    expect(config.colorTheme).toBe('dark')
  })
})

describe('COMPANY_PROFILE_WIDGET_CONFIG', () => {
  it('uppercases the symbol', () => {
    const config = COMPANY_PROFILE_WIDGET_CONFIG('tsla')
    expect(config.symbol).toBe('TSLA')
  })

  it('has height of 440', () => {
    const config = COMPANY_PROFILE_WIDGET_CONFIG('TSLA')
    expect(config.height).toBe(440)
  })

  it('uses dark color theme', () => {
    const config = COMPANY_PROFILE_WIDGET_CONFIG('TSLA')
    expect(config.colorTheme).toBe('dark')
  })

  it('has en locale and full width', () => {
    const config = COMPANY_PROFILE_WIDGET_CONFIG('TSLA')
    expect(config.locale).toBe('en')
    expect(config.width).toBe('100%')
  })
})

describe('COMPANY_FINANCIALS_WIDGET_CONFIG', () => {
  it('uppercases the symbol', () => {
    const config = COMPANY_FINANCIALS_WIDGET_CONFIG('nflx')
    expect(config.symbol).toBe('NFLX')
  })

  it('has height of 464', () => {
    const config = COMPANY_FINANCIALS_WIDGET_CONFIG('NFLX')
    expect(config.height).toBe(464)
  })

  it('uses regular display mode', () => {
    const config = COMPANY_FINANCIALS_WIDGET_CONFIG('NFLX')
    expect(config.displayMode).toBe('regular')
  })

  it('has dark color theme and en locale', () => {
    const config = COMPANY_FINANCIALS_WIDGET_CONFIG('NFLX')
    expect(config.colorTheme).toBe('dark')
    expect(config.locale).toBe('en')
  })
})

describe('POPULAR_STOCK_SYMBOLS', () => {
  it('is a non-empty array of strings', () => {
    expect(Array.isArray(POPULAR_STOCK_SYMBOLS)).toBe(true)
    expect(POPULAR_STOCK_SYMBOLS.length).toBeGreaterThan(0)
  })

  it('contains 50 symbols', () => {
    expect(POPULAR_STOCK_SYMBOLS).toHaveLength(50)
  })

  it('all symbols are uppercase strings', () => {
    for (const symbol of POPULAR_STOCK_SYMBOLS) {
      expect(typeof symbol).toBe('string')
      expect(symbol).toBe(symbol.toUpperCase())
    }
  })

  it('includes well-known tech giants', () => {
    expect(POPULAR_STOCK_SYMBOLS).toContain('AAPL')
    expect(POPULAR_STOCK_SYMBOLS).toContain('MSFT')
    expect(POPULAR_STOCK_SYMBOLS).toContain('GOOGL')
    expect(POPULAR_STOCK_SYMBOLS).toContain('AMZN')
    expect(POPULAR_STOCK_SYMBOLS).toContain('TSLA')
  })

  it('contains no duplicate symbols', () => {
    const unique = new Set(POPULAR_STOCK_SYMBOLS)
    expect(unique.size).toBe(POPULAR_STOCK_SYMBOLS.length)
  })
})

describe('NO_MARKET_NEWS', () => {
  it('is a non-empty string', () => {
    expect(typeof NO_MARKET_NEWS).toBe('string')
    expect(NO_MARKET_NEWS.length).toBeGreaterThan(0)
  })

  it('contains the expected no-news message text', () => {
    expect(NO_MARKET_NEWS).toContain('No market news available today')
  })

  it('is a paragraph HTML element', () => {
    expect(NO_MARKET_NEWS.trim()).toMatch(/^<p /)
    expect(NO_MARKET_NEWS.trim()).toMatch(/<\/p>$/)
  })

  it('includes the mobile-text CSS class', () => {
    expect(NO_MARKET_NEWS).toContain('class="mobile-text"')
  })
})

describe('WATCHLIST_TABLE_HEADER', () => {
  it('contains eight column headers', () => {
    expect(WATCHLIST_TABLE_HEADER).toHaveLength(8)
  })

  it('has the correct header labels in order', () => {
    expect(WATCHLIST_TABLE_HEADER).toEqual([
      'Company',
      'Symbol',
      'Price',
      'Change',
      'Market Cap',
      'P/E Ratio',
      'Alert',
      'Action',
    ])
  })

  it('all headers are non-empty strings', () => {
    for (const header of WATCHLIST_TABLE_HEADER) {
      expect(typeof header).toBe('string')
      expect(header.length).toBeGreaterThan(0)
    }
  })
})