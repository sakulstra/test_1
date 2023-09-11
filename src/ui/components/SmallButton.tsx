import { Box, SxProps, useTheme } from '@mui/system';
import React, { MouseEventHandler, ReactNode } from 'react';

import { Spinner } from './Spinner';

export interface SmallButtonProps {
  type?: 'button' | 'submit';
  children: string | ReactNode;
  disabled?: boolean;
  loading?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  css?: SxProps;
}

export function SmallButton({
  type,
  children,
  disabled,
  loading,
  onClick,
  css,
}: SmallButtonProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `1px solid ${theme.palette.$main}`,
        minWidth: 95,
        height: 20,
        transition: 'all 0.2s ease',
        backgroundColor: '$mainLight',
        color: '$text',
        px: 5,
        [theme.breakpoints.up('lg')]: {
          minWidth: 102,
          height: 22,
        },
        hover: {
          borderColor: theme.palette.$light,
          backgroundColor: theme.palette.$light,
        },
        '&:active': {
          backgroundColor: '$disabled',
          borderColor: '$disabled',
        },
        '&:disabled': {
          cursor: 'not-allowed',
          backgroundColor: '$disabled',
          borderColor: '$disabled',
        },
        ...css,
      }}
      component="button"
      type={type}
      disabled={disabled || loading}
      onClick={onClick}>
      <Box
        sx={{
          fontWeight: '400',
          letterSpacing: '0.03em',
          fontSize: 11,
          lineHeight: '13px',
        }}>
        {children}
      </Box>
      {loading && (
        <Box
          sx={{
            backgroundColor: '$disabled',
            ml: 5,
            position: 'relative',
            top: 0.5,
          }}>
          <Spinner
            size={16}
            loaderLineColor="$paper"
            loaderCss={{
              backgroundImage: theme.palette.gradients.aaveGradient,
            }}
            lineSize={3}
          />
        </Box>
      )}
    </Box>
  );
}
