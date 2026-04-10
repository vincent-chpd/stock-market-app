import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import React, { createRef } from 'react'

// Mock the hook before importing the component
vi.mock('./hooks/useTradingViewWidget', () => ({
  default: vi.fn(() => createRef<HTMLDivElement>()),
}))

import TradingViewWidget from './TradingViewWidget'
import useTradingViewWidget from './hooks/useTradingViewWidget'

const mockUseTradingViewWidget = vi.mocked(useTradingViewWidget)

const DEFAULT_PROPS = {
  scriptUrl: 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js',
  config: { colorTheme: 'dark', locale: 'en' },
}

describe('TradingViewWidget', () => {
  beforeEach(() => {
    mockUseTradingViewWidget.mockReturnValue(createRef<HTMLDivElement>())
  })

  describe('title rendering', () => {
    it('renders the title when provided', () => {
      render(<TradingViewWidget {...DEFAULT_PROPS} title="Market Overview" />)
      expect(screen.getByText('Market Overview')).toBeInTheDocument()
    })

    it('renders title as an h3 element', () => {
      render(<TradingViewWidget {...DEFAULT_PROPS} title="Stock Heatmap" />)
      const heading = screen.getByRole('heading', { level: 3 })
      expect(heading).toBeInTheDocument()
      expect(heading).toHaveTextContent('Stock Heatmap')
    })

    it('does not render h3 when title is omitted', () => {
      render(<TradingViewWidget {...DEFAULT_PROPS} />)
      expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    })

    it('does not render h3 when title is an empty string', () => {
      render(<TradingViewWidget {...DEFAULT_PROPS} title="" />)
      expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    })
  })

  describe('container class names', () => {
    it('always renders tradingview-widget-container class on the container', () => {
      const { container } = render(<TradingViewWidget {...DEFAULT_PROPS} />)
      expect(container.querySelector('.tradingview-widget-container')).toBeInTheDocument()
    })

    it('merges custom className with tradingview-widget-container', () => {
      const { container } = render(
        <TradingViewWidget {...DEFAULT_PROPS} className="custom-chart" />
      )
      const widgetContainer = container.querySelector('.tradingview-widget-container')
      expect(widgetContainer).toHaveClass('tradingview-widget-container')
      expect(widgetContainer).toHaveClass('custom-chart')
    })

    it('renders without custom className when not provided', () => {
      const { container } = render(<TradingViewWidget {...DEFAULT_PROPS} />)
      const widgetContainer = container.querySelector('.tradingview-widget-container')
      expect(widgetContainer).toBeInTheDocument()
      expect(widgetContainer?.className).not.toContain('undefined')
    })
  })

  describe('widget inner element', () => {
    it('renders the inner widget div', () => {
      const { container } = render(<TradingViewWidget {...DEFAULT_PROPS} />)
      expect(
        container.querySelector('.tradingview-widget-container__widget')
      ).toBeInTheDocument()
    })

    it('applies the default height of 600 to the inner widget', () => {
      const { container } = render(<TradingViewWidget {...DEFAULT_PROPS} />)
      const widget = container.querySelector('.tradingview-widget-container__widget') as HTMLElement
      expect(widget.style.height).toBe('600px')
    })

    it('applies a custom height to the inner widget', () => {
      const { container } = render(<TradingViewWidget {...DEFAULT_PROPS} height={800} />)
      const widget = container.querySelector('.tradingview-widget-container__widget') as HTMLElement
      expect(widget.style.height).toBe('800px')
    })

    it('sets width to 100% on the inner widget', () => {
      const { container } = render(<TradingViewWidget {...DEFAULT_PROPS} />)
      const widget = container.querySelector('.tradingview-widget-container__widget') as HTMLElement
      expect(widget.style.width).toBe('100%')
    })
  })

  describe('outer wrapper', () => {
    it('renders an outer div with w-full class', () => {
      const { container } = render(<TradingViewWidget {...DEFAULT_PROPS} />)
      const outer = container.firstElementChild as HTMLElement
      expect(outer.tagName).toBe('DIV')
      expect(outer).toHaveClass('w-full')
    })
  })

  describe('hook integration', () => {
    it('calls useTradingViewWidget with scriptUrl, config, and height', () => {
      const config = { colorTheme: 'dark' }
      render(
        <TradingViewWidget
          scriptUrl="https://example.com/widget.js"
          config={config}
          height={700}
        />
      )
      expect(mockUseTradingViewWidget).toHaveBeenCalledWith(
        'https://example.com/widget.js',
        config,
        700
      )
    })

    it('calls useTradingViewWidget with default height 600 when not specified', () => {
      const config = { locale: 'en' }
      render(
        <TradingViewWidget
          scriptUrl="https://example.com/widget.js"
          config={config}
        />
      )
      expect(mockUseTradingViewWidget).toHaveBeenCalledWith(
        'https://example.com/widget.js',
        config,
        600
      )
    })
  })

  describe('edge cases', () => {
    it('renders correctly with an empty config object', () => {
      expect(() => {
        render(<TradingViewWidget scriptUrl="https://example.com/widget.js" config={{}} />)
      }).not.toThrow()
    })

    it('renders correctly with height of 0', () => {
      const { container } = render(
        <TradingViewWidget {...DEFAULT_PROPS} height={0} />
      )
      const widget = container.querySelector('.tradingview-widget-container__widget') as HTMLElement
      expect(widget.style.height).toBe('0px')
    })

    it('renders correctly with a very large height', () => {
      const { container } = render(
        <TradingViewWidget {...DEFAULT_PROPS} height={9999} />
      )
      const widget = container.querySelector('.tradingview-widget-container__widget') as HTMLElement
      expect(widget.style.height).toBe('9999px')
    })

    it('renders both title and widget elements when title is provided', () => {
      const { container } = render(
        <TradingViewWidget {...DEFAULT_PROPS} title="Test Widget" />
      )
      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument()
      expect(container.querySelector('.tradingview-widget-container__widget')).toBeInTheDocument()
    })
  })
})