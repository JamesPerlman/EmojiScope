import { useContext } from 'react';
import { MousePositionContext } from '../contexts';

export const useMousePositionContext = () => useContext(MousePositionContext);
