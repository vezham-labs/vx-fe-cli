import { Avatar } from '@vezham/react-v3'
import { getInitials } from '@vezham/utils/name'

type Classes = {
  studentNameAvatar: string
  studentNameCell: string
  studentNamePrimary: string
  studentNameSecondary: string
  studentNameText: string
}

type Props = {
  avatar?: string
  classes: Classes
  name: string
  secondaryText?: string
}

export const StudentNameCell = ({
  avatar,
  classes,
  name,
  secondaryText
}: Props) => (
  <div className={classes.studentNameCell}>
    <Avatar className={classes.studentNameAvatar} size="sm">
      {avatar && <Avatar.Image src={avatar} alt={name} />}
      <Avatar.Fallback>{getInitials(name)}</Avatar.Fallback>
    </Avatar>
    <div className={classes.studentNameText}>
      <div className={classes.studentNamePrimary}>{name}</div>
      {secondaryText && (
        <div className={classes.studentNameSecondary}>{secondaryText}</div>
      )}
    </div>
  </div>
)
