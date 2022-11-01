import React from 'react'

import LogoBigSvg from '../../assets/svg/logo-big2.svg'
import SticksSvg from '../../assets/svg/login/sticks.svg'
import { ReactComponent as UnionSvg } from '../../assets/svg/login/union.svg'

const AuthSideComponent = ({ children }) => {
  return (
    <div className="auth-side-component">
      <div className="auth-side-header">
        <UnionSvg />
        <img src={LogoBigSvg} alt="PPC Entourage" />
      </div>
      <div className="auth-side-contents">
        <img className="auth-stick-bg" src={SticksSvg} alt="Background" />
        { children }
      </div>
    </div>
  )
}

export default AuthSideComponent
