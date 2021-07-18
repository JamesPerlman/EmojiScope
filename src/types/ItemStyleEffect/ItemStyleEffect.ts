import { CSSProperties } from 'react';
import { Point2D } from '../../libs/ShiftedGrid';

export interface ItemStyleEffect {
  getStyle: (itemPosition: Point2D, mousePosition: Point2D, centerPosition: Point2D) => CSSProperties;
}
