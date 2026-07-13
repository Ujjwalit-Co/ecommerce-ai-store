import { type SchemaTypeDefinition } from 'sanity'
import { customerType } from './customerType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [customerType],
}
