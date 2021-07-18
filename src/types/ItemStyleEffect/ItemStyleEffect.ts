import { CSSProperties } from 'react';
import { Point2D } from '../../libs/ShiftedGrid';


export type ItemStyleEffectGetStyleParams = {
  itemPosition: Point2D,
  mousePosition?: Point2D,
  centerPosition?: Point2D,
};

export interface ItemStyleEffect {
  getStyle: (params: ItemStyleEffectGetStyleParams) => CSSProperties;
}
