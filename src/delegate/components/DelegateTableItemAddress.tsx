import { Box } from '@mui/system';
import React from 'react';
import { Field } from 'react-final-form';

import { Input } from '../../ui';
import { InputWrapper } from '../../ui/components/InputWrapper';
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
      {!!address
        ? texts.delegatePage.tableItemDelegated
        : texts.delegatePage.tableItemNotDelegated}
      {!!address && (
        <Box
          component="p"
          sx={(theme) => ({
            typography: 'h3',
            ml: 4,
            position: 'relative',
            [theme.breakpoints.up('lg')]: { top: 1 },
          })}>
          to {textCenterEllipsis(address, 5, 4)}
        </Box>
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
}

export function DelegateTableItemAddress({
  isEdit,
  isViewChanges,
  inputName,
  address,
  addressTo,
}: DelegateTableItemAddressProps) {
  const isAddressToVisible = address !== addressTo;
  return (
    <>
      {!isEdit && !isViewChanges && <Text address={address} />}
      {isEdit && !isViewChanges && (
        <Field name={inputName} validate={composeValidators(addressValidator)}>
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
                placeholder={texts.delegatePage.tableItemNotDelegated}
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
