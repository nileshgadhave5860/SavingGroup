import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { TextInput, Button, Switch, Text, Provider as PaperProvider } from 'react-native-paper';

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isMemberLogin, setIsMemberLogin] = useState(true);
  const [savingGroupId, setSavingGroupId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const colorScheme = useColorScheme();

  const handleLogin = async () => {
    if (!phoneNumber || !password) {
      Alert.alert('Error', 'Please enter phone number and password');
      return;
    }

    if (isMemberLogin && !savingGroupId) {
      Alert.alert('Error', 'Please enter saving group ID');
      return;
    }

    setIsLoading(true);
    try {
      // Add your authentication logic here
      // For now, simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Navigate to main app
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Password reset functionality coming soon');
  };

  const handleSignUp = () => {
    Alert.alert('Sign Up', 'Registration functionality coming soon');
  };

  return (
    <PaperProvider>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            {/* Logo/Header Section */}
            <View style={styles.headerContainer}>
              <View style={styles.logoContainer}>
                <Text variant="displaySmall" style={styles.logoText}>BachatGat</Text>
                <Text variant="titleMedium" style={styles.logoSubtext}>Savings Group</Text>
              </View>
              <Text variant="headlineMedium" style={styles.welcomeText}>Welcome Back!</Text>
              <Text variant="bodyLarge" style={styles.subtitleText}>Login to your account</Text>
            </View>

            {/* Form Section */}
            <View style={styles.formContainer}>
              {/* Member Login Switch */}
              <View style={styles.switchContainer}>
                <Text variant="titleMedium" style={styles.switchLabel}>Member Login</Text>
                <Switch
                  value={isMemberLogin}
                  onValueChange={setIsMemberLogin}
                  color="#F57C00"
                />
              </View>

              {/* Saving Group ID Input - Conditional */}
              {isMemberLogin && (
                <TextInput
                  label="Saving Group ID"
                  value={savingGroupId}
                  onChangeText={setSavingGroupId}
                  mode="outlined"
                  style={styles.input}
                  outlineColor="#E0E0E0"
                  activeOutlineColor="#F57C00"
                  autoCapitalize="none"
                />
              )}

              {/* Phone Number Input */}
              <TextInput
                label="Phone Number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                mode="outlined"
                style={styles.input}
                outlineColor="#E0E0E0"
                activeOutlineColor="#F57C00"
                keyboardType="phone-pad"
                maxLength={10}
                autoCapitalize="none"
              />

              {/* Password Input */}
              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                style={styles.input}
                outlineColor="#E0E0E0"
                activeOutlineColor="#F57C00"
                secureTextEntry
                autoCapitalize="none"
                right={<TextInput.Icon icon="eye" />}
              />

              {/* Forgot Password */}
              <Button
                mode="text"
                onPress={handleForgotPassword}
                style={styles.forgotPasswordContainer}
                labelStyle={styles.forgotPasswordText}>
                Forgot Password?
              </Button>

              {/* Login Button */}
              <Button
                mode="contained"
                onPress={handleLogin}
                loading={isLoading}
                disabled={isLoading}
                style={styles.loginButton}
                buttonColor="#F57C00"
                contentStyle={styles.loginButtonContent}>
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text variant="bodyMedium" style={styles.dividerText}>OR</Text>
                <View style={styles.divider} />
              </View>

              {/* Sign Up Section */}
              <View style={styles.signupContainer}>
                <Text variant="bodyLarge" style={styles.signupText}>Don't have an account? </Text>
                <Button mode="text" onPress={handleSignUp} labelStyle={styles.signupLink}>
                  Sign Up
                </Button>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  headerContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },color: '#F57C00',
    fontWeight: 'bold',
  },
  logoSubtext: {
    color: '#FF9800',
    fontWeight: '500',
  },
  welcomeText: {
    color: '#333',
    marginBottom: 8,
  },
  subtitleText: {
    color: '#666',
  },
  formContainer: {
    flex: 1,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  switchLabel: {
    color: '#333',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  forgotPasswordText: {
    color: '#F57C00',
    fontSize: 14,
  },
  loginButton: {
    borderRadius: 8,
    marginBottom: 24,
    elevation: 4,
  },
  loginButtonContent: {
    paddingVertical: 8,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#999',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    color: '#666',
  },
  signupLink: {
    color: '#F57C00',
    fontSize: 15
    color: '#F57C00',
    fontWeight: 'bold',
  },
});
