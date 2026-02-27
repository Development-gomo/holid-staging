"use client";
import React, { useState } from 'react';
let PropTypes;
try {
  PropTypes = require('prop-types');
} catch (e) {
  PropTypes = {};
}

/**
 * TabsSection - Horizontal Tabs Section for InnerPageBuilder
 *
 * Props:
 * - background_type: 'dark' | 'light'
 * - tabs: {
 *     tab_details: [
 *       {
 *         tabs_content: {
 *           tab_title: string,
 *           tab_description: string (HTML from WYSIWYG)
 *         }
 *       }
 *     ]
 *   }
 */

const bgStyles = {
  dark: {
    backgroundColor: '#000821',
    color: '#fff',
  },
  light: {
    backgroundColor: '#fff',
    color: '#1F1C1C',
  },
};


const TabsSection = ({ background_type = 'light', tabs, tab_details }) => {
  // Accept tab_details either directly or inside tabs object
  const tabDetails = tab_details || tabs?.tab_details || [];
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section
      className="tabs-section"
      style={bgStyles[background_type] || bgStyles.light}
    >
      <div className="tabs-container">
        <div className="tabs-header">
          {tabDetails.map((tab, idx) => (
            <button
              key={idx}
              className={`tab-btn${activeTab === idx ? ' active' : ''}`}
              onClick={() => setActiveTab(idx)}
              type="button"
            >
              {tab.tabs?.tab_title}
            </button>
          ))}
        </div>
        <div className="tabs-content">
          {tabDetails[activeTab]?.tabs?.tab_description && (
            <div
              className="tab-description wysiwyg-content"
              dangerouslySetInnerHTML={{
                __html: tabDetails[activeTab].tabs.tab_description,
              }}
            />
          )}
        </div>
      </div>
      <style jsx>{`
        .tabs-section {
          padding: 40px 0;
          width: 100%;
        }
        .tabs-container {
          max-width: 900px;
          margin: 0 auto;
        }
        .tabs-header {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 24px;
          justify-content: center;
        }
        .tab-btn {
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          padding: 12px 24px;
          font-size: 1.1rem;
          cursor: pointer;
          color: inherit;
          transition: border-color 0.2s, color 0.2s;
        }
        .tab-btn.active {
          border-bottom: 2px solid #000821;
          font-weight: bold;
        }
        /* White border for active tab on dark background */
        .tabs-section[style*='#000821'] .tab-btn.active {
          border-bottom: 2px solid #fff;
        }
        .tabs-content {
          min-height: 180px;
        }
        .tab-description {
          font-size: 1rem;
          line-height: 1.7;
        }
        /* Responsive styles */
        @media (max-width: 600px) {
          .tabs-header {
            flex-direction: column;
            gap: 6px;
          }
          .tab-btn {
            width: 100%;
            text-align: left;
            padding: 10px 12px;
            font-size: 1rem;
          }
        }
        /* WYSIWYG content styles */
        .wysiwyg-content video,
        .wysiwyg-content iframe {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 16px 0;
        }
      `}</style>
    </section>
  );
};

TabsSection.propTypes = {
  background_type: PropTypes?.oneOf ? PropTypes.oneOf(['dark', 'light']) : undefined,
  tabs: PropTypes?.shape ? PropTypes.shape({
    tab_details: PropTypes?.arrayOf ? PropTypes.arrayOf(
      PropTypes?.shape ? PropTypes.shape({
        tabs: PropTypes?.shape ? PropTypes.shape({
          tab_title: PropTypes?.string,
          tab_description: PropTypes?.string,
        }) : undefined,
      }) : undefined
    ) : undefined,
  }) : undefined,
  tab_details: PropTypes?.arrayOf ? PropTypes.arrayOf(
    PropTypes?.shape ? PropTypes.shape({
      tabs: PropTypes?.shape ? PropTypes.shape({
        tab_title: PropTypes?.string,
        tab_description: PropTypes?.string,
      }) : undefined,
    }) : undefined
  ) : undefined,
};

export default TabsSection;
