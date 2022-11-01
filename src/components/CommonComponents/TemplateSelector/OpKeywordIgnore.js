import React from 'react'

const OpKeywordIgnore = ({ details }) => {
  if (!details.ignore_keywords || details.ignore_keywords === 'undefined') {
    return null
  }

  try {
    const keywords = JSON.parse(details.ignore_keywords)
    const sanitizedKeywords = []
    keywords.forEach((keyword) => {
      if (keyword) {
        sanitizedKeywords.push(keyword)
      }
    })

    if (!sanitizedKeywords.length) {
      return null
    }

    return (
      <div className="setting-subsection">
        <div className="subsection-name">
          Ignore Keywords/Targets
        </div>
        <div className="setting-wrapper">
          { sanitizedKeywords.join(', ') }
        </div>
      </div>
    )
  } catch (e) {
    return null
  }
}

export default OpKeywordIgnore
