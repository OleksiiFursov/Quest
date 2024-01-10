import { createSelector } from '@reduxjs/toolkit'
import { memo } from 'preact/compat'

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

// const NotificationItem = memo(({ id, type, title, message}){
//
// }
export default function NotificationList () {
    const items = useSelector(selectNotification)
    const [isCloseAlerts, setIsClose] = useState({})
    const remove = id => {
        store.dispatch(removeNotification(id))
    }
    const opacity = items.length - 1 - 7

    return <div className="notification-list">
        {items.map(({ id, type, title, message }, index) => {
            const { icon, color, titleDef } = iconStyle[type];

            const isClose = isCloseAlerts[id]
            const IconClose = (
              <IconButton
                variant="soft"
                color={color}
                onClick={() => setIsClose(setState(id, true))}
              >
                  <CloseRoundedIcon/>
              </IconButton>)

            return (
              <Alert
                key={id}
                startDecorator={icon}
                variant="soft"
                color={color}
                className={(opacity>index ? 'hidden ':'') + (isClose ? 'animate-backOutRight' : 'animate-backInRight')}
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

            )
        })
        }
    </div>
}
