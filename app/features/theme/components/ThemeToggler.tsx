import { DarkModeSwitch } from 'react-toggle-dark-mode';
import { Theme } from '../config';
import { component } from '~/utils/component';
import { useTheme } from '../contexts/Theme.context';

export const ThemeToggler = component('ThemeToggler', function ({ className }) {
    const [theme, toggleTheme] = useTheme();

    return (
        <DarkModeSwitch
            className={this.mcn(className)}
            checked={theme === Theme.DARK}
            onChange={toggleTheme}
            size={32}
        />
    );
});
