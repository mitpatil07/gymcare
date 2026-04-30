import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Heart, User, Clock, Activity, HelpCircle } from 'lucide-react-native';
import { View, ActivityIndicator } from 'react-native';

// Firebase
import { auth, db } from './src/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import MonitoringScreen from './src/screens/MonitoringScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import EmergencyScreen from './src/screens/EmergencyScreen';
import HelpScreen from './src/screens/HelpScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const COLORS = {
  primary: '#6200EE',
  background: '#F8F9FA',
  card: '#FFFFFF',
  text: '#121212',
  lightText: '#666666',
  border: '#EEEEEE',
  red: '#FF5252',
  green: '#4CAF50',
  orange: '#FF9800',
  blue: '#2196F3'
};

const MainTabs = ({ userData, setUserData, history }) => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarStyle: { backgroundColor: COLORS.card, height: 70, paddingBottom: 12, paddingTop: 8 },
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.lightText,
      headerStyle: { backgroundColor: COLORS.card, elevation: 0 },
      headerTintColor: COLORS.text,
      tabBarIcon: ({ color, size }) => {
        if (route.name === 'Monitoring') return <Activity size={size} color={color} />;
        if (route.name === 'History') return <Clock size={size} color={color} />;
        if (route.name === 'Help') return <HelpCircle size={size} color={color} />;
        if (route.name === 'Profile') return <User size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Monitoring" options={{ title: 'Live Vitals' }}>
      {props => <MonitoringScreen {...props} user={userData} colors={COLORS} />}
    </Tab.Screen>
    <Tab.Screen name="History" options={{ title: 'Logs' }}>
      {props => <HistoryScreen {...props} history={history} colors={COLORS} />}
    </Tab.Screen>
    <Tab.Screen name="Help" component={HelpScreen} />
    <Tab.Screen name="Profile">
      {props => <ProfileScreen {...props} user={userData} onUpdate={setUserData} colors={COLORS} />}
    </Tab.Screen>
  </Tab.Navigator>
);

const App = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Listen for Auth State Changes (Auto-Login)
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
    // 2. Fetch User Data from Firestore if logged in
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

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: COLORS.card }, headerTintColor: COLORS.text }}>
        {!user ? (
          <Stack.Screen name="Login" options={{ headerShown: false }}>
            {props => <LoginScreen {...props} onLogin={() => {}} colors={COLORS} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Main" options={{ headerShown: false }}>
              {props => <MainTabs userData={userData || {}} setUserData={setUserData} history={[]} />}
            </Stack.Screen>
            <Stack.Screen name="Emergency" component={EmergencyScreen} options={{ title: 'Emergency Hub' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
