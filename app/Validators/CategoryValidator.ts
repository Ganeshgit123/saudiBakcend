import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CategoryValidator {
  constructor(protected ctx: HttpContextContract) { }

  public get data() {
    return {
      ...this.ctx.request.all(),
    }
  }

  public schema = schema.create({
    name: schema.string.optional(),
    arName: schema.string.optional(),
    enName: schema.string.optional(),
    image: schema.string.optional(),
  })

  public messages = {
    'required': '{{ field }} is required',
    '*': (field, rule) => {
      return `${rule} validation error on ${field}`
    },
  }
  public cacheKey = this.ctx.routeKey

}