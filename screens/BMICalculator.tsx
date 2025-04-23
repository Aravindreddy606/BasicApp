import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Switch,
    Animated,
    Dimensions,
    Image,
    Vibration
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const BMICalculator = ({ navigation }) => {
    const [height, setHeight] = useState('');
    const [feet, setFeet] = useState('');
    const [inches, setInches] = useState('');
    const [weight, setWeight] = useState('');
    const [bmi, setBMI] = useState(null);
    const [category, setCategory] = useState('');
    const [useCentimeters, setUseCentimeters] = useState(true);
    const [useKilograms, setUseKilograms] = useState(true);
    const [pound, setPound] = useState('');
    const [showBMIExplanation, setShowBMIExplanation] = useState(false);
    const [bmiHistory, setBmiHistory] = useState([]);
    const [validationError, setValidationError] = useState('');
    
    // Animation values
    const [animatedValue] = useState(new Animated.Value(0));
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const fadeInAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Entrance animation for the screen
        Animated.timing(fadeInAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();

       
    }, []);

    // Pulse animation for the calculate button
    useEffect(() => {
        const pulseTiming = () => {
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.07,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                })
            ]).start(pulseTiming);
        };
        pulseTiming();
    }, []);

    const slideUp = () => {
        Animated.spring(animatedValue, {
            toValue: 1,
            friction: 8,
            tension: 40,
            useNativeDriver: true
        }).start();
    };

    const validateInputs = () => {
        if (useCentimeters && !height) {
            setValidationError('Please enter your height');
            return false;
        }
        
        if (!useCentimeters && !feet) {
            setValidationError('Please enter your height in feet');
            return false;
        }
        
        if (useKilograms && !weight) {
            setValidationError('Please enter your weight');
            return false;
        }
        
        if (!useKilograms && !pound) {
            setValidationError('Please enter your weight in pounds');
            return false;
        }
        
        setValidationError('');
        return true;
    };

    const calculateBMI = () => {
        if (!validateInputs()) return;
        
        // Provide haptic feedback
        if (Platform.OS === 'ios') {
           // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } else {
            Vibration.vibrate(50);
        }

        let heightInMeters;
        let weightInKg;

        // Calculate height in meters
        if (useCentimeters) {
            heightInMeters = parseFloat(height) / 100;
        } else {
            // Convert feet and inches to meters
            const inchesTotal = (parseFloat(feet) * 12) + (parseFloat(inches) || 0);
            heightInMeters = inchesTotal * 0.0254;
        }

        // Calculate weight in kg
        if (useKilograms) {
            weightInKg = parseFloat(weight);
        } else {
            weightInKg = parseFloat(pound) * 0.45359237;
        }

        if (!heightInMeters || !weightInKg) return;

        // Calculate BMI
        const calculatedBMI = weightInKg / (heightInMeters * heightInMeters);
        const roundedBMI = calculatedBMI.toFixed(1);

        let bmiCategory = '';
        if (calculatedBMI < 18.5) bmiCategory = 'Underweight';
        else if (calculatedBMI < 24.9) bmiCategory = 'Normal weight';
        else if (calculatedBMI < 29.9) bmiCategory = 'Overweight';
        else bmiCategory = 'Obese';

        setBMI(roundedBMI);
        setCategory(bmiCategory);
        
        // Add to history
        const today = new Date().toISOString().split('T')[0];
        setBmiHistory([
            { date: today, bmi: roundedBMI, category: bmiCategory },
            ...bmiHistory.slice(0, 4) // Keep only the 5 most recent entries
        ]);
        
        slideUp();
    };

    const getResultGradient = () => {
        if (!bmi) return ['#95a5a6', '#7f8c8d'] as const;

        const bmiValue = parseFloat(bmi);
        if (bmiValue < 18.5) return ['#3498db', '#2980b9'] as const; // Blue
        if (bmiValue < 24.9) return ['#2ecc71', '#27ae60'] as const; // Green
        if (bmiValue < 29.9) return ['#f39c12', '#d35400'] as const; // Orange
        return ['#e74c3c', '#c0392b'] as const; // Red
    };

    const getHealthTip = () => {
        if (!bmi) return '';

        const bmiValue = parseFloat(bmi);
        if (bmiValue < 18.5) return 'Consider consulting with a nutritionist about healthy weight gain strategies. Focus on nutrient-dense foods and strength training.';
        if (bmiValue < 24.9) return 'Great job! Maintain your healthy lifestyle with regular exercise and balanced diet. Stay hydrated and get regular health check-ups.';
        if (bmiValue < 29.9) return 'Consider increasing physical activity and making dietary adjustments to reach a healthier weight. Small changes can make a big difference.';
        return 'Please consult with a healthcare provider about a weight management plan. Prioritize sustainable lifestyle changes over quick fixes.';
    };

    const getBmiScale = () => {
        if (!bmi) return 50; // Default position
        const bmiValue = parseFloat(bmi);
        
        // Calculate position on scale (from 0 to 100)
        if (bmiValue < 15) return 0;
        if (bmiValue > 35) return 100;
        
        // Position based on BMI value between 15 and 35
        return ((bmiValue - 15) / 20) * 100;
    };

    const toggleHeightUnit = () => {
        setUseCentimeters(!useCentimeters);
        setHeight('');
        setFeet('');
        setInches('');
    };
    
    const toggleWeightUnit = () => {
        setUseKilograms(!useKilograms);
        setWeight('');
        setPound('');
    };

    const resetForm = () => {
     
        
        setHeight('');
        setFeet('');
        setInches('');
        setWeight('');
        setPound('');
        setBMI(null);
        setCategory('');
        setValidationError('');
        animatedValue.setValue(0);
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#f0f4f8', '#e6f0fa']}
                style={styles.gradient}
            >
                <View style={[styles.contentContainer]}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.keyboardAvoidingView}
                    >
                        <ScrollView
                            contentContainerStyle={styles.scrollContainer}
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={styles.header}>
                                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                                    <Ionicons name="arrow-back" size={22} color="#2c3e50" />
                                </TouchableOpacity>
                                <View style={styles.titleContainer}>
                                    <Text style={styles.title}>BMI Calculator</Text>
                                    <Text style={styles.subtitle}>Track your body mass index</Text>
                                </View>
                                <TouchableOpacity 
                                    style={styles.infoButton} 
                                    onPress={() => setShowBMIExplanation(!showBMIExplanation)}
                                >
                                    <Ionicons name="information-circle-outline" size={24} color="#3498db" />
                                </TouchableOpacity>
                            </View>

                            {showBMIExplanation && (
                                <View style={styles.explanationCard}>
                                    <Text style={styles.explanationTitle}>What is BMI?</Text>
                                    <Text style={styles.explanationText}>
                                        Body Mass Index (BMI) is a measure of body fat based on height and weight. 
                                        It's used to screen for weight categories that may lead to health problems, 
                                        but doesn't diagnose body fatness or health.
                                    </Text>
                                    <View style={styles.bmiRanges}>
                                        <View style={styles.bmiRange}>
                                            <View style={[styles.colorIndicator, {backgroundColor: '#3498db'}]} />
                                            <Text style={styles.bmiRangeText}>Under 18.5: Underweight</Text>
                                        </View>
                                        <View style={styles.bmiRange}>
                                            <View style={[styles.colorIndicator, {backgroundColor: '#2ecc71'}]} />
                                            <Text style={styles.bmiRangeText}>18.5 - 24.9: Normal weight</Text>
                                        </View>
                                        <View style={styles.bmiRange}>
                                            <View style={[styles.colorIndicator, {backgroundColor: '#f39c12'}]} />
                                            <Text style={styles.bmiRangeText}>25 - 29.9: Overweight</Text>
                                        </View>
                                        <View style={styles.bmiRange}>
                                            <View style={[styles.colorIndicator, {backgroundColor: '#e74c3c'}]} />
                                            <Text style={styles.bmiRangeText}>30 and above: Obese</Text>
                                        </View>
                                    </View>
                                </View>
                            )}

                            <View style={styles.card}>
                                <View style={styles.toggleSection}>
                                    <Text style={styles.toggleLabel}>Height:</Text>
                                    <View style={styles.toggleContainer}>
                                        <Text style={[styles.toggleText, !useCentimeters && styles.activeToggleText]}>
                                            ft/in
                                        </Text>
                                        <Switch
                                            value={useCentimeters}
                                            onValueChange={toggleHeightUnit}
                                            trackColor={{ false: '#3498db', true: '#3498db' }}
                                            thumbColor="#ffffff"
                                        />
                                        <Text style={[styles.toggleText, useCentimeters && styles.activeToggleText]}>
                                            cm
                                        </Text>
                                    </View>
                                </View>

                                <Text style={styles.sectionTitle}>Height</Text>
                                {useCentimeters ? (
                                    <View style={styles.inputWrapper}>
                                        <MaterialCommunityIcons name="human-male-height" size={20} color="#95a5a6" />
                                        <TextInput
                                            style={styles.input}
                                            keyboardType="numeric"
                                            placeholder="Height in cm"
                                            value={height}
                                            maxLength={5}
                                            onChangeText={setHeight}
                                            placeholderTextColor="#95a5a6"
                                        />
                                        <Text style={styles.unitText}>cm</Text>
                                    </View>
                                ) : (
                                    <View style={styles.rowInputs}>
                                        <View style={[styles.inputWrapper, { flex: 1, marginRight: 10 }]}>
                                            <MaterialCommunityIcons name="human-male-height" size={20} color="#95a5a6" />
                                            <TextInput
                                                style={styles.input}
                                                keyboardType="numeric"
                                                placeholder="Feet"
                                                value={feet}
                                                maxLength={5}
                                                onChangeText={setFeet}
                                                placeholderTextColor="#95a5a6"
                                            />
                                            <Text style={styles.unitText}>ft</Text>
                                        </View>
                                        <View style={[styles.inputWrapper, { flex: 1 }]}>
                                            <TextInput
                                                    style={styles.input}
                                                    keyboardType="decimal-pad"
                                                placeholder="Inches"
                                                value={inches}
                                                maxLength={5}
                                                onChangeText={setInches}
                                                placeholderTextColor="#95a5a6"
                                            />
                                            <Text style={styles.unitText}>in</Text>
                                        </View>
                                    </View>
                                )}

                                <View style={styles.toggleSection}>
                                    <Text style={styles.toggleLabel}>Weight:</Text>
                                    <View style={styles.toggleContainer}>
                                        <Text style={[styles.toggleText, !useKilograms && styles.activeToggleText]}>
                                            lb
                                        </Text>
                                        <Switch
                                            value={useKilograms}
                                            onValueChange={toggleWeightUnit}
                                            trackColor={{ false: '#3498db', true: '#3498db' }}
                                            thumbColor="#ffffff"
                                        />
                                        <Text style={[styles.toggleText, useKilograms && styles.activeToggleText]}>
                                            kg
                                        </Text>
                                    </View>
                                </View>

                                <Text style={styles.sectionTitle}>Weight</Text>
                                {useKilograms ? (
                                    <View style={styles.inputWrapper}>
                                        <FontAwesome5 name="weight" size={18} color="#95a5a6" />
                                        <TextInput
                                            style={styles.input}
                                            keyboardType="numeric"
                                            placeholder="Weight in kg"
                                            value={weight}
                                            maxLength={5}
                                            onChangeText={setWeight}
                                            placeholderTextColor="#95a5a6"
                                        />
                                        <Text style={styles.unitText}>kg</Text>
                                    </View>
                                ) : (
                                    <View style={styles.inputWrapper}>
                                        <FontAwesome5 name="weight" size={18} color="#95a5a6" />
                                        <TextInput
                                            style={styles.input}
                                            keyboardType="numeric"
                                            placeholder="Weight in pounds"
                                            value={pound}
                                            maxLength={5}
                                            onChangeText={setPound}
                                            placeholderTextColor="#95a5a6"
                                        />
                                        <Text style={styles.unitText}>lb</Text>
                                    </View>
                                )}

                                {validationError ? (
                                    <Text style={styles.errorText}>{validationError}</Text>
                                ) : null}

                                <View style={styles.buttonGroup}>
                                    <TouchableOpacity
                                        style={[styles.button, styles.resetButton]}
                                        onPress={resetForm}
                                    >
                                        <Ionicons name="refresh-outline" size={20} color="#7f8c8d" style={{marginRight: 8}} />
                                        <Text style={styles.resetButtonText}>Reset</Text>
                                    </TouchableOpacity>
                                    <View style={{
                                        flex: 2,
                                        // transform: [{ scale: pulseAnim }]
                                    }}>
                                        <TouchableOpacity
                                            style={[styles.button, styles.calculateButton]}
                                            onPress={calculateBMI}
                                        >
                                            <Text style={styles.calculateButtonText}>Calculate BMI</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                            {bmi && (
                                <Animated.View
                                    style={[
                                        styles.resultCard,
                                        {
                                            transform: [
                                                {
                                                    translateY: animatedValue.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [50, 0]
                                                    })
                                                }
                                            ],
                                            opacity: animatedValue
                                        }
                                    ]}
                                >
                                    <LinearGradient
                                        colors={getResultGradient()}
                                        style={styles.resultGradient}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                    >
                                        <Text style={styles.resultTitle}>Your BMI Result</Text>
                                        <Text style={styles.bmiValue}>{bmi}</Text>
                                        <Text style={styles.bmiCategory}>{category}</Text>
                                        
                                        {/* BMI Scale */}
                                        <View style={styles.bmiScaleContainer}>
                                            <View style={styles.bmiScale}>
                                                <View style={styles.bmiScaleColors}>
                                                    <View style={[styles.bmiScaleColor, {backgroundColor: '#3498db'}]} />
                                                    <View style={[styles.bmiScaleColor, {backgroundColor: '#2ecc71'}]} />
                                                    <View style={[styles.bmiScaleColor, {backgroundColor: '#f39c12'}]} />
                                                    <View style={[styles.bmiScaleColor, {backgroundColor: '#e74c3c'}]} />
                                                </View>
                                                <View style={[styles.bmiIndicator, {left: `${getBmiScale()}%`}]} />
                                            </View>
                                            <View style={styles.bmiLabels}>
                                                <Text style={styles.bmiScaleLabel}>15</Text>
                                                <Text style={styles.bmiScaleLabel}>25</Text>
                                                <Text style={styles.bmiScaleLabel}>35</Text>
                                            </View>
                                        </View>
                                        
                                        <View style={styles.divider} />
                                        <Text style={styles.healthTip}>{getHealthTip()}</Text>
                                    </LinearGradient>
                                </Animated.View>
                            )}

                            {bmiHistory.length > 0 && (
                                <View style={styles.historyCard}>
                                    <Text style={styles.historyTitle}>BMI History</Text>
                                    {bmiHistory.map((item, index) => (
                                        <View key={index} style={styles.historyItem}>
                                            <Text style={styles.historyDate}>{item.date}</Text>
                                            <View style={styles.historyValues}>
                                                <Text style={styles.historyBmi}>{item.bmi}</Text>
                                                <Text style={[
                                                    styles.historyCategory,
                                                    item.category === 'Underweight' && styles.underweightText,
                                                    item.category === 'Normal weight' && styles.normalText,
                                                    item.category === 'Overweight' && styles.overweightText,
                                                    item.category === 'Obese' && styles.obeseText,
                                                ]}>
                                                    {item.category}
                                                </Text>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            )}
                            
                            <View style={styles.footer}>
                                <Text style={styles.disclaimer}>
                                    Disclaimer: BMI is not a diagnostic tool. Consult healthcare professionals for proper evaluation.
                                </Text>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    subtitle: {
        fontSize: 16,
        color: '#7f8c8d',
        marginTop: 4,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        marginBottom: 20,
    },
    explanationCard: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    explanationTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
        color: '#2c3e50',
    },
    explanationText: {
        fontSize: 14,
        color: '#34495e',
        lineHeight: 20,
        marginBottom: 10,
    },
    bmiRanges: {
        marginTop: 10,
    },
    bmiRange: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    colorIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    bmiRangeText: {
        fontSize: 13,
        color: '#34495e',
    },
    toggleSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    toggleLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#34495e',
    },
    toggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    toggleText: {
        marginHorizontal: 10,
        fontSize: 15,
        color: '#95a5a6',
    },
    activeToggleText: {
        color: '#3498db',
        fontWeight: '600',
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '600',
        marginBottom: 12,
        color: '#34495e',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        marginBottom: 20,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#ecf0f1',
    },
    rowInputs: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    input: {
        flex: 1,
        padding: 14,
        fontSize: 16,
        color: '#2c3e50',
        marginLeft: 8,
    },
    unitText: {
        fontSize: 16,
        color: '#95a5a6',
        fontWeight: '500',
    },
    errorText: {
        color: '#e74c3c',
        marginBottom: 15,
        fontSize: 14,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    button: {
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    resetButton: {
        backgroundColor: '#ecf0f1',
        flex: 1,
        marginRight: 10,
    },
    resetButtonText: {
        color: '#7f8c8d',
        fontSize: 16,
        fontWeight: '600',
    },
    calculateButton: {
        backgroundColor: '#3498db',
        flex: 1,
    },
    calculateButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    resultCard: {
        marginBottom: 20,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 8,
    },
    resultGradient: {
        padding: 20,
        alignItems: 'center',
    },
    resultTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
        marginBottom: 5,
    },
    bmiValue: {
        fontSize: 48,
        fontWeight: 'bold',
        color: 'white',
    },
    bmiCategory: {
        fontSize: 20,
        color: 'white',
        marginTop: 5,
        fontWeight: '500',
    },
    bmiScaleContainer: {
        width: '100%',
        marginTop: 15,
    },
    bmiScale: {
        height: 12,
        width: '100%',
        borderRadius: 6,
        position: 'relative',
        marginBottom: 5,
        overflow: 'hidden',
    },
    bmiScaleColors: {
        flexDirection: 'row',
        height: '100%',
    },
    bmiScaleColor: {
        flex: 1,
        height: '100%',
    },
    bmiIndicator: {
        position: 'absolute',
        width: 12,
        height: 24,
        backgroundColor: 'white',
        borderRadius: 6,
        top: -6,
        marginLeft: -6,
        elevation: 2,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    bmiLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    bmiScaleLabel: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 12,
    },
    divider: {
        height: 1,
        width: '80%',
        backgroundColor: 'rgba(255,255,255,0.3)',
        marginVertical: 16,
    },
    healthTip: {
        fontSize: 14,
        color: 'white',
        textAlign: 'center',
        paddingHorizontal: 10,
        lineHeight: 20,
    },
    historyCard: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    historyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 15,
    },
    historyItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ecf0f1',
    },
    historyDate: {
        fontSize: 14,
        color: '#7f8c8d',
    },
    historyValues: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    historyBmi: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2c3e50',
        marginRight: 10,
    },
    historyCategory: {
        fontSize: 14,
        fontWeight: '500',
    },
    underweightText: {
        color: '#3498db',
    },
    normalText: {
        color: '#2ecc71',
    },
    overweightText: {
        color: '#f39c12',
    },
    obeseText: {
        color: '#e74c3c',
    },
    footer: {
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    backButton: {
        position: 'absolute',
        left: 5,
        top: 3,
        zIndex: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        padding: 8,
        borderRadius: 50,
    },
    disclaimer: {
        fontSize: 13,
        color: '#7f8c8d',
        textAlign: 'center',
        marginTop:10
    },
    infoButton: {
        borderRadius: 50,
        backgroundColor: 'rgb(236, 240, 241)',
        position: 'absolute',
        right: 5,
        top: 5,
        zIndex: 10,
        padding: 8,
    }
});

export default BMICalculator;