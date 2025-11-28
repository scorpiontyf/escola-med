'use client';
import React from 'react';
import { createButton } from "@gluestack-ui/core/button/creator";
import { Pressable, Text, View, ActivityIndicator } from 'react-native';
import {
  withStyleContext,
  useStyleContext,
  tva
} from '@gluestack-ui/utils/nativewind-utils';
import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils';
import { cssInterop } from 'nativewind';

const SCOPE = 'BUTTON';

const UIButton = createButton({
  Root: withStyleContext(Pressable, SCOPE),
  Text: Text,
  Group: View,
  Spinner: ActivityIndicator,
  Icon: View,
});

cssInterop(UIButton, { className: 'style' });
cssInterop(UIButton.Text, { className: 'style' });

const buttonStyle = tva({
  base: `
    group/button 
    flex-row items-center justify-center 
    gap-2
    data-[focus-visible=true]:web:outline-none 
    data-[focus-visible=true]:web:ring-2 
    data-[focus-visible=true]:web:ring-offset-2
    data-[disabled=true]:opacity-50
    data-[disabled=true]:cursor-not-allowed
    active:scale-[0.98]
    transition-all
  `,
  variants: {
    action: {
      primary: `
        bg-primary-500 
        data-[hover=true]:bg-primary-600 
        data-[active=true]:bg-primary-700 
        border-primary-500
        data-[focus-visible=true]:web:ring-primary-500/50
        shadow-sm shadow-primary-500/25
      `,
      secondary: `
        bg-background-100
        data-[hover=true]:bg-background-200 
        data-[active=true]:bg-background-300 
        border-background-300
        data-[focus-visible=true]:web:ring-background-400/50
      `,
      positive: `
        bg-success-500 
        data-[hover=true]:bg-success-600 
        data-[active=true]:bg-success-700 
        border-success-500
        data-[focus-visible=true]:web:ring-success-500/50
        shadow-sm shadow-success-500/25
      `,
      negative: `
        bg-error-500 
        data-[hover=true]:bg-error-600 
        data-[active=true]:bg-error-700 
        border-error-500
        data-[focus-visible=true]:web:ring-error-500/50
        shadow-sm shadow-error-500/25
      `,
      default: `
        bg-transparent 
        data-[hover=true]:bg-background-100 
        data-[active=true]:bg-background-200
        border-transparent
      `,
    },
    variant: {
      link: 'px-0 bg-transparent shadow-none',
      outline: `
        bg-transparent 
        border-2
        data-[hover=true]:bg-background-50 
        data-[active=true]:bg-background-100
        shadow-none
      `,
      solid: '',
      soft: `
        shadow-none
        border-0
      `,
    },
    size: {
      xs: 'px-3 h-8 rounded-md',
      sm: 'px-4 h-9 rounded-lg',
      md: 'px-5 h-11 rounded-xl',
      lg: 'px-6 h-12 rounded-xl',
      xl: 'px-8 h-14 rounded-2xl',
    },
  },
  compoundVariants: [
    {
      action: 'primary',
      variant: 'link',
      class: 'px-0 bg-transparent data-[hover=true]:bg-transparent data-[active=true]:bg-transparent shadow-none',
    },
    {
      action: 'secondary',
      variant: 'link',
      class: 'px-0 bg-transparent data-[hover=true]:bg-transparent data-[active=true]:bg-transparent shadow-none',
    },
    {
      action: 'positive',
      variant: 'link',
      class: 'px-0 bg-transparent data-[hover=true]:bg-transparent data-[active=true]:bg-transparent shadow-none',
    },
    {
      action: 'negative',
      variant: 'link',
      class: 'px-0 bg-transparent data-[hover=true]:bg-transparent data-[active=true]:bg-transparent shadow-none',
    },
    {
      action: 'primary',
      variant: 'outline',
      class: 'bg-transparent border-primary-500 data-[hover=true]:bg-primary-50 data-[active=true]:bg-primary-100',
    },
    {
      action: 'secondary',
      variant: 'outline',
      class: 'bg-transparent border-background-400 data-[hover=true]:bg-background-100 data-[active=true]:bg-background-200',
    },
    {
      action: 'positive',
      variant: 'outline',
      class: 'bg-transparent border-success-500 data-[hover=true]:bg-success-50 data-[active=true]:bg-success-100',
    },
    {
      action: 'negative',
      variant: 'outline',
      class: 'bg-transparent border-error-500 data-[hover=true]:bg-error-50 data-[active=true]:bg-error-100',
    },
    {
      action: 'primary',
      variant: 'soft',
      class: 'bg-primary-100 data-[hover=true]:bg-primary-200 data-[active=true]:bg-primary-300',
    },
    {
      action: 'secondary',
      variant: 'soft',
      class: 'bg-background-200 data-[hover=true]:bg-background-300 data-[active=true]:bg-background-400',
    },
    {
      action: 'positive',
      variant: 'soft',
      class: 'bg-success-100 data-[hover=true]:bg-success-200 data-[active=true]:bg-success-300',
    },
    {
      action: 'negative',
      variant: 'soft',
      class: 'bg-error-100 data-[hover=true]:bg-error-200 data-[active=true]:bg-error-300',
    },
  ],
});

const buttonTextStyle = tva({
  base: 'font-semibold web:select-none tracking-wide',
  parentVariants: {
    action: {
      primary: 'text-primary-600',
      secondary: 'text-typography-700',
      positive: 'text-success-600',
      negative: 'text-error-600',
      default: 'text-typography-900',
    },
    variant: {
      link: 'group-data-[hover=true]/button:underline group-data-[active=true]/button:underline',
      outline: '',
      solid: 'text-white',
      soft: '',
    },
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-sm',
      lg: 'text-base',
      xl: 'text-lg',
    },
  },
  compoundParentVariants: [
    {
      variant: 'solid',
      action: 'primary',
      class: 'text-white',
    },
    {
      variant: 'solid',
      action: 'secondary',
      class: 'text-typography-800',
    },
    {
      variant: 'solid',
      action: 'positive',
      class: 'text-white',
    },
    {
      variant: 'solid',
      action: 'negative',
      class: 'text-white',
    },
    {
      variant: 'outline',
      action: 'primary',
      class: 'text-primary-600',
    },
    {
      variant: 'outline',
      action: 'secondary',
      class: 'text-typography-700',
    },
    {
      variant: 'outline',
      action: 'positive',
      class: 'text-success-600',
    },
    {
      variant: 'outline',
      action: 'negative',
      class: 'text-error-600',
    },
    {
      variant: 'soft',
      action: 'primary',
      class: 'text-primary-700',
    },
    {
      variant: 'soft',
      action: 'secondary',
      class: 'text-typography-800',
    },
    {
      variant: 'soft',
      action: 'positive',
      class: 'text-success-700',
    },
    {
      variant: 'soft',
      action: 'negative',
      class: 'text-error-700',
    },
  ],
});

const buttonGroupStyle = tva({
  base: 'flex-row',
  variants: {
    space: {
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-3',
      lg: 'gap-4',
      xl: 'gap-5',
    },
    attached: {
      true: 'gap-0',
    },
  },
});

type IButtonProps = React.ComponentProps<typeof UIButton> &
  VariantProps<typeof buttonStyle>;

const Button = React.forwardRef<
  React.ComponentRef<typeof UIButton>,
  IButtonProps
>(function Button(
  { className, variant = 'solid', size = 'md', action = 'primary', ...props },
  ref
) {
  return (
    <UIButton
      ref={ref}
      {...props}
      className={buttonStyle({ variant, size, action, class: className })}
      context={{ variant, size, action }}
    />
  );
});

type IButtonTextProps = React.ComponentProps<typeof UIButton.Text> &
  VariantProps<typeof buttonTextStyle>;

const ButtonText = React.forwardRef<
  React.ComponentRef<typeof UIButton.Text>,
  IButtonTextProps
>(function ButtonText({ className, ...props }, ref) {
  const { variant: parentVariant, size: parentSize, action: parentAction } =
    useStyleContext(SCOPE);
  return (
    <UIButton.Text
      ref={ref}
      {...props}
      className={buttonTextStyle({
        parentVariants: {
          variant: parentVariant,
          size: parentSize,
          action: parentAction,
        },
        class: className,
      })}
    />
  );
});

type IButtonGroupProps = React.ComponentProps<typeof UIButton.Group> &
  VariantProps<typeof buttonGroupStyle>;

const ButtonGroup = React.forwardRef<
  React.ComponentRef<typeof UIButton.Group>,
  IButtonGroupProps
>(function ButtonGroup({ className, space = 'md', attached = false, ...props }, ref) {
  return (
    <UIButton.Group
      ref={ref}
      {...props}
      className={buttonGroupStyle({ space, attached, class: className })}
    />
  );
});

const ButtonSpinner = UIButton.Spinner;
const ButtonIcon = UIButton.Icon;

Button.displayName = 'Button';
ButtonText.displayName = 'ButtonText';
ButtonGroup.displayName = 'ButtonGroup';

export { Button, ButtonText, ButtonSpinner, ButtonIcon, ButtonGroup };