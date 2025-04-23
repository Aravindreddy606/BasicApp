import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Keyboard,
    TouchableWithoutFeedback,
    ActivityIndicator,
    Animated,
    KeyboardAvoidingView,
    Platform,
    Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const LoginScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const fadeAnim = useState(new Animated.Value(0))[0];
    const moveAnim = useState(new Animated.Value(50))[0];

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(moveAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const validateName = (text) => {
        setName(text);
        if (error) setError('');
    };

    const handleLogin = () => {
        if (name.trim().length < 3) {
            setError('Name must be at least 3 characters');
            return;
        }

        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            navigation.navigate('MainTabs', { name: name.trim() });
        });
    };

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <TouchableWithoutFeedback onPress={dismissKeyboard}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.container}
                >
                    <View
                        style={[ styles.contentContainer]}
                    >
                        <View style={styles.logoContainer}>
                            <Image
                                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1077/1077012.png' }}
                                style={styles.logo}
                                resizeMode="contain"
                            />
                        </View>

                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={styles.subtitle}>Please enter your name to continue</Text>

                        <View style={styles.inputContainer}>
                            <TextInput
                                style={[styles.input, error ? styles.inputError : null]}
                                placeholder="e.g., John Smith"
                                value={name}
                                onChangeText={validateName}
                                maxLength={50}
                                autoCapitalize="words"
                                autoCorrect={false}
                                autoComplete="name"
                                placeholderTextColor="#999"
                            />
                            {error ? <Text style={styles.errorText}>{error}</Text> : null}
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.button,
                                name.trim().length < 3 ? styles.buttonDisabled : null
                            ]}
                            onPress={handleLogin}
                            disabled={name.trim().length < 3 || isLoading}
                            activeOpacity={0.7}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Continue</Text>
                            )}
                        </TouchableOpacity>

                        {/*<View style={styles.footer}>*/}
                        {/*    <Text style={styles.footerText}>*/}
                        {/*        Don't have an account?*/}
                        {/*    </Text>*/}
                        {/*    <TouchableOpacity onPress={() => navigation.navigate('Register')}>*/}
                        {/*        <Text style={styles.footerLink}>Sign up</Text>*/}
                        {/*    </TouchableOpacity>*/}
                        {/*</View>*/}
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    contentContainer: {
        paddingHorizontal: 24,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 15,
    },
    logo: {
        width: 80,
        height: 80,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 8,
        color: '#1F2937',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#6B7280',
    },
    inputContainer: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
        color: '#374151',
    },
    input: {
        height: 56,
        borderColor: '#D1D5DB',
        borderWidth: 1.5,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        backgroundColor: '#fff',
        color: '#1F2937',
    },
    inputError: {
        borderColor: '#EF4444',
    },
    errorText: {
        color: '#EF4444',
        fontSize: 14,
        marginTop: 8,
    },
    button: {
        height: 56,
        backgroundColor: '#4F46E5',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonDisabled: {
        backgroundColor: '#9CA3AF',
        shadowOpacity: 0,
        elevation: 0,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    footerText: {
        color: '#6B7280',
        fontSize: 14,
    },
    footerLink: {
        color: '#4F46E5',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 4,
    },
});

export default LoginScreen;