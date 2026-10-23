import { Inbox as InboxIcon } from '@vezham/icons-react'
import { Avatar } from '@vezham/react-v3'
import { getInitials } from '@vezham/utils/name'

type PersonClasses = {
  personCell: string
  personAvatar: string
  personText: string
  personName: string
  personSecondary: string
}

export const RecordPersonCell = ({
  value,
  classes,
  secondaryKey
}: {
  value: unknown
  classes: PersonClasses
  secondaryKey: 'subtitle' | 'description'
}) => {
  const person = value as {
    name: string
    avatar?: string
    subtitle?: string
    description?: string
  }
  const secondary = person[secondaryKey]

  return (
    <div className={classes.personCell}>
      <Avatar className={classes.personAvatar} size="sm">
        {person.avatar && (
          <Avatar.Image src={person.avatar} alt={person.name} />
        )}
        <Avatar.Fallback>{getInitials(person.name)}</Avatar.Fallback>
      </Avatar>
      <span className={classes.personText}>
        <span className={classes.personName}>{person.name}</span>
        {secondary ? (
          <span className={classes.personSecondary}>{secondary}</span>
        ) : null}
      </span>
    </div>
  )
}

export const RecordTableEmptyState = ({
  classes
}: {
  classes: { emptyState: string; emptyIcon: string; emptyText: string }
}) => (
  <div className={classes.emptyState}>
    <InboxIcon className={classes.emptyIcon} size={42} aria-hidden="true" />
    <p className={classes.emptyText}>No results found</p>
  </div>
)
