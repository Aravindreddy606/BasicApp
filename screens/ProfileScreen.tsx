import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  Alert,
  StatusBar 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = ({ route, navigation }) => {
  const { name } = route.params || { name: 'User' };
  
  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive", 
          onPress: () => navigation.reset({
            index: 0,
            routes: [{ name: 'LoginScreen' }],
          })
        }
      ]
    );
    };
    const handleComingSoonAlert = () => {
        Alert.alert(
            "Test App Notice",
            "This feature is not available yet.\nYou're currently using a test version of the app.",
            [{ text: "OK", style: "default" }]
        );
    };



  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/*<View style={styles.header}>*/}
        {/*  <Text style={styles.pageTitle}>Profile</Text>*/}
        {/*  <TouchableOpacity */}
        {/*    style={styles.settingsButton}*/}
        {/*    onPress={() => navigation.navigate('Settings')}*/}
        {/*  >*/}
        {/*    <Ionicons name="settings-outline" size={24} color="#4F46E5" />*/}
        {/*  </TouchableOpacity>*/}
        {/*</View>*/}

        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarWrapper}>
              <Text style={styles.avatarText}>
                {name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)}
              </Text>
            </View>
            {/*<TouchableOpacity style={styles.editAvatarButton}>*/}
            {/*  <Ionicons name="camera-outline" size={18} color="#FFF" />*/}
            {/*</TouchableOpacity>*/}
          </View>
          
          <Text style={styles.userName}>{name}</Text>
          {/*<Text style={styles.userEmail}>{name.toLowerCase().replace(' ', '.') + '@example.com'}</Text>*/}
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.menuCard}>
                      <TouchableOpacity style={styles.menuItem} onPress={handleComingSoonAlert}>
              <View style={styles.menuIconContainer}>
                <Ionicons name="person-outline" size={20} color="#4F46E5" />
              </View>
              <Text style={styles.menuItemText}>Edit Profile</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
            
            <View style={styles.separator} />
            
                      <TouchableOpacity style={styles.menuItem} onPress={handleComingSoonAlert}>
              <View style={styles.menuIconContainer}>
                <Ionicons name="notifications-outline" size={20} color="#4F46E5" />
              </View>
              <Text style={styles.menuItemText}>Notifications</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
            
            <View style={styles.separator} />
            
                      <TouchableOpacity style={styles.menuItem} onPress={handleComingSoonAlert}>
              <View style={styles.menuIconContainer}>
                <Ionicons name="shield-outline" size={20} color="#4F46E5" />
              </View>
              <Text style={styles.menuItemText}>Privacy & Security</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.menuCard}>
                      <TouchableOpacity style={styles.menuItem} onPress={handleComingSoonAlert}>
              <View style={styles.menuIconContainer}>
                <Ionicons name="help-circle-outline" size={20} color="#4F46E5" />
              </View>
              <Text style={styles.menuItemText}>Help Center</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
            
            <View style={styles.separator} />
            
                      <TouchableOpacity style={styles.menuItem} onPress={handleComingSoonAlert}>
              <View style={styles.menuIconContainer}>
                <Ionicons name="mail-outline" size={20} color="#4F46E5" />
              </View>
              <Text style={styles.menuItemText}>Contact Us</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#EF4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        
        <Text style={styles.versionText}>App Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  settingsButton: {
    padding: 6,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4F46E5',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F9FAFB',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#6B7280',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 24,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    height: '70%',
    alignSelf: 'center',
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  menuCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginLeft: 66,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    marginTop: 10,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  versionText: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 24,
  },
});

export default ProfileScreen;