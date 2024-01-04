import { createSelector } from '@reduxjs/toolkit'

import { useState } from 'preact/hooks'
import { useSelector } from 'react-redux'
import { Alert, IconButton, Typography } from '@mui/joy'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import ReportIcon from '@mui/icons-material/Report'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import appState from '@/app/reducer.js'
import { store } from '@/main.jsx'
import { setState } from 'src/helpers.js'

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

const { removeNotification } = appState.actions
export default function NotificationList () {
    const items = useSelector(selectNotification)
    const [isCloseAlerts, setIsClose] = useState({})
    const remove = id => {
        store.dispatch(removeNotification(id))
    }
    return <div className="notification-list">
        {items.slice(-7).map(({ id, type, title, message }) => {
            const { icon, color, titleDef } = iconStyle[type]

            const isClose = isCloseAlerts[id]
            const IconClose = (
              <IconButton variant="soft" color={color}
                          onClick={() => setIsClose(setState(id, true))}>
                  <CloseRoundedIcon/>
              </IconButton>)

            return (
              <>
                  <Alert
                    key={id}
                    startDecorator={icon}
                    variant="soft"
                    color={color}
                    className={isClose ? 'animate-backOutRight' : 'animate-backInRight'}
                    endDecorator={IconClose}
                    onAnimationend={() => isClose && remove(id)}
                  >
                      <div>
                          <div>{title || titleDef}</div>
                          <Typography level="body-sm" color={color}>
                              {message}
                          </Typography>
                      </div>
                  </Alert>
              </>
            )
        })
        }
    </div>
}
