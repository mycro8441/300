import React, { useEffect, useRef } from 'react';

let tvScriptLoadingPromise;

export default function TradingViewTechWidget() {
  const onLoadScriptRef = useRef();

  useEffect(
    () => {
      onLoadScriptRef.current = createWidget;

      function createWidget() {
        if (document.getElementById('tradingview_tech-ihsle') && 'TradingView' in window) {
          new window.TradingView.widget({
            "interval": "1m",
            "width": 425,
            "isTransparent": false,
            "height": 450,
            "symbol": "NASDAQ:AAPL",
            "showIntervalTabs": true,
            "locale": "kr",
            "colorTheme": "light"
          });
        }
      }
    },
    []
  );

  return (
    <div className='tradingview-widget-tech'>
      <div id='tradingview_tech-ihsle' />
    </div>
  );
}