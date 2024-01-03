import { createSelector } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { Alert, IconButton, Typography } from '@mui/joy'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import ReportIcon from '@mui/icons-material/Report'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import appState from '/src/app/reducer.js'
import { store } from '/src/main.jsx'

const select = (state) => state.app
const selectNotification = createSelector(select, state => state.notifications)

const iconStyle = {
    error: {
        icon: <ReportIcon/>,
        color: 'danger',
        titleDef: 'Error',

    },
    success: {
        icon: <CheckCircleIcon/>,
        color: 'success',
        titleDef: 'Success',

    },
}

const { removeNotification } = appState.actions;
export default function NotificationList () {
    const items = useSelector(selectNotification)
    const remove = id => store.dispatch(removeNotification(id))
    return <div className="notification-list">
        {items.map(({ id, type, title, message }) => {
            const { icon, color, titleDef } = iconStyle[type];
            const IconClose = (
              <IconButton variant="soft" color={color} onClick={() => remove(id)}>
                  <CloseRoundedIcon/>
              </IconButton>)

            return (
              <Alert
                key={id}
                startDecorator={icon}
                variant="soft"
                color={color}
                endDecorator={IconClose}
              >
                  <div>
                      <div>{id} || {title || titleDef}</div>
                      <Typography level="body-sm" color={color}>
                          {message}
                      </Typography>
                  </div>
              </Alert>

            )
        })
        }
    </div>
}
