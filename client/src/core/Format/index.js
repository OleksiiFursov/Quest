import dayjs from 'dayjs'
import { userConfig } from '../../init.jsx'

export function theDate(date=dayjs()){
	if(!(date instanceof dayjs)){
		date = dayjs(date)
	}
	return date.format(userConfig.dateFormat || 'YYYY-MM-DD');
}
