import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'

// Mock TradingViewWidget to avoid external script injection in tests
vi.mock('@/components/TradingViewWidget', () => ({
  default: vi.fn(({ title, scriptUrl, height, className }: {
    title?: string
    scriptUrl: string
    config: Record<string, unknown>
    height?: number
    className?: string
  }) => (
    <div
      data-testid="trading-view-widget"
      data-script-url={scriptUrl}
      data-height={height}
      data-classname={className}
    >
      {title && <span data-testid="widget-title">{title}</span>}
    </div>
  )),
}))

import Home from './page'
import { MARKET_DATA_WIDGET_CONFIG, HEATMAP_WIDGET_CONFIG, TOP_STORIES_WIDGET_CONFIG } from '@/lib/constance'
import TradingViewWidget from '@/components/TradingViewWidget'

const mockTradingViewWidget = vi.mocked(TradingViewWidget)

type WidgetProps = {
  title?: string
  scriptUrl: string
  config: Record<string, unknown>
  height?: number
  className?: string
}

function getWidgetCalls(): WidgetProps[] {
  return mockTradingViewWidget.mock.calls.map((call) => call[0] as WidgetProps)
}

describe('Home page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('layout structure', () => {
    it('renders the outer home-wrapper div', () => {
      const { container } = render(<Home />)
      const wrapper = container.querySelector('.home-wrapper')
      expect(wrapper).toBeInTheDocument()
    })

    it('renders exactly two sections', () => {
      const { container } = render(<Home />)
      const sections = container.querySelectorAll('section')
      expect(sections).toHaveLength(2)
    })

    it('each section has the home-section class', () => {
      const { container } = render(<Home />)
      const sections = container.querySelectorAll('section.home-section')
      expect(sections).toHaveLength(2)
    })
  })

  describe('widget instances', () => {
    it('renders exactly four TradingViewWidget instances', () => {
      render(<Home />)
      const widgets = screen.getAllByTestId('trading-view-widget')
      expect(widgets).toHaveLength(4)
    })

    it('renders Market Overview widget with correct title', () => {
      render(<Home />)
      expect(screen.getByText('Market Overview')).toBeInTheDocument()
    })

    it('renders Stock Heatmap widget with correct title', () => {
      render(<Home />)
      expect(screen.getByText('Stock Heatmap')).toBeInTheDocument()
    })

    it('renders exactly two titled widgets', () => {
      render(<Home />)
      const titles = screen.getAllByTestId('widget-title')
      expect(titles).toHaveLength(2)
    })
  })

  describe('script URLs', () => {
    it('uses the correct TradingView base URL prefix for all widgets', () => {
      render(<Home />)
      const widgets = screen.getAllByTestId('trading-view-widget')
      for (const widget of widgets) {
        expect(widget.getAttribute('data-script-url')).toContain(
          'https://s3.tradingview.com/external-embedding/embed-widget-'
        )
      }
    })

    it('uses market-overview.js for the Market Overview widget', () => {
      render(<Home />)
      const calls = getWidgetCalls()
      const found = calls.some((p) =>
        p.scriptUrl === 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js'
      )
      expect(found).toBe(true)
    })

    it('uses stock-heatmap.js for the Stock Heatmap widget', () => {
      render(<Home />)
      const calls = getWidgetCalls()
      const found = calls.some(
        (p) =>
          p.scriptUrl === 'https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js' &&
          p.title === 'Stock Heatmap'
      )
      expect(found).toBe(true)
    })

    it('uses timeline.js for the news widget', () => {
      render(<Home />)
      const calls = getWidgetCalls()
      const found = calls.some((p) =>
        p.scriptUrl === 'https://s3.tradingview.com/external-embedding/embed-widget-timeline.js'
      )
      expect(found).toBe(true)
    })

    it('uses market-quotes.js for the last widget', () => {
      render(<Home />)
      const calls = getWidgetCalls()
      const found = calls.some((p) =>
        p.scriptUrl === 'https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js'
      )
      expect(found).toBe(true)
    })

    it('all four widget script URLs are distinct', () => {
      render(<Home />)
      const calls = getWidgetCalls()
      const urls = calls.map((p) => p.scriptUrl)
      const unique = new Set(urls)
      expect(unique.size).toBe(4)
    })
  })

  describe('widget configurations', () => {
    it('passes MARKET_DATA_WIDGET_CONFIG to the Market Overview widget', () => {
      render(<Home />)
      const calls = getWidgetCalls()
      const found = calls.some((p) => p.title === 'Market Overview' && p.config === MARKET_DATA_WIDGET_CONFIG)
      expect(found).toBe(true)
    })

    it('passes HEATMAP_WIDGET_CONFIG to the Stock Heatmap widget', () => {
      render(<Home />)
      const calls = getWidgetCalls()
      const found = calls.some((p) => p.title === 'Stock Heatmap' && p.config === HEATMAP_WIDGET_CONFIG)
      expect(found).toBe(true)
    })

    it('passes TOP_STORIES_WIDGET_CONFIG to the timeline widget', () => {
      render(<Home />)
      const calls = getWidgetCalls()
      const found = calls.some(
        (p) => p.scriptUrl.includes('timeline') && p.config === TOP_STORIES_WIDGET_CONFIG
      )
      expect(found).toBe(true)
    })

    it('passes MARKET_DATA_WIDGET_CONFIG to the market-quotes widget', () => {
      render(<Home />)
      const calls = getWidgetCalls()
      const found = calls.some(
        (p) => p.scriptUrl.includes('market-quotes') && p.config === MARKET_DATA_WIDGET_CONFIG
      )
      expect(found).toBe(true)
    })
  })

  describe('widget props', () => {
    it('all four widgets have height of 600', () => {
      render(<Home />)
      const calls = getWidgetCalls()
      expect(calls).toHaveLength(4)
      for (const props of calls) {
        expect(props.height).toBe(600)
      }
    })

    it('Market Overview widget has custom-chart className', () => {
      render(<Home />)
      const calls = getWidgetCalls()
      const marketOverview = calls.find((p) => p.title === 'Market Overview')
      expect(marketOverview?.className).toBe('custom-chart')
    })

    it('timeline widget has custom-chart className', () => {
      render(<Home />)
      const calls = getWidgetCalls()
      const timeline = calls.find((p) => p.scriptUrl.includes('timeline'))
      expect(timeline?.className).toBe('custom-chart')
    })

    it('Stock Heatmap widget does not have a custom className', () => {
      render(<Home />)
      const calls = getWidgetCalls()
      const heatmap = calls.find((p) => p.title === 'Stock Heatmap')
      expect(heatmap).toBeDefined()
      expect(heatmap?.className).toBeUndefined()
    })

    it('market-quotes widget does not have a title', () => {
      render(<Home />)
      const calls = getWidgetCalls()
      const quotesWidget = calls.find((p) => p.scriptUrl.includes('market-quotes'))
      expect(quotesWidget).toBeDefined()
      expect(quotesWidget?.title).toBeUndefined()
    })

    it('timeline widget does not have a title', () => {
      render(<Home />)
      const calls = getWidgetCalls()
      const timelineWidget = calls.find((p) => p.scriptUrl.includes('timeline'))
      expect(timelineWidget).toBeDefined()
      expect(timelineWidget?.title).toBeUndefined()
    })
  })
})