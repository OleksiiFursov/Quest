import {Container} from "@mui/joy";
import bg from './bg.jpg';
import './login.scss';

const bgStyle = {
    background: 'url(' + bg + ')'
}
export default function LoginLayout({children}) {
    return (
        <div className="page-login">
            <div className='page-login-bg' style={bgStyle}></div>
            <Container>
                {children}
            </Container>
        </div>
    )
}