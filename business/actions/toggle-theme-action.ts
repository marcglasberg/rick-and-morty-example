import { Action } from '../infra/action';

/**
 * Toggle between light and dark modes. Provide the current theme 
 * in the constructor, or it will use the one from the state.
 */
export class ToggleTheme extends Action {
  constructor({ currentTheme }: { currentTheme?: 'light' | 'dark' | null } = {}) {
    super();
    this.currentTheme = currentTheme;
  }

  currentTheme?: 'light' | 'dark' | null;

  reduce() {
    // If theme is provided in constructor, use it. Otherwise get from state.
    const currentTheme = this.currentTheme ?? this.state.colorScheme;

    // If current theme is null (system default), set to light, otherwise toggle.
    const newTheme = currentTheme === null ? 'light' : 
                     currentTheme === 'light' ? 'dark' : 'light';
    
    return this.state.withColorScheme(newTheme);
  }
}
