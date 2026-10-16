import type { ChangeEvent } from 'react'
import { useEffect, useState } from 'react'

import { Sheet } from '@vezham/react-pro-v3'
import {
  Button,
  InputGroup,
  Label,
  ListBox,
  Select,
  Switch,
  TextField,
  useMediaQuery
} from '@vezham/react-v3'

import type { ClassRecord } from './types'
import { createEmptyClassRecord } from './utils'

type Props = {
  classRecord: ClassRecord | null
  isCreateMode: boolean
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onSave: (classRecord: ClassRecord) => void
}

const sectionOptions = ['A', 'B', 'C', 'D'] as const

export const ClassFormSheet = ({
  classRecord,
  isCreateMode,
  isOpen,
  onOpenChange,
  onSave
}: Props) => {
  const isCompactSheet = useMediaQuery('(width < 768px)')
  const [draftClass, setDraftClass] = useState<ClassRecord>(
    () => classRecord ?? createEmptyClassRecord()
  )

  useEffect(() => {
    if (isOpen) setDraftClass(classRecord ?? createEmptyClassRecord())
  }, [classRecord, isOpen])

  const updateNumber =
    (field: 'students' | 'subjects') =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value)

      setDraftClass(current => ({
        ...current,
        [field]: Number.isFinite(value) ? Math.max(0, value) : 0
      }))
    }

  return (
    <Sheet
      isOpen={isOpen}
      placement={isCompactSheet ? 'bottom' : 'right'}
      isHandleOnly={isCompactSheet}
      shouldAutoFocus={isCompactSheet}
      onOpenChange={onOpenChange}>
      <Sheet.Backdrop variant="blur" className="bg-overlay/10">
        <Sheet.Content
          className={
            isCompactSheet
              ? 'mx-auto h-[75dvh] max-h-[75dvh] w-full max-w-2xl'
              : 'w-full sm:w-[28rem]'
          }>
          <Sheet.Dialog
            className={
              isCompactSheet
                ? 'flex h-full max-h-none min-h-0 flex-col rounded-t-[1.75rem]'
                : undefined
            }>
            {isCompactSheet && <Sheet.Handle />}
            <Sheet.CloseTrigger aria-label="Close class editor" />
            <Sheet.Header className="pr-12">
              <Sheet.Heading>
                {isCreateMode ? 'Add Class' : 'Edit class'}
              </Sheet.Heading>
              {!isCreateMode && (
                <p className="text-muted mt-1 text-sm">ID {draftClass.id}</p>
              )}
            </Sheet.Header>
            <Sheet.Body
              className={`flex flex-col gap-5 ${
                isCompactSheet ? 'min-h-0 flex-1 overflow-y-auto' : ''
              }`}>
              <TextField aria-label="Class name">
                <Label>Class Name</Label>
                <InputGroup>
                  <InputGroup.Input
                    placeholder="Enter class name"
                    value={draftClass.className}
                    onChange={event =>
                      setDraftClass(current => ({
                        ...current,
                        className: event.target.value
                      }))
                    }
                  />
                </InputGroup>
              </TextField>

              <Select
                fullWidth
                aria-label="Class section"
                placeholder="Select section"
                value={draftClass.section}
                onChange={value =>
                  setDraftClass(current => ({
                    ...current,
                    section: String(value)
                  }))
                }>
                <Label>Section</Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    {sectionOptions.map(section => (
                      <ListBox.Item
                        key={section}
                        id={section}
                        textValue={section}>
                        {section}
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>

              <TextField aria-label="Number of students">
                <Label>No of Students</Label>
                <InputGroup>
                  <InputGroup.Input
                    min="0"
                    placeholder="Enter students"
                    type="number"
                    value={String(draftClass.students)}
                    onChange={updateNumber('students')}
                  />
                </InputGroup>
              </TextField>

              <TextField aria-label="Number of subjects">
                <Label>No of Subjects</Label>
                <InputGroup>
                  <InputGroup.Input
                    min="0"
                    placeholder="Enter subjects"
                    type="number"
                    value={String(draftClass.subjects)}
                    onChange={updateNumber('subjects')}
                  />
                </InputGroup>
              </TextField>

              <Switch
                aria-label="Class status"
                isSelected={draftClass.status === 'Active'}
                onChange={isSelected =>
                  setDraftClass(current => ({
                    ...current,
                    status: isSelected ? 'Active' : 'Inactive'
                  }))
                }>
                <Switch.Content className="flex w-full items-center justify-between gap-4">
                  <span className="flex flex-col gap-1">
                    <span className="font-medium">Status</span>
                    <span className="text-muted text-sm">
                      Change the status by toggle
                    </span>
                  </span>
                  <Switch.Control>
                    <Switch.Thumb />
                  </Switch.Control>
                </Switch.Content>
              </Switch>
            </Sheet.Body>
            <Sheet.Footer
              className={`justify-end gap-2 ${
                isCompactSheet ? 'shrink-0' : ''
              }`}>
              <Sheet.Close>
                <Button variant="secondary">Cancel</Button>
              </Sheet.Close>
              <Button
                isDisabled={!draftClass.className.trim() || !draftClass.section}
                onPress={() =>
                  onSave({
                    ...draftClass,
                    className: draftClass.className.trim(),
                    section: draftClass.section.trim()
                  })
                }>
                {isCreateMode ? 'Add Class' : 'Save'}
              </Button>
            </Sheet.Footer>
          </Sheet.Dialog>
        </Sheet.Content>
      </Sheet.Backdrop>
    </Sheet>
  )
}
