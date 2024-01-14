import {Container} from "@mui/joy";

export default function LoginLayout({children}) {
    return (
        <div className="page-default">
            <Container>
                {children}
            </Container>
        </div>
    )
}