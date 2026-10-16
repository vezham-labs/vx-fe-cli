import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import type { Key } from 'react-aria-components'

import { Book, Pen } from '@vezham/icons-react'
import { Sheet } from '@vezham/react-pro-v3'
import {
  Button,
  Chip,
  Surface,
  Tabs,
  Tooltip,
  useMediaQuery
} from '@vezham/react-v3'

import { classDetailTabs } from './data'
import type { ClassDetailTab, ClassRecord } from './types'
import { formatDate, isClassDetailTab } from './utils'

type ClassDetailSectionProps = {
  action?: () => void
  children: ReactNode
  title: string
}

const ClassDetailSection = ({
  action,
  children,
  title
}: ClassDetailSectionProps) => (
  <section>
    <div className="mb-2 flex items-center justify-between gap-3">
      <h3 className="text-sm font-medium">{title}</h3>
      {action && (
        <Button
          className="h-auto min-h-0 px-0 py-0 text-xs"
          variant="ghost"
          onPress={action}>
          See all
        </Button>
      )}
    </div>
    {children}
  </section>
)

type ClassDetailTabContentProps = {
  classRecord: ClassRecord
  tab: ClassDetailTab
  onTabChange: (tab: ClassDetailTab) => void
}

const ClassDetailTabContent = ({
  classRecord,
  tab,
  onTabChange
}: ClassDetailTabContentProps) => {
  if (tab === 'home')
    return (
      <div className="flex max-w-2xl flex-col gap-8">
        <ClassDetailsSummary
          classRecord={classRecord}
          onTabChange={onTabChange}
        />
      </div>
    )

  if (tab === 'students') {
    return (
      <ClassDetailSection title="Student enrollment">
        <p className="text-muted text-sm">
          {classRecord.students} students are enrolled in Class{' '}
          {classRecord.className}, Section {classRecord.section}.
        </p>
      </ClassDetailSection>
    )
  }

  if (tab === 'subjects') {
    return (
      <ClassDetailSection title="Assigned subjects">
        <p className="text-muted text-sm">
          {classRecord.subjects} subjects are assigned to this class.
        </p>
      </ClassDetailSection>
    )
  }

  if (tab === 'schedule') {
    return (
      <ClassDetailSection title="Class schedule">
        <p className="text-muted text-sm">
          No timetable entries have been added for this class.
        </p>
      </ClassDetailSection>
    )
  }

  if (tab === 'notes') {
    return (
      <ClassDetailSection title="Class notes">
        <p className="text-muted text-sm">No notes have been added yet.</p>
      </ClassDetailSection>
    )
  }

  return (
    <div className="flex max-w-2xl flex-col gap-8">
      <ClassDetailSection title="Class summary">
        <p className="text-muted text-sm">
          Class {classRecord.className}, Section {classRecord.section} has{' '}
          {classRecord.students} students and {classRecord.subjects} subjects.
        </p>
      </ClassDetailSection>
      <ClassDetailSection
        action={() => onTabChange('schedule')}
        title="Class schedule">
        <p className="text-muted text-sm">
          No timetable entries have been added for this class.
        </p>
      </ClassDetailSection>
      <ClassDetailSection title="Recent activity">
        <p className="text-muted text-sm">
          Class record created on {formatDate(classRecord.createdAt)}.
        </p>
      </ClassDetailSection>
    </div>
  )
}

type ClassDetailRailRowProps = {
  label: string
  value: ReactNode
}

const ClassDetailRailRow = ({ label, value }: ClassDetailRailRowProps) => (
  <div className="flex items-start justify-between gap-3">
    <dt className="text-muted text-xs">{label}</dt>
    <dd className="max-w-[11rem] text-right text-sm">{value}</dd>
  </div>
)

type ClassDetailRailGroupProps = {
  empty: string
  label: string
  onSeeAll?: () => void
  value?: string
}

const ClassDetailRailGroup = ({
  empty,
  label,
  onSeeAll,
  value
}: ClassDetailRailGroupProps) => (
  <section>
    <div className="mb-2 flex items-center justify-between gap-2">
      <p className="text-muted text-xs font-medium tracking-wide">{label}</p>
      {value && onSeeAll && (
        <Button
          className="h-auto min-h-0 px-0 py-0 text-xs"
          variant="ghost"
          onPress={onSeeAll}>
          See all
        </Button>
      )}
    </div>
    <p className="text-sm">{value ?? empty}</p>
  </section>
)

type ClassDetailsSummaryProps = {
  classRecord: ClassRecord
  onTabChange: (tab: ClassDetailTab) => void
}

const ClassDetailsSummary = ({
  classRecord,
  onTabChange
}: ClassDetailsSummaryProps) => (
  <>
    <section>
      <p className="text-muted text-xs font-medium tracking-wide">
        Class details
      </p>
      <dl className="mt-3 flex flex-col gap-3">
        <ClassDetailRailRow
          label="Class"
          value={`Class ${classRecord.className}`}
        />
        <ClassDetailRailRow label="Section" value={classRecord.section} />
        <ClassDetailRailRow
          label="Status"
          value={
            <Chip
              color={classRecord.status === 'Active' ? 'success' : 'danger'}
              size="sm"
              variant="soft">
              <Chip.Label>{classRecord.status}</Chip.Label>
            </Chip>
          }
        />
        <ClassDetailRailRow
          label="Created"
          value={formatDate(classRecord.createdAt)}
        />
      </dl>
    </section>
    <ClassDetailRailGroup
      label="Students"
      value={`${classRecord.students} enrolled`}
      onSeeAll={() => onTabChange('students')}
      empty="No students."
    />
    <ClassDetailRailGroup
      label="Subjects"
      value={`${classRecord.subjects} assigned`}
      onSeeAll={() => onTabChange('subjects')}
      empty="No subjects."
    />
    <ClassDetailRailGroup
      empty="No timetable entries."
      label="Schedule"
      onSeeAll={() => onTabChange('schedule')}
    />
    <ClassDetailRailGroup empty="No notes yet." label="Notes" />
  </>
)

type ClassDetailsSheetProps = {
  classRecord: ClassRecord | null
  onEdit: (classRecord: ClassRecord) => void
  onOpenChange: (isOpen: boolean) => void
}

export const ClassDetailsSheet = ({
  classRecord,
  onEdit,
  onOpenChange
}: ClassDetailsSheetProps) => {
  const isCompactSheet = useMediaQuery('(width < 768px)')
  const [tab, setTab] = useState<ClassDetailTab>('overview')
  const detailTabs = isCompactSheet
    ? [{ id: 'home' as const, label: 'Home' }, ...classDetailTabs]
    : classDetailTabs

  useEffect(() => {
    setTab('overview')
  }, [classRecord?.id])

  const handleTabChange = (key: Key) => {
    const nextTab = String(key)

    if (isClassDetailTab(nextTab)) setTab(nextTab)
  }

  return (
    <Sheet
      isOpen={Boolean(classRecord)}
      placement={isCompactSheet ? 'bottom' : 'right'}
      isHandleOnly={isCompactSheet}
      shouldAutoFocus={isCompactSheet}
      onOpenChange={onOpenChange}>
      <Sheet.Backdrop variant="blur" className="bg-overlay/10">
        <Sheet.Content
          className={
            isCompactSheet
              ? 'mx-auto h-[75dvh] max-h-[75dvh] w-full max-w-2xl'
              : 'inset-y-0 flex h-svh w-full flex-col sm:w-[min(72rem,calc(100vw-1.5rem))]'
          }>
          <Sheet.Dialog
            className={`relative flex h-full min-h-0 flex-col ${
              isCompactSheet ? 'max-h-none rounded-t-[1.75rem]' : ''
            }`}>
            {isCompactSheet && <Sheet.Handle />}
            <Sheet.CloseTrigger aria-label="Close class details" />
            <Sheet.Header className="shrink-0 gap-3 pr-12">
              <Sheet.Heading className="sr-only">
                {classRecord
                  ? `Class ${classRecord.className} details`
                  : 'Class details'}
              </Sheet.Heading>
              <Tabs
                className="min-w-0 flex-1"
                selectedKey={tab}
                onSelectionChange={handleTabChange}>
                <Tabs.ListContainer className="overflow-x-auto">
                  <Tabs.List aria-label="Class sections">
                    {detailTabs.map(item => (
                      <Tabs.Tab key={item.id} id={item.id}>
                        {item.label}
                        <Tabs.Indicator />
                      </Tabs.Tab>
                    ))}
                  </Tabs.List>
                </Tabs.ListContainer>
              </Tabs>
              {classRecord && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="hidden md:inline-flex"
                  onPress={() => onEdit(classRecord)}>
                  <Pen size={16} aria-hidden="true" />
                  Edit
                </Button>
              )}
            </Sheet.Header>
            <Sheet.Body className="min-h-0 flex-1 overflow-hidden p-0">
              {classRecord && (
                <div className="flex h-full min-h-0">
                  <div className="min-w-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
                    <div className="mb-8 flex items-center gap-3">
                      <Surface className="flex size-11 shrink-0 items-center justify-center rounded-xl p-0">
                        <Book size={22} aria-hidden="true" />
                      </Surface>
                      <div className="min-w-0">
                        <p className="text-lg font-semibold">
                          Class {classRecord.className}
                        </p>
                        <p className="text-muted text-sm">
                          Section {classRecord.section} · {classRecord.id}
                        </p>
                      </div>
                    </div>

                    <ClassDetailTabContent
                      classRecord={classRecord}
                      tab={tab}
                      onTabChange={setTab}
                    />
                  </div>

                  <aside className="border-separator hidden w-72 shrink-0 overflow-y-auto border-l px-5 py-6 md:block">
                    <div className="flex flex-col gap-8">
                      <ClassDetailsSummary
                        classRecord={classRecord}
                        onTabChange={setTab}
                      />
                    </div>
                  </aside>
                </div>
              )}
            </Sheet.Body>
            {classRecord && (
              <Tooltip delay={0}>
                <Button
                  isIconOnly
                  variant="primary"
                  aria-label={`Edit Class ${classRecord.className}`}
                  className="absolute right-3 bottom-[calc(max(0.75rem,env(safe-area-inset-bottom))+0.5rem)] z-10 h-11 w-11 rounded-full p-0 shadow-lg md:hidden"
                  onPress={() => onEdit(classRecord)}>
                  <Pen size={22} aria-hidden="true" />
                </Button>
                <Tooltip.Content>Edit class</Tooltip.Content>
              </Tooltip>
            )}
          </Sheet.Dialog>
        </Sheet.Content>
      </Sheet.Backdrop>
    </Sheet>
  )
}
