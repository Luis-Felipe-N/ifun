import '../style/component/footer.scss'
import { FaGithubAlt, FaLinkedin } from 'react-icons/fa'

export default function Footer() {
    return (
        <footer>
            <p>Criado por Luis Felipe Nunes</p>
            <div className="links">
                <ul>
                    <li>
                        <a target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/luis-felipe-nunes-de-carvalho-02055b207/">
                            <FaLinkedin size="1.5rem"/>
                        </a>
                        <a target="_blank" rel="noreferrer" href="https://github.com/Luis-Felipe-N">
                            <FaGithubAlt size="1.5rem"/>
                        </a>
                    </li>
                </ul>
            </div>
        </footer>
    )
}
