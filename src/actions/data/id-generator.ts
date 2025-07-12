// Utility for generating unique IDs consistently
export class IdGenerator {
  private static instance: IdGenerator
  private counter = 0

  private constructor() {}

  static getInstance(): IdGenerator {
    if (!IdGenerator.instance) {
      IdGenerator.instance = new IdGenerator()
    }
    return IdGenerator.instance
  }

  generateId(prefix = ""): string {
    this.counter++
    const timestamp = Date.now()
    const random = Math.random().toString(36).substr(2, 9)
    const uuid = crypto.randomUUID()

    return `${prefix}${prefix ? "-" : ""}${timestamp}-${this.counter}-${random}-${uuid}`
  }

  generateCardId(): string {
    return this.generateId("card")
  }

  generateSlideId(): string {
    return this.generateId("slide")
  }

  generateContentId(): string {
    return this.generateId("content")
  }
}

export const idGenerator = IdGenerator.getInstance()
