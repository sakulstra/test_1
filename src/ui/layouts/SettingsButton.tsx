import { Menu } from '@headlessui/react';
import { Box, useTheme } from '@mui/system';
import React from 'react';

import SettingsIcon from '/public/images/icons/settings.svg';
import SettingsBordersIcon from '/public/images/icons/settingsBorders.svg';

import { useStore } from '../../store';
import { BoxWith3D, Divider, ThemeSwitcher } from '../';
import { IconBox } from '../primitives/IconBox';
import { AppModeType } from '../store/uiSlice';
import { texts } from '../utils/texts';

export const appModes: { mode: AppModeType; title: string }[] = [
  {
    mode: 'default',
    title: texts.header.appModeDefault,
  },
  {
    mode: 'dev',
    title: texts.header.appModeDev,
  },
  {
    mode: 'expert',
    title: texts.header.appModeExpert,
  },
];

export function SettingsButton() {
  const theme = useTheme();
  const { setAppMode, appMode, activeWallet } = useStore();

  return (
    <>
      <Menu
        as={Box}
        sx={{
          display: 'none',
          [theme.breakpoints.up('sm')]: { display: 'block' },
        }}>
        {({ open }) => (
          <>
            <Menu.Button
              as={Box}
              sx={{
                cursor: 'pointer',
                lineHeight: '0.5',
                position: 'relative',
                px: 10,
                [theme.breakpoints.up('lg')]: {
                  ml: 10,
                },
                hover: {
                  '> div': {
                    '&:first-of-type': {
                      opacity: 0,
                    },
                    '&:last-of-type': {
                      opacity: 1,
                    },
                  },
                },
              }}>
              <IconBox
                sx={{
                  width: 16,
                  height: 16,

                  opacity: open ? 0 : 1,
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  transition: 'all 0.2s ease',
                  path: {
                    stroke: theme.palette.$textLight,
                  },
                  '> svg': {
                    width: 16,
                    height: 16,
                    [theme.breakpoints.up('lg')]: {
                      width: 21,
                      height: 21,
                    },
                  },
                  [theme.breakpoints.up('lg')]: {
                    width: 21,
                    height: 21,
                  },
                }}>
                <SettingsBordersIcon />
              </IconBox>
              <IconBox
                sx={{
                  width: 16,
                  height: 16,
                  opacity: open ? 1 : 0,
                  transition: 'all 0.2s ease',
                  path: {
                    fill: theme.palette.$textLight,
                  },
                  '> svg': {
                    width: 16,
                    height: 16,
                    [theme.breakpoints.up('lg')]: {
                      width: 21,
                      height: 21,
                    },
                  },
                  [theme.breakpoints.up('lg')]: {
                    width: 21,
                    height: 21,
                  },
                }}>
                <SettingsIcon />
              </IconBox>
            </Menu.Button>

            <Menu.Items
              as={Box}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                position: 'absolute',
                right: 0,
                top: '100%',
              }}>
              <BoxWith3D
                borderSize={10}
                leftBorderColor="$secondary"
                bottomBorderColor="$headerGray"
                css={{ width: 150, p: 10, color: '$textWhite' }}>
                {!activeWallet?.isContractAddress && (
                  <Box sx={{ mb: 30 }}>
                    <Box
                      component="p"
                      sx={{ typography: 'headline', color: '$textLight' }}>
                      {texts.header.appMode}
                    </Box>
                    <Divider sx={{ my: 10 }} />
                    {appModes.map((mode) => {
                      return (
                        <Menu.Item
                          as={Box}
                          key={mode.mode}
                          sx={{ mb: 10, '&:last-of-type': { mb: 0 } }}>
                          <Box
                            component="button"
                            type="button"
                            disabled={appMode === mode.mode}
                            onClick={() => setAppMode(mode.mode)}
                            sx={{
                              color: '$textDisabled',
                              hover: {
                                color: theme.palette.$textWhite,
                              },
                              '&:disabled': {
                                opacity: 1,
                                cursor: 'default',
                                color: '$textDisabled',
                                '> p': {
                                  fontWeight: 600,
                                },
                              },
                            }}>
                            <Box
                              component="p"
                              sx={{ typography: 'buttonSmall' }}>
                              {mode.title}
                            </Box>
                          </Box>
                        </Menu.Item>
                      );
                    })}
                  </Box>
                )}

                <Box
                  component="p"
                  sx={{ typography: 'headline', color: '$textLight' }}>
                  {texts.header.theme}
                </Box>
                <Divider sx={{ my: 10 }} />
                <ThemeSwitcher />
              </BoxWith3D>
            </Menu.Items>
          </>
        )}
      </Menu>
    </>
  );
}
