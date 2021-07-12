import { CSSProperties } from 'react';
import { Point2D } from '../../libs/ShiftedGrid';

export interface ItemStyleEffect {
  getStyle: (itemPosition: Point2D, effectPosition: Point2D) => CSSProperties;
}
