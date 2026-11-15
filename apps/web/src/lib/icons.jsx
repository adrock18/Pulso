/**
 * Icon mapping utility — resolves string icon keys from CATEGORIES/GENDERS
 * to Lucide React icon components.
 */
import {
  User,
  Sparkles,
  Package,
  Scissors,
  Wrench,
  Shield,
  CircleDot,
  Wind,
  Flame,
  Box,
  Zap,
  Grip,
} from 'lucide-react';

const ICON_MAP = {
  User,
  Sparkles,
  Package,
  Scissors,
  Wrench,
  Shield,
  CircleDot,
  Wind,
  Flame,
  Box,
  Zap,
  Grip,
};

/**
 * Renders a Lucide icon by its string key.
 * Falls back to Package if the key isn't recognized.
 *
 * @param {{ name: string, className?: string, size?: number }} props
 */
export function CategoryIcon({ name, className = '', size = 18, ...rest }) {
  const Icon = ICON_MAP[name] || Package;
  return <Icon className={className} size={size} {...rest} />;
}

export default CategoryIcon;
