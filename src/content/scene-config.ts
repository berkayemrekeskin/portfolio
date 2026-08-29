/**
 * Minimum whole-integer scale.
 *
 * The room's native 344x191 is smaller than a phone screen, so 1x would render
 * it postage-stamp sized. At 2x a portrait phone gets a 688px room and a short
 * horizontal pan; 1280x720 lands on 3x and 1920x1080 on 5x.
 */
export const MIN_SCALE = 2;
