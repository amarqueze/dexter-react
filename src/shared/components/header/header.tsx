import superBall from '../../../assets/super_Ball.png'
import { LogoutIcon, UserIcon } from '../icons/form-icons'
import './header.css'

type HeaderProps = {
  onLogout: () => void
  userName: string
}

export function Header({ onLogout, userName }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="app-header__brand">
        <img className="app-header__logo" src={superBall} alt="" />
        <span className="app-header__title">Dexter</span>
      </div>

      <div className="app-header__actions">
        <button
          className="app-header__icon-button app-header__user"
          type="button"
          aria-label={`Logged in as ${userName}`}
        >
          <UserIcon />
          <span className="app-header__tooltip" role="tooltip">
            {userName}
          </span>
        </button>

        <button
          className="app-header__icon-button"
          type="button"
          aria-label="Log out"
          onClick={onLogout}
        >
          <LogoutIcon />
        </button>
      </div>
    </header>
  )
}
