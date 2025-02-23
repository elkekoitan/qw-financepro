import { Email } from '../Email';

describe('Email', () => {
  describe('create', () => {
    it('should create a valid email', () => {
      const result = Email.create('test@example.com');
      expect(result.isSuccess()).toBe(true);
      expect(result.getValue().getValue()).toBe('test@example.com');
    });

    it('should fail when email does not contain @', () => {
      const result = Email.create('invalid-email');
      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBe('Invalid email format');
    });

    it('should fail when email is empty', () => {
      const result = Email.create('');
      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBe('Invalid email format');
    });

    it('should create email with subdomains', () => {
      const result = Email.create('test@sub.example.com');
      expect(result.isSuccess()).toBe(true);
      expect(result.getValue().getValue()).toBe('test@sub.example.com');
    });

    it('should create email with plus addressing', () => {
      const result = Email.create('test+tag@example.com');
      expect(result.isSuccess()).toBe(true);
      expect(result.getValue().getValue()).toBe('test+tag@example.com');
    });
  });

  describe('getValue', () => {
    it('should return the email string', () => {
      const email = Email.create('test@example.com').getValue();
      expect(email.getValue()).toBe('test@example.com');
    });
  });
}); 