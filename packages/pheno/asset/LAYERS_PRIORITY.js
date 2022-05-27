import { first } from '@vect/object-index'

export const LAYERS_PRIORITY = [ 'Regular', 'Roman', 'Medium', 'SemiBold', 'Semi', 'Demi', 'Light' ]

export const getFace = (layerToBody) => {
  for (let layer in LAYERS_PRIORITY) if (layer in layerToBody) return layer
  return first(layerToBody)
}