import { useId, useRef, useState } from 'react'

import {
  AddCircle as AddCircleIcon,
  DoubleAltArrowRight as DoubleAltArrowRightIcon,
  TrashBinTrash as TrashBinTrashIcon
} from '@vezham/icons-react'
import { Button, Drawer, Tabs, Tooltip } from '@vezham/react-v3'
import { ShortcutKey } from '@vezham/react/shortcut-key'

import { RecordDrawerFrame } from '@pages/_shared/record-drawer-frame'
import {
  classOptions,
  durationOptions,
  emptyTimetableForm,
  sectionOptions,
  subjectGroupOptions,
  subjectOptions,
  teachers,
  timetableDayTabs
} from '@pages/academic/timetable/data'
import type {
  TimetableDrawerProps,
  TimetableFormRow
} from '@pages/academic/timetable/types'
import { classNames } from '@pages/academic/timetable/variants'

import { TimetableFormSelect } from './timetable-form-select'
import { TimetableTimeField } from './timetable-time-field'

export const TimetableDrawer = ({
  drawerState,
  form,
  formErrors,
  onCancel,
  onClose,
  onFormChange,
  onSave
}: TimetableDrawerProps) => {
  const timetableRows = form.timetableRows.length
    ? form.timetableRows
    : emptyTimetableForm.timetableRows
  const [activeDay, setActiveDay] = useState(timetableDayTabs[0])
  const rowIdPrefix = useId()
  const nextRowId = useRef(0)

  const updateTimetableRow = <K extends keyof TimetableFormRow>(
    rowId: string,
    field: K,
    value: TimetableFormRow[K]
  ) => {
    onFormChange(
      'timetableRows',
      timetableRows.map(timetableRow =>
        timetableRow.id === rowId
          ? { ...timetableRow, [field]: value }
          : timetableRow
      )
    )
  }

  const addTimetableRow = (day: string) => {
    nextRowId.current += 1

    onFormChange('timetableRows', [
      ...timetableRows,
      {
        id: `${rowIdPrefix}-${nextRowId.current}`,
        day,
        endTime: '',
        startTime: '',
        subject: '',
        teacher: ''
      }
    ])
  }

  const deleteTimetableRow = (rowId: string) => {
    const row = timetableRows.find(timetableRow => timetableRow.id === rowId)
    const dayRows = timetableRows.filter(
      timetableRow => timetableRow.day === row?.day
    )

    if (dayRows.length === 1) {
      return
    }

    onFormChange(
      'timetableRows',
      timetableRows.filter(timetableRow => timetableRow.id !== rowId)
    )
  }

  const getRowsForDay = (day: string) => {
    const dayRows = timetableRows.filter(
      timetableRow => timetableRow.day === day
    )

    if (dayRows.length) {
      return dayRows
    }

    return [
      {
        id: `timetable-row-${day.toLowerCase()}-1`,
        day,
        endTime: '',
        startTime: '',
        subject: '',
        teacher: ''
      }
    ]
  }

  return (
    <RecordDrawerFrame state={drawerState} className={classNames.drawerDialog}>
      <Drawer.Header className={classNames.drawerHeader}>
        <div className={classNames.drawerHeaderRow}>
          <div className={classNames.drawerTitleGroup}>
            <Tooltip delay={0}>
              <Tooltip.Trigger>
                <Button
                  isIconOnly
                  aria-label="Toggle drawer"
                  variant="ghost"
                  onPress={onClose}>
                  <DoubleAltArrowRightIcon size={20} aria-hidden="true" />
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content>
                <span className="flex items-center gap-2 whitespace-nowrap">
                  <span>Toggle Drawer</span>
                  <ShortcutKey shortcut="⌘ /" />
                </span>
              </Tooltip.Content>
            </Tooltip>
            <span className={classNames.drawerTitle}>Add Timetable</span>
          </div>

          <div className={classNames.drawerActions} />
        </div>
      </Drawer.Header>

      <Drawer.Body className={classNames.drawerBody}>
        <form
          className={classNames.form}
          onSubmit={event => {
            event.preventDefault()
            onSave()
          }}>
          <div className={classNames.formFields}>
            <div className={classNames.scheduleTopGrid}>
              <TimetableFormSelect
                error={formErrors.className}
                label="Class"
                options={classOptions}
                placeholder="Select"
                value={form.className}
                onChange={value => onFormChange('className', value)}
              />
              <TimetableFormSelect
                error={formErrors.section}
                label="Section"
                options={sectionOptions}
                placeholder="Select"
                value={form.section}
                onChange={value => onFormChange('section', value)}
              />
              <TimetableFormSelect
                error={formErrors.subjectGroup}
                label="Subject Group"
                options={subjectGroupOptions}
                placeholder="Select"
                value={form.subjectGroup}
                onChange={value => onFormChange('subjectGroup', value)}
              />
              <TimetableTimeField
                error={formErrors.periodStartTime}
                label="Period Start Time"
                value={form.periodStartTime}
                onChange={value => onFormChange('periodStartTime', value)}
              />
              <TimetableFormSelect
                error={formErrors.duration}
                label="Duration(min)"
                options={durationOptions}
                placeholder="Select"
                value={form.duration}
                onChange={value => onFormChange('duration', value)}
              />
            </div>

            <Tabs
              className={classNames.timetableTabs}
              selectedKey={activeDay}
              variant="secondary"
              onSelectionChange={key => setActiveDay(String(key))}>
              <Tabs.ListContainer>
                <Tabs.List
                  aria-label="Timetable weekdays"
                  className={classNames.timetableTabsList}>
                  {timetableDayTabs.map(day => (
                    <Tabs.Tab key={day} id={day}>
                      {day}
                      <Tabs.Indicator />
                    </Tabs.Tab>
                  ))}
                </Tabs.List>
              </Tabs.ListContainer>

              {timetableDayTabs.map(day => {
                const dayRows = getRowsForDay(day)

                return (
                  <Tabs.Panel
                    key={day}
                    className={classNames.timetableTabPanel}
                    id={day}>
                    <div className={classNames.timetableRows}>
                      {dayRows.map((timetableRow, index) => (
                        <div
                          key={timetableRow.id}
                          className={classNames.timetableRow}>
                          <TimetableFormSelect
                            label="Subject"
                            options={subjectOptions}
                            placeholder="Select"
                            value={timetableRow.subject}
                            onChange={value =>
                              updateTimetableRow(
                                timetableRow.id,
                                'subject',
                                value
                              )
                            }
                          />
                          <TimetableFormSelect
                            label="Teacher"
                            options={teachers.map(teacher => teacher.name)}
                            placeholder="Select"
                            value={timetableRow.teacher}
                            onChange={value =>
                              updateTimetableRow(
                                timetableRow.id,
                                'teacher',
                                value
                              )
                            }
                          />
                          <TimetableTimeField
                            label="Time From"
                            value={timetableRow.startTime}
                            onChange={value =>
                              updateTimetableRow(
                                timetableRow.id,
                                'startTime',
                                value
                              )
                            }
                          />
                          <TimetableTimeField
                            label="Time To"
                            value={timetableRow.endTime}
                            onChange={value =>
                              updateTimetableRow(
                                timetableRow.id,
                                'endTime',
                                value
                              )
                            }
                          />
                          <Button
                            isIconOnly
                            aria-label={`Delete ${day} timetable row ${
                              index + 1
                            }`}
                            className={classNames.timetableDeleteButton}
                            isDisabled={dayRows.length === 1}
                            variant="secondary"
                            onPress={() => deleteTimetableRow(timetableRow.id)}>
                            <TrashBinTrashIcon size={18} aria-hidden="true" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    {formErrors.timetableRows && (
                      <p className={classNames.fieldError}>
                        {formErrors.timetableRows}
                      </p>
                    )}

                    <div>
                      <Button onPress={() => addTimetableRow(day)}>
                        <AddCircleIcon size={16} aria-hidden="true" />
                        Add New
                      </Button>
                    </div>
                  </Tabs.Panel>
                )
              })}
            </Tabs>
          </div>
        </form>
      </Drawer.Body>

      <Drawer.Footer className={classNames.drawerFooter}>
        <div className={classNames.drawerFormFooterActions}>
          <Button variant="secondary" onPress={onCancel}>
            Cancel
          </Button>
          <Button onPress={onSave}>Add Timetable</Button>
        </div>
      </Drawer.Footer>
    </RecordDrawerFrame>
  )
}
