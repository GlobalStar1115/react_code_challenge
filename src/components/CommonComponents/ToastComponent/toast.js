import React from 'react'
import ReactDOM from 'react-dom'

import Toast from './index'

export class ToastManager {
  constructor() {
    this.toasts = []

    const toastContainer = document.createElement('div')
    toastContainer.id = 'toast-container-main'
    toastContainer.className = 'notification-container top-right'

    const body = document.getElementsByTagName('body')[0]
    body.insertAdjacentElement('beforeend', toastContainer)

    this.containerRef = toastContainer
  }

  setPosition(position) {
    this.containerRef.className = `notification-container ${position}`
  }

  show(options) {
    const toastId = Math.random().toString(36).substr(2, 9)
    const toast = {
      id: toastId,
      ...options,
      destroy: () => this.destroy(options.id ?? toastId),
    }
    this.toasts = [toast, ...this.toasts]
    this.render()
  }

  destroy(id) {
    this.toasts = this.toasts.filter((toast) => toast.id !== id)
    this.render()
  }

  render() {
    const toastsList = this.toasts.map((toastProps) => (
      <Toast key={toastProps.id} {...toastProps} />
    ))
    ReactDOM.render(toastsList, this.containerRef)
  }
}

export const toast = new ToastManager()
