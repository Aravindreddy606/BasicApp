import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Vibration,
    SafeAreaView,
    StatusBar,
    Alert,
    Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

const MeditationBreathing = ({ navigation }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [breathCycle, setBreathCycle] = useState(0);
    const [sessionDuration, setSessionDuration] = useState(5);
    const [remainingTime, setRemainingTime] = useState(sessionDuration * 60);
    const [completedCycles, setCompletedCycles] = useState(0);
    const [showTips, setShowTips] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    // Animation references
    const scaleValue = useRef(new Animated.Value(1)).current;
    const opacityValue = useRef(new Animated.Value(1)).current;
    const circleScale = useRef(new Animated.Value(0.8)).current;
    const backgroundColorAnim = useRef(new Animated.Value(0)).current;

    // Timer references
    const timerRef = useRef(null);
    const cycleRef = useRef(null);
    const breathAnimationRef = useRef(null);

    const instructions = [
        'Inhale deeply\nThrough your nose',
        'Hold your breath\nFeel the stillness',
        'Exhale slowly\nRelease tension',
        'Rest\nPrepare for next cycle'
    ];

    const breathColors = [
        ['#4facfe', '#00f2fe'],   // Blue gradient for inhale
        ['#a18cd1', '#fbc2eb'],   // Purple gradient for hold
        ['#ff9a9e', '#fad0c4'],   // Soft red gradient for exhale
        ['#2c3e50', '#4c669f'],   // Dark blue gradient for rest
    ];

    const durationOptions = [3, 5, 10, 15, 20];
    const breathingTips = [
        'Focus on the sensation of air entering your nostrils',
        'Let your abdomen expand as you breathe in',
        'Breathe out through your mouth gently',
        'Try to make each exhalation longer than inhalation',
        'If your mind wanders, gently bring it back to your breath'
    ];

    useEffect(() => {
        setRemainingTime(sessionDuration * 60);
        return () => {
            clearInterval(timerRef.current);
            clearInterval(cycleRef.current);
            if (breathAnimationRef.current) {
                breathAnimationRef.current.stop();
            }
        };
    }, [sessionDuration]);

    useEffect(() => {
        if (isPlaying && !isPaused) {
            startBreathingAnimation();
            startTimers();
        } else {
            stopAll();
        }

        return () => {
            stopAll();
        };
    }, [isPlaying, isPaused]);

    const startBreathingAnimation = () => {
        // More dynamic breathing animation
        const breathAnimation = Animated.loop(
            Animated.sequence([
                // Inhale (4 seconds)
                Animated.parallel([
                    Animated.timing(scaleValue, {
                        toValue: 1.5,
                        duration: 4000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(circleScale, {
                        toValue: 1.2,
                        duration: 4000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacityValue, {
                        toValue: 0.8,
                        duration: 4000,
                        useNativeDriver: true,
                    })
                ]),
                // Hold (2 seconds)
                Animated.delay(2000),
                // Exhale (4 seconds)
                Animated.parallel([
                    Animated.timing(scaleValue, {
                        toValue: 1,
                        duration: 4000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(circleScale, {
                        toValue: 0.8,
                        duration: 4000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacityValue, {
                        toValue: 1,
                        duration: 4000,
                        useNativeDriver: true,
                    })
                ]),
                // Rest (2 seconds)
                Animated.delay(2000)
            ])
        );

        breathAnimationRef.current = breathAnimation;
        breathAnimation.start();
    };

    const startTimers = () => {
        // Breath cycle updates - full cycle is 12 seconds (4s inhale, 2s hold, 4s exhale, 2s rest)
        const cycleDurations = [4000, 2000, 4000, 2000]; // durations for each phase
        let currentCycleIndex = breathCycle;
        let accumulatedTime = 0;

        cycleRef.current = setInterval(() => {
            currentCycleIndex = (currentCycleIndex + 1) % 4;
            setBreathCycle(currentCycleIndex);

            // Count completed breath cycles
            if (currentCycleIndex === 0) {
                setCompletedCycles(prev => prev + 1);
                // Gentle vibration feedback on cycle completion
                Vibration.vibrate(100);
            }
        }, cycleDurations[currentCycleIndex]);

        // Timer updates
        timerRef.current = setInterval(() => {
            setRemainingTime(prev => {
                const newTime = prev - 1;
                if (newTime <= 0) {
                    sessionComplete();
                    return 0;
                }
                return newTime;
            });
        }, 1000);
    };

    const sessionComplete = () => {
        // More noticeable pattern for session completion
        Vibration.vibrate([0, 500, 200, 500, 200, 500]);

        stopAll();
        Alert.alert(
            'Session Complete',
            `Congratulations! You've completed ${completedCycles} breath cycles.`,
            [{ text: 'OK', onPress: resetSession }]
        );
    };

    const stopAll = () => {
        clearInterval(timerRef.current);
        clearInterval(cycleRef.current);
        if (breathAnimationRef.current) {
            breathAnimationRef.current.stop();
        }
    };

    const toggleSession = () => {
        if (!isPlaying) {
            // Starting new session
            setIsPlaying(true);
            setIsPaused(false);
            setBreathCycle(0);
            setCompletedCycles(0);
            if (remainingTime === 0) {
                setRemainingTime(sessionDuration * 60);
            }
        } else {
            // Toggle between pause and resume
            setIsPaused(!isPaused);
        }
    };

    const resetSession = () => {
        setIsPlaying(false);
        setIsPaused(false);
        setBreathCycle(0);
        setCompletedCycles(0);
        setRemainingTime(sessionDuration * 60);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const getProgressPercentage = () => {
        const totalSeconds = sessionDuration * 60;
        const progress = (totalSeconds - remainingTime) / totalSeconds;
        return `${Math.round(progress * 100)}%`;
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient
             //   colors={['#141e30', '#243b55']}
                colors={['#f0f4f8', '#e6f0fa']}
                style={styles.background}
            />

            <View style={styles.headerContainer}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={22} color="white" />
                </TouchableOpacity>
                <Text style={styles.header}>Mindful Breathing</Text>
                <Text style={styles.subHeader}>Find your calm</Text>

                <TouchableOpacity
                    style={styles.infoButton}
                    onPress={() => setShowTips(!showTips)}
                >
                    <Ionicons name={showTips ? "close-circle" : "information-circle"} size={24} color="white" />
                </TouchableOpacity>
            </View>

            {showTips ? (
                <View style={styles.tipsContainer}>
                    <Text style={styles.tipsHeader}>Breathing Tips</Text>
                    {breathingTips.map((tip, index) => (
                        <View key={index} style={styles.tipItem}>
                            <FontAwesome5 name="leaf" size={14} color="#4facfe" />
                            <Text style={styles.tipText}>{tip}</Text>
                        </View>
                    ))}
                </View>
            ) : (
                <>
                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{formatTime(remainingTime)}</Text>
                            <Text style={styles.statLabel}>remaining</Text>
                        </View>

                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{completedCycles}</Text>
                            <Text style={styles.statLabel}>cycles</Text>
                        </View>

                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{getProgressPercentage()}</Text>
                            <Text style={styles.statLabel}>complete</Text>
                        </View>
                    </View>

                    <View style={styles.exerciseContainer}>
                        <Animated.View
                            style={[
                                styles.breathCircleOuter,
                                {
                                    transform: [{ scale: circleScale }],
                                }
                            ]}
                        >
                            <LinearGradient
                              colors={breathColors[breathCycle] as [string, string, ...string[]]}
                                style={styles.breathCircleGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Animated.View
                                    style={[
                                        styles.exerciseBox,
                                        {
                                            transform: [{ scale: scaleValue }],
                                            opacity: opacityValue,
                                        }
                                    ]}
                                >
                                    <Text style={styles.exerciseText}>
                                            {isPlaying ? instructions[breathCycle] : 'Press Start'}
                                    </Text>
                                </Animated.View>
                            </LinearGradient>
                        </Animated.View>
                    </View>

                    <View style={styles.durationSelector}>
                        <Text style={styles.durationLabel}>Session Duration</Text>
                        <View style={styles.durationButtons}>
                            {durationOptions.map(duration => (
                                <TouchableOpacity
                                    key={duration}
                                    style={[
                                        styles.durationButton,
                                        sessionDuration === duration && styles.selectedDuration
                                    ]}
                                    onPress={() => {
                                        if (!isPlaying) {
                                            setSessionDuration(duration);
                                            setRemainingTime(duration * 60);
                                        }
                                    }}
                                    disabled={isPlaying}
                                >
                                    <Text style={[
                                        styles.durationButtonText,
                                        sessionDuration === duration && styles.selectedDurationText
                                    ]}>
                                        {duration} min
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.controlButtons}>
                        <TouchableOpacity
                            style={[styles.resetButton, styles.buttonEnabled]}
                            onPress={resetSession}
                            disabled={!isPlaying && remainingTime === sessionDuration * 60}
                        >
                            <Ionicons name="refresh" size={22} color="white" />
                            <Text style={styles.resetButtonText}>Reset</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.button,
                                isPlaying
                                    ? (isPaused ? styles.startButton : styles.pauseButton)
                                    : styles.startButton
                            ]}
                            onPress={toggleSession}
                        >
                            <Ionicons
                                name={isPlaying ? (isPaused ? "play" : "pause") : "play"}
                                size={22}
                                color="white"
                                style={styles.buttonIcon}
                            />
                            <Text style={styles.buttonText}>
                                    {isPlaying
                                        ? (isPaused ? 'Resume' : 'Pause')
                                        : 'Start'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    headerContainer: {
        width: '100%',
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 10,
        position: 'relative'
    },
    header: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#2c3e50',
        textAlign: 'center',
        marginTop: 20
    },
    subHeader: {
        fontSize: 16,
        color: '#7f8c8d',
        marginTop: 5,
    },
    backButton: {
        position: 'absolute',
        left: 20,
        top: 20,
        zIndex: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        padding: 8,
        borderRadius: 50,
    },
    infoButton: {
        position: 'absolute',
        right: 20,
        top: 20,
        zIndex: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        padding: 8,
        borderRadius: 50,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingHorizontal: 10,
        marginTop: 20,
    },
    statItem: {
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    statValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#141e30',
    },
    statLabel: {
        fontSize: 12,
        color: '#7f8c8d',
        marginTop: 2,
    },
    exerciseContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    breathCircleOuter: {
        width: 280,
        height: 280,
        borderRadius: 140,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    breathCircleGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 140,
        justifyContent: 'center',
        alignItems: 'center',
    },
    exerciseBox: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    exerciseText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 26,
        color: '#333',
    },
    durationSelector: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    durationLabel: {
        fontSize: 16,
        color: '#7f8c8d',
        marginBottom: 10,
    },
    durationButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    durationButton: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginHorizontal: 5,
        marginBottom: 8,
        //  backgroundColor: 'rgba(255, 255, 255, 0.2)',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 20,
        minWidth: 60,
        alignItems: 'center',
    },
    selectedDuration: {
        backgroundColor: '#243b55',
    },
    durationButtonText: {
       // color: '#fff',
        color: '#243b55',
        fontWeight: '600',
    },
    selectedDurationText: {
        color: '#fff',
    },
    controlButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingHorizontal: 20,
        marginBottom: 40,
    },
    button: {
        flexDirection: 'row',
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        width: 130,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    buttonIcon: {
        marginRight: 8,
    },
    startButton: {
        backgroundColor: '#4CAF50',
    },
    pauseButton: {
        backgroundColor: '#FF9800',
    },
    resetButton: {
        flexDirection: 'row',
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        width: 130,
    },
    buttonEnabled: {
        backgroundColor: '#F44336',
        opacity: 1,
    },
    buttonDisabled: {
        backgroundColor: 'rgba(244, 67, 54, 0.5)',
        opacity: 0.7,
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
    resetButtonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 5,
    },
    // Tips section styles
    tipsContainer: {
        flex: 1,
        width: '90%',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        borderRadius: 15,
        padding: 20,
        marginVertical: 20,
    },
    tipsHeader: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 20,
        textAlign: 'center',
    },
    tipItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    tipText: {
        fontSize: 16,
        color: '#ffffff',
        marginLeft: 10,
        flex: 1,
        lineHeight: 22,
    },
});

export default MeditationBreathing;