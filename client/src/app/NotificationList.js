import {createSelector} from "@reduxjs/toolkit";
import {useSelector} from "react-redux";
import {Alert, IconButton, Typography} from "@mui/joy";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import ReportIcon from '@mui/icons-material/Report'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

const select = (state) => state.app
const selectNotification = createSelector(select, state => state.notifications)

const iconStyle = {
    error: {
        icon: <ReportIcon/>,
        color: 'danger',
        titleDef: 'Error'

    },
    success: {
        icon: <CheckCircleIcon/>,
        color: 'success',
        titleDef: 'Success'

    }
}
export default function NotificationList() {
    const items = useSelector(selectNotification);

    return <div className="notification-list">
        {items.map(({id, type, title, message}) => {
            const {icon, color, titleDef} = iconStyle[type]
            return (
                <Alert
                    key={id}
                    startDecorator={icon}
                    variant="soft"
                    color={color}
                    endDecorator={
                        <IconButton variant="soft" color={color}>
                            <CloseRoundedIcon/>
                        </IconButton>
                    }
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