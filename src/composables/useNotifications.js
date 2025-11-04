import { Notify } from 'quasar'
import {
  NOTIFICATION_TIMEOUT,
  NOTIFICATION_POSITION,
  NOTIFICATION_ICONS
} from '../constants'

const CLOSE_ACTION = { icon: 'close', color: 'white' }

function createNotification(type, message, caption = '') {
  const timeoutMap = {
    positive: NOTIFICATION_TIMEOUT.SUCCESS,
    negative: NOTIFICATION_TIMEOUT.ERROR,
    warning: NOTIFICATION_TIMEOUT.WARNING,
    info: NOTIFICATION_TIMEOUT.INFO
  }

  const iconMap = {
    positive: NOTIFICATION_ICONS.SUCCESS,
    negative: NOTIFICATION_ICONS.ERROR,
    warning: NOTIFICATION_ICONS.WARNING,
    info: NOTIFICATION_ICONS.INFO
  }

  Notify.create({
    type,
    message,
    caption,
    position: NOTIFICATION_POSITION,
    timeout: timeoutMap[type],
    icon: iconMap[type],
    actions: [CLOSE_ACTION]
  })
}

export function useNotifications() {
  const success = (message, caption = '') => {
    createNotification('positive', message, caption)
  }

  const error = (message, caption = '') => {
    createNotification('negative', message, caption)
  }

  const warning = (message, caption = '') => {
    createNotification('warning', message, caption)
  }

  const info = (message, caption = '') => {
    createNotification('info', message, caption)
  }

  return { success, error, warning, info }
}