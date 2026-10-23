import { CalendarDateTime } from '@internationalized/date'
import { useCallback, useMemo, useState } from 'react'

import { useAgenda } from '@vezham/react-pro-v3'
import type { SortDescriptor } from '@vezham/react-v3'
import { useToolbarAction } from '@vezham/react/toolbar-actions'

import type {
  TimetableEvent,
  TimetableFilter,
  TimetableFormErrors,
  TimetableFormState,
  TimetableView
} from '@pages/academic/timetable/types'
import { useDisclosure } from '@pages/academic/timetable/types'
import {
  getAgendaDate,
  getDateForDayName,
  getDayName,
  getTodayCalendarDate
} from '@pages/academic/timetable/utils/date'
import {
  getFilledTimetableRows,
  getSubjectColor,
  isValidEvent,
  parseTimeInput,
  validateTimetableForm
} from '@pages/academic/timetable/utils/timetable'
import {
  dayOptions,
  emptyFilters,
  emptyTimetableForm,
  sortOptions,
  toAgendaEvents,
  useTimetable
} from '@store/useAcademic/useTimetable'

export const useTimetablePage = () => {
  const { data: timetableEvents } = useTimetable.list({})
  const [events, setEvents] = useState<TimetableEvent[]>(timetableEvents)
  const [searchQuery] = useState('')
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'start',
    direction: 'ascending'
  })
  const [view, setView] = useState<TimetableView>('week')
  const [calendarDate, setCalendarDate] = useState(getTodayCalendarDate)
  const [filters, setFilters] = useState<TimetableFilter>(emptyFilters)
  const [draftFilters, setDraftFilters] =
    useState<TimetableFilter>(emptyFilters)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [form, setForm] = useState<TimetableFormState>(emptyTimetableForm)
  const [formErrors, setFormErrors] = useState<TimetableFormErrors>({})
  const drawer = useDisclosure()

  const filteredEvents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return events.filter(event => {
      if (!isValidEvent(event)) {
        return false
      }

      const matchesQuery =
        !query ||
        event.title.toLowerCase().includes(query) ||
        event.teacher.toLowerCase().includes(query) ||
        event.subject.toLowerCase().includes(query) ||
        event.room.toLowerCase().includes(query) ||
        event.className.toLowerCase().includes(query) ||
        event.section.toLowerCase().includes(query)

      return (
        matchesQuery &&
        (!filters.className || event.className === filters.className) &&
        (!filters.section || event.section === filters.section) &&
        (!filters.teacher || event.teacher === filters.teacher) &&
        (!filters.subject || event.subject === filters.subject) &&
        (!filters.day || event.day === filters.day)
      )
    })
  }, [events, filters, searchQuery])

  const sortedEvents = useMemo(() => {
    return [...filteredEvents].sort((firstEvent, secondEvent) => {
      const first = firstEvent[sortDescriptor.column as keyof TimetableEvent]
      const second = secondEvent[sortDescriptor.column as keyof TimetableEvent]

      let comparison = 0

      if (
        first instanceof CalendarDateTime &&
        second instanceof CalendarDateTime
      ) {
        comparison = first.compare(second)
      } else if (sortDescriptor.column === 'day') {
        comparison =
          dayOptions.indexOf(String(first ?? '')) -
          dayOptions.indexOf(String(second ?? ''))
      } else {
        comparison = String(first ?? '').localeCompare(
          String(second ?? ''),
          undefined,
          {
            numeric: true
          }
        )
      }

      return sortDescriptor.direction === 'descending'
        ? comparison * -1
        : comparison
    })
  }, [filteredEvents, sortDescriptor])

  const agendaEvents = useMemo(
    () => toAgendaEvents(sortedEvents),
    [sortedEvents]
  )
  const todayDate = useMemo(() => getTodayCalendarDate(), [])
  const agendaDate = useMemo(
    () => getAgendaDate(calendarDate, view),
    [calendarDate, view]
  )

  const activeSortLabel =
    sortOptions.find(option => option.column === sortDescriptor.column)
      ?.label ?? 'Start Time'

  const updateView = useCallback((nextView: TimetableView) => {
    setView(nextView)
    setFilters(current => ({ ...current, view: nextView }))
    setDraftFilters(current => ({ ...current, view: nextView }))
  }, [])

  const handleEventMove = useCallback(
    (id: string, start: CalendarDateTime, end: CalendarDateTime) => {
      setEvents(current =>
        current.map(event =>
          event.id === id
            ? { ...event, day: getDayName(start), end, start }
            : event
        )
      )
    },
    []
  )

  const handleEventResize = useCallback(
    (id: string, start: CalendarDateTime, end: CalendarDateTime) => {
      setEvents(current =>
        current.map(event =>
          event.id === id
            ? { ...event, day: getDayName(start), end, start }
            : event
        )
      )
    },
    []
  )

  const agenda = useAgenda({
    date: agendaDate,
    endHour: 24,
    events: agendaEvents,
    onDateChange: setCalendarDate,
    onEventMove: handleEventMove,
    onEventResize: handleEventResize,
    onEventSelect: setSelectedEventId,
    onViewChange: updateView,
    selectedEventId,
    slotDuration: 60,
    startHour: 0,
    view,
    weekDays: 7
  })

  const applyFilters = () => {
    setFilters(draftFilters)

    if (draftFilters.view) {
      setView(draftFilters.view)
    }
  }

  const resetFilters = () => {
    setFilters(emptyFilters)
    setDraftFilters(emptyFilters)
    setView('week')
    setCalendarDate(todayDate)
  }

  const updateSortDescriptor = (descriptor: SortDescriptor) => {
    setSortDescriptor(descriptor)
  }

  const openCreateDrawer = useCallback(() => {
    setForm(emptyTimetableForm)
    setFormErrors({})
    drawer.onOpen()
  }, [drawer])

  const closeCreateDrawer = useCallback(() => {
    drawer.onClose()
    setFormErrors({})
  }, [drawer])

  const updateForm = <K extends keyof TimetableFormState>(
    field: K,
    value: TimetableFormState[K]
  ) => {
    setForm(current => ({ ...current, [field]: value }))
    setFormErrors(current => {
      const nextErrors = { ...current }

      delete nextErrors[field]

      return nextErrors
    })
  }

  const saveTimetableEntry = () => {
    const errors = validateTimetableForm(form)

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)

      return
    }

    const filledRows = getFilledTimetableRows(form)
    const nextEvents = filledRows.map((row, index) => {
      const startParts = parseTimeInput(row.startTime)
      const endParts = parseTimeInput(row.endTime)
      const eventDate = getDateForDayName(calendarDate, row.day)
      const color = getSubjectColor(row.subject)

      return {
        className: form.className.trim(),
        color,
        day: row.day,
        end: new CalendarDateTime(
          eventDate.year,
          eventDate.month,
          eventDate.day,
          endParts.hour,
          endParts.minute
        ),
        id: `tt-${Date.now()}-${index}`,
        room: form.subjectGroup.trim(),
        section: form.section.trim(),
        start: new CalendarDateTime(
          eventDate.year,
          eventDate.month,
          eventDate.day,
          startParts.hour,
          startParts.minute
        ),
        status: 'confirmed',
        subject: row.subject.trim(),
        teacher: row.teacher.trim(),
        title: row.subject.trim()
      } satisfies TimetableEvent
    })

    setEvents(current => [...current, ...nextEvents])
    setSelectedEventId(nextEvents[0]?.id ?? null)
    setCalendarDate(getDateForDayName(calendarDate, filledRows[0].day))
    closeCreateDrawer()
  }

  useToolbarAction('create', openCreateDrawer, { pageKey: 'timetable' })

  return {
    calendar: {
      agenda,
      agendaEvents
    },
    drawerProps: {
      drawerState: drawer,
      form,
      formErrors,
      onCancel: closeCreateDrawer,
      onClose: closeCreateDrawer,
      onFormChange: updateForm,
      onSave: saveTimetableEntry
    },
    toolbar: {
      activeSortLabel,
      draftFilters,
      onApplyFilters: applyFilters,
      onResetFilters: resetFilters,
      onSortChange: updateSortDescriptor,
      setDraftFilters,
      sortDescriptor
    }
  }
}
