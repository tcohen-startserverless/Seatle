import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
} from '@react-email/components';
import * as React from 'react';

interface CodeEmailProps {
  code: string;
  userName?: string;
  expiryTime?: string;
}

export default function CodeEmail({
  code,
  userName = 'Student',
  expiryTime = '10 minutes',
}: CodeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your verification code for School App</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>Verification Code</Heading>
          <Section style={styles.codeContainer}>
            <Text style={styles.code}>{code}</Text>
          </Section>
          <Text style={styles.text}>Hello {userName},</Text>
          <Text style={styles.text}>
            Use the code above to complete your verification. This code will expire in{' '}
            {expiryTime}.
          </Text>
          <Text style={styles.text}>
            If you didn't request this code, please ignore this email.
          </Text>
          <Text style={styles.footer}>
            &copy; {new Date().getFullYear()} School App. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Define preview props for development
CodeEmail.PreviewProps = {
  code: '123456',
  userName: 'Test User',
  expiryTime: '10 minutes',
};

const styles = {
  body: {
    backgroundColor: '#f6f9fc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  container: {
    margin: '0 auto',
    padding: '20px 0',
    maxWidth: '580px',
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center' as const,
    margin: '30px 0',
    color: '#333',
  },
  codeContainer: {
    backgroundColor: '#ffffff',
    border: '1px solid #e6e6e6',
    borderRadius: '5px',
    margin: '20px 0',
    padding: '15px',
    textAlign: 'center' as const,
  },
  code: {
    fontSize: '32px',
    fontWeight: 'bold',
    letterSpacing: '4px',
    color: '#4f46e5',
  },
  text: {
    fontSize: '16px',
    lineHeight: '26px',
    color: '#333',
    marginBottom: '14px',
  },
  footer: {
    fontSize: '12px',
    color: '#8898aa',
    marginTop: '50px',
    textAlign: 'center' as const,
  },
};
