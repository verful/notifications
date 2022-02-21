import { DateTime } from 'luxon'

import { column, BaseModel } from '@ioc:Adonis/Lucid/Orm'
import Config from '@ioc:Adonis/Core/Config'
import { DatabaseNotificationModel, DatabaseNotificationRow } from '@ioc:Verful/Notification'
import StaticImplements from '../Helpers/StaticImplements'

@StaticImplements<DatabaseNotificationModel>()
export default class DatabaseNotification extends BaseModel implements DatabaseNotificationRow {
  public static table = Config.get('notification.notificationsTable', 'notifications')

  @column({ isPrimary: true })
  public id: number

  @column({
    prepare: (value) => JSON.stringify(value),
    consume: (value) => JSON.parse(value),
  })
  public data: Record<string, any>

  @column()
  public notifiableId: number

  public async markAsRead() {
    if (!this.readAt) {
      this.readAt = DateTime.now()
      await this.save()
    }
  }

  public async markAsUnread() {
    if (this.readAt) {
      this.readAt = null
      await this.save()
    }
  }

  public get read() {
    return this.readAt !== null
  }

  public get unread() {
    return this.readAt === null
  }

  @column.dateTime({ autoCreate: false, autoUpdate: false })
  public readAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}