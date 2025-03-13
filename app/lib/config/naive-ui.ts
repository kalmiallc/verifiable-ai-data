import type { GlobalThemeOverrides, MessageProviderProps } from 'naive-ui';
import { colors } from '~/tailwind.config';

type MessageThemeOverrides = NonNullable<MessageProviderProps['themeOverrides']>;
const messageOverrides: MessageThemeOverrides = {};

/**
 * Theme configs
 */
export const themeOverrides: GlobalThemeOverrides = {
  common: {
    bodyColor: colors.grey.DEFAULT,
    primaryColor: colors.primary.DEFAULT,
    primaryColorHover: colors.primary.light,
    primaryColorPressed: colors.primary.light,
    borderColor: colors.bg.DEFAULT,
    borderRadius: '8px',
    textColorBase: colors.white,
  },
  DataTable: {
    tdColor: colors.grey.DEFAULT,
    thColor: colors.grey.dark,
    borderColor: colors.transparent,
    borderRadius: '8px',
    tdColorHover: colors.grey.light,
  },
  DatePicker: {
    iconColor: colors.grey.dark,
    peers: {
      Button: {
        colorPrimary: colors.grey.lighter,
        colorFocusPrimary: colors.grey.lightest,
        colorHoverPrimary: colors.grey.lightest,
        colorPressedPrimary: colors.grey.lightest,
        // colorDisabledPrimary: colors.grey.darker,
      },
    },
  },
  Dropdown: {
    color: colors.bg.DEFAULT,
    colorActive: colors.bg.DEFAULT,
    colorActiveError: colors.bg.DEFAULT,
    colorActiveWarning: colors.bg.DEFAULT,
    colorDisabled: colors.primary.dark,
  },
  Input: {
    border: `1px solid ${colors.grey.light}`,
    borderDisabled: `1px solid ${colors.primary.dark}`,
    borderFocus: `1px solid ${colors.primary.DEFAULT}`,
    borderError: `1px solid ${colors.yellow}`,
    borderFocusError: `1px solid ${colors.grey.DEFAULT}`,
    borderFocusWarning: `1px solid ${colors.bg.DEFAULT}`,
    borderHover: `1px solid ${colors.grey.light}`,
    borderHoverError: `1px solid ${colors.grey.DEFAULT}`,
    borderHoverWarning: `1px solid ${colors.grey.light}`,
    borderWarning: `1px solid ${colors.grey.light}`,
    caretColor: colors.white,
    clearColor: colors.grey.DEFAULT,
    clearColorHover: colors.white,
    clearColorPressed: colors.white,
    color: colors.grey.dark,
    colorFocus: colors.grey.dark,
    colorFocusError: colors.grey.dark,
    colorFocusWarning: colors.grey.dark,
    colorDisabled: colors.grey.dark,
    heightTiny: '30px',
    heightSmall: '34px',
    heightMedium: '40px',
    heightLarge: '48px',
    iconColor: colors.black,
    iconColorHover: colors.black,
    loadingColor: colors.white,
    placeholderColor: colors.grey.lightest,
    suffixTextColor: colors.white,
    textColor: colors.white,
    textColorDisabled: colors.grey.lighter,
  },
  InputNumber: {
    common: {},
  },
  Layout: {
    textColor: colors.white,
    color: colors.bg.box,
    siderColor: colors.bg.box,
  },
  Menu: {
    arrowColorActiveInverted: colors.purple.dark,
    arrowColorChildActiveInverted: colors.purple.dark,
    arrowColorChildActiveHoverInverted: colors.purple.dark,
    arrowColorChildInverted: colors.purple.dark,
    arrowColorChildHoverInverted: colors.purple.dark,
    arrowColorInverted: colors.purple.dark,
    arrowColorHoverInverted: colors.purple.dark,
    fontSize: '14px',
    groupTextColorInverted: colors.white,
    itemColorActiveInverted: colors.bg.light,
    itemColorActiveHoverInverted: colors.bg.light,
    itemTextColorInverted: colors.white,
    itemTextColorActiveInverted: colors.white,
    itemTextColorActiveHoverInverted: colors.white,
    itemTextColorHoverInverted: colors.white,
  },
  Pagination: {
    buttonColor: colors.grey.light,
    buttonColorHover: colors.grey.lighter,
    buttonColorPressed: colors.grey.lighter,
    buttonIconColor: colors.grey.DEFAULT,
    itemTextColor: colors.white,
    itemTextColorActive: colors.white,
    itemTextColorHover: colors.white,
    itemTextColorPressed: colors.white,
    itemTextColorDisabled: colors.grey.light,
  },
  Radio: {
    buttonHeightSmall: '26px',
    buttonHeightMedium: '34px',
    buttonHeightLarge: '38px',
    buttonBorderRadius: '15px',
    buttonBoxShadow: '0px 0px 0px 0px transparent',
    buttonBoxShadowFocus: '0px 0px 0px 0px transparent',
    buttonBoxShadowHover: '0px 0px 0px 0px transparent',
    buttonColor: colors.grey.DEFAULT,
    buttonColorActive: colors.green.DEFAULT,
    buttonBorderColor: colors.transparent,
    buttonBorderColorActive: colors.transparent,
    buttonBorderColorHover: colors.transparent,
    buttonTextColor: colors.black,
    buttonTextColorActive: colors.black,
    buttonTextColorHover: colors.black,
  },
  Select: {
    peers: {
      InternalSelection: {
        arrowColor: colors.white,
        border: `1px solid ${colors.bg.DEFAULT}`,
        borderFocus: `1px solid ${colors.grey.light}`,
        borderError: `1px solid ${colors.yellow}`,
        borderFocusError: `1px solid ${colors.grey.DEFAULT}`,
        borderFocusWarning: `1px solid ${colors.bg.DEFAULT}`,
        borderHover: `1px solid ${colors.grey.light}`,
        borderHoverError: `1px solid ${colors.grey.DEFAULT}`,
        borderHoverWarning: `1px solid ${colors.grey.light}`,
        borderWarning: `1px solid ${colors.grey.light}`,
        caretColor: colors.grey.DEFAULT,
        caretColorError: colors.grey.DEFAULT,
        caretColorWarning: colors.grey.DEFAULT,
        clearColor: colors.grey.DEFAULT,
        clearColorHover: colors.grey.DEFAULT,
        clearColorPressed: colors.grey.DEFAULT,
        color: colors.bg.DEFAULT,
        colorActive: colors.bg.DEFAULT,
        colorActiveError: colors.bg.DEFAULT,
        colorActiveWarning: colors.bg.DEFAULT,
        colorDisabled: colors.primary.dark,
        fontSizeMedium: '14px',
        fontWeight: 'medium',
        heightTiny: '28px',
        heightSmall: '34px',
        heightMedium: '38px',
        heightLarge: '48px',
        loadingColor: colors.grey.DEFAULT,
        placeholderColor: colors.grey.lightest,
        paddingSingle: '0 20px',
        textColor: colors.white,
        textColorDisabled: colors.grey.lighter,
      },
      InternalSelectMenu: {
        color: colors.grey.light,
        optionColorActive: colors.bg.DEFAULT,
        optionColorActivePending: colors.bg.DEFAULT,
        optionColorPending: colors.grey.lighter,
        optionCheckColor: colors.bg.DEFAULT,
        optionTextColor: colors.white,
        optionTextColorPressed: colors.white,
        optionTextColorDisabled: colors.grey.lighter,
        optionTextColorActive: colors.white,
        paddingTiny: '0px',
        paddingSmall: '3px',
        paddingMedium: '5px',
        paddingLarge: '7px',
        paddingHuge: '10px',
      },
    },
  },
  Slider: {
    dotColor: colors.purple.lighter,
    fillColor: colors.purple.DEFAULT,
    fillColorHover: colors.purple.DEFAULT,
    handleColor: colors.purple.lighter,
    indicatorColor: colors.purple.lighter,
    indicatorTextColor: colors.black,
    railColor: colors.body.light,
    railColorHover: colors.body.light,
  },
  Switch: {
    railColor: colors.grey.light,
  },
};
