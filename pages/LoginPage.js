import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from 'expo-secure-store';
import { API } from "../utils/API.js"; 
import axios from "axios";

export const LogIn = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Email validation function
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in both fields.");
            return;
        }

        if (!validateEmail(email)) {
            Alert.alert("Error", "Please enter a valid email address.");
            return;
        }

        if (password.length < 6) {
            Alert.alert("Error", "Password must be at least 6 characters long.");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                `${API}/user/auth/login`,
                {
                    username: email,
                    password,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'origin': 'https://matrix-media.vercel.app',
                        'User-Agent': 'PostmanRuntime/7.43.0',
                    },
                }
            );

            if (response.status === 200) {
                // SecureStore.setItemAsync()
                navigation.navigate("Home");
            } 
        } catch (error) {
            Alert.alert('error', error.response?.data?.message)
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <StatusBar style="dark" backgroundColor="#000000" />
            <View style={styles.loginContainer}>
                <Text style={styles.title}>Matrix Login</Text>

                {/* Email Field */}
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                {/* Password Field with Eye Icon */}
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Enter your password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                    />
                    <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        <Ionicons
                            name={showPassword ? "eye-off" : "eye"}
                            size={24}
                            color="#555"
                        />
                    </TouchableOpacity>
                </View>

                {/* Forgot Password Link */}
                <TouchableOpacity
                    onPress={() => Alert.alert("Info", "Forgot Password feature coming soon!")}
                >
                    <Text style={styles.forgotPassword}>Forgot Password?</Text>
                </TouchableOpacity>

                {/* Custom Login Button */}
                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Log In</Text>
                    )}
                </TouchableOpacity>

                {/* Create Account Button */}
                <TouchableOpacity
                    style={styles.createAccountButton}
                    onPress={() => navigation.navigate("Registration")}
                >
                    <Text style={styles.createAccountText}>Create Account</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
    },
    loginContainer: {
        width: "85%",
        padding: 25,
        backgroundColor: "#fff",
        borderRadius: 15,
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 30,
    },
    label: {
        width: "100%",
        fontSize: 16,
        color: "#555",
        marginBottom: 5,
    },
    input: {
        width: "100%",
        height: 45,
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 15,
        marginBottom: 15,
        backgroundColor: "#fafafa",
    },
    passwordContainer: {
        width: "100%",
        height: 45,
        flexDirection: "row",
        alignItems: "center",
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 15,
        backgroundColor: "#fafafa",
    },
    passwordInput: {
        flex: 1,
        height: "100%",
        paddingLeft: 15,
        color: "#333",
    },
    eyeIcon: {
        padding: 10,
    },
    forgotPassword: {
        color: "#007AFF",
        fontSize: 14,
        marginBottom: 20,
    },
    button: {
        width: "100%",
        height: 50,
        backgroundColor: "#007AFF",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonDisabled: {
        backgroundColor: "#aaa",
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
    createAccountButton: {
        width: "100%",
        height: 50,
        borderColor: "#007AFF",
        borderWidth: 1,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 15,
    },
    createAccountText: {
        color: "#007AFF",
        fontSize: 18,
        fontWeight: "600",
    },
});

export default LogIn;