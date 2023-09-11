import { Box } from '@mui/system';
import { ethers } from 'ethers';
import React from 'react';
import { Field } from 'react-final-form';

import { useStore } from '../../store';
import { Input } from '../../ui';
import { InputWrapper } from '../../ui/components/InputWrapper';
import { SelectField } from '../../ui/components/SelectField';
import {
  addressValidator,
  composeValidators,
} from '../../ui/utils/inputValidation';
import { textCenterEllipsis } from '../../ui/utils/text-center-ellipsis';
import { texts } from '../../ui/utils/texts';

const Text = ({
  address,
  isCrossed,
  alwaysGray,
}: {
  address?: string;
  isCrossed?: boolean;
  alwaysGray?: boolean;
}) => {
  const store = useStore();

  return (
    <Box
      sx={(theme) => ({
        typography: 'h3',
        display: 'inline-flex',
        fontWeight: 600,
        textDecoration: isCrossed ? 'line-through' : 'unset',
        mb: isCrossed ? 12 : 0,
        color: alwaysGray || isCrossed ? '$textDisabled' : '$text',
        [theme.breakpoints.up('sm')]: {
          mb: isCrossed ? 0 : 0,
        },
        [theme.breakpoints.up('md')]: {
          mb: isCrossed ? 12 : 0,
        },
      })}>
      {address === ethers.constants.AddressZero ||
      address === store.activeWallet?.accounts[0] ? (
        texts.representationsPage.myself
      ) : (
        <>
          {!!address
            ? texts.representationsPage.represented
            : texts.representationsPage.myself}
          {!!address && (
            <Box
              component="p"
              sx={(theme) => ({
                typography: 'h3',
                ml: 4,
                position: 'relative',
                [theme.breakpoints.up('lg')]: { top: 1 },
              })}>
              by {textCenterEllipsis(address, 5, 4)}
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

interface DelegateTableItemAddressProps {
  isEdit: boolean;
  isViewChanges: boolean;
  inputName: string;
  address?: string;
  addressTo?: string;
  withSelect?: boolean;
  selectAddresses?: string[];
}

export function RepresentationsTableItemField({
  isEdit,
  isViewChanges,
  inputName,
  address,
  addressTo,
  withSelect,
  selectAddresses,
}: DelegateTableItemAddressProps) {
  const isAddressToVisible = address !== addressTo;

  return (
    <>
      {!isEdit && !isViewChanges && <Text address={address} />}
      {isEdit && !isViewChanges && (
        <>
          {!!selectAddresses?.length && withSelect ? (
            <>
              <Field
                name={inputName}
                validate={composeValidators(addressValidator)}
                options={['', ...selectAddresses]}>
                {(props) => (
                  <InputWrapper
                    isError={props.meta.error && props.meta.touched}
                    error={props.meta.error}
                    css={{ zIndex: 5 }}>
                    <SelectField
                      withMyself
                      placeholder={texts.representationsPage.myself}
                      value={props.input.value}
                      onChange={(event) => {
                        props.input.onChange(event);
                      }}
                      options={props.options}
                    />
                  </InputWrapper>
                )}
              </Field>
            </>
          ) : (
            withSelect && <Text address={address} />
          )}
          {!withSelect && (
            <Field
              name={inputName}
              validate={composeValidators(addressValidator)}>
              {(props) => (
                <InputWrapper
                  onCrossClick={
                    props.input.value !== ''
                      ? () => {
                          props.input.onChange('');
                        }
                      : undefined
                  }
                  isError={props.meta.error && props.meta.touched}
                  error={props.meta.error}>
                  <Input
                    type="text"
                    placeholder={texts.representationsPage.myself}
                    sx={{
                      '&::placeholder': {
                        textAlign: 'center',
                        fontWeight: 600,
                      },
                    }}
                    {...props.input}
                  />
                </InputWrapper>
              )}
            </Field>
          )}
        </>
      )}
      {!isEdit && isViewChanges && (
        <Box
          sx={(theme) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            [theme.breakpoints.up('sm')]: {
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            },
            [theme.breakpoints.up('md')]: {
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'unset',
              width: 'auto',
            },
          })}>
          <Text address={address} isCrossed={isAddressToVisible} alwaysGray />
          {isAddressToVisible && <Text address={addressTo} />}
        </Box>
      )}
    </>
  );
}
