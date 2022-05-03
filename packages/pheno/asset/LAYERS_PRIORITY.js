import { firstKey } from '@vect/object-select'

export const LAYERS_PRIORITY = [ 'Regular', 'Roman', 'Medium', 'SemiBold', 'Semi', 'Demi', 'Light' ]

export const getFace = (layerToBody) => {
  for (let layer in LAYERS_PRIORITY) if (layer in layerToBody) return layer
  return firstKey(layerToBody)
}