import { createElement, HTMLAttributes } from 'react';

/**
 * Typographie de l'app. Rend un élément DOM sémantique (span/p/label par défaut
 * span) en appliquant la police SF selon la graisse. Remplace l'ancien
 * CustomText (qui rendait toujours un <span> opaque).
 */

type Weight = 'light' | 'semibold' | 'bold';

const weightClass: Record<Weight, string> = {
  light: 'font-sfLight',
  semibold: 'font-sfSemibold',
  bold: 'font-sfBold'
};

type TextElement = 'span' | 'p' | 'label' | 'div';

type TextProps = HTMLAttributes<HTMLElement> & {
  as?: TextElement;
  weight?: Weight;
};

export const Text = ({ as = 'span', weight = 'light', className, ...props }: TextProps) =>
  createElement(as, {
    className: `${weightClass[weight]} ${className ?? ''}`.trim(),
    ...props
  });

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  level?: 1 | 2 | 3;
  weight?: Weight;
};

export const Heading = ({ level = 1, weight = 'light', className, ...props }: HeadingProps) =>
  createElement(`h${level}`, {
    className: `${weightClass[weight]} ${className ?? ''}`.trim(),
    ...props
  });
