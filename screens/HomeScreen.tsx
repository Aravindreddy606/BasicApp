import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Button,
    Image,
    StatusBar,
    Dimensions,
    Animated,
    Alert
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation, route }) => {
    const { name } = route.params || { name: 'User' };
    const [greeting, setGreeting] = useState('');
    const [fadeAnim] = useState(new Animated.Value(0));
    const [moveAnim] = useState(new Animated.Value(20));
    const [currentTip, setCurrentTip] = useState('');


    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good morning');
        else if (hour < 18) setGreeting('Good afternoon');
        else setGreeting('Good evening');

        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(moveAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    const staticTips = [
        "Drinking water before meals can help reduce overall calorie intake.",
        "Drink plenty of water throughout the day.",
        "Get at least 7-8 hours of sleep every night.",
        "Exercise for 30 minutes, 5 times a week.",
        "Take deep breaths to reduce stress.",
        "Eat more fruits and vegetables.",
        "Limit your intake of processed foods.",
        "Stretch your body daily to improve flexibility.",
        "Spend time in nature to recharge your mind.",
        "Avoid screen time at least 1 hour before bed.",
        "Practice gratitude every morning."
    ];

      

        useEffect(() => {
            setRandomTip();
        }, []);

        const setRandomTip = () => {
            const randomIndex = Math.floor(Math.random() * staticTips.length);
            const selectedTip = staticTips[randomIndex];
            setCurrentTip(selectedTip);
        };


    //const navigateToTool = (toolName, toolId) => {
    //    const screenMappings = {
    //        1: 'BMICalculator',
    //        2: 'BodyFatCalculator',
    //        3: 'ActivityTracker',
    //        4: 'NutritionPlanner',
    //        5: 'SleepAnalysis',
    //        6: 'Community'
    //    };

    //    const screenName = screenMappings[toolId] || 'NotImplemented';
    //    navigation.navigate(screenName, { fromHome: true });
    //};

    const handleComingSoonAlert = () => {
        Alert.alert(
            "Test App Notice",
            "This feature is not available yet.\nYou're currently using a test version of the app.",
            [{ text: "OK", style: "default" }]
        );
    };

    const navigateToTool = (toolName, toolId) => {
        if (toolId === 1 || toolId === 2 || toolId === 3) {
            const screenMappings = {
                1: 'BMICalculator',
                2: 'BodyFatCalculator',
                3: 'MeditationBreathing',
            };
            const screenName = screenMappings[toolId];
            navigation.navigate(screenName, { fromHome: true });
        } else {
            handleComingSoonAlert();
        }
    };



    //const healthStats = [
    //    { label: 'Steps', value: '6,240', icon: 'shoe-print', color: '#42A5F5' },
    //    { label: 'Calories', value: '1,850', icon: 'fire', color: '#FF7043' },
    //    { label: 'Water', value: '4/8', icon: 'cup-water', color: '#29B6F6' },
    //    { label: 'Sleep', value: '7.5h', icon: 'power-sleep', color: '#7E57C2' }
    //];

    const healthTools = [
        { id: 1, title: 'BMI Calculator', iconName: 'scale-bathroom', color: '#E8F5E9', iconColor: '#4CAF50', description: 'Check your body mass index' },
        { id: 2, title: 'BFP Calculator', iconName: 'scale', color: '#FFEBEE', iconColor: '#F44336', description: 'Check your body fat percentage' },
        { id: 3, title: 'Mindful Breathing', iconName: 'meditation', color: '#E3F2FD', iconColor: '#2196F3', description: 'Find your calm' },
        { id: 4, title: 'Nutrition Plan', iconName: 'food-apple', color: '#FFF3E0', iconColor: '#FF9800', description: 'Plan balanced meals' },
        { id: 5, title: 'Sleep Analysis', iconName: 'sleep', color: '#F3E5F5', iconColor: '#9C27B0', description: 'Improve sleep quality' },
        { id: 6, title: 'Community', iconName: 'account-group', color: '#ECEFF1', iconColor: '#607D8B', description: 'Connect with others' },
    ];

   
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#5000cc" barStyle="light-content" />

            <View style={styles.header}>
                <View>
                    <Animated.Text style={[styles.greetingText, { opacity: fadeAnim, transform: [{ translateY: moveAnim }] }]}>
                        {greeting},
                    </Animated.Text>
                    <Animated.Text style={[styles.nameText, { opacity: fadeAnim, transform: [{ translateY: moveAnim }] }]}>
                        {name}
                    </Animated.Text>
                </View>
                <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('ProfileScreen')}>
                    <MaterialCommunityIcons name="account-circle" size={42} color="white" />
                </TouchableOpacity>
            </View>

            <View style={styles.quickStatsContainer}>
                {/*{healthStats.map((stat, index) => (*/}
                {/*    <View key={index} style={styles.statItem}>*/}
                {/*        <MaterialCommunityIcons name={stat.icon} size={24} color={stat.color} />*/}
                {/*        <Text style={styles.statValue}>{stat.value}</Text>*/}
                {/*        <Text style={styles.statLabel}>{stat.label}</Text>*/}
                {/*    </View>*/}
                {/*))}*/}

                <View style={styles.tipIconContainer}>
                    <MaterialCommunityIcons name="lightbulb-on" size={22} color="#FFC107" />
                </View>
                <View style={styles.tipTextContainer}>
                    <Text style={styles.tipTitle}>Daily Tip</Text>
                    <Text style={styles.tipText}>{currentTip}</Text>
                </View>
            </View>

            <View style={styles.contentContainer}>
                {/*<View style={styles.tipContainer}>*/}
                {/*    <View style={styles.tipIconContainer}>*/}
                {/*        <MaterialCommunityIcons name="lightbulb-on" size={22} color="#FFC107" />*/}
                {/*    </View>*/}
                {/*    <View style={styles.tipTextContainer}>*/}
                {/*        <Text style={styles.tipTitle}>Daily Tip</Text>*/}
                {/*        <Text style={styles.tipText}>Drinking water before meals can help reduce overall calorie intake.</Text>*/}
                {/*    </View>*/}
                {/*</View>*/}

                <Text style={styles.sectionTitle}>Health Tools</Text>

                <ScrollView style={styles.toolsContainer} showsVerticalScrollIndicator={false}>
                    <View style={styles.toolsGrid}>
                        {healthTools.map((tool) => (
                            <TouchableOpacity
                                key={tool.id}
                                style={[styles.toolCard, { backgroundColor: tool.color }]}
                                onPress={() => navigateToTool(tool.title, tool.id)}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.iconContainer, { backgroundColor: `${tool.iconColor}20` }]}>
                                    <MaterialCommunityIcons name={tool.iconName} size={28} color={tool.iconColor} />
                                </View>
                                <Text style={styles.toolTitle}>{tool.title}</Text>
                                <Text style={styles.toolDescription}>{tool.description}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                </ScrollView>
            </View>

            {/* Bottom Navigation */}
            {/*<View style={styles.bottomNav}>*/}
            {/*    <TouchableOpacity style={styles.navItem}>*/}
            {/*        <MaterialCommunityIcons name="home" size={26} color="#6200ee" />*/}
            {/*        <Text style={[styles.navText, { color: '#6200ee' }]}>Home</Text>*/}
            {/*    </TouchableOpacity>*/}
            {/*    <TouchableOpacity style={styles.navItem}>*/}
            {/*        <MaterialCommunityIcons name="chart-line" size={26} color="#757575" />*/}
            {/*        <Text style={styles.navText}>Reports</Text>*/}
            {/*    </TouchableOpacity>*/}
            {/*    <TouchableOpacity style={styles.navItem}>*/}
            {/*        <MaterialCommunityIcons name="calendar-check" size={26} color="#757575" />*/}
            {/*        <Text style={styles.navText}>Plans</Text>*/}
            {/*    </TouchableOpacity>*/}
            {/*    <TouchableOpacity style={styles.navItem}>*/}
            {/*        <MaterialCommunityIcons name="cog" size={26} color="#757575" />*/}
            {/*        <Text style={styles.navText}>Settings</Text>*/}
            {/*    </TouchableOpacity>*/}
            {/*</View>*/}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 20,
        backgroundColor: '#6200ee',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    greetingText: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    nameText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom:12
    },
    profileButton: {
        padding: 5,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    quickStatsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        borderRadius: 15,
        marginHorizontal: 16,
        padding: 15,
        marginTop: -25,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    statItem: {
        alignItems: 'center',
        width: '23%',
    },
    statValue: {
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 4,
    },
    statLabel: {
        color: '#757575',
        fontSize: 12,
        marginTop: 2,
    },
    tipContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 15,
        marginVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    tipIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF9C4',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    tipTextContainer: {
        flex: 1,
    },
    tipTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
        color: '#212121',
    },
    tipText: {
        color: '#616161',
        fontSize: 14,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#212121',
        marginTop:15
    },
    toolsContainer: {
        flex: 1,
    },
    toolsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    toolCard: {
        width: '48%',
        padding: 16,
        borderRadius: 15,
        marginBottom: 16,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    toolTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#212121',
        marginBottom: 4,
    },
    toolDescription: {
        fontSize: 12,
        color: '#757575',
    },
    premiumBanner: {
        backgroundColor: '#6200ee',
        borderRadius: 15,
        padding: 16,
        marginVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    premiumContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    premiumTextContainer: {
        marginLeft: 12,
    },
    premiumTitle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    premiumDescription: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 12,
        width: width * 0.55,
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'white',
        paddingVertical: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 5,
    },
    navText: {
        fontSize: 12,
        marginTop: 2,
        color: '#757575',
    },
});

export default HomeScreen;