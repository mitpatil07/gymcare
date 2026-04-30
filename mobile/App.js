import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Heart, User, Clock, Activity, HelpCircle, LayoutDashboard, Search, Home } from 'lucide-react-native';
import { View, ActivityIndicator, StyleSheet, Platform } from 'react-native';

// Firebase
import { auth, db } from './src/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import MonitoringScreen from './src/screens/MonitoringScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import EmergencyScreen from './src/screens/EmergencyScreen';
import HelpScreen from './src/screens/HelpScreen';
import SplashScreen from './src/screens/SplashScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Pastel Palette Based on Reference
const PASTEL_COLORS = {
  primary: '#111827', // Dark for active elements
  background: '#F9FAFB', // Soft white background
  card: '#FFFFFF',
  text: '#111827',
  lightText: '#6B7280',
  purple: '#D8B4FE',
  yellow: '#FEF08A',
  green: '#BBF7D0',
  blue: '#BAE6FD',
  pink: '#FBCFE8',
  pillBg: 'rgba(255, 255, 255, 0.9)',
};

const CustomTabBarIcon = ({ focused, color, IconComponent }) => {
  return (
    <View style={[
      styles.tabIconContainer,
      focused && styles.tabIconActive
    ]}>
      <IconComponent size={20} color={focused ? '#FFF' : color} />
    </View>
  );
};

const MainTabs = ({ userData, setUserData, history }) => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarShowLabel: false,
      tabBarStyle: styles.floatingTabBar,
      tabBarActiveTintColor: '#111827',
      tabBarInactiveTintColor: '#9CA3AF',
      headerStyle: { backgroundColor: PASTEL_COLORS.background, elevation: 0, shadowOpacity: 0, borderBottomWidth: 0 },
      headerTitleStyle: { display: 'none' }, // Hide default headers for clean look
      tabBarIcon: ({ focused, color }) => {
        let IconComponent = Home;
        if (route.name === 'Monitoring') IconComponent = Home;
        else if (route.name === 'History') IconComponent = Activity;
        else if (route.name === 'Help') IconComponent = Search;
        else if (route.name === 'Profile') IconComponent = User;

        return <CustomTabBarIcon focused={focused} color={color} IconComponent={IconComponent} />;
      },
    })}
  >
    <Tab.Screen name="Monitoring">
      {props => <MonitoringScreen {...props} user={userData} colors={PASTEL_COLORS} />}
    </Tab.Screen>
    <Tab.Screen name="History">
      {props => <HistoryScreen {...props} history={history} colors={PASTEL_COLORS} />}
    </Tab.Screen>
    <Tab.Screen name="Help" component={HelpScreen} />
    <Tab.Screen name="Profile">
      {props => <ProfileScreen {...props} user={userData} colors={PASTEL_COLORS} />}
    </Tab.Screen>
  </Tab.Navigator>
);

const App = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const splashTimer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(splashTimer);
  }, []);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (authenticatedUser) => {
      setUser(authenticatedUser);
      if (!authenticatedUser) {
        setUserData(null);
        setLoading(false);
      }
    });
    return unsubscribeAuth;
  }, []);

  useEffect(() => {
    let unsubscribeDoc = () => {};
    if (user) {
      const userRef = doc(db, "users", user.uid);
      unsubscribeDoc = onSnapshot(userRef, (snapshot) => {
        if (snapshot.exists()) {
          setUserData(snapshot.data());
        }
        setLoading(false);
      }, (error) => {
        console.error("Firestore error:", error);
        setLoading(false);
      });
    }
    return () => unsubscribeDoc();
  }, [user]);

  if (showSplash) return <SplashScreen colors={{ primary: '#D8B4FE' }} />;

  if (loading && user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: PASTEL_COLORS.background }}>
        <ActivityIndicator size="large" color={PASTEL_COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: PASTEL_COLORS.background, elevation: 0, shadowOpacity: 0 }, headerTintColor: PASTEL_COLORS.text }}>
        {!user ? (
          <Stack.Screen name="Login" options={{ headerShown: false }}>
            {props => <LoginScreen {...props} colors={{ primary: '#111827' }} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Main" options={{ headerShown: false }}>
              {props => <MainTabs userData={userData || {}} setUserData={setUserData} history={[]} />}
            </Stack.Screen>
            <Stack.Screen name="Emergency" component={EmergencyScreen} options={{ title: 'Emergency Hub', headerBackTitleVisible: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  floatingTabBar: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    elevation: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 40,
    height: 70,
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    paddingHorizontal: 10,
    ...Platform.select({
      web: {
        bottom: 30,
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
        left: 'auto',
        right: 'auto',
      }
    })
  },
  tabIconContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10 // Push down slightly to center vertically in the pill
  },
  tabIconActive: {
    backgroundColor: '#111827', // Dark circular background for active state like reference image
  }
});

export default App;
