import { Box, useTheme } from '@mui/system';
import React, { useEffect, useRef, useState } from 'react';

import SettingsIcon from '/public/images/icons/settings.svg';
import Logo from '/public/images/logo.svg';

import { useStore } from '../../store';
import { WalletWidget } from '../../web3/components/wallet/WalletWidget';
import { BoxWith3D } from '../components/BoxWith3D';
import { Link } from '../components/Link';
import { ThemeSwitcher } from '../components/ThemeSwitcher';
import { Container } from '../primitives/Container';
import { Divider } from '../primitives/Divider';
import { IconBox } from '../primitives/IconBox';
import NoSSR from '../primitives/NoSSR';
import { ROUTES } from '../utils/routes';
import { texts } from '../utils/texts';
import { media } from '../utils/themeMUI';
import { useClickOutside } from '../utils/useClickOutside';
import { useMediaQuery } from '../utils/useMediaQuery';
import { useScrollDirection } from '../utils/useScrollDirection';
import { appModes, SettingsButton } from './SettingsButton';

const headerNavItems = [
  {
    link: 'https://snapshot.org/#/aave.eth',
    title: texts.header.navSnapshots,
  },
  {
    link: 'https://governance.aave.com/',
    title: texts.header.navForum,
  },
  {
    link: 'https://docs.aave.com/faq/governance',
    title: texts.header.navTutorial,
  },
];

export function AppHeader() {
  const theme = useTheme();
  const sm = useMediaQuery(media.sm);
  const wrapperRef = useRef(null);
  const {
    isRendered,
    setIsHelpModalOpen,
    isHelpModalClosed,
    setActivePage,
    activeWallet,
    checkAppMode,
    appMode,
    isModalOpen,
    setAppMode,
  } = useStore();

  const { scrollDirection } = useScrollDirection();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleOpenMobileMenu = () => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
    setMobileMenuOpen(true);
  };

  const handleCloseMobileMenu = () => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'unset';
    }
    setMobileMenuOpen(false);
  };

  useClickOutside({
    ref: wrapperRef,
    outsideClickFunc: () => setTimeout(() => handleCloseMobileMenu(), 10),
    additionalCondition: mobileMenuOpen,
  });

  useEffect(() => {
    checkAppMode();
  }, [activeWallet?.isActive]);

  useEffect(() => {
    if (sm) {
      handleCloseMobileMenu();
    }
  }, [sm]);

  if (appMode === 'default') {
    if (headerNavItems.some((item) => item.title === 'Create')) {
      headerNavItems.shift();
    }
  } else {
    if (!headerNavItems.some((item) => item.title === 'Create')) {
      headerNavItems.unshift({
        link: '/create',
        title: texts.header.navCreate,
      });
    }
  }

  return (
    <>
      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: scrollDirection === 'down' ? (isModalOpen ? 0 : -82) : 0,
          py: mobileMenuOpen ? 0 : 12,
          zIndex: 102,
          mb: 12,
          backgroundColor: isRendered
            ? `${theme.palette.$appBackground} !important`
            : theme.palette.$appBackground,
          transition: mobileMenuOpen ? 'all 0.2s ease' : 'all 0.5s ease',
          [theme.breakpoints.up('sm')]: {
            position: 'relative',
            backgroundColor: 'transparent !important',
            pb: 0,
            top: 0,
            zIndex: 99,
          },
        }}>
        <Container
          sx={{
            px: mobileMenuOpen ? 0 : 12,
            transition: 'padding 0.2s ease',
            overflow: 'hidden',
            [theme.breakpoints.up('sm')]: {
              px: 20,
              overflow: 'unset',
            },
          }}>
          <BoxWith3D
            className="Header_content"
            borderSize={10}
            leftBorderColor="$secondary"
            bottomBorderColor="$headerGray"
            onHeader={!sm}
            disabled={mobileMenuOpen}
            wrapperCss={{
              backgroundColor: mobileMenuOpen
                ? isRendered
                  ? `${theme.palette.$mainStable} !important`
                  : theme.palette.$mainStable
                : isRendered
                ? `${theme.palette.$appBackground} !important`
                : theme.palette.$appBackground,
              '> div': {
                left: mobileMenuOpen ? 3 : 0,
                bottom: mobileMenuOpen ? 3 : 0,
              },
            }}
            css={{
              p: '6px 0 6px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: 52,
              [theme.breakpoints.up('lg')]: {
                p: '8px 12px 8px 22px',
                height: 66,
              },
            }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Link
                href={ROUTES.main}
                onClick={() => setActivePage(0)}
                css={{
                  lineHeight: 0,
                  transform: 'translate(0)',
                  hover: { opacity: 0.7 },
                  [theme.breakpoints.up('sm')]: {
                    mr: 15,
                  },
                  [theme.breakpoints.up('lg')]: {
                    mr: 20,
                  },
                }}>
                <IconBox
                  sx={{
                    width: 61,
                    height: 28,
                    '> svg': {
                      width: 61,
                      height: 28,
                      [theme.breakpoints.up('lg')]: {
                        width: 66,
                        height: 32,
                      },
                    },
                    [theme.breakpoints.up('lg')]: {
                      width: 66,
                      height: 32,
                    },
                  }}>
                  <Logo />
                </IconBox>
              </Link>

              <Box
                sx={{
                  display: 'none',
                  [theme.breakpoints.up('sm')]: {
                    display: 'flex',
                    alignItems: 'center',
                  },
                }}>
                {headerNavItems.map((item) => (
                  <React.Fragment key={item.title}>
                    {item.title === texts.header.navTutorial ? (
                      <Box
                        component="button"
                        onClick={() => setIsHelpModalOpen(true)}
                        sx={{
                          color: '$textLight',
                          mr: 15,
                          transition: 'all 0.2s ease',
                          position: 'relative',
                          fontWeight: '300',
                          fontSize: 13,
                          lineHeight: '15px',
                          [theme.breakpoints.up('lg')]: {
                            mr: 25,
                            fontSize: 15,
                            lineHeight: '18px',
                          },
                          hover: {
                            opacity: '0.7',
                          },
                        }}>
                        <Box
                          component="p"
                          className="Header__navItem"
                          sx={{
                            typography: 'body',
                            color: isRendered
                              ? `${theme.palette.$textLight} !important`
                              : theme.palette.$textLight,
                          }}>
                          {item.title}
                        </Box>

                        {isHelpModalClosed && (
                          <Box
                            sx={{
                              '@keyframes helpModalClose': {
                                '0%': {
                                  opacity: 0,
                                  transform: 'scale(0.8)',
                                },
                                '100%': {
                                  opacity: 1,
                                  transform: 'scale(1.1)',
                                },
                              },
                              width: 8,
                              height: 8,
                              opacity: 0,
                              zIndex: 100,
                              position: 'absolute',
                              top: -2,
                              right: -3,
                              transform: 'scale(0.8)',
                              borderRadius: '50%',
                              backgroundColor: '$error',
                              '@media (hover: hover) and (pointer: fine)': {
                                animation: `helpModalClose 0.3s`,
                              },
                            }}
                          />
                        )}
                      </Box>
                    ) : (
                      <Box
                        component={Link}
                        href={item.link}
                        inNewWindow
                        sx={{
                          color: '$textLight',
                          mr: 15,
                          transition: 'all 0.2s ease',
                          position: 'relative',
                          fontWeight: '300',
                          fontSize: 13,
                          lineHeight: '15px',
                          [theme.breakpoints.up('lg')]: {
                            mr: 25,
                            fontSize: 15,
                            lineHeight: '18px',
                          },
                          hover: {
                            opacity: '0.7',
                          },
                        }}>
                        <Box
                          component="p"
                          className="Header__navItem"
                          sx={{
                            typography: 'body',
                            color: isRendered
                              ? `${theme.palette.$textLight} !important`
                              : theme.palette.$textLight,
                          }}>
                          {item.title}
                        </Box>
                      </Box>
                    )}
                  </React.Fragment>
                ))}
              </Box>
            </Box>

            <NoSSR>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <WalletWidget />
                <SettingsButton />

                <Box
                  component="button"
                  type="button"
                  onClick={() => {
                    if (mobileMenuOpen) {
                      handleCloseMobileMenu();
                    } else {
                      handleOpenMobileMenu();
                    }
                  }}
                  sx={{
                    p: 10,
                    display: 'inline-block',
                    transitionProperty: 'opacity, filter',
                    transitionDuration: '0.15s',
                    transitionTimingFunction: 'linear',
                    overflow: 'visible',
                    position: 'relative',
                    zIndex: 21,
                    [theme.breakpoints.up('sm')]: {
                      display: 'none',
                    },
                    hover: {
                      opacity: 0.7,
                    },
                    '.hamburger-box': {
                      width: 17,
                      height: 16,
                      display: 'inline-block',
                      position: 'relative',
                    },
                    '.hamburger-inner, .hamburger-inner:before, .hamburger-inner:after':
                      {
                        width: 17,
                        height: 2,
                        backgroundColor: '$textWhite',
                        position: 'absolute',
                        transitionProperty: 'transform',
                        transitionDuration: '0.15s',
                        transitionTimingFunction: 'ease',
                      },
                    '.hamburger-inner': {
                      display: 'block',
                      mt: -2,
                      top: 2,
                      transition: 'background-color 0s 0.13s linear',
                      transitionDelay: mobileMenuOpen ? '0.22s' : '0.13s',
                      backgroundColor: mobileMenuOpen
                        ? 'transparent !important'
                        : '$textWhite',
                      '&:before, &:after': {
                        content: `''`,
                        display: 'block',
                      },
                      '&:before': {
                        top: mobileMenuOpen ? 0 : 8,
                        transition: mobileMenuOpen
                          ? 'top 0.1s 0.15s cubic-bezier(0.33333, 0, 0.66667, 0.33333), transform 0.13s 0.22s cubic-bezier(0.215, 0.61, 0.355, 1)'
                          : 'top 0.1s 0.2s cubic-bezier(0.33333, 0.66667, 0.66667, 1), transform 0.13s cubic-bezier(0.55, 0.055, 0.675, 0.19)',
                        transform: mobileMenuOpen
                          ? 'translate3d(0, 8px, 0) rotate(45deg)'
                          : 'unset',
                      },
                      '&:after': {
                        top: mobileMenuOpen ? 0 : 16,
                        transition: mobileMenuOpen
                          ? 'top 0.2s cubic-bezier(0.33333, 0, 0.66667, 0.33333), transform 0.13s 0.22s cubic-bezier(0.215, 0.61, 0.355, 1)'
                          : 'top 0.2s 0.2s cubic-bezier(0.33333, 0.66667, 0.66667, 1), transform 0.13s cubic-bezier(0.55, 0.055, 0.675, 0.19)',
                        transform: mobileMenuOpen
                          ? 'translate3d(0, 8px, 0) rotate(-45deg)'
                          : 'unset',
                      },
                    },
                  }}>
                  <span className="hamburger-box">
                    <span className="hamburger-inner" />
                  </span>
                </Box>
              </Box>
            </NoSSR>
          </BoxWith3D>
        </Container>
      </Box>

      <NoSSR>
        <Box
          ref={wrapperRef}
          sx={{
            display: 'block',
            transition: 'transform 0.4s ease',
            position: 'fixed',
            top: 0,
            right: 0,
            zIndex: 101,
            transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(150px)',
            width: mobileMenuOpen ? 150 : 0,
            height: '100%',
            overflowY: 'auto',
            [theme.breakpoints.up('sm')]: { display: 'none' },
          }}>
          <Box
            sx={{
              height: '100%',
              '> div, .BoxWith3D__content': {
                height: '100%',
                '@media only screen and (max-height: 370px)': {
                  height: 'unset',
                },
              },
            }}>
            <Box
              sx={{
                backgroundColor: '$mainStable',
                p: '85px 15px 15px',
                height: '100%',
              }}>
              {headerNavItems.map((item) => (
                <React.Fragment key={item.title}>
                  {item.title === texts.header.navTutorial ? (
                    <Box
                      component="button"
                      type="button"
                      onClick={() => {
                        setIsHelpModalOpen(true);
                        handleCloseMobileMenu();
                      }}
                      sx={{
                        color: '$textLight',
                        mb: 15,
                        display: 'block',
                      }}>
                      <Box
                        component="p"
                        sx={{ typography: 'body', color: '$textLight' }}>
                        {item.title}
                      </Box>
                    </Box>
                  ) : (
                    <Link
                      href={item.link}
                      onClick={() => handleCloseMobileMenu()}
                      inNewWindow={item.title !== 'Create'}
                      css={{
                        color: '$textLight',
                        mb: 15,
                        display: 'block',
                      }}>
                      <Box
                        component="p"
                        sx={{ typography: 'body', color: '$textLight' }}>
                        {item.title}
                      </Box>
                    </Link>
                  )}
                </React.Fragment>
              ))}
              {!activeWallet?.isContractAddress && (
                <Box
                  sx={{
                    my: 30,
                    color: '$textLight',
                    whiteSpace: 'nowrap',
                  }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      whiteSpace: 'nowrap',
                    }}>
                    <IconBox
                      sx={{
                        width: 14,
                        height: 14,
                        '> svg': {
                          width: 14,
                          height: 14,
                        },
                        mr: 5,
                        path: {
                          fill: theme.palette.$textLight,
                        },
                      }}>
                      <SettingsIcon />
                    </IconBox>
                    <Box component="p" sx={{ typography: 'headline' }}>
                      {texts.header.appMode}
                    </Box>
                  </Box>
                  <Divider sx={{ my: 15 }} />
                  {appModes.map((mode) => {
                    return (
                      <Box
                        key={mode.mode}
                        sx={{ mb: 15, '&:last-of-type': { mb: 0 } }}>
                        <Box
                          component="button"
                          type="button"
                          disabled={appMode === mode.mode}
                          onClick={() => {
                            setAppMode(mode.mode);
                            handleCloseMobileMenu();
                          }}
                          sx={{
                            color: '$textLight',
                            hover: {
                              opacity: '0.7',
                            },
                            '&:disabled': {
                              opacity: 1,
                              cursor: 'default',
                              color: '$textDisabled',
                              fontWeight: 600,
                            },
                          }}>
                          <Box component="p" sx={{ typography: 'body' }}>
                            {mode.title}
                          </Box>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              )}
              <Box
                sx={{
                  color: '$textLight',
                  whiteSpace: 'nowrap',
                }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    whiteSpace: 'nowrap',
                  }}>
                  <Box component="p" sx={{ typography: 'headline' }}>
                    {texts.header.theme}
                  </Box>
                </Box>
                <Divider sx={{ my: 15 }} />
                <ThemeSwitcher />
              </Box>
            </Box>
          </Box>
        </Box>

        {mobileMenuOpen && (
          <Box
            sx={{
              position: 'fixed',
              backgroundColor: '$backgroundOverlap',
              inset: 0,
              zIndex: 100,
            }}
            aria-hidden="true"
          />
        )}
      </NoSSR>
    </>
  );
}
