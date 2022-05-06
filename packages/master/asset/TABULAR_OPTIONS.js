import { AVERAGE }        from '@analys/enum-pivot-mode'
import { Scope }          from '@fontlab/enum-scope'
import { GROUPS_CHALENE } from '../../../resources/schemes/GROUPS_CHALENE'

export const TABULAR_OPTIONS = {
  scope: { x: Scope.Upper, y: Scope.Upper },
  spec: { x: 'group.v', y: 'group.r', mode: AVERAGE },
  groups: GROUPS_CHALENE,
}