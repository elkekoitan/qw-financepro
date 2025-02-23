import { SvgIconProps } from '@mui/material';
import { ReactElement } from 'react';

export interface Feature {
  icon: ReactElement<SvgIconProps>;
  title: string;
  description: string;
}

export interface HeroProps {
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
}

export interface CTAProps {
  title: string;
  subtitle: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonLink: string;
} 