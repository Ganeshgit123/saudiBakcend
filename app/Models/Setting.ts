import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Setting extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public key: string

  @column()
  public enValue: string

  @column()
  public arValue: string

  @column()
  public active: boolean

  @column()
  public latitude: string

  @column()
  public longitude: string

  @column()
  public canCalendarShowForDelivery: string

  @column()
  public maxDeliveryDateCanChoose: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
