import React, { useState, useEffect, useRef } from 'react'

const Section = ({ children }) => {
  const sectionRef = useRef(null)

  const [activeSubSection, setActiveSubSection] = useState(null)
  const [scrolledSub, setScrolledSub] = useState()

  useEffect(() => {
    if (activeSubSection && scrolledSub) {
      const container = document.getElementsByClassName('apm-component')
      if (container.length) {
        // Scroll to the top of sub-section.
        container[0].scrollTo({
          top: scrolledSub.current.offsetTop - sectionRef.current.offsetTop,
          behavior: 'smooth',
        })
      }
    }
  }, [activeSubSection]) // eslint-disable-line

  const onToggle = (id, subRef) => {
    // If a sub section is already expanded, collapse it.
    if (activeSubSection === id) {
      setActiveSubSection(null)
    } else {
      setActiveSubSection(id)

      setScrolledSub(subRef)
    }
  }

  return (
    <div className="section-container" ref={sectionRef}>
      {
        React.Children.map(children, child => (
          child ? React.cloneElement(child, {
            activeSubSection,
            onToggle,
          }) : null
        ))
      }
    </div>
  )
}

export default Section
