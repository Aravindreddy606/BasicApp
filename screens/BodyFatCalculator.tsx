import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Animated,
    Alert,
    Modal,
} from 'react-native';
import { Ionicons} from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type FormErrors = {
    age?: string;
    weight?: string;
    height?: string;
    neck?: string;
    waist?: string;
    hip?: string;
};

export default function BodyFatCalculator({ navigation }) {
    const [gender, setGender] = useState('male');
    const [age, setAge] = useState('');
    const [weight, setWeight] = useState(''); // in kg
    const [height, setHeight] = useState(''); // in cm
    const [neck, setNeck] = useState(''); // in cm
    const [waist, setWaist] = useState(''); // in cm
    const [hip, setHip] = useState(''); // in cm (for females)
    const [wrist, setWrist] = useState(''); // in cm (for Navy method)
    const [forearm, setForearm] = useState(''); // in cm (for Navy method)
    const [activityLevel, setActivityLevel] = useState('moderate');
    const [unit, setUnit] = useState('metric'); // metric or imperial

    const [history, setHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);

    const [advancedMode, setAdvancedMode] = useState(false);

    const [fadeAnim] = useState(new Animated.Value(0));

    const [errors, setErrors] = useState<FormErrors>({});

    const [infoModalVisible, setInfoModalVisible] = useState(false);
    const [infoContent, setInfoContent] = useState('');

    const [bodyFatNavy, setBodyFatNavy] = useState(null);
    const [bodyFatBMI, setBodyFatBMI] = useState(null);
    const [bodyFatJackson, setBodyFatJackson] = useState(null);
    const [category, setCategory] = useState('');
    const [bmr, setBmr] = useState(null);
    const [tdee, setTdee] = useState(null);

    // Initialize with some saved data if available
    useEffect(() => {
        // This would normally use AsyncStorage to load saved data
        // For this example, we'll just simulate a fade-in effect
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true
        }).start();
    }, []);


    const validateField = (name: string, value: string | undefined): string | null => {
        const numValue = parseFloat(value || '');

        switch (name) {
            case 'age':
                if (!value) return "Required";
                if (numValue < 18 || numValue > 100) return "Age must be between 18 and 100";
                break;

            case 'weight':
                if (!value) return "Required";
                if (numValue <= 0) return "Enter valid weight";
                break;

            case 'height':
                if (!value) return "Required";
                if (numValue <= 0) return "Enter valid height";
                break;

            case 'neck':
            case 'waist':
                if (!value) return "Required";
                break;

            case 'hip':
                if (gender === 'female' && !value) return "Required";
                break;
        }

        return null;
    };

    const validateForm = () => {
        const fields = { age, weight, height, neck, waist, hip };
        const newErrors: Record<string, string> = {};

        Object.entries(fields).forEach(([key, value]) => {
            const error = validateField(key, value);
            if (error) newErrors[key] = error;
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    // Unit conversion functions
    const convertToMetric = (value, type) => {
        if (!value) return '';
        const numValue = parseFloat(value);

        switch (type) {
            case 'weight': // pounds to kg
                return (numValue * 0.453592).toFixed(1);
            case 'height': // inches to cm
                return (numValue * 2.54).toFixed(1);
            case 'circumference': // inches to cm
                return (numValue * 2.54).toFixed(1);
            default:
                return value;
        }
    };

    const convertToImperial = (value, type) => {
        if (!value) return '';
        const numValue = parseFloat(value);

        switch (type) {
            case 'weight': // kg to pounds
                return (numValue / 0.453592).toFixed(1);
            case 'height': // cm to inches
                return (numValue / 2.54).toFixed(1);
            case 'circumference': // cm to inches
                return (numValue / 2.54).toFixed(1);
            default:
                return value;
        }
    };

    // Handle unit system change
    const toggleUnitSystem = () => {
        const newUnit = unit === 'metric' ? 'imperial' : 'metric';

        // Convert all measurements
        if (newUnit === 'imperial') {
            setWeight(weight ? convertToImperial(weight, 'weight') : '');
            setHeight(height ? convertToImperial(height, 'height') : '');
            setNeck(neck ? convertToImperial(neck, 'circumference') : '');
            setWaist(waist ? convertToImperial(waist, 'circumference') : '');
            setHip(hip ? convertToImperial(hip, 'circumference') : '');
            setWrist(wrist ? convertToImperial(wrist, 'circumference') : '');
            setForearm(forearm ? convertToImperial(forearm, 'circumference') : '');
        } else {
            setWeight(weight ? convertToMetric(weight, 'weight') : '');
            setHeight(height ? convertToMetric(height, 'height') : '');
            setNeck(neck ? convertToMetric(neck, 'circumference') : '');
            setWaist(waist ? convertToMetric(waist, 'circumference') : '');
            setHip(hip ? convertToMetric(hip, 'circumference') : '');
            setWrist(wrist ? convertToMetric(wrist, 'circumference') : '');
            setForearm(forearm ? convertToMetric(forearm, 'circumference') : '');
        }

        setUnit(newUnit);
    };

    // Function to calculate body fat percentage using Navy method
    const calculateNavyMethod = () => {
        if (!waist || !neck || (!hip && gender === 'female') || !height) {
            return null;
        }

        // Convert to metric if in imperial
        const h = unit === 'metric' ? parseFloat(height) : parseFloat(height) * 2.54;
        const w = unit === 'metric' ? parseFloat(waist) : parseFloat(waist) * 2.54;
        const n = unit === 'metric' ? parseFloat(neck) : parseFloat(neck) * 2.54;

        let bodyFat;

        if (gender === 'male') {
            bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450;
        } else {
            const hipValue = unit === 'metric' ? parseFloat(hip) : parseFloat(hip) * 2.54;
            if (!hipValue) return null;
            bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(w + hipValue - n) + 0.22100 * Math.log10(h)) - 450;
        }

        return Math.max(Math.min(bodyFat, 60), 2).toFixed(1);
    };

    // Function to calculate body fat percentage using BMI method
    const calculateBMIMethod = () => {
        if (!weight || !height || !age) {
            return null;
        }

        // Convert to metric if in imperial
        const w = unit === 'metric' ? parseFloat(weight) : parseFloat(weight) * 0.453592;
        const h = unit === 'metric' ? parseFloat(height) / 100 : parseFloat(height) * 2.54 / 100; // convert to meters
        const a = parseFloat(age);

        const bmi = w / (h * h);

        let bodyFat;
        if (gender === 'male') {
            bodyFat = (1.20 * bmi) + (0.23 * a) - 16.2;
        } else {
            bodyFat = (1.20 * bmi) + (0.23 * a) - 5.4;
        }

        return Math.max(Math.min(bodyFat, 60), 2).toFixed(1);
    };

    // Jackson-Pollock method (3-site)
    const calculateJacksonPollock = () => {
        if (!waist || !neck || (!hip && gender === 'female') || !age) {
            return null;
        }

        // This is a simplified version - in real app would use actual skinfold measurements
        const a = parseFloat(age);
        const w = unit === 'metric' ? parseFloat(waist) : parseFloat(waist) * 2.54;
        const n = unit === 'metric' ? parseFloat(neck) : parseFloat(neck) * 2.54;

        let density;

        if (gender === 'male') {
            // Using a simplified formula based on measurements
            density = 1.10938 - (0.0008267 * w) + (0.0000016 * Math.pow(w, 2)) - (0.0002574 * a);
        } else {
            const hipValue = unit === 'metric' ? parseFloat(hip) : parseFloat(hip) * 2.54;
            if (!hipValue) return null;
            density = 1.0994921 - (0.0009929 * w) + (0.0000023 * Math.pow(w, 2)) - (0.0001392 * a);
        }

        // Siri equation
        const bodyFat = (495 / density) - 450;

        return Math.max(Math.min(bodyFat, 60), 2).toFixed(1);
    };

    // Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
    const calculateBMR = () => {
        if (!weight || !height || !age) {
            return null;
        }

        // Convert to metric if in imperial
        const w = unit === 'metric' ? parseFloat(weight) : parseFloat(weight) * 0.453592; // kg
        const h = unit === 'metric' ? parseFloat(height) : parseFloat(height) * 2.54; // cm
        const a = parseFloat(age);

        let bmr;

        if (gender === 'male') {
            bmr = 10 * w + 6.25 * h - 5 * a + 5;
        } else {
            bmr = 10 * w + 6.25 * h - 5 * a - 161;
        }

        return Math.round(bmr);
    };

    // Calculate TDEE (Total Daily Energy Expenditure)
    const calculateTDEE = (bmr) => {
        if (!bmr) return null;

        const activityMultipliers = {
            sedentary: 1.2,      // Little or no exercise
            light: 1.375,        // Light exercise 1-3 days/week
            moderate: 1.55,      // Moderate exercise 3-5 days/week
            active: 1.725,       // Heavy exercise 6-7 days/week
            veryActive: 1.9      // Very heavy exercise, physical job or training twice daily
        };

        return Math.round(bmr * activityMultipliers[activityLevel]);
    };

    // Function to determine body fat category
    const getCategory = (bf) => {
        const bodyFat = parseFloat(bf);

        if (isNaN(bodyFat)) return '';

        if (gender === 'male') {
            if (bodyFat < 6) return 'Essential Fat';
            if (bodyFat < 14) return 'Athletic';
            if (bodyFat < 18) return 'Fitness';
            if (bodyFat < 25) return 'Average';
            return 'Obese';
        } else {
            if (bodyFat < 16) return 'Essential Fat';
            if (bodyFat < 21) return 'Athletic';
            if (bodyFat < 25) return 'Fitness';
            if (bodyFat < 32) return 'Average';
            return 'Obese';
        }
    };

    // Get color for category display
    const getCategoryColor = (category) => {
        switch (category) {
            case 'Essential Fat': return '#FFC107'; // Amber
            case 'Athletic': return '#4CAF50'; // Green
            case 'Fitness': return '#8BC34A'; // Light Green
            case 'Average': return '#FF9800'; // Orange
            case 'Obese': return '#F44336'; // Red
            default: return '#2196F3'; // Blue
        }
    };

    // Calculate results
    const calculateBodyFat = () => {
        if (!validateForm()) {
            Alert.alert("Missing Information", "Please fill in all required fields correctly.");
            return;
        }

        const navyResult = calculateNavyMethod();
        const bmiResult = calculateBMIMethod();
        const jacksonResult = calculateJacksonPollock();
        const bmrResult = calculateBMR();
        const tdeeResult = calculateTDEE(bmrResult);

        setBodyFatNavy(navyResult);
        setBodyFatBMI(bmiResult);
        setBodyFatJackson(jacksonResult);
        setBmr(bmrResult);
        setTdee(tdeeResult);

        // Use Navy method as primary if available, otherwise BMI
        const primaryResult = navyResult || bmiResult;
        const newCategory = getCategory(primaryResult);
        setCategory(newCategory);

        // Add to history
        const timestamp = new Date().toLocaleString();
        const newEntry = {
            id: timestamp,
            date: timestamp,
            bodyFat: primaryResult,
            category: newCategory,
            weight: weight,
            waist: waist,
            unit: unit
        };

        setHistory([newEntry, ...history.slice(0, 9)]); // Keep last 10 entries

        // Scroll to results
        // In a real app, would use a ref to scroll to results section
    };

    // Reset all form fields
    const resetForm = () => {
        setAge('');
        setWeight('');
        setHeight('');
        setNeck('');
        setWaist('');
        setHip('');
        setWrist('');
        setForearm('');
        setBodyFatNavy(null);
        setBodyFatBMI(null);
        setBodyFatJackson(null);
        setBmr(null);
        setTdee(null);
        setCategory('');
        setErrors({});
    };

    // Show info modal with context-specific content
    const showInfo = (topic) => {
        let content = '';

        switch (topic) {
            case 'navy':
                content = "The Navy Method uses neck, waist, and hip (for women) measurements to estimate body fat. It's generally accurate for most people but may be less accurate for very muscular individuals.";
                break;
            case 'bmi':
                content = "The BMI Method estimates body fat based on height, weight, age, and gender. It's less accurate than methods using body measurements, especially for athletes or muscular individuals.";
                break;
            case 'jackson':
                content = "The Jackson-Pollock method typically uses skinfold measurements. This implementation uses a simplified estimation based on available measurements.";
                break;
            case 'bmr':
                content = "Basal Metabolic Rate (BMR) is the number of calories your body needs to maintain basic functions at rest, like breathing and circulation.";
                break;
            case 'tdee':
                content = "Total Daily Energy Expenditure (TDEE) is the total calories you burn in a day, including your BMR plus activity.";
                break;
        }

        setInfoContent(content);
        setInfoModalVisible(true);
    };

    // Calculate recommended calorie intake
    const calculateCalorieGoals = () => {
        if (!tdee) return null;

        return {
            maintain: tdee,
            mildLoss: Math.round(tdee * 0.9), // 10% deficit
            moderateLoss: Math.round(tdee * 0.8), // 20% deficit
            gain: Math.round(tdee * 1.1) // 10% surplus
        };
    };

    const calorieGoals = calculateCalorieGoals();

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#f0f4f8', '#e6f0fa']}
                style={styles.gradient}
            >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={{ flex: 1 }}>
                    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                        <View style={styles.header}>
                            <View style={{ marginBottom:10 }}>
                            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                                <Ionicons name="arrow-back" size={22} color="#2c3e50" />
                            </TouchableOpacity>
                            <View style={styles.titleContainer}>
                                <Text style={styles.title}>BFP Calculator</Text>
                                <Text style={styles.subtitle}>Body Composition Calculator</Text>
                            </View>
                            </View>
                            <View style={styles.headerActions}>
                                <TouchableOpacity
                                    style={styles.unitToggle}
                                    onPress={toggleUnitSystem}
                                >
                                    <Text style={styles.unitToggleText}>
                                        {unit === 'metric' ? 'Switch to Imperial' : 'Switch to Metric'}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.historyButton}
                                    onPress={() => setShowHistory(!showHistory)}
                                >
                                    <Text style={styles.historyButtonText}>
                                        {showHistory ? 'Hide History' : 'Show History'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* History Display */}
                        {showHistory && history.length > 0 && (
                            <View style={styles.historyContainer}>
                                <Text style={styles.historyTitle}>Measurement History</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    {history.map((entry, index) => (
                                        <View key={entry.id} style={styles.historyCard}>
                                            <Text style={styles.historyDate}>{entry.date.split(',')[0]}</Text>
                                            <Text style={styles.historyValue}>{entry.bodyFat}%</Text>
                                            <Text style={[
                                                styles.historyCategory,
                                                { color: getCategoryColor(entry.category) }
                                            ]}>
                                                {entry.category}
                                            </Text>
                                            <Text style={styles.historyDetail}>
                                                Weight: {entry.weight} {entry.unit === 'metric' ? 'kg' : 'lbs'}
                                            </Text>
                                            <Text style={styles.historyDetail}>
                                                Waist: {entry.waist} {entry.unit === 'metric' ? 'cm' : 'in'}
                                            </Text>
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>
                        )}

                        {/* Gender Selection */}
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Basic Information</Text>

                            <View style={styles.genderContainer}>
                                <TouchableOpacity
                                    style={[styles.genderButton, gender === 'male' && styles.selectedGender]}
                                    onPress={() => setGender('male')}
                                >
                                    <Text style={[styles.genderText, gender === 'male' && styles.selectedGenderText]}>Male</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.genderButton, gender === 'female' && styles.selectedGender]}
                                    onPress={() => setGender('female')}
                                >
                                    <Text style={[styles.genderText, gender === 'female' && styles.selectedGenderText]}>Female</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Age */}
                            <View style={styles.inputRow}>
                                <Text style={styles.label}>Age (years):</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={[styles.input, errors.age && styles.inputError]}
                                        keyboardType="numeric"
                                        value={age}
                                        onChangeText={setAge}
                                        placeholder="Enter age"
                                    />
                                    {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}
                                </View>
                            </View>

                            {/* Weight */}
                            <View style={styles.inputRow}>
                                <Text style={styles.label}>Weight ({unit === 'metric' ? 'kg' : 'lbs'}):</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={[styles.input, errors.weight && styles.inputError]}
                                        keyboardType="numeric"
                                        value={weight}
                                        onChangeText={setWeight}
                                        placeholder={`Enter weight in ${unit === 'metric' ? 'kg' : 'lbs'}`}
                                    />
                                    {errors.weight && <Text style={styles.errorText}>{errors.weight}</Text>}
                                </View>
                            </View>

                            {/* Height */}
                            <View style={styles.inputRow}>
                                <Text style={styles.label}>Height ({unit === 'metric' ? 'cm' : 'in'}):</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={[styles.input, errors.height && styles.inputError]}
                                        keyboardType="numeric"
                                        value={height}
                                        onChangeText={setHeight}
                                        placeholder={`Enter height in ${unit === 'metric' ? 'cm' : 'inches'}`}
                                    />
                                    {errors.height && <Text style={styles.errorText}>{errors.height}</Text>}
                                </View>
                            </View>
                        </View>

                        {/* Body Measurements Section */}
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Body Measurements</Text>

                            {/* Neck */}
                            <View style={styles.inputRow}>
                                <Text style={styles.label}>Neck ({unit === 'metric' ? 'cm' : 'in'}):</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={[styles.input, errors.neck && styles.inputError]}
                                        keyboardType="numeric"
                                        value={neck}
                                        onChangeText={setNeck}
                                        placeholder={`Measure around neck`}
                                    />
                                    {errors.neck && <Text style={styles.errorText}>{errors.neck}</Text>}
                                </View>
                            </View>

                            {/* Waist */}
                            <View style={styles.inputRow}>
                                <Text style={styles.label}>Waist ({unit === 'metric' ? 'cm' : 'in'}):</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={[styles.input, errors.waist && styles.inputError]}
                                        keyboardType="numeric"
                                        value={waist}
                                        onChangeText={setWaist}
                                        placeholder="At navel level"
                                    />
                                    {errors.waist && <Text style={styles.errorText}>{errors.waist}</Text>}
                                </View>
                            </View>

                            {/* Hip (females only) */}
                            {gender === 'female' && (
                                <View style={styles.inputRow}>
                                    <Text style={styles.label}>Hip ({unit === 'metric' ? 'cm' : 'in'}):</Text>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            style={[styles.input, errors.hip && styles.inputError]}
                                            keyboardType="numeric"
                                            value={hip}
                                            onChangeText={setHip}
                                            placeholder="At widest point"
                                        />
                                        {errors.hip && <Text style={styles.errorText}>{errors.hip}</Text>}
                                    </View>
                                </View>
                            )}

                            {/* Advanced measurements toggle */}
                            <TouchableOpacity
                                style={styles.advancedToggle}
                                onPress={() => setAdvancedMode(!advancedMode)}
                            >
                                <Text style={styles.advancedToggleText}>
                                    {advancedMode ? 'Hide Advanced Measurements' : 'Show Advanced Measurements'}
                                </Text>
                            </TouchableOpacity>

                            {/* Advanced measurements */}
                            {advancedMode && (
                                <>
                                    <View style={styles.inputRow}>
                                        <Text style={styles.label}>Wrist ({unit === 'metric' ? 'cm' : 'in'}):</Text>
                                        <TextInput
                                            style={styles.input}
                                            keyboardType="numeric"
                                            value={wrist}
                                            onChangeText={setWrist}
                                            placeholder="Optional"
                                        />
                                    </View>

                                    <View style={styles.inputRow}>
                                        <Text style={styles.label}>Forearm ({unit === 'metric' ? 'cm' : 'in'}):</Text>
                                        <TextInput
                                            style={styles.input}
                                            keyboardType="numeric"
                                            value={forearm}
                                            onChangeText={setForearm}
                                            placeholder="Optional"
                                        />
                                    </View>
                                </>
                            )}
                        </View>

                        {/* Activity Level */}
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Activity Level</Text>

                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {['sedentary', 'light', 'moderate', 'active', 'veryActive'].map((level) => (
                                    <TouchableOpacity
                                        key={level}
                                        style={[styles.activityButton, activityLevel === level && styles.selectedActivity]}
                                        onPress={() => setActivityLevel(level)}
                                    >
                                        <Text
                                            style={[styles.activityText, activityLevel === level && styles.selectedActivityText]}
                                        >
                                            {level.charAt(0).toUpperCase() + level.slice(1).replace(/([A-Z])/g, ' $1')}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            <Text style={styles.activityDescription}>
                                {activityLevel === 'sedentary' && "Little or no exercise, desk job"}
                                {activityLevel === 'light' && "Light exercise 1-3 days/week"}
                                {activityLevel === 'moderate' && "Moderate exercise 3-5 days/week"}
                                {activityLevel === 'active' && "Heavy exercise 6-7 days/week"}
                                {activityLevel === 'veryActive' && "Very heavy exercise, physical job or twice daily training"}
                            </Text>
                        </View>

                        {/* Buttons */}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.calculateButton}
                                onPress={calculateBodyFat}
                            >
                                <Text style={styles.buttonText}>Calculate</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.resetButton}
                                onPress={resetForm}
                            >
                                <Text style={styles.buttonText}>Reset</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Results */}
                        {(bodyFatNavy || bodyFatBMI) && (
                            <View style={styles.resultsContainer}>
                                <Text style={styles.resultsTitle}>Results</Text>

                                <View style={styles.resultsSummary}>
                                    <View style={styles.resultsFatPercentage}>
                                        <Text style={styles.resultsMainValue}>
                                            {bodyFatNavy || bodyFatBMI}%
                                        </Text>
                                        <Text style={styles.resultsMainLabel}>Body Fat</Text>
                                    </View>

                                    <View style={[
                                        styles.resultsCategoryBadge,
                                        { backgroundColor: getCategoryColor(category) }
                                    ]}>
                                        <Text style={styles.resultsCategoryText}>{category}</Text>
                                    </View>
                                </View>

                                <View style={styles.resultsDetailContainer}>
                                    <Text style={styles.resultsSubtitle}>Body Fat Estimates</Text>

                                    <View style={styles.resultItem}>
                                        <View style={styles.resultLabelContainer}>
                                            <Text style={styles.resultLabel}>Navy Method:</Text>
                                            <TouchableOpacity onPress={() => showInfo('navy')}>
                                                <Text style={styles.infoButton}>ⓘ</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <Text style={styles.resultValue}>
                                            {bodyFatNavy ? `${bodyFatNavy}%` : 'N/A'}
                                        </Text>
                                    </View>

                                    <View style={styles.resultItem}>
                                        <View style={styles.resultLabelContainer}>
                                            <Text style={styles.resultLabel}>BMI Method:</Text>
                                            <TouchableOpacity onPress={() => showInfo('bmi')}>
                                                <Text style={styles.infoButton}>ⓘ</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <Text style={styles.resultValue}>
                                            {bodyFatBMI ? `${bodyFatBMI}%` : 'N/A'}
                                        </Text>
                                    </View>

                                    <View style={styles.resultItem}>
                                        <View style={styles.resultLabelContainer}>
                                            <Text style={styles.resultLabel}>Jackson-Pollock:</Text>
                                            <TouchableOpacity onPress={() => showInfo('jackson')}>
                                                <Text style={styles.infoButton}>ⓘ</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={styles.resultValue}>
                                        {bodyFatJackson ? `${bodyFatJackson}%` : 'N/A'}
                                    </Text>
                                </View>
                            </View>

                                {/* Metabolism Results */}
                        {(bmr && tdee) && (
                            <View style={styles.resultsDetailContainer}>
                                <Text style={styles.resultsSubtitle}>Metabolism & Calorie Needs</Text>

                                <View style={styles.resultItem}>
                                    <View style={styles.resultLabelContainer}>
                                        <Text style={styles.resultLabel}>BMR:</Text>
                                        <TouchableOpacity onPress={() => showInfo('bmr')}>
                                            <Text style={styles.infoButton}>ⓘ</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={styles.resultValue}>{bmr} calories/day</Text>
                                </View>

                                <View style={styles.resultItem}>
                                    <View style={styles.resultLabelContainer}>
                                        <Text style={styles.resultLabel}>TDEE:</Text>
                                        <TouchableOpacity onPress={() => showInfo('tdee')}>
                                            <Text style={styles.infoButton}>ⓘ</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={styles.resultValue}>{tdee} calories/day</Text>
                                </View>
                            </View>
                        )}

                        {/* Calorie Goals */}
                        {calorieGoals && (
                            <View style={styles.resultsDetailContainer}>
                                <Text style={styles.resultsSubtitle}>Daily Calorie Goals</Text>

                                <View style={styles.calorieGoalsContainer}>
                                    <View style={styles.calorieGoalCard}>
                                        <Text style={styles.calorieGoalLabel}>Weight Loss</Text>
                                        <Text style={styles.calorieGoalValue}>{calorieGoals.moderateLoss}</Text>
                                        <Text style={styles.calorieGoalUnit}>calories/day</Text>
                                    </View>

                                    <View style={[styles.calorieGoalCard, styles.calorieGoalCardHighlight]}>
                                        <Text style={styles.calorieGoalLabel}>Maintenance</Text>
                                        <Text style={styles.calorieGoalValue}>{calorieGoals.maintain}</Text>
                                        <Text style={styles.calorieGoalUnit}>calories/day</Text>
                                    </View>

                                    <View style={styles.calorieGoalCard}>
                                        <Text style={styles.calorieGoalLabel}>Weight Gain</Text>
                                        <Text style={styles.calorieGoalValue}>{calorieGoals.gain}</Text>
                                        <Text style={styles.calorieGoalUnit}>calories/day</Text>
                                    </View>
                                </View>
                            </View>
                        )}

                        {/* Body Composition */}
                        {bodyFatNavy && weight && (
                            <View style={styles.resultsDetailContainer}>
                                <Text style={styles.resultsSubtitle}>Body Composition</Text>

                                <View style={styles.bodyCompContainer}>
                                    <View style={styles.bodyCompItem}>
                                        <View style={styles.bodyCompBar}>
                                            <View
                                                style={[
                                                    styles.bodyCompFatBar,
                                                    { width: `${Math.min(parseFloat(bodyFatNavy), 40)}%` }
                                                ]}
                                            />
                                        </View>
                                        <View style={styles.bodyCompLabels}>
                                            <Text style={styles.bodyCompLabel}>Fat Mass</Text>
                                            <Text style={styles.bodyCompValue}>
                                                {(parseFloat(weight) * parseFloat(bodyFatNavy) / 100).toFixed(1)}
                                                {unit === 'metric' ? ' kg' : ' lbs'}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.bodyCompItem}>
                                        <View style={styles.bodyCompBar}>
                                            <View
                                                style={[
                                                    styles.bodyCompLeanBar,
                                                    { width: `${Math.min(100 - parseFloat(bodyFatNavy), 90)}%` }
                                                ]}
                                            />
                                        </View>
                                        <View style={styles.bodyCompLabels}>
                                            <Text style={styles.bodyCompLabel}>Lean Mass</Text>
                                            <Text style={styles.bodyCompValue}>
                                                {(parseFloat(weight) * (100 - parseFloat(bodyFatNavy)) / 100).toFixed(1)}
                                                {unit === 'metric' ? ' kg' : ' lbs'}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}

                        <Text style={styles.disclaimer}>
                            Note: These calculations provide estimates only and may vary by individual.
                            For accurate measurements, consult a healthcare professional.
                        </Text>

                        {/*<View style={styles.shareContainer}>*/}
                        {/*    <TouchableOpacity style={styles.shareButton}>*/}
                        {/*        <Text style={styles.shareButtonText}>Save Results</Text>*/}
                        {/*    </TouchableOpacity>*/}
                        {/*    <TouchableOpacity style={styles.shareButton}>*/}
                        {/*        <Text style={styles.shareButtonText}>Export Data</Text>*/}
                        {/*    </TouchableOpacity>*/}
                        {/*</View>*/}
                    </View>
                        )}

                    {/* Info Modal */}
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={infoModalVisible}
                        onRequestClose={() => setInfoModalVisible(false)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Information</Text>
                                <Text style={styles.modalText}>{infoContent}</Text>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={() => setInfoModalVisible(false)}
                                >
                                    <Text style={styles.modalButtonText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </ScrollView>
            </View>
                </KeyboardAvoidingView>
            </LinearGradient>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    keyboardView: {
        flex: 1,
    },
    scrollContainer: {
        padding: 16,
    },
    header: {
        marginBottom: 20,
    },
  
    headerActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    unitToggle: {
        backgroundColor: '#e0e0e0',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    unitToggleText: {
        color: '#333',
        fontWeight: '500',
        fontSize: 14,
    },
    historyButton: {
        backgroundColor: '#e0e0e0',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    historyButtonText: {
        color: '#333',
        fontWeight: '500',
        fontSize: 14,
    },
    historyContainer: {
        marginBottom: 20,
    },
    historyTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
        color: '#2c3e50',
    },
    historyCard: {
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 8,
        marginRight: 12,
        width: 150,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    historyDate: {
        fontSize: 14,
        color: '#7f8c8d',
        marginBottom: 5,
    },
    historyValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    historyCategory: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
    },
    historyDetail: {
        fontSize: 14,
        color: '#7f8c8d',
    },
    sectionContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        color: '#2c3e50',
        borderBottomWidth: 1,
        borderBottomColor: '#ecf0f1',
        paddingBottom: 8,
    },
    genderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    genderButton: {
        flex: 1,
        paddingVertical: 14,
        marginHorizontal: 5,
        borderRadius: 8,
        backgroundColor: '#ecf0f1',
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedGender: {
        backgroundColor: '#3498db',
    },
    genderText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#7f8c8d',
    },
    selectedGenderText: {
        color: 'white',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        justifyContent: 'space-between',
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        flex: 1,
        color: '#34495e',
    },
    inputContainer: {
        flex: 1,
    },
    input: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#f9f9f9',
        fontSize: 16,
        color: '#2c3e50',
    },
    inputError: {
        borderColor: '#e74c3c',
    },
    errorText: {
        color: '#e74c3c',
        fontSize: 12,
        marginTop: 4,
    },
    advancedToggle: {
        backgroundColor: '#ecf0f1',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 15,
    },
    advancedToggleText: {
        color: '#2c3e50',
        fontWeight: '500',
    },
    activityButton: {
        backgroundColor: '#ecf0f1',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginRight: 10,
        minWidth: 100,
        alignItems: 'center',
    },
    selectedActivity: {
        backgroundColor: '#3498db',
    },
    activityText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#7f8c8d',
    },
    selectedActivityText: {
        color: 'white',
    },
    activityDescription: {
        marginTop: 10,
        fontSize: 14,
        color: '#7f8c8d',
        fontStyle: 'italic',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 20,
    },
    calculateButton: {
        flex: 2,
        backgroundColor: '#3498db',
        paddingVertical: 16,
        borderRadius: 8,
        marginRight: 5,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    resetButton: {
        flex: 1,
        backgroundColor: '#e74c3c',
        paddingVertical: 16,
        borderRadius: 8,
        marginLeft: 5,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    resultsContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    resultsTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#2c3e50',
        textAlign: 'center',
    },
    resultsSummary: {
        alignItems: 'center',
        marginBottom: 20,
    },
    resultsFatPercentage: {
        alignItems: 'center',
        marginBottom: 10,
    },
    resultsMainValue: {
        fontSize: 42,
        fontWeight: 'bold',
        color: '#3498db',
    },
    resultsMainLabel: {
        fontSize: 16,
        color: '#7f8c8d',
    },
    resultsCategoryBadge: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginTop: 8,
    },
    resultsCategoryText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    resultsDetailContainer: {
        marginBottom: 24,
        borderTopWidth: 1,
        borderTopColor: '#ecf0f1',
        paddingTop: 16,
    },
    resultsSubtitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        color: '#34495e',
    },
    resultItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ecf0f1',
    },
    resultLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    resultLabel: {
        fontSize: 16,
        color: '#7f8c8d',
    },
    infoButton: {
        fontSize: 16,
        color: '#3498db',
        marginLeft: 6,
    },
    resultValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    calorieGoalsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    calorieGoalCard: {
        flex: 1,
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#f8f9fa',
        alignItems: 'center',
        margin: 4,
    },
    calorieGoalCardHighlight: {
        backgroundColor: '#e3f2fd',
        borderWidth: 1,
        borderColor: '#bbdefb',
    },
    calorieGoalLabel: {
        fontSize: 12,
        color: '#7f8c8d',
        marginBottom: 4,
    },
    calorieGoalValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    calorieGoalUnit: {
        fontSize: 12,
        color: '#7f8c8d',
    },
    bodyCompContainer: {
        marginTop: 8,
    },
    bodyCompItem: {
        marginBottom: 16,
    },
    bodyCompBar: {
        height: 24,
        backgroundColor: '#ecf0f1',
        borderRadius: 12,
        overflow: 'hidden',
    },
    bodyCompFatBar: {
        height: '100%',
        backgroundColor: '#e74c3c',
        borderRadius: 12,
    },
    bodyCompLeanBar: {
        height: '100%',
        backgroundColor: '#2ecc71',
        borderRadius: 12,
    },
    bodyCompLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    bodyCompLabel: {
        fontSize: 14,
        color: '#7f8c8d',
    },
    bodyCompValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    comparisonContainer: {
        marginTop: 8,
    },
    comparisonBar: {
        height: 30,
        backgroundColor: '#ecf0f1',
        borderRadius: 15,
        position: 'relative',
        marginBottom: 24,
    },
    comparisonMarker: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        borderRadius: 15,
        overflow: 'hidden',
    },
    comparisonPointer: {
        position: 'absolute',
        top: -6,
        width: 12,
        height: 12,
        backgroundColor: '#3498db',
        borderRadius: 6,
        marginLeft: -6,
        borderWidth: 2,
        borderColor: 'white',
    },
    comparisonLabels: {
        position: 'absolute',
        top: 32,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    comparisonLabel: {
        fontSize: 12,
        color: '#7f8c8d',
        width: '20%',
        textAlign: 'center',
    },
    disclaimer: {
        fontSize: 12,
        color: '#95a5a6',
        marginTop: 16,
        fontStyle: 'italic',
        textAlign: 'center',
    },
    shareContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    shareButton: {
        backgroundColor: '#3498db',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    shareButtonText: {
        color: 'white',
        fontWeight: '500',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#2c3e50',
    },
    modalText: {
        fontSize: 16,
        color: '#34495e',
        marginBottom: 16,
        lineHeight: 22,
    },
    modalButton: {
        backgroundColor: '#3498db',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    modalButtonText: {
        color: 'white',
        fontWeight: '500',
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#7f8c8d',
        marginTop: 4,
    },
    backButton: {
        position: 'absolute',
        left: 5,
        top: 3,
        zIndex: 10,
        backgroundColor: '#E0E0E0',
        padding: 8,
        borderRadius: 50,
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    gradient: {
        flex: 1,
    },
});