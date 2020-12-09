import {HtmlHTMLAttributes} from 'react';
// @ts-ignore
import intlMessages from '../intl/*.json';
import {mergeProps} from '@react-aria/utils';
import {StepListItemAria, StepListItemProps, StepListState} from '@react-types/steplist';
import {useMessageFormatter} from '@react-aria/i18n';
import {usePress} from '@react-aria/interactions';

export function useStepListItem<T>(props: StepListItemProps<T> & { isFocused: boolean }, state: StepListState<T>): StepListItemAria {
  const {isDisabled, isFocused, item} = props;
  const {key} = item;
  const isCurrent = state.selectedKey === key;
  const isComplete = state.isCompleted(key);
  const isNavigable = state.isNavigable(key);

  const {pressProps} = usePress({onPressChange: () => {
    if (isNavigable) {
      state.setSelectedKey(key);
    }
  }});
  
  const linkProps: HtmlHTMLAttributes<HTMLElement> = {
    role: 'link'
  };
  let stepStateText = '';
  const formatMessage = useMessageFormatter(intlMessages);
  if (isCurrent) {
    linkProps['aria-current'] = 'step';
    stepStateText = formatMessage('current');
  } else if (isComplete) {
    stepStateText = formatMessage('completed');
  } else {
    stepStateText = formatMessage('notCompleted');
  }
  if (isNavigable) {
    linkProps.tabIndex = 0;
  }
  if (isDisabled) {
    linkProps['aria-disabled'] = 'true';
  }
  if (isFocused) {
    linkProps['aria-live'] = 'assertive';
    linkProps['aria-atomic'] = 'true';
    linkProps['aria-relevant'] = 'text';
  }

  return {
    linkProps: mergeProps(pressProps, linkProps),
    stepStateText,
    stepStateProps: {}
  };

}
