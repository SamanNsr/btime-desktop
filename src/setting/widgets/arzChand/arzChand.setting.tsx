import { Checkbox, Switch, Typography } from '@material-tailwind/react'
import { ArzChandSettingStore, widgetKey } from 'electron/store'
import { useEffect, useState } from 'react'
import { getSupportedCurrencies, SupportedCurrencies } from '../../../api/api'
import Select from 'react-tailwindcss-select'

export function ArzChandSetting() {
  const [setting, setSetting] = useState<ArzChandSettingStore>(null)
  const [supportedCurrencies, setSupportedCurrencies] =
    useState<SupportedCurrencies>()

  useEffect(() => {
    const ArzChand: ArzChandSettingStore = window.store.get(
      'ArzChand' as widgetKey.ArzChand
    )

    setSetting(ArzChand)

    function fetchSupportedCurrencies() {
      getSupportedCurrencies().then((data) => {
        setSupportedCurrencies(data)
      })
    }

    fetchSupportedCurrencies()
  }, [])

  function setSettingValue<T extends keyof ArzChandSettingStore>(
    key: T,
    value: ArzChandSettingStore[T]
  ) {
    setting[key] = value
    setSetting({ ...setting })
    applyChanges()
  }

  function applyChanges() {
    window.store.set('ArzChand', {
      alwaysOnTop: setting.alwaysOnTop,
      enable: setting.enable,
      transparentStatus: setting.transparentStatus,
      bounds: window.store.get('ArzChand' as widgetKey.ArzChand).bounds,
      currencies: setting.currencies,
    })
  }

  if (!setting) return null
  return (
    <>
      <div className="mt-2 justify-around  not-moveable font-[Vazir]">
        <div className="flex flex-col gap-3">
          <div className="flex flex-row items-center justify-between w-full gap-2">
            <Switch
              id={'arzChand-enable'}
              color={'blue'}
              defaultChecked={setting.enable}
              onClick={() =>
                setSettingValue('enable', setting.enable ? false : true)
              }
              label={
                <div>
                  <Typography
                    variant={'h5'}
                    color="blue-gray"
                    className="text-gray-600  dark:text-[#c7c7c7] text-[13px] font-[Vazir] flex flex-row items-center mr-3"
                  >
                    فعال سازی
                  </Typography>
                  <Typography
                    variant="h5"
                    color="gray"
                    className="dark:text-gray-500 text-[12px] font-[Vazir] mr-3"
                  >
                    فعالسازی ویجت نمایش تاریخ
                  </Typography>
                </div>
              }
              containerProps={{
                className: '-mt-5 mr-2',
              }}
            />
          </div>
          <div className="flex flex-row items-center justify-between w-full gap-2">
            <Checkbox
              ripple={true}
              defaultChecked={setting.transparentStatus}
              onClick={() =>
                setSettingValue('transparentStatus', !setting.transparentStatus)
              }
              label={
                <div>
                  <Typography
                    variant={'h5'}
                    color="blue-gray"
                    className="dark:text-[#c7c7c7] text-gray-600  text-[13px] font-[Vazir] flex flex-row items-center "
                  >
                    شفاف
                  </Typography>
                  <Typography
                    variant="h5"
                    color="gray"
                    className="dark:text-gray-500 text-gray-600 text-[12px] font-[Vazir]"
                  >
                    استفاده از پس زمینه شفاف
                  </Typography>
                </div>
              }
              containerProps={{
                className: '-mt-5 mr-2',
              }}
            />
          </div>
          <div className="flex flex-row items-center justify-between w-full gap-2">
            <Checkbox
              ripple={true}
              defaultChecked={setting.alwaysOnTop}
              onClick={() =>
                setSettingValue('alwaysOnTop', !setting.alwaysOnTop)
              }
              label={
                <div>
                  <Typography
                    variant={'h5'}
                    color="blue-gray"
                    className="dark:text-[#c7c7c7] text-gray-600 text-[13px] font-[Vazir] flex flex-row items-center "
                  >
                    اولویت بالا
                  </Typography>
                  <Typography
                    variant="h5"
                    color="gray"
                    className="dark:text-gray-500 text-gray-600 text-[12px] font-[Vazir]"
                  >
                    اولویت بالایی برای نمایش
                  </Typography>
                </div>
              }
              containerProps={{
                className: '-mt-5 mr-2',
              }}
            />
          </div>

          <div
            className="flex flex-row items-center justify-between w-full gap-2"
            dir="rtl"
          >
            <div
              className="flex flex-col justify-between w-full gap-2"
              dir="rtl"
            >
              <label
                htmlFor="currency-select"
                className="text-gray-600 dark:text-[#eee] font-semibold"
              >
                انتخاب ارز:
              </label>
              {supportedCurrencies && (
                <MultiSelectDropdown
                  options={getCurrencyOptions(supportedCurrencies)}
                  values={getSelectedCurrencies(
                    setting.currencies,
                    supportedCurrencies
                  )}
                  isMultiple={true}
                  limit={3}
                  onChange={(values) => setSettingValue('currencies', values)}
                  color={'blue'}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
function getCurrencyOptions(
  supported: SupportedCurrencies
): { value: string; label: string }[] {
  return Object.keys(supported).map((key) => ({
    value: key,
    label: supported[key].label,
  }))
}

function getSelectedCurrencies(
  selected: string[],
  list: SupportedCurrencies
): { value: string; label: string }[] {
  const keyes = Object.keys(list)

  return keyes
    .filter((key) => selected.includes(key))
    .map((key) => ({ value: key, label: list[key].label }))
}

interface MultiSelectDropdownProps {
  options: {
    value: string
    label: string
  }[]
  values: {
    value: string
    label: string
  }[]
  color: string
  isMultiple: boolean
  limit?: number
  onChange: (values: string[]) => void
}
const MultiSelectDropdown = ({
  options,
  values,
  color,
  isMultiple,
  limit,
  onChange,
}: MultiSelectDropdownProps) => {
  console.log('selectedValue', values)
  console.log()
  const handleChange = (selectedValue) => {
    if (!selectedValue) return []
    if (limit && selectedValue?.length > limit) return values
    const selectedValuesMapped = selectedValue.map((value) => value.value)
    return onChange(selectedValuesMapped)
  }

  return (
    <Select
      onChange={handleChange}
      value={values}
      classNames={{
        menu: 'dark:text-gray-500 text-gray-600 dark:bg-[#2d2d2d] bg-white',
        menuButton: ({ isDisabled }) =>
          `dark:text-gray-200 text-gray-600 bg-gray-200 dark:bg-[#3e3e3e] h-12 rounded w-full ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'} mt-2 pr-1`,
        tagItem() {
          return `dark:bg-gray-500/20 dark:text-gray-500 hover:text-gray-600 bg-gray-300  h-8 rounded-full flex items-center justify-center px-2 `
        },
        closeIcon: 'bg-gray-600',
        tagItemIcon: 'w-3 h-3 bg-transparent hover:bg-gray-200',
        listGroupLabel:
          'dark:text-gray-500 text-gray-600 dark:bg-[#2d2d2d] bg-white',
        list: 'dark:text-gray-500 text-gray-600 dark:bg-[#2d2d2d] bg-white overflow-y-scroll h-32 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300',
      }}
      isMultiple={isMultiple}
      primaryColor={color}
      options={options}
    />
  )
}