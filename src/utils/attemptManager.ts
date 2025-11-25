const MAX_ATTEMPTS = 10;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000;

const ATTEMPTS_KEY = 'pin_attempts';
const LOCKOUT_TIMESTAMP_KEY = 'pin_lockout_timestamp';

class AttemptManager {
  private static instance: AttemptManager;

  public static getInstance(): AttemptManager {
    if (!AttemptManager.instance) {
      AttemptManager.instance = new AttemptManager();
    }
    return AttemptManager.instance;
  }

  private getAttempts(): number {
    const attempts = sessionStorage.getItem(ATTEMPTS_KEY);
    return attempts ? parseInt(attempts, 10) : 0;
  }

  private getLockoutTimestamp(): number | null {
    const timestamp = sessionStorage.getItem(LOCKOUT_TIMESTAMP_KEY);
    return timestamp ? parseInt(timestamp, 10) : null;
  }

  public recordFailedAttempt(): void {
    const attempts = this.getAttempts() + 1;
    sessionStorage.setItem(ATTEMPTS_KEY, attempts.toString());

    if (attempts >= MAX_ATTEMPTS) {
      sessionStorage.setItem(LOCKOUT_TIMESTAMP_KEY, Date.now().toString());
    }
  }

  public isLockedOut(): { locked: boolean; until?: Date } {
    const lockoutTimestamp = this.getLockoutTimestamp();
    const attempts = this.getAttempts();

    if (attempts < MAX_ATTEMPTS || !lockoutTimestamp) {
      return { locked: false };
    }

    const lockoutUntil = lockoutTimestamp + LOCKOUT_DURATION_MS;
    if (Date.now() < lockoutUntil) {
      return { locked: true, until: new Date(lockoutUntil) };
    }

    this.clearAttempts();
    return { locked: false };
  }

  public clearAttempts(): void {
    sessionStorage.removeItem(ATTEMPTS_KEY);
    sessionStorage.removeItem(LOCKOUT_TIMESTAMP_KEY);
  }
}

export default AttemptManager;
