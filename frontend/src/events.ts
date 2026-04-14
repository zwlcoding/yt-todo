import { api } from './lib/api'

export const events = {
  taskCreated(todoId: string, hasDueDate: boolean, listToken?: string) {
    return api.trackEvent('task_created', {
      todoId,
      hasDueDate,
      source: listToken ? 'shared_list' : 'personal',
    })
  },

  taskCompleted(todoId: string, hasDueDate: boolean, listToken?: string) {
    return api.trackEvent('task_completed', {
      todoId,
      hasDueDate,
      source: listToken ? 'shared_list' : 'personal',
    })
  },

  taskDeleted(todoId: string, listToken?: string) {
    return api.trackEvent('task_deleted', {
      todoId,
      source: listToken ? 'shared_list' : 'personal',
    })
  },

  shareClicked(todoId: string) {
    return api.trackEvent('share_clicked', { todoId })
  },

  inviteAccepted(listToken: string) {
    return api.trackEvent('invite_accepted', { listToken })
  },
}
