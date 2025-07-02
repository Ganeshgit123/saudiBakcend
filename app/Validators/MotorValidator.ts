import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class MotorValidator {
  constructor(protected ctx: HttpContextContract) {}

  public get data() {
    return {
      ...this.ctx.request.all(),
    }
  }

  public schema = schema.create({
    name: schema.string(),
    arName: schema.string()
  })

  public messages = {
    'required': '{{ field }} is required',
    '*': (field, rule) => {
      return `${rule} validation error on ${field}`
    },
  }
  public cacheKey = this.ctx.routeKey

}
