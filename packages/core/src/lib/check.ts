
import { TypeElementAttrs } from '@idraw/types';
import is from './is';


function attrs(
  attrs: TypeElementAttrs
): boolean {
  const { x, y, w, h, angle } = attrs;
  if (!(is.x(x) && is.y(y) && is.w(w) && is.h(h) && is.angle(angle))) {
    return false;
  }
  if (!(angle >= -360 && angle <= 360 )) {
    return false;
  }
  return true;
}

function rectDesc(
  desc: any
): boolean {
  const { borderColor, borderRadius, borderWidth, color } = desc;
  if (typeof borderColor === 'string' && !is.color(color)) {
    return false;
  }
  if (typeof borderColor === 'string' && !is.color(borderColor)) {
    return false;
  }
  if (typeof borderRadius === 'number' && !is.number(borderRadius)) {
    return false;
  }
  if (typeof borderWidth === 'number' && !is.number(borderWidth)) {
    return false;
  }
  return true;
}

const check = {
  attrs,
  rectDesc,
}
 

export default check;